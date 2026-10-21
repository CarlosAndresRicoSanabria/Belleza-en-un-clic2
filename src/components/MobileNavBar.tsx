import React from 'react';
import { ActiveView } from '../types';

interface MobileNavBarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  cartCount: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeView,
  onNavigate,
  cartCount,
}) => {
  const isCatalog = activeView === 'catalogo' || activeView === 'cuidado-facial' || activeView === 'maquillaje' || activeView === 'ofertas';
  const isCategories = activeView === 'categorias';
  const isCart = activeView === 'carrito';
  const isOrders = activeView === 'mis-pedidos' || activeView === 'historial';
  const isProfile = activeView === 'perfil' || activeView === 'direcciones' || activeView === 'pqrs' || activeView === 'reviews';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#fff8f7]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(106,26,36,0.06)] border-t border-[#eddfe0]/80 md:hidden">
      <div className="flex justify-around items-center h-16 px-3 max-w-md mx-auto">
        <button
          onClick={() => onNavigate('catalogo')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all ${
            isCatalog ? 'text-[#8a4853] font-bold scale-105' : 'text-[#524345] hover:text-[#8a4853]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px] font-semibold">Catálogo</span>
        </button>

        <button
          onClick={() => onNavigate('categorias')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all ${
            isCategories ? 'text-[#8a4853] font-bold scale-105' : 'text-[#524345] hover:text-[#8a4853]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-[10px] font-semibold">Categorías</span>
        </button>

        <button
          onClick={() => onNavigate('carrito')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 relative transition-all ${
            isCart ? 'text-[#8a4853] font-bold scale-105' : 'text-[#524345] hover:text-[#8a4853]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#9c4048] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Carrito</span>
        </button>

        <button
          onClick={() => onNavigate('mis-pedidos')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all ${
            isOrders ? 'text-[#8a4853] font-bold scale-105' : 'text-[#524345] hover:text-[#8a4853]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">local_shipping</span>
          <span className="text-[10px] font-semibold">Mis Pedidos</span>
        </button>

        <button
          onClick={() => onNavigate('perfil')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all ${
            isProfile ? 'text-[#8a4853] font-bold scale-105' : 'text-[#524345] hover:text-[#8a4853]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="text-[10px] font-semibold">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
