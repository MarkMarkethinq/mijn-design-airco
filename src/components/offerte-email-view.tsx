"use client";

import { Mail, ArrowRight, Clock, CheckCircle2, XCircle, Phone, User, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODELS, type ModelKey, type Installer } from "@/lib/data";

interface FormSubmitData {
  naam: string;
  email: string;
  telefoon: string;
  adres: string;
  postcode: string;
  stad: string;
  model: ModelKey;
  matchedInstaller: Installer;
}

export interface InstallateurResponse {
  kosten: string;
  datum: string;
  doorlooptijd: string;
  toelichting: string;
  contact: string;
  telefoon: string;
  status: "geaccepteerd" | "afgewezen";
}

interface OfferteEmailViewProps {
  formData: FormSubmitData;
  matchedInstaller: Installer;
  installateurResponse: InstallateurResponse | null;
  onGoToInstallateur: () => void;
  onGoToAdmin: () => void;
}

export default function OfferteEmailView({
  formData,
  matchedInstaller,
  installateurResponse,
  onGoToInstallateur,
  onGoToAdmin,
}: OfferteEmailViewProps) {
  const model = MODELS[formData.model];
  const firstName = (formData.naam || "").trim().split(/\s+/)[0] || "daar";

  // Waiting state — installateur has not yet responded
  if (!installateurResponse) {
    return (
      <section className="animate-view-in">
        <div className="max-w-2xl mx-auto">
          <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-2">
            Klant · Offerte
          </div>
          <h1 className="text-[34px] leading-[1.1] mb-8">
            Wachten op offerte
          </h1>

          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-8 text-center">
            <div className="w-[78px] h-[78px] rounded-full bg-[rgba(171,203,205,0.25)] flex items-center justify-center mx-auto mb-4">
              <Clock className="w-9 h-9 text-mda-accent animate-pulse-dot" />
            </div>
            <h2 className="text-[28px] leading-[1.15] mb-2">Je installateur bekijkt je aanvraag...</h2>
            <p className="text-mda-text-muted max-w-[42ch] mx-auto mb-2">
              <span className="font-semibold text-mda-text">{matchedInstaller.naam}</span> heeft je aanvraag ontvangen en bekijkt deze momenteel.
            </p>
            <p className="text-mda-text-muted text-sm">
              Gemiddelde reactietijd: <span className="font-semibold">{matchedInstaller.reactie} uur</span>
            </p>

            <div className="mt-6">
              <Button
                onClick={onGoToInstallateur}
                className="bg-primary text-primary-foreground hover:bg-accent hover:text-white h-11 px-6 font-semibold gap-2"
              >
                Simuleer de reactie in het installateurs-portaal
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Rejection state
  if (installateurResponse.status === "afgewezen") {
    return (
      <section className="animate-view-in">
        <div className="max-w-3xl mx-auto">
          <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-2">
            Klant · Update
          </div>
          <h1 className="text-[34px] leading-[1.1] mb-3">
            Update over je aanvraag
          </h1>
          <p className="text-mda-text-muted max-w-[52ch] text-base mb-8">
            De installateur heeft gereageerd op je aanvraag.
          </p>

          {/* Email container */}
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] overflow-hidden">
            {/* Email header */}
            <div className="bg-[#F5F3EC] border-b border-border px-6 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(196,155,108,0.18)] flex items-center justify-center">
                  <Mail className="w-4.5 h-4.5 text-mda-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">Mijn Design Airco</span>
                    <span className="text-mda-text-muted text-xs">&lt;noreply@mijndesignairco.nl&gt;</span>
                  </div>
                  <div className="text-mda-text-muted text-xs mt-0.5">
                    Aan: {formData.email}
                  </div>
                </div>
                <span className="text-mda-text-muted text-xs whitespace-nowrap">zojuist</span>
              </div>
              <div className="font-semibold text-[15px] text-mda-text">
                Update over je aanvraag — {model.name}
              </div>
            </div>

            {/* Email body */}
            <div className="px-6 py-6">
              <p className="text-sm text-mda-text mb-4">
                Beste {firstName},
              </p>
              <p className="text-sm text-mda-text mb-5 leading-relaxed">
                Helaas is <span className="font-semibold">{matchedInstaller.naam}</span> momenteel niet beschikbaar om je aanvraag te behandelen. We zoeken automatisch een nieuwe installateur voor je in de regio {matchedInstaller.stad}.
              </p>

              <div className="bg-[rgba(196,155,108,0.12)] border border-[rgba(196,155,108,0.3)] rounded-lg p-5 mb-5">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-mda-warning shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Installateur niet beschikbaar</div>
                    <div className="text-mda-text-muted text-[13px]">We koppelen je zo snel mogelijk aan een andere gecertificeerde installateur.</div>
                  </div>
                </div>
              </div>

              <hr className="border-border my-5" />

              <p className="text-xs text-mda-text-muted leading-relaxed">
                Deze e-mail is automatisch verstuurd door Mijn Design Airco. Je hoeft zelf niets te doen — we nemen contact met je op zodra een nieuwe installateur beschikbaar is.
              </p>
            </div>

            {/* Email footer */}
            <div className="bg-[#F5F3EC] border-t border-border px-6 py-4">
              <div className="flex items-center justify-between text-xs text-mda-text-muted">
                <span>&copy; 2026 Mijn Design Airco</span>
                <span>Uitschrijven &middot; Voorkeuren</span>
              </div>
            </div>
          </div>

          {/* Next step CTA */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={onGoToAdmin}
              className="bg-primary text-primary-foreground hover:bg-accent hover:text-white h-12 px-8 text-[15px] font-semibold gap-2"
            >
              Bekijk het dashboard als admin
              <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          </div>
          <p className="text-center text-xs text-mda-text-muted mt-3">
            Bekijk het overzicht vanuit het perspectief van de beheerder
          </p>
        </div>
      </section>
    );
  }

  // Accepted / Quote received state
  return (
    <section className="animate-view-in">
      <div className="max-w-3xl mx-auto">
        <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-2">
          Klant · Offerte ontvangen
        </div>
        <h1 className="text-[34px] leading-[1.1] mb-3">
          Je hebt een offerte ontvangen!
        </h1>
        <p className="text-mda-text-muted max-w-[52ch] text-base mb-8">
          <span className="font-semibold text-mda-text">{matchedInstaller.naam}</span> heeft een offerte verstuurd voor je {model.name} installatie.
        </p>

        {/* Email container */}
        <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] overflow-hidden">
          {/* Email header */}
          <div className="bg-[#F5F3EC] border-b border-border px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[rgba(111,143,106,0.18)] flex items-center justify-center">
                <Mail className="w-4.5 h-4.5 text-mda-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">Mijn Design Airco</span>
                  <span className="text-mda-text-muted text-xs">namens {matchedInstaller.naam}</span>
                </div>
                <div className="text-mda-text-muted text-xs mt-0.5">
                  Aan: {formData.email}
                </div>
              </div>
              <span className="text-mda-text-muted text-xs whitespace-nowrap">zojuist</span>
            </div>
            <div className="font-semibold text-[15px] text-mda-text">
              Goed nieuws — je hebt een offerte ontvangen!
            </div>
          </div>

          {/* Email body */}
          <div className="px-6 py-6">
            <p className="text-sm text-mda-text mb-4">
              Beste {firstName},
            </p>
            <p className="text-sm text-mda-text mb-5 leading-relaxed">
              Goed nieuws! <span className="font-semibold">{matchedInstaller.naam}</span> heeft je aanvraag bekeken en een offerte opgesteld voor de installatie van je <span className="font-semibold">{model.name}</span>.
            </p>

            {/* Quote details card */}
            <div className="bg-[rgba(111,143,106,0.08)] border border-[rgba(111,143,106,0.25)] rounded-lg p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-mda-success" />
                <div className="text-[11px] tracking-[0.1em] uppercase text-mda-success font-semibold">
                  Offerte details
                </div>
              </div>
              <div className="space-y-3">
                <QuoteDetail icon={<FileText className="w-3.5 h-3.5" />} label="Kosten" value={installateurResponse.kosten} highlight />
                <QuoteDetail icon={<Calendar className="w-3.5 h-3.5" />} label="Beschikbaar" value={installateurResponse.datum} />
                <QuoteDetail icon={<Clock className="w-3.5 h-3.5" />} label="Doorlooptijd" value={installateurResponse.doorlooptijd} />
                <QuoteDetail icon={<User className="w-3.5 h-3.5" />} label="Contact" value={installateurResponse.contact} />
                <QuoteDetail icon={<Phone className="w-3.5 h-3.5" />} label="Telefoon" value={installateurResponse.telefoon} />
              </div>

              {installateurResponse.toelichting && (
                <div className="mt-4 pt-3.5 border-t border-[rgba(111,143,106,0.25)]">
                  <div className="text-[11px] tracking-[0.08em] uppercase text-mda-success font-semibold mb-2">
                    Toelichting
                  </div>
                  <p className="text-sm text-mda-text leading-relaxed">
                    {installateurResponse.toelichting}
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-mda-text mb-5 leading-relaxed">
              Neem gerust contact op met de installateur als je vragen hebt over de offerte.
            </p>

            <hr className="border-border my-5" />

            <p className="text-xs text-mda-text-muted leading-relaxed">
              Deze e-mail is automatisch verstuurd door Mijn Design Airco namens {matchedInstaller.naam}. Neem bij vragen contact op met de installateur.
            </p>
          </div>

          {/* Email footer */}
          <div className="bg-[#F5F3EC] border-t border-border px-6 py-4">
            <div className="flex items-center justify-between text-xs text-mda-text-muted">
              <span>&copy; 2026 Mijn Design Airco</span>
              <span>Uitschrijven &middot; Voorkeuren</span>
            </div>
          </div>
        </div>

        {/* Next step CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onGoToAdmin}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-white h-12 px-8 text-[15px] font-semibold gap-2"
          >
            Bekijk het dashboard als admin
            <ArrowRight className="w-4.5 h-4.5" />
          </Button>
        </div>
        <p className="text-center text-xs text-mda-text-muted mt-3">
          Bekijk het overzicht vanuit het perspectief van de beheerder
        </p>
      </div>
    </section>
  );
}

function QuoteDetail({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-mda-success shrink-0">{icon}</span>
      <span className="text-mda-text-muted w-20 shrink-0 text-[12px]">{label}</span>
      <span className={`font-medium text-mda-text ${highlight ? "text-base font-bold" : ""}`}>{value}</span>
    </div>
  );
}
