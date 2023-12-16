import { readFile } from "fs/promises";
import yaml from "js-yaml";
import prompts from "prompts";

export const matchPromtsFileRegExp = /prompts.(yml|yaml)$/;

/**
 * Determine whether the given file name ends with "prompts.(yml|yaml$"
 * @param {string} fileName file name
 * @returns {boolean} If the file name ends with "prompts.(yml|yaml$", return true, otherwise return false
 */
export function isPrompts(fileName: string): boolean {
  return matchPromtsFileRegExp.test(fileName);
}

/**
 * Async function to get prompt variables.
 * @returns {Record<string,any>} A object containing the variables.
 */
export async function getPromptsVariables(
  path: string,
): Promise<Record<string, any>> {
  // Read the YAML content of the prompt variables file
  const promptsYaml = await readFile(path);
  // Parse the YAML file and cast it to the TemplateVariablePropmt type
  const promptTemplates = Object.entries(
    yaml.load(promptsYaml.toString()) as Exclude<
      prompts.PromptObject<any>,
      "name"
    >,
  ).map(
    ([field, { type, ...rest }]) =>
      ({
        name: field,
        type: type ?? "text",
        ...rest,
      }) as prompts.PromptObject,
  );

  return await defaultPrompts(promptTemplates);
}

export default async function defaultPrompts<T extends string = string>(
  questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>,
  options?: prompts.Options,
) {
  return prompts(questions, {
    onCancel() {
      process.exit(1);
    },
    ...options,
  });
}

export type Question<T extends string = string> =
  | prompts.PromptObject<T>
  | Array<prompts.PromptObject<T>>;
