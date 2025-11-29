import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY || "http://localhost:3000/api";

export async function GET(request: NextRequest) {
  return handleProxy(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleProxy(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleProxy(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request, "DELETE");
}

export async function PATCH(request: NextRequest) {
  return handleProxy(request, "PATCH");
}

async function handleProxy(request: NextRequest, method: string) {
  const url = new URL(request.url);
  // Extract path from query params or pathname
  const path = url.searchParams.get("path") || url.pathname.replace("/api/proxy", "").replace(/^\//, "");
  const targetUrl = `${API_GATEWAY}/${path}${url.search.replace(/[?&]path=[^&]*/, "")}`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Forward cookies
    const cookie = request.headers.get("cookie");
    if (cookie) {
      headers["Cookie"] = cookie;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    // Forward body for POST, PUT, PATCH
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(targetUrl, options);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
