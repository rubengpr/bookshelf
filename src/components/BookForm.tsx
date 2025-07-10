import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useState } from "react";
import { PaywallModal } from "./PaywallModal";
import { usePremiumStatus } from "~/hooks/usePremiumStatus";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().optional(),
  publicationYear: z.number().optional(),
  readStatus: z.enum(["to-read", "reading", "read"]),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: BookFormData & { id: number };
  mode: "create" | "edit";
}

export function BookForm({ initialData, mode }: BookFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  const { isPremium } = usePremiumStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      readStatus: "to-read",
    },
  });

  const createBookMutation = useMutation(
    trpc.createBook.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getBooks.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getBookCount.queryKey() });
        toast.success("Book added successfully!");
        navigate({ to: "/books" });
      },
      onError: (error) => {
        if (error.message.includes("reached the limit")) {
          setShowPaywall(true);
        } else {
          toast.error(error.message || "Failed to add book");
        }
      },
    })
  );

  const updateBookMutation = useMutation(
    trpc.updateBook.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getBooks.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getBookCount.queryKey() });
        toast.success("Book updated successfully!");
        navigate({ to: "/books" });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update book");
      },
    })
  );

  const onSubmit = (data: BookFormData) => {
    if (mode === "create") {
      createBookMutation.mutate({ ...data, isPremium });
    } else if (initialData) {
      updateBookMutation.mutate({ ...data, id: initialData.id });
    }
  };

  const isLoading = createBookMutation.isPending || updateBookMutation.isPending;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            id="author"
            type="text"
            {...register("author")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <input
            id="genre"
            type="text"
            {...register("genre")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.genre && (
            <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
            Publication Year
          </label>
          <input
            id="publicationYear"
            type="number"
            {...register("publicationYear", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.publicationYear && (
            <p className="mt-1 text-sm text-red-600">{errors.publicationYear.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="readStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Read Status
          </label>
          <select
            id="readStatus"
            {...register("readStatus")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="read">Read</option>
          </select>
          {errors.readStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.readStatus.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating (1-5 stars)
          </label>
          <select
            id="rating"
            {...register("rating", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No rating</option>
            <option value={1}>1 star</option>
            <option value={2}>2 stars</option>
            <option value={3}>3 stars</option>
            <option value={4}>4 stars</option>
            <option value={5}>5 stars</option>
          </select>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            {...register("notes")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your thoughts about this book..."
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            {isLoading ? "Saving..." : mode === "create" ? "Add Book" : "Update Book"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/books" })}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </>
  );
}
