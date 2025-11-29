// app/(public)/page.tsx - Real home page
import { Hero } from "@/components/public/Hero";
import { Values } from "@/components/public/Values";
import { Testimonials } from "@/components/public/Testimonials";
import { CTA } from "@/components/public/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Values />
      <Testimonials />
      <CTA />
    </>
  );
}

