"use client";

import React from "react";
import { Component as ImageAutoSlider } from "@/components/ui/image-auto-slider";

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences.",
  items = [],
}) => {
  const images = items.map((item) => item.image);

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-cyber font-black uppercase tracking-tight text-white md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-lg text-white/50 text-xs sm:text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <ImageAutoSlider images={images} />
      </div>
    </section>
  );
};

export { Gallery4 };
