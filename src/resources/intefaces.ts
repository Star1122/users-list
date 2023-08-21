export interface User {
  id: number;
  login: string;
  avatar_url: string;
  url: string;
}

export interface UserDetail extends User {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubSearchUserResult {
  total_count: number;
  items: User[];
}
