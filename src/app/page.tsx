"use client";

import { useState, useCallback } from "react";
import { Wrench, ArrowRight } from "lucide-react";
import Navigation, { type RoleTab } from "@/components/navigation";
import StepIndicator from "@/components/step-indicator";
import FormulierView from "@/components/formulier-view";
import BevestigingEmailView from "@/components/bevestiging-email-view";
import OfferteEmailView from "@/components/offerte-email-view";
import InstallerEmailView from "@/components/installer-email-view";
import InstallateurReactieView from "@/components/installateur-reactie-view";
import DashboardView from "@/components/dashboard-view";
import { Button } from "@/components/ui/button";
import { MODELS, type Installer, type ModelKey, type RecentRequest } from "@/lib/data";
import type { InstallateurResponseData } from "@/components/installateur-reactie-view";
import type { DashboardNotification } from "@/components/dashboard-view";

type KlantStep = "aanvraag" | "bevestiging" | "offerte";
type InstallateurStep = "aanvraag" | "reactie";

interface UserRequest {
  naam: string;
  email: string;
  stad: string;
  model: ModelKey;
}

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

export interface RequestResolution {
  installerNaam: string;
  status: "geaccepteerd" | "afgewezen";
  doorgestuurdNaar?: string;
}

const KLANT_STEPS: { key: string; label: string }[] = [
  { key: "aanvraag", label: "Aanvraag" },
  { key: "bevestiging", label: "Bevestiging" },
  { key: "offerte", label: "Offerte" },
];

const INSTALLATEUR_STEPS: { key: string; label: string }[] = [
  { key: "aanvraag", label: "Aanvraag" },
  { key: "reactie", label: "Reactie" },
];

