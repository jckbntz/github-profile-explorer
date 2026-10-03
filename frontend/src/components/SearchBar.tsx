import { useState } from "react";

interface Props {
  onSearch: (username: string) => void;
  disabled?: boolean;
}

function SearchBar({ onSearch, disabled }: Props) {
  const [value, setValue] = useState("");

  const trimmed = value.trim();

  return (
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault();

        if (trimmed) onSearch(trimmed);
      }}>
      <span className="search__prompt">&#36;</span>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="github username"
        spellCheck={false}
        autoFocus
      />

      <button disabled={disabled || !trimmed}>search</button>
    </form>
  );
}

export default SearchBar;
