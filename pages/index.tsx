import clsx from "clsx"
import copy from "copy-to-clipboard"
import React, { useState } from "react"
import { BsDatabaseFillAdd } from "react-icons/bs"
import { HiPlus, HiX } from "react-icons/hi"
import { IoMdSave } from "react-icons/io"
import { IoCopy } from "react-icons/io5"
import ScrollContainer from "react-indiana-drag-scroll"
import { v4 as uuidv4 } from "uuid"

import Hydrate from "@/components/hydrate/hydrate"
import Spinner from "@/components/spinner/spinner"
import { useRequestStore } from "@/stores/url.store"
import { DatabaseType } from "@/types/db.types"
import { RequestMethod } from "@/types/request.types"
import UrlHighLight from "@/components/url-highlight/url-highlight"

export default function Home() {
  const {
    saveRequest,
    removeRequest,
    updateRequest,
    saveDatabase,
    removeDatabase,
    updateDatabase,
    databases,
    requests,
  } = useRequestStore()
  const [id, setId] = useState("")
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [data, setData] = useState({})
  const [status, setStatus] = useState(0)
  const [statusCode, setStatusCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getData = async (url: string, method: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(url, { method })
      const json = await res.json()
      setStatus(res.status)
      setStatusCode(res.statusText)
      setData(json)
    } catch {
      console.log("error")
    } finally {
      setIsLoading(false)
    }
  }

  console.log(id)

  return (
    <Hydrate>
      <div className="h-screen w-screen text-slate-800">
        <div className="pt-4 inset-x-0 flex h-16 border-b px-6 items-center gap-x-1 bg-slate-200">
          <ScrollContainer className="w-full flex gap-1">
            {[...requests, ...databases].map((request) => (
              <div
                key={request.id}
                onClick={() => {
                  setUrl(request.url)
                  setMethod(request.method)
                  setId(request.id)
                  setData({})
                  setStatus(0)
                  setStatusCode("")
                }}
                className={clsx(
                  "cursor-pointer sm:max-w-[14rem] w-full max-w-sm hover:bg-emerald-50 flex gap-x-4 py-2.5 border rounded-lg px-4 items-center flex-1 transition-all duration-200 ease-in-out",
                  id === request.id ? " bg-white" : "bg-slate-50"
                )}
              >
                <p
                  className={clsx("text-sm", {
                    "text-emerald-500": request?.method === "GET",
                    "text-blue-500": request.method === "POST",
                    "text-amber-500": request.method === "PUT",
                    "text-rose-500": request.method === "DELETE",
                    "text-purple-500": request.method === "PG",
                  })}
                >
                  {request.method}
                </p>
                <p className="w-0 flex-1 truncate text-sm">{request.name}</p>
                <HiX
                  onClick={() => {
                    request.method === "PG"
                      ? removeDatabase(request.id)
                      : removeRequest(request.id)
                    setId("")
                  }}
                  className="text-base cursor-pointer"
                />
              </div>
            ))}
          </ScrollContainer>
          <div
            onClick={() => {
              setId("")
              setMethod("GET")
              setUrl("https://")
            }}
            className={clsx(
              "cursor-pointer flex gap-x-4 py-2.5 border rounded-lg px-4 items-center hover:bg-emerald-50 transition-all duration-200 ease-in-out text-lg",
              id === "" ? "bg-white" : "bg-slate-50"
            )}
          >
            <HiPlus />
          </div>
        </div>
        <div className="mt-2 inset-x-0 h-14 flex justify-center items-center px-6">
          <div className="border w-full rounded-lg flex px-4 h-12 gap-x-4 items-center justify-center">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as RequestMethod)}
              className={clsx("bg-white", {
                "text-emerald-500": method === "GET",
                "text-blue-500": method === "POST",
                "text-amber-500": method === "PUT",
                "text-rose-500": method === "DELETE",
                "text-purple-500": method === "PG",
              })}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PG">PG</option>
            </select>
            <div className="relative w-full h-full flex items-center justify-end flex-1">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  method === "PG"
                    ? "postgresql://username:password@host:port/dbname"
                    : "https://api.test.com"
                }
                type="text"
                className="w-full h-full flex outline-none text-transparent caret-black"
              />

              <div className="left-0 absolute pointer-events-none right-0 flex-1 truncate">
                <UrlHighLight text={url} isDb={method === "PG"} />
                {/* {url} */}
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-3">
              <IoMdSave
                onClick={() => {
                  // if (
                  //   method !== "PG"
                  //     ? url.match(
                  //         /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g
                  //       )
                  //     : url.match(/postgresql:(?:\/\/[^/]+\/)?(\w+)/g)
                  // ) {
                  if (id) {
                    method === "PG"
                      ? updateDatabase(id, {
                          id,
                          url,
                          method: method as DatabaseType,
                          name: url,
                        })
                      : updateRequest(id, {
                          id,
                          url,
                          method: method as RequestMethod,
                          name: url,
                        })
                  } else {
                    const id = uuidv4()
                    console.log(id)
                    method === "PG"
                      ? saveDatabase({
                          id,
                          name: url,
                          method: method as DatabaseType,
                          url,
                        })
                      : saveRequest({
                          id,
                          name: url,
                          method: method as RequestMethod,
                          url,
                        })
                    setId(id)
                  }
                  // }
                }}
                className="text-2xl text-gray-400 hover:text-emerald-500 cursor-pointer transition-all duration-200 ease-in-out"
              />
              <button
                onClick={() => getData(url, method)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-md transition-all duration-200 ease-in-out"
              >
                {method === "PG" ? "Connect" : "Send"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-1 mx-6">
          <div
            className={clsx("text-sm px-4 py-1.5 w-max rounded-lg", {
              "text-blue-600 bg-blue-100": status.toString().charAt(0) === "1",
              "text-emerald-600 bg-emerald-100":
                status.toString().charAt(0) === "2",
              "text-amber-600 bg-amber-100":
                status.toString().charAt(0) === "3",
              "text-rose-600 bg-rose-100": status.toString().charAt(0) === "4",
              "bg-rose-100 text-rose-600": status.toString().charAt(0) === "5",
            })}
          >
            {`${status || ""} ${statusCode.toUpperCase()}`}
          </div>
          <div className="relative border rounded-lg p-4 mt-2 overflow-y-auto h-full">
            {Object.keys(data).length ? (
              <div
                onClick={() => copy(JSON.stringify(data, null, 2))}
                className="absolute right-4 top-4 text-slate-300 hover:text-emerald-500 cursor-pointer transition-all duration-200 ease-in-out text-xl"
              >
                <IoCopy />
              </div>
            ) : null}
            {isLoading ? (
              <Spinner />
            ) : !Object.keys(data).length ? (
              <div className="h-64 flex flex-col gap-y-8 justify-center items-center">
                <BsDatabaseFillAdd className="h-44 w-44 text-emerald-400" />
                <p className="text-xl text-emerald-400 font-light">
                  Make a request to receive data
                </p>
              </div>
            ) : (
              <pre className="overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Hydrate>
  )
}
