export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PG"

export interface EntityOptions {
  params?: { [key: string]: string }
  headers?: { [key: string]: string }
  body?: string
  authentication?: {
    bearer?: string
    apiKey?: string
  }
  lastQuery?: string
}

export interface Entity {
  id: string
  name: string
  url: string
  method: Method
  options?: EntityOptions
}
