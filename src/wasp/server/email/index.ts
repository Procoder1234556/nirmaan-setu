export const emailSender = {
  async send(options: { to: string; subject: string; text?: string; html?: string }) {
    console.log(`[EmailSender] Sending email to ${options.to}: ${options.subject}`);
    return true;
  },
};
