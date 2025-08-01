import { route, index, layout } from "@react-router/dev/routes";

export default [
  index("routes/root/home.tsx"), // homepage at '/'

  // Public auth routes outside layout
  route("sign-in", "routes/auth/sign-in.tsx"),
  route("sign-up", "routes/auth/sign-up.tsx"),

  // Routes rendered inside auth layout (with shared layout wrapper)
  layout("routes/auth/auth-layout.tsx", [
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("reset-password/:token", "routes/auth/reset-password.tsx"), // ✅ updated
    route("verify-email/:token", "routes/auth/verify-email.tsx"),
    route("dashboard", "routes/dashboard/dashboard.tsx"),
  ]),
];
