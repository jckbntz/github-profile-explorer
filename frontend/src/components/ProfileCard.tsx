import type { Profile } from "../types/profile";

function Stats({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <dd>{value.toLocaleString()}</dd>
      <dt>{label}</dt>
    </div>
  );
}

export function ProfileCard({ profile }: { profile: Profile }) {
  const { user, stats } = profile;

  return (
    <section className="card profile">
      <img className="profile__avatar" src={user.avatarUrl} alt={user.username} />
      <div className="profile__body">
        <h2>
          <a href={user.url} target="_blank" rel="noreferrer">
            {user.name ?? user.username}
          </a>{" "}
          <span className="muted">@{user.username}</span>
        </h2>

        {user.bio && <p>{user.bio}</p>}

        {user.location && <p className="muted">{user.location}</p>}

        <dl className="stats">
          <Stats label="followers" value={user.followers} />
          <Stats label="following" value={user.following} />
          <Stats label="repos" value={user.publicRepos} />
          <Stats label="stars" value={stats.totalStars} />
        </dl>

        {stats.topLanguages.length > 0 && (
          <ul className="chips">
            {stats.topLanguages.map((l) => (
              <li key={l.name}>
                {l.name} <span className="muted">&times;{l.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
