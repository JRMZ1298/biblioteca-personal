import { useState } from "react";

interface RatingProps {
  value: number | null;
  onChange: (rating: number) => void;
  readonly?: boolean;
}

export default function Rating({ value, onChange, readonly }: RatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || value || 0);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            className={`text-5xl transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer"
            } ${active ? "text-[#e8b83a]" : "text-muted [text-shadow:_0_0_0_1px_#a8a29e] hover:text-[#e8b83a]/50"}`}
          >
            {active ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
