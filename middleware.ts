import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow access to profile routes for any authenticated user
      if (req.nextUrl.pathname.startsWith("/profile")) {
        return !!token;
      }

      // Require admin role for admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
