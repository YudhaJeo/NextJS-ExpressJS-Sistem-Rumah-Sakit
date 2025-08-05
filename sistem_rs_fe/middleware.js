import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path === "/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET_KEY, { algorithms: ["HS512"] });
    return NextResponse.next();
  } catch (err) {
    // console.log("[DEBUG] Login Error!", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/master/:path*",
    "/admin/:path*",
    "/rawat_inap/:path*",
  ],
};
