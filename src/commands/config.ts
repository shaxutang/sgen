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
function handleList(isExists: boolean): void {
  if (!isExists) {
    warn(`${sgenrcEntity.getOsSgenrcPath()} does not exist`);
    return;
  }
  success(
    [
      `${sgenrcEntity.getOsSgenrcPath()} env variables below:\n`,
      sgenrcEntity.formatSgenrc(sgenrcEntity.getOsSgenrc()),
    ].join("\n"),
  );
}

/**
 * Handles the 'set' action for sgen configuration.
 * @param {Sgenrc} sgenrc - The current sgen configuration options.
 * @param {string} option - The option string to set.
 * @returns {void} - A promise that resolves after handling the 'set' action.
 */
function handleSet(sgenrc: Sgenrc, option: string): void {
  if (option) {
    const [key, value] = option.split("=");
    sgenrc[key] = value;
    sgenrcEntity.writeOsSgenrc(sgenrc);
    success(`Set "${key}" to ${value} success`);
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
function handleRemove(sgenrc: Sgenrc, option: string): void {
  delete sgenrc?.[option];
  sgenrcEntity.writeOsSgenrc(sgenrc);
  success(`removed ${option} success`);
}

/**
 * Main function for handling sgen configuration based on the provided action and option.
 * @param {SgenContext<ConfigOptions>} context - The context object containing configuration options.
 * @returns {void} - A promise that resolves after handling the sgen configuration.
 */
export default function (options: ConfigOptions): void {
  const { action, option } = options;
  const isExists = sgenrcEntity.osSgenrcExits();
  const sgenrc = sgenrcEntity.getOsSgenrc();

  action === "list" && handleList(isExists);
  action === "set" && handleSet(sgenrc, option);
  action === "remove" && handleRemove(sgenrc, option);
}
