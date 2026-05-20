import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import AuthGuard from "./components/auth/auth-guard";
import { Toaster } from "sileo";
import ErrorBoundary from "./components/error-boundary";
import AuthBackground from "./components/auth/auth-background";
import TopNav from "./components/layout/top-nav";
import Login from "./pages/login";
import Register from "./pages/register";
import Library from "./pages/library";
import BookDetail from "./pages/book-detail";
import GoogleBooks from "./pages/google-books";
import Dashboard from "./pages/dashboard";

function ProtectedLayout() {
  return (
    <AuthGuard>
      <TopNav />
      <div className="animate-fade-in">
        <Outlet />
      </div>
    </AuthGuard>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/library" element={<Library />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/search" element={<GoogleBooks />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-canvas font-sans text-body-md text-ink overflow-hidden">
        <AuthBackground />
        <Toaster
          position="top-right"
          options={{
            fill: "#171717",
            styles: { description: "text-white/75!" },
          }}
        />
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
}
