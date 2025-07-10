import { createFileRoute } from "@tanstack/react-router";
import { BookForm } from "~/components/BookForm";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/books/add/")({
  component: AddBookPage,
});

function AddBookPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Plus className="h-8 w-8" />
          Add New Book
        </h1>
        <p className="text-gray-600 mt-2">
          Add a new book to your reading collection
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <BookForm mode="create" />
      </div>
    </div>
  );
}
