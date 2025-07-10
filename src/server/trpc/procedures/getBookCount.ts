import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

export const getBookCount = baseProcedure.query(async () => {
  const count = await db.book.count();
  return { count };
});
