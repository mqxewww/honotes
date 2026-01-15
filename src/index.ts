import { Hono } from "hono";
import { config } from "./config";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: config.API_PORT,
  fetch: app.fetch,
};
