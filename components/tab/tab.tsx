import clsx from "clsx"
import React, { SyntheticEvent } from "react"
import { HiX } from "react-icons/hi"

import { getMethodColor } from "@/helpers/getColors"
import { usePersistingStore } from "@/stores/global.store"
import { Database } from "@/types/db.types"
import { Request } from "@/types/request.types"

interface Props {
  element: Request | Database
  id: string
  setId: (id: string) => void
}

export default function Tab({ element, id, setId }: Props) {
  const { removeEntity } = usePersistingStore()

  return (
    <div
      className={clsx(
        "cursor-pointer min-w-[14rem] max-w-[14rem] hover:bg-emerald-50 flex gap-x-4 py-2.5 rounded-lg px-4 items-center flex-1 transition-all duration-200 ease-in-out",
        id === element.id ? " bg-white" : "bg-slate-50"
      )}
      onClick={() => {
        setId(element.id)
      }}
    >
      <p className={clsx("text-xs", getMethodColor(element))}>
        {element.method}
      </p>
      <p className="w-0 flex-1 truncate text-sm">{element.name}</p>
      <HiX
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation()
          removeEntity(element.id)
          setId("")
        }}
        className="text-base cursor-pointer hover:text-slate-600 text-slate-800"
      />
    </div>
  )
}
