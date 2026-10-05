import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Lock, Printer, ArrowLeft } from 'lucide-react';
import { CartItem, OrderConfirmation } from '../types/textile';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  discountCode: string;
  onOrderSuccess: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  discountCode,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);

  const subtotal = cartItems.reduce((acc, item) => {
    if (item.type === 'meter') return acc + item.totalPrice;
    if (item.type === 'swatch') return acc + item.price;
    if (item.type === 'swatch_ring') return acc + item.price;
    return acc;
  }, 0);

  const freeShipping = subtotal >= 150;
  const shippingFee = deliveryMethod === 'express' ? 24.0 : freeShipping ? 0.0 : 12.0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address || !city || !postalCode) {
      alert('Please fill out all delivery address fields.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const randomId = Math.floor(10000 + Math.random() * 90000);
      const newOrder: OrderConfirmation = {
        orderNumber: `ATR-${randomId}`,
        customerName: name,
        email,
        shippingAddress: address,
        city,
        postalCode,
        country,
        items: [...cartItems],
        subtotal,
        discount: discountAmount,
        shippingFee,
        total,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        estimatedDelivery: deliveryMethod === 'express' ? '2-3 Business Days' : '4-6 Business Days',
      };

      setConfirmedOrder(newOrder);
      setStep('confirmation');
      setIsProcessing(false);
      onOrderSuccess(newOrder);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FBFBF9] border border-[#DDD6C8] shadow-2xl rounded-sm overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECE7DE] bg-[#F7F5F0]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#686052]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17]">
              {step === 'details' ? 'Secure Atelier Checkout' : 'Order Receipt & Confirmation'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#635B4F] hover:text-[#1C1A17] hover:bg-[#EBE7DF] rounded transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'details' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left: Customer & Delivery Details */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1C1A17] pb-2 border-b border-[#ECE7DE]">
                    1. Shipping & Cutting Destination
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[#696154] mb-1 font-medium">Full Name / Design Studio *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Madeleine Laurent Atelier"
                        className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#696154] mb-1 font-medium">Email Address for Tracking *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="couture@example.com"
                        className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#696154] mb-1 font-medium">Delivery Street Address *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="145 Rue de Richelieu, Suite 4B"
                        className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#696154] mb-1 font-medium">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Paris / New York"
                        className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#696154] mb-1 font-medium">Postal / ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="75002 / 10012"
                        className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2C2824]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#696154] mb-1 font-medium">Country / Region</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-white border border-[#DDD6C8] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#2C2824] cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Germany">Germany</option>
                        <option value="Italy">Italy</option>
                        <option value="Japan">Japan</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Selection */}
                  <div className="pt-2">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#1C1A17] mb-2">
                      2. Shipping Dispatch Option
                    </span>
                    <div className="space-y-2 text-xs">
                      <label
                        className={`flex items-center justify-between p-3 rounded border cursor-pointer ${
                          deliveryMethod === 'standard' ? 'border-[#2C2824] bg-[#F4F1EA]' : 'border-[#DDD6C8] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryMethod === 'standard'}
                            onChange={() => setDeliveryMethod('standard')}
                            className="text-[#2C2824]"
                          />
                          <div>
                            <span className="font-medium text-[#1C1A17] block">Insured Atelier Ground (4-6 Days)</span>
                            <span className="text-[11px] text-[#7A7264]">Rigid roll packaging, tracked priority mail</span>
                          </div>
                        </div>
                        <span className="font-mono font-medium">
                          {freeShipping ? 'FREE' : '$12.00'}
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded border cursor-pointer ${
                          deliveryMethod === 'express' ? 'border-[#2C2824] bg-[#F4F1EA]' : 'border-[#DDD6C8] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryMethod === 'express'}
                            onChange={() => setDeliveryMethod('express')}
                            className="text-[#2C2824]"
                          />
                          <div>
                            <span className="font-medium text-[#1C1A17] block">Expedited Air Courier (2-3 Days)</span>
                            <span className="text-[11px] text-[#7A7264]">Dedicated cutter line, signature required</span>
                          </div>
                        </div>
                        <span className="font-mono font-medium">$24.00</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div className="pt-2">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#1C1A17] mb-2">
                      3. Payment Method
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded border text-center font-medium cursor-pointer transition-colors ${
                          paymentMethod === 'card' ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8] text-[#554F44]'
                        }`}
                      >
                        Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple')}
                        className={`p-2.5 rounded border text-center font-medium cursor-pointer transition-colors ${
                          paymentMethod === 'apple' ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8] text-[#554F44]'
                        }`}
                      >
                        Apple Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2.5 rounded border text-center font-medium cursor-pointer transition-colors ${
                          paymentMethod === 'cod' ? 'bg-[#2C2824] text-white border-[#2C2824]' : 'bg-white border-[#DDD6C8] text-[#554F44]'
                        }`}
                      >
                        COD / Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary Sidebar */}
                <div className="md:col-span-5 bg-[#F6F3EC] p-5 rounded border border-[#E0D9CB] flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17] mb-3 pb-2 border-b border-[#E5DFD4]">
                      Order Summary ({cartItems.length} items)
                    </h4>

                    {/* Scrollable Mini Items */}
                    <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 divide-y divide-[#EAE5DA] text-xs">
                      {cartItems.map((item, i) => (
                        <div key={i} className="pt-2 first:pt-0 flex justify-between items-baseline">
                          <div className="truncate pr-2">
                            <span className="font-medium text-[#1C1A17] block truncate">
                              {item.type === 'meter' && `${item.fabric.name} (${item.meters.toFixed(1)}m)`}
                              {item.type === 'swatch' && `${item.fabric.name} Swatch`}
                              {item.type === 'swatch_ring' && item.title}
                            </span>
                            <span className="text-[10px] text-[#7A7264]">
                              {item.type === 'meter' && `$${item.fabric.pricePerMeter.toFixed(2)} / metre`}
                              {item.type === 'swatch' && 'A5 Swatch Card'}
                              {item.type === 'swatch_ring' && `${item.fabrics.length} swatches`}
                            </span>
                          </div>
                          <span className="font-mono tabular-nums font-medium text-[#1C1A17]">
                            ${item.type === 'meter' ? item.totalPrice.toFixed(2) : item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#E0D9CC] pt-4 mt-4 space-y-2 text-xs text-[#6B6356]">
                      <div className="flex justify-between">
                        <span>Bolts & Swatches</span>
                        <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-[#387241]">
                          <span>Discount ({discountCode || 'Applied'})</span>
                          <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Shipping Delivery</span>
                        <span className="font-mono tabular-nums">
                          {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-[#DDD6C8] text-base font-serif font-medium text-[#1C1A17]">
                        <span>Total Payable</span>
                        <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E0D9CB]">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] text-xs uppercase tracking-widest font-semibold rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span>Processing with Loom Registry...</span>
                      ) : (
                        <span>Confirm & Place Order (${total.toFixed(2)})</span>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7A7264] mt-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Encrypted 256-bit checkout · Continuous roll cut</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Confirmation State */
            <div className="py-6 text-center space-y-6">
              <div className="w-14 h-14 bg-[#EBF4ED] text-[#2F6D38] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#696153] font-medium block mb-1">
                  Order Successfully Placed
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1A17]">
                  Order #{confirmedOrder?.orderNumber} Confirmed
                </h3>
                <p className="text-xs text-[#6B6356] max-w-md mx-auto mt-2">
                  Thank you, {confirmedOrder?.customerName}. Your fabric lengths have been dispatched to our cutting table in Flanders. A tracking confirmation was dispatched to <strong className="text-[#1C1A17]">{confirmedOrder?.email}</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-xl mx-auto bg-[#F6F3EC] p-6 rounded text-left border border-[#DDD6C8] text-xs space-y-3">
                <div className="flex justify-between border-b border-[#E3DDD1] pb-2 font-mono">
                  <span>Order Reference: {confirmedOrder?.orderNumber}</span>
                  <span>Date: {confirmedOrder?.date}</span>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold uppercase tracking-wider text-[#1C1A17] block">
                    Shipment Destination:
                  </span>
                  <div className="text-[#554F43]">
                    {confirmedOrder?.customerName}<br />
                    {confirmedOrder?.shippingAddress}<br />
                    {confirmedOrder?.city}, {confirmedOrder?.postalCode}, {confirmedOrder?.country}
                  </div>
                </div>

                <div className="border-t border-[#E3DDD1] pt-3">
                  <span className="font-semibold uppercase tracking-wider text-[#1C1A17] block mb-2">
                    Itemized Cut Yardage:
                  </span>
                  <div className="space-y-1.5 divide-y divide-[#EBE6DC]">
                    {confirmedOrder?.items.map((item, i) => (
                      <div key={i} className="pt-1.5 first:pt-0 flex justify-between">
                        <span>
                          {item.type === 'meter' && `${item.fabric.name} — ${item.meters.toFixed(1)} metres`}
                          {item.type === 'swatch' && `${item.fabric.name} — Swatch Sample`}
                          {item.type === 'swatch_ring' && item.title}
                        </span>
                        <span className="font-mono tabular-nums">
                          ${item.type === 'meter' ? item.totalPrice.toFixed(2) : item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E3DDD1] pt-3 flex justify-between text-sm font-medium text-[#1C1A17]">
                  <span className="font-serif">Total Charged:</span>
                  <span className="font-mono tabular-nums">${confirmedOrder?.total.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-white border border-[#DDD6C8] hover:bg-[#F2EFE8] text-[#2C2824] rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#2C2824] hover:bg-[#1A1816] text-[#F8F6F0] rounded text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
