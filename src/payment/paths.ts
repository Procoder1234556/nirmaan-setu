import { CheckoutResult } from "./CheckoutResultPage";
import { env } from "../env";

const CHECKOUT_SUCCESS_URL_PATH = `/checkout?status=${CheckoutResult.Success}`;
export const CHECKOUT_SUCCESS_URL = `${env.WASP_WEB_CLIENT_URL}${CHECKOUT_SUCCESS_URL_PATH}`;

const CHECKOUT_CANCELED_URL_PATH = `/checkout?status=${CheckoutResult.Canceled}`;
export const CHECKOUT_CANCELED_URL = `${env.WASP_WEB_CLIENT_URL}${CHECKOUT_CANCELED_URL_PATH}`;

export const CUSTOMER_PORTAL_RETURN_URL = `${env.WASP_WEB_CLIENT_URL}/account`;
