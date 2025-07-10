import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

export const getBook = baseProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const book = await db.book.findUnique({
      where: { id: input.id },
    });

    if (!book) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found",
      });
    }

    return book;
  });
