import { useEffect, useRef, useState } from "react";
import { generatePreviewHTML, generatePlaceholderHTML } from "@/utils/previewTemplate";
import { Loader2 } from "lucide-react";

interface LivePreviewProps {
  code: string | null;
  componentName?: string;
  deviceSize?: "mobile" | "tablet" | "desktop";
}

const deviceSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: "100%", height: "100%" },
};

export function LivePreview({ code, componentName = "App", deviceSize = "desktop" }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const html = code ? generatePreviewHTML(code) : generatePlaceholderHTML();
      iframeRef.current.srcdoc = html;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to render preview");
      setIsLoading(false);
    }
  }, [code, componentName]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const size = deviceSizes[deviceSize];
  const isFullWidth = deviceSize === "desktop";

  return (
    <div className="relative h-full w-full bg-muted/30 flex items-center justify-center overflow-auto">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 m-4 max-w-md">
            <p className="text-destructive text-sm font-mono">{error}</p>
          </div>
        </div>
      )}

      <div
        className={`relative bg-white shadow-xl transition-all duration-300 ${
          isFullWidth ? "w-full h-full" : "rounded-lg overflow-hidden"
        }`}
        style={
          isFullWidth
            ? undefined
            : {
                width: size.width,
                height: size.height,
                maxHeight: "calc(100% - 32px)",
              }
        }
      >
        {!isFullWidth && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <div className="w-16 h-1 rounded-full bg-muted-foreground/30" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Live Preview"
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}
