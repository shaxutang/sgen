import { readFileSync, statSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import ejs from "ejs";
import { Frontmatter, compileEjsTemplate } from "../core/compile";
import { Dir, GENERATOR_SEPERATOR } from "../core/constans";
import { SgenDir } from "../core/directory";
import { helper } from "../core/helpers";
import prompts, { getPromptsVariables, isPrompts } from "../core/prompts";
import sgenrcEntity from "../core/sgenrc";
import { isExists } from "../utils/fs";
import { error, success, warn } from "../utils/log";

export type FileCate = "add" | "append";

export interface ProcessedFile {
  templateFileName: string;
  cate: FileCate;
  frontmatter: Frontmatter;
  content: string;
}

export const templateFileRegex =
  /(.*)\.(?:append|add)\.t|prompts\.(?:yml|yaml)\b/;

/**
 * Async function for handling add operations.
 * @param {ProcessedFile}  - An object containing information about the processed file.
 */
async function handleAdd({ frontmatter, content }: ProcessedFile) {
  const { to } = frontmatter;
  // If the specified file path does not exist, create an empty file
  if (!(await isExists(to))) {
    await writeFile(to, "", "utf-8");
  } else {
    // If the specified file path already exists, display a confirmation dialog
    const isOvewrite = (
      await prompts({
        type: "confirm",
        name: "isOvewrite",
        initial: false,
        message: chalk.red(
          `File \`${to}\` already exists, do you want to overwrite it?`,
        ),
      })
    ).isOvewrite;

    // If the user chooses not to overwrite, return directly
    if (!isOvewrite) {
      return;
    }
  }
  // Write the content to the specified file
  await writeFile(to, content, "utf-8");
}

/**
 * Handle the append operation asynchronously.
 * @param {ProcessedFile}  - An object containing information about the processed file.
 */
async function handleAppend({
  frontmatter,
  content,
  templateFileName,
}: ProcessedFile) {
  const { to, pattern } = frontmatter;

  if (!pattern) {
    warn(
      `SGEN don't append, Please make sure you define "pattern" in [${templateFileName}] frontmatter`,
    );
    return;
  }

  // If the target file does not exist, write the pattern and content to the file.
  if (!(await isExists(to))) {
    await writeFile(to, [pattern, `${content}`].join("\n"), "utf-8");
    return;
  }

  // Read the contents of the target file.
  const raw = await readFile(to, "utf-8");

  // Create a regular expression to match the pattern.
  const dynamicPattern = new RegExp(pattern);

  // Check if the pattern exists in the target file.
  const match = raw.match(dynamicPattern);

  // If the pattern exists, append the content after the pattern in the target file.
  if (match) {
    const endPoint = match.index! + pattern.length;
    const before = raw.substring(0, endPoint);
    const after = raw.substring(endPoint);
    await writeFile(to, [before, `${content}`, after].join(""), "utf-8");
  } else {
    // If the pattern does not exist, display a warning message.
    warn(`Please add the following code to the "${to}":\n\n${pattern}`);
  }
}

/**
 * Generate files based on the specified template and name.
 */
export default async function () {
  // Get the configuration from .sgenrc file
  const sgenrc = sgenrcEntity.getSgenrc();

  const sgenDir = new SgenDir(Dir.GENERATOR);

  // Get a list of template choices
  const allDirs = sgenDir.getAllDirs();

  // If no templates are available, show a warning and exit
  if (!allDirs.length) {
    warn(
      "There is no template to choose from. \n\nPlease create a template in the .sgen/templates directory.",
    );
    process.exit(1);
  }

  const { template } = await prompts({
    type: "select",
    name: "template",
    message: "Please select a template to generate",
    choices: sgenDir.getAllDirChoices(),
  });

  // Get a list of files in the selected template directory
  const files = (await readdir(template)).filter(
    (item) =>
      statSync(join(template, item)).isFile() && templateFileRegex.test(item),
  );

  if (!files.length) {
    warn("There are no files could be generate under the current template.");
    process.exit(1);
  }

  // variables required by the template
  const variables = await (async (defaultVars) => {
    const promptsYamlFileName = files.find(isPrompts);

    if (promptsYamlFileName) {
      const promptsYamlPath = join(template, promptsYamlFileName);
      const propmtsVaribales = await getPromptsVariables(promptsYamlPath);
      return {
        ...defaultVars,
        ...propmtsVaribales,
      };
    }
    return defaultVars;
  })({ sgenrc, s: helper });

  // Process each file in the template
  const processFiles = files
    // filter out prompts files
    .filter((item) => !isPrompts(item))
    .map((file) => {
      const split = file.split(".");
      const cate: FileCate = split[split.length - 2] as FileCate;
      const path = join(template, file);

      // Read the raw content of the file
      const raw = readFileSync(path, "utf-8");

      const spiltRaw = raw.split(GENERATOR_SEPERATOR);

      const processFiles = spiltRaw
        // ejs render
        .map((_raw) => compileEjsTemplate(ejs.render(_raw, variables)))
        // filter out undefine result
        .filter((compile) => !!compile)
        // generate process file
        .map((compile) => ({
          templateFileName: file,
          cate,
          frontmatter: compile?.frontmatter,
          content: compile?.content,
        }));

      return processFiles;
    })
    .reduce((p1, p2) => [...p1, ...p2], [])
    // filter out invalid file
    .filter((processFile) => {
      if (!!processFile.frontmatter && !!processFile.content) {
        return true;
      }
      warn(`The file "${processFile.templateFileName}" content is not valid.`);
    })
    .map((processFile) => processFile as ProcessedFile);

  // Process each file
  for (const processFile of processFiles) {
    const { frontmatter, cate } = processFile;
    try {
      if (!frontmatter?.to) {
        continue;
      }

      const { to } = frontmatter;
      const toDir = to.substring(0, to.lastIndexOf("/"));

      // Create the necessary directories if they don't exist
      if (!(await isExists(toDir))) {
        await mkdir(to.substring(0, to.lastIndexOf("/")), { recursive: true });
      }

      // Handle 'add' category
      if (cate === "add") {
        await handleAdd(processFile);
      }

      // Handle 'append' category
      if (cate === "append") {
        await handleAppend(processFile);
      }
    } catch (err) {
      error(err);
    }
  }

  success("Generate success!!!");
}
