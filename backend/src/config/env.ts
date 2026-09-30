import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  GITHUB_TOKEN: z.string().optional(),
});

export const env = schema.parse(process.env);
