export type SedeId = 'bogota' | 'medellin' | 'cali';

export interface SedeInfo {
  id: SedeId;
  name: string;
  fullName: string;
  address: string;
  hours: string;
  phone: string;
  deliveryTime: string;
}

export interface Product {
  id: string;
  sku: string;
  ean: string;
  name: string;
  brand: string;
  category: 'facial' | 'maquillaje' | 'serums' | 'solar';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  formulaNote: string;
  volume: string;
  imageUrl: string;
  badge?: string;
  badgeType?: 'bestseller' | 'hydration' | 'spf' | 'comfort' | 'cold';
  shades?: { name: string; colorHex: string }[];
  invimaCode: string;
  batchCode: string;
  stock: Record<SedeId, number>;
  aisleLocation?: string;
  minRecommendedStock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: string;
}

export type OrderStatus = 'pago_confirmado' | 'preparacion_bodega' | 'en_ruta' | 'entregado';

export interface OrderItem {
  productName: string;
  category: string;
  quantity: number;
  price: number;
  lotCode: string;
  imageUrl: string;
  volumeOrGrams?: string;
}

export interface Order {
  id: string; // e.g. #BEC-2026-8942
  date: string;
  timestamp: string;
  status: OrderStatus;
  statusLabel: string;
  total: number;
  subtotal: number;
  discount: number;
  iva: number;
  shipping: number;
  couponCode?: string;
  sedeOrigin: string;
  sedeId: SedeId;
  shippingMethod: 'domicilio' | 'pickup';
  deliveryAddress: string;
  estimatedWindow: string;
  courierName: string;
  trackingNumber: string; // e.g. #ENV-983124
  courierDriver?: {
    name: string;
    vehicle: string;
    rating: number;
    completedTrips: number;
    phone: string;
    avatarUrl: string;
  };
  dianInvoice: {
    number: string; // FE-BOG-00892
    cufe: string;
    xmlIssued: boolean;
    pdfReady: boolean;
  };
  items: OrderItem[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  neighborhood: string;
  notes: string;
  isDefault: boolean;
  type: 'casa' | 'trabajo' | 'consultorio';
  nearestSede: string;
  distanceKm: string;
}

export interface PQRSItem {
  id: string;
  type: 'peticion' | 'queja' | 'envio' | 'dermatologica';
  title: string;
  orderId?: string;
  lotCode?: string;
  status: 'Resuelto / Aprobado' | 'En Peritaje' | 'Radicado';
  date: string;
  description: string;
  resolution?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  avatarUrl: string;
  isVerifiedBuyer: boolean;
  badge?: string;
  rating: number;
  title: string;
  skinType: 'grasa' | 'mixta' | 'sensible' | 'seca';
  usageDuration: string;
  climateNote?: string;
  content: string;
  date: string;
  helpfulCount: number;
  images?: string[];
  isProfessional?: boolean;
}

export type Role = 'cliente' | 'admin' | 'empleado';

export type ActiveView = 
  | 'catalogo'
  | 'cuidado-facial'
  | 'maquillaje'
  | 'ofertas'
  | 'carrito'
  | 'checkout'
  | 'mis-pedidos'
  | 'historial'
  | 'perfil'
  | 'direcciones'
  | 'pqrs'
  | 'reviews'
  | 'admin-inventario'
  | 'sedes-stock'
  | 'categorias';
