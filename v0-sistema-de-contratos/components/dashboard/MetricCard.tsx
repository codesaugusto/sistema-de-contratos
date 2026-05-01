"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color?: "green" | "red" | "yellow" | "blue" | "gray";
  className?: string;
}

const colorMap = {
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800/50",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500 dark:text-emerald-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800/50",
    text: "text-red-600 dark:text-red-400",
    icon: "text-red-500 dark:text-red-400",
  },
  yellow: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800/50",
    text: "text-amber-600 dark:text-amber-400",
    icon: "text-amber-500 dark:text-amber-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800/50",
    text: "text-blue-600 dark:text-blue-400",
    icon: "text-blue-500 dark:text-blue-400",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-950/20",
    border: "border-gray-200 dark:border-gray-800/50",
    text: "text-gray-600 dark:text-gray-400",
    icon: "text-gray-500 dark:text-gray-400",
  },
};

export function MetricCard({
  icon,
  value,
  label,
  trend,
  color = "blue",
  className,
}: MetricCardProps) {
  const colors = colorMap[color];
  const trendIcon = trend?.direction === "up" ? TrendingUp : TrendingDown;
  const TrendIcon = trendIcon;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 dark:bg-slate-950 transition-transform hover:scale-105 cursor-pointer",
        colors.bg,
        colors.border,
        className,
      )}
      data-slot="metric-card"
    >
      {/* Ícone + Trend */}
      <div className="flex items-start justify-between">
        <div className={cn("text-2xl", colors.icon)}>{icon}</div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendIcon className={cn("h-4 w-4", colors.text)} />
            <span className={cn("text-xs font-semibold", colors.text)}>
              {trend.value}%
            </span>
          </div>
        )}
      </div>

      {/* Valor */}
      <div>
        <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
          {value}
        </div>
      </div>

      {/* Label */}
      <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
