import ejs from "ejs";
import { readFileSync } from "fs";
import { expect, test } from "vitest";
import { compileEjsTemplate } from "../src/core/compile";
import { helper } from "../src/core/helpers";

const variables = {
  name: "button",
  s: helper,
};

const content = readFileSync("test/fixtures/ejs.t", "utf-8").toString();

const spiltContent = content.split("<!-- sgen seperator -->");

const template = compileEjsTemplate(
  readFileSync("test/fixtures/ejs.t", "utf-8").toString(),
);

test("use helper in ejs", async () => {
  expect(
    ejs.render(
      "tramsform result: <%= s.changeCase.camelCase(name) %>",
      variables,
    ),
  ).toMatchInlineSnapshot('"tramsform result: button"');
});

test("render template", () => {
  expect(
    ejs.render(template?.frontmatter.to!, variables),
  ).toMatchInlineSnapshot('"src/components/button/button.tsx"');

  expect(ejs.render(template?.content!, variables)).toMatchInlineSnapshot(`
    "
    import clsx from \\"clsx\\";
    import { ButtonProps } from \\"./type\\";

    export default function Button({ children, className, ...rest }: ButtonProps) {
      return (
        <button className={clsx(\\"t-button\\", className)} {...rest}>
          {children}
        </button>
      );
    }

    <!-- sgen seperator -->

    ---
    to: src/components/button/styles.css
    ---
    .button {

    }
    "
  `);
});

test("render seperator template", () => {
  expect(spiltContent.map((content) => ejs.render(content, variables)))
    .toMatchInlineSnapshot(`
    [
      "---
    to: src/components/button/button.tsx
    ---
    import clsx from \\"clsx\\";
    import { ButtonProps } from \\"./type\\";

    export default function Button({ children, className, ...rest }: ButtonProps) {
      return (
        <button className={clsx(\\"t-button\\", className)} {...rest}>
          {children}
        </button>
      );
    }

    ",
      "

    ---
    to: src/components/button/styles.css
    ---
    .button {

    }
    ",
    ]
  `);
});
