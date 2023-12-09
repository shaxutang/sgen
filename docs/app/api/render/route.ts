import { render } from "@/app/core/render";

export async function POST(request: Request) {
  const body = await request.json();

  const { frontmatter, content } = body;

  const variables = {
    name: "xxx",
  };

  const renderFrontmatter = render(
    Object.entries(frontmatter)
      .map(([key, value]) => {
        return [key, render(value as string, variables)].join(": ");
      })
      .join("\n"),
    variables,
  );

  return Response.json({
    frontmatter: renderFrontmatter,
    content: render(content, variables),
  });
}
