import React from 'react';
import { LOOM_IMAGE } from '../data/fabrics';

export const CraftHeritage: React.FC = () => {
  return (
    <section id="mill-heritage" className="py-20 sm:py-28 bg-[#181614] text-[#F9F8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#D8CEBE] font-medium mb-2">
            The Living Loom Tradition
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#FBFBF9] leading-tight">
            Preserving five centuries of slow, master weaving.
          </h2>
        </div>

        {/* 2-Column Split: Visual Narrative & Mill Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Loom Documentary Photo */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#3E3830] shadow-2xl">
              <img
                src={LOOM_IMAGE}
                alt="Artisan shuttle loom weaving natural fibers in atmospheric workshop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-[#D8CEBE] bg-black/40 backdrop-blur-xs p-3 rounded border border-white/10">
                <span className="font-medium text-white block">Mechanical Shuttle Looms & River Flax Retting</span>
                <span className="text-[#AFA698] text-[11px]">Kortrijk, Belgium & Hawick, Scottish Borders</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing & Ethics */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h3 className="text-xl font-serif text-[#FBFBF9] mb-3">
                01. No Microplastics. No Polyester Fillers.
              </h3>
              <p className="text-xs text-[#BDB4A5] leading-relaxed">
                Modern fast-fashion textiles blend virgin synthetics (polyester, nylon, acrylic) into cotton and wool, rendering garments un-recyclable and polluting our waterways with microfibres. Every bolt at Atelier Trama is rigorously tested and verified 100% natural, biodegradable plant or animal fibre.
              </p>
            </div>

            <div className="border-t border-[#2F2A24] pt-6">
              <h3 className="text-xl font-serif text-[#FBFBF9] mb-3">
                02. Direct Guild Relationships
              </h3>
              <p className="text-xs text-[#BDB4A5] leading-relaxed">
                By maintaining direct contracts with multi-generational weaving mills rather than broker warehouses, we guarantee ethical fair-wage labor standards, traceable raw fleece and flax harvests, and fresh uncompromised yardage from original dye baths.
              </p>
            </div>

            <div className="border-t border-[#2F2A24] pt-6">
              <h3 className="text-xl font-serif text-[#FBFBF9] mb-3">
                03. Low-Impact & Botanical Mordants
              </h3>
              <p className="text-xs text-[#BDB4A5] leading-relaxed">
                All dyestuffs comply with strict European REACH and OEKO-TEX Class 1 safety protocols. We also offer limited annual releases dyed with whole plant extracts, including French madder root, fermented woad indigo, and hand-harvested walnut husks.
              </p>
            </div>
          </div>
        </div>

        {/* Mill Geographical Footprint */}
        <div className="mt-16 pt-12 border-t border-[#2D2822] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-xs">
          <div>
            <span className="text-[#7A7264] uppercase tracking-wider block text-[10px] mb-1">Flax & Linen</span>
            <strong className="text-[#EFECE6] block text-sm font-serif">Flanders, Belgium</strong>
            <span className="text-[#998F82] text-[11px]">River Lys dew-retted flax</span>
          </div>

          <div>
            <span className="text-[#7A7264] uppercase tracking-wider block text-[10px] mb-1">Mulberry Silk</span>
            <strong className="text-[#EFECE6] block text-sm font-serif">Lyon, France</strong>
            <span className="text-[#998F82] text-[11px]">18th century guild looms</span>
          </div>

          <div>
            <span className="text-[#7A7264] uppercase tracking-wider block text-[10px] mb-1">Cheviot Wool</span>
            <strong className="text-[#EFECE6] block text-sm font-serif">Hawick, Scotland</strong>
            <span className="text-[#998F82] text-[11px]">Bespoke tweed & twill</span>
          </div>

          <div>
            <span className="text-[#7A7264] uppercase tracking-wider block text-[10px] mb-1">Cashmere & Merino</span>
            <strong className="text-[#EFECE6] block text-sm font-serif">Biella, Italy</strong>
            <span className="text-[#998F82] text-[11px]">Alpine spring-water washing</span>
          </div>

          <div>
            <span className="text-[#7A7264] uppercase tracking-wider block text-[10px] mb-1">Botanical Jacquard</span>
            <strong className="text-[#EFECE6] block text-sm font-serif">Kyoto, Japan</strong>
            <span className="text-[#998F82] text-[11px]">Natural fermented vat indigo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
