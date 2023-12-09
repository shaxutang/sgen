import * as changeCase from "change-case";
import ejs from "ejs";

export const defaultVariables = {
  s: {
    changeCase,
  },
  sgenrc: {},
};

export function render(template: string, variables: Record<string, any>) {
  const vars = { ...defaultVariables, ...variables };

  try {
    return ejs.render(template, vars);
  } catch (err) {
    const str = [
      "---------------------------",
      `${(err as Error).message}`,
      "\n",
      "The file will not be rendered",
      "---------------------------",
      "\n",
      template,
    ].join("\n");
    return str;
  }
}
