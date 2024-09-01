import createHttpClient from '@/clients/http';

const client = createHttpClient();

export function getUser(username: string) {
  return client.get<User>(`/users/${username}`);
}

export function getRepos(username: string, page: number) {
  return client.get<Repository[]>(
    `/users/${username}/repos?sort=pushed&page=${page}`
  );
}

type User = {
  name: string;
  location: string;
  login: string;
  avatar_url: string;
  username: string;
  followers: number;
  public_repos: number;
};

type Repository = {
  id: number;
  name: string;
  html_url: string;
  language: string | null;
  description: string | null;
  created_at: string;
  pushed_at: string;
};
