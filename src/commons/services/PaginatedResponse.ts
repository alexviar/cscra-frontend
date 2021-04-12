export type PaginatedResponse<T> = {
  meta: {
    total: number
  }
  records: T[]
}