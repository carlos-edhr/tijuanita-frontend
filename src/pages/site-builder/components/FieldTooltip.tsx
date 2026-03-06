import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { Info } from "lucide-react";

interface FieldTooltipProps {
  content: string;
  example?: string;
}

const FieldTooltip: React.FC<FieldTooltipProps> = ({ content, example }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help ml-1"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-medium text-gray-900">Información</p>
          <p className="text-gray-600">{content}</p>
          {example && (
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium">Ejemplo:</span> {example}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default FieldTooltip;
