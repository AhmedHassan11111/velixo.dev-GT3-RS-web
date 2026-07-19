import React from "react";
import { ResponsiveImage } from "../ResponsiveImage";

export function ShowcaseIntro() {
  return (
    <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-white py-24 sm:py-32">
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xl italic text-neutral-900 sm:text-2xl">
          “This website is a creative frontend showcase — designed and developed to demonstrate advanced web design and animation skills”
        </p>
      </div>
      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ResponsiveImage
          name="section"
          alt="Showcase"
          eager
          className="w-full rounded-xl object-cover shadow-2xl"
        />
      </div>
    </section>
  );
}
