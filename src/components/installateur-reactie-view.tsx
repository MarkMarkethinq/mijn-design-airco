"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Home, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MODELS, type RecentRequest } from "@/lib/data";
import { cn } from "@/lib/utils";

interface InstallateurReactieViewProps {
  request: RecentRequest;
  onBack: () => void;
  onComplete: () => void;
  onUpdateStatus: (requestId: string, status: RecentRequest["status"]) => void;
}

export default function InstallateurReactieView({ request, onBack, onComplete, onUpdateStatus }: InstallateurReactieViewProps) {
  const [responseState, setResponseState] = useState<"form" | "accepted" | "rejected">("form");
  const [submitting, setSubmitting] = useState(false);

  function handleAccept(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setResponseState("accepted");
      onUpdateStatus(request.id, "geaccepteerd");
    }, 1200);
  }

  function handleReject() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setResponseState("rejected");
      onUpdateStatus(request.id, "afgewezen");
    }, 800);
  }

  if (responseState === "accepted") {
    return (
      <section className="animate-view-in">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-8 text-center">
            <div className="w-[78px] h-[78px] rounded-full bg-[rgba(111,143,106,0.18)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-mda-success" />
            </div>
            <h2 className="text-[34px] leading-[1.1] mb-2">Reactie verstuurd!</h2>
            <p className="text-mda-text-muted max-w-[42ch] mx-auto">
              Je reactie is verstuurd naar {request.naam}. De klant ontvangt een e-mail met jouw offerte en beschikbaarheid.
            </p>
            <p className="text-mda-text-muted text-sm mt-2">
              De demo is compleet! Bekijk het dashboard voor een overzicht.
            </p>
            <Button
              onClick={onComplete}
              className="mt-6 bg-primary text-primary-foreground hover:bg-accent hover:text-white"
            >
              Ga naar dashboard →
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (responseState === "rejected") {
    return (
      <section className="animate-view-in">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-8 text-center">
            <div className="w-[78px] h-[78px] rounded-full bg-[rgba(196,155,108,0.18)] flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-mda-warning" />
            </div>
            <h2 className="text-[34px] leading-[1.1] mb-2">Aanvraag afgewezen</h2>
            <p className="text-mda-text-muted max-w-[42ch] mx-auto">
              De aanvraag van {request.naam} is afgewezen. De klant wordt hiervan op de hoogte gesteld.
            </p>
            <p className="text-mda-text-muted text-sm mt-2">
              De demo is compleet! Bekijk het dashboard voor een overzicht.
            </p>
            <Button
              onClick={onComplete}
              className="mt-6 bg-primary text-primary-foreground hover:bg-accent hover:text-white"
            >
              Ga naar dashboard →
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-view-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-mda-text-muted hover:text-mda-text transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar stap 2
        </button>

        <div className="font-medium text-xs tracking-[0.14em] uppercase text-mda-text-muted mb-2">
          Demo · stap 3 van 3 — Installateur portaal
        </div>
        <h1 className="text-[34px] leading-[1.1] mb-8">
          Reageer op aanvraag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
          {/* Left: Request details */}
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-6">
            <h3 className="font-serif text-xl mb-4">Aanvraaggegevens</h3>

            <div className="space-y-3.5">
              <DetailItem icon={<User className="w-4 h-4" />} label="Naam" value={request.naam} />
              <DetailItem icon={<Mail className="w-4 h-4" />} label="E-mail" value={request.email} />
              <DetailItem icon={<Phone className="w-4 h-4" />} label="Telefoon" value={request.telefoon} />
              <DetailItem icon={<Home className="w-4 h-4" />} label="Adres" value={request.adres} />
              <DetailItem icon={<MapPin className="w-4 h-4" />} label="Postcode & stad" value={`${request.postcode}, ${request.stad}`} />
              <DetailItem icon={<Calendar className="w-4 h-4" />} label="Ingediend" value={request.when} />
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <div className="text-xs tracking-[0.08em] uppercase text-mda-text-muted mb-2">Gekozen model</div>
              <div className="flex items-center gap-3">
                <img
                  src={MODELS[request.model].img}
                  alt={MODELS[request.model].name}
                  className="w-14 h-14 rounded-lg object-cover border border-border"
                />
                <div>
                  <div className="font-semibold">{MODELS[request.model].name}</div>
                  <div className="text-mda-text-muted text-[13px]">{MODELS[request.model].desc}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-1.5 rounded-full",
                  request.status === "nieuw" && "bg-[rgba(171,203,205,0.35)] text-[#1f3f40]",
                  request.status === "in_behandeling" && "bg-[rgba(196,155,108,0.18)] text-[#7a5a32]",
                  request.status === "geaccepteerd" && "bg-[rgba(111,143,106,0.14)] text-[#3e5a3a]",
                  request.status === "afgewezen" && "bg-[rgba(196,60,60,0.12)] text-[#7a2a2a]"
                )}
              >
                <span
                  className={cn(
                    "w-1.75 h-1.75 rounded-full",
                    request.status === "nieuw" && "bg-primary",
                    request.status === "in_behandeling" && "bg-mda-warning",
                    request.status === "geaccepteerd" && "bg-mda-success",
                    request.status === "afgewezen" && "bg-destructive"
                  )}
                />
                {request.status === "nieuw" && "Nieuw"}
                {request.status === "in_behandeling" && "In behandeling"}
                {request.status === "geaccepteerd" && "Geaccepteerd"}
                {request.status === "afgewezen" && "Afgewezen"}
              </span>
            </div>
          </div>

          {/* Right: Response form */}
          <div className="bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)] p-6">
            <h3 className="font-serif text-xl mb-4">Jouw reactie</h3>
            <p className="text-mda-text-muted text-sm mb-5">
              Stuur een offerte of reactie naar de klant, of wijs de aanvraag af als je niet beschikbaar bent.
            </p>

            <form onSubmit={handleAccept} noValidate>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ir-kosten">Geschatte kosten (incl. BTW)</Label>
                  <Input
                    id="ir-kosten"
                    name="kosten"
                    type="text"
                    required
                    placeholder="€ 2.450,00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ir-datum">Beschikbaar vanaf</Label>
                    <Input
                      id="ir-datum"
                      name="datum"
                      type="date"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ir-doorlooptijd">Geschatte doorlooptijd</Label>
                    <Input
                      id="ir-doorlooptijd"
                      name="doorlooptijd"
                      type="text"
                      required
                      placeholder="1-2 werkdagen"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ir-toelichting">Toelichting / offerte details</Label>
                  <Textarea
                    id="ir-toelichting"
                    name="toelichting"
                    required
                    rows={4}
                    placeholder="Beschrijf je aanbod, inclusief wat er wel/niet inbegrepen is..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ir-contact">Contactpersoon</Label>
                  <Input
                    id="ir-contact"
                    name="contact"
                    type="text"
                    required
                    placeholder="Naam van de monteur/contactpersoon"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ir-telefoon">Telefoonnummer voor klant</Label>
                  <Input
                    id="ir-telefoon"
                    name="telefoon"
                    type="tel"
                    required
                    placeholder="06 12345678"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent hover:text-white h-11 font-semibold"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[rgba(31,63,64,0.25)] border-t-[#1f3f40] rounded-full animate-spin-loader" />
                      Versturen…
                    </>
                  ) : (
                    "Offerte versturen"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={handleReject}
                  className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive h-11 font-semibold"
                >
                  Afwijzen
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-mda-accent mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-mda-text-muted text-[12px] uppercase tracking-[0.06em]">{label}</div>
        <div className="font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}
