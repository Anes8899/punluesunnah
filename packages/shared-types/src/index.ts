// Contracts between apps/web and the services. Every service returns exactly
// these shapes, and the web app types its fetches with them. Types only: this
// package must never grow a runtime export, so `import type` always suffices.

export * from "./content";
export * from "./quran";
export * from "./prayer";
