import { env } from "../config/env";
import type { GitHubUser, GitHubRepo } from "../types/github";
import { AppError } from "../utils/AppError";

const BASE_URL = "https://api.github.com";

async function request<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

  const res = await fetch(`${BASE_URL}${path}`, { headers });

  if (res.ok) return (await res.json()) as T;

  if (res.status === 404) throw new AppError(404, "GitHub user not found");

  if (res.status === 403 || res.status === 429) throw new AppError(429, "GitHub rate limit exceed");

  throw new AppError(502, "GitHub request failed");
}

export const githubClient = {
  getUser: (username: string) => request<GitHubUser>(`/users/${encodeURIComponent(username)}`),
  getRepos: (username: string, page = 1) =>
    request<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&page=${page}`,
    ),
};
