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
    const vParam = c.req.valid("param");

    const user = db.select().from(usersTable).where(eq(usersTable.id, vParam.id)).get();

    if (!user) return c.json({}, 404);

    const vBody = c.req.valid("json");

    await db
      .update(usersTable)
      .set({ firstname: vBody.firstname, lastname: vBody.lastname, email: vBody.email })
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
