import { Database } from "@/types/db.types"
import { Request } from "@/types/request.types"

export function getMethodColor(element: Request | Database) {
  return {
    "text-emerald-500": element?.method === "GET",
    "text-blue-500": element.method === "POST",
    "text-amber-500": element.method === "PUT",
    "text-rose-500": element.method === "DELETE",
    "text-purple-500": element.method === "PG",
  }
}
