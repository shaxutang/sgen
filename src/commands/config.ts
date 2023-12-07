import { Sgenrc } from "@vcee/sgen-types";
import sgenrcEntity from "../core/sgenrc";
import { success, warn } from "../utils/log";

/**
 * Configuration options for the sgen command.
 */
export type ConfigOptions = {
  action: "list" | "set" | "remove";
  option: `${keyof Sgenrc & string}=${string}`;
};

/**
 * Handles the 'list' action for sgen configuration.
 * @param {boolean} isExists - Indicates whether the .sgenrc file exists.
 * @returns {void} - A promise that resolves after handling the 'list' action.
 */
function handleList(): void {
  success(
    [
      `${sgenrcEntity.getOsSgenrcPath()} env variables below:\n`,
      sgenrcEntity.formatSgenrc(sgenrcEntity.getOsSgenrc()),
    ].join("\n"),
  );
}

/**
 * Handles the 'set' action for sgen configuration.
 * @param {string} option - The option string to set.
 * @returns {void} - A promise that resolves after handling the 'set' action.
 */
function handleSet(option: string): void {
  if (option) {
    const [key, value] = option.split("=");
    if (!key || !value) {
      warn(
        'Please make sure you enter the correct command "sgen config set <key>=<value>"',
      );
      return;
    }
    sgenrcEntity.setFieldToOsSgenrc(key, value);
    success(`Set "${key}" to ${value}" success`);
  } else {
    warn(
      'please enter the option you want to set, like "sgen config set <key>=<value>"',
    );
  }
}

/**
 * Handles the 'remove' action for sgen configuration.
 * @param {Sgenrc} sgenrc - The current sgen configuration options.
 * @param {string} option - The option string to remove.
 * @returns {void} - A promise that resolves after handling the 'remove' action.
 */
function handleRemove(option: string): void {
  sgenrcEntity.removeFieldFromOsSgenrc(option);
  success(`removed ${option} success`);
}

/**
 * Main function for handling sgen configuration based on the provided action and option.
 * @param {SgenContext<ConfigOptions>} context - The context object containing configuration options.
 * @returns {void} - A promise that resolves after handling the sgen configuration.
 */
export default function (options: ConfigOptions): void {
  const { action, option } = options;

  action === "list" && handleList();
  action === "set" && handleSet(option);
  action === "remove" && handleRemove(option);
}
