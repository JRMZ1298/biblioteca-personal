import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGenres } from "../../hooks/use-genres";
import { previewImport, importBook } from "../../services/export-import";
import { toastError, toastSuccess } from "../../lib/toast";
import Button from "../ui/button";
import type { ImportPreviewBook, ImportPreviewResponse } from "../../types/import-export";

type Step = "select" | "preview" | "import" | "summary";

interface ParsedBook {
  title: string
  author: string
  description?: string
  thumbnail?: string
  pages?: number
  published_date?: string
  google_books_id?: string
  genres?: string[]
  status?: string
  current_page?: number
  rating?: number
  started_at?: string
  finished_at?: string
  notes?: { content: string; page_number?: number | null }[]
}

interface ImportResult {
  row: number
  title: string
  author: string
  status: "imported" | "skipped" | "error"
  error?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  const previousRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;
    previousRef.current = document.activeElement;

    const timer = setTimeout(() => {
      containerRef.current?.focus();
    }, 0);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return;
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      (previousRef.current as HTMLElement)?.focus?.();
    };
  }, [active, containerRef]);
}

function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const err = e as { response?: { data?: { detail?: string } } };
    return err.response?.data?.detail || "Error al importar";
  }
  return "Error al importar";
}

export default function BookImportWizard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const fileRef = useRef<File | null>(null);
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [parsedBooks, setParsedBooks] = useState<ParsedBook[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [importingAll, setImportingAll] = useState(false);
  const [importingCurrent, setImportingCurrent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const { data: genres = [] } = useGenres();

  useFocusTrap(open, dialogRef);

  const genreMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of genres) {
      map.set(g.name.toLowerCase(), g.id);
    }
    return map;
  }, [genres]);

  function getGenreIds(names: string[] | undefined): string[] {
    if (!names) return [];
    return names
      .map((n) => genreMap.get(n.toLowerCase()))
      .filter((id): id is string => !!id);
  }

  function reset() {
    setStep("select");
    fileRef.current = null;
    setPreview(null);
    setParsedBooks([]);
    setCurrentIndex(0);
    setResults([]);
    setImportingAll(false);
    setImportingCurrent(false);
    setError(null);
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  function handleEscape(e: React.KeyboardEvent) {
    if (e.key === "Escape") handleClose();
  }

  async function handleFileSelect(f: File) {
    fileRef.current = f;
    setError(null);
    try {
      const result = await previewImport(f);
      setPreview(result);

      const text = await f.text();
      let books: ParsedBook[];
      if (f.name.endsWith(".csv")) {
        books = parseCsvBooks(text);
      } else {
        books = parseJsonBooks(text);
      }
      setParsedBooks(books);
      setStep("preview");
    } catch {
      setError("Error al procesar el archivo. Verifica que sea un JSON o CSV válido.");
    }
  }

  function parseJsonBooks(text: string): ParsedBook[] {
    const data = JSON.parse(text);
    const list = Array.isArray(data) ? data : data.books ?? [];
    return list;
  }

  function parseCsvBooks(text: string): ParsedBook[] {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const result: ParsedBook[] = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map((v) => v.trim());
      const book: Record<string, string> = {};
      headers.forEach((h, idx) => {
        book[h] = vals[idx] ?? "";
      });
      result.push({
        title: book.title ?? "",
        author: book.author ?? "",
        description: book.description || undefined,
        thumbnail: book.thumbnail || undefined,
        pages: book.pages ? Number(book.pages) : undefined,
        published_date: book.published_date || undefined,
        google_books_id: book.google_books_id || undefined,
        genres: book.genres ? book.genres.split("|").map((g) => g.trim()).filter(Boolean) : undefined,
        status: book.status || undefined,
        current_page: book.current_page ? Number(book.current_page) : undefined,
        rating: book.rating ? Number(book.rating) : undefined,
        started_at: book.started_at || undefined,
        finished_at: book.finished_at || undefined,
      });
    }
    return result;
  }

  const newBooks = useCallback(() => {
    if (!preview) return [];
    const indexMap = new Map<number, ParsedBook>();
    parsedBooks.forEach((b, i) => indexMap.set(i + 1, b));
    return preview.books.filter((pb) => !pb.exists).map((pb) => ({
      preview: pb,
      data: indexMap.get(pb.row) ?? null,
    }));
  }, [preview, parsedBooks]);

  async function handleImportOne(row: number) {
    setImportingCurrent(true);
    const bookData = parsedBooks[row - 1];
    if (!bookData) {
      setImportingCurrent(false);
      return;
    }
    try {
      await importBook({
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        thumbnail: bookData.thumbnail,
        pages: bookData.pages,
        published_date: bookData.published_date,
        google_books_id: bookData.google_books_id,
        genre_ids: getGenreIds(bookData.genres),
        status: bookData.status,
        current_page: bookData.current_page,
        rating: bookData.rating,
        started_at: bookData.started_at,
        finished_at: bookData.finished_at,
      });
      results.push({ row, title: bookData.title, author: bookData.author, status: "imported" });
      setResults([...results]);
      toastSuccess(`"${bookData.title}" importado`);
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      results.push({ row, title: bookData.title, author: bookData.author, status: "error", error: msg });
      setResults([...results]);
      toastError(msg);
    }
    setImportingCurrent(false);
    advanceOrFinish();
  }

  async function handleSkipOne() {
    const nb = newBooks();
    if (currentIndex < nb.length) {
      const bookData = nb[currentIndex].data;
      results.push({
        row: nb[currentIndex].preview.row,
        title: bookData?.title ?? nb[currentIndex].preview.title,
        author: bookData?.author ?? nb[currentIndex].preview.author,
        status: "skipped",
      });
      setResults([...results]);
    }
    advanceOrFinish();
  }

  function advanceOrFinish() {
    const nb = newBooks();
    if (currentIndex + 1 < nb.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setStep("summary");
    }
  }

  async function handleImportAll() {
    setImportingAll(true);
    const nb = newBooks();
    for (let i = currentIndex; i < nb.length; i++) {
      const bookData = nb[i].data;
      if (!bookData) continue;
      try {
        await importBook({
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          thumbnail: bookData.thumbnail,
          pages: bookData.pages,
          published_date: bookData.published_date,
          google_books_id: bookData.google_books_id,
          genre_ids: getGenreIds(bookData.genres),
          status: bookData.status,
          current_page: bookData.current_page,
          rating: bookData.rating,
          started_at: bookData.started_at,
          finished_at: bookData.finished_at,
        });
        results.push({ row: nb[i].preview.row, title: bookData.title, author: bookData.author, status: "imported" });
        setResults([...results]);
      } catch (e: unknown) {
        const msg = getErrorMessage(e);
        results.push({ row: nb[i].preview.row, title: bookData.title, author: bookData.author, status: "error", error: msg });
        setResults([...results]);
      }
    }
    setImportingAll(false);
    setStep("summary");
  }

  const nb = newBooks();
  const currentBook = nb[currentIndex] ?? null;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Importar
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="import-wizard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onKeyDown={handleEscape}
          >
            <div className="fixed inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Importar libros"
              tabIndex={-1}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative z-10 w-full max-w-xl rounded-xl border border-hairline bg-surface-card p-6 shadow-card mx-4 max-h-[80vh] overflow-y-auto outline-none"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-title-md text-ink">Importar libros</h2>
                  <StepIndicator current={step} />
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Cerrar"
                  className="text-muted-soft hover:text-ink transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div role="alert" className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-body-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === "select" && (
                  <SelectStep
                    key="select"
                    onFile={handleFileSelect}
                  />
                )}
                {step === "preview" && preview && (
                  <PreviewStep
                    key="preview"
                    preview={preview}
                    onStart={() => {
                      if (nb.length === 0) {
                        setStep("summary");
                      } else {
                        setCurrentIndex(0);
                        setStep("import");
                      }
                    }}
                    onBack={() => {
                      reset();
                      setOpen(false);
                    }}
                  />
                )}
                {step === "import" && currentBook && (
                  <ImportStep
                    key="import"
                    book={currentBook}
                    index={currentIndex}
                    total={nb.length}
                    importing={importingCurrent}
                    onImport={() => handleImportOne(currentBook.preview.row)}
                    onSkip={handleSkipOne}
                    onImportAll={handleImportAll}
                    importingAll={importingAll}
                  />
                )}
                {step === "summary" && (
                  <SummaryStep
                    key="summary"
                    results={results}
                    preview={preview}
                    onClose={handleClose}
                    onBack={() => setStep("select")}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: Step[] = ["select", "preview", "import", "summary"];
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              i <= idx ? "bg-primary" : "bg-hairline-strong"
            }`}
          />
          {i < steps.length - 1 && (
            <div
              className={`w-4 h-px ${
                i < idx ? "bg-primary" : "bg-hairline-strong"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectStep({ onFile }: { onFile: (f: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json,.csv"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Seleccionar archivo JSON o CSV"
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-hairline-strong hover:border-primary hover:bg-surface-strong"
        }`}
      >
        <svg className="w-10 h-10 mx-auto mb-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <p className="text-body text-ink mb-1">
          Arrastra un archivo o haz clic para seleccionar
        </p>
        <p className="text-caption text-muted">JSON o CSV</p>
      </div>
    </motion.div>
  );
}

function PreviewStep({
  preview,
  onStart,
  onBack,
}: {
  preview: ImportPreviewResponse
  onStart: () => void
  onBack: () => void
}) {
  const countNew = preview.books.filter((b) => !b.exists).length;
  const countExists = preview.books.filter((b) => b.exists).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <p className="text-body-sm text-muted mb-4">
        Se encontraron <strong className="text-ink">{preview.total}</strong> libros (
        <span className="text-green-600 dark:text-green-400">{countNew} nuevos</span>
        {countExists > 0 && (
          <span className="text-amber-600 dark:text-amber-400">
            , {countExists} ya en tu biblioteca
          </span>
        )}
        ).
      </p>

      <div className="max-h-60 overflow-y-auto border border-hairline rounded-lg divide-y divide-hairline mb-5">
        {preview.books.map((pb) => (
          <div key={pb.row} className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-caption text-muted-soft w-6 shrink-0">#{pb.row}</span>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-ink truncate">{pb.title}</p>
              <p className="text-caption text-muted truncate">{pb.author}</p>
            </div>
            <span
              className={`text-caption-uppercase shrink-0 ${
                pb.exists
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {pb.exists ? "Existe" : "Nuevo"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>Cancelar</Button>
        <Button onClick={onStart}>
          {countNew === 0 ? "Ver resumen" : `Importar ${countNew} libro${countNew !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </motion.div>
  );
}

function ImportStep({
  book,
  index,
  total,
  importing,
  onImport,
  onSkip,
  onImportAll,
  importingAll,
}: {
  book: { preview: ImportPreviewBook; data: ParsedBook | null }
  index: number
  total: number
  importing: boolean
  onImport: () => void
  onSkip: () => void
  onImportAll: () => void
  importingAll: boolean
}) {
  const d = book.data;
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-caption text-muted">
          Libro {index + 1} de {total}
        </p>
        <div className="w-24 h-1.5 rounded-full bg-hairline overflow-hidden" role="progressbar" aria-valuenow={index + 1} aria-valuemin={0} aria-valuemax={total} aria-label="Progreso de importación">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        {d?.thumbnail && (
          <img
            src={d.thumbnail}
            alt={"Portada de " + (d?.title ?? book.preview.title)}
            className="w-20 h-28 object-cover rounded-lg shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-title-sm text-ink mb-1">{d?.title ?? book.preview.title}</h3>
          <p className="text-body-sm text-muted mb-2">{d?.author ?? book.preview.author}</p>
          {d?.pages && <p className="text-caption text-muted-soft">{d.pages} páginas</p>}
          {d?.genres && d.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {d.genres.map((g) => (
                <span key={g} className="rounded-pill px-2 py-0.5 bg-surface-strong text-caption text-muted">
                  {g}
                </span>
              ))}
            </div>
          )}
          {d?.status && (
            <span className="inline-block mt-2 rounded-pill px-2.5 py-0.5 text-caption-uppercase bg-surface-strong text-muted">
              {d.status}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onSkip} disabled={importing || importingAll}>
          Saltar
        </Button>
        <Button variant="outline" size="sm" onClick={onImportAll} disabled={importing || importingAll}>
          {importingAll ? "Importando..." : "Importar todos"}
        </Button>
        <Button onClick={onImport} disabled={importing || importingAll} className="ml-auto">
          {importing ? "Importando..." : "Importar"}
        </Button>
      </div>
    </motion.div>
  );
}

function SummaryStep({
  results,
  preview,
  onClose,
  onBack,
}: {
  results: ImportResult[]
  preview: ImportPreviewResponse | null
  onClose: () => void
  onBack: () => void
}) {
  const imported = results.filter((r) => r.status === "imported").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;
  const existedCount = preview ? preview.books.filter((b) => b.exists).length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center">
          <p className="font-title-lg text-green-700 dark:text-green-300">{imported}</p>
          <p className="text-caption text-green-600 dark:text-green-400">Importados</p>
        </div>
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
          <p className="font-title-lg text-amber-700 dark:text-amber-300">{skipped + existedCount}</p>
          <p className="text-caption text-amber-600 dark:text-amber-400">Omitidos</p>
        </div>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-center">
          <p className="font-title-lg text-red-700 dark:text-red-300">{errors}</p>
          <p className="text-caption text-red-600 dark:text-red-400">Errores</p>
        </div>
      </div>

      {results.length > 0 && (
        <div className="max-h-40 overflow-y-auto border border-hairline rounded-lg divide-y divide-hairline mb-5">
          {results.map((r) => (
            <div key={r.row} className="flex items-center gap-3 px-4 py-2">
              <span className="text-caption text-muted-soft w-6 shrink-0">#{r.row}</span>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-ink truncate">{r.title}</p>
                <p className="text-caption text-muted truncate">{r.author}</p>
              </div>
              <span
                className={`text-caption-uppercase shrink-0 ${
                  r.status === "imported"
                    ? "text-green-600 dark:text-green-400"
                    : r.status === "error"
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted"
                }`}
              >
                {r.status === "imported" ? "Importado" : r.status === "error" ? "Error" : "Saltado"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>Importar otro archivo</Button>
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </motion.div>
  );
}
