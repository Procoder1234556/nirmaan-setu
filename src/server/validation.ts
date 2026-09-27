import * as z from "zod";

export class HttpError extends Error {
  constructor(public statusCode: number, message: string = "Http Error", public data?: any) {
    super(message);
    this.name = 'HttpError';
  }
}

export function ensureArgsSchemaOrThrowHttpError<Schema extends z.ZodType>(
  schema: Schema,
  rawArgs: unknown,
): z.infer<Schema> {
  const parseResult = schema.safeParse(rawArgs);
  if (!parseResult.success) {
    console.error(
      new Error(
        "Operation arguments validation failed",
        { cause: parseResult.error },
      ),
    );

    throw new HttpError(400, "Operation arguments validation failed", {
      cause: parseResult.error,
    });
  } else {
    return parseResult.data;
  }
}
