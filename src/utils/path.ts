import os from "node:os";
import { join } from "path";
import { isExistsSync } from "./fs";

export function loopPath(path: string, find: string) {
  if (isExistsSync(join(path, find))) {
    return join(path, find);
  } else {
    const parentPath = join(path, "..");
    if (parentPath === path) {
      return "";
    }
    return loopPath(parentPath, find);
  }
}
