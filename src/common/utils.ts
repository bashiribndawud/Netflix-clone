type dimention = "width" | "original"
export function crateimageURl(path: string, width: number, type: dimention = "width") {
  return type === "width"
    ? `${import.meta.env.VITE_BASE_IMAGE_URI}/${path}`
    : `${import.meta.env.VITE_BASE_IMAGE_URI}/${path}/`;

}
