import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Entity } from "@/types/entity.types"

interface PersistingStore {
  entities: Entity[]
  getEntities: () => Entity[]
  getItemById: (id: string) => Entity
  variables: string
  setVariables: (variables: string) => void
  saveEntity: (entity: Entity) => void
  removeEntity: (id: string) => void
  updateEntity: (id: string, entity: Entity) => void
}

export const usePersistingStore = create<PersistingStore>()(
  persist(
    (set, get) => ({
      entities: [] as Entity[],
      getEntities: () => get().entities,
      getItemById: (id) => {
        return get().entities.find((item) => item.id === id) as Entity
      },
      variables: "{}",
      setVariables: (variables) => set(() => ({ variables })),
      saveEntity: (entity) =>
        set((state) => ({ entities: [...state.entities, entity] })),
      removeEntity: (id) =>
        set((state) => ({
          entities: state.entities.filter((entity) => entity.id !== id),
        })),
      updateEntity: (id, entity) =>
        set((state) => {
          const entityIndex = state.entities.findIndex(
            (entity) => entity.id === id
          )

          if (entityIndex === -1) return state

          const newEntities = state.entities

          newEntities[entityIndex] = entity

          return { entities: newEntities }
        }),
    }),
    { name: "request-store" }
  )
)
