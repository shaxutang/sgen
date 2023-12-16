import { statSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import copy from "recursive-copy";
import { Dir } from "../core/constans";
import { isExists } from "../utils/fs";
import { error, success } from "../utils/log";

export default async function () {
  if (await isExists(join(process.cwd(), Dir.SGEN))) {
    error(`\`${Dir.SGEN}\` already exists.`);
    process.exit(1);
  }

  await mkdir(join(Dir.SGEN, Dir.CREATOR), { recursive: true });

  await mkdir(join(Dir.SGEN, Dir.GENERATOR), { recursive: true });

  const templatesDir = join(
    fileURLToPath(import.meta.url),
    "../../",
    "presets",
    Dir.GENERATOR,
  );

  const dirs = (await readdir(templatesDir)).filter((item) =>
    statSync(join(templatesDir, item)).isDirectory(),
  );

  await copy(
    join(templatesDir, dirs[0]),
    join(Dir.SGEN, Dir.GENERATOR, "example"),
    {
      dot: true,
    },
  );

  await writeFile(
    join(Dir.SGEN, ".sgenrc"),
    [
      "# These two properties will be used when you create the default project",
      '# you can exec\n# - "sgen config set username=<your github username>"\n# - "sgen config set email=<your email>"\n# save to ~/user/.sgenrc, then you can use them globally',
      "username: <your github username>",
      "email: <your email>",
    ].join("\n"),
    "utf-8",
  );

  success(
    [
      "init success.",
      `- ${Dir.CREATOR}: all project of this dir will display when exec \`sgen create\``,
      `- ${Dir.GENERATOR}: Generate according to the directory under templates`,
      `- .sgenrc: env variables file`,
    ].join("\n"),
  );
}
