import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBook, useUpdateBook, useDeleteBook } from "../hooks/use-books";
import { useCreateNote, useDeleteNote } from "../hooks/use-notes";
import ProgressBar from "../components/book/progress-bar";
import Rating from "../components/book/rating";
import Notes from "../components/book/notes";
import GenreSelect from "../components/ui/genre-select";
import Spinner from "../components/ui/spinner";
import Button from "../components/ui/button";
import { toastSuccess, toastError } from "../lib/toast";
import type { ReadingStatus } from "../types/book";

const statusOptions: {
  label: string;
  value: ReadingStatus;
  variant: "default" | "warning" | "success";
}[] = [
  { label: "Pendiente", value: "PENDING", variant: "default" },
  { label: "Leyendo", value: "READING", variant: "warning" },
  { label: "Leído", value: "COMPLETED", variant: "success" },
];

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: userBook, isLoading } = useBook(id!);
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const createNote = useCreateNote(id!);
  const deleteNote = useDeleteNote(id!);

  const [status, setStatus] = useState<ReadingStatus>("PENDING");
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [genreIds, setGenreIds] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userBook) {
      setStatus(userBook.status);
      setCurrentPage(userBook.current_page);
      setRating(userBook.rating);
      setGenreIds(userBook.book.genres.map((g) => g.id));
      setThumbnail(userBook.book.thumbnail);
    }
  }, [userBook]);

  const hasChanges =
    userBook &&
    (status !== userBook.status ||
      currentPage !== userBook.current_page ||
      rating !== userBook.rating ||
      thumbnail !== userBook.book.thumbnail ||
      genreIds.join() !== userBook.book.genres.map((g) => g.id).join());

  const handleSave = useCallback(async () => {
    if (!id || !hasChanges) return;
    setSaving(true);
    try {
      await updateBook.mutateAsync({
        id,
        data: {
          status,
          current_page: currentPage ?? undefined,
          rating: rating ?? undefined,
          genre_ids: genreIds,
          thumbnail: thumbnail ?? undefined,
          ...(status === "COMPLETED" ? {} : { finished_at: undefined }),
          ...(status === "READING" && !userBook?.started_at
            ? { started_at: new Date().toISOString() }
            : {}),
        },
      });
      toastSuccess("Cambios guardados");
    } catch {
      toastError("Error al guardar");
    }
    setSaving(false);
  }, [
    id,
    status,
    currentPage,
    rating,
    genreIds,
    hasChanges,
    updateBook,
    userBook,
  ]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBook.mutateAsync(id);
      toastSuccess("Libro eliminado");
      navigate("/library");
    } catch {
      toastError("Error al eliminar");
    }
  };

  const handleCreateNote = async (data: {
    content: string;
    page_number: number | null;
  }) => {
    try {
      await createNote.mutateAsync(data);
      toastSuccess("Nota agregada");
    } catch {
      toastError("Error al agregar nota");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote.mutateAsync(noteId);
      toastSuccess("Nota eliminada");
    } catch {
      toastError("Error al eliminar nota");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!userBook) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-body-md text-muted">Libro no encontrado</p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => navigate("/library")}
        >
          Volver a la biblioteca
        </Button>
      </div>
    );
  }

  const { book } = userBook;
  const totalPages = book.pages ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-6 lg:py-8">
      <button
        onClick={() => navigate("/library")}
        className="text-caption text-muted hover:text-ink transition-colors mb-4"
      >
        ← Volver a biblioteca
      </button>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0 w-full sm:w-48">
          <div className="h-72 bg-surface-strong rounded-xl overflow-hidden mb-2">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-soft">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
            )}
          </div>
          <input
            type="text"
            value={thumbnail ?? ""}
            onChange={(e) => setThumbnail(e.target.value || null)}
            placeholder="URL de la portada…"
            aria-label="URL de la portada del libro"
            className="w-full rounded-lg border border-hairline bg-transparent px-3 py-1.5 text-caption text-ink placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <h1 className="font-display text-display-sm text-ink">
              {book.title}
            </h1>
            <p className="text-title-sm text-muted mt-0.5">{book.author}</p>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {statusOptions.map((opt) => {
              const isCompleted = status === "COMPLETED"
              const isBlocked = isCompleted && opt.value !== "COMPLETED"
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (isBlocked) return
                    if (opt.value === "COMPLETED" && totalPages > 0) {
                      setCurrentPage(totalPages)
                    }
                    setStatus(opt.value)
                  }}
                  className={`rounded-pill px-3.5 py-1.5 text-caption-uppercase transition-colors ${
                    status === opt.value
                      ? "bg-primary text-highlight"
                      : isBlocked
                        ? "bg-surface-strong text-muted-soft cursor-not-allowed"
                        : "bg-surface-strong text-muted hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {status !== "PENDING" && totalPages > 0 && (
            <ProgressBar
              current={currentPage}
              total={totalPages}
              onChange={(page) => {
                if (page >= (userBook.current_page ?? 0)) {
                  setCurrentPage(page)
                }
              }}
            />
          )}

          <GenreSelect value={genreIds} onChange={setGenreIds} minCount={1} />

          <div>
            <span className="text-caption font-medium text-body-strong block mb-1">
              Calificación
            </span>
            <Rating value={rating} onChange={setRating} />
          </div>

          <Notes
            notes={userBook.notes}
            totalPages={totalPages}
            onCreate={handleCreateNote}
            onDelete={handleDeleteNote}
            isPending={createNote.isPending}
          />

          {book.description && (
            <div>
              <span className="text-caption font-medium text-body-strong block mb-1">
                Descripción
              </span>
              <p className="text-body-sm text-body leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving || updateBook.isPending}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
            {hasChanges && (
              <Button variant="outline" onClick={() => navigate("/library")}>
                Descartar cambios
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBook.isPending}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
