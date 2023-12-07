import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import express from "express";
import { Dir } from "../core/constans";
import { SgenDir } from "../core/directory";
import sgenrcEntity from "../core/sgenrc";
import { success } from "../utils/log";

const creator = new SgenDir(Dir.CREATOR);

const generator = new SgenDir(Dir.GENERATOR);

const server = express();

server.use(
  express.static(join(fileURLToPath(import.meta.url), "..", "ui"), {
    extensions: ["html"],
  }),
);

server.get("/sgenrc", (req, res) => {
  res.send(sgenrcEntity.getMergeSgenrc());
});

server.get("/dir/creator", (req, res) => {
  res.send(creator.treeDirs());
});

server.get("/dir/generator", (req, res) => {
  res.send(generator.treeDirs());
});

server.get("/file/read", (req, res) => {
  const path = req.query.path as string;
  res.send(path ? readFileSync(req.query.path as string, "utf-8") : "");
});

export function startServer() {
  const start = new Date().getTime();
  server.listen(8264, () => {
    const end = new Date().getTime();
    isDev && success(`API server is running on http://localhost:8264`);
    isProd &&
      console.log(
        [
          `${chalk.green("SGEN UI")} ready in ${end - start} ms`,
          `${chalk.green(`->`)} ${chalk.blueBright("http://localhost:8264")}`,
        ].join("\n"),
      );
  });
}
