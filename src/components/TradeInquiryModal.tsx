import React, { useState } from 'react';
import { X, Check, Building2, Send, ShieldCheck } from 'lucide-react';

interface TradeInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeInquiryModal: React.FC<TradeInquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [studioName, setStudioName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('Interior Design & Architecture');
  const [projectBrief, setProjectBrief] = useState('');
  const [requestBook, setRequestBook] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // keep submitted state visible
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FBFBF9] border border-[#DDD6C8] shadow-2xl rounded-sm overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECE7DE] bg-[#F7F5F0]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#5D5548]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17]">
              Atelier Trade & Architecture Program
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#635B4F] hover:text-[#1C1A17] hover:bg-[#EBE7DF] rounded transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-[#E9F3EB] text-[#347840] rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#1C1A17]">
                Trade Application Received
              </h3>
              <p className="text-xs text-[#6F675A] max-w-md mx-auto leading-relaxed">
                Thank you, {contactName}. Our head of textile specifications will review your studio credentials for <strong className="text-[#1C1A17]">{studioName}</strong> and dispatch your complimentary physical Binder Swatch Book within 48 business hours.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs uppercase tracking-wider font-semibold rounded cursor-pointer"
              >
                Return to Collection
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-serif text-[#1C1A17] mb-1">
                  Bespoke Bolts, Swatch Binders & Trade Terms
                </h3>
                <p className="text-xs text-[#736B5E] leading-relaxed">
                  We partner with interior architects, luxury couture houses, and boutique hoteliers. Registered trade accounts receive tiered bolt pricing (20-30% off list), priority loom reservations, and certified flame-retardant (CRIB 5 / NFPA 701) finishing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#696154] mb-1 font-medium">Studio / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="e.g. Studio Mckenzie Interiors"
                    className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                  />
                </div>

                <div>
                  <label className="block text-[#696154] mb-1 font-medium">Lead Designer / Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                  />
                </div>

                <div>
                  <label className="block text-[#696154] mb-1 font-medium">Professional Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="design@studiomckenzie.com"
                    className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                  />
                </div>

                <div>
                  <label className="block text-[#696154] mb-1 font-medium">Primary Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824] cursor-pointer"
                  >
                    <option value="Interior Design & Architecture">Interior Design & Architecture</option>
                    <option value="Haute Couture / Fashion Atelier">Haute Couture / Fashion Atelier</option>
                    <option value="Hospitality & Hotel Development">Hospitality & Hotel Development</option>
                    <option value="Theatrical & Film Costuming">Theatrical & Film Costuming</option>
                    <option value="Fine Upholstery & Furniture Maker">Fine Upholstery & Furniture Maker</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#696154] mb-1 font-medium">Project Scope & Estimated Meterage</label>
                  <textarea
                    rows={3}
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    placeholder="Describe upcoming projects (e.g. 18-room country estate drapery, custom linen slipcovers, seeking 120m Belgian oatmeal linen)..."
                    className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestBook}
                      onChange={(e) => setRequestBook(e.target.checked)}
                      className="rounded border-[#DDD6C8] text-[#2C2824]"
                    />
                    <span className="text-[#4F493E]">
                      Request complimentary physical Hardcover Atelier Swatch Binder (Shipped to verified studio addresses)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-[#7A7264]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#427A4B]" />
                  <span>Confidential studio pricing terms</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Trade Application</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
