"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  color?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  color = "#a855f7",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-40 w-[22rem] -skew-y-[6deg] select-none flex-col justify-between rounded-xl border bg-[#110720]/90 backdrop-blur-md px-5 py-4 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[22rem] after:bg-gradient-to-l after:from-primaryBg after:to-transparent after:content-[''] hover:-translate-y-2 hover:bg-[#190d30]/95 [&>*]:flex [&>*]:items-center [&>*]:gap-3",
        className
      )}
      style={{
        borderColor: `${color}33`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
        '--glow-color': color
      } as React.CSSProperties}
    >
      <div style={{ zIndex: 2 }}>
        <span 
          className="relative inline-block rounded-lg p-2"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}33`,
            color: color
          }}
        >
          {icon}
        </span>
        <p className="text-lg font-semibold tracking-wide text-white ml-2">
          {title}
        </p>
      </div>
      <p className="text-sm text-gray-300 font-light leading-relaxed" style={{ zIndex: 2, whiteSpace: 'normal' }}>
        {description}
      </p>
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: color, zIndex: 2 }}>
        {date}
      </p>

      {/* Decorative neon bottom line */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] w-full rounded-b-xl"
        style={{
          background: `linear-gradient(90deg, ${color}cc, transparent)`
        }}
      />
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-12 before:absolute before:w-full before:h-full before:rounded-xl before:border before:border-white/5 before:bg-primaryBg/50 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0 grayscale hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700",
    },
    {
      className: "[grid-area:stack] translate-x-8 translate-y-8 hover:-translate-y-4 before:absolute before:w-full before:h-full before:rounded-xl before:border before:border-white/5 before:bg-primaryBg/50 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0 grayscale hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-16 hover:translate-y-8 transition-all duration-700",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
export { DisplayCard };
export type { DisplayCardProps };
