export interface Repo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
}

export interface Profile {
  user: {
    username: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    location: string | null;
    url: string;
    followers: number;
    following: number;
    publicRepos: number;
  };
  repos: Repo[];
  stats: {
    totalStars: number;
    topLanguages: { name: string; count: number }[];
  };
}
