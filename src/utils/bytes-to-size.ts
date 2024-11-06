function bytesToSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
  const exponent: number = Math.floor(Math.log(bytes) / Math.log(1024));
  const size: string = (bytes / Math.pow(1024, exponent)).toFixed(2);

  return size + " " + units[exponent];
}

export default bytesToSize
