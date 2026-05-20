"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LayoutGrid, List, Users, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  INSTALLERS,
  MODELS,
  RECENT_REQUESTS,
  getInitials,
  type Installer,
  type ModelKey,
  type RecentRequest,
} from "@/lib/data";
import { cn } from "@/lib/utils";

interface UserRequest {
  naam: string;
  email: string;
  stad: string;
  model: ModelKey;
}

interface DashboardViewProps {
  userRequest: UserRequest | null;
  onNavigate: (view: "formulier" | "kaart" | "dashboard") => void;
}

type SortKey = "naam" | "stad" | "aanvragen" | "reactie" | "status";

const SIDEBAR_ITEMS = [
  { icon: LayoutGrid, label: "Dashboard", tag: null, active: true },
  { icon: List, label: "Aanvragen", tag: "24", active: false },
  { icon: Users, label: "Installateurs", tag: "5", active: false },
  { icon: BarChart3, label: "Statistieken", tag: null, active: false },
];

export default function DashboardView({ userRequest, onNavigate }: DashboardViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("naam");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(
        key === "naam" || key === "stad" || key === "status" ? "asc" : "desc"
      );
    }
  }, [sortKey]);

  const sortedInstallers = [...INSTALLERS].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === "string" && typeof vb === "string") {
      return sortDir === "asc"
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const maxAanvragen = Math.max(...INSTALLERS.map((d) => d.aanvragen));

  const requests: (RecentRequest & { isYou?: boolean })[] = userRequest
    ? [
        { ...userRequest, when: "zojuist", isYou: true } as RecentRequest & { isYou: boolean },
        ...RECENT_REQUESTS,
      ].slice(0, 6)
    : RECENT_REQUESTS;

  return (
    <section className="animate-view-in">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
        {/* Sidebar */}
        <aside className="sticky top-24 bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-2 max-lg:static">
          <div className="px-3 pt-3 pb-1.5 font-medium text-[11px] tracking-[0.12em] uppercase text-mda-text-muted">
            Overzicht
          </div>
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-mda-text cursor-pointer transition-colors duration-150",
                "hover:bg-[rgba(61,43,31,0.04)]",
                item.active && "bg-[rgba(171,203,205,0.35)] text-[#1f3f40] font-medium"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 text-mda-text-muted",
                  item.active && "text-[#1f3f40]"
                )}
              />
              {item.label}
              {item.tag && (
                <span className="ml-auto text-[11px] text-mda-text-muted">{item.tag}</span>
              )}
            </div>
          ))}

          <div className="px-3 pt-5 pb-1.5 font-medium text-[11px] tracking-[0.12em] uppercase text-mda-text-muted">
            Instellingen
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-mda-text cursor-pointer hover:bg-[rgba(61,43,31,0.04)] transition-colors duration-150">
            <Settings className="w-4 h-4 shrink-0 text-mda-text-muted" />
            Voorkeuren
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Header */}
          <div className="flex justify-between items-end mb-6 gap-6 flex-wrap">
            <div>
              <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted">
                Beheer · vandaag
              </div>
              <h2 className="text-[34px] leading-[1.1] mt-2">Overzicht</h2>
            </div>
            <span className="text-[13px] text-mda-text-muted bg-card border border-border px-3 py-2 rounded-full">
              Woensdag 20 mei 2026
            </span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Totaal aanvragen" value={24} trend="↑ 12% deze week" trendUp />
            <KpiCard label="Gekoppeld vandaag" value={3} trend="↑ 1 t.o.v. gisteren" trendUp />
            <KpiCard label="Gem. reactietijd" value={2.1} decimals={1} suffix="uur" trend="↓ 18 min sneller" trendUp />
            <KpiCard label="Openstaand" value={5} trend="Wacht op match" />
          </div>

          {/* Installer table */}
          <div className="flex justify-between items-center mt-1.5 mb-3.5">
            <h3 className="font-serif text-xl">Installateurs</h3>
            <div className="text-mda-text-muted text-[13px]">
              Klik op een kolomkop om te sorteren
            </div>
          </div>

          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {(
                    [
                      { key: "naam", label: "Naam", num: false },
                      { key: "stad", label: "Stad", num: false },
                      { key: "aanvragen", label: "Aanvragen", num: true },
                      { key: "reactie", label: "Reactietijd", num: true },
                      { key: "status", label: "Status", num: false },
                    ] as const
                  ).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        "text-left font-medium text-xs tracking-[0.08em] uppercase text-mda-text-muted",
                        "px-4.5 py-4 cursor-pointer select-none bg-[#F5F3EC] border-b border-border whitespace-nowrap",
                        "hover:text-mda-text",
                        col.num && "text-right",
                        sortKey === col.key && "text-mda-accent"
                      )}
                    >
                      {col.label}
                      <span
                        className={cn(
                          "inline-block ml-1.5 opacity-40 translate-y-px",
                          sortKey === col.key && "opacity-100 text-mda-accent"
                        )}
                      >
                        {sortKey === col.key
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedInstallers.map((d, i) => (
                  <tr
                    key={d.id}
                    className="opacity-0 translate-y-1"
                    style={{
                      animation: `rowIn 0.5s ease ${i * 60}ms forwards`,
                    }}
                  >
                    <td className="px-4.5 py-3.5 border-b border-border text-sm font-semibold">
                      {d.naam}
                    </td>
                    <td className="px-4.5 py-3.5 border-b border-border text-sm text-mda-text-muted">
                      {d.stad}
                    </td>
                    <td className="px-4.5 py-3.5 border-b border-border text-sm text-right tabular-nums">
                      <span
                        className="inline-block h-1.5 rounded-sm bg-[rgba(171,203,205,0.45)] align-middle mr-2"
                        style={{ width: `${(d.aanvragen / maxAanvragen) * 44}px` }}
                      />
                      {d.aanvragen}
                    </td>
                    <td className="px-4.5 py-3.5 border-b border-border text-sm text-right tabular-nums">
                      {d.reactie.toFixed(1)} u
                    </td>
                    <td className="px-4.5 py-3.5 border-b border-border text-sm">
                      <StatusBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent requests */}
          <div className="flex justify-between items-center mt-8 mb-3.5">
            <h3 className="font-serif text-xl">Laatste aanvragen</h3>
            <div className="text-mda-text-muted text-[13px]">5 meest recent</div>
          </div>

          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)]">
            {requests.map((r, i) => {
              const isYou = "isYou" in r && r.isYou;
              return (
                <div
                  key={`${r.naam}-${i}`}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto_auto] max-sm:grid-cols-[auto_1fr_auto] gap-4 max-sm:gap-2.5 items-center",
                    "px-4.5 py-3.5 border-b border-border text-sm last:border-b-0",
                    isYou && "bg-[rgba(111,143,106,0.10)] border-l-[3px] border-l-mda-success pl-[15px]"
                  )}
                  style={{ animation: `rowIn 0.5s ease ${i * 70}ms both` }}
                >
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#E7DDD0] to-[#CDBFAE] flex items-center justify-center font-medium text-[13px] text-[#5a4030]">
                    {getInitials(r.naam)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {r.naam}
                      {isYou && (
                        <span className="inline-block ml-2 text-[10px] tracking-[0.08em] uppercase bg-mda-success text-white px-1.5 py-0.5 rounded-full align-middle">
                          jij
                        </span>
                      )}
                    </div>
                    <div className="text-mda-text-muted text-[13px] max-sm:hidden">{r.stad}</div>
                  </div>
                  <span
                    className={cn(
                      "font-medium text-[11px] tracking-[0.04em] px-2 py-1 rounded-full whitespace-nowrap",
                      r.model === "kazumi" && "bg-[rgba(214,191,150,0.35)] text-[#7a5a2e]",
                      r.model === "haori" && "bg-[rgba(184,98,67,0.18)] text-[#7a3a25]",
                      r.model === "daiseikai" && "bg-[rgba(61,43,31,0.10)] text-mda-text"
                    )}
                  >
                    {MODELS[r.model].name}
                  </span>
                  <div className="text-mda-text-muted text-[13px] max-sm:hidden">{r.when}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("kaart")}
                    className="border-border text-mda-text hover:bg-[rgba(61,43,31,0.04)] text-xs px-3 py-1.5 h-auto"
                  >
                    Bekijk →
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  decimals = 0,
  suffix,
  trend,
  trendUp,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  trend: string;
  trendUp?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = value * eased;
      setDisplayValue(v);
      if (t < 1) requestAnimationFrame(tick);
      else setDisplayValue(value);
    }

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <div className="bg-card border border-border rounded-[10px] p-5 shadow-[0_2px_12px_rgba(61,43,31,0.07)] relative overflow-hidden">
      <div className="text-xs tracking-[0.08em] uppercase text-mda-text-muted">
        {label}
      </div>
      <div className="font-serif text-[46px] leading-[1.05] mt-2 flex items-baseline gap-1.5" ref={ref}>
        {decimals ? displayValue.toFixed(decimals) : Math.round(displayValue)}
        {suffix && <small className="text-lg text-mda-text-muted">{suffix}</small>}
      </div>
      <div
        className={cn(
          "text-xs mt-1.5 text-mda-text-muted",
          trendUp === true && "text-[#3e5a3a]",
          trendUp === false && "text-destructive"
        )}
      >
        {trend}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Installer["status"] }) {
  const isAvailable = status === "available";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap",
        isAvailable
          ? "bg-[rgba(111,143,106,0.14)] text-[#3e5a3a]"
          : "bg-[rgba(196,155,108,0.18)] text-[#7a5a32]"
      )}
    >
      <span
        className={cn(
          "w-1.75 h-1.75 rounded-full",
          isAvailable ? "bg-mda-success" : "bg-mda-warning"
        )}
      />
      {isAvailable ? "Beschikbaar" : "Bezet"}
    </span>
  );
}
