import React, { useState } from 'react';
import {
  SedeId,
  Role,
  ActiveView,
  Product,
  CartItem,
  Order,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  SEDES_DATA,
} from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNavBar } from './components/MobileNavBar';
import { CartDrawer } from './components/CartDrawer';
import { CatalogView } from './views/CatalogView';
import { CheckoutView } from './views/CheckoutView';
import { OrdersTrackingView } from './views/OrdersTrackingView';
import { OrderHistoryView } from './views/OrderHistoryView';
import { ProfileView } from './views/ProfileView';
import { AddressesView } from './views/AddressesView';
import { PqrsView } from './views/PqrsView';
import { ReviewsView } from './views/ReviewsView';
import { AdminInventoryView } from './views/AdminInventoryView';
import { CategoriesView } from './views/CategoriesView';

export default function App() {
  // Global States
  const [currentSede, setCurrentSede] = useState<SedeId>('bogota');
  const [currentRole, setCurrentRole] = useState<Role>('cliente');
  const [activeView, setActiveView] = useState<ActiveView>('catalogo');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);

  // Products and Inventory
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedPqrsOrderId, setSelectedPqrsOrderId] = useState<string | undefined>(undefined);

  // Active Product for Reviews view
  const [activeReviewProduct, setActiveReviewProduct] = useState<Product>(INITIAL_PRODUCTS[0]);

  // Cart State (Initialized with 2 items for realistic instant preview)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // Sérum Niacinamida 10%
      quantity: 1,
    },
    {
      product: INITIAL_PRODUCTS[2], // Base Serum Fluida
      quantity: 1,
      selectedShade: '01 Nude Claro',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  // Cart Actions
  const handleAddToCart = (product: Product, selectedShade?: string) => {
    const sedeStock = product.stock[currentSede] || 0;
    if (sedeStock <= 0) {
      showToast(`Agotado temporalmente en ${SEDES_DATA[currentSede].name}. Puedes cambiar de sede o solicitar despacho nacional.`);
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedShade === selectedShade
      );
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty >= sedeStock) {
          showToast(`Límite alcanzado: solo hay ${sedeStock} unidades en ${SEDES_DATA[currentSede].name}.`);
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedShade }];
      }
    });

    setIsCartOpen(true);
    showToast(`¡${product.name} agregado al carrito! Despacho desde ${SEDES_DATA[currentSede].name}`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            const maxStock = item.product.stock[currentSede] || 10;
            if (newQty > maxStock) {
              showToast(`Stock máximo disponible en sede: ${maxStock} unidades.`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Producto retirado de la bolsa.');
  };

  // Role switching navigation helper
  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    if (role === 'admin' || role === 'empleado') {
      setActiveView('admin-inventario');
      showToast(`Modo cambiado a ${role === 'admin' ? 'Administrador Central' : 'Operador de Bodega'}. Sistema 'Belleza Operativa' activo.`);
    } else {
      setActiveView('catalogo');
      showToast('Modo Cliente activo: Experiencia de compra personalizada Glow VIP.');
    }
  };

  // Inventory update handler for Admin View
  const handleUpdateStock = (productId: string, newStock: number, sede: SedeId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: {
              ...p.stock,
              [sede]: newStock,
            },
          };
        }
        return p;
      })
    );
  };

  // Direct review viewing
  const handleViewProductReviews = (product: Product) => {
    setActiveReviewProduct(product);
    setActiveView('reviews');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Placement
  const handleOrderSuccess = (orderData: {
    total: number;
    paymentMethod: string;
    shippingMethod: string;
    dianDoc: string;
  }) => {
    const newOrderId = `#BEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTracking = `#ENV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInvoiceNumber = `FE-${currentSede === 'bogota' ? 'BOG' : currentSede === 'medellin' ? 'MED' : 'CAL'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      date: 'Hoy, ' + new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
      timestamp: 'Hace pocos segundos',
      status: 'pago_confirmado',
      statusLabel: 'Pago Aprobado · En Alistamiento de Bodega',
      total: orderData.total,
      subtotal: Math.round(orderData.total / 1.19),
      discount: 0,
      iva: Math.round(orderData.total - orderData.total / 1.19),
      shipping: 0,
      sedeOrigin: SEDES_DATA[currentSede].name,
      sedeId: currentSede,
      shippingMethod: orderData.shippingMethod === 'pickup' ? 'pickup' : 'domicilio',
      deliveryAddress: orderData.shippingMethod === 'pickup' ? SEDES_DATA[currentSede].fullName : 'Calle 93 # 12-45, Apto 502, Chicó Norte, Bogotá',
      estimatedWindow: 'Hoy, entre 2:00 PM y 5:00 PM',
      courierName: 'Coordinadora Express Domicilio Urbano',
      trackingNumber: newTracking,
      courierDriver: {
        name: 'Carlos Mendieta',
        vehicle: 'Yamaha Crypton Dermo-Box · Placa WXZ-98E',
        rating: 4.95,
        completedTrips: 1420,
        phone: '+57 312 849 2011',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfOqI16327K4XbJbXk_q2eN87qU1i82Fk47GvBsh2Qj9x2rP--0x8eM5kM_k=w120-h120',
      },
      dianInvoice: {
        number: newInvoiceNumber,
        cufe: `cuf_${Math.random().toString(36).substring(2, 15)}...fe2026`,
        xmlIssued: true,
        pdfReady: true,
      },
      items: cartItems.map((c) => ({
        productName: c.product.name,
        category: c.product.categoryLabel,
        quantity: c.quantity,
        price: c.product.price,
        lotCode: c.product.batchCode,
        imageUrl: c.product.imageUrl,
        volumeOrGrams: c.product.volume,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setActiveView('mis-pedidos');
    showToast(`¡Pedido ${newOrderId} generado con éxito! Factura electrónica DIAN ${newInvoiceNumber} radicada.`);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Render view router
  const renderCurrentView = () => {
    switch (activeView) {
      case 'catalogo':
        return (
          <CatalogView
            products={products}
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onAddToCart={handleAddToCart}
            onViewProductReviews={handleViewProductReviews}
            searchQuery={searchQuery}
            onNavigateToCategory={(cat) => {
              if (cat === 'facial') setActiveView('cuidado-facial');
              else if (cat === 'maquillaje') setActiveView('maquillaje');
              else setActiveView('catalogo');
            }}
          />
        );
      case 'cuidado-facial':
        return (
          <CatalogView
            products={products}
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onAddToCart={handleAddToCart}
            onViewProductReviews={handleViewProductReviews}
            searchQuery={searchQuery}
            categoryFilter="facial"
          />
        );
      case 'maquillaje':
        return (
          <CatalogView
            products={products}
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onAddToCart={handleAddToCart}
            onViewProductReviews={handleViewProductReviews}
            searchQuery={searchQuery}
            categoryFilter="maquillaje"
          />
        );
      case 'ofertas':
        return (
          <CatalogView
            products={products.filter((p) => (p.originalPrice ?? 0) > p.price)}
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onAddToCart={handleAddToCart}
            onViewProductReviews={handleViewProductReviews}
            searchQuery={searchQuery}
          />
        );
      case 'categorias':
        return (
          <CategoriesView
            onSelectCategory={(catId) => {
              if (catId === 'facial') setActiveView('cuidado-facial');
              else if (catId === 'maquillaje') setActiveView('maquillaje');
              else setActiveView('catalogo');
            }}
            onNavigate={setActiveView}
          />
        );
      case 'checkout':
      case 'carrito':
        return (
          <CheckoutView
            cartItems={cartItems}
            currentSede={currentSede}
            onUpdateQuantity={handleUpdateQuantity}
            onOrderSuccess={handleOrderSuccess}
            onBackToCatalog={() => setActiveView('catalogo')}
          />
        );
      case 'mis-pedidos':
        return (
          <OrdersTrackingView
            order={orders[0]}
            onNavigate={setActiveView}
            onOpenPQRSForOrder={(orderId) => {
              setSelectedPqrsOrderId(orderId);
              setActiveView('pqrs');
            }}
          />
        );
      case 'historial':
        return (
          <OrderHistoryView
            orders={orders}
            onReorder={(order) => {
              // Add order items to cart
              const newItems: CartItem[] = order.items.map((it) => {
                const matchedProd = products.find((p) => p.name === it.productName) || products[0];
                return {
                  product: matchedProd,
                  quantity: it.quantity,
                };
              });
              setCartItems(newItems);
              setIsCartOpen(true);
              showToast(`Artículos del pedido ${order.id} reincorporados a tu bolsa.`);
            }}
            onNavigate={setActiveView}
          />
        );
      case 'perfil':
        return <ProfileView onNavigate={setActiveView} onToast={showToast} />;
      case 'direcciones':
        return (
          <AddressesView
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onToast={showToast}
          />
        );
      case 'pqrs':
        return (
          <PqrsView
            initialOrderId={selectedPqrsOrderId}
            activeOrders={orders}
            onToast={showToast}
          />
        );
      case 'reviews':
        return (
          <ReviewsView
            product={activeReviewProduct}
            onAddToCart={handleAddToCart}
            onToast={showToast}
          />
        );
      case 'admin-inventario':
      case 'sedes-stock':
        return (
          <AdminInventoryView
            products={products}
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onUpdateStock={handleUpdateStock}
            onToast={showToast}
          />
        );
      default:
        return (
          <CatalogView
            products={products}
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            onAddToCart={handleAddToCart}
            onViewProductReviews={handleViewProductReviews}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2c1810] font-sans antialiased selection:bg-[#9c4048]/15 selection:text-[#8a4853] flex flex-col">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92vw] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#2c1810] text-[#faf8f5] px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 border border-[#d7c1c3]/30">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffd9dd] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
              <p className="text-xs md:text-sm font-medium leading-snug">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-[#d7c1c3] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Device Simulation Shell Option */}
      {isMobileDeviceView ? (
        <div className="min-h-screen bg-[#241c1d] py-6 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center">
          {/* Controls Bar */}
          <div className="mb-4 flex items-center justify-between max-w-[420px] w-full px-4 text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd9dd] text-lg">smartphone</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#eddfe0]">
                Vista Móvil Táctil
              </span>
            </div>
            <button
              onClick={() => setIsMobileDeviceView(false)}
              className="text-xs font-medium bg-[#9c4048] hover:bg-[#8a4853] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">desktop_windows</span>
              <span>Volver a Escritorio</span>
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-[#FAF8F5] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-[#382d2f] overflow-hidden flex flex-col">
            {/* Phone Speaker & Dynamic Island */}
            <div className="absolute top-0 inset-x-0 h-7 z-50 flex items-center justify-between px-7 pointer-events-none text-[11px] font-semibold text-[#2c1810]/80">
              <span>9:41</span>
              <div className="w-24 h-4 bg-black rounded-full mx-auto my-1"></div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
                <span className="material-symbols-outlined text-[13px]">wifi</span>
                <span className="material-symbols-outlined text-[13px]">battery_full</span>
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto pt-7 pb-20 no-scrollbar">
              <Header
                currentSede={currentSede}
                onSelectSede={setCurrentSede}
                currentRole={currentRole}
                onSelectRole={handleSelectRole}
                activeView={activeView}
                onNavigate={setActiveView}
                cartCount={cartTotalCount}
                onToggleCart={() => setIsCartOpen(!isCartOpen)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isMobileDeviceView={isMobileDeviceView}
                onToggleMobileDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
              />

              <main className="mt-28">
                {renderCurrentView()}
              </main>

              <Footer onNavigate={setActiveView} />
            </div>

            {/* Bottom Mobile Tab Bar */}
            <MobileNavBar
              activeView={activeView}
              onNavigate={(v) => {
                setActiveView(v);
                if (v === 'carrito') setIsCartOpen(true);
              }}
              cartCount={cartTotalCount}
            />
          </div>
        </div>
      ) : (
        /* Full Desktop / Standard Responsive Experience */
        <>
          <Header
            currentSede={currentSede}
            onSelectSede={setCurrentSede}
            currentRole={currentRole}
            onSelectRole={handleSelectRole}
            activeView={activeView}
            onNavigate={setActiveView}
            cartCount={cartTotalCount}
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isMobileDeviceView={isMobileDeviceView}
            onToggleMobileDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
          />

          {/* Main Content Area */}
          <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-16">
            {renderCurrentView()}
          </main>

          {/* Cart Floating Drawer */}
          <CartDrawer
            items={cartItems}
            currentSede={currentSede}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setActiveView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Native Mobile Navigation Bar on Handheld viewports */}
          <MobileNavBar
            activeView={activeView}
            onNavigate={(v) => {
              setActiveView(v);
              if (v === 'carrito') setIsCartOpen(true);
            }}
            cartCount={cartTotalCount}
          />

          {/* Colombian E-Commerce Footer */}
          <Footer onNavigate={setActiveView} />
        </>
      )}
    </div>
  );
}
