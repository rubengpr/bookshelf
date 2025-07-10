import {
  createCallerFactory,
  createTRPCRouter,
  baseProcedure,
} from "~/server/trpc/main";
import { getBooks } from "./procedures/getBooks";
import { getBook } from "./procedures/getBook";
import { createBook } from "./procedures/createBook";
import { updateBook } from "./procedures/updateBook";
import { deleteBook } from "./procedures/deleteBook";
import { getBookCount } from "./procedures/getBookCount";
import { createStripeCheckoutSession } from "./procedures/createStripeCheckoutSession";
import { verifyStripePayment } from "./procedures/verifyStripePayment";

export const appRouter = createTRPCRouter({
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBookCount,
  createStripeCheckoutSession,
  verifyStripePayment,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
