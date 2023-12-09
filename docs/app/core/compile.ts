import dotenv from "dotenv";

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
  const regex = /---([\s\S]+?)---([\s\S]+)/;

  // Match the template string with the regular expression.
  const match = template.match(regex);

  // If the template matches successfully.
  if (match) {
    // Trim the frontmatter and content obtained from the match.
    const frontmatter = dotenv.parse<Frontmatter>(match[1]);
    const content = `\n${match[2].trim()}`;

    // Return an object with the frontmatter and content.
    return { frontmatter, content };
  }

  // If the template does not match, return an object with empty frontmatter and content.
  return void 0;
}
