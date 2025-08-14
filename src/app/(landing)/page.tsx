import React from "react";
import Hero from "./_components/hero";
import Perks from "./_components/features";
import FAQ from "./_components/faq";
import CTA from "./_components/cta";
import Svg from "./_components/svg";



const HomePage = () => {

  return (
    <div className="relative flex flex-col w-full overflow-x-hidden bg-[#0a0a0a]">
  <section className="relative z-10 w-full">
   <Svg/>
    <Hero />
  </section>
  <section className="w-full">
    <Perks />
  </section>
  <section className="w-full">
    <FAQ />
  </section>
  <section className="w-full bg-[#0a0a0a]">
    <CTA />
  </section>
</div>

  );
};

export default HomePage;
