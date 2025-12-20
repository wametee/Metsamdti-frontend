import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import ApiProvider from "@/components/providers/ApiProvider";
import ToasterWrapper from "@/components/ui/ToasterWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Optimize font loading with preload and display swap
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Metsamdti — Private Marriage Matchmaking",
  description: "A private, admin-curated marriage introduction platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={quicksand.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${quicksand.className} bg-[#FCF8F8] min-h-screen`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ApiProvider>
            <LanguageProvider>
              {children}
              <ToasterWrapper />
            </LanguageProvider>
          </ApiProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

