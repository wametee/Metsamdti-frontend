"use client";

import { useState } from "react";
import PerfectMatch from "./PerfectMatch";
import AcceptMatch from "./AcceptMatch";
import FindAnotherMatch from "./FindAnotherMatch";
import CancelMatch from "./CancelMatch";

type MatchStep = 'finding' | 'accept' | 'rejected' | 'accepted';

export default function Matches() {
  const [currentStep, setCurrentStep] = useState<MatchStep>('finding');

  const handleContinue = () => {
    setCurrentStep('accept');
  };

  const handleReject = () => {
    setCurrentStep('rejected');
  };

  const handleAccept = () => {
    setCurrentStep('accepted');
  };

  const handleFindAnother = () => {
    // Reset to finding step
    setCurrentStep('finding');
  };

  const handleCancelMatch = () => {
    // Reset to finding step
    setCurrentStep('finding');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#EDD4D3] min-h-full overflow-y-auto">
      {currentStep === 'finding' && (
        <PerfectMatch onContinue={handleContinue} />
      )}
      
      {currentStep === 'accept' && (
        <AcceptMatch onReject={handleReject} onAccept={handleAccept} />
      )}
      
      {currentStep === 'rejected' && (
        <FindAnotherMatch onFindAnother={handleFindAnother} />
      )}
      
      {currentStep === 'accepted' && (
        <CancelMatch onCancelMatch={handleCancelMatch} />
      )}
    </div>
  );
}
