
export type Role = {
  id: number,
  name: string,
  description: string,
  permissions: string[],
  createdAt?: string,
  updatedAt?: string
}