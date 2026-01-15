import { z } from "zod";

const configSchema = z.object({
  API_PORT: z.string().transform(Number),
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  console.error("[honotes] Invalid environment variables :\n", z.prettifyError(parsedConfig.error));
  process.exit(1);
}

export const config = parsedConfig.data;