export default function Home() {
  // Role & sub-step navigation
  const [activeRole, setActiveRole] = useState<RoleTab>("klant");
  const [klantStep, setKlantStep] = useState<KlantStep>("aanvraag");
  const [installateurStep, setInstallateurStep] = useState<InstallateurStep>("aanvraag");

  // Form data
  const [userRequest, setUserRequest] = useState<UserRequest | null>(null);
  const [formSubmitData, setFormSubmitData] = useState<FormSubmitData | null>(null);
  const [matchedInstaller, setMatchedInstaller] = useState<Installer | null>(null);

  // Installateur response
  const [installateurResponse, setInstallateurResponse] = useState<InstallateurResponseData | null>(null);

  // Dashboard data
  const [requestStatuses, setRequestStatuses] = useState<Record<string, RecentRequest["status"]>>({});
  const [requestResolutions, setRequestResolutions] = useState<Record<string, RequestResolution>>({});
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);

  // --- Navigation helpers ---

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleRoleNavigate = useCallback((role: RoleTab) => {
    setActiveRole(role);
    scrollToTop();
  }, [scrollToTop]);

  const handleReset = useCallback(() => {
    setActiveRole("klant");
    setKlantStep("aanvraag");
    setInstallateurStep("aanvraag");
    setUserRequest(null);
    setFormSubmitData(null);
    setMatchedInstaller(null);
    setInstallateurResponse(null);
    setRequestStatuses({});
    setRequestResolutions({});
    setNotifications([]);
    scrollToTop();
  }, [scrollToTop]);

  const handleKlantStepNavigate = useCallback((step: string) => {
    setKlantStep(step as KlantStep);
    scrollToTop();
  }, [scrollToTop]);

  const handleInstallateurStepNavigate = useCallback((step: string) => {
    setInstallateurStep(step as InstallateurStep);
    scrollToTop();
  }, [scrollToTop]);

  // --- Event handlers ---

  const handleFormSubmit = useCallback(
    (data: {
      naam: string;
      email: string;
      telefoon: string;
      adres: string;
      postcode: string;
      stad: string;
      model: ModelKey;
      matchedInstaller: Installer;
    }) => {
      setUserRequest({
        naam: data.naam,
        email: data.email,
        stad: data.stad,
        model: data.model,
      });
      setFormSubmitData(data);
      setMatchedInstaller(data.matchedInstaller);

      // Add admin notification
      const modelName = MODELS[data.model].name;
      setNotifications((prev) => [
        {
          id: `notif-aanvraag-${Date.now()}`,
          type: "aanvraag",
          message: `${data.naam} heeft een aanvraag ingediend voor de ${modelName}`,
          timestamp: "zojuist",
        },
        ...prev,
      ]);
    },
    []
  );

  const handleUpdateRequestStatus = useCallback((requestId: string, status: RecentRequest["status"]) => {
    setRequestStatuses((prev) => ({ ...prev, [requestId]: status }));

    if (matchedInstaller && (status === "geaccepteerd" || status === "afgewezen")) {
      const resolution: RequestResolution = {
        installerNaam: matchedInstaller.naam,
        status,
      };
      if (status === "afgewezen") {
        resolution.doorgestuurdNaar = "De Airco Specialist (Utrecht)";
      }
      setRequestResolutions((prev) => ({ ...prev, [requestId]: resolution }));
    }
  }, [matchedInstaller]);

  const handleSaveInstallateurResponse = useCallback((data: InstallateurResponseData) => {
    setInstallateurResponse(data);

    // Add admin notification
    const installerName = matchedInstaller?.naam || "Installateur";
    if (data.status === "geaccepteerd") {
      setNotifications((prev) => [
        {
          id: `notif-offerte-${Date.now()}`,
          type: "offerte",
          message: `${installerName} heeft een offerte verstuurd`,
          timestamp: "zojuist",
        },
        ...prev,
      ]);
    } else {
      setNotifications((prev) => [
        {
          id: `notif-afgewezen-${Date.now()}`,
          type: "afgewezen",
          message: `${installerName} heeft de aanvraag afgewezen`,
          timestamp: "zojuist",
        },
        ...prev,
      ]);
    }
  }, [matchedInstaller]);

  // --- Cross-role navigation CTAs ---

  const goToKlantBevestiging = useCallback(() => {
    setKlantStep("bevestiging");
    scrollToTop();
  }, [scrollToTop]);

  const goToInstallateurTab = useCallback(() => {
    setActiveRole("installateur");
    setInstallateurStep("aanvraag");
    scrollToTop();
  }, [scrollToTop]);

  const goToKlantOfferte = useCallback(() => {
    setActiveRole("klant");
    setKlantStep("offerte");
    scrollToTop();
  }, [scrollToTop]);

  const goToAdmin = useCallback(() => {
    setActiveRole("admin");
    scrollToTop();
  }, [scrollToTop]);

  // --- Derived data ---

  const emailRequestData = formSubmitData
    ? {
        naam: formSubmitData.naam,
        email: formSubmitData.email,
        telefoon: formSubmitData.telefoon,
        adres: formSubmitData.adres,
        postcode: formSubmitData.postcode,
        model: formSubmitData.model,
      }
    : null;

  const installateurRequest: RecentRequest | null = formSubmitData
    ? {
        id: "req-new",
        naam: formSubmitData.naam,
        email: formSubmitData.email,
        telefoon: formSubmitData.telefoon,
        adres: formSubmitData.adres,
        postcode: formSubmitData.postcode,
        stad: formSubmitData.stad,
        model: formSubmitData.model,
        when: "zojuist",
        status: "nieuw",
      }
    : null;

  // Compute completed steps
  const klantStepKeys = KLANT_STEPS.map((s) => s.key);
  const klantIdx = klantStepKeys.indexOf(klantStep);
  const klantCompletedSteps = klantStepKeys.slice(0, klantIdx);

  const installateurStepKeys = INSTALLATEUR_STEPS.map((s) => s.key);
  const installateurIdx = installateurStepKeys.indexOf(installateurStep);
  const installateurCompletedSteps = installateurStepKeys.slice(0, installateurIdx);

  // Badges
  const installateurBadge = !!formSubmitData && !installateurResponse;
  const adminBadgeCount = notifications.length;

  return (
    <>
      <Navigation
        activeRole={activeRole}
        onNavigate={handleRoleNavigate}
        onReset={handleReset}
        installateurBadge={installateurBadge}
        adminBadgeCount={adminBadgeCount}
      />
      <main className="w-full max-w-[1240px] mx-auto px-7 pt-12 pb-18 max-sm:px-4.5 max-sm:pt-8 max-sm:pb-14 flex-1">
        {/* ── KLANT TAB ── */}
        {activeRole === "klant" && (
          <>
            <StepIndicator
              steps={KLANT_STEPS}
              currentStep={klantStep}
              completedSteps={klantCompletedSteps}
              onNavigate={handleKlantStepNavigate}
            />

            {klantStep === "aanvraag" && (
              <FormulierView
                onSubmit={handleFormSubmit}
                matchedInstaller={matchedInstaller}
                onNextStep={goToKlantBevestiging}
              />
            )}

            {klantStep === "bevestiging" && formSubmitData && matchedInstaller && (
              <BevestigingEmailView
                formData={formSubmitData}
                matchedInstaller={matchedInstaller}
                onNextStep={goToInstallateurTab}
              />
            )}

            {klantStep === "offerte" && formSubmitData && matchedInstaller && (
              <OfferteEmailView
                formData={formSubmitData}
                matchedInstaller={matchedInstaller}
                installateurResponse={installateurResponse}
                onGoToInstallateur={goToInstallateurTab}
                onGoToAdmin={goToAdmin}
              />
            )}
          </>
        )}

        {/* ── INSTALLATEUR TAB ── */}
        {activeRole === "installateur" && (
          <>
            {!formSubmitData ? (
              /* Empty state */
              <section className="animate-view-in">
                <div className="max-w-md mx-auto text-center py-16">
                  <div className="w-[78px] h-[78px] rounded-full bg-[rgba(171,203,205,0.25)] flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-9 h-9 text-mda-accent" />
                  </div>
                  <h2 className="text-[28px] leading-[1.15] mb-2">Nog geen aanvragen</h2>
                  <p className="text-mda-text-muted max-w-[36ch] mx-auto mb-6">
                    Er zijn nog geen nieuwe aanvragen binnengekomen. Dien eerst een aanvraag in via het klantformulier.
                  </p>
                  <Button
                    onClick={() => handleRoleNavigate("klant")}
                    className="bg-primary text-primary-foreground hover:bg-accent hover:text-white h-11 px-6 font-semibold gap-2"
                  >
                    Ga naar het klantformulier
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </section>
            ) : (
              <>
                <StepIndicator
                  steps={INSTALLATEUR_STEPS}
                  currentStep={installateurStep}
                  completedSteps={installateurCompletedSteps}
                  onNavigate={handleInstallateurStepNavigate}
                />

                {installateurStep === "aanvraag" && (
                  <InstallerEmailView
                    requestData={emailRequestData}
                    matchedInstaller={matchedInstaller}
                    onNextStep={() => handleInstallateurStepNavigate("reactie")}
                  />
                )}

                {installateurStep === "reactie" && installateurRequest && (
                  <InstallateurReactieView
                    request={installateurRequest}
                    onBack={() => handleInstallateurStepNavigate("aanvraag")}
                    onComplete={goToAdmin}
                    onGoToKlantOfferte={goToKlantOfferte}
                    onUpdateStatus={handleUpdateRequestStatus}
                    onSaveResponse={handleSaveInstallateurResponse}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ── ADMIN TAB ── */}
        {activeRole === "admin" && (
          <DashboardView
            notifications={notifications}
            userRequest={userRequest}
            requestStatuses={requestStatuses}
            requestResolutions={requestResolutions}
          />
        )}
      </main>
    </>
  );
}
