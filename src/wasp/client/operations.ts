export function useQuery(action: any, args?: any): any {
  return { data: null as any, error: null as any, isLoading: false, isError: false, isSuccess: false, status: 'success' };
}

export function useAction(action: any): any {
  return async (args: any) => null as any;
}

// Re-export any other common operations exports as dummy types
export const getDailyStats = {} as any;
export const updateCurrentUser = {} as any;
export const updateStripePaymentDetails = {} as any;
export const updateUserById = {} as any;
export const getAllTasksByUser = {} as any;
export const getGptResponses = {} as any;
export const generateGptResponse = {} as any;
export const createTask = {} as any;
export const updateTask = {} as any;
export const deleteTask = {} as any;
export const createFileUploadUrl = {} as any;
export const addFileToDb = {} as any;
export const getAllFilesByUser = {} as any;
export const getDownloadFileSignedURL = {} as any;
export const getCustomerPortalUrl = {} as any;
export const generateCheckoutSession = {} as any;
export const deleteFile = {} as any;
