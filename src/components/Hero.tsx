import React from 'react';
import { Compass, Sparkles, Scissors, Layers } from 'lucide-react';
import { HERO_IMAGE } from '../data/fabrics';

interface HeroProps {
  onExploreFabrics: () => void;
  onOpenCalculator: () => void;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreFabrics,
  onOpenCalculator,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#181614] text-[#F9F8F5]">
      {/* Background Image with carefully calibrated contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Atelier Trama rolls of natural linen and silk textiles on oak cutting table"
          className="w-full h-full object-cover object-center opacity-45 transform scale-102 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181614] via-[#181614]/80 to-[#181614]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Unboxed editorial kicker */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D8CEBE] mb-4">
            <span>European Weaving Guild</span>
            <span aria-hidden="true">·</span>
            <span>Natural Fibres Only</span>
            <span aria-hidden="true">·</span>
            <span>Cut to Order by the Metre</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#FBFBF9] leading-[1.12] mb-6 text-balance">
            Tactile elegance in raw linen, fluid silk & highland wool.
          </h1>

          <p className="text-base sm:text-lg text-[#CDC5B4] font-light leading-relaxed mb-8 max-w-xl">
            Sourced directly from heritage family-owned looms in Flanders, Lyon, and the Scottish Borders. We supply independent couturiers, architectural drapery makers, and dedicated sewists.
          </p>

          {/* Quick Search & Filter in Hero */}
          <div className="bg-[#24211D]/90 backdrop-blur-md p-2 rounded-lg border border-[#443E36] shadow-xl flex flex-col sm:flex-row gap-2 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by fibre, weave, origin, or code (e.g. linen, tweed, 240 GSM)..."
                className="w-full bg-[#181614] border border-[#3E3830] text-[#FBFBF9] placeholder-[#8E877A] text-sm px-4 py-2.5 rounded focus:outline-none focus:border-[#D5CEBF] transition-colors"
              />
            </div>
            <button
              onClick={onExploreFabrics}
              className="px-5 py-2.5 bg-[#EAE5D9] hover:bg-[#F5F2EB] text-[#1C1A17] text-xs uppercase tracking-widest font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Bolts</span>
            </button>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#C8BFB0]">
            <span className="text-[#888072] uppercase tracking-wider text-[11px]">Popular Weaves:</span>
            <button
              onClick={() => onSelectCategory('linen')}
              className="hover:text-[#FBFBF9] transition-colors underline decoration-[#6A6255] underline-offset-4 cursor-pointer"
            >
              Belgian Flax Linen
            </button>
            <span aria-hidden="true" className="text-[#4E473D]">·</span>
            <button
              onClick={() => onSelectCategory('silk')}
              className="hover:text-[#FBFBF9] transition-colors underline decoration-[#6A6255] underline-offset-4 cursor-pointer"
            >
              Lyon Mulberry Silk
            </button>
            <span aria-hidden="true" className="text-[#4E473D]">·</span>
            <button
              onClick={() => onSelectCategory('wool')}
              className="hover:text-[#FBFBF9] transition-colors underline decoration-[#6A6255] underline-offset-4 cursor-pointer"
            >
              Scottish Tweed
            </button>
            <span aria-hidden="true" className="text-[#4E473D]">·</span>
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 text-[#E6DFD3] hover:text-white transition-colors cursor-pointer ml-auto"
            >
              <Scissors className="w-3.5 h-3.5 text-[#D5CEBF]" />
              <span className="underline decoration-dotted underline-offset-4">Calculate Project Yardage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proof Strip adhering to Claim-to-Proof Adjacency */}
      <div className="border-t border-[#312C26] bg-[#141210]/95 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-[#26221D] text-xs text-[#A89F90]">
            <div className="px-2">
              <span className="block font-serif text-sm text-[#FBFBF9] font-medium">100% Traceable Mills</span>
              <span className="text-[11px] text-[#7A7367]">Direct from European looms</span>
            </div>
            <div className="px-2">
              <span className="block font-serif text-sm text-[#FBFBF9] font-medium">0.1m Precision Cutting</span>
              <span className="text-[11px] text-[#7A7367]">Zero waste meterage increments</span>
            </div>
            <div className="px-2">
              <span className="block font-serif text-sm text-[#FBFBF9] font-medium">Archival Swatch Kit</span>
              <span className="text-[11px] text-[#7A7367]">Generous A5 tactile samples</span>
            </div>
            <div className="px-2">
              <span className="block font-serif text-sm text-[#FBFBF9] font-medium">Plastic-Free Fibres</span>
              <span className="text-[11px] text-[#7A7367]">GOTS & Masters of Linen certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
