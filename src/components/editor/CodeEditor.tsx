import { useRef, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Set cursor position after the tab
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] font-mono text-sm">
      {/* Syntax highlighted layer (behind) */}
      <Highlight
        theme={themes.vsDark}
        code={value || " "}
        language={language as any}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            ref={preRef}
            className={className}
            style={{
              ...style,
              margin: 0,
              padding: "1rem",
              paddingLeft: "3.5rem",
              position: "absolute",
              inset: 0,
              overflow: "auto",
              pointerEvents: "none",
              whiteSpace: "pre",
            }}
            aria-hidden="true"
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} style={{ minHeight: "1.5rem" }}>
                <span 
                  className="absolute left-0 w-10 text-gray-500 select-none text-right pr-2"
                  style={{ marginLeft: "-2.5rem" }}
                >
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
                {line.length === 0 && " "}
              </div>
            ))}
          </pre>
        )}
      </Highlight>

      {/* Textarea layer (on top, transparent) */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white focus:outline-none p-4 pl-14 overflow-auto"
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "1.5rem",
          whiteSpace: "pre",
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
}
