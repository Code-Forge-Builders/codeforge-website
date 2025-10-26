export interface GithubUserData {
  login: string
  avatar_url: string
  html_url: string
  name: string
  bio: string
}

export async function fetchGithubUserData(userName: string): Promise<GithubUserData | null> {
  if (!userName) return null;

  const revalidatePeriod = 60 * 60; // revalidate every hour

  const response = await fetch(`https://api.github.com/users/${userName}`, {
    next: { revalidate: revalidatePeriod }
  });

  if (!response.ok) throw new Error(`Failed to fetch ${userName}`);

  const data: GithubUserData = await response.json()

  return data
}
