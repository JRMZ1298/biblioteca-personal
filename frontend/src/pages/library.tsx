import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/use-books";
import BookCard from "../components/book/book-card";
import BookForm from "../components/book/book-form";
import {
  Modal,
  EmptyState,
  Button,
  Input,
  BookCardSkeleton,
} from "../components/ui";
import type { ReadingStatus } from "../types/book";

const statusFilters: { label: string; value: ReadingStatus | undefined }[] = [
  { label: "Todos", value: undefined },
  { label: "Pendiente", value: "PENDING" },
  { label: "Leyendo", value: "READING" },
  { label: "Leído", value: "COMPLETED" },
];

export default function Library() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ReadingStatus | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: books, isLoading } = useBooks(filter);

  const filtered = (books ?? []).filter(
    (ub) =>
      !search ||
      ub.book.title.toLowerCase().includes(search.toLowerCase()) ||
      ub.book.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-display-sm text-ink">Biblioteca</h1>
        <Button onClick={() => setShowForm(true)}>Agregar libro</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por título o autor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.value)}
              className={`rounded-pill px-3.5 py-1.5 text-caption-uppercase transition-colors ${
                filter === f.value
                  ? "bg-primary text-white"
                  : "bg-surface-strong text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-x-lg gap-y-section items-start">
          {Array.from({ length: 10 }).map((_, i) => (
            <BookCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            search || filter ? "Sin resultados" : "Tu biblioteca está vacía"
          }
          description={
            search || filter
              ? "Prueba con otros filtros o términos de búsqueda."
              : "Agrega tu primer libro para empezar."
          }
          action={
            !search && !filter ? (
              <Button onClick={() => setShowForm(true)}>Agregar libro</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-x-lg gap-y-[40px] items-start">
          {filtered.map((ub, i) => (
            <BookCard
              key={ub.id}
              userBook={ub}
              index={i}
              onClick={() => navigate(`/books/${ub.id}`)}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Agregar libro"
      >
        <BookForm onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
