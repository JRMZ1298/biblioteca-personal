import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui";

export default function TopNav() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/library", label: "Biblioteca" },
    { to: "/search", label: "Buscar" },
    { to: "/dashboard", label: "Estadísticas" },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-hairline bg-white/90 backdrop-blur-sm">
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
          <Button variant="ghost" size="sm" onClick={logout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
