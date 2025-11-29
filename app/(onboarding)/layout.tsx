"use client";

import { StepIndicator } from "@/components/onboarding/StepIndicator";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Metsamdti</div>
        <div>{/* Language switcher will go here */}</div>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <StepIndicator />
        {children}
      </main>
    </div>
  );
}

