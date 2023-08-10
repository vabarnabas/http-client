import Editor, { Monaco } from "@monaco-editor/react"
import clsx from "clsx"
import { editor, Position } from "monaco-editor"
import React, { useEffect, useState } from "react"
import { BsFillDatabaseFill, BsPlayFill } from "react-icons/bs"
import { IoMdBrowsers, IoMdSave } from "react-icons/io"
import { PiBracketsCurlyBold } from "react-icons/pi"
import ScrollContainer from "react-indiana-drag-scroll"
import { v4 as uuidv4 } from "uuid"

import Hydrate from "@/components/hydrate/hydrate"
import ObjectTable from "@/components/object-table/object-table"
import Tab from "@/components/tab/tab"
import UrlHighLight from "@/components/url-highlight/url-highlight"
import { getMethodColor } from "@/helpers/getColors"
import { sqlKeywords } from "@/helpers/sqlSuggestions"
import { usePersistingStore } from "@/stores/global.store"
import { Database } from "@/types/db.types"
import { Entity, EntityOptions, Method } from "@/types/entity.types"
import { Request } from "@/types/request.types"

export default function New() {
  const {
    entities,
    saveEntity,
    updateEntity,
    getItemById,
    variables,
    setVariables,
    getEntities,
  } = usePersistingStore()
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [id, setId] = useState("")
  const [sqlCode, setSqlCode] = useState("")
  const [data, setData] = useState({})
  const [authorization, setAuthorization] = useState("none")
  const [authorizationKey, setAuthorizationKey] = useState("")
  const [showVariableEditor, setShowVariableEditor] = useState(false)
  const [localVariables, setLocalVariables] = useState(variables)

  function isJsonString(str: string) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (!getEntities().length) {
      const id = uuidv4()
      saveEntity({
        id,
        method: "PG",
        name: "Untitled Database",
        url: "",
      })
      setId(id)
    } else {
      setId(getEntities()[0].id)
    }
  }, [])

  useEffect(() => {
    const item = getItemById(id)
    if (id && item) {
      setUrl(item.url)
      setMethod(item.method)
      setData({})
      setAuthorization(
        item.options?.headers?.authorization.split(" ")[0].toLowerCase() ||
          "none"
      )
      setAuthorizationKey(
        item.options?.headers?.authorization.split(" ")[1] || ""
      )
      if (item.options?.lastQuery) {
        setSqlCode(item.options.lastQuery as string)
      } else {
        setSqlCode("")
      }
    }
  }, [getItemById, id])

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (
        model: editor.ITextModel,
        position: Position
      ) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const suggestions = sqlKeywords.map((keyword) => {
          return {
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
          }
        })

        return {
          suggestions: suggestions.map((suggestion) => ({
            ...suggestion,
            range,
          })),
        }
      },
    })
  }

  const connectToDatabase = async () => {
    try {
      const res = await fetch("/api/pg", {
        method: "POST",
        body: JSON.stringify({ connectionString: url }),
      })
      await res.json()
    } catch (e) {
      console.log(e)
    }
  }

  const runQuery = async () => {
    try {
      const res = await fetch("/api/pg", {
        method: "POST",
        body: JSON.stringify({ sqlQuery: sqlCode, connectionString: url }),
      })
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.log(e)
    }
  }

  const runApi = async () => {
    try {
      const headers: Record<string, string> = {}
      if (authorization === "bearer") {
        headers.authorization = "Bearer " + authorizationKey
      }

      const res = await fetch(url, {
        method,
        headers,
      })
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Hydrate>
      <div className="w-screen h-screen flex flex-col select-none">
        {showVariableEditor && (
          <div
            className={clsx(
              "fixed z-50 bg-white inset-x-6 top-14 transition-all duration-700 ease-in-out",
              "border-x rounded-b-lg shadow border-b"
            )}
          >
            <div className="px-4 py-2 h-full ease-in-out duration-700 transition-all">
              <p className="font-semibold text-lg mb-2">Variables</p>
              <div className="relative h-48">
                <Editor
                  className="rounded-lg rounded-b-lg"
                  defaultLanguage="json"
                  value={localVariables}
                  onChange={(e) => setLocalVariables(e || "")}
                  options={{ minimap: { enabled: false } }}
                  beforeMount={handleEditorDidMount}
                />
              </div>
            </div>
          </div>
        )}
        <div className="py-2 bg-slate-200 px-6 flex gap-x-1">
          <div
            onClick={() => {
              const id = uuidv4()
              saveEntity({
                id,
                method: "PG",
                name: "Untitled Database",
                url: "",
              })
              setId(id)
            }}
            className={clsx(
              "cursor-pointer relative flex gap-x-4 py-2.5 border rounded-lg px-4 items-center hover:bg-purple-50 transition-all duration-200 ease-in-out text-lg",
              id === "" ? "bg-white" : "bg-slate-50"
            )}
          >
            <BsFillDatabaseFill className="text-purple-500" />
          </div>
          <div
            onClick={() => {
              const id = uuidv4()
              saveEntity({
                id,
                method: "GET",
                name: "Untitled Request",
                url: "",
              })
              setId(id)
            }}
            className={clsx(
              "cursor-pointer relative flex gap-x-4 py-2.5 border rounded-lg px-4 items-center hover:bg-emerald-50 transition-all duration-200 ease-in-out text-lg",
              id === "" ? "bg-white" : "bg-slate-50"
            )}
          >
            <IoMdBrowsers className="text-emerald-500" />
          </div>
          <ScrollContainer className="flex w-full gap-x-1 flex-1">
            {entities.map((element) => (
              <Tab id={id} setId={setId} key={element.id} element={element} />
            ))}
          </ScrollContainer>
          <div
            onClick={() => {
              if (showVariableEditor) {
                if (isJsonString(localVariables)) {
                  setVariables(localVariables)
                } else {
                  setLocalVariables(variables)
                }
              }

              setShowVariableEditor(!showVariableEditor)
            }}
            className={clsx(
              "cursor-pointer relative flex gap-x-4 py-2.5 border rounded-lg px-4 items-center hover:bg-slate-100 transition-all duration-200 ease-in-out text-lg",
              id === "" ? "bg-white" : "bg-slate-50"
            )}
          >
            <PiBracketsCurlyBold className="text-slate-500" />
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (method === "PG") {
              await connectToDatabase()
            } else {
              await runApi()
            }
          }}
          className="mt-2 inset-x-0 flex justify-center items-center px-6 py-1"
        >
          <div className="border w-full rounded-lg flex px-4 h-12 gap-x-4 items-center justify-center">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={clsx(
                "bg-white",
                getMethodColor({ method } as Database | Request)
              )}
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
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-3">
              <IoMdSave
                onClick={() => {
                  if (id) {
                    const options: EntityOptions = {}

                    if (authorization === "bearer") {
                      options.headers = options.headers
                        ? {
                            ...options.headers,
                            authorization: "Bearer " + authorizationKey,
                          }
                        : { authorization: "Bearer " + authorizationKey }
                    }

                    updateEntity(id, {
                      id: id,
                      url,
                      method: method as Method,
                      name: url,
                      options,
                    })
                  } else {
                    const id = uuidv4()
                    saveEntity({
                      id,
                      name: url,
                      method: method as Method,
                      url,
                    })

                    setId(id)
                  }
                }}
                className="text-2xl text-gray-400 hover:text-emerald-500 cursor-pointer transition-all duration-200 ease-in-out"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-md transition-all duration-200 ease-in-out">
                {method === "PG" ? "Connect" : "Send"}
              </button>
            </div>
          </div>
        </form>
        {method === "PG" ? (
          <div className="relative h-56 rounded-lg overflow-clip mx-6 mt-2 border">
            <button
              onClick={async () => {
                await runQuery()
                updateEntity(id, {
                  ...(getItemById(id) as Entity),
                  options: { lastQuery: sqlCode },
                })
              }}
              className="absolute right-6 bottom-3 flex justify-center items-center gap-x-1 bg-purple-500 z-10 hover:bg-purple-600 text-white px-4 py-1 rounded-md transition-all duration-200 ease-in-out"
            >
              <BsPlayFill /> Run
            </button>
            <Editor
              className="rounded-lg rounded-b-lg"
              defaultLanguage="sql"
              value={sqlCode}
              onChange={(e) => setSqlCode(e || "")}
              options={{ minimap: { enabled: false } }}
              beforeMount={handleEditorDidMount}
            />
          </div>
        ) : (
          <div className="relative rounded-lg overflow-clip mx-6 mt-2 border p-4">
            <div className="flex flex-col gap-x-3 items-center">
              <div className="flex justify-between items-center w-full">
                <p className="font-semibold">Authorization:</p>
                <select
                  value={authorization}
                  onChange={(e) => setAuthorization(e.target.value)}
                  className="bg-white"
                >
                  <option value="none">None</option>
                  <option value="bearer">Bearer</option>
                  <option value="api-key">API Key</option>
                </select>
              </div>
              {authorization !== "none" ? (
                <input
                  type="text"
                  placeholder={
                    authorization === "bearer" ? "Bearer Token" : "API Key"
                  }
                  value={authorizationKey}
                  onChange={(e) => setAuthorizationKey(e.target.value)}
                  className="w-full h-full flex outline-none border rounded-lg px-3 py-1.5 text-sm mt-3"
                />
              ) : null}
            </div>
          </div>
        )}
        {Object.keys(data).length ? (
          <div className="relative rounded-lg overflow-clip mx-6 border mt-3 max-h-96 overflow-y-auto overflow-x-auto">
            {method === "PG" ? (
              <ObjectTable data={data as Record<string, string>[]} />
            ) : (
              <pre className="text-sm p-4 select-text">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        ) : null}
      </div>
    </Hydrate>
  )
}
