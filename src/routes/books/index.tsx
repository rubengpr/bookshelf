import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { Trash2, Edit, Plus, BookOpen, Star, Crown, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { usePremiumStatus } from "~/hooks/usePremiumStatus";
import { useState } from "react";
import { PaywallModal } from "~/components/PaywallModal";

export const Route = createFileRoute("/books/")({
  component: BooksPage,
});

function BooksPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isPremium } = usePremiumStatus();
  const [showPaywall, setShowPaywall] = useState(false);

  const booksQuery = useQuery(trpc.getBooks.queryOptions());
  const bookCountQuery = useQuery(trpc.getBookCount.queryOptions());

  const deleteBookMutation = useMutation(
    trpc.deleteBook.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getBooks.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getBookCount.queryKey() });
        toast.success("Book deleted successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete book");
      },
    })
  );

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBookMutation.mutate({ id });
    }
  };

  const handleAddBookClick = () => {
    const bookCount = bookCountQuery.data?.count || 0;
    if (!isPremium && bookCount >= 5) {
      setShowPaywall(true);
    } else {
      // Navigate to add book page (handled by Link component)
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read":
        return "bg-green-100 text-green-800";
      case "reading":
        return "bg-blue-100 text-blue-800";
      case "to-read":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "to-read":
        return "To Read";
      case "reading":
        return "Reading";
      case "read":
        return "Read";
      default:
        return status;
    }
  };

  if (booksQuery.isLoading || bookCountQuery.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );
  }

  if (booksQuery.error || bookCountQuery.error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">Error loading books</div>
      </div>
    );
  }

  const books = booksQuery.data || [];
  const bookCount = bookCountQuery.data?.count || 0;
  const isAtLimit = !isPremium && bookCount >= 5;
  const isNearLimit = !isPremium && bookCount >= 3;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            My Books
            {isPremium && <Crown className="h-6 w-6 text-yellow-500" />}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-600">
              Manage your reading collection ({bookCount} books)
            </p>
            {isPremium && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Premium
              </span>
            )}
          </div>
          {isNearLimit && !isPremium && (
            <div className="flex items-center gap-2 mt-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                {bookCount}/5 books used. Upgrade to add unlimited books.
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {isAtLimit ? (
            <button
              onClick={handleAddBookClick}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Add More
            </button>
          ) : (
            <Link
              to="/books/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Book
            </Link>
          )}
          {!isPremium && (
            <button
              onClick={() => setShowPaywall(true)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Crown className="h-3 w-3" />
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
          <p className="text-gray-600 mb-4">Start building your reading collection!</p>
          <Link
            to="/books/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  {book.genre && (
                    <p className="text-sm text-gray-500 mb-2">{book.genre}</p>
                  )}
                  {book.publicationYear && (
                    <p className="text-sm text-gray-500 mb-2">
                      Published: {book.publicationYear}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/books/$bookId/edit"
                    params={{ bookId: book.id.toString() }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="text-red-600 hover:text-red-800 p-1"
                    disabled={deleteBookMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    book.readStatus
                  )}`}
                >
                  {formatStatus(book.readStatus)}
                </span>
                {book.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{book.rating}/5</span>
                  </div>
                )}
              </div>

              {book.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-3">{book.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </div>
  );
}
