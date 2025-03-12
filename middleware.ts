import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware(req: Request) {}, {
  isReturnToCurrentPage: true,
  loginPage: "/api/auth/login",
  //   isAuthorized: ({ token }) => {
  //     return token.permissions.includes("eat:chips");
  //   },
});

export const config = {
  matcher: ["/create-workspace", "/workspace"],
};
