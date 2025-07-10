import {
  Outlet,
  createRootRoute,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import { TRPCReactProvider } from "~/trpc/react";
import { BookOpen } from "lucide-react";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <TRPCReactProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <BookOpen className="h-6 w-6" />
                My Books
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  to="/books"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  activeProps={{
                    className: "text-blue-600",
                  }}
                >
                  All Books
                </Link>
                <Link
                  to="/books/add"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Book
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        <Toaster position="top-right" />
      </div>
    </TRPCReactProvider>
  );
}
