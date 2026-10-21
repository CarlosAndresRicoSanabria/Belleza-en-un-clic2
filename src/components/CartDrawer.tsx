import React, { useState } from 'react';
import { CartItem, SedeId } from '../types';
import { SEDES_DATA } from '../data/mockData';

interface CartDrawerProps {
  items: CartItem[];
  currentSede: SedeId;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  currentSede,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal; // Express shipping is free over 150k, or free promotion
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const formattedSubtotal = `$${new Intl.NumberFormat('es-CO').format(subtotal)} COP`;
  const formattedTotal = `$${new Intl.NumberFormat('es-CO').format(total)} COP`;
  const sedeInfo = SEDES_DATA[currentSede];

  if (!isOpen && items.length === 0) return null;

  return (
    <aside
      className={`fixed right-4 md:right-8 bottom-4 md:bottom-8 z-40 w-[calc(100vw-2rem)] sm:w-96 max-w-sm transition-all duration-300 ${
        isMinimized ? 'translate-y-[calc(100%-4rem)]' : 'translate-y-0'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-[#d7c1c3]/60 overflow-hidden flex flex-col p-4 md:p-5 gap-3.5 backdrop-blur-md">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#f2e5e5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#9c4048] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {totalCount}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E1A1D] leading-tight">
                Tu Carrito en Vivo
              </h4>
              <span className="text-[11px] text-[#524345]">
                Entrega desde {sedeInfo.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[#524345] hover:text-[#1E1A1D] p-1 rounded-full hover:bg-[#f8ebeb] transition-colors"
              title={isMinimized ? "Expandir carrito" : "Minimizar"}
            >
              <span className="material-symbols-outlined text-lg">
                {isMinimized ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="text-[#524345] hover:text-[#9E2A2B] p-1 rounded-full hover:bg-[#f8ebeb] transition-colors"
              title="Cerrar vista"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Items Container */}
        {!isMinimized && (
          <>
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#524345]">
                  <span className="material-symbols-outlined text-3xl text-[#d7c1c3] mb-1">
                    remove_shopping_cart
                  </span>
                  <p>Tu carrito está vacío.</p>
                  <p className="text-[11px] text-[#857374] mt-0.5">Explora el catálogo para agregar productos.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-xs py-2 px-2.5 bg-[#fef0f1] rounded-xl border border-[#d7c1c3]/30"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[#1E1A1D] truncate text-xs">
                          {item.product.name}
                        </span>
                        {item.selectedShade && (
                          <span className="text-[10px] text-[#8a4853] font-medium">
                            Tono: {item.selectedShade}
                          </span>
                        )}
                        <span className="text-[10px] text-[#857374]">
                          {item.quantity}x ${new Intl.NumberFormat('es-CO').format(item.product.price)} COP
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded-full bg-white text-[#1E1A1D] hover:bg-[#f2e5e5] flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#1E1A1D] px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded-full bg-white text-[#1E1A1D] hover:bg-[#f2e5e5] flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#ba1a1a] hover:opacity-80 p-1 ml-1"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations Breakdown */}
            {items.length > 0 && (
              <div className="flex flex-col gap-1.5 bg-[#f8ebeb] p-3 rounded-xl text-xs">
                <div className="flex justify-between text-[#524345]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E1A1D]">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#2E6B4F]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    <span>Envío Express</span>
                  </span>
                  <span className="font-bold uppercase text-[10px]">GRATIS ($0)</span>
                </div>
                <div className="flex justify-between font-bold text-[#1E1A1D] pt-1.5 mt-1 border-t border-[#d7c1c3]/40">
                  <span>Total Estimado</span>
                  <span className="text-[#8a4853] text-sm">{formattedTotal}</span>
                </div>
              </div>
            )}

            {/* Checkout Action */}
            <button
              onClick={onProceedToCheckout}
              disabled={items.length === 0}
              className="w-full py-3 rounded-full bg-[#9c4048] hover:bg-[#77242d] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <span>Ir al Checkout Seguro</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
