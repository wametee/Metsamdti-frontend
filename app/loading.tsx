/**
 * Global loading UI
 * Shows while pages are loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FCF8F8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#702C3E] font-medium">Loading...</p>
      </div>
    </div>
  );
}




