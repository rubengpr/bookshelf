import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { BookForm } from "~/components/BookForm";
import { Edit } from "lucide-react";

export const Route = createFileRoute("/books/$bookId/edit/")({
  component: EditBookPage,
});

function EditBookPage() {
  const { bookId } = Route.useParams();
  const trpc = useTRPC();

  const bookQuery = useQuery(
    trpc.getBook.queryOptions({
      id: parseInt(bookId),
    })
  );

  if (bookQuery.isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-gray-600">Loading book...</div>
        </div>
      </div>
    );
  }

  if (bookQuery.error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-red-600">Error loading book</div>
        </div>
      </div>
    );
  }

  const book = bookQuery.data;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Edit className="h-8 w-8" />
          Edit Book
        </h1>
        <p className="text-gray-600 mt-2">
          Update the details for "{book.title}"
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <BookForm mode="edit" initialData={book} />
      </div>
    </div>
  );
}
