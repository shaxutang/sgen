import { accessSync } from "node:fs";
import { access } from "node:fs/promises";

export async function isExists(path: string, mode?: number) {
  return await access(path, mode)
    .then(() => true)
    .catch(() => false);
}

export function isExistsSync(path: string, mode?: number) {
  try {
    accessSync(path, mode);
    return true;
  } catch {
    return false;
  }
}
