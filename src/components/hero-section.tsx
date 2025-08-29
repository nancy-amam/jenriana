import React from 'react';

interface HeroSectionProps {
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  backgroundImage = '/images/hero-bg.png' 
}) => {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 h-full flex flex-col justify-end pb-6 px-4 md:px-16 mb-5">
        <div className="flex flex-col md:flex-row md:items-start text-white mb-6 md:mb-[160px]">
          <h1 className="text-[28px] md:w-auto w-[328px] md:text-[45px] font-normal">
            Book Your Ideal Stay in Just a Few Clicks
          </h1>
          <p className="text-[16px] md:text-[20px] font-normal text-[#ffffff]/90 
                        mt-2 md:-mt-6 md:max-w-xl 
                        self-end md:self-center text-right md:text-right md:w-auto w-[258px]">
            Discover handpicked apartments in top Nigerian cities — curated for comfort and convenience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;