import { loadEnv } from "./env.js";
import { buildApp } from "./app.js";

loadEnv();

const app = buildApp();
const port = Number(process.env.PORT ?? 4003);
await app.listen({ port, host: "0.0.0.0" });
