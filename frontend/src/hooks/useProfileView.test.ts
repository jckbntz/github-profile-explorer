import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRepoView } from "./useRepoView";
import type { Repo } from "../types/profile";

const repo = (o: Partial<Repo>): Repo => ({
  id: 0,
  name: "",
  description: null,
  url: "",
  stars: 0,
  forks: 0,
  language: null,
  updatedAt: "2024-01-01T00:00:00Z",
  ...o,
});

// Each sort key produces a different order, so every test is meaningful
const repos = [
  repo({
    id: 1,
    name: "b-app",
    stars: 20,
    language: "TypeScript",
    updatedAt: "2024-01-01T00:00:00Z",
  }),
  repo({ id: 2, name: "a-lib", stars: 5, language: "Go", updatedAt: "2024-03-01T00:00:00Z" }),
  repo({
    id: 3,
    name: "c-cli",
    stars: 50,
    language: "TypeScript",
    updatedAt: "2024-02-01T00:00:00Z",
  }),
  repo({ id: 4, name: "notes", stars: 1, language: null, updatedAt: "2023-01-01T00:00:00Z" }),
];

const ids = (visible: Repo[]) => visible.map((r) => r.id);

describe("useRepoView", () => {
  it("sorts by recently updated by default", () => {
    const { result } = renderHook(() => useRepoView(repos));
    expect(ids(result.current.visible)).toEqual([2, 3, 1, 4]);
  });

  it("sorts by stars", () => {
    const { result } = renderHook(() => useRepoView(repos));
    act(() => result.current.setSort("stars"));
    expect(ids(result.current.visible)).toEqual([3, 1, 2, 4]);
  });

  it("sorts by name", () => {
    const { result } = renderHook(() => useRepoView(repos));
    act(() => result.current.setSort("name"));
    expect(ids(result.current.visible)).toEqual([2, 1, 3, 4]);
  });

  it("lists unique languages, sorted, ignoring repos with none", () => {
    const { result } = renderHook(() => useRepoView(repos));
    expect(result.current.languages).toEqual(["Go", "TypeScript"]);
  });

  it("filters by language and keeps the current sort", () => {
    const { result } = renderHook(() => useRepoView(repos));
    act(() => result.current.setLanguage("TypeScript"));
    expect(ids(result.current.visible)).toEqual([3, 1]);
  });
});
