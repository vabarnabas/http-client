import React from "react";

interface Props {
  text: string;
}

const UrlHighLight = ({ text }: Props) => {
  const httpRegex = /http(s)?:\/\//g;
  const startingQueryRegex = /\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+/g;
  const continuingQueryRegex = /(?:&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)/g;

  const patterns = [httpRegex, startingQueryRegex, continuingQueryRegex]

  const processText = (inputText: string) => {
    
  };

  const processedText = processText(text);

  return (
    <div>
      {processedText.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          <span key={index} className="http-link">
            {React.cloneElement(part, { key: index })}
          </span>
        )
      )}
    </div>
  );
};

export default UrlHighLight;
