import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Plus, Minus, Tag, Check } from 'lucide-react';
import { CartItem } from '../types/textile';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateMeters: (index: number, newMeters: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (appliedDiscount: number, discountCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateMeters,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    if (item.type === 'meter') return acc + item.totalPrice;
    if (item.type === 'swatch') return acc + item.price;
    if (item.type === 'swatch_ring') return acc + item.price;
    return acc;
  }, 0);

  const freeShippingThreshold = 150.0;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const differenceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();

    if (code === 'SAMPLECREDIT') {
      if (subtotal >= 50) {
        setDiscountAmount(18.0);
        setAppliedPromo('SAMPLECREDIT (-$18.00 Swatch Credit)');
        setPromoInput('');
      } else {
        setPromoError('SAMPLECREDIT requires a minimum yardage subtotal of $50.00');
      }
    } else if (code === 'ATELIER10') {
      const disc = +(subtotal * 0.1).toFixed(2);
      setDiscountAmount(disc);
      setAppliedPromo(`ATELIER10 (-10% Welcome: $${disc.toFixed(2)})`);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try SAMPLECREDIT or ATELIER10');
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBFBF9] border-l border-[#DDD6C8] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#ECE7DE] bg-[#F7F5F0] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-[#1C1A17] font-medium">Your Textile Bag</h2>
              <span className="text-xs text-[#736B5F]">
                {cartItems.length} items in selection
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#635B4F] hover:text-[#1C1A17] hover:bg-[#EBE7DF] rounded transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-[#EFECE5] border-b border-[#E2DCCF] text-xs">
            {subtotal >= freeShippingThreshold ? (
              <div className="text-[#3A7043] font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>You unlocked complimentary worldwide insured courier delivery!</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-[#686052]">
                  <span>Add <strong>${differenceToFreeShipping.toFixed(2)}</strong> for free shipping</span>
                  <span className="font-mono text-[11px]">${subtotal.toFixed(0)} / ${freeShippingThreshold}</span>
                </div>
                <div className="w-full bg-[#D5CEBF] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2C2824] h-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EBE7DF]">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-xs text-[#736B5F] space-y-3">
                <p className="text-sm font-serif text-[#1C1A17]">Your bag is currently empty</p>
                <p>Browse our curated rolls of Belgian linen, Lyon mulberry silk, or order a 5-swatch designer ring.</p>
                <button
                  onClick={onClose}
                  className="mt-3 px-4 py-2 bg-[#2C2824] text-[#F8F6F0] rounded uppercase tracking-wider text-[11px] font-semibold hover:bg-[#1A1816] transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => {
                if (item.type === 'meter') {
                  return (
                    <div key={`item-${index}`} className="py-4 flex gap-4 items-start">
                      <img
                        src={item.fabric.image}
                        alt={item.fabric.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded border border-[#DDD6C8] bg-[#EDE8DF] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-serif font-medium text-[#1C1A17] truncate">
                            {item.fabric.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-[#998F80] hover:text-red-700 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#787163] mb-2">
                          Cut Yardage · {item.fabric.widthCm}cm width
                        </div>

                        {/* Metre Stepper */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-[#DDD6C8] rounded bg-white">
                            <button
                              onClick={() => {
                                const next = +(item.meters - 0.1).toFixed(1);
                                if (next >= item.fabric.minMeters) {
                                  onUpdateMeters(index, next);
                                }
                              }}
                              className="px-2 py-1 text-xs text-[#524B40] hover:bg-[#F2EFE8] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-medium text-[#1C1A17]">
                              {item.meters.toFixed(1)}m
                            </span>
                            <button
                              onClick={() => {
                                const next = +(item.meters + 0.1).toFixed(1);
                                onUpdateMeters(index, next);
                              }}
                              className="px-2 py-1 text-xs text-[#524B40] hover:bg-[#F2EFE8] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-sm font-medium text-[#1C1A17] tabular-nums">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                            <div className="text-[10px] text-[#867E70]">
                              (${item.fabric.pricePerMeter.toFixed(2)}/m)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === 'swatch') {
                  return (
                    <div key={`swatch-${index}`} className="py-4 flex gap-4 items-start">
                      <img
                        src={item.fabric.image}
                        alt={item.fabric.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded border border-[#DDD6C8] bg-[#EDE8DF] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-serif font-medium text-[#1C1A17] truncate">
                            {item.fabric.name} (Sample Swatch)
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-[#998F80] hover:text-red-700 transition-colors p-1"
                            title="Remove swatch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#787163]">
                          A5 Swatch Card + Fiber Passport
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-[#867E70]">Single Sample</span>
                          <span className="font-mono text-sm font-medium text-[#1C1A17] tabular-nums">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === 'swatch_ring') {
                  return (
                    <div key={`ring-${index}`} className="py-4 flex gap-4 items-start bg-[#F7F4EC] p-3 rounded my-2">
                      <div className="w-14 h-14 rounded border border-[#DDD6C8] bg-white grid grid-cols-2 p-0.5 gap-0.5 shrink-0">
                        {item.fabrics.slice(0, 4).map((f, i) => (
                          <img
                            key={i}
                            src={f.image}
                            alt={f.name}
                            className="w-full h-full object-cover rounded-xs"
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-serif font-medium text-[#1C1A17]">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-[#998F80] hover:text-red-700 transition-colors p-1"
                            title="Remove ring"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-[#787163]">
                          {item.fabrics.length} curated swatches on brass ring
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-[#427A4B] font-medium">Free Postage</span>
                          <span className="font-mono text-sm font-medium text-[#1C1A17] tabular-nums">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="px-6 py-5 border-t border-[#ECE7DE] bg-[#F7F5F0] space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Coupon code (e.g. SAMPLECREDIT)"
                  className="flex-1 bg-white border border-[#DDD6C8] px-3 py-1.5 rounded text-xs uppercase tracking-wider font-mono focus:outline-none focus:border-[#2C2824]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#E2DDCF] hover:bg-[#D5CEBF] text-[#2C2824] rounded text-xs font-medium cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex justify-between text-xs text-[#3E7444] bg-[#E9F3EB] px-3 py-1.5 rounded">
                  <span>{appliedPromo}</span>
                  <button
                    onClick={() => {
                      setDiscountAmount(0);
                      setAppliedPromo(null);
                    }}
                    className="text-red-700 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <div className="text-[11px] text-red-700 bg-red-50 p-2 rounded">
                  {promoError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6B6355]">
                <div className="flex justify-between">
                  <span>Bolts & Swatches Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1C1A17] font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#3E7444]">
                    <span>Promotional Credit</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Courier Shipping</span>
                  <span className="font-mono tabular-nums">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-[#3E7444] font-medium">FREE</span>
                    ) : (
                      '$12.00'
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#E5DFD4] text-sm text-[#1C1A17] font-medium">
                  <span className="font-serif">Estimated Total</span>
                  <span className="font-mono text-base tabular-nums">
                    ${(finalTotal + (subtotal >= freeShippingThreshold ? 0 : 12.0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => onProceedToCheckout(discountAmount, appliedPromo || '')}
                className="w-full py-3.5 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs uppercase tracking-widest font-semibold rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#867E70] text-center">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Secured · Custom Cut Guaranteed · Direct From Loom</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
