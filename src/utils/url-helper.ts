
function getOrigin(url: string) {
  try {
    const newUrl = new URL(url);
    return newUrl.origin;
  } catch (e) {
    return null;
  }
}

export function sortUrlsByPathname(urls: string[]) {
  return urls.sort((a, b) => {
    const pathnameA = new URL(a).pathname;
    const pathnameB = new URL(b).pathname;

    if (pathnameA < pathnameB) return -1;
    if (pathnameA > pathnameB) return 1;
    return 0;
  });
}

export function groupLinks(payload: string[]) {
  return payload.reduce((prev: any, curr) => {
    const origin = getOrigin(curr);
    if (!origin) return prev
    if (!prev[origin]) {
      prev[origin] = []
    }
    prev[origin].push(curr)

    return prev
  }, {})
}
