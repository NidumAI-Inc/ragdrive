
function isWithinTokenLimit(txt: string, limit: number) {
  let j = txt.split(/\W+/).filter(Boolean)
  return j.length <= limit
}

export default isWithinTokenLimit
