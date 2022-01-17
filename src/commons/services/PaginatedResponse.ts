export type PaginatedResponse<T> = {
  meta: {
    total: number,
    nextPage?: number
  }
  records: T[]
}