"use client";

import { Mail, ArrowRight, Check, Clock, FileText } from "lucide-react";
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

interface BevestigingEmailViewProps {
  formData: FormSubmitData;
  matchedInstaller: Installer;
  onNextStep: () => void;
}

export default function BevestigingEmailView({ formData, matchedInstaller, onNextStep }: BevestigingEmailViewProps) {
  const model = MODELS[formData.model];
  const firstName = (formData.naam || "").trim().split(/\s+/)[0] || "daar";

  return (
    <section className="animate-view-in">
      <div className="max-w-3xl mx-auto">
        <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-2">
          Klant · Bevestiging
        </div>
        <h1 className="text-[34px] leading-[1.1] mb-3">
          Bevestigingsmail ontvangen
        </h1>
        <p className="text-mda-text-muted max-w-[52ch] text-base mb-8">
          Dit is de e-mail die <span className="font-semibold text-mda-text">{firstName}</span> ontvangt na het indienen van de aanvraag.
        </p>

        {/* Email container */}
        <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] overflow-hidden">
          {/* Email header */}
          <div className="bg-[#F5F3EC] border-b border-border px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-4.5 h-4.5 text-mda-accent" />
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
              Je aanvraag is ontvangen — {model.name}
            </div>
          </div>

          {/* Email body */}
          <div className="px-6 py-6">
            <p className="text-sm text-mda-text mb-4">
              Beste {firstName},
            </p>
            <p className="text-sm text-mda-text mb-5 leading-relaxed">
              Bedankt voor je aanvraag. We hebben je aanvraag ontvangen en doorgestuurd naar een installateur bij jou in de buurt. Je ontvangt binnen 24 uur een offerte.
            </p>

            {/* Request summary card */}
            <div className="bg-[rgba(171,203,205,0.12)] border border-[rgba(122,158,159,0.25)] rounded-lg p-5 mb-5">
              <div className="text-[11px] tracking-[0.1em] uppercase text-mda-accent font-semibold mb-3.5">
                Je aanvraag
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={model.img}
                    alt={model.name}
                    className="w-14 h-14 rounded-lg object-cover border border-border"
                  />
                  <div>
                    <div className="font-semibold text-sm">{model.name}</div>
                    <div className="text-mda-text-muted text-[12px]">{model.desc}</div>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-[rgba(122,158,159,0.25)] text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-mda-text-muted w-16 shrink-0 text-[12px]">Adres</span>
                    <span className="font-medium text-mda-text">{formData.adres}, {formData.postcode}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-mda-text-muted w-16 shrink-0 text-[12px]">Regio</span>
                    <span className="font-medium text-mda-text">{formData.stad}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matched installer card */}
            <div className="bg-linear-to-b from-[#EAF3F3] to-[#E0EDED] border border-[rgba(122,158,159,0.3)] rounded-lg p-5 mb-5">
              <div className="text-[11px] tracking-[0.1em] uppercase text-[#2E5454] font-semibold mb-2">
                Gekoppelde installateur
              </div>
              <div className="font-semibold text-sm">{matchedInstaller.naam}</div>
              <div className="text-[13px] text-[#3a5a5a]">
                {matchedInstaller.stad} — gemiddelde reactietijd: {matchedInstaller.reactie} uur
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-5">
              <div className="text-[11px] tracking-[0.1em] uppercase text-mda-text-muted font-semibold mb-3.5">
                Wat gebeurt er nu?
              </div>
              <div className="space-y-0">
                <TimelineStep
                  icon={<Check className="w-3.5 h-3.5" />}
                  text="Aanvraag ontvangen"
                  status="completed"
                />
                <TimelineStep
                  icon={<Clock className="w-3.5 h-3.5" />}
                  text="Installateur bekijkt je aanvraag (binnen 24 uur)"
                  status="active"
                />
                <TimelineStep
                  icon={<FileText className="w-3.5 h-3.5" />}
                  text="Je ontvangt een offerte"
                  status="pending"
                  isLast
                />
              </div>
            </div>

            <hr className="border-border my-5" />

            <p className="text-xs text-mda-text-muted leading-relaxed">
              Deze e-mail is automatisch verstuurd door Mijn Design Airco. Je ontvangt dit bericht omdat je een aanvraag hebt ingediend via ons platform.
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
            onClick={onNextStep}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-white h-12 px-8 text-[15px] font-semibold gap-2"
          >
            Bekijk wat de installateur ontvangt
            <ArrowRight className="w-4.5 h-4.5" />
          </Button>
        </div>
        <p className="text-center text-xs text-mda-text-muted mt-3">
          Volgende stap: bekijk de aanvraag vanuit het perspectief van de installateur
        </p>
      </div>
    </section>
  );
}

function TimelineStep({
  icon,
  text,
  status,
  isLast,
}: {
  icon: React.ReactNode;
  text: string;
  status: "completed" | "active" | "pending";
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
            status === "completed"
              ? "bg-mda-success text-white"
              : status === "active"
                ? "bg-[rgba(171,203,205,0.35)] text-mda-accent"
                : "bg-[rgba(61,43,31,0.06)] text-mda-text-muted"
          }`}
        >
          {icon}
        </div>
        {!isLast && (
          <div className="w-px h-4 bg-border" />
        )}
      </div>
      <div className={`text-sm pt-1 pb-4 ${status === "completed" ? "text-mda-success font-medium" : status === "active" ? "text-mda-text font-medium" : "text-mda-text-muted"}`}>
        {text}
      </div>
    </div>
  );
}
