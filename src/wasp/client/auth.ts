export function useAuth() {
  return { data: { id: '1', email: 'admin.pipeline@oilindia.in', username: 'admin', subscriptionStatus: null }, isLoading: false, isError: false };
}
export function logout() {
  return Promise.resolve();
}
export const VerifyEmailForm = () => null;
export const ResetPasswordForm = () => null;
export const ForgotPasswordForm = () => null;
export const LoginForm = () => null;
export const SignupForm = () => null;
