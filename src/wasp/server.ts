export const env = { ADMIN_EMAILS: [] };
export class HttpError extends Error {
  constructor(public statusCode: number, message: string = "Http Error", public data?: any) {
    super(message);
    this.name = 'HttpError';
  }
}
export const prisma = {} as any;
