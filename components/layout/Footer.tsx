// components/Footer.tsx
import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#FCF8F8] w-full">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-16">

          {/* LEFT: Logo + Tagline + Socials */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#702C3E]/20">
                <Image
                  src={logo}
                  alt="Metsamdti"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium text-[#702C3E]">
                Metsamdti
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm text-[#2F2E2E] opacity-80">
              Partner for Life
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#702C3E] text-lg">
              <FaTwitter className="cursor-pointer hover:opacity-70" />
              <FaInstagram className="cursor-pointer hover:opacity-70" />
              <FaGithub className="cursor-pointer hover:opacity-70" />
              <FaLinkedinIn className="cursor-pointer hover:opacity-70" />
            </div>
          </div>

          {/* RIGHT: Links Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 text-sm">

            {/* Column 1 */}
            <div>
              <h4 className="font-semibold text-[#702C3E] mb-4">Company</h4>
              <ul className="space-y-3 text-[#2F2E2E]">
                <li className="hover:opacity-70 cursor-pointer">About Us</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-semibold text-[#702C3E] mb-4">Resources</h4>
              <ul className="space-y-3 text-[#2F2E2E]">
                <li className="hover:opacity-70 cursor-pointer">Help Centre</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-semibold text-[#702C3E] mb-4">Legal</h4>
              <ul className="space-y-3 text-[#2F2E2E]">
                <li className="hover:opacity-70 cursor-pointer">Terms of Service</li>
                <li className="hover:opacity-70 cursor-pointer">Privacy Policy</li>
                <li className="hover:opacity-70 cursor-pointer">Cookie Policy</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
