// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo2.png";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedinIn } from "@/lib/icons";

export default function Footer() {
  return (
    <footer className="bg-[#FCF8F8] w-full">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-16">

          {/* LEFT: Logo + Tagline + Socials */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9  overflow-hidden">
                <Image
                  src={logo}
                  alt="Metsamdti"
                  width={36}
                  height={36}
                  className="object-contain"
                  loading="lazy"
                  quality={85}
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
                <li>
                  <Link href="/about" className="hover:opacity-70">
                    About Us
                  </Link>
                </li>
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
                <li>
                  <Link href="/terms-of-service" className="hover:opacity-70">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:opacity-70">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
