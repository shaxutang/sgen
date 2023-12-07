import { readFileSync } from "node:fs";
import { constants, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import dotenv from "dotenv";
import { Sgenrc, MergeSgenrc } from "@vcee/sgen-types";
// import server from "../server/github";
import { isExistsSync } from "../utils/fs";
// import { error, success } from "../utils/log";
import { Dir } from "./constans";

/**
 * Class for managing sgenrc entity.
 */
class SgenrcEntity {
  // File name
  private fileName: string = ".sgenrc";
  // Path to the operating system sgenrc file
  private osSgenrcPath: string = join(os.homedir(), this.fileName);
  // Path to the sgenrc file in the current directory
  private cwdSgenrcPath: string = join(process.cwd(), Dir.SGEN, this.fileName);

  // /**
  //  * Saves the sgenrc information from GitHub and overrides the existing operating system sgenrc file.
  //  */
  // async saveSgenrcFromGithub() {
  //   try {
  //     success("Please complete the certification first.");

  //     // Start the server and call getUserCallback() method to get the GitHub user information
  //     const githubUser = await server.start().getUserCallback();

  //     success("Certification completed.");

  //     // Use GitHub user information or the contents of the operating system sgenrc file for sgenrc
  //     const sgenrc = this.osSgenrcExits()
  //       ? githubUser
  //       : {
  //           ...this.getOsSgenrc(),
  //           ...githubUser,
  //         };

  //     this.writeOsSgenrc(sgenrc);

  //     success(
  //       [
  //         this.osSgenrcPath,
  //         "\n",
  //         this.formatSgenrc(sgenrc),
  //         "\n",
  //         "saved.",
  //       ].join("\n"),
  //     );
  //   } catch {
  //     error(
  //       'Error connecting to GitHub, you can exec "sgen config set <key>=<value> to set the env variables.',
  //     );
  //   } finally {
  //     // Close the server connection
  //     server.close();
  //   }
  // }

  /**
   * Formats the sgenrc object into a string representation with key-value pairs separated by equals sign and multiple entries separated by new lines.
   * @param sgenrc - The sgenrc object to be formatted
   * @returns The formatted string representation of the sgenrc object
   */
  formatSgenrc(sgenrc: Sgenrc): string {
    return Object.entries(sgenrc)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
  }

  /**
   * Writes the formatted sgenrc content into the operating system sgenrc file.
   * @param sgenrc - The formatted sgenrc content to be written
   */
  writeOsSgenrc(sgenrc: Sgenrc) {
    writeFile(this.osSgenrcPath, this.formatSgenrc(sgenrc), "utf-8");
  }

  /**
   * Checks if the operating system sgenrc file exists.
   * @returns True if the operating system sgenrc file exists, otherwise false
   */
  osSgenrcExits() {
    return isExistsSync(this.osSgenrcPath, constants.O_DIRECTORY);
  }

  /**
   * Checks if the sgenrc file in the current directory exists.
   * @returns True if the sgenrc file in the current directory exists, otherwise false
   */
  cwdSgenrcExits() {
    return isExistsSync(this.cwdSgenrcPath, constants.O_DIRECTORY);
  }

  /**
   * Retrieves the contents of the operating system sgenrc file.
   * @returns The contents of the operating system sgenrc file in the form of sgenrc object
   */
  getOsSgenrc(): Sgenrc {
    return this.osSgenrcExits()
      ? dotenv.parse<Sgenrc>(
          Buffer.from(readFileSync(this.osSgenrcPath, "utf-8")),
        )
      : ({} as Sgenrc);
  }

  /**
   * Retrieves the contents of the sgenrc file in the current directory.
   * @returns The contents of the sgenrc file in the current directory in the form of sgenrc object
   */
  getCwdSgenrc(): Sgenrc {
    return this.cwdSgenrcExits()
      ? dotenv.parse<Sgenrc>(
          Buffer.from(readFileSync(this.cwdSgenrcPath, "utf-8")),
        )
      : ({} as Sgenrc);
  }

  /**
   * Generates the merged sgenrc object by combining the operating system sgenrc object and the current directory sgenrc object.
   * @returns The merged sgenrc object
   */
  getMergeSgenrc(): MergeSgenrc {
    const osSgenrc = this.getOsSgenrc();
    const cwdSgenrc = this.getCwdSgenrc();

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
  getSgenrc(): Sgenrc {
    return this.getMergeSgenrc().merge;
  }

  /**
   * Retrieves the path to the operating system sgenrc file.
   * @returns The path to the operating system sgenrc file
   */
  getOsSgenrcPath() {
    return this.osSgenrcPath;
  }
}

export default new SgenrcEntity();
