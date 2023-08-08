const httpRegex = /http(s):\/\//g
const startingQueryRegex = /\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+/g
const continuingQueryRegex = /(?:&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)/g