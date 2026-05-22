import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";
import Button from "../ui/button";

export default function TopNav() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const links = [
    { to: "/library", label: "Biblioteca" },
    { to: "/search", label: "Buscar" },
    { to: "/dashboard", label: "Estadisticas" },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-hairline bg-surface-card/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/library"
            className="font-display text-display-sm text-ink no-underline"
          >
            BP
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-nav-link transition-colors no-underline ${
                  location.pathname === link.to
                    ? "text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-caption text-muted hidden sm:block">
            {user?.username}
          </span>
          <button
            onClick={toggle}
            className="relative h-8 w-8 rounded-full border border-hairline-strong bg-surface-strong hover:bg-hairline transition-colors flex items-center justify-center"
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
          >
            <svg
              className="h-4 w-4 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {isDark ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              )}
            </svg>
          </button>
          <Button variant="ghost" size="sm" onClick={logout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
