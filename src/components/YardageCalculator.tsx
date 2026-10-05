import React, { useState } from 'react';
import { Calculator, ArrowRight, Check, HelpCircle, Scissors, Layers, Info } from 'lucide-react';
import { Fabric, ProjectCalcParams } from '../types/textile';

interface YardageCalculatorProps {
  fabrics: Fabric[];
  selectedFabricForCalc: Fabric | null;
  onSelectFabricForCalc: (fabric: Fabric) => void;
  onAddToCartMeters: (fabric: Fabric, meters: number) => void;
  onOpenFabricModal: (fabric: Fabric) => void;
}

export const YardageCalculator: React.FC<YardageCalculatorProps> = ({
  fabrics,
  selectedFabricForCalc,
  onSelectFabricForCalc,
  onAddToCartMeters,
  onOpenFabricModal,
}) => {
  const [projectType, setProjectType] = useState<ProjectCalcParams['projectType']>('curtains');
  const [chosenFabricId, setChosenFabricId] = useState<string>(
    selectedFabricForCalc?.id || fabrics[0].id
  );

  // Form states
  // Curtains
  const [windowWidth, setWindowWidth] = useState<number>(200); // cm
  const [windowDrop, setWindowDrop] = useState<number>(260); // cm
  const [fullness, setFullness] = useState<number>(2.0); // 1.5x, 2.0x, 2.5x

  // Cushions
  const [cushionSize, setCushionSize] = useState<number>(50); // cm
  const [cushionCount, setCushionCount] = useState<number>(4);

  // Garments
  const [garmentSize, setGarmentSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [coatLength, setCoatLength] = useState<'knee' | 'full'>('knee');

  // Tablecloth
  const [tableLength, setTableLength] = useState<number>(220); // cm
  const [tableWidth, setTableWidth] = useState<number>(100); // cm
  const [dropOverhang, setDropOverhang] = useState<number>(30); // cm
  const [includeNapkins, setIncludeNapkins] = useState<boolean>(true);

  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  const currentFabric = fabrics.find((f) => f.id === chosenFabricId) || fabrics[0];
  const fabricWidthCm = currentFabric.widthCm;

  // Calculation Logic
  const calculateMeters = (): { meters: number; formulaExplanation: string } => {
    switch (projectType) {
      case 'curtains': {
        // Total gathered width = windowWidth * fullness
        // Number of fabric widths needed = Math.ceil((windowWidth * fullness) / fabricWidthCm)
        // Cut drop per width = windowDrop + 30cm (10cm top header + 20cm double bottom hem)
        // Total meters = (widths * cutDrop) / 100
        const totalGatheredWidth = windowWidth * fullness;
        const widthsNeeded = Math.max(2, Math.ceil(totalGatheredWidth / fabricWidthCm));
        const cutDropCm = windowDrop + 30; // 30cm hem & header allowance
        const totalCm = widthsNeeded * cutDropCm;
        const calculated = +(Math.ceil((totalCm / 100) * 10) / 10).toFixed(1);
        return {
          meters: Math.max(1.5, calculated),
          formulaExplanation: `${widthsNeeded} widths of ${fabricWidthCm}cm fabric × ${cutDropCm}cm cut drop (with 30cm hem allowances) at ${fullness}× fullness.`,
        };
      }

      case 'cushions': {
        // For each cushion: 2 squares of (cushionSize + 4cm seam allowance)
        // How many pieces fit across fabricWidthCm?
        const pieceWidth = cushionSize + 4;
        const piecesAcross = Math.max(1, Math.floor(fabricWidthCm / pieceWidth));
        const totalPiecesNeeded = cushionCount * 2;
        const rowsNeeded = Math.ceil(totalPiecesNeeded / piecesAcross);
        const totalCm = rowsNeeded * pieceWidth;
        const calculated = +(Math.ceil((totalCm / 100) * 10) / 10).toFixed(1);
        return {
          meters: Math.max(0.8, calculated),
          formulaExplanation: `${cushionCount} cushions (${totalPiecesNeeded} cut squares of ${pieceWidth}cm) fitting ${piecesAcross} per bolt row across ${fabricWidthCm}cm width.`,
        };
      }

      case 'overcoat': {
        // Classic tailored coat requirements based on size & length
        const baseKnee = garmentSize === 'S' ? 3.0 : garmentSize === 'M' ? 3.3 : garmentSize === 'L' ? 3.6 : 4.0;
        const meters = coatLength === 'full' ? +(baseKnee + 0.6).toFixed(1) : baseKnee;
        return {
          meters,
          formulaExplanation: `Standard ${coatLength}-length overcoat pattern layout for size ${garmentSize} with collar, facings, and sleeve allowances on single-width wool.`,
        };
      }

      case 'trousers': {
        const meters = garmentSize === 'S' || garmentSize === 'M' ? 1.6 : 1.9;
        return {
          meters,
          formulaExplanation: `Classic tailored trouser length + waistband facing, pockets, and 5cm cuff turn-up for size ${garmentSize}.`,
        };
      }

      case 'shirt': {
        const meters = garmentSize === 'S' ? 1.8 : garmentSize === 'M' ? 2.0 : garmentSize === 'L' ? 2.2 : 2.4;
        return {
          meters,
          formulaExplanation: `Long-sleeve tailored button-down shirt with collar stand, double cuffs, and back yoke on ${fabricWidthCm}cm bolt.`,
        };
      }

      case 'tablecloth': {
        // Total cloth length = tableLength + (dropOverhang * 2) + 10cm hem
        const totalClothLength = tableLength + dropOverhang * 2 + 10;
        let meters = +(totalClothLength / 100).toFixed(1);
        let note = `Single piece (${totalClothLength}cm length) with ${dropOverhang}cm overhang on all sides.`;
        if (includeNapkins) {
          meters = +(meters + 1.2).toFixed(1);
          note += ` Includes 1.2m extra for matching set of 6 dinner napkins (45×45cm).`;
        }
        return {
          meters,
          formulaExplanation: note,
        };
      }
    }
  };

  const { meters: estimatedMeters, formulaExplanation } = calculateMeters();
  const estimatedCost = +(estimatedMeters * currentFabric.pricePerMeter).toFixed(2);

  const handleApplyToCart = () => {
    onAddToCartMeters(currentFabric, estimatedMeters);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2200);
  };

  return (
    <section id="calculator" className="py-20 bg-[#F4F1EA] border-t border-[#ECE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7C7467] font-medium mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#554F44]" />
            <span>Master Atelier Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1A17] font-normal tracking-tight mb-3">
            Interactive Project Yardage Estimator
          </h2>
          <p className="text-sm text-[#6C6457] leading-relaxed">
            Eliminate guesswork when purchasing expensive raw silks, flax linens, and wools. Enter your architectural dimensions or garment specs to calculate exact cut meterage with professional allowances.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Calculator Controls */}
          <div className="lg:col-span-7 bg-[#FBFBF9] p-6 sm:p-8 rounded-sm border border-[#DDD6C8] shadow-xs">
            {/* Step 1: Select Project Type */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1A17] mb-2.5">
                1. Select Your Project Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'curtains', label: 'Curtains & Drapes' },
                  { id: 'cushions', label: 'Cushions & Pillows' },
                  { id: 'overcoat', label: 'Coat or Trench' },
                  { id: 'trousers', label: 'Tailored Trousers' },
                  { id: 'shirt', label: 'Shirt / Blouse' },
                  { id: 'tablecloth', label: 'Dining Tablecloth' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id as any)}
                    className={`py-2 px-3 text-xs font-medium rounded border transition-all cursor-pointer text-center ${
                      projectType === type.id
                        ? 'bg-[#2C2824] text-[#F8F6F0] border-[#2C2824] shadow-xs'
                        : 'bg-[#F9F8F6] border-[#DDD6C8] text-[#554E43] hover:bg-[#EFECE5]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dimensions / Inputs depending on Project */}
            <div className="p-5 bg-[#F6F4EE] rounded border border-[#E3DCD0] mb-6">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17] mb-4">
                2. Input Project Dimensions & Details
              </div>

              {/* CURTAINS */}
              {projectType === 'curtains' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Window Width (cm)</label>
                    <input
                      type="number"
                      min={60}
                      max={600}
                      value={windowWidth}
                      onChange={(e) => setWindowWidth(Math.max(40, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2C2824]"
                    />
                    <span className="text-[10px] text-[#867E70] mt-1 block">Curtain rod / track span</span>
                  </div>

                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Floor Drop (cm)</label>
                    <input
                      type="number"
                      min={80}
                      max={400}
                      value={windowDrop}
                      onChange={(e) => setWindowDrop(Math.max(50, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2C2824]"
                    />
                    <span className="text-[10px] text-[#867E70] mt-1 block">Rod to floor height</span>
                  </div>

                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Fullness Ratio</label>
                    <select
                      value={fullness}
                      onChange={(e) => setFullness(parseFloat(e.target.value))}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824] cursor-pointer"
                    >
                      <option value={1.5}>1.5× (Tailored Minimal)</option>
                      <option value={2.0}>2.0× (Standard Pleat)</option>
                      <option value={2.5}>2.5× (Opulent Luxury Wave)</option>
                    </select>
                    <span className="text-[10px] text-[#867E70] mt-1 block">Gathered fabric density</span>
                  </div>
                </div>
              )}

              {/* CUSHIONS */}
              {projectType === 'cushions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Cushion Insert Size (cm)</label>
                    <select
                      value={cushionSize}
                      onChange={(e) => setCushionSize(parseInt(e.target.value))}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824] cursor-pointer"
                    >
                      <option value={40}>40 × 40 cm (Small Accent)</option>
                      <option value={45}>45 × 45 cm (Standard Sofa)</option>
                      <option value={50}>50 × 50 cm (Luxury Lounge)</option>
                      <option value={60}>60 × 60 cm (Floor / Bed Euro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Number of Cushions</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={cushionCount}
                      onChange={(e) => setCushionCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2C2824]"
                    />
                  </div>
                </div>
              )}

              {/* OVERCOAT */}
              {projectType === 'overcoat' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Tailoring Size</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['S', 'M', 'L', 'XL'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setGarmentSize(s)}
                          className={`py-2 text-center rounded border font-mono transition-colors cursor-pointer ${
                            garmentSize === s ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Coat Length</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setCoatLength('knee')}
                        className={`py-2 text-center rounded border transition-colors cursor-pointer ${
                          coatLength === 'knee' ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8]'
                        }`}
                      >
                        Knee Length
                      </button>
                      <button
                        onClick={() => setCoatLength('full')}
                        className={`py-2 text-center rounded border transition-colors cursor-pointer ${
                          coatLength === 'full' ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8]'
                        }`}
                      >
                        Full / Ankle
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TROUSERS */}
              {projectType === 'trousers' && (
                <div className="text-xs">
                  <label className="block text-[#665F53] mb-1 font-medium">Garment Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['S', 'M', 'L', 'XL'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setGarmentSize(s)}
                        className={`py-2 text-center rounded border font-mono transition-colors cursor-pointer ${
                          garmentSize === s ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SHIRT */}
              {projectType === 'shirt' && (
                <div className="text-xs">
                  <label className="block text-[#665F53] mb-1 font-medium">Shirt Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['S', 'M', 'L', 'XL'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setGarmentSize(s)}
                        className={`py-2 text-center rounded border font-mono transition-colors cursor-pointer ${
                          garmentSize === s ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TABLECLOTH */}
              {projectType === 'tablecloth' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Table Length (cm)</label>
                    <input
                      type="number"
                      min={100}
                      max={450}
                      value={tableLength}
                      onChange={(e) => setTableLength(parseInt(e.target.value) || 120)}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2C2824]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Table Width (cm)</label>
                    <input
                      type="number"
                      min={70}
                      max={180}
                      value={tableWidth}
                      onChange={(e) => setTableWidth(parseInt(e.target.value) || 80)}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2C2824]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#665F53] mb-1 font-medium">Overhang Drop (cm)</label>
                    <input
                      type="number"
                      min={15}
                      max={50}
                      value={dropOverhang}
                      onChange={(e) => setDropOverhang(parseInt(e.target.value) || 25)}
                      className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2C2824]"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeNapkins}
                        onChange={(e) => setIncludeNapkins(e.target.checked)}
                        className="rounded border-[#DDD6C8] text-[#2C2824]"
                      />
                      <span className="text-[#4F493E]">Include 6 matching 45×45cm dinner napkins (+1.2m)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Choose Fabric to Match */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1A17] mb-2">
                3. Pair with Fabric Bolt
              </label>
              <select
                value={chosenFabricId}
                onChange={(e) => setChosenFabricId(e.target.value)}
                className="w-full bg-white border border-[#DDD6C8] text-[#1C1A17] px-4 py-2.5 rounded text-xs focus:outline-none focus:border-[#2C2824] cursor-pointer"
              >
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — ${f.pricePerMeter.toFixed(2)}/m ({f.widthCm}cm width · {f.fiberComposition})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Calculated Result Box */}
          <div className="lg:col-span-5 bg-[#201D1A] text-[#F9F8F5] p-6 sm:p-8 rounded-sm border border-[#3A342D] shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#38322B] pb-4 mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C4BBAE] font-medium">
                  Calculation Summary
                </span>
                <span className="text-xs font-mono text-[#D8CEBE]">
                  Bolt width: {fabricWidthCm} cm
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-[#A39A8B] mb-1">
                  Recommended Yardage Needed:
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-light text-[#FBFBF9] tracking-tight font-mono tabular-nums">
                    {estimatedMeters.toFixed(1)}
                  </span>
                  <span className="text-lg text-[#D5CEBF] font-serif">metres</span>
                </div>
              </div>

              {/* Itemized Fabric Cost */}
              <div className="bg-[#2A2622] p-4 rounded border border-[#3E3830] mb-6 space-y-2 text-xs">
                <div className="flex justify-between text-[#C5BCAD]">
                  <span>Selected Bolt:</span>
                  <span className="text-[#FBFBF9] font-medium">{currentFabric.name}</span>
                </div>
                <div className="flex justify-between text-[#C5BCAD]">
                  <span>Metre Rate:</span>
                  <span className="font-mono text-[#FBFBF9]">${currentFabric.pricePerMeter.toFixed(2)} / m</span>
                </div>
                <div className="flex justify-between text-[#C5BCAD] pt-2 border-t border-[#3B352E]">
                  <span className="font-medium text-[#FBFBF9]">Project Total Cost:</span>
                  <span className="text-xl font-mono font-medium text-[#FBFBF9] tabular-nums">
                    ${estimatedCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Formula & Tailor Note */}
              <div className="text-xs text-[#9E9585] space-y-2 mb-8 leading-relaxed">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#C2B7A5] shrink-0 mt-0.5" />
                  <p>{formulaExplanation}</p>
                </div>
                <p className="text-[11px] text-[#7A7264] italic pl-6">
                  * All calculations include standard atelier cutting tolerance, heading allowances, and hem turns. For directional large patterns, consider adding 1 pattern repeat.
                </p>
              </div>
            </div>

            {/* Actions: Add Exact Metres to Bag or View Fabric */}
            <div className="space-y-3 pt-4 border-t border-[#38322B]">
              <button
                onClick={handleApplyToCart}
                className="w-full py-3.5 bg-[#EAE5D9] hover:bg-[#FAF7F2] text-[#1C1A17] text-xs font-semibold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {appliedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-[#3C7E43]" />
                    <span>Added {estimatedMeters.toFixed(1)}m to Bag!</span>
                  </>
                ) : (
                  <>
                    <span>Add {estimatedMeters.toFixed(1)}m to Bag (${estimatedCost.toFixed(2)})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenFabricModal(currentFabric)}
                className="w-full py-2.5 border border-[#484136] hover:border-[#6C6353] text-[#D8CEBE] hover:text-white text-xs uppercase tracking-wider rounded transition-colors text-center cursor-pointer"
              >
                Inspect Fabric Technical Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
