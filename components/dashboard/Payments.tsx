"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface PaymentEntry {
  id: string;
  match: string;
  amount: number;
  datePaid: string | null;
  status: "Pending" | "Paid";
}

export default function Payments() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample payment data - replace with API call later
  const payments: PaymentEntry[] = [
    {
      id: "1",
      match: "Clara",
      amount: 20,
      datePaid: null,
      status: "Pending",
    },
    {
      id: "2",
      match: "Jane",
      amount: 20,
      datePaid: "10/10/2025",
      status: "Paid",
    },
  ];

  const totalSpent = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((payment) =>
    payment.match.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMakePayment = (paymentId: string) => {
    router.push("/payment");
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-[#EDD4D3] min-h-full overflow-y-auto">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#491A26] text-center mb-4 sm:mb-6">
        Payment History
      </h1>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <FiSearch className="w-5 h-5 text-[#5A4A4A]" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              pl-12 pr-4
              py-3
              bg-[#F5E5E4]
              border border-[#E6DADA]
              rounded-lg
              text-sm text-[#491A26]
              placeholder-[#8A7A7A]
              focus:outline-none
              focus:ring-2 focus:ring-[#702C3E]/20
            "
          />
        </div>
      </div>

          {/* Total Spent Summary */}
          <div className="max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base text-[#491A26]">Total Spent</span>
              <span className="text-lg sm:text-xl font-bold text-[#491A26]">${totalSpent}</span>
            </div>
          </div>

          {/* Payment Entries */}
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 px-2">
        {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="
                  bg-[#F5E5E4]
                  border border-[#E6DADA]
                  rounded-lg
                  p-4 sm:p-6
                  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                "
              >
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center w-full sm:w-auto">
              {/* Match */}
              <div>
                <span className="text-sm text-[#5A4A4A] block mb-1">Match</span>
                <span className="text-base font-semibold text-[#491A26]">
                  {payment.match}
                </span>
              </div>

              {/* Amount */}
              <div>
                <span className="text-sm text-[#5A4A4A] block mb-1">Amount</span>
                <span className="text-base font-semibold text-[#491A26]">
                  ${payment.amount}
                </span>
              </div>

              {/* Date Paid */}
              <div>
                <span className="text-sm text-[#5A4A4A] block mb-1">
                  Date Paid
                </span>
                <span className="text-base font-semibold text-[#491A26]">
                  {payment.datePaid || "-"}
                </span>
              </div>

              {/* Status */}
              <div>
                <span className="text-sm text-[#5A4A4A] block mb-1">Status</span>
                <span
                  className={`text-base font-semibold ${
                    payment.status === "Pending"
                      ? "text-red-600"
                      : "text-[#491A26]"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>

                {/* Make Payment Button (only for pending) */}
                {payment.status === "Pending" && (
                  <button
                    onClick={() => handleMakePayment(payment.id)}
                    className="
                      w-full sm:w-auto
                      bg-[#702C3E]
                      text-white
                      px-4 sm:px-6 py-2
                      rounded-lg
                      text-sm font-semibold
                      hover:bg-[#5E2333]
                      transition
                      whitespace-nowrap
                    "
                  >
                    Make Payment
                  </button>
                )}
          </div>
        ))}
      </div>
    </div>
  );
}
