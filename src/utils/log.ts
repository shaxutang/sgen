import chalk from "chalk";

export function success(content: any) {
  console.log(chalk.green(content));
}

export function warn(content: any) {
  console.log(chalk.yellow(content));
}

export function error(content: any) {
  console.log(chalk.red(content));
}

export function debug(content: any) {
  isDev && console.log(chalk.gray(`[DEBUG]: ${content}`));
}
