import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FabricGrid } from './components/FabricGrid';
import { FabricModal } from './components/FabricModal';
import { YardageCalculator } from './components/YardageCalculator';
import { SwatchRingBuilder } from './components/SwatchRingBuilder';
import { CraftHeritage } from './components/CraftHeritage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TradeInquiryModal } from './components/TradeInquiryModal';
import { Footer } from './components/Footer';
import { FABRICS } from './data/fabrics';
import { Fabric, CartItem, FiberCategory, OrderConfirmation } from './types/textile';

export default function App() {
  const [fabrics] = useState<Fabric[]>(FABRICS);
  const [selectedCategory, setSelectedCategory] = useState<FiberCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Fabric for Detail Modal
  const [activeFabric, setActiveFabric] = useState<Fabric | null>(null);

  // Selected Fabric for Calculator
  const [selectedFabricForCalc, setSelectedFabricForCalc] = useState<Fabric | null>(null);

  // Swatch Ring selection (up to 5)
  const [swatchRing, setSwatchRing] = useState<Fabric[]>(() => [
    FABRICS[0], // Belgian Linen
    FABRICS[1], // Mulberry Silk
    FABRICS[2], // Highland Wool
  ]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => [
    {
      type: 'meter',
      fabric: FABRICS[0],
      meters: 2.5,
      totalPrice: +(2.5 * FABRICS[0].pricePerMeter).toFixed(2),
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState('');

  // Trade modal
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  // Notifications or toast message
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Cart Handlers
  const handleAddToCartMeters = (fabric: Fabric, meters: number) => {
    setCartItems((prev) => {
      // Check if existing meter item of same fabric
      const existingIdx = prev.findIndex(
        (item) => item.type === 'meter' && item.fabric.id === fabric.id
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const currentItem = updated[existingIdx] as any;
        const newMeters = +(currentItem.meters + meters).toFixed(1);
        updated[existingIdx] = {
          type: 'meter',
          fabric,
          meters: newMeters,
          totalPrice: +(newMeters * fabric.pricePerMeter).toFixed(2),
        };
        return updated;
      }

      return [
        ...prev,
        {
          type: 'meter',
          fabric,
          meters,
          totalPrice: +(meters * fabric.pricePerMeter).toFixed(2),
        },
      ];
    });

    showNotification(`Added ${meters.toFixed(1)}m of ${fabric.name} to your bag`);
  };

  const handleAddSingleSwatch = (fabric: Fabric) => {
    // Also add to Swatch Ring if space is available
    if (swatchRing.length < 5 && !swatchRing.some((s) => s.id === fabric.id)) {
      setSwatchRing((prev) => [...prev, fabric]);
      showNotification(`Added ${fabric.name} to your 5-Swatch Designer Ring`);
    } else {
      // Add as individual swatch to cart
      setCartItems((prev) => [
        ...prev,
        {
          type: 'swatch',
          fabric,
          price: fabric.pricePerSwatch,
        },
      ]);
      showNotification(`Added ${fabric.name} A5 swatch sample to bag`);
    }
  };

  const handleAddRingToCart = () => {
    if (swatchRing.length === 0) return;
    setCartItems((prev) => [
      ...prev,
      {
        type: 'swatch_ring',
        fabrics: [...swatchRing],
        title: `Curated ${swatchRing.length}-Swatch Designer Ring`,
        price: 18.0,
      },
    ]);
    setIsCartOpen(true);
    showNotification(`Added ${swatchRing.length}-Swatch Designer Ring to bag`);
  };

  const handleUpdateMeters = (index: number, newMeters: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (item && item.type === 'meter') {
        updated[index] = {
          ...item,
          meters: newMeters,
          totalPrice: +(newMeters * item.fabric.pricePerMeter).toFixed(2),
        };
      }
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Swatch Ring handlers
  const handleRemoveSwatchFromRing = (fabricId: string) => {
    setSwatchRing((prev) => prev.filter((f) => f.id !== fabricId));
  };

  const isSwatchInRing = (fabricId: string) => {
    return swatchRing.some((f) => f.id === fabricId);
  };

  // Navigation smoothly to anchor
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Checkout flow
  const handleProceedToCheckout = (discount: number, code: string) => {
    setDiscountAmount(discount);
    setDiscountCode(code);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: OrderConfirmation) => {
    // Clear cart once order is confirmed
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1A17] antialiased">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1A17] text-[#F8F6F0] px-4 py-3 rounded shadow-2xl text-xs flex items-center gap-2 border border-[#443E36] transition-all transform animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#82D18F]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Strict One-Row Three-Zone Top Navigation */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTradeModal={() => setIsTradeModalOpen(true)}
        onScrollToSection={scrollToSection}
        swatchRingCount={swatchRing.length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreFabrics={() => scrollToSection('catalog')}
          onOpenCalculator={() => scrollToSection('calculator')}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat as any);
            scrollToSection('catalog');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Fabric Catalog & Grid */}
        <FabricGrid
          fabrics={fabrics}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectFabric={(f) => setActiveFabric(f)}
          onAddSwatch={handleAddSingleSwatch}
          onOpenCalculator={() => scrollToSection('calculator')}
          isSwatchInRing={isSwatchInRing}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

        {/* Master Atelier Tool: Yardage Estimator */}
        <YardageCalculator
          fabrics={fabrics}
          selectedFabricForCalc={selectedFabricForCalc}
          onSelectFabricForCalc={setSelectedFabricForCalc}
          onAddToCartMeters={handleAddToCartMeters}
          onOpenFabricModal={(f) => setActiveFabric(f)}
        />

        {/* 5-Swatch Designer Ring Builder */}
        <SwatchRingBuilder
          fabrics={fabrics}
          swatchRing={swatchRing}
          onRemoveSwatch={handleRemoveSwatchFromRing}
          onAddSwatch={(f) => {
            if (swatchRing.length < 5 && !swatchRing.some((s) => s.id === f.id)) {
              setSwatchRing((prev) => [...prev, f]);
              showNotification(`Added ${f.name} to ring`);
            }
          }}
          onAddRingToCart={handleAddRingToCart}
        />

        {/* Living Loom Tradition & Mill Heritage */}
        <CraftHeritage />
      </main>

      {/* Minimalist Footing */}
      <Footer
        onScrollToSection={scrollToSection}
        onOpenTradeModal={() => setIsTradeModalOpen(true)}
      />

      {/* Fabric Detail Modal (PDP) */}
      <FabricModal
        fabric={activeFabric}
        onClose={() => setActiveFabric(null)}
        onAddToCartMeters={handleAddToCartMeters}
        onAddSwatch={handleAddSingleSwatch}
        isSwatchInRing={activeFabric ? isSwatchInRing(activeFabric.id) : false}
        onOpenCalculatorForFabric={(f) => {
          setSelectedFabricForCalc(f);
          scrollToSection('calculator');
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateMeters={handleUpdateMeters}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout & Order Confirmation Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={discountAmount}
        discountCode={discountCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Trade & Studio Program Modal */}
      <TradeInquiryModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
      />
    </div>
  );
}
