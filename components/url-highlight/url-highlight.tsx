import React from "react"

interface Props {
  text: string
  isDb?: boolean
}

const UrlHighLight = ({ text, isDb }: Props) => {
  function processTextWithStyles() {
    const urlPatterns = [
      { regex: /http(s)?:\/\//g, className: "text-blue-500" },
      {
        regex: /(?:http[s]*:\/\/)*(.*?)\.(?=[^/]*\..{2,5})/g,
        className: "text-slate-500",
      },
      {
        regex: /(?:http[s]*:\/\/.*?)@/g,
        className: "text-slate-500",
      },
      {
        regex: /\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+/g,
        className: "text-emerald-500",
      },
      {
        regex: /(?:&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)/g,
        className: "text-emerald-500",
      },
      {
        regex: /:([^/]+)/g,
        className: "text-amber-500",
      },
      {
        regex: /{{([^/]+)}}/g,
        className: "text-purple-500",
      },
      {
        regex: /:\/\//g,
        className: "text-slate-800",
      },
    ]

    const dbPatterns = [
      {
        regex: /postgresql/g,
        className: "text-purple-500",
      },
    ]

    let processedText = text

    isDb
      ? dbPatterns.forEach(({ regex, className }) => {
          processedText = processedText.replace(
            regex,
            `<span class="${className}">$&</span>`
          )
        })
      : urlPatterns.forEach(({ regex, className }) => {
          processedText = processedText.replace(
            regex,
            `<span class="${className}">$&</span>`
          )
        })

    return processedText
  }
  const processedText = processTextWithStyles()
  return <div dangerouslySetInnerHTML={{ __html: processedText }} />
}

export default UrlHighLight
