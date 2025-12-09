import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import about from "@/assets/about.jpg";
import Love from "@/assets/love.jpg";

export default function About() {
  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-b from-[#EDD4D3] to-[#FCF8F8] overflow-hidden rounded-bl-[7rem]">
        {/* Background image with curved bottom-left */}
        <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden rounded-bl-[7rem]">
          {/* place Header inside hero so it overlays the background image */}
          <div className="absolute top-0 left-0 w-full z-30">
            <Header />
          </div>
          {/* optimized background image using next/image to leverage optimization + blur placeholder */}
          <Image
            src={about}
            alt="About background"
            fill
            className="object-cover"
            placeholder="blur"
            priority
            quality={70}
            sizes="100vw"
          />

          {/* TEXT OVERLAY */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-6xl font-title font-semibold drop-shadow-lg">
              About us
            </h1>

            <p className="mt-4 max-w-2xl text-sm md:text-lg font-light opacity-90">
              Learn how we ensure connections rooted in values, creating meaningful relationships—not dating experiences.
            </p>
          </div>
        </div>
      </section>

     <section className="w-full bg-[#FCF8F8] py-20 md:py-32 px-6 md:px-20">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE TEXT */}
    <div className="text-left">
      <p className="text-[#8F2F3F] tracking-widest text-xs font-semibold mb-4">
        OUR STORY
      </p>

      <h2 className="text-3xl md:text-5xl font-title font-semibold text-[#3A1F1F] mb-6">
        ABOUT METSAMDTI
      </h2>

      <p className="text-[#4A4A4A] text-sm md:text-base leading-relaxed mb-4">
        The name Metsamdti came from Tigrinya, and it means soulmates. 
        That is our purpose: to help people find not just a companion, but a partner for life.
      </p>

      <p className="text-[#4A4A4A] text-sm md:text-base leading-relaxed mb-4">
        Too often, relationships begin without clarity. Couples spend years together, 
        only to discover they wanted different things. Situationships, unasked questions, 
        and hidden intentions leave people uncertain and hurt.
      </p>

      <p className="text-[#4A4A4A] text-sm md:text-base leading-relaxed">
        Metsamdti exists to change that. Here, you begin with honesty and direction. 
        You know what you want — marriage, commitment, a partner to build a life with — 
        and we honor that intention.
      </p>
    </div>

    {/* RIGHT SIDE IMAGE + OVERLAP CIRCLE */}
    <div className="relative flex justify-center md:justify-end">

      {/* Circle Image */}
      <div className="w-[270px] h-[310px] md:w-[380px] md:h-[340px] rounded-full overflow-hidden shadow-md">
        <Image
          src={Love}
          alt="Partners for life"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlapping Maroon Circle */}
     {/* Overlapping Maroon Circle */}
<div
  className="
    absolute 
    bottom-[-20px] left-[10px]          /* mobile */

    md:bottom-[-20px] md:left-[-70px]   /* medium screens (laptops/tablets) */

    lg:bottom-[-20px] lg:left-[50px]         /* large screens exactly like screenshot */

    w-[150px] h-[150px] 
    md:w-[170px] md:h-[170px] 
    lg:w-[190px] lg:h-[190px]

    bg-[#702C3E] rounded-full flex items-center justify-center
    text-white text-sm md:text-base lg:text-lg font-medium shadow-md
  "
>
  Partners for life
</div>


    </div>
  </div>
</section>


      <Footer />
    </>
  );
}
