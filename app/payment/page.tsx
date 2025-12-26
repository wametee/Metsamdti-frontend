"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PaymentCard from "@/components/payment/paymentcard";

export default function PaymentPage() {
  const router = useRouter();
  const [showPaymentCard, setShowPaymentCard] = useState(true);

  const handleClose = () => {
    setShowPaymentCard(false);
    router.back();
  };

  const handlePay = () => {
    // TODO: Implement payment processing
    console.log("Processing payment...");
    // After successful payment, navigate back
    router.back();
  };

  return (
    <>
      {showPaymentCard && (
        <PaymentCard
          amount={200}
          onClose={handleClose}
          onPay={handlePay}
        />
      )}
    </>
  );
}








