// components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import logo from '@/assets/logo2.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);
  
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
            {/* Get Started visible on md+ */}
            <div className="hidden md:block">
              <Link href="/auth/signup" aria-label="Get Started">
                <button className="flex items-center gap-2 bg-[#702C3E] text-[F1F1F1] px-4 py-2 rounded-sm font-regular group">
                  Get Started
                  <FaArrowRightLong className="w-4 h-4 -mr-1 transform rotate-0 transition-transform duration-200 group-hover:-rotate-45 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>

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
          <Link href="/auth/signup" aria-label="Get Started">
            <button className="flex items-center gap-2 bg-[#702C3E] text-white px-4 py-2 rounded-sm font-medium group">
              Get Started
              <FaArrowRightLong className="w-4 h-4 -mr-1 transform rotate-0 transition-transform duration-200 group-hover:-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </Link>
        </nav>
      </div>

      {/* Overlay */}
  {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}
    </header>
  );
}

