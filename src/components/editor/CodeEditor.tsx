import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown, Replace, ReplaceAll } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

interface Match {
  start: number;
  end: number;
  lineIndex: number;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);

  // Find all matches
  const matches = useMemo((): Match[] => {
    if (!searchQuery) return [];
    
    const results: Match[] = [];
    const searchValue = caseSensitive ? value : value.toLowerCase();
    const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();
    
    let index = 0;
    while ((index = searchValue.indexOf(query, index)) !== -1) {
      // Calculate line index
      const lineIndex = value.substring(0, index).split("\n").length - 1;
      results.push({
        start: index,
        end: index + searchQuery.length,
        lineIndex,
      });
      index += 1;
    }
    
    return results;
  }, [value, searchQuery, caseSensitive]);

  // Reset current match index when matches change
  useEffect(() => {
    if (matches.length > 0) {
      setCurrentMatchIndex(Math.min(currentMatchIndex, matches.length - 1));
    } else {
      setCurrentMatchIndex(0);
    }
  }, [matches.length]);

  // Focus search input when showing
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  }, [showSearch]);

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

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }

    // Ctrl+F to open search
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      setShowSearch(true);
    }
  };

  // Global keyboard shortcuts for search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F to toggle search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setShowSearch(true);
      }

      // Escape to close search
      if (e.key === "Escape" && showSearch) {
        e.preventDefault();
        e.stopPropagation();
        setShowSearch(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showSearch]);

  const goToNextMatch = useCallback(() => {
    if (matches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
  }, [matches.length]);

  const goToPreviousMatch = useCallback(() => {
    if (matches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
  }, [matches.length]);

  const replaceCurrent = useCallback(() => {
    if (matches.length === 0) return;
    const match = matches[currentMatchIndex];
    const newValue = value.substring(0, match.start) + replaceQuery + value.substring(match.end);
    onChange(newValue);
  }, [matches, currentMatchIndex, value, replaceQuery, onChange]);

  const replaceAll = useCallback(() => {
    if (matches.length === 0 || !searchQuery) return;
    
    let newValue = value;
    if (caseSensitive) {
      newValue = newValue.split(searchQuery).join(replaceQuery);
    } else {
      const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      newValue = newValue.replace(regex, replaceQuery);
    }
    onChange(newValue);
  }, [matches.length, searchQuery, replaceQuery, value, caseSensitive, onChange]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        goToPreviousMatch();
      } else {
        goToNextMatch();
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setShowSearch(false);
    }
  };

  // Highlight matches in the rendered code
  const renderTokenWithHighlight = (tokenText: string, tokenProps: any, lineStartIndex: number) => {
    if (!searchQuery || matches.length === 0) {
      return <span {...tokenProps}>{tokenText}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find matches within this token
    const tokenStart = lineStartIndex;
    const tokenEnd = lineStartIndex + tokenText.length;

    matches.forEach((match, matchIndex) => {
      const matchStart = match.start;
      const matchEnd = match.end;

      // Check if match overlaps with this token
      if (matchEnd > tokenStart && matchStart < tokenEnd) {
        const overlapStart = Math.max(0, matchStart - tokenStart);
        const overlapEnd = Math.min(tokenText.length, matchEnd - tokenStart);

        // Add text before the match
        if (overlapStart > lastIndex) {
          segments.push(
            <span key={`before-${matchIndex}`} style={tokenProps.style}>
              {tokenText.substring(lastIndex, overlapStart)}
            </span>
          );
        }

        // Add highlighted match
        const isCurrentMatch = matchIndex === currentMatchIndex;
        segments.push(
          <span
            key={`match-${matchIndex}`}
            style={{
              ...tokenProps.style,
              backgroundColor: isCurrentMatch ? "rgba(255, 165, 0, 0.5)" : "rgba(255, 255, 0, 0.3)",
              borderRadius: "2px",
            }}
          >
            {tokenText.substring(overlapStart, overlapEnd)}
          </span>
        );

        lastIndex = overlapEnd;
      }
    });

    // Add remaining text
    if (lastIndex < tokenText.length) {
      segments.push(
        <span key="remaining" style={tokenProps.style}>
          {tokenText.substring(lastIndex)}
        </span>
      );
    }

    return segments.length > 0 ? <>{segments}</> : <span {...tokenProps}>{tokenText}</span>;
  };

  // Calculate character offset for each line
  const lineOffsets = useMemo(() => {
    const lines = value.split("\n");
    const offsets: number[] = [];
    let currentOffset = 0;
    
    for (const line of lines) {
      offsets.push(currentOffset);
      currentOffset += line.length + 1; // +1 for newline character
    }
    
    return offsets;
  }, [value]);

  return (
    <div className="relative w-full h-full min-h-[500px] font-mono text-sm">
      {/* Search/Replace Panel */}
      {showSearch && (
        <div className="absolute top-2 right-2 z-20 bg-background border border-border rounded-lg shadow-lg p-3 flex flex-col gap-2 min-w-[320px]">
          <div className="flex items-center gap-2">
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Find..."
              className="h-8 text-sm flex-1"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[50px] text-center">
              {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : "0/0"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToPreviousMatch}
              disabled={matches.length === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToNextMatch}
              disabled={matches.length === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowSearch(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Replace..."
              className="h-8 text-sm flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={replaceCurrent}
              disabled={matches.length === 0}
              title="Replace"
            >
              <Replace className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={replaceAll}
              disabled={matches.length === 0}
              title="Replace All"
            >
              <ReplaceAll className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-3 h-3"
              />
              Case sensitive
            </label>
          </div>
        </div>
      )}

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
            {tokens.map((line, lineIndex) => {
              const lineOffset = lineOffsets[lineIndex] || 0;
              let charOffset = lineOffset;
              
              return (
                <div key={lineIndex} {...getLineProps({ line })} style={{ minHeight: "1.5rem" }}>
                  <span 
                    className="absolute left-0 w-10 text-gray-500 select-none text-right pr-2"
                    style={{ marginLeft: "-2.5rem" }}
                  >
                    {lineIndex + 1}
                  </span>
                  {line.map((token, tokenIndex) => {
                    const tokenProps = getTokenProps({ token });
                    const tokenContent = token.content;
                    const element = renderTokenWithHighlight(tokenContent, tokenProps, charOffset);
                    charOffset += tokenContent.length;
                    return <span key={tokenIndex}>{element}</span>;
                  })}
                  {line.length === 0 && " "}
                </div>
              );
            })}
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
