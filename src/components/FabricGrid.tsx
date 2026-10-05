import React, { useState } from 'react';
import { Eye, Plus, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Fabric, FiberCategory } from '../types/textile';

interface FabricGridProps {
  fabrics: Fabric[];
  selectedCategory: FiberCategory;
  onSelectCategory: (category: FiberCategory) => void;
  onSelectFabric: (fabric: Fabric) => void;
  onAddSwatch: (fabric: Fabric) => void;
  onOpenCalculator: () => void;
  isSwatchInRing: (fabricId: string) => boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

export const FabricGrid: React.FC<FabricGridProps> = ({
  fabrics,
  selectedCategory,
  onSelectCategory,
  onSelectFabric,
  onAddSwatch,
  onOpenCalculator,
  isSwatchInRing,
  searchQuery,
  onClearSearch,
}) => {
  const [weightFilter, setWeightFilter] = useState<'all' | 'light' | 'medium' | 'heavy'>('all');
  const [useFilter, setUseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'gsm-desc'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter application list
  const allUses = Array.from(new Set(fabrics.flatMap((f) => f.recommendedUses)));

  // Filter and sort logic
  const filteredFabrics = fabrics
    .filter((f) => {
      // Fiber category filter
      if (selectedCategory !== 'all' && f.fiberCategory !== selectedCategory) {
        return false;
      }
      // Weight filter
      if (weightFilter === 'light' && f.gsm >= 150) return false;
      if (weightFilter === 'medium' && (f.gsm < 150 || f.gsm > 300)) return false;
      if (weightFilter === 'heavy' && f.gsm <= 300) return false;
      // Use filter
      if (useFilter !== 'all' && !f.recommendedUses.includes(useFilter)) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesSubtitle = f.subtitle.toLowerCase().includes(q);
        const matchesOrigin = f.origin.toLowerCase().includes(q);
        const matchesCode = f.code.toLowerCase().includes(q);
        const matchesWeave = f.weaveType.toLowerCase().includes(q);
        const matchesFiber = f.fiberComposition.toLowerCase().includes(q);
        if (!matchesName && !matchesSubtitle && !matchesOrigin && !matchesCode && !matchesWeave && !matchesFiber) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerMeter - b.pricePerMeter;
      if (sortBy === 'price-desc') return b.pricePerMeter - a.pricePerMeter;
      if (sortBy === 'gsm-desc') return b.gsm - a.gsm;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const categories: { id: FiberCategory; label: string }[] = [
    { id: 'all', label: 'All Natural Fibres' },
    { id: 'linen', label: 'Belgian Linen & Flax' },
    { id: 'silk', label: 'Mulberry Silk' },
    { id: 'wool', label: 'Heritage Tweed & Wool' },
    { id: 'cotton', label: 'Organic Supima Cotton' },
    { id: 'cashmere', label: 'Cashmere & Blends' },
  ];

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-[#FBFBF9] border-t border-[#ECE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E7E2D8]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#867E70] mb-2 font-medium">
              Curated Bolt Collection
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1A17] font-normal tracking-tight">
              Natural Fibres by the Metre
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4 text-xs text-[#6F675A]">
            <span>Showing <strong className="font-mono tabular-nums text-[#1C1A17]">{filteredFabrics.length}</strong> master weaves</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenCalculator}
              className="text-[#2C2824] underline hover:opacity-80 transition-opacity font-medium cursor-pointer"
            >
              Need yardage advice?
            </button>
          </div>
        </div>

        {/* Primary Fiber Category Bar - Interactive Segmented Tabs with functional buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap rounded cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2C2824] text-[#F8F6F0] shadow-sm'
                  : 'bg-[#F2EFE9] hover:bg-[#EAE5DC] text-[#554F44]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sub-Filters & Controls Toolbar */}
        <div className="bg-[#F5F2EC] p-3 rounded-lg border border-[#E3DDD1] mb-10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#847B6D] uppercase tracking-wider text-[11px] font-medium">Weight (GSM):</span>
            <div className="inline-flex rounded-md bg-[#EBE7DF] p-0.5 border border-[#DDD6C8]">
              {(['all', 'light', 'medium', 'heavy'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setWeightFilter(w)}
                  className={`px-2.5 py-1 text-xs capitalize rounded transition-colors cursor-pointer ${
                    weightFilter === w
                      ? 'bg-white text-[#1C1A17] font-medium shadow-xs'
                      : 'text-[#6B6355] hover:text-[#1C1A17]'
                  }`}
                >
                  {w === 'all' ? 'All Weights' : w === 'light' ? '< 150 GSM' : w === 'medium' ? '150-300 GSM' : '> 300 GSM'}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline text-[#C4BCAD]">|</span>

            {/* Application Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#847B6D] uppercase tracking-wider text-[11px] font-medium">Use:</span>
              <select
                value={useFilter}
                onChange={(e) => setUseFilter(e.target.value)}
                className="bg-white border border-[#DDD6C8] text-[#332F28] px-2.5 py-1 rounded text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">All Applications</option>
                {allUses.map((use) => (
                  <option key={use} value={use}>
                    {use}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#867E70]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#DDD6C8] text-[#332F28] px-2.5 py-1 rounded text-xs focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Curators' Selection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="gsm-desc">Weight: Heaviest First</option>
            </select>
          </div>
        </div>

        {/* Active Search Notice if Searching */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between bg-[#EFECE5] px-4 py-2 rounded text-xs text-[#554F44]">
            <span>
              Searching for: <strong className="text-[#1C1A17]">"{searchQuery}"</strong> ({filteredFabrics.length} found)
            </span>
            <button
              onClick={onClearSearch}
              className="underline text-[#1C1A17] font-medium hover:opacity-80 cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredFabrics.length === 0 && (
          <div className="text-center py-16 px-4 bg-[#F5F2EB] rounded-lg border border-dashed border-[#D5CEBF] my-8">
            <h3 className="text-lg font-serif text-[#1C1A17] mb-2">No matching fabrics found</h3>
            <p className="text-sm text-[#70685A] max-w-md mx-auto mb-6">
              Try adjusting your weight or fiber filters, or clear your search terms to view our full collection of natural bolts.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setWeightFilter('all');
                setUseFilter('all');
                onClearSearch();
              }}
              className="px-4 py-2 bg-[#2C2824] text-[#F8F6F0] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#1C1A17] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Product Cards Grid: 3-column desktop, 2-column tablet, 1-column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFabrics.map((fabric) => {
            const inRing = isSwatchInRing(fabric.id);

            return (
              <article
                key={fabric.id}
                className="group relative flex flex-col bg-[#F9F9F8] border border-[#E9E4DA] rounded-sm overflow-hidden hover:border-[#CDC4B4] hover:shadow-md transition-all duration-300"
              >
                {/* Image Container: takes ~68% of visual dominance on neutral backdrop */}
                <div
                  onClick={() => onSelectFabric(fabric)}
                  className="relative aspect-[4/3] bg-[#EBE7DF] overflow-hidden cursor-pointer"
                >
                  <img
                    src={fabric.image}
                    alt={`${fabric.name} woven textile close-up`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                  />

                  {/* Subtle single text indicator (Zero-Pill discipline: no badge spam) */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#1C1A17] bg-[#FBFBF9]/90 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                      {fabric.code}
                    </span>
                  </div>

                  {/* Color swatch circle indicator */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#FBFBF9]/90 backdrop-blur-xs px-2 py-0.5 rounded-xs text-[10px] text-[#4A453C]">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block"
                      style={{ backgroundColor: fabric.colorHex }}
                      title={fabric.colorName}
                    />
                    <span className="font-mono">{fabric.gsm} GSM</span>
                  </div>

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFabric(fabric);
                      }}
                      className="px-4 py-2 bg-[#FBFBF9] text-[#1C1A17] text-xs font-medium uppercase tracking-wider rounded shadow hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect & Metres</span>
                    </button>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata with subtle bullet separators */}
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7A7366] mb-1.5">
                      <span>{fabric.origin}</span>
                      <span aria-hidden="true">·</span>
                      <span>{fabric.weaveType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{fabric.widthCm} cm width</span>
                    </div>

                    <h3
                      onClick={() => onSelectFabric(fabric)}
                      className="text-xl font-serif font-medium text-[#1C1A17] hover:text-[#524B40] transition-colors cursor-pointer leading-snug mb-1.5"
                    >
                      {fabric.name}
                    </h3>

                    <p className="text-xs text-[#6E675B] line-clamp-2 leading-relaxed mb-4">
                      {fabric.subtitle}
                    </p>
                  </div>

                  {/* Pricing and Action baseline */}
                  <div className="pt-3 border-t border-[#ECE7DE] mt-auto">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="font-mono tabular-nums text-lg font-medium text-[#1C1A17]">
                          ${fabric.pricePerMeter.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#7A7264] font-light"> / metre</span>
                      </div>
                      <div className="text-[11px] text-[#676054]">
                        Min cut: <span className="font-mono">0.5m</span>
                      </div>
                    </div>

                    {/* Dual Action: Cut Metres vs Swatch */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectFabric(fabric)}
                        className="w-full py-2 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs font-medium uppercase tracking-wider rounded transition-colors text-center cursor-pointer"
                      >
                        Cut Metres
                      </button>

                      <button
                        onClick={() => onAddSwatch(fabric)}
                        disabled={inRing}
                        className={`w-full py-2 border text-xs font-medium uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          inRing
                            ? 'bg-[#EAE7DF] border-[#D5CEBF] text-[#7A7264] cursor-default'
                            : 'bg-white hover:bg-[#F2EFE8] border-[#D0C8B8] text-[#2C2824]'
                        }`}
                      >
                        {inRing ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#4E7A52]" />
                            <span>In Swatch Kit</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-[#7A7264]" />
                            <span>Sample (${fabric.pricePerSwatch.toFixed(2)})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
