// components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { FiLogOut, FiUser } from "react-icons/fi";
import logo from '@/assets/logo2.png';
import Image from 'next/image';
import Link from 'next/link';
import GoogleTranslateToggle from '@/components/layout/GoogleTranslateToggle';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { authService } from '@/services';
import { toast } from 'react-toastify';

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuthStatus();

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    router.push('/');
    // Refresh the page to update auth status
    window.location.reload();
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener('resize', handleResize);
    // run once on mount to ensure correct state
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        {/* Grid layout: left=logo, center=nav, right=actions. This prevents overlap and ensures spacing on md screens */}
        <div className="grid grid-cols-3 items-center">
          {/* Left: logo */}
          <div className="col-start-1 flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <Image src={logo} alt="Metsamdti" width={80} height={80} className="object-contain" />
              </div>
            </div>
          </div>

          {/* Center: navigation (Home, About). Visible on md and up. On smaller screens these links are available in the hamburger menu */}
          <div className="col-start-2 flex justify-center">
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-[#702C3E] font-regular transition-colors">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-[#702C3E] font-regular transition-colors">About Us</Link>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="col-start-3 flex justify-end items-center gap-3">
            {/* Language Toggle - visible on all screen sizes */}
            <div className="flex items-center">
              <GoogleTranslateToggle />
            </div>

            {/* Actions visible on md+ */}
            {!isLoading && (
              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" aria-label="Dashboard">
                      <button className="flex items-center gap-2 bg-[#702C3E] text-white px-4 py-2 rounded-sm font-regular hover:bg-[#5E2333] transition-colors">
                        <FiUser className="w-4 h-4" />
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      aria-label="Logout"
                      className="flex items-center gap-2 text-[#702C3E] hover:text-[#5E2333] px-3 py-2 rounded-sm font-regular transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" aria-label="Sign In">
                      <span className="text-[#702C3E] hover:text-[#5E2333] px-4 py-2 rounded-sm font-regular transition-colors cursor-pointer">
                        Sign In
                      </span>
                    </Link>
                    <Link href="/onboarding/welcome" aria-label="Get Started">
                      <button className="flex items-center gap-2 bg-[#702C3E] text-[F1F1F1] px-4 py-2 rounded-sm font-regular group">
                        Get Started
                        <FaArrowRightLong className="w-4 h-4 -mr-1 transform rotate-0 transition-transform duration-200 group-hover:-rotate-45 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Hamburger for small screens */}
            <div className="md:hidden">
              <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#702C3E]/40">
                <GiHamburgerMenu className="w-6 h-6 text-[#702C3E]" />
              </button>
            </div>
          </div>
        </div>
      </div>

    
      <div
        className={`fixed top-0 right-0 bottom-16 w-72 bg-white shadow-xl transform transition-transform duration-300 z-50 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 border-b flex items-center justify-end">
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
            <MdCancel className="w-6 h-6 text-[#702C3E]" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-4">
          <Link href="/" className="text-gray-700 hover:text-[#702C3E] font-medium transition-colors">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-[#702C3E] font-medium transition-colors">About Us</Link>
          
          {/* Language Toggle in Mobile Menu */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Language</span>
            </div>
            <GoogleTranslateToggle />
          </div>
          
          {/* Actions in Mobile Menu */}
          {!isLoading && (
            <div className="pt-2 border-t border-gray-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" aria-label="Dashboard">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#702C3E] text-white px-4 py-2 rounded-sm font-medium">
                      <FiUser className="w-4 h-4" />
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="w-full flex items-center justify-center gap-2 text-[#702C3E] hover:text-[#5E2333] px-4 py-2 rounded-sm font-medium transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" aria-label="Sign In">
                    <span className="block w-full text-[#702C3E] hover:text-[#5E2333] px-4 py-2 rounded-sm font-medium transition-colors text-center cursor-pointer">
                      Sign In
                    </span>
                  </Link>
                  <Link href="/onboarding/welcome" aria-label="Get Started">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#702C3E] text-white px-4 py-2 rounded-sm font-medium group">
                      Get Started
                      <FaArrowRightLong className="w-4 h-4 -mr-1 transform rotate-0 transition-transform duration-200 group-hover:-rotate-45 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Overlay */}
  {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}
    </header>
  );
}

