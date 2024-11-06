
function isLatestSemantic(currentVersion, latestVersion) {
  const current = currentVersion.split('.').map(Number);
  const latest = latestVersion.split('.').map(Number);

  for (let i = 0; i < Math.max(current.length, latest.length); i++) {
    const a = current[i] || 0;
    const b = latest[i] || 0;
    if (b > a) return true;
    if (b < a) return false;
  }

  return false;
}

export default isLatestSemantic
