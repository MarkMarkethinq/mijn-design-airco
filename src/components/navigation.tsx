"use client";

import Image from "next/image";
import { User, Wrench, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoleTab = "klant" | "installateur" | "admin";

interface NavigationProps {
  activeRole: RoleTab;
  onNavigate: (role: RoleTab) => void;
  onReset: () => void;
  installateurBadge: boolean;
  adminBadgeCount: number;
}

const ROLE_TABS: { key: RoleTab; label: string; icon: typeof User }[] = [
  { key: "klant", label: "Klant", icon: User },
  { key: "installateur", label: "Installateur", icon: Wrench },
  { key: "admin", label: "Admin", icon: ShieldCheck },
];

export default function Navigation({ activeRole, onNavigate, onReset, installateurBadge, adminBadgeCount }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-[rgba(242,241,238,0.85)] backdrop-blur-[10px] backdrop-saturate-[140%] border-b border-mda-border">
      <div className="w-full max-w-[1240px] mx-auto flex items-center gap-8 px-7 py-[18px]">
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 no-underline text-mda-text"
        >
          <Image
            src="/assets/mda_logo_brown.svg"
            alt="mijn design airco"
            width={140}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </button>

        <div className="flex gap-1.5 flex-1" role="tablist">
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            const hasBadge =
              (tab.key === "installateur" && installateurBadge) ||
              (tab.key === "admin" && adminBadgeCount > 0);

            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeRole === tab.key}
                onClick={() => onNavigate(tab.key)}
                className={cn(
                  "relative font-medium text-sm text-mda-text-muted bg-transparent border-0 cursor-pointer",
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-md transition-colors duration-200",
                  "hover:text-mda-text hover:bg-[rgba(61,43,31,0.04)]",
                  activeRole === tab.key && "text-mda-text"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {hasBadge && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-mda-accent text-white text-[10px] font-bold rounded-full px-1">
                    {tab.key === "admin" ? adminBadgeCount : "1"}
                  </span>
                )}
                {activeRole === tab.key && (
                  <span className="absolute left-3.5 right-3.5 -bottom-[3px] h-0.5 bg-primary rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 font-medium text-xs tracking-wide bg-[rgba(171,203,205,0.35)] text-[#2E5454] px-3 py-[7px] rounded-full border border-[rgba(122,158,159,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E5454] inline-block animate-pulse-dot" />
          Demo modus
        </span>
      </div>
    </nav>
  );
}
