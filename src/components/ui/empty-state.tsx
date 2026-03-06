import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-white/5">
          <Icon className="h-8 w-8 text-white/40" />
        </div>
      )}
      <h3 className="text-lg font-medium text-white/90 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-white/60 max-w-sm mb-6">{description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            className="border-white/20 hover:bg-white/10"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
