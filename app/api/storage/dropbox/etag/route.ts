import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new Response("URL parameter is required", { status: 400 });
  }

  try {
    const response = await fetch(url, { method: "HEAD" });
    const etag = response.headers.get("etag");

    if (etag) {
      return Response.json({ etag });
    } else {
      return Response.json({ error: "ETag not found" }, { status: 404 });
    }
  } catch (error) {
    throw new Error("Failed to fetch ETag");
  }
}
