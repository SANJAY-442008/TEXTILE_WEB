import React from 'react';
import { ShoppingBag, BookmarkCheck, Search } from 'lucide-react';
import { CartItem } from '../types/textile';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenTradeModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  swatchRingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenTradeModal,
  onScrollToSection,
  swatchRingCount,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => {
    if (item.type === 'meter') return acc + 1;
    if (item.type === 'swatch') return acc + 1;
    if (item.type === 'swatch_ring') return acc + item.fabrics.length;
    return acc;
  }, 0);

  const cartSubtotal = cartItems.reduce((acc, item) => {
    if (item.type === 'meter') return acc + item.totalPrice;
    if (item.type === 'swatch') return acc + item.price;
    if (item.type === 'swatch_ring') return acc + item.price;
    return acc;
  }, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#ECE7DE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element wordmark strictly adhering to Top Bar Contract */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-serif tracking-[0.18em] text-[#1C1A17] hover:opacity-80 transition-opacity uppercase font-medium select-none"
          >
            Atelier Trama
          </a>

          {/* Zone 2: 4-5 clean text navigation links with subtle hover effect */}
          <nav className="hidden md:flex items-center space-x-8 text-sm tracking-wide text-[#595349] font-medium">
            <button
              onClick={() => onScrollToSection('catalog')}
              className="hover:text-[#1C1A17] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#1C1A17]"
            >
              Fabric Catalog
            </button>
            <button
              onClick={() => onScrollToSection('calculator')}
              className="hover:text-[#1C1A17] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#1C1A17]"
            >
              Yardage Calculator
            </button>
            <button
              onClick={() => onScrollToSection('swatch-ring')}
              className="hover:text-[#1C1A17] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#1C1A17] flex items-center gap-1.5"
            >
              <span>Swatch Kit</span>
              {swatchRingCount > 0 && (
                <span className="text-xs bg-[#2C2824] text-[#F8F6F0] rounded-full w-4 h-4 inline-flex items-center justify-center font-mono">
                  {swatchRingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onScrollToSection('mill-heritage')}
              className="hover:text-[#1C1A17] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#1C1A17]"
            >
              Mill Heritage
            </button>
            <button
              onClick={onOpenTradeModal}
              className="hover:text-[#1C1A17] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#1C1A17]"
            >
              Trade & Studio
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onScrollToSection('catalog')}
              className="p-2 text-[#595349] hover:text-[#1C1A17] transition-colors md:hidden"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2.5 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-[#1C1A17] bg-[#EFECE6] hover:bg-[#E5E0D6] border border-[#DDD6C8] transition-colors rounded cursor-pointer whitespace-nowrap"
              aria-label={`Shopping bag with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="font-mono tabular-nums text-xs bg-[#2C2824] text-[#FBFBF9] px-1.5 py-0.5 rounded-sm">
                {totalCartCount}
              </span>
              {cartSubtotal > 0 && (
                <span className="hidden md:inline font-mono tabular-nums text-xs text-[#5C5549] pl-1 border-l border-[#D5CEBF]">
                  ${cartSubtotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
