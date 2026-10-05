import React, { useState } from 'react';
import { X, Check, Plus, Minus, Info, ShieldCheck, Sparkles, Scissors, RefreshCw, Feather } from 'lucide-react';
import { Fabric } from '../types/textile';

interface FabricModalProps {
  fabric: Fabric | null;
  onClose: () => void;
  onAddToCartMeters: (fabric: Fabric, meters: number) => void;
  onAddSwatch: (fabric: Fabric) => void;
  isSwatchInRing: boolean;
  onOpenCalculatorForFabric: (fabric: Fabric) => void;
}

export const FabricModal: React.FC<FabricModalProps> = ({
  fabric,
  onClose,
  onAddToCartMeters,
  onAddSwatch,
  isSwatchInRing,
  onOpenCalculatorForFabric,
}) => {
  if (!fabric) return null;

  const [meters, setMeters] = useState<number>(2.0);
  const [activeTab, setActiveTab] = useState<'overview' | 'tactile' | 'specs'>('overview');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleIncrement = () => {
    setMeters((prev) => +(prev + 0.1).toFixed(1));
  };

  const handleDecrement = () => {
    setMeters((prev) => {
      const next = +(prev - 0.1).toFixed(1);
      return next >= fabric.minMeters ? next : fabric.minMeters;
    });
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= fabric.minMeters) {
      setMeters(+val.toFixed(1));
    }
  };

  const totalPrice = +(meters * fabric.pricePerMeter).toFixed(2);

  const handleAddMeters = () => {
    onAddToCartMeters(fabric, meters);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FBFBF9] border border-[#DDD6C8] shadow-2xl rounded-sm overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top bar with Code and Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECE7DE] bg-[#F7F5F0]">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#736B5F]">
            <span className="font-mono text-[#1C1A17] font-semibold">{fabric.code}</span>
            <span aria-hidden="true">·</span>
            <span>{fabric.millName}</span>
            <span aria-hidden="true">·</span>
            <span>{fabric.origin}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#635B4F] hover:text-[#1C1A17] hover:bg-[#EBE7DF] rounded transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Imagery & Interactive Tactile Inspector */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            <div className="relative aspect-[4/3] bg-[#EAE6DE] rounded-sm overflow-hidden border border-[#DDD6C8]">
              <img
                src={fabric.image}
                alt={fabric.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Color tag indicator */}
              <div className="absolute bottom-3 left-3 bg-[#FBFBF9]/95 backdrop-blur-xs px-3 py-1.5 rounded text-xs flex items-center gap-2 border border-[#DDD6C8]">
                <span
                  className="w-3 h-3 rounded-full border border-black/20"
                  style={{ backgroundColor: fabric.colorHex }}
                />
                <span className="font-medium text-[#2C2824]">{fabric.colorName}</span>
              </div>
            </div>

            {/* Sub-view switcher for Tactile properties */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F2EFE8] rounded border border-[#E3DDD0] text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-1.5 font-medium rounded transition-colors cursor-pointer text-center ${
                  activeTab === 'overview' ? 'bg-white text-[#1C1A17] shadow-xs' : 'text-[#6C6456]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('tactile')}
                className={`py-1.5 font-medium rounded transition-colors cursor-pointer text-center ${
                  activeTab === 'tactile' ? 'bg-white text-[#1C1A17] shadow-xs' : 'text-[#6C6456]'
                }`}
              >
                Drape & Weave
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-1.5 font-medium rounded transition-colors cursor-pointer text-center ${
                  activeTab === 'specs' ? 'bg-white text-[#1C1A17] shadow-xs' : 'text-[#6C6456]'
                }`}
              >
                Mill Spec Sheet
              </button>
            </div>

            {/* Tab: Overview Details */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs text-[#5C5549] leading-relaxed">
                <p className="text-sm text-[#3E382E] font-light leading-relaxed">
                  {fabric.description}
                </p>

                <div>
                  <span className="block font-medium text-[#1C1A17] uppercase tracking-wider text-[11px] mb-2">
                    Recommended Applications:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fabric.recommendedUses.map((use, idx) => (
                      <span
                        key={idx}
                        className="bg-[#EFECE5] text-[#3A352C] px-2.5 py-1 rounded text-xs border border-[#DDD6C8]"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ECE7DE] flex items-center justify-between">
                  <span className="text-[#787163]">Need to calculate yardage for this fabric?</span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCalculatorForFabric(fabric);
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#2C2824] font-medium underline underline-offset-4 cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Open Calculator</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Tactile Drape & Weave Viewer */}
            {activeTab === 'tactile' && (
              <div className="p-4 bg-[#F5F2EB] rounded border border-[#E3DCD0] space-y-4 text-xs">
                {/* Drape Fluidity Gauge */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[#2C2824] uppercase tracking-wider text-[11px]">
                      Drape Fluidity Score:
                    </span>
                    <span className="font-mono font-medium text-[#1C1A17]">{fabric.drapeScore} / 5</span>
                  </div>
                  <div className="w-full bg-[#DDD6C8] h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#2C2824] h-full transition-all duration-300"
                      style={{ width: `${(fabric.drapeScore / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#7A7366] mt-1">
                    <span>1 (Architectural / Crisp)</span>
                    <span>3 (Balanced)</span>
                    <span>5 (Liquid / Cascading)</span>
                  </div>
                </div>

                {/* Opacity Gauge */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[#2C2824] uppercase tracking-wider text-[11px]">
                      Light Opacity:
                    </span>
                    <span className="font-mono font-medium text-[#1C1A17]">{fabric.opacityScore} / 5</span>
                  </div>
                  <div className="w-full bg-[#DDD6C8] h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#595246] h-full transition-all duration-300"
                      style={{ width: `${(fabric.opacityScore / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#7A7366] mt-1">
                    <span>Sheer Voile</span>
                    <span>Semi-Opaque</span>
                    <span>Full Blackout Density</span>
                  </div>
                </div>

                {/* Weave Interlacing Explanation */}
                <div className="pt-2 border-t border-[#DDD6C8]">
                  <span className="font-medium text-[#2C2824] block mb-1">
                    Weave Structure: {fabric.weaveType}
                  </span>
                  <p className="text-[#655E52] text-xs">
                    {fabric.weaveType === 'Plain Weave' && 'Balanced over-one, under-one warp and weft crossing. Exceptionally stable with clean natural slub grain.'}
                    {fabric.weaveType === 'Charmeuse Satin' && 'Long warp yarn floats over four weft yarns, creating high luster and effortless low-friction skin glide.'}
                    {fabric.weaveType === 'Herringbone Twill' && 'Offset diagonal twill lines reverse direction every half-inch, producing the classic resilient V-chevron.'}
                    {fabric.weaveType === 'Batiste Voile' && 'High-twist combed yarns woven in featherlight tension for gossamer airflow.'}
                    {fabric.weaveType === 'Jacquard Weave' && 'Programmable jacquard harness controlling thousands of individual threads to produce sculptural relief motifs.'}
                    {fabric.weaveType === 'Heavy Canvas' && 'Dual-thread ply woven under maximum tension for archival Martindale rub resistance.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Technical Spec Sheet */}
            {activeTab === 'specs' && (
              <div className="border border-[#E3DDD1] rounded bg-white overflow-hidden text-xs">
                <table className="w-full divide-y divide-[#EBE7DF]">
                  <tbody className="divide-y divide-[#EBE7DF] text-[#4A443B]">
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456] w-1/3">Composition</td>
                      <td className="px-3 py-2 font-mono">{fabric.fiberComposition}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456]">Weight / Density</td>
                      <td className="px-3 py-2 font-mono tabular-nums">{fabric.gsm} GSM (Grams / m²)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456]">Usable Bolt Width</td>
                      <td className="px-3 py-2 font-mono tabular-nums">{fabric.widthCm} cm ({Math.round(fabric.widthCm / 2.54)} inches)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456]">Stretch / Give</td>
                      <td className="px-3 py-2">{fabric.stretchScore}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456]">Anticipated Shrinkage</td>
                      <td className="px-3 py-2">{fabric.shrinkage}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456]">Certifications</td>
                      <td className="px-3 py-2">{fabric.certifications.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 bg-[#F8F6F1] font-medium text-[#6C6456]">Care Instructions</td>
                      <td className="px-3 py-2">{fabric.careInstructions}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module (PDP standard) */}
          <div className="md:col-span-6 flex flex-col justify-between bg-[#F8F6F2] p-6 rounded-sm border border-[#E3DDD1]">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#7C7467] font-medium mb-1">
                {fabric.fiberComposition}
              </div>
              <h2 className="text-3xl font-serif text-[#1C1A17] font-normal leading-tight mb-2">
                {fabric.name}
              </h2>

              <div className="flex items-baseline gap-2 pb-5 border-b border-[#ECE7DE] mb-6">
                <span className="text-2xl font-serif font-medium text-[#1C1A17] tabular-nums font-mono">
                  ${fabric.pricePerMeter.toFixed(2)}
                </span>
                <span className="text-xs text-[#7A7264]">USD / metre</span>
                <span className="ml-auto text-xs text-[#527756] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#527756]" />
                  {fabric.inStockMeters}m in bolt inventory
                </span>
              </div>

              {/* Purchase Mode A: Yardage by the Metre */}
              <div className="bg-white p-4 rounded border border-[#E3DDD1] shadow-xs mb-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17]">
                    Cut-to-Order Metres
                  </span>
                  <span className="text-[11px] text-[#7A7264]">
                    Min: {fabric.minMeters}m · Step: 0.1m
                  </span>
                </div>

                {/* Fractional Stepper */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={handleDecrement}
                    disabled={meters <= fabric.minMeters}
                    className="w-10 h-10 rounded border border-[#DDD6C8] bg-[#F9F8F6] hover:bg-[#EBE7DF] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Decrease meterage by 0.1"
                  >
                    <Minus className="w-4 h-4 text-[#332F28]" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="number"
                      step="0.1"
                      min={fabric.minMeters}
                      max={fabric.inStockMeters}
                      value={meters}
                      onChange={handleManualChange}
                      className="w-full text-center font-mono font-medium text-lg py-2 border border-[#DDD6C8] rounded focus:outline-none focus:border-[#2C2824]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8274] font-medium pointer-events-none">
                      metres
                    </span>
                  </div>

                  <button
                    onClick={handleIncrement}
                    disabled={meters >= fabric.inStockMeters}
                    className="w-10 h-10 rounded border border-[#DDD6C8] bg-[#F9F8F6] hover:bg-[#EBE7DF] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Increase meterage by 0.1"
                  >
                    <Plus className="w-4 h-4 text-[#332F28]" />
                  </button>
                </div>

                {/* Metre Presets */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-[11px] text-[#8A8274]">Quick lengths:</span>
                  {[1.0, 2.0, 3.5, 5.0].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setMeters(preset)}
                      className={`px-2 py-0.5 text-xs rounded font-mono transition-colors cursor-pointer ${
                        meters === preset
                          ? 'bg-[#2C2824] text-[#F8F6F0]'
                          : 'bg-[#F2EFE8] text-[#554F44] hover:bg-[#E6E1D6]'
                      }`}
                    >
                      {preset.toFixed(1)}m
                    </button>
                  ))}
                </div>

                {/* Subtotal line */}
                <div className="flex justify-between items-baseline pt-3 border-t border-[#F0ECE4] text-xs">
                  <span className="text-[#6C6456]">
                    Cut calculation ({meters.toFixed(1)}m × ${fabric.pricePerMeter.toFixed(2)}):
                  </span>
                  <span className="font-mono text-base font-semibold text-[#1C1A17] tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Primary Add Metres CTA */}
                <button
                  onClick={handleAddMeters}
                  className="mt-4 w-full py-3 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs font-semibold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-[#9EE493]" />
                      <span>Added {meters.toFixed(1)}m to Bag!</span>
                    </>
                  ) : (
                    <span>Add {meters.toFixed(1)}m to Bag (${totalPrice.toFixed(2)})</span>
                  )}
                </button>
              </div>

              {/* Purchase Mode B: Order Swatch Sample */}
              <div className="p-4 bg-[#F2EEE7] rounded border border-[#DFD8CC] flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-[#2C2824] uppercase tracking-wider">
                    Order Swatch Sample
                  </span>
                  <span className="text-[11px] text-[#6E6659]">
                    Generous A5 cut with woven fiber passport & dye lot card.
                  </span>
                </div>

                <button
                  onClick={() => onAddSwatch(fabric)}
                  disabled={isSwatchInRing}
                  className={`px-3.5 py-2 text-xs font-medium uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer ${
                    isSwatchInRing
                      ? 'bg-[#E0DBD0] text-[#787163] cursor-default'
                      : 'bg-white hover:bg-[#FAF8F5] border border-[#DDD6C8] text-[#1C1A17] shadow-xs'
                  }`}
                >
                  {isSwatchInRing ? 'In Swatch Kit' : `Order ($${fabric.pricePerSwatch.toFixed(2)})`}
                </button>
              </div>
            </div>

            {/* Atelier Trust Guarantee */}
            <div className="mt-6 pt-4 border-t border-[#ECE7DE] text-[11px] text-[#7A7366] space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5F8763]" />
                <span>Continuous cut guarantee: all yardage cut as one seamless piece.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#867E70]" />
                <span>Cut yardage packaged on archival kraft rolls to prevent creasing.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
