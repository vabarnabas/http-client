import { Database } from "@/types/db.types";
import { Request } from "@/types/request.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RequestStore {
  requests: Request[];
  databases: Database[];
  variables: { [key: string]: string };
  saveRequest: (request: Request) => void;
  removeRequest: (id: string) => void;
  updateRequest: (id: string, request: Request) => void;
  saveDatabase: (request: Database) => void;
  removeDatabase: (id: string) => void;
  updateDatabase: (id: string, request: Database) => void;
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      requests: [] as Request[],
      databases: [] as Database[],
      variables: {},
      saveRequest: (request) =>
        set((state) => ({ requests: [...state.requests, request] })),
      removeRequest: (id) =>
        set((state) => ({
          requests: state.requests.filter((req) => req.id !== id),
        })),
      updateRequest: (id, request) =>
        set((state) => {
          const reqIndex = state.requests.findIndex((req) => req.id === id);

          if (reqIndex === -1) return state;

          const newRequests = state.requests;

          newRequests[reqIndex] = request;

          return { requests: newRequests };
        }),
      saveDatabase: (database) =>
        set((state) => ({ databases: [...state.databases, database] })),
      removeDatabase: (id) =>
        set((state) => ({
          databases: state.databases.filter((db) => db.id !== id),
        })),
      updateDatabase: (id, database) =>
        set((state) => {
          const dbIndex = state.databases.findIndex((db) => db.id === id);

          if (dbIndex === -1) return state;

          const newDatabases = state.databases;

          newDatabases[dbIndex] = database;

          return { databases: newDatabases };
        }),
    }),
    { name: "request-store" }
  )
);
