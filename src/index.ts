import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { config } from "~/config";
import usersRoute from "~/modules/users/users.route";

const app = new Hono();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  }),
);

app.use(etag());
app.use(logger());
app.use(secureHeaders());

app.route("/users", usersRoute);

export default {
  port: config.API_PORT,
  fetch: app.fetch,
};
