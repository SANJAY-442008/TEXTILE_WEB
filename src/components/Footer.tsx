import React, { useState } from 'react';
import { Mail, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenTradeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onOpenTradeModal,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#181614] text-[#EDE8DE] border-t border-[#2C2721] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2C2721]">
          {/* Brand & Atelier Presence */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-2xl font-serif tracking-[0.18em] text-[#FBFBF9] uppercase block font-medium">
              Atelier Trama
            </span>
            <p className="text-xs text-[#B5ABA0] leading-relaxed max-w-sm">
              Artisanal purveyors of 100% natural fiber textiles. Cut to the decimetre from family-owned European looms. Sourced without plastic synthetics since 1984.
            </p>
            <div className="text-xs text-[#8A8174] space-y-1">
              <div>Cutting Studio: 42 Rue des Tisserands, Kortrijk, Belgium</div>
              <div>London Showroom: 18 Savile Row, Mayfair, London W1S 3PW</div>
              <div>Inquiries: <span className="font-mono text-[#D8CEBE]">atelier@trama-textiles.com</span></div>
            </div>
          </div>

          {/* Weave Collections */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8E867A] font-semibold">
              Textiles
            </div>
            <ul className="space-y-2 text-[#C4BBAE]">
              <li>
                <button
                  onClick={() => onScrollToSection('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Belgian Flax Linen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lyon Mulberry Silk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Highland Tweed & Wool
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Organic Supima Voile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Botanical Woad Jacquard
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8E867A] font-semibold">
              Craft & Services
            </div>
            <ul className="space-y-2 text-[#C4BBAE]">
              <li>
                <button
                  onClick={() => onScrollToSection('calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Project Yardage Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('swatch-ring')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curate 5-Swatch Sample Ring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('mill-heritage')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  European Mill Register
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTradeModal}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trade & Architect Studio Program
                </button>
              </li>
              <li>
                <span className="text-[#8E867A]">Natural Botanical Dye Archive</span>
              </li>
            </ul>
          </div>

          {/* Dispatch & Swatch Digest */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8E867A] font-semibold">
              The Loom Dispatch
            </div>
            <p className="text-[#AFA597] leading-relaxed text-[11px]">
              Receive quarterly notices on seasonal dye lots, limited deadstock releases, and heirloom flax harvests.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#242E25] text-[#A6E3B0] rounded border border-[#3A523C] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Subscription recorded. Welcome to the Guild.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@domain.com"
                    className="w-full bg-[#24211D] border border-[#3E3830] text-[#FBFBF9] placeholder-[#817A6F] px-3 py-2 rounded-l text-xs focus:outline-none focus:border-[#D5CEBF]"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-[#EAE5D9] hover:bg-white text-[#1C1A17] rounded-r transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe to dispatch"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-[#787163]">
                  No marketing spam. Unsubscribe at any time.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F776A] gap-4">
          <div className="flex items-center gap-2">
            <span>© 1984–{new Date().getFullYear()} Atelier Trama Textiles S.A.</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Masters of Linen® Registered</span>
            <span aria-hidden="true">·</span>
            <span>OEKO-TEX Standard 100</span>
            <span aria-hidden="true">·</span>
            <span>GOTS Organic Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
