import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db, usersTable } from "~/db";
import { createUserSchema, getUserSchema, patchUserSchema } from "~/modules/users/users.schema";

const app = new Hono();

app.get("/", async (c) => {
  const users = await db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
      avatar: usersTable.avatar,
    })
    .from(usersTable);

  return c.json(users);
});

app.get("/:id", zValidator("param", getUserSchema), (c) => {
  const validated = c.req.valid("param");

  const user = db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
      avatar: usersTable.avatar,
    })
    .from(usersTable)
    .where(eq(usersTable.id, validated.id))
    .get();

  if (!user) return c.json({}, 404);

  return c.json(user);
});

app.post("/", zValidator("json", createUserSchema), async (c) => {
  const validated = c.req.valid("json");

  const existingUser = db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validated.email))
    .get();

  if (existingUser) return c.json({ error: { message: "This email is already taken." } }, 400);

  const newUser = {
    ...validated,
    password: Bun.password.hashSync(validated.password),
  };

  await db.insert(usersTable).values(newUser);

  return c.json({}, 201);
});

app.patch(
  "/:id",
  zValidator("param", getUserSchema),
  zValidator("json", patchUserSchema),
  async (c) => {
    const validated = {
      param: c.req.valid("param"),
      json: c.req.valid("json"),
    };

    if (!validated.json.firstname && !validated.json.lastname && !validated.json.email)
      return c.json({ error: { message: "There are no changes to be made." } }, 400);

    const user = db.select().from(usersTable).where(eq(usersTable.id, validated.param.id)).get();

    if (!user) return c.json({}, 404);

    await db
      .update(usersTable)
      .set({
        firstname: validated.json.firstname,
        lastname: validated.json.lastname,
        email: validated.json.email,
      })
      .where(eq(usersTable.id, user.id));

    return c.json({}, 200);
  },
);

app.delete("/:id", zValidator("param", getUserSchema), async (c) => {
  const validated = c.req.valid("param");

  const user = db.select().from(usersTable).where(eq(usersTable.id, validated.id)).get();

  if (!user) return c.json({}, 404);

  await db.delete(usersTable).where(eq(usersTable.id, user.id));

  return c.json({}, 200);
});

export default app;
