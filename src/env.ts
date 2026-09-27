import * as z from "zod";
import { googleAnalyticsEnvSchema, plausibleEnvSchema } from "./analytics/env";
import { authEnvSchema } from "./auth/env";
import { demoAiAppEnvSchema } from "./demo-ai-app/env";
import { fileUploadEnvSchema } from "./file-upload/env";
import { lemonSqueezyEnvSchema } from "./payment/lemonSqueezy/env";
import { polarEnvSchema } from "./payment/polar/env";
import { stripeEnvSchema } from "./payment/stripe/env";

export const serverEnvValidationSchema = z.object({
  ...authEnvSchema.shape,
  ...stripeEnvSchema.shape,
  ...lemonSqueezyEnvSchema.shape,
  ...polarEnvSchema.shape,
  ...demoAiAppEnvSchema.shape,
  ...fileUploadEnvSchema.shape,
  ...plausibleEnvSchema.shape,
  ...googleAnalyticsEnvSchema.shape,
});

export const env = serverEnvValidationSchema.parse(process.env);
