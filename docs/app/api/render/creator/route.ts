import { render } from "@/app/core/render";

export async function POST(request: Request) {
  const body = await request.json();

  const { content } = body;

  const variables = {
    name: "xxx",
  };

  return Response.json({
    content: render(content, variables),
  });
}
