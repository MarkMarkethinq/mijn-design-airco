"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type L from "leaflet";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTALLERS, type Installer } from "@/lib/data";
import { cn } from "@/lib/utils";

interface KaartViewProps {
  matchedInstaller: Installer | null;
}

export default function KaartView({ matchedInstaller }: KaartViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const updateMarkerStyles = useCallback((selectedId: string | null) => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const pin = el.querySelector(".pin");
      if (pin) {
        pin.classList.toggle("selected", id === selectedId);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([52.2, 5.3], 7);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap, &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
          pane: "shadowPane",
        }
      ).addTo(map);

      INSTALLERS.forEach((inst) => {
        const icon = L.divIcon({
          className: "pin-wrap",
          html: `<div class="pin" data-id="${inst.id}"></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
        const m = L.marker([inst.lat, inst.lng], { icon }).addTo(map);
        m.on("click", () => {
          setSelectedInstaller(inst);
          updateMarkerStyles(inst.id);
          map.flyTo([inst.lat, inst.lng], 9, { duration: 0.7 });
        });
        markersRef.current[inst.id] = m;
      });

      leafletMap.current = map;
      setMapReady(true);
    }

    initMap();

    return () => {
      cancelled = true;
    };
  }, [updateMarkerStyles]);

  useEffect(() => {
    if (mapReady && matchedInstaller) {
      updateMarkerStyles(matchedInstaller.id);
    }
  }, [mapReady, matchedInstaller, updateMarkerStyles]);

  useEffect(() => {
    if (leafletMap.current) {
      setTimeout(() => leafletMap.current?.invalidateSize(), 100);
    }
  });

  function handleSelectInstaller() {
    alert(
      "Bedankt! We sturen je gegevens door naar deze installateur. Je hoort binnen één werkdag van ze."
    );
  }

  function handleMatchMessage() {
    alert(
      `Bericht verstuurd naar ${matchedInstaller?.naam || "de installateur"}. Ze nemen binnen één werkdag contact op.`
    );
  }

  return (
    <section className="animate-view-in">
      {/* Header */}
      <div className="flex justify-between items-end gap-6 mb-6 flex-wrap">
        <div>
          <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted">
            Netwerk
          </div>
          <h2 className="text-[34px] leading-[1.1] mt-2">
            Gecertificeerde installateurs in Nederland
          </h2>
          <p className="text-mda-text-muted max-w-[48ch] mt-1.5">
            Klik op een pin om details te zien. We tonen alleen partners met actuele beschikbaarheid.
          </p>
        </div>
        <div className="flex gap-4.5 text-[13px] text-mda-text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            Beschikbaar
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            Gekoppeld aan jou
          </span>
        </div>
      </div>

      {/* Map + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div
          ref={mapRef}
          className="h-[600px] max-lg:h-[460px] rounded-[10px] overflow-hidden border border-border shadow-[0_2px_12px_rgba(61,43,31,0.07)] bg-[#E8E5DD]"
          aria-label="Kaart van Nederland met installateurs"
        />

        <div>
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)]">
            {!selectedInstaller ? (
              <div className="py-8 px-5.5 text-center flex flex-col gap-3 items-center">
                <div className="w-[46px] h-[46px] rounded-full bg-[rgba(171,203,205,0.3)] flex items-center justify-center text-[#2E5454]">
                  <MapPin className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xl">Selecteer een installateur</h3>
                <p className="text-mda-text-muted text-[13px] max-w-[30ch]">
                  Klik op een pin op de kaart om de details en beschikbaarheid te bekijken.
                </p>
              </div>
            ) : (
              <InstallerCard
                installer={selectedInstaller}
                onSelect={handleSelectInstaller}
              />
            )}
          </div>

          {matchedInstaller && (
            <div className="bg-linear-to-b from-[#EAF3F3] to-[#E0EDED] border border-[rgba(122,158,159,0.3)] rounded-[10px] p-4.5 mt-3.5 animate-view-in">
              <div className="text-[11px] tracking-[0.1em] uppercase text-[#2E5454] font-semibold">
                Jouw aanvraag is gekoppeld aan
              </div>
              <div className="font-serif text-2xl mt-1 mb-0.5">
                {matchedInstaller.naam}
              </div>
              <div className="text-[13px] text-[#3a5a5a] mb-3">
                {matchedInstaller.stad} — gekoppeld op basis van jouw postcode
              </div>
              <Button
                onClick={handleMatchMessage}
                className="w-full bg-[#1f3f40] text-white hover:bg-[#142b2c] text-[13px] h-10"
              >
                Stuur een bericht →
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function InstallerCard({
  installer,
  onSelect,
}: {
  installer: Installer;
  onSelect: () => void;
}) {
  const isAvailable = installer.status === "available";

  return (
    <div className="p-5.5 animate-view-in">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-serif text-2xl leading-[1.1] mb-1">
            {installer.naam}
          </h3>
          <div className="text-mda-text-muted text-[13px]">{installer.stad}</div>
        </div>
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
              "w-[7px] h-[7px] rounded-full",
              isAvailable ? "bg-mda-success" : "bg-mda-warning"
            )}
          />
          {isAvailable ? "Beschikbaar" : "Bezet"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 my-4.5 border-t border-b border-dashed border-border py-3.5">
        <div>
          <div className="text-[11px] tracking-[0.1em] uppercase text-mda-text-muted">
            Reactietijd
          </div>
          <div className="font-serif text-2xl leading-[1.1] mt-1">
            {installer.reactie.toFixed(1)} u
          </div>
        </div>
        <div>
          <div className="text-[11px] tracking-[0.1em] uppercase text-mda-text-muted">
            Opdrachten
          </div>
          <div className="font-serif text-2xl leading-[1.1] mt-1">
            {installer.aanvragen}
          </div>
        </div>
      </div>

      <p className="text-[13px] text-mda-text-muted mb-4.5">{installer.desc}</p>

      <Button
        onClick={onSelect}
        className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-white h-11"
      >
        Selecteer deze installateur
      </Button>
    </div>
  );
}
