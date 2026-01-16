import { Hono } from "hono";

const app = new Hono();

app.get("/:id", (c) => {
  return c.json(`Hello user ${c.req.param("id")}`);
});

export default app;
