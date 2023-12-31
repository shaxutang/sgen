import * as changeCase from "change-case";
import dayjs from "dayjs";
import dotenv from "dotenv";
import ejs from "ejs";
import { getSgenrc } from "../core/sgenrc";
import { warn } from "../utils/log";

const sgenrc = getSgenrc();

export const defaultVariables = {
  s: {
    changeCase,
    dayjs,
  },
  sgenrc,
};

export type Frontmatter = {
  to: string;
  pattern?: string;
};

/**
 * Compile EJS template into frontmatter and content.
 *
 * @param template The EJS template string.
 * @returns An object containing the frontmatter and content of the template.
 */
export function compileEjsTemplate(template: string):
  | {
      frontmatter: Frontmatter;
      content: string;
    }
  | undefined {
  // Regular expression for matching the template.
  const regex = /---([\s\S]+?)---([\s\S]*)/;

  // Match the template string with the regular expression.
  const match = template.match(regex);

  // If the template matches successfully.
  if (match) {
    // Trim the frontmatter and content obtained from the match.
    const frontmatter = dotenv.parse<Frontmatter>(match[1]);
    const content = `${match[2]}`.trim();

    // Return an object with the frontmatter and content.
    return { frontmatter, content };
  }

  // If the template does not match, return an object with empty frontmatter and content.
  return void 0;
}

export function render(template: string, variables: Record<string, any>) {
  const vars = { ...defaultVariables, ...variables };

  try {
    return ejs.render(template, vars);
  } catch (err) {
    warn(`${(err as Error).message}\n\nThe file will not be rendered`);
    return template;
  }
}
