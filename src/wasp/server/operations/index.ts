import type { PrismaClient } from '@prisma/client';

export type OperationContext = {
  prisma: PrismaClient;
  user?: any;
  entities?: Record<string, any>;
};

export type AuthenticatedOperationContext = OperationContext & {
  user: any;
};

// Generic operation types used across Open SaaS
export type Query<Input = any, Output = any> = (
  args: Input,
  context: OperationContext
) => Promise<Output>;

export type Action<Input = any, Output = any> = (
  args: Input,
  context: OperationContext
) => Promise<Output>;

export type AuthenticatedQuery<Input = any, Output = any> = (
  args: Input,
  context: AuthenticatedOperationContext
) => Promise<Output>;

export type AuthenticatedAction<Input = any, Output = any> = (
  args: Input,
  context: AuthenticatedOperationContext
) => Promise<Output>;

// Catch-all for named operation signatures
export type GetPaginatedUsers = AuthenticatedQuery;
export type UpdateIsUserAdminById = AuthenticatedAction;
export type CreateTask = AuthenticatedAction;
export type DeleteTask = AuthenticatedAction;
export type UpdateTask = AuthenticatedAction;
export type GetAllTasksByUser = AuthenticatedQuery;
export type GetGptResponses = AuthenticatedQuery;
export type GenerateGptResponse = AuthenticatedAction;
export type GetAllFilesByUser = AuthenticatedQuery;
export type GetDownloadFileSignedURL = AuthenticatedQuery;
export type AddFileToDb = AuthenticatedAction;
export type CreateFileUploadUrl = AuthenticatedAction;
export type DeleteFile = AuthenticatedAction;
export type GetDailyStats = AuthenticatedQuery;
export type GetCustomerPortalUrl = AuthenticatedQuery;
export type GenerateCheckoutSession = AuthenticatedAction;
