import Home from '@/components/public/Home';
import { Metadata } from 'next';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Metsamdti — Soulmates, Partner for Life',
  description: 'A guided matchmaking website for those who seek a lifelong partner, not casual dating.',
  openGraph: {
    title: 'Metsamdti — Soulmates, Partner for Life',
    description: 'A guided matchmaking website for those who seek a lifelong partner, not casual dating.',
    type: 'website',
  },
};

// Static generation - this page doesn't need dynamic data
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FCF8F8]">
      <Home />
    </div>
  );
}

