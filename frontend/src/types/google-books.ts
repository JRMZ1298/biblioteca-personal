export interface GoogleBookItem {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    pageCount?: number
    publishedDate?: string
    categories?: string[]
  }
}

export interface GoogleBooksResponse {
  items?: GoogleBookItem[]
  totalItems: number
}
