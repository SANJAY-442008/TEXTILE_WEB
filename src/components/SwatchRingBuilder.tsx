import React from 'react';
import { Bookmark, Plus, X, Check, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Fabric } from '../types/textile';

interface SwatchRingBuilderProps {
  fabrics: Fabric[];
  swatchRing: Fabric[];
  onRemoveSwatch: (fabricId: string) => void;
  onAddSwatch: (fabric: Fabric) => void;
  onAddRingToCart: () => void;
}

export const SwatchRingBuilder: React.FC<SwatchRingBuilderProps> = ({
  fabrics,
  swatchRing,
  onRemoveSwatch,
  onAddSwatch,
  onAddRingToCart,
}) => {
  const maxSwatches = 5;
  const isFull = swatchRing.length === maxSwatches;
  const bundlePrice = 18.0;

  return (
    <section id="swatch-ring" className="py-20 bg-[#FBFBF9] border-t border-[#ECE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Swatch Ring Builder Console */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#81796C] font-medium mb-2">
              <Bookmark className="w-3.5 h-3.5 text-[#5C5549]" />
              <span>Tactile Sample Service</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1A17] font-normal tracking-tight mb-4">
              Curate Your 5-Swatch Designer Ring
            </h2>
            <p className="text-sm text-[#6C6457] leading-relaxed mb-6">
              Experience the weight, drape, and light reflection in your home or design studio. Order a curated ring of 5 generous A5 swatches mounted on an archival brass ring with complete mill fiber passports.
            </p>

            {/* The 5 Ring Slots */}
            <div className="bg-[#F6F3EC] p-6 rounded-sm border border-[#DDD6C8] mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17]">
                  Your Sample Ring ({swatchRing.length} of {maxSwatches} Selected)
                </span>
                <span className="text-xs font-mono text-[#6A6355]">
                  Bundle Price: <strong className="text-[#1C1A17] font-medium">$18.00</strong> (Includes Free Delivery)
                </span>
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: maxSwatches }).map((_, idx) => {
                  const item = swatchRing[idx];

                  if (item) {
                    return (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded bg-white border border-[#CDC5B4] p-1 shadow-xs flex flex-col items-center justify-between overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-xs"
                        />
                        <button
                          onClick={() => onRemoveSwatch(item.id)}
                          className="absolute -top-1 -right-1 bg-[#1C1A17] text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors cursor-pointer"
                          title="Remove swatch"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-black/75 text-[9px] text-[#F9F8F5] p-1 truncate text-center">
                          {item.name}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded border border-dashed border-[#CDC4B3] bg-[#EFECE5] flex flex-col items-center justify-center p-2 text-center"
                    >
                      <span className="text-xs font-mono text-[#998F80]">#{idx + 1}</span>
                      <span className="text-[10px] text-[#8A8070] mt-0.5">Empty Slot</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-5 pt-4 border-t border-[#E5DFD4]">
                <div className="w-full bg-[#DDD6C8] h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-[#2C2824] h-full transition-all duration-300"
                    style={{ width: `${(swatchRing.length / maxSwatches) * 100}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#736B5E]">
                    {isFull ? (
                      <span className="text-[#3E7444] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Ring ready! Complimentary worldwide envelope postage included.
                      </span>
                    ) : (
                      <span>Select {maxSwatches - swatchRing.length} more fabrics from our catalog to complete bundle.</span>
                    )}
                  </div>

                  <button
                    onClick={onAddRingToCart}
                    disabled={swatchRing.length === 0}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs uppercase tracking-wider font-semibold rounded disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Swatch Ring to Bag (${bundlePrice.toFixed(2)})
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Swatch Sourcing Pool */}
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#1C1A17] mb-2.5">
                Quick-Add Swatches to Ring:
              </span>
              <div className="flex flex-wrap gap-2">
                {fabrics.slice(0, 7).map((fabric) => {
                  const inRing = swatchRing.some((s) => s.id === fabric.id);
                  return (
                    <button
                      key={fabric.id}
                      onClick={() => (inRing ? onRemoveSwatch(fabric.id) : onAddSwatch(fabric))}
                      disabled={!inRing && isFull}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        inRing
                          ? 'bg-[#2C2824] text-[#FBFBF9] border-[#2C2824]'
                          : isFull
                          ? 'bg-[#F2EFE8] text-[#9A9182] border-[#E0D9CC] cursor-not-allowed'
                          : 'bg-white text-[#3C362D] border-[#D5CEBF] hover:bg-[#F2EFE8]'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full border border-black/10"
                        style={{ backgroundColor: fabric.colorHex }}
                      />
                      <span>{fabric.name}</span>
                      {inRing ? <X className="w-3 h-3 text-[#E2DC CF]" /> : <Plus className="w-3 h-3 text-[#7A7366]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Swatch Pack Presentation Card */}
          <div className="lg:col-span-6 bg-[#24211D] text-[#F9F8F5] p-8 sm:p-10 rounded-sm border border-[#3E3830] shadow-xl">
            <div className="max-w-md">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5BCAD] font-medium block mb-2">
                The Atelier Swatch Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#FBFBF9] mb-4">
                Full-Value Swatch Reimbursement
              </h3>
              <p className="text-xs text-[#B5ABA0] leading-relaxed mb-6">
                When you proceed to purchase any bolt order of 3 metres or more, the full $18.00 value of your swatch ring is automatically credited against your total with code <code className="font-mono bg-[#36312B] text-[#EFECE5] px-1.5 py-0.5 rounded">SAMPLECREDIT</code>.
              </p>

              <div className="space-y-3.5 text-xs text-[#CCC2B4] border-t border-[#3A342C] pt-6 mb-8">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#D8CEBE] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">True A5 Size (15 × 21 cm)</strong>
                    <span className="text-[#998F82]">Large enough to assess drape, wrinkle recovery, and grain texture.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Bookmark className="w-4 h-4 text-[#D8CEBE] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Archival Mill Fiber Passport</strong>
                    <span className="text-[#998F82]">Includes exact dye lot number, GSM, shrinkage factor, and certified yarn origin.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#D8CEBE] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Dispatched Within 24 Hours</strong>
                    <span className="text-[#998F82]">Sent via priority mail in reinforced rigid kraft envelopes.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#1B1916] rounded border border-[#352F28] flex items-center justify-between text-xs">
                <span className="text-[#9E9587]">Single swatches also available individually at $3.50 - $6.00</span>
                <span className="font-mono text-[#E4DDD1]">Worldwide Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
