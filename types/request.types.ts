export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface Request {
  id: string;
  name: string;
  method: RequestMethod;
  url: string;
  params?: { [key: string]: string };
  headers?: { [key: string]: string };
  body?: string;
  authentication?: {
    bearer?: string;
    apiKey?: string;
  };
}
