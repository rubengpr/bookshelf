import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Plus, List } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Book Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Keep track of all the books you've read, are currently reading, 
            or want to read. Organize your personal library with ratings and notes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <List className="h-5 w-5" />
              View My Books
            </Link>
            <Link
              to="/books/add"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Add New Book
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Reading Status
            </h3>
            <p className="text-gray-600">
              Mark books as "To Read", "Reading", or "Read" to keep track of your progress.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="h-6 w-6 text-yellow-400 fill-current">
                    ★
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rate Your Books
            </h3>
            <p className="text-gray-600">
              Give your books a 1-5 star rating to remember how much you enjoyed them.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Personal Notes
            </h3>
            <p className="text-gray-600">
              Write down your thoughts, favorite quotes, or key takeaways from each book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
