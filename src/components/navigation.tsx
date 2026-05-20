"use client";

import { cn } from "@/lib/utils";

type ViewName = "formulier" | "kaart" | "dashboard";

interface NavigationProps {
  activeView: ViewName;
  onNavigate: (view: ViewName) => void;
}

const TABS: { key: ViewName; label: string }[] = [
  { key: "formulier", label: "Aanvraag" },
  { key: "kaart", label: "Kaart" },
  { key: "dashboard", label: "Dashboard" },
];

export default function Navigation({ activeView, onNavigate }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-[rgba(242,241,238,0.85)] backdrop-blur-[10px] backdrop-saturate-[140%] border-b border-mda-border">
      <div className="max-w-[1240px] mx-auto flex items-center gap-8 px-7 py-[18px]">
        <button
          onClick={() => onNavigate("formulier")}
          className="flex items-center gap-2.5 no-underline text-mda-text"
        >
          <svg
            className="h-7 w-auto"
            viewBox="0 0 280 50"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="mijn design airco"
          >
            <g
              fill="#3D2B1F"
              fontFamily="DM Sans, sans-serif"
              fontWeight="500"
              letterSpacing="0.5"
            >
              <text x="0" y="33" fontSize="26">mijn</text>
              <text x="68" y="33" fontSize="26">design</text>
              <text x="172" y="33" fontSize="26">airco</text>
            </g>
            <path
              d="M252 6 L272 6 L272 44"
              stroke="#3D2B1F"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="square"
            />
          </svg>
        </button>

        <div className="flex gap-1.5 flex-1" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeView === tab.key}
              onClick={() => onNavigate(tab.key)}
              className={cn(
                "relative font-medium text-sm text-mda-text-muted bg-transparent border-0 cursor-pointer",
                "px-3.5 py-2.5 rounded-md transition-colors duration-200",
                "hover:text-mda-text hover:bg-[rgba(61,43,31,0.04)]",
                activeView === tab.key && "text-mda-text"
              )}
            >
              {tab.label}
              {activeView === tab.key && (
                <span className="absolute left-3.5 right-3.5 -bottom-[3px] h-0.5 bg-primary rounded-sm" />
              )}
            </button>
          ))}
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 font-medium text-xs tracking-wide bg-[rgba(171,203,205,0.35)] text-[#2E5454] px-3 py-[7px] rounded-full border border-[rgba(122,158,159,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E5454] inline-block animate-pulse-dot" />
          Demo modus
        </span>
      </div>
    </nav>
  );
}
