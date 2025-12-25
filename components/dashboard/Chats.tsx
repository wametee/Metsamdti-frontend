"use client";

import { useRouter } from "next/navigation";
import { FiLock } from "react-icons/fi";
import { FiArrowUpRight } from "react-icons/fi";
import { FiPaperclip } from "react-icons/fi";
import { FiSend } from "react-icons/fi";

export default function Chats() {
  const router = useRouter();

  const handleUnlockChat = () => {
    router.push("/payment");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#EDD4D3] h-full overflow-y-auto">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-24 overflow-y-auto">
        {/* Unlock Chat Card */}
        <div
          className="
            w-full max-w-2xl
            bg-[#E2B5B2]
            border-2 border-white
            rounded-2xl
            px-6 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16
            text-center
            shadow-[0_12px_40px_rgba(0,0,0,0.08)]
          "
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center">
              <FiLock className="w-7 h-7 sm:w-9 sm:h-9 text-[#702C3E]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#491A26] mb-3">
            Unlock Chat
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#5A4A4A] mb-6 sm:mb-10">
            Make payment to unlock chat with Clara.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleUnlockChat}
            className="
              mx-auto
              bg-[#702C3E]
              text-white
              px-8 sm:px-12 md:px-16 py-3 sm:py-4
              rounded-md
              text-sm sm:text-base font-semibold
              flex items-center gap-2
              hover:bg-[#5E2333]
              transition
            "
          >
            Unlock Chat
            <FiArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Input Bar at Bottom */}
      <div className="p-3 sm:p-4 pb-4 sm:pb-6 -mt-16 sm:-mt-20">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          {/* Attachment Button */}
          <button
            className="
              p-2
              text-[#5A4A4A]
              hover:text-[#702C3E]
              hover:bg-[#F5E5E4]
              rounded-md
              transition
            "
            aria-label="Attach file"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>

          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message..."
            disabled
            className="
              flex-1
              px-4 py-3
              bg-[#EDD4D3]
              border border-black
              rounded-full
              text-sm text-[#491A26]
              placeholder-[#8A7A7A]
              focus:outline-none
              focus:ring-2 focus:ring-[#702C3E]/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {/* Send Button */}
          <button
            disabled
            className="
              p-2
              text-[#702C3E]
              hover:bg-[#F5E5E4]
              rounded-md
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
