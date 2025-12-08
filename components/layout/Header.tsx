// components/Header.tsx
import { FaArrowRightLong } from "react-icons/fa6";
import logo from '@/assets/logo.jpg'; 
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="">
      <div className="max-w-4xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo + Brand Name */}
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              {/* 2. Use the Image component */}
              <Image
                src={logo}
                alt="Metsamdti"
                width={28} // 3. Add width (w-7 = 28px)
                height={28} // 4. Add height (h-7 = 28px)
                className="object-contain"
              />
            </div>
          </div>

          {/* About Us — Perfectly centered */}
          <nav className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              aria-label="About Metsamdti"
            >
              About Us
            </Link>
          </nav>

          {/* Get Started Button — EXACT match from Figma */}
      <button
          className="flex items-center gap-2 bg-[#702C3E] text-white px-4 py-2 rounded-sm font-light group"
        >
          Get Started
          <FaArrowRightLong
            className="w-4 h-4 -mr-1 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>
        </div>
      </div>
    </header>
  );
}

