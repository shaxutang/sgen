import { statSync } from "node:fs";
import { readdir, mkdir, constants } from "node:fs/promises";
import { join, basename } from "node:path";
import ejs from "ejs";
import copy from "recursive-copy";
import through2 from "through2";
import { Dir } from "../core/constans";
import { SgenDir } from "../core/directory";
import { helper } from "../core/helpers";
import prompts, { getPromptsVariables, isPrompts } from "../core/prompts";
import sgenrcEntity from "../core/sgenrc";
import { SgenContext } from "../type";
import { isExists } from "../utils/fs";
import { success, error, warn } from "../utils/log";

export type CreateOptions = {
  name: string;
  template: string;
};

/**
 * Create a new project based on user input and options.
 * @param {SgenContext<Partial<CreateOptions>>} context - Sgen context containing options.
 */
export default async function (context: SgenContext<Partial<CreateOptions>>) {
  const { options } = context;

  const sgenrc = sgenrcEntity.getOsSgenrc();

  const sgenDir = new SgenDir(Dir.CREATOR);

  const allDirs = sgenDir.getAllDirs();

  if (!allDirs.length) {
    warn("template dir is empty.");
    process.exit(1);
  }

  /**
   * Prompt the user to select a project template directory.
   * @returns {Promise<string>} - Promise resolving to the selected directory path.
   */
  async function selectDirPrompt(): Promise<string> {
    return (
      await prompts({
        name: "template",
        type: "select",
        message: "Please select a template.",
        choices: sgenDir.getAllDirChoices(),
      })
    ).template;
  }

  // If the template option is provided, use it; otherwise, prompt the user
  const sourceDir = await (async () => {
    let dir = options?.template
      ? // If all available directories contain the same name, use the one with higher priority.
        allDirs.find((dir) => dir.name === options.template)?.value!
      : await selectDirPrompt();

    // Check if the selected template directory exists
    if (!(await isExists(dir))) {
      warn("The template is not found, please select an existing template.");
      dir = await selectDirPrompt();
    }
    return dir;
  })();

  // Get the project name or directory from options or user input
  const projectNameOrDir: string =
    options?.name ||
    (
      await prompts({
        type: "text",
        name: "name",
        message: "Please enter a name for your project.",
        initial: basename(sourceDir),
        validate(value: string) {
          return !!value;
        },
      })
    ).name;

  // Get a list of files in the selected template directory
  const sourceDirFiles = (await readdir(sourceDir)).filter((item) =>
    statSync(join(sourceDir, item)).isFile(),
  );

  // variables required by the template
  const variables = await (async (defaultVars) => {
    const promptsYamlFileName = sourceDirFiles.find(isPrompts);

    if (promptsYamlFileName) {
      const promptsYamlPath = join(sourceDir, promptsYamlFileName);
      const propmtsVaribales = await getPromptsVariables(promptsYamlPath);

      return {
        ...defaultVars,
        ...propmtsVaribales,
      };
    }
    return defaultVars;
  })({ sgenrc, s: helper, name: projectNameOrDir });

  // Define the target directory path for the new project
  const targetDir = join(process.cwd(), variables.name);

  // Create the target directory if it doesn't exist
  if (!(await isExists(targetDir, constants.O_DIRECTORY))) {
    await mkdir(targetDir, { recursive: true });
  }

  // Check if the target directory is not empty
  const files = await readdir(targetDir);
  if (files.length > 0) {
    error(`Dir \`${targetDir}\` is not empty.`);
    process.exit(1);
  }

  // Copy files from the source directory to the target directory
  await copy(sourceDir, targetDir, {
    dot: true,
    filter: /^(?!.*(?:node_modules|prompts\.ya?ml)).*$/,
    transform() {
      return through2(function (
        chunk: Buffer,
        _enc: any,
        done: (arg0: null, arg1: any) => void,
      ) {
        // Use ejs to render the content with specific variables
        const output = ejs.render(chunk.toString(), {
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
