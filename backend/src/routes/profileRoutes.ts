import { Router } from "express";
import { getProfileHandler } from "../controllers/profileController";

export const profileRoutes = Router();

profileRoutes.get("/:username", getProfileHandler);
