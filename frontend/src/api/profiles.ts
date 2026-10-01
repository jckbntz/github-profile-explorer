import type { Profile } from "../types/profile";
import { apiGet } from "./client";

export const fetchProfile = (username: string) =>
  apiGet<Profile>(`/profiles/${encodeURIComponent(username)}`);
