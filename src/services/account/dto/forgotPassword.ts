export interface ForgotPasswordInputDto {
  usernameOrEmailOrPhone: string;
}

export interface ConfirmForgotPasswordInputDto {
  usernameOrEmailOrPhone: string;
  code: string;
  newPassword: string;
}
