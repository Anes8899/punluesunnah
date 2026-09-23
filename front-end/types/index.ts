// Contracts between app/ and server/. Every read returns exactly these
// shapes, and the pages type their calls with them. Types only: this folder
// must never grow a runtime export, so `import type` always suffices.

export * from "./content";
export * from "./quran";
export * from "./prayer";
