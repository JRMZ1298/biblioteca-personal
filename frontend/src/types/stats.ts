export interface OverviewStats {
  total_books: number
  total_pages: number
  completed_books: number
  reading_books: number
  pending_books: number
  avg_pages_per_book: number
  avg_reading_days: number
}

export interface FavoriteGenre {
  genre: string
  count: number
}

export interface TopAuthor {
  author: string
  count: number
}
