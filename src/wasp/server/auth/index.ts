export type GetVerificationEmailContentFn = (args: {
  verificationLink: string;
}) => {
  subject: string;
  text: string;
  html: string;
};

export type GetPasswordResetEmailContentFn = (args: {
  passwordResetLink: string;
}) => {
  subject: string;
  text: string;
  html: string;
};
