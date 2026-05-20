"use client";

import { useState, useCallback } from "react";
import Navigation from "@/components/navigation";
import FormulierView from "@/components/formulier-view";
import DashboardView from "@/components/dashboard-view";
import InstallateurReactieView from "@/components/installateur-reactie-view";
import { RECENT_REQUESTS, type Installer, type ModelKey, type RecentRequest } from "@/lib/data";

type ViewName = "formulier" | "dashboard" | "installateur";

interface UserRequest {
  naam: string;
  email: string;
  stad: string;
  model: ModelKey;
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewName>("formulier");
  const [userRequest, setUserRequest] = useState<UserRequest | null>(null);
  const [matchedInstaller, setMatchedInstaller] = useState<Installer | null>(null);
  const [selectedRequestForInstaller, setSelectedRequestForInstaller] = useState<RecentRequest | null>(null);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, RecentRequest["status"]>>({});

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
  }, []);

  const handleFormSubmit = useCallback(
    (data: {
      naam: string;
      email: string;
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
      setMatchedInstaller(data.matchedInstaller);
    },
    []
  );

  return (
    <>
      <Navigation activeView={activeView} onNavigate={handleNavigate} />
      <main className="w-full max-w-[1240px] mx-auto px-7 pt-12 pb-18 max-sm:px-4.5 max-sm:pt-8 max-sm:pb-14 flex-1">
        {activeView === "formulier" && (
          <FormulierView onSubmit={handleFormSubmit} matchedInstaller={matchedInstaller} />
        )}
        {activeView === "dashboard" && (
          <DashboardView userRequest={userRequest} onNavigate={handleNavigate} onOpenInstallateur={handleOpenInstallateurView} requestStatuses={requestStatuses} />
        )}
        {activeView === "installateur" && (
          <InstallateurReactieView
            request={selectedRequestForInstaller || RECENT_REQUESTS[0]}
            onBack={() => handleNavigate("dashboard")}
            onUpdateStatus={handleUpdateRequestStatus}
          />
        )}
      </main>
    </>
  );
}
