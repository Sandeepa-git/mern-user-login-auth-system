import { postData } from "@/lib/fetch-utill";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

// ✅ Signup Mutation
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
  });
};

// ✅ Email Verification Mutation
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { token: string }) => postData("/auth/verify-email", data),
  });
};

// ✅ Login Mutation
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postData("/auth/login", data),
  });
};

// ✅ Reset Password Request Mutation
export const useResetPasswordRequestMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postData("/auth/reset-password-request", data),
  });
};

// ✅ Reset Password Mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      postData(`/auth/reset-password/${data.token}`, { password: data.password }),
  });
};
