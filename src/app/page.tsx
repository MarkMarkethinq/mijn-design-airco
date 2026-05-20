"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/navigation";
import FormulierView from "@/components/formulier-view";
import DashboardView from "@/components/dashboard-view";
import type { Installer, ModelKey } from "@/lib/data";

const KaartView = dynamic(() => import("@/components/kaart-view"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin-loader" />
    </div>
  ),
});

type ViewName = "formulier" | "kaart" | "dashboard";

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

  const handleNavigate = useCallback((view: ViewName) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "instant" });
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
      <main className="max-w-[1240px] mx-auto px-7 pt-12 pb-18 max-sm:px-4.5 max-sm:pt-8 max-sm:pb-14 flex-1">
        {activeView === "formulier" && (
          <FormulierView onSubmit={handleFormSubmit} />
        )}
        {activeView === "kaart" && (
          <KaartView matchedInstaller={matchedInstaller} />
        )}
        {activeView === "dashboard" && (
          <DashboardView userRequest={userRequest} onNavigate={handleNavigate} />
        )}
      </main>
    </>
  );
}
