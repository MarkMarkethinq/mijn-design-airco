"use client";

import { useState, useCallback } from "react";
import Navigation from "@/components/navigation";
import FormulierView from "@/components/formulier-view";
import InstallerEmailView from "@/components/installer-email-view";
import DashboardView from "@/components/dashboard-view";
import InstallateurReactieView from "@/components/installateur-reactie-view";
import { RECENT_REQUESTS, type Installer, type ModelKey, type RecentRequest } from "@/lib/data";

type ViewName = "formulier" | "email" | "installateur" | "dashboard";

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

export default function Home() {
  const [activeView, setActiveView] = useState<ViewName>("formulier");
  const [userRequest, setUserRequest] = useState<UserRequest | null>(null);
  const [formSubmitData, setFormSubmitData] = useState<FormSubmitData | null>(null);
  const [matchedInstaller, setMatchedInstaller] = useState<Installer | null>(null);
  const [selectedRequestForInstaller, setSelectedRequestForInstaller] = useState<RecentRequest | null>(null);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, RecentRequest["status"]>>({});
  const [requestResolutions, setRequestResolutions] = useState<Record<string, RequestResolution>>({});

  const handleNavigate = useCallback((view: ViewName) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleOpenInstallateurView = useCallback((request: RecentRequest) => {
    setSelectedRequestForInstaller(request);
    setActiveView("installateur");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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
    },
    []
  );

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

  const installateurRequest: RecentRequest = formSubmitData
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
    : selectedRequestForInstaller || RECENT_REQUESTS[0];

  return (
    <>
      <Navigation activeView={activeView} onNavigate={handleNavigate} />
      <main className="w-full max-w-[1240px] mx-auto px-7 pt-12 pb-18 max-sm:px-4.5 max-sm:pt-8 max-sm:pb-14 flex-1">
        {activeView === "formulier" && (
          <FormulierView onSubmit={handleFormSubmit} matchedInstaller={matchedInstaller} onNextStep={() => handleNavigate("email")} />
        )}
        {activeView === "email" && (
          <InstallerEmailView
            requestData={emailRequestData}
            matchedInstaller={matchedInstaller}
            onNextStep={() => handleNavigate("installateur")}
          />
        )}
        {activeView === "installateur" && (
          <InstallateurReactieView
            request={installateurRequest}
            onBack={() => handleNavigate("email")}
            onComplete={() => handleNavigate("dashboard")}
            onUpdateStatus={handleUpdateRequestStatus}
          />
        )}
        {activeView === "dashboard" && (
          <DashboardView userRequest={userRequest} onNavigate={handleNavigate} onOpenInstallateur={handleOpenInstallateurView} requestStatuses={requestStatuses} requestResolutions={requestResolutions} />
        )}
      </main>
    </>
  );
}
