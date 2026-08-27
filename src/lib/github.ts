export const getGitHubStars = async (urls: (string | null | undefined)[]) => {
  const entries = urls
    .filter((url): url is string => Boolean(url))
    .map((url) => [url, toRepository(url)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));
  const repositories = [...new Set(entries.map(([, repository]) => repository))];
  const stars = Object.fromEntries(
    await Promise.all(
      repositories.map(async (repository) => {
        try {
          const token = import.meta.env.GITHUB_TOKEN;
          const response = await fetch(`https://api.github.com/repos/${repository}`, {
            headers: {
              Accept: "application/vnd.github+json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "User-Agent": "syahrul-portfolio",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          });
          if (!response.ok) return [repository, null] as const;

          const { stargazers_count } = (await response.json()) as { stargazers_count: number };
          return [repository, stargazers_count] as const;
        } catch {
          return [repository, null] as const;
        }
      }),
    ),
  );

  return Object.fromEntries(entries.map(([url, repository]) => [url, stars[repository]]));
};

const toRepository = (url: string) => {
  const { hostname, pathname } = new URL(url);
  if (hostname !== "github.com") return null;

  const [owner, repository] = pathname.split("/").filter(Boolean);
  return owner && repository ? `${owner}/${repository}` : null;
};
