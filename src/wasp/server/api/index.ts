export type PaymentsWebhook = (req: any, res: any, context: any) => Promise<any> | any;
export type ApiHandler = (req: any, res: any, context: any) => Promise<any> | any;
