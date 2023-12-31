import { program } from "commander";
import { version } from "../package.json";
import config from "./commands/config";
import create from "./commands/create";
import gen from "./commands/gen";
import init from "./commands/init";

program.name("sgen").version(version);

program
  .command("create")
  .description("select a template to create a new project")
  .action(() => create());

program
  .command("init")
  .description("init a .sgen dir")
  .action(() => init());

program.action(() => gen());

program
  .command("config <action> [option]")
  .description("change ~/user/.sgenrc")
  .action((action, option) => {
    config({
      action,
      option,
    });
  });

program.parse();
