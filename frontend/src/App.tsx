import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import StatusMessage from "./components/StatusMessage";
import SearchBar from "./components/SearchBar";
import { ProfileCard } from "./components/ProfileCard";
import { RepoList } from "./components/RepoList";

function App() {
  const [username, setUsername] = useState("");

  const { data, error, isLoading } = useProfile(username);

  return (
    <main className="app">
      <header className="app__header">
        <h1>gh-explorer</h1>
        <span className="muted">// github profile explorer</span>
      </header>

      <SearchBar onSearch={setUsername} disabled={isLoading} />

      {!username && <StatusMessage>enter a username to begin</StatusMessage>}

      {isLoading && <StatusMessage kind="loading">fetching {username}...</StatusMessage>}

      {error && <StatusMessage kind="error">{error.message}</StatusMessage>}

      {data && (
        <>
          <ProfileCard profile={data} />

          <RepoList key={data.user.name} repos={data.repos} />
        </>
      )}
    </main>
  );
}

export default App;
