import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import dirTree from "directory-tree";
import { Dir } from "../core/constans";
import sgenrcEntity from "../core/sgenrc";
import { isExistsSync } from "../utils/fs";

// Define a choice type with name and value properties
export type Choice = {
  title: string;
  name: string;
  value: string;
};

export class SgenDir {
  // Define private properties for sgenDirPath and dir
  private sgenDirPath: string;
  private dir: string;

  // Constructor to initialize the dir property and load all directory choices
  constructor(dir: string) {
    this.dir = dir;
    this.sgenDirPath = join(process.cwd(), Dir.SGEN, this.dir);
    this.loadAllDirChoices();
  }

  // Get the sgenDirPath of the SgenDir instance
  getDirPath(): {
    sgenDirPath: string;
    workspacePath: string;
  } {
    // Get sgenrc configuration
    const sgenrc = sgenrcEntity.getSgenrc();
    // Return an object with sgenDirPath, workspacePath, and presetPath
    return {
      sgenDirPath: this.sgenDirPath,
      workspacePath: join(`${sgenrc?.workspace}`, this.dir),
    };
  }

  // Load all directory choices from different paths
  loadAllDirChoices(): {
    sgenDirChoices: Choice[];
    workspaceDirChoices: Choice[];
  } {
    // Get the sgenDirPath, workspacePath, and presetPath from the getDirPath() instance method
    const { sgenDirPath, workspacePath } = this.getDirPath();

    // Initialize empty arrays for sgenDirChoices, workspaceDirChoices, and presetDirChoices
    const sgenDirChoices: Choice[] = this.getDirectoryChoices(sgenDirPath);
    const workspaceDirChoices: Choice[] =
      this.getDirectoryChoices(workspacePath);

    // Return an object with sgenDirChoices, workspaceDirChoices, and presetDirChoices
    return {
      sgenDirChoices,
      workspaceDirChoices,
    };
  }

  // Generate a tree structure of the directories
  treeDirs() {
    // Get the sgenDirPath, workspacePath, and presetPath from the getDirPath() instance method
    const { sgenDirPath, workspacePath } = this.getDirPath();
    // Initialize a directory-tree configuration object
    const config: dirTree.DirectoryTreeOptions = {
      attributes: ["size", "type", "extension"],
      exclude: [/node_modules/],
      followSymlinks: true,
    };
    // Generate tree structures for sgenDirTree, workspaceDirTree, and presetDirTree using the dirTree module
    const sgenDirTree = dirTree(sgenDirPath, config);
    const workspaceDirTree = dirTree(workspacePath, config);
    // Return an object with sgenDirTree, workspaceDirTree, and presetDirTree
    return {
      sgenDirTree,
      workspaceDirTree,
    };
  }

  // Get all directories
  getAllDirs(): Array<any> {
    // Get sgenDirChoices, workspaceDirChoices, and presetDirChoices from loadAllDirChoices() instance method
    const { sgenDirChoices, workspaceDirChoices } = this.loadAllDirChoices();
    // Return an array with sgenDirChoices, workspaceDirChoices, and presetDirChoices
    return [...sgenDirChoices, ...workspaceDirChoices];
  }

  // Get all directory choices with separators
  getAllDirChoices(): Array<any> {
    // Get sgenDirChoices, workspaceDirChoices, and presetDirChoices from loadAllDirChoices() instance method
    const { sgenDirChoices, workspaceDirChoices } = this.loadAllDirChoices();

    // Define a function to add separators to the choices array
    const getNotEmptyChoices = (seperator: string, choices: Choice[] = []) => {
      return choices.length
        ? choices.map((choice) => {
            return {
              ...choice,
              title: `${seperator}/${choice.title}`,
            };
          })
        : [];
    };

    // Return an array with formatted choices using getNotEmptyChoices function
    return [
      ...getNotEmptyChoices("✨ .sgen", sgenDirChoices),
      ...getNotEmptyChoices("✨ workspace", workspaceDirChoices),
    ];
  }

  // Check if the directory exists
  isExists(): boolean {
    // Return the result of the isExistsSync() function with the sgenDirPath
    return isExistsSync(this.sgenDirPath);
  }

  // Private method to get directory choices from a given path
  private getDirectoryChoices(dirPath: string): Array<any> {
    // Check if dirPath is not provided
    if (!dirPath) return [];

    // Initialize an empty array for directory choices
    const arr: any[] = [];

    // Check if the directory exists
    if (isExistsSync(dirPath)) {
      // Get an array of directory names and their corresponding paths
      const dirs = readdirSync(dirPath)
        .filter((dir) => statSync(join(dirPath, dir)).isDirectory())
        .map((dir) => ({
          name: dir,
          title: dir,
          value: join(dirPath, dir),
        }));

      // Push the directory choices into the arr array
      arr.push(...dirs);
    }

    // Return the arr array
    return arr;
  }
}
