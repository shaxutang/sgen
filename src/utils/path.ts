import { join } from "path";
import { isExistsSync } from "./fs";

export function loopPath(path: string, find: string) {
  if (isExistsSync(join(path, find))) {
    return join(path, find);
  } else {
    return loopPath(join(path, ".."), find);
  }
}
