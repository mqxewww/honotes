import { Hono } from "hono";
import { config } from "~/config";
import usersRoute from "~/modules/users/users.route";

const app = new Hono();

app.route("/users", usersRoute);

export default {
  port: config.API_PORT,
  fetch: app.fetch,
};
