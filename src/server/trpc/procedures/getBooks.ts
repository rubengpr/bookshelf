import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

export const getBooks = baseProcedure.query(async () => {
  const books = await db.book.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return books;
});
