"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { authService } from "@/services";

export default function DashboardHeader() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("User");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        if (result.success && result.user) {
          const username = result.user.username || 
                          result.user.displayName || 
                          result.user.display_name || 
                          result.user.email?.split('@')[0] || 
                          "User";
          setUserName(username);
        }
      } catch (error) {
        // Handle error silently
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

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <header className="bg-[#EDD4D3] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#E6DADA]">
      {/* Left - Mobile Menu Button + Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Toggle - Only visible on mobile */}
        <button
          onClick={() => {
            const event = new CustomEvent('toggleMobileMenu');
            window.dispatchEvent(event);
          }}
          className="lg:hidden p-2 text-[#702C3E] hover:bg-white/60 rounded-md transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Image 
          src={logo} 
          alt="Metsamdti Logo" 
          width={40} 
          height={40} 
          className="object-contain w-8 h-8 sm:w-10 sm:h-10" 
        />
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold text-[#702C3E]">Metsamdti</span>
          <span className="text-[10px] sm:text-xs text-[#5A4A4A] font-medium hidden xs:block">PARTNER FOR LIFE</span>
        </div>
      </div>

      {/* Right - Notifications, User, Language */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 text-[#702C3E] hover:bg-white/60 rounded-md transition"
          aria-label="Notifications"
        >
          <IoNotificationsOutline className="w-5 h-5" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-2 sm:px-3 py-1.5 cursor-pointer bg-white/60 hover:bg-white/80 transition text-[#702C3E] text-xs sm:text-sm"
            aria-label="User menu"
          >
            <span className="font-medium truncate max-w-[60px] sm:max-w-none text-sm">{loading ? "..." : userName}</span>
            <RiArrowDropDownLine className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <button
                onClick={() => {
                  handleLogout();
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#F6E7EA] transition-colors rounded-md text-[#2F2E2E] text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}

