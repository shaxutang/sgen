import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import copy from "recursive-copy";
import { Dir } from "../core/constans";
import { isExists } from "../utils/fs";
import { error, success } from "../utils/log";

export default async function () {
  if (await isExists(join(process.cwd(), Dir.SGEN))) {
    error(`dir \`${Dir.SGEN}\` already exists.`);
    process.exit(1);
  }

  await mkdir(join(Dir.SGEN, Dir.CREATOR), { recursive: true });

  await mkdir(join(Dir.SGEN, Dir.GENERATOR), { recursive: true });

  const projectsDir = join(
    fileURLToPath(import.meta.url),
    "../../",
    "presets",
    Dir.CREATOR,
  );

  const templatesDir = join(
    fileURLToPath(import.meta.url),
    "../../",
    "presets",
    Dir.GENERATOR,
  );

  await copy(projectsDir, join(Dir.SGEN, Dir.CREATOR), {
    dot: true,
  });

  await copy(templatesDir, join(Dir.SGEN, Dir.GENERATOR), {
    dot: true,
  });

  await writeFile(join(Dir.SGEN, ".sgenrc"), "", "utf-8");

  success(
    [
      "init success.",
      `- ${Dir.CREATOR}: all project of this dir will display when exec \`sgen create\``,
      `- ${Dir.GENERATOR}: Generate according to the directory under templates`,
      `- .sgenrc: config file`,
    ].join("\n"),
  );
}
