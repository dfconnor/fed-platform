/**
 * Vitest setup file.
 *
 * Node.js 22+ ships a built-in `localStorage` (Map-like, no setItem/getItem)
 * that shadows jsdom's spec-compliant implementation. This polyfill restores
 * a proper Storage interface so libraries like Zustand persist work correctly.
 */

const storage: Record<string, string> = {};

const localStoragePolyfill: Storage = {
  getItem(key: string) {
    return storage[key] ?? null;
  },
  setItem(key: string, value: string) {
    storage[key] = String(value);
  },
  removeItem(key: string) {
    delete storage[key];
  },
  clear() {
    for (const key of Object.keys(storage)) {
      delete storage[key];
    }
  },
  get length() {
    return Object.keys(storage).length;
  },
  key(index: number) {
    return Object.keys(storage)[index] ?? null;
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStoragePolyfill,
  writable: true,
  configurable: true,
});

// jsdom env only — node env tests (API routes) don't have a `window`.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: localStoragePolyfill,
    writable: true,
    configurable: true,
  });
}
