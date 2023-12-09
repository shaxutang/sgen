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
    const max = (err as Error).message
      .split("\n")
      .map((s) => s.length)
      .sort((a, b) => b - a)[0];

    const line = Array.from({ length: max }, () => "-").join("");

    const str = [line, `${(err as Error).message}`, line, template].join("\n");
    return str;
  }
}
