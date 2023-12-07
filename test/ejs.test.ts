import { readFileSync } from "fs";
import { expect, test } from "vitest";
import { compileEjsTemplate, render } from "../src/core/compile";

const variables = {
  name: "button",
};

const content = readFileSync("test/fixtures/ejs.t", "utf-8").toString();

const spiltContent = content.split("<!-- sgen seperator -->");

const template = compileEjsTemplate(content);

test("use helper in ejs", async () => {
  expect(
    render("tramsform result: <%= s.changeCase.camelCase(name) %>", variables),
  ).toMatchInlineSnapshot('"tramsform result: button"');
});

test("render template", () => {
  expect(render(template?.frontmatter.to!, variables)).toMatchInlineSnapshot(
    '"src/components/button/button.tsx"',
  );

  expect(render(template?.content!, variables)).toMatchInlineSnapshot(`
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
  expect(spiltContent.map((content) => render(content, variables)))
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
