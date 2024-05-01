import type { ComponentProps } from "react";
import { NotionRenderer } from "react-notion-x";
import Code from "./Code";

export default function MyNotionRenderer(
  props: ComponentProps<typeof NotionRenderer>,
) {
  return <NotionRenderer {...props} components={{ Code }} />;
}
