import { useState } from "react";
import { useProfile } from "./hooks/useProfile";

function App() {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const { data, error, isFetching } = useProfile(username);

  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          setUsername(input.trim());
        }}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="GitHub username"
        />

        <button>Search</button>
      </form>

      {isFetching && <p>Loading...</p>}

      {error && <p>{error.message}</p>}

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}

export default App;
