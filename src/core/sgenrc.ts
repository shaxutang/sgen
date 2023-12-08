import { readFileSync } from "node:fs";
import { constants, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { Sgenrc, MergeSgenrc } from "@vcee/sgen-types";
import dotenv from "dotenv";
import { isExistsSync } from "../utils/fs";
import { success } from "../utils/log";
import { Dir } from "./constans";
import prompts from "./prompts";

// File name
export const fileName: string = ".sgenrc";
// Path to the operating system sgenrc file
export const osSgenrcPath: string = join(os.homedir(), fileName);
// Path to the sgenrc file in the current directory
export const cwdSgenrcPath: string = join(process.cwd(), Dir.SGEN, fileName);

/**
 * Asynchronously request necessary variables.
 */
export async function promptsRequiredVariables() {
  /**
   * Asynchronously request for username and email variables.
   */
  const variables = await prompts([
    {
      type: "text",
      name: "username",
      message: "What's your Github username?",
      validate(value) {
        return !!value;
      },
    },
    {
      type: "text",
      name: "email",
      message: "What's your email?",
      validate(value) {
        return !!value;
      },
    },
  ]);

  /**
   * Construct the sgenrc object.
   * Includes the existing sgenrc in the operating system and the requested variables.
   */
  const sgenrc = {
    ...getOsSgenrc(),
    ...variables,
  };

  /**
   * Write the constructed sgenrc object into the operating system.
   */
  writeOsSgenrc(sgenrc);

  /**
   * Display a success message indicating saving was successful.
   */
  success(
    [osSgenrcPath, "\n", formatSgenrc(sgenrc), "\n", "saved."].join("\n"),
  );
}

/**
 * Set the value of a specified field in osSgenrc.
 *
 * @param name - The name of the field to be set.
 * @param value - The value to set for the field.
 */
export function setFieldToOsSgenrc(name: string, value: any) {
  const osSgenrc = getOsSgenrc();
  writeOsSgenrc({
    ...osSgenrc,
    [name]: value,
  });
}

/**
 * Remove a specified field from osSgenrc.
 *
 * @param name - The name of the field to be removed.
 */
export function removeFieldFromOsSgenrc(name: string) {
  const osSgenrc = getOsSgenrc();
  if (osSgenrc[name]) delete osSgenrc[name];
  writeOsSgenrc(osSgenrc);
}

/**
 * Formats the sgenrc object into a string representation with key-value pairs separated by equals sign and multiple entries separated by new lines.
 * @param sgenrc - The sgenrc object to be formatted
 * @returns The formatted string representation of the sgenrc object
 */
export function formatSgenrc(sgenrc: Sgenrc): string {
  return Object.entries(sgenrc)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}

/**
 * Writes the formatted sgenrc content into the operating system sgenrc file.
 * @param sgenrc - The formatted sgenrc content to be written
 */
export function writeOsSgenrc(sgenrc: Sgenrc) {
  writeFile(osSgenrcPath, formatSgenrc(sgenrc), "utf-8");
}

/**
 * Checks if the operating system sgenrc file exists.
 * @returns True if the operating system sgenrc file exists, otherwise false
 */
export function osSgenrcExits() {
  return isExistsSync(osSgenrcPath, constants.O_DIRECTORY);
}

/**
 * Checks if the sgenrc file in the current directory exists.
 * @returns True if the sgenrc file in the current directory exists, otherwise false
 */
export function cwdSgenrcExits() {
  return isExistsSync(cwdSgenrcPath, constants.O_DIRECTORY);
}

/**
 * Retrieves the contents of the operating system sgenrc file.
 * @returns The contents of the operating system sgenrc file in the form of sgenrc object
 */
export function getOsSgenrc(): Sgenrc {
  return osSgenrcExits()
    ? dotenv.parse<Sgenrc>(Buffer.from(readFileSync(osSgenrcPath, "utf-8")))
    : ({} as Sgenrc);
}

/**
 * Retrieves the contents of the sgenrc file in the current directory.
 * @returns The contents of the sgenrc file in the current directory in the form of sgenrc object
 */
export function getCwdSgenrc(): Sgenrc {
  return cwdSgenrcExits()
    ? dotenv.parse<Sgenrc>(Buffer.from(readFileSync(cwdSgenrcPath, "utf-8")))
    : ({} as Sgenrc);
}

/**
 * Generates the merged sgenrc object by combining the operating system sgenrc object and the current directory sgenrc object.
 * @returns The merged sgenrc object
 */
export function getMergeSgenrc(): MergeSgenrc {
  const osSgenrc = getOsSgenrc();
  const cwdSgenrc = getCwdSgenrc();

  return {
    os: osSgenrc,
    cwd: cwdSgenrc,
    merge: {
      ...osSgenrc,
      ...cwdSgenrc,
    },
  };
}

/**
 * Retrieves the sgenrc object.
 * @returns The sgenrc object
 */
export function getSgenrc(): Sgenrc {
  return getMergeSgenrc().merge;
}

/**
 * Retrieves the path to the operating system sgenrc file.
 * @returns The path to the operating system sgenrc file
 */
export function getOsSgenrcPath() {
  return osSgenrcPath;
}
