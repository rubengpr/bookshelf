import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

export const deleteBook = baseProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    // Check if book exists
    const existingBook = await db.book.findUnique({
      where: { id: input.id },
    });

    if (!existingBook) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found",
      });
    }

    await db.book.delete({
      where: { id: input.id },
    });

    return { success: true };
  });
