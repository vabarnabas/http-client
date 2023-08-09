import React from "react"

interface Props {
  data: Record<string, string>[]
}

const ObjectTable = ({ data }: Props) => {
  if (!data.length) {
    return null // Return null or a message if the array is empty
  }

  const keys = Object.keys(data[0])

  return (
    <table className="text-sm w-full">
      <thead className="border-b sticky top-0">
        <tr className="">
          <th className="py-2 border-x px-8 bg-slate-50">#</th>
          {keys.map((key, index) => (
            <th className="py-2 border-x px-8 bg-slate-50" key={index}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            <td className="border py-1 px-4 text-center">{rowIndex}</td>
            {keys.map((key, colIndex) => (
              <td className="border py-1 px-4 text-center" key={colIndex}>
                {item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ObjectTable
