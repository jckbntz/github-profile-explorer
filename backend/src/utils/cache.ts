interface Entry<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<T> {
  private store = new Map<string, Entry<T>>();

  constructor(
    private ttlMs: number,
    private maxEntries = 500,
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;

      if (oldest !== undefined) this.store.delete(oldest);
    }

    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
