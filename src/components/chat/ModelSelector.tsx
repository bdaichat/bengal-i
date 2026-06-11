import { Zap, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChatModel } from "@/hooks/useChat";

interface ModelSelectorProps {
  model: ChatModel;
  onModelChange: (model: ChatModel) => void;
  language: "en" | "bn";
  disabled?: boolean;
}

export function ModelSelector({ model, onModelChange, language, disabled }: ModelSelectorProps) {
  return (
    <Select
      value={model}
      onValueChange={(v) => onModelChange(v as ChatModel)}
      disabled={disabled}
    >
      <SelectTrigger className="h-9 w-[130px] gap-1.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="google/gemini-3-flash-preview">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            {language === "bn" ? "ফাস্ট" : "Fast"}
          </span>
        </SelectItem>
        <SelectItem value="google/gemini-3.1-pro-preview">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            {language === "bn" ? "কোয়ালিটি" : "Quality"}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}