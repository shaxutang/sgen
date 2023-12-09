import { render } from "@/app/core/render";

export async function POST(request: Request) {
  const body = await request.json();

  const { content,variables } = body;

  return Response.json({
    content: render(content, variables),
  });
}
