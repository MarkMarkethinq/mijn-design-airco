"use client";

import { useState, type FormEvent } from "react";
import { Shield, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODELS, postcodeToInstaller, type ModelKey, type Installer } from "@/lib/data";
import AircoPreview from "./airco-preview";

interface FormulierViewProps {
  onSubmit: (data: {
    naam: string;
    email: string;
    stad: string;
    model: ModelKey;
    matchedInstaller: Installer;
  }) => void;
}

export default function FormulierView({ onSubmit }: FormulierViewProps) {
  const [selectedModel, setSelectedModel] = useState<ModelKey>("haori");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    firstName: string;
    email: string;
    matchedInstaller: Installer;
  } | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const naam = formData.get("naam") as string;
    const email = formData.get("email") as string;
    const pc = formData.get("pc") as string;

    setSubmitting(true);

    setTimeout(() => {
      const matched = postcodeToInstaller(pc);
      const firstName = (naam || "").trim().split(/\s+/)[0] || "daar";

      setSuccessData({ firstName, email, matchedInstaller: matched });
      setSuccess(true);
      setSubmitting(false);

      onSubmit({
        naam,
        email,
        stad: matched.stad,
        model: selectedModel,
        matchedInstaller: matched,
      });
    }, 1500);
  }

  function handleReset() {
    setSuccess(false);
    setSuccessData(null);
    setSelectedModel("haori");
  }

  return (
    <section className="animate-view-in">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
        {/* Left: intro + trust */}
        <div>
          <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-4.5">
            Aanvraag · stap 1 van 1
          </div>
          <h1 className="text-5xl leading-[1.05] mb-3.5 max-w-[14ch]">
            Vul je gegevens in, wij regelen de rest.
          </h1>
          <p className="text-mda-text-muted max-w-[42ch] text-base mb-8">
            We koppelen je binnen één werkdag aan een gecertificeerde installateur bij jou in de buurt — afgestemd op het model dat je wilt.
          </p>

          <div className="flex flex-col gap-3.5 border-t border-border pt-6 mt-2">
            <TrustRow
              icon={<Shield className="w-5 h-5 text-mda-accent mt-0.5 shrink-0" />}
              title="Gecertificeerde installateurs"
              desc="F-gassen gecertificeerd, lokaal en beoordeeld"
            />
            <TrustRow
              icon={<Clock className="w-5 h-5 text-mda-accent mt-0.5 shrink-0" />}
              title="Reactie binnen één werkdag"
              desc="Gemiddeld 2,1 uur tot eerste contact"
            />
            <TrustRow
              icon={<MapPin className="w-5 h-5 text-mda-accent mt-0.5 shrink-0" />}
              title="Gekoppeld op locatie"
              desc="Op basis van jouw postcode, geen onnodige reistijd"
            />
          </div>
        </div>

        {/* Right: form card + preview */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-7">
            {!success ? (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-x-4.5">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="f-naam">Naam</Label>
                    <Input id="f-naam" name="naam" required placeholder="Jan de Vries" autoComplete="name" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="f-email">E-mailadres</Label>
                    <Input id="f-email" name="email" type="email" required placeholder="jan@voorbeeld.nl" autoComplete="email" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="f-tel">Telefoonnummer</Label>
                    <Input id="f-tel" name="tel" type="tel" required placeholder="06 12345678" autoComplete="tel" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="f-pc">Postcode</Label>
                    <Input id="f-pc" name="pc" required placeholder="1011 AB" autoComplete="postal-code" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor="f-adres">Adres</Label>
                    <Input id="f-adres" name="adres" required placeholder="Straatnaam 12" autoComplete="street-address" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label>Type airco</Label>
                    <Select value={selectedModel} onValueChange={(v) => setSelectedModel(v as ModelKey)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daiseikai">Daiseikai — matzwart, premium</SelectItem>
                        <SelectItem value="haori">Haori — cognacbruin leer</SelectItem>
                        <SelectItem value="kazumi">Kazumi — naturel houten latten</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-5.5 flex flex-col gap-2.5">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-white transition-all duration-200 h-12 text-[15px] font-semibold"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4.5 h-4.5 border-2 border-[rgba(31,63,64,0.25)] border-t-[#1f3f40] rounded-full animate-spin-loader" />
                        Versturen…
                      </>
                    ) : (
                      "Aanvraag versturen"
                    )}
                  </Button>
                  <p className="text-xs text-mda-text-muted text-center">
                    Door te versturen ga je akkoord met onze voorwaarden. Geen kosten, geen verplichtingen.
                  </p>
                </div>
              </form>
            ) : (
              <SuccessState
                firstName={successData?.firstName || ""}
                email={successData?.email || ""}
                matchedInstaller={successData?.matchedInstaller || null}
                onReset={handleReset}
                onNavigateKaart={() => {/* handled by parent */}}
              />
            )}
          </div>

          <AircoPreview selectedModel={selectedModel} />
        </div>
      </div>
    </section>
  );
}

function TrustRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3 items-start text-sm text-mda-text">
      {icon}
      <div>
        <b className="font-semibold">{title}</b>
        <span className="text-mda-text-muted block text-[13px] mt-0.5">{desc}</span>
      </div>
    </div>
  );
}

function SuccessState({
  firstName,
  email,
  matchedInstaller,
  onReset,
}: {
  firstName: string;
  email: string;
  matchedInstaller: Installer | null;
  onReset: () => void;
  onNavigateKaart: () => void;
}) {
  return (
    <div className="py-12 px-8 text-center flex flex-col items-center gap-2 animate-view-in">
      <div className="w-[78px] h-[78px] rounded-full bg-[rgba(171,203,205,0.35)] flex items-center justify-center mb-2">
        <svg viewBox="0 0 60 60" fill="none" stroke="#1f3f40" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" className="w-[42px] h-[42px]">
          <circle className="check-ring" cx="30" cy="30" r="27" />
          <polyline className="check-tick" points="18,31 27,40 43,22" />
        </svg>
      </div>
      <h2 className="text-[34px] leading-[1.1] mb-1.5">Bedankt, {firstName}!</h2>
      <p className="text-mda-text-muted max-w-[46ch]">
        Je aanvraag is ontvangen. We koppelen je zo snel mogelijk aan een installateur bij jou in de buurt.
      </p>
      <p className="text-mda-text-muted mt-1">
        Je ontvangt een bevestiging op {email}
      </p>

      {matchedInstaller && (
        <div className="mt-3.5 bg-linear-to-b from-[#EAF3F3] to-[#E0EDED] border border-[rgba(122,158,159,0.3)] rounded-[10px] p-4.5 w-full text-left animate-view-in">
          <div className="text-[11px] tracking-[0.1em] uppercase text-[#2E5454] font-semibold">
            Jouw aanvraag is gekoppeld aan
          </div>
          <div className="font-serif text-2xl mt-1 mb-0.5">{matchedInstaller.naam}</div>
          <div className="text-[13px] text-[#3a5a5a] mb-3">
            {matchedInstaller.stad} — gekoppeld op basis van jouw postcode
          </div>
        </div>
      )}

      <div className="mt-5.5 flex gap-2.5 flex-wrap justify-center">
        <Button
          variant="outline"
          onClick={onReset}
          className="border-border text-mda-text hover:bg-[rgba(61,43,31,0.04)]"
        >
          Nieuwe aanvraag
        </Button>
      </div>
    </div>
  );
}
