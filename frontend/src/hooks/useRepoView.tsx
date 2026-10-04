import { useMemo, useState } from "react";
import type { Repo } from "../types/profile";

export type SortKey = "updated" | "stars" | "name";

const sorters: Record<SortKey, (a: Repo, b: Repo) => number> = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  stars: (a, b) => b.stars - a.stars,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function useRepoView(repos: Repo[]) {
  const [sort, setSort] = useState<SortKey>("updated");

  const [language, setLanguage] = useState("all");

  const languages = useMemo(
    () => [...new Set(repos.map((r) => r.language).filter((l): l is string => !!l))].sort(),
    [repos],
  );

  const visible = useMemo(
    () => repos.filter((r) => language === "all" || r.language === language).sort(sorters[sort]),
    [repos, sort, language],
  );

  return { visible, languages, sort, setSort, language, setLanguage };
}
