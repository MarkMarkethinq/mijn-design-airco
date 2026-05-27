"use client";

import { Mail, ArrowRight, User, MapPin, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODELS, type ModelKey, type Installer } from "@/lib/data";

interface InstallerEmailViewProps {
  requestData: {
    naam: string;
    email: string;
    telefoon: string;
    adres: string;
    postcode: string;
    model: ModelKey;
  } | null;
  matchedInstaller: Installer | null;
  onNextStep: () => void;
}

export default function InstallerEmailView({ requestData, matchedInstaller, onNextStep }: InstallerEmailViewProps) {
  const data = requestData || {
    naam: "Jan de Vries",
    email: "jan@voorbeeld.nl",
    telefoon: "06 12345678",
    adres: "Keizersgracht 102",
    postcode: "1015 AA",
    model: "haori" as ModelKey,
  };

  const installer = matchedInstaller || {
    naam: "Klimaat Experts BV",
    stad: "Amsterdam",
  };

  const model = MODELS[data.model];

  return (
    <section className="animate-view-in">
      <div className="max-w-3xl mx-auto">
        <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-2">
          Demo · stap 2 van 3
        </div>
        <h1 className="text-[34px] leading-[1.1] mb-3">
          E-mail naar installateur
        </h1>
        <p className="text-mda-text-muted max-w-[52ch] text-base mb-8">
          Dit is de e-mail die <span className="font-semibold text-mda-text">{installer.naam}</span> ontvangt zodra een klant een aanvraag indient.
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
                  Aan: {installer.naam.toLowerCase().replace(/\s+/g, "")}@email.nl
                </div>
              </div>
              <span className="text-mda-text-muted text-xs whitespace-nowrap">zojuist</span>
            </div>
            <div className="font-semibold text-[15px] text-mda-text">
              Nieuwe aanvraag: {model.name} installatie in {installer.stad}
            </div>
          </div>

          {/* Email body */}
          <div className="px-6 py-6">
            <p className="text-sm text-mda-text mb-4">
              Beste {installer.naam},
            </p>
            <p className="text-sm text-mda-text mb-5 leading-relaxed">
              Er is een nieuwe aanvraag binnengekomen via Mijn Design Airco. Een klant in jouw regio is geïnteresseerd in de installatie van een <span className="font-semibold">{model.name}</span>. Hieronder vind je de details.
            </p>

            {/* Request details card */}
            <div className="bg-[rgba(171,203,205,0.12)] border border-[rgba(122,158,159,0.25)] rounded-lg p-5 mb-5">
              <div className="text-[11px] tracking-[0.1em] uppercase text-mda-accent font-semibold mb-3.5">
                Aanvraaggegevens
              </div>
              <div className="space-y-3">
                <EmailDetailRow icon={<User className="w-3.5 h-3.5" />} label="Klant" value={data.naam} />
                <EmailDetailRow icon={<Mail className="w-3.5 h-3.5" />} label="E-mail" value={data.email} />
                <EmailDetailRow icon={<Phone className="w-3.5 h-3.5" />} label="Telefoon" value={data.telefoon} />
                <EmailDetailRow icon={<Home className="w-3.5 h-3.5" />} label="Adres" value={`${data.adres}, ${data.postcode}`} />
                <EmailDetailRow icon={<MapPin className="w-3.5 h-3.5" />} label="Regio" value={installer.stad} />
              </div>

              <div className="mt-4 pt-3.5 border-t border-[rgba(122,158,159,0.25)]">
                <div className="text-[11px] tracking-[0.08em] uppercase text-mda-accent font-semibold mb-2">
                  Gekozen model
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={model.img}
                    alt={model.name}
                    className="w-12 h-12 rounded-lg object-cover border border-border"
                  />
                  <div>
                    <div className="font-semibold text-sm">{model.name}</div>
                    <div className="text-mda-text-muted text-[12px]">{model.desc}</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-mda-text mb-5 leading-relaxed">
              Je kunt direct reageren op deze aanvraag via het installateursportaal. Stuur een offerte of neem contact op met de klant.
            </p>

            {/* CTA button in email */}
            <div className="text-center mb-5">
              <button
                onClick={onNextStep}
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-accent hover:text-white transition-colors cursor-pointer"
              >
                Bekijk aanvraag in portaal →
              </button>
            </div>

            <hr className="border-border my-5" />

            <p className="text-xs text-mda-text-muted leading-relaxed">
              Deze e-mail is automatisch verstuurd door Mijn Design Airco. Je ontvangt dit bericht omdat je als installatiepartner bent geregistreerd. Reageer binnen 24 uur om de aanvraag te behouden.
            </p>
          </div>

          {/* Email footer */}
          <div className="bg-[#F5F3EC] border-t border-border px-6 py-4">
            <div className="flex items-center justify-between text-xs text-mda-text-muted">
              <span>© 2026 Mijn Design Airco</span>
              <span>Uitschrijven · Voorkeuren</span>
            </div>
          </div>
        </div>

        {/* Next step CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onNextStep}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-white h-12 px-8 text-[15px] font-semibold gap-2"
          >
            Bekijk het installateur portaal
            <ArrowRight className="w-4.5 h-4.5" />
          </Button>
        </div>
        <p className="text-center text-xs text-mda-text-muted mt-3">
          Stap 3: Zie hoe de installateur reageert op de aanvraag
        </p>
      </div>
    </section>
  );
}

function EmailDetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-mda-accent shrink-0">{icon}</span>
      <span className="text-mda-text-muted w-16 shrink-0 text-[12px]">{label}</span>
      <span className="font-medium text-mda-text">{value}</span>
    </div>
  );
}
