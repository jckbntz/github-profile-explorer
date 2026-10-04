import { githubClient } from "../clients/githubClient";
import type { Profile } from "../types/profile";
import { TtlCache } from "../utils/cache";

const PER_PAGE = 100;
const MAX_PAGES = 10;

const cache = new TtlCache<Profile>(5 * 60 * 1000);

async function fetchAllRepos(username: string, publicRepos: number) {
  const totalPages = Math.ceil(publicRepos / PER_PAGE);

  const pagesToFetch = Math.min(totalPages, MAX_PAGES);

  const results = await Promise.all(
    Array.from({ length: pagesToFetch }, (_, i) => githubClient.getRepos(username, i + 1)),
  );

  return results.flat();
}

async function fetchProfile(username: string): Promise<Profile> {
  const user = await githubClient.getUser(username);

  const rawRepos = await fetchAllRepos(username, user.public_repos);

  const repos = rawRepos
    .filter((r) => !r.fork) // don't include forks
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      updatedAt: r.updated_at,
    }));

  const counts = new Map<string, number>();
  for (const { language } of repos) {
    if (language) counts.set(language, (counts.get(language) ?? 0) + 1);
  }

  const topLanguages = [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    user: {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      url: user.html_url,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
    },
    repos,
    stats: {
      totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
      topLanguages,
    },
  };
}

export async function getProfile(username: string): Promise<Profile> {
  const key = username.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;

  const profile = await fetchProfile(username);
  cache.set(key, profile);
  return profile;
}
