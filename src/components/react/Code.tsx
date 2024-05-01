import type { CodeBlock } from "notion-types";
import { getBlockTitle } from "notion-utils";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import { useNotionContext } from "react-notion-x";
import { unnest } from "ramda";
import clsx from "clsx";

const PreTag =
  (className: string): SyntaxHighlighterProps["PreTag"] =>
  ({ children, ...props }) => {
    return (
      <pre {...props} className={clsx(props.className, className)}>
        {children}
      </pre>
    );
  };

const Code: React.FC<{
  block: CodeBlock;
  defaultLanguage?: string;
  className?: string;
}> = ({ block, defaultLanguage = "typescript", className }) => {
  const { recordMap } = useNotionContext();
  const content = getBlockTitle(block, recordMap);
  const language = unnest(block.properties.language || [])[0] as string;

  return (
    <SyntaxHighlighter
      language={language ?? defaultLanguage}
      PreTag={PreTag(clsx("notion-code", className))}
      style={style}
    >
      {content}
    </SyntaxHighlighter>
  );
};

export default Code;
