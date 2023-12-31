import { statSync } from "node:fs";
import { readdir, mkdir, constants } from "node:fs/promises";
import { join, basename } from "node:path";
import copy from "recursive-copy";
import through2 from "through2";
import { render } from "../core/compile";
import { Dir } from "../core/constans";
import { Directory } from "../core/directory";
import prompts, {
  Question,
  getPromptsVariables,
  isPrompts,
} from "../core/prompts";
import { isExists } from "../utils/fs";
import { success, error, warn } from "../utils/log";

/**
 * Create a new project based on user input and options.
 */
export default async function () {
  const sgenDir = new Directory(Dir.CREATOR);

  const allDirs = sgenDir.getAllDirs();

  if (!allDirs.length) {
    warn(
      `There is no template to choose from. \n\nPlease create a template in the .sgen/${Dir.CREATOR} directory.`,
    );
    process.exit(1);
  }

  const questions: Question = [
    {
      type: "select",
      name: "template",
      message: "Please select a template.",
      choices: sgenDir.getAllDirChoices(),
      validate(value: string) {
        return !!value;
      },
    },
    {
      type: "text",
      name: "name",
      message: "Please enter a name for your project.",
      initial: "my-project",
      validate(value: string) {
        return !!value;
      },
    },
  ];

  const { template, name } = await prompts(questions);

  // Get a list of files in the selected template directory
  const sourceDirFiles = (await readdir(template)).filter((item) =>
    statSync(join(template, item)).isFile(),
  );

  // variables required by the template
  const variables = await (async (defaultVariables) => {
    const promptsYamlFileName = sourceDirFiles.find(isPrompts);

    if (promptsYamlFileName) {
      const promptsYamlPath = join(template, promptsYamlFileName);
      const propmtsVaribales = await getPromptsVariables(promptsYamlPath);

      return {
        ...defaultVariables,
        ...propmtsVaribales,
      };
    }
    return defaultVariables;
  })({ name });

  // Define the target directory path for the new project
  const targetDir = join(process.cwd(), variables.name);

  // Create the target directory if it doesn't exist
  if (!(await isExists(targetDir, constants.O_DIRECTORY))) {
    await mkdir(targetDir, { recursive: true });
  }

  // Check if the target directory is not empty
  const files = await readdir(targetDir);
  if (files.length > 0) {
    error(`\`${targetDir}\` is not empty.`);
    process.exit(1);
  }

  // Copy files from the source directory to the target directory
  await copy(template, targetDir, {
    dot: true,
    filter: createRegexForExcludedPaths(["node_modules"]),
    transform(src) {
      return through2(function (
        chunk: Buffer,
        _enc: any,
        done: (arg0: null, arg1: any) => void,
      ) {
        // ignore .sgen dir
        if (!createRegexForExcludedPaths([join(template, ".sgen")]).test(src)) {
          done(null, chunk);
          return;
        }
        // Use ejs to render the content with specific variables
        const output = render(chunk.toString(), {
          ...variables,
          name: basename(variables.name),
        });
        done(null, output);
      });
    },
  });

  success(
    [
      "Create complete!",
      `\`code ${variables.name}\` to open it in Vscode!`,
    ].join("\n"),
  );
}

function createRegexForExcludedPaths(paths: string[]) {
  const escapedPaths = paths.map((path) =>
    path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regexString = `^(?!${escapedPaths.join("|")}).*`;
  const regex = new RegExp(regexString, "i");
  return regex;
}
