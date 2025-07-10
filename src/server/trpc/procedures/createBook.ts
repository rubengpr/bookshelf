import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

export const createBook = baseProcedure
  .input(
    z.object({
      title: z.string().min(1, "Title is required"),
      author: z.string().min(1, "Author is required"),
      genre: z.string().optional(),
      publicationYear: z.number().optional(),
      readStatus: z.enum(["to-read", "reading", "read"]).default("to-read"),
      rating: z.number().min(1).max(5).optional(),
      notes: z.string().optional(),
      isPremium: z.boolean().default(false),
    })
  )
  .mutation(async ({ input }) => {
    // Check if user has reached the 5-book limit (only for non-premium users)
    if (!input.isPremium) {
      const bookCount = await db.book.count();
      if (bookCount >= 5) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You've reached the limit of 5 books. Please upgrade to add more books.",
        });
      }
    }

    const book = await db.book.create({
      data: {
        title: input.title,
        author: input.author,
        genre: input.genre,
        publicationYear: input.publicationYear,
        readStatus: input.readStatus,
        rating: input.rating,
        notes: input.notes,
      },
    });
    return book;
  });
