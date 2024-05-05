import type { ComponentProps } from "react";
import { lazy } from "react";
import { NotionRenderer } from "react-notion-x";
import type { NotionComponents } from "react-notion-x";
import Code from "./Code";
import { atom } from "nanostores";
import qs from "qs";

const imageMap = atom<Record<string, ImageMetadata>>({});

interface MyNotionRendererProps extends ComponentProps<typeof NotionRenderer> {
  imageMap: Record<string, ImageMetadata>;
}

const components = {
  Code,
  Image: ({ src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { id } = qs.parse(src ?? "") as { id: string };

    const imageMetadata = imageMap.get()[id];

    return <img {...props} src={imageMetadata.src} />;
  },
} satisfies Partial<NotionComponents>;

export default function MyNotionRenderer({
  imageMap: imageMapValue,
  ...props
}: MyNotionRendererProps) {
  imageMap.set(imageMapValue);

  return (
    <NotionRenderer {...props} components={components} forceCustomImages />
  );
}
