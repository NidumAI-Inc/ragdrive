export type Node = {
  url: string
  childs: Node[]
  fullUrl: string
}

function addPathToHierarchy(pathParts: string[], hierarchy: Node[], baseUrl: string): void {
  if (pathParts.length === 0) return;

  let currentPart = pathParts[0] || ""
  let currentFullUrl = `${baseUrl}/${currentPart}`
  let existingNode = hierarchy.find(node => node.url === currentPart)

  if (!existingNode) {
    existingNode = { url: currentPart, fullUrl: currentFullUrl, childs: [] }
    hierarchy.push(existingNode)
  }

  addPathToHierarchy(pathParts.slice(1), existingNode.childs, currentFullUrl)
}

export function buildHierarchy(urls: string[]): Node[] {
  let hierarchy: Node[] = []

  urls.forEach(url => {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    addPathToHierarchy(pathParts, hierarchy, urlObj.origin)
  })

  return hierarchy
}
