import Hydrate from "@/components/hydrate/hydrate";
import { useRequestStore } from "@/stores/url.store";
import React, { useState } from "react";
import { IoMdSave } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { HiPlus, HiX } from "react-icons/hi";
import clsx from "clsx";
import { RequestMethod } from "@/types/request.types";
import ScrollContainer from "react-indiana-drag-scroll";
import { BsDatabaseFillAdd } from "react-icons/bs";
import Spinner from "@/components/spinner/spinner";

export default function Home() {
  const { saveRequest, removeRequest, updateRequest, requests } =
    useRequestStore();
  const [id, setId] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<RequestMethod>("GET");
  const [data, setData] = useState({});
  const [status, setStatus] = useState(0);
  const [statusCode, setStatusCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getData = async (url: string, method: RequestMethod) => {
    try {
      setIsLoading(true);
      const res = await fetch(url, { method });
      const json = await res.json();
      setStatus(res.status);
      setStatusCode(res.statusText);
      setData(json);
    } catch {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Hydrate>
      <div>
        <ScrollContainer className="pt-4 inset-x-0 flex h-14 border-b px-6 items-end gap-x-1 bg-slate-2 00">
          {requests.map((request) => (
            <div
              key={request.id}
              onClick={() => {
                setUrl(request.url);
                setMethod(request.method);
                setId(request.id);
              }}
              className={clsx(
                "cursor-pointer sm:max-w-[14rem] w-full max-w-sm hover:bg-emerald-50 flex gap-x-4 py-2.5 border-t border-l border-r rounded-t-lg px-4 items-center flex-1 transition-all duration-200 ease-in-out",
                id === request.id ? "pb-3.5 bg-white" : "bg-slate-50"
              )}
            >
              <p
                className={clsx("text-sm", {
                  "text-emerald-500": request.method === "GET",
                  "text-blue-500": request.method === "POST",
                  "text-amber-500": request.method === "PUT",
                  "text-rose-500": request.method === "DELETE",
                })}
              >
                {request.method}
              </p>
              <p className="w-0 flex-1 truncate text-sm">{request.name}</p>
              <HiX
                onClick={() => removeRequest(request.id)}
                className="text-base cursor-pointer"
              />
            </div>
          ))}
          <div
            onClick={() => {
              setId("");
              setMethod("GET");
              setUrl("https://");
            }}
            className={clsx(
              "cursor-pointer flex gap-x-4 py-2.5 border-t border-l border-r rounded-t-lg px-4 items-center hover:bg-emerald-50 transition-all duration-200 ease-in-out text-lg",
              id === "" ? "pb-3.5 bg-white" : "bg-slate-50"
            )}
          >
            <HiPlus />
          </div>
        </ScrollContainer>
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
              })}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <div className="relative w-full h-full flex items-center justify-end flex-1">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Url"
                type="text"
                className="w-full h-full flex outline-none text-transparent caret-black"
              />

              <div className="left-0 absolute pointer-events-none right-0 flex-1 truncate">
                {/* <UrlHighLight text={url} /> */}
                {url}
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-3">
              <IoMdSave
                onClick={() => {
                  if (
                    url.match(
                      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g
                    )
                  ) {
                    if (id) {
                      updateRequest(id, { id, url, method, name: url });
                    } else {
                      saveRequest({
                        id: uuidv4(),
                        name: url,
                        method,
                        url,
                      });
                      setUrl("");
                    }
                  }
                }}
                className="text-2xl text-gray-400 hover:text-emerald-500 cursor-pointer"
              />
              <button
                onClick={() => getData(url, method)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-md"
              >
                Send
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
          <div className="border rounded-lg p-4 mt-2">
            {isLoading ? (
              <Spinner />
            ) : !Object.keys(data).length ? (
              <div className="h-64 flex flex-col gap-y-8 justify-center items-center">
                <BsDatabaseFillAdd className="h-44 w-44 text-slate-300" />
                <p className="text-xl text-slate-300 font-light">
                  Make a request to receive data
                </p>
              </div>
            ) : (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
          </div>
        </div>
      </div>
    </Hydrate>
  );
}
