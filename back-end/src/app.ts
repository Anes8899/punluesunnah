import express from "express";
import routes from "./routes";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
