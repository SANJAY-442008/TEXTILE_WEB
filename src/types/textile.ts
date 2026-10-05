export type FiberCategory = 'all' | 'linen' | 'silk' | 'wool' | 'cotton' | 'cashmere';

export type WeaveType = 'Plain Weave' | 'Charmeuse Satin' | 'Herringbone Twill' | 'Batiste Voile' | 'Jacquard Weave' | 'Waffle Weave' | 'Heavy Canvas';

export interface Fabric {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  fiberCategory: 'linen' | 'silk' | 'wool' | 'cotton' | 'cashmere';
  fiberComposition: string;
  origin: string;
  millName: string;
  pricePerMeter: number;
  pricePerSwatch: number;
  minMeters: number;
  stepMeters: number;
  widthCm: number;
  gsm: number; // Grams per square meter
  weaveType: WeaveType;
  drapeScore: number; // 1 (crisp/structured) to 5 (fluid/liquid)
  opacityScore: number; // 1 (sheer) to 5 (fully opaque)
  stretchScore: string;
  shrinkage: string;
  colorName: string;
  colorHex: string;
  image: string;
  description: string;
  recommendedUses: string[];
  careInstructions: string;
  certifications: string[];
  inStockMeters: number;
  featured?: boolean;
}

export interface CartMeterItem {
  type: 'meter';
  fabric: Fabric;
  meters: number;
  totalPrice: number;
}

export interface CartSwatchItem {
  type: 'swatch';
  fabric: Fabric;
  price: number;
}

export interface SwatchRingBundle {
  type: 'swatch_ring';
  fabrics: Fabric[];
  title: string;
  price: number;
}

export type CartItem = CartMeterItem | CartSwatchItem | SwatchRingBundle;

export interface ProjectCalcParams {
  projectType: 'curtains' | 'cushions' | 'overcoat' | 'trousers' | 'shirt' | 'tablecloth';
  windowWidthCm?: number;
  windowDropCm?: number;
  fullnessRatio?: number;
  cushionSize?: number;
  cushionCount?: number;
  garmentSize?: 'S' | 'M' | 'L' | 'XL';
  coatLength?: 'knee' | 'full';
  tableLengthCm?: number;
  tableWidthCm?: number;
  dropOverhangCm?: number;
}

export interface OrderConfirmation {
  orderNumber: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  date: string;
  estimatedDelivery: string;
}
