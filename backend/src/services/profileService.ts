import { githubClient } from "../clients/githubClient";
import type { Profile } from "../types/profile";

export async function getProfile(username: string): Promise<Profile> {
  const [user, rawRepos] = await Promise.all([
    githubClient.getUser(username),
    githubClient.getRepos(username),
  ]);

  const repos = rawRepos
    .filter((r) => !r.fork)
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
