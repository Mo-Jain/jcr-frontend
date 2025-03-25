import type { ImageLoader } from "next/image";

const googleDriveLoader: ImageLoader = ({ src, width }) => {
  return `https://lh3.googleusercontent.com/d/${src}=w${width}`;
};

export default googleDriveLoader;
