import { useRepoView } from "../hooks/useRepoView";
import type { Repo } from "../types/profile";
import { RepoControls } from "./RepoControls";
import StatusMessage from "./StatusMessage";

export function RepoList({ repos }: { repos: Repo[] }) {
  const { visible, sort, setSort, language, setLanguage, languages } = useRepoView(repos);

  if (repos.length === 0) {
    return <StatusMessage>no original repositories</StatusMessage>;
  }

  return (
    <section>
      <div className="repos-header">
        <h3 className="section-title">
          repositories ({visible.length} / {repos.length})
        </h3>

        <RepoControls
          sort={sort}
          onSort={setSort}
          language={language}
          onLanguage={setLanguage}
          languages={languages}
        />
      </div>

      <ul className="repos">
        {visible.map((r) => (
          <li className="card repo" key={r.id}>
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.name}
            </a>

            {r.description && <p className="muted">{r.description}</p>}

            <div className="repo__meta">
              <span>&#x2605; {r.stars.toLocaleString()}</span>
              <span>&#127860; {r.forks.toLocaleString()}</span>

              {r.language && <span>{r.language}</span>}

              <span>updated {new Date(r.updatedAt).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
