import React from "react";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  className = "",
}) => {
  const baseClasses = "bg-slate-200 dark:bg-slate-700";
  const orientationClasses =
    orientation === "horizontal" ? "h-px w-full" : "w-px h-full";

  return (
    <div className={`${baseClasses} ${orientationClasses} ${className}`} />
  );
};

export { Separator };
