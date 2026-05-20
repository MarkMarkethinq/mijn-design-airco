"use client";

import { useState, useCallback } from "react";
import Navigation from "@/components/navigation";
import FormulierView from "@/components/formulier-view";
import DashboardView from "@/components/dashboard-view";
import type { Installer, ModelKey } from "@/lib/data";

type ViewName = "formulier" | "dashboard";

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
          <FormulierView onSubmit={handleFormSubmit} matchedInstaller={matchedInstaller} />
        )}
        {activeView === "dashboard" && (
          <DashboardView userRequest={userRequest} onNavigate={handleNavigate} />
        )}
      </main>
    </>
  );
}
