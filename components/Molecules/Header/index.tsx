"use client";

import { carosul1Content, carosul2Content } from "@/utils/Header";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const LandingHeader = () => {
  const { heroText, supportText } = carosul2Content;

  return (
    <Carousel
      showThumbs={false}
      axis="horizontal"
      showArrows={false}
      showStatus={false}
      autoPlay={true}
      infiniteLoop={true}
      className="w-full"
    >
      {/* Slide 1 */}
      <header className="bg-slate-300 h-[30em] sm:h-[35em] flex items-center justify-center bg-farmerbg bg-no-repeat bg-center bg-cover">
        <div className="w-11/12 sm:w-10/12 flex items-center justify-between max-w-[1280px]">
          <div className="flex flex-col items-start justify-between gap-4 sm:gap-8">
            <h1 className="text-3xl sm:text-6xl font-bold text-tertiary text-start w-full sm:w-3/5">
              {carosul1Content.heroText}
            </h1>
            <p className="text-base sm:text-xl font-medium text-tertiary">
              {carosul1Content.supportText}
            </p>
          </div>
          <div></div>
        </div>
      </header>

      {/* Slide 2 */}
      <header className="bg-slate-300 w-screen h-[30em] sm:h-[35em] flex items-center justify-center bg-carrotbg bg-no-repeat bg-center bg-cover">
        <div className="w-11/12 sm:w-10/12 flex items-center justify-between max-w-[1280px]">
          <div className="flex flex-col items-start justify-between gap-4 sm:gap-8">
            <h1 className="text-3xl sm:text-6xl w-full sm:w-4/5 font-bold text-tertiary text-start">
              {heroText}
            </h1>
            <p className="text-base sm:text-xl font-medium text-tertiary">
              {supportText}
            </p>
          </div>
          <div></div>
        </div>
      </header>
    </Carousel>
  );
};

export default LandingHeader;
