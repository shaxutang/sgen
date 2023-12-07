import { program } from "commander";
import { version } from "../package.json";
import config from "./commands/config";
import create from "./commands/create";
import gen, { GenOptions } from "./commands/gen";
import init from "./commands/init";

// import ui from "./commands/ui";

program.name("sgen").version(version);

program
  .command("create [template] [name]")
  .description("select a template to create a new project")
  .action((template, name) => {
    try {
      create({ options: { name, template } });
    } catch {}
  });

program
  .command("init")
  .description("init a .sgen dir")
  .action(() => init());

program
  .argument("[template]", "directory name under the .sgen directory")
  .action((template: GenOptions["template"]) =>
    gen({
      options: {
        template,
      },
    }),
  );

program
  .command("config <action> [option]")
  .description("change ~/user/.sgenrc")
  .action((action, option) => {
    config({
      options: {
        action,
        option,
      },
    });
  });

// program
//   .command("ui")
//   .description("start ui")
//   .action(() => ui());

program.parse();

let ctrlCPressed = false;

process.on("SIGINT", () => {
  if (!ctrlCPressed) {
    console.log("\n按下Ctrl+C再次退出");
    ctrlCPressed = true;
  } else {
    process.exit();
  }
});
