"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MatchEntry {
  id: string;
  primaryName: string;
  secondaryName: string;
  age: number;
  gender: string;
  location: string;
  profileImage: string;
  status: "Pending" | "Rejected" | "Accepted" | "accepted" | "active";
  dateMatched: string;
}

export default function History() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample match data - replace with API call later
  const matches: MatchEntry[] = [
    {
      id: "1",
      primaryName: "Sunshine",
      secondaryName: "John Doe",
      age: 29,
      gender: "Female",
      location: "Nairobi, Kenya",
      profileImage: "/api/placeholder/100/100", // Replace with actual image path
      status: "Pending",
      dateMatched: "10/10/2025",
    },
    {
      id: "2",
      primaryName: "Sunshine",
      secondaryName: "John Doe",
      age: 29,
      gender: "Female",
      location: "Nairobi, Kenya",
      profileImage: "/api/placeholder/100/100", // Replace with actual image path
      status: "Rejected",
      dateMatched: "10/10/2025",
    },
  ];

  const filteredMatches = matches.filter((match) =>
    match.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.secondaryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (matchId: string) => {
    router.push(`/dashboard/chats?match=${matchId}`);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-[#EDD4D3] min-h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-2">
        {/* Branding */}
        <div className="mb-2 text-center">
          <span className="text-[10px] sm:text-xs text-gray-400">PARTNER FOR LIFE</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E] mb-4 sm:mb-6 text-center">
          Match History
        </h1>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
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
                text-sm text-[#702C3E] font-medium
                placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#702C3E]/20
              "
            />
          </div>
        </div>

            {/* Match Entries */}
            <div className="space-y-3 sm:space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="
                  bg-[#F5E5E4]
                  border border-[#E6DADA]
                  rounded-lg
                  p-4 sm:p-6
                  flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6
                "
              >
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src={match.profileImage}
                  alt={match.primaryName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

                {/* Match Info */}
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:w-auto gap-4">
                  <div className="flex-1">
                    {/* Names */}
                    <div className="mb-2">
                      <span className="text-base sm:text-lg font-bold text-[#702C3E]">
                        {match.primaryName}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-2">
                        {match.secondaryName}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5A4A4A]">
                      <span>{match.age} yrs</span>
                      <span className="w-1 h-1 rounded-full bg-[#EDD4D3]"></span>
                      <span>{match.gender}</span>
                      <span className="w-1 h-1 rounded-full bg-[#EDD4D3]"></span>
                      <span className="break-words">{match.location}</span>
                    </div>
                  </div>

                  {/* Status Tag and Date */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                {/* Status Tag */}
                <span
                  className={`
                    px-4 py-1
                    rounded-lg
                    text-sm font-semibold text-white
                    ${
                      match.status === "Pending"
                        ? "bg-[#702C3E]"
                        : match.status === "Rejected"
                        ? "bg-red-400"
                        : "bg-green-500"
                    }
                  `}
                >
                  {match.status}
                </span>

                {/* Date Matched */}
                <div className="text-right">
                  <div className="text-xs text-[#5A4A4A] mb-1">Date Matched</div>
                  <div className="text-sm font-semibold text-[#702C3E]">
                    {match.dateMatched}
                  </div>
                </div>

                    {/* Start Chat Button (only for accepted/active matches) */}
                    {(match.status === "Accepted" || match.status === "accepted" || match.status === "active") && (
                      <button
                        onClick={() => handleStartChat(match.id)}
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
                        Start Chat
                      </button>
                    )}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
