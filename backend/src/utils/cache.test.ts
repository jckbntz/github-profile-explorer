import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TtlCache } from "./cache";

describe("TtlCache", () => {
  beforeEach(() => vi.useFakeTimers()); // control Date.now()
  afterEach(() => vi.useRealTimers());

  it("returns a stored value", () => {
    const cache = new TtlCache<number>(1000);
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
  });

  it("expires entries after the ttl", () => {
    const cache = new TtlCache<number>(1000);
    cache.set("a", 1);
    vi.advanceTimersByTime(1001);
    expect(cache.get("a")).toBeUndefined();
  });

  it("evicts the oldest entry when full", () => {
    const cache = new TtlCache<number>(1000, 2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });
});
