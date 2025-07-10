import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

export const updateBook = baseProcedure
  .input(
    z.object({
      id: z.number(),
      title: z.string().min(1, "Title is required"),
      author: z.string().min(1, "Author is required"),
      genre: z.string().optional(),
      publicationYear: z.number().optional(),
      readStatus: z.enum(["to-read", "reading", "read"]),
      rating: z.number().min(1).max(5).optional(),
      notes: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, ...updateData } = input;

    // Check if book exists
    const existingBook = await db.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found",
      });
    }

    const updatedBook = await db.book.update({
      where: { id },
      data: updateData,
    });

    return updatedBook;
  });
