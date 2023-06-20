import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );
  response.headers.append("Access-Control-Max-Age", "86400");

  console.log("Middleware!");
  console.log(request.method);
  console.log(request.url);

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
