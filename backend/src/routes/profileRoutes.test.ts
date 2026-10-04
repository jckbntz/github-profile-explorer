import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { githubClient } from "../clients/githubClient";
import { AppError } from "../utils/AppError";
import type { GitHubUser, GitHubRepo } from "../types/github";

// Replace the real GitHub client: no network in tests
vi.mock("../clients/githubClient", () => ({
  githubClient: { getUser: vi.fn(), getRepos: vi.fn() },
}));

const getUser = vi.mocked(githubClient.getUser);
const getRepos = vi.mocked(githubClient.getRepos);

const user: GitHubUser = {
  login: "octo",
  name: "Octo Cat",
  avatar_url: "https://example.com/a.png",
  bio: null,
  location: null,
  html_url: "https://github.com/octo",
  followers: 10,
  following: 2,
  public_repos: 3,
};

const repo = (o: Partial<GitHubRepo>): GitHubRepo => ({
  id: 1,
  name: "repo",
  description: null,
  html_url: "https://github.com/octo/repo",
  stargazers_count: 0,
  forks_count: 0,
  language: null,
  fork: false,
  updated_at: "2024-01-01T00:00:00Z",
  ...o,
});

const app = createApp();

describe("GET /api/profiles/:username", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns a shaped profile without forks, with stats", async () => {
    getUser.mockResolvedValue(user);
    getRepos.mockResolvedValue([
      repo({ id: 1, stargazers_count: 5, language: "TypeScript" }),
      repo({ id: 2, stargazers_count: 7, language: "TypeScript" }),
      repo({ id: 3, stargazers_count: 100, language: "Go", fork: true }), // excluded
    ]);

    const res = await request(app).get("/api/profiles/octo");

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe("octo");
    expect(res.body.repos).toHaveLength(2);
    expect(res.body.stats.totalStars).toBe(12);
    expect(res.body.stats.topLanguages).toEqual([{ name: "TypeScript", count: 2 }]);
  });

  it("returns 404 when GitHub says the user does not exist", async () => {
    getUser.mockRejectedValue(new AppError(404, "GitHub user not found"));
    getRepos.mockResolvedValue([]);

    const res = await request(app).get("/api/profiles/ghost-user");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "GitHub user not found" });
  });

  it("returns 400 for an invalid username without calling GitHub", async () => {
    const res = await request(app).get("/api/profiles/-bad-");

    expect(res.status).toBe(400);
    expect(getUser).not.toHaveBeenCalled();
  });

  it("serves repeat requests from the cache", async () => {
    getUser.mockResolvedValue({ ...user, login: "cached-user" });
    getRepos.mockResolvedValue([]);

    await request(app).get("/api/profiles/cached-user");
    await request(app).get("/api/profiles/CACHED-USER"); // case-insensitive key

    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it("returns 404 JSON for unknown routes", async () => {
    const res = await request(app).get("/api/nope");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });

  it("fetches every page of repos", async () => {
    getUser.mockResolvedValue({ ...user, login: "big-user", public_repos: 250 });
    getRepos.mockImplementation(async (_u, page = 1) => [repo({ id: page })]);

    const res = await request(app).get("/api/profiles/big-user");

    expect(getRepos.mock.calls.map(([, page]) => page)).toEqual([1, 2, 3]);
    expect(res.body.repos).toHaveLength(3);
  });

  it("caps pages to protect the rate limit", async () => {
    getUser.mockResolvedValue({ ...user, login: "huge-user", public_repos: 5000 });
    getRepos.mockResolvedValue([]);

    await request(app).get("/api/profiles/huge-user");

    expect(getRepos).toHaveBeenCalledTimes(10);
  });
});
