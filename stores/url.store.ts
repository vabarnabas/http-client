import { Request } from "@/types/request.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RequestStore {
  requests: Request[];
  variables: { [key: string]: string };
  saveRequest: (request: Request) => void;
  removeRequest: (id: string) => void;
  updateRequest: (id: string, request: Request) => void;
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      requests: [] as Request[],
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
    }),
    { name: "request-store" }
  )
);
