import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/provider/auth-context";

const AuthLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const isVerifyEmailRoute = location.pathname.startsWith("/verify-email");
    const isResetPasswordRoute = location.pathname.startsWith("/reset-password");

    // ✅ Allow unauthenticated access to /verify-email and /reset-password
    if (!isLoading && !user && !isVerifyEmailRoute && !isResetPasswordRoute) {
      navigate("/sign-in");
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Shared layout UI like sidebar/header can go here */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
