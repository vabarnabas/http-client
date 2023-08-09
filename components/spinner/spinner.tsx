import clsx from "clsx"
import React from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

interface Props {
  className?: string
}

export default function Spinner({ className }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[11rem]">
      <AiOutlineLoading3Quarters
        className={clsx("animate-spin text-3xl text-slate-300", className)}
      />
    </div>
  )
}
