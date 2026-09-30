export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}
