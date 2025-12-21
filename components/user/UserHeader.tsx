"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { authService } from "@/services";

interface UserHeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  className?: string;
}

export default function UserHeader({ 
  showBackButton = false, 
  backUrl,
  className = "" 
}: UserHeaderProps) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("User");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user info from auth token
    const loadUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        if (result.success && result.user) {
          // Priority: username > displayName > display_name > email prefix
          // NEVER use real_name or full_name - those are private
          const username = result.user.username || 
                          result.user.displayName || 
                          result.user.display_name || 
                          result.user.email?.split('@')[0] || 
                          "User";
          setUserName(username);
        } else {
          // Fallback to localStorage or default
          const savedData = localStorage.getItem('onboarding_data');
          if (savedData) {
            try {
              const data = JSON.parse(savedData);
              setUserName(data.username || data.displayName || "User");
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      } catch (error) {
        // Fallback to localStorage or default
        const savedData = localStorage.getItem('onboarding_data');
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            setUserName(data.username || data.displayName || "User");
          } catch (e) {
            // Ignore parse errors
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <div className={`flex items-center justify-between px-4 md:px-6 py-3 md:py-5 ${className}`}>
      {/* Left - Back Button + Logo */}
      <div className="flex items-center gap-2 md:gap-3">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="p-1.5 md:p-2 rounded-md text-[#702C3E] hover:bg-white/60 transition z-40"
            aria-label="Go back"
          >
            <FaArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
        <Image 
          src={logo} 
          alt="Metsamdti Logo" 
          width={60} 
          height={60} 
          className="object-contain w-12 h-12 md:w-20 md:h-20" 
        />
      </div>

      {/* Right - User Dropdown + Language Switcher */}
      <div className="flex items-center gap-2 md:gap-4 text-[#702C3E] text-xs md:text-sm z-40">
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-2 py-1 md:px-3 md:py-1.5 cursor-pointer bg-white/60 hover:bg-white/80 transition"
            aria-label="User menu"
          >
            <span className="font-medium truncate max-w-[80px] md:max-w-none">{loading ? "..." : userName}</span>
            <RiArrowDropDownLine className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <button
                onClick={() => {
                  router.push('/user/profile');
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-3 md:px-4 py-2 hover:bg-[#F6E7EA] transition-colors first:rounded-t-md text-gray-700 text-sm"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-3 md:px-4 py-2 hover:bg-[#F6E7EA] transition-colors last:rounded-b-md text-gray-700 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

