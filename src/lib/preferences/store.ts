import type { PreferenceValues } from "./types";

type Listener = () => void;

export class PreferenceStore {
  private values: PreferenceValues;
  private listeners = new Set<Listener>();

  constructor(initialValues: PreferenceValues) {
    this.values = { ...initialValues };
  }

  get<T>(key: string): T {
    return this.values[key] as T;
  }

  set<T>(key: string, value: T): void {
    this.values[key] = value;
    this.notify();
  }

  getAll(): PreferenceValues {
    return { ...this.values };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}
