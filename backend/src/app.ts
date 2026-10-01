import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { profileRoutes } from "./routes/profileRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/profiles", profileRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
