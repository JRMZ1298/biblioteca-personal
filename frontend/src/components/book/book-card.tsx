import type { UserBook } from "../../types/book";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "text-blue-500" },
  READING: { label: "Leyendo", className: "text-amber-500" },
  COMPLETED: { label: "Leído", className: "text-emerald-600" },
};

interface BookCardProps {
  userBook: UserBook;
  onClick?: () => void;
  index?: number;
}

function BookCardCompact({
  userBook,
  onClick,
}: {
  userBook: UserBook;
  onClick?: () => void;
}) {
  const { book, status } = userBook;
  const config = statusConfig[status];

  return (
    <article
      className="flex gap-3 group cursor-pointer md:hidden"
      onClick={onClick}
    >
      <div className="relative shrink-0 w-14 h-20 rounded-md overflow-hidden border border-hairline bg-surface-strong">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-card to-surface-strong p-1.5">
            <span className="text-[8px] font-display-md text-ink text-center opacity-60 leading-tight line-clamp-3">
              {book.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-body-md text-body-md text-ink truncate">
            {book.title}
          </h3>
          <span
            className={`shrink-0 text-[9px] uppercase tracking-widest font-semibold ${config.className}`}
          >
            {config.label}
          </span>
        </div>
        <p className="text-body-sm text-muted truncate mt-0.5">{book.author}</p>
      </div>
    </article>
  );
}

export default function BookCard({
  userBook,
  onClick,
  index = 0,
}: BookCardProps) {
  const { book, status } = userBook;
  const config = statusConfig[status];
  const isEven = index % 2 === 0;

  return (
    <>
      <BookCardCompact userBook={userBook} onClick={onClick} />
      <article
        className={`hidden md:flex flex-col gap-md group cursor-pointer ${isEven ? "" : "md:mt-12"}`}
        onClick={onClick}
      >
        <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-hairline bg-surface-strong">
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-card to-surface-strong p-xl">
              <h3 className="font-display-md text-display-md text-ink text-center opacity-80 mix-blend-multiply leading-tight">
                {book.title}
              </h3>
            </div>
          )}
          <div
            className={`absolute top-sm right-sm bg-gray-800/90 backdrop-blur-sm px-xs py-xxs rounded text-[10px] uppercase tracking-widest font-semibold border border-hairline ${config.className}`}
          >
            {config.label}
          </div>
        </div>
        <div>
          <h2 className="font-display-md text-display-sm text-ink leading-tight mb-xxs line-clamp-2">
            {book.title}
          </h2>
          <p className="font-body-md text-body-md text-muted">{book.author}</p>
        </div>
      </article>
    </>
  );
}
