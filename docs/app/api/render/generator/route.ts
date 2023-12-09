import { render } from "@/app/core/render";

export async function POST(request: Request) {
  const body = await request.json();

  const { templates, variables } = body;

  const renderTemplates = (templates as any[]).map(
    ({ frontmatter, content }) => {
      const renderFrontmatter = render(
        Object.entries(frontmatter)
          .map(([key, value]) => {
            return [key, render(value as string, variables)].join(": ");
          })
          .join("\n"),
        variables,
      );

      return {
        frontmatter: renderFrontmatter,
        content: render(content, variables),
      };
    },
  );

  return Response.json({
    templates: renderTemplates,
  });
}
