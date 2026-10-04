import type { SortKey } from "../hooks/useRepoView";

interface Props {
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  language: string;
  onLanguage: (language: string) => void;
  languages: string[];
}

export function RepoControls({ sort, onSort, language, onLanguage, languages }: Props) {
  return (
    <div>
      <label>sort</label>

      <select value={sort} onChange={(e) => onSort(e.target.value as SortKey)}>
        <option value="updated">recently updated</option>
        <option value="stars">most stars</option>
        <option value="name">name</option>
      </select>

      <label>language</label>

      <select value={language} onChange={(e) => onLanguage(e.target.value)}>
        <option value="all">all</option>

        {languages.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
