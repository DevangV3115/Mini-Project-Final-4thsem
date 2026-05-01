import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const NODE_BACKEND_URL =
  process.env.NODE_BACKEND_URL || "https://mini-project-final-4thsem-1.onrender.com";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${NODE_BACKEND_URL}/api/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    return new Response(JSON.stringify({ error: "Backend unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}