import { useEffect, useRef, useState } from "react";
import { generatePreviewHTML, generatePlaceholderHTML } from "@/utils/previewTemplate";
import { Loader2 } from "lucide-react";

interface LivePreviewProps {
  code: string | null;
  componentName?: string;
  deviceSize?: "mobile" | "tablet" | "desktop";
  darkMode?: boolean;
}

const deviceSizes = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: "100%", height: "100%" },
};

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Phone outer frame */}
      <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Side buttons - left */}
        <div className="absolute left-[-2px] top-28 w-[3px] h-8 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-[-2px] top-40 w-[3px] h-12 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-[-2px] top-56 w-[3px] h-12 bg-zinc-700 rounded-l-sm" />
        
        {/* Side button - right (power) */}
        <div className="absolute right-[-2px] top-32 w-[3px] h-16 bg-zinc-700 rounded-r-sm" />
        
        {/* Inner bezel */}
        <div className="bg-black rounded-[2.5rem] p-1">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="w-28 h-7 bg-black rounded-full flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
            </div>
          </div>
          
          {/* Screen */}
          <div className="relative bg-white rounded-[2rem] overflow-hidden" style={{ width: 375, height: 812 }}>
            {children}
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full" />
      </div>
    </div>
  );
}

function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Tablet outer frame */}
      <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[2rem] p-4 shadow-2xl">
        {/* Camera */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-700 rounded-full ring-2 ring-zinc-600" />
        
        {/* Side button - right (power) */}
        <div className="absolute right-[-2px] top-20 w-[3px] h-10 bg-zinc-700 rounded-r-sm" />
        <div className="absolute right-[-2px] top-36 w-[3px] h-6 bg-zinc-700 rounded-r-sm" />
        
        {/* Screen */}
        <div className="relative bg-white rounded-lg overflow-hidden" style={{ width: 768, height: 1024 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function LivePreview({ code, componentName = "App", deviceSize = "desktop", darkMode = false }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const html = code ? generatePreviewHTML(code, darkMode) : generatePlaceholderHTML();
      // Debug logging for preview generation
      if (code) {
        console.log('[LivePreview] Generating preview for code length:', code.length);
      }
      iframeRef.current.srcdoc = html;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to render preview";
      console.error('[LivePreview] Error generating preview:', errorMessage, err);
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [code, componentName, darkMode]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const renderIframe = () => (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      sandbox="allow-scripts"
      title="Live Preview"
      onLoad={handleLoad}
    />
  );

  return (
    <div className="relative h-full w-full bg-muted/30 flex items-center justify-center overflow-auto p-4">
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

      {deviceSize === "desktop" ? (
        <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
          {renderIframe()}
        </div>
      ) : deviceSize === "tablet" ? (
        <TabletFrame>{renderIframe()}</TabletFrame>
      ) : (
        <MobileFrame>{renderIframe()}</MobileFrame>
      )}
    </div>
  );
}
