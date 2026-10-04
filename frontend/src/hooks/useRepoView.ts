import { useMemo, useState } from "react";
import type { Repo } from "../types/profile";

export type SortKey = "updated" | "stars" | "name";

const PAGE_SIZE = 5;

const sorters: Record<SortKey, (a: Repo, b: Repo) => number> = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  stars: (a, b) => b.stars - a.stars,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function useRepoView(repos: Repo[]) {
  const [sort, setSort] = useState<SortKey>("updated");

  const [language, setLanguage] = useState("all");

  const [limit, setLimit] = useState(PAGE_SIZE);

  const languages = useMemo(
    () => [...new Set(repos.map((r) => r.language).filter((l): l is string => !!l))].sort(),
    [repos],
  );

  const visible = useMemo(
    () => repos.filter((r) => language === "all" || r.language === language).sort(sorters[sort]),
    [repos, sort, language],
  );

  const changeSort = (s: SortKey) => {
    setSort(s);
    setLimit(PAGE_SIZE);
  };

  const changeLanguage = (l: string) => {
    setLanguage(l);
    setLimit(PAGE_SIZE);
  };

  return {
    visible,
    shown: visible.slice(0, limit),
    hasMore: visible.length > limit,
    showMore: () => setLimit((n) => n + PAGE_SIZE),
    languages,
    sort,
    setSort: changeSort,
    language,
    setLanguage: changeLanguage,
  };
}
