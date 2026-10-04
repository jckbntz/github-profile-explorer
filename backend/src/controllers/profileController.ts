import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { getProfile } from "../services/profileService";

// GitHub rules: alphanumeric + single hyphens, max 39 chars
const usernameSchema = z
  .string()
  .max(39)
  .regex(/^[a-z\d]+(?:-[a-z\d]+)*$/i);

export async function getProfileHandler(req: Request, res: Response) {
  const parsed = usernameSchema.safeParse(req.params.username);

  if (!parsed.success) throw new AppError(400, "Invalid GitHub username");

  res.json(await getProfile(parsed.data));
}
