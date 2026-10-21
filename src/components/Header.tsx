import React from 'react';
import { SedeId, Role, ActiveView } from '../types';
import { SEDES_DATA, CURRENT_USER } from '../data/mockData';

interface HeaderProps {
  currentSede: SedeId;
  onSelectSede: (sede: SedeId) => void;
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  cartCount: number;
  onToggleCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isMobileDeviceView: boolean;
  onToggleMobileDeviceView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSede,
  onSelectSede,
  currentRole,
  onSelectRole,
  activeView,
  onNavigate,
  cartCount,
  onToggleCart,
  searchQuery,
  onSearchChange,
  isMobileDeviceView,
  onToggleMobileDeviceView,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f7]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(106,26,36,0.04)] border-b border-[#eddfe0]/60">
      {/* Top Banner */}
      <div className="bg-[#9c4048] text-white px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[15px]">local_shipping</span>
        <span>
          Envíos nacionales gratis en compras superiores a $150.000 COP • Entregas el mismo día en sede seleccionada
        </span>
      </div>

      {/* Main Navbar */}
      <div className="h-16 md:h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand & Sede */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <button
            onClick={() => onNavigate('catalogo')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDINIssPX-rdoZqYVUlTqTwETFVkF_JrPO0ORbkl0h78L16XX0jml8EzErU9yvCCTb-j-SzpKIYhRQ9OvriBHYH_AowdOCT1gd1GIRgpSy5GQQoH7Pw7954dtLe_swr6ydtQvVCf7j8lWwiaMNC81HHWmjepDGGCI1kimpzXRYzH9zYOPw-PloqGwkkXXDxo3oiS5CmNXtUH5qTP2D96HUAHN71o2pwRKBIeFVj4bmqIr6eZw3PYj_B"
              alt="Belleza en un Clic Logo"
              className="h-8 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-[1.125rem] md:text-[1.35rem] font-bold text-[#8a4853] tracking-tight leading-tight">
                Belleza en un Clic
              </span>
              <span className="text-[10px] text-[#524345] uppercase tracking-wider font-semibold hidden sm:inline">
                Dermocosmética Certificada
              </span>
            </div>
          </button>

          {/* Sede Selector */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#fef0f1] hover:bg-[#f8ebeb] transition-colors rounded-full border border-[#d7c1c3]/50">
            <span className="material-symbols-outlined text-[#9c4048] text-base">storefront</span>
            <select
              value={currentSede}
              onChange={(e) => onSelectSede(e.target.value as SedeId)}
              aria-label="Seleccionar Sede Activa"
              className="bg-transparent text-xs font-semibold text-[#201a1b] focus:outline-none cursor-pointer"
            >
              <option value="bogota">Sede Principal - Bogotá</option>
              <option value="medellin">Sede Medellín (Poblado)</option>
              <option value="cali">Sede Cali (Granada)</option>
            </select>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-lg">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por cosmético, SKU o marca..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-full text-xs text-[#201a1b] placeholder:text-[#857374] focus:outline-none ring-1 ring-[#E8D8CF] focus:ring-[#8a4853] shadow-xs"
            />
          </div>
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Viewport device mode simulator toggle */}
          <button
            onClick={onToggleMobileDeviceView}
            title={isMobileDeviceView ? "Ver pantalla completa Desktop" : "Simular vista en Teléfono Móvil"}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              isMobileDeviceView
                ? 'bg-[#8a4853] text-white border-[#8a4853] shadow-xs'
                : 'bg-white text-[#524345] border-[#d7c1c3] hover:bg-[#fef0f1]'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isMobileDeviceView ? 'desktop_windows' : 'smartphone'}
            </span>
            <span>{isMobileDeviceView ? 'Modo Pantalla Completa' : 'Vista Móvil Táctil'}</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f8ebeb] rounded-full border border-[#d7c1c3]/40">
            <span className="material-symbols-outlined text-[#857374] text-sm">manage_accounts</span>
            <select
              value={currentRole}
              onChange={(e) => onSelectRole(e.target.value as Role)}
              aria-label="Rol de visualización"
              className="bg-transparent text-[11px] font-bold text-[#201a1b] focus:outline-none cursor-pointer"
            >
              <option value="cliente">Rol: Cliente</option>
              <option value="admin">Rol: Admin Operativo</option>
              <option value="empleado">Rol: Empleado Sede</option>
            </select>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={onToggleCart}
            aria-label="Ver carrito"
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-[#f8ebeb] transition-colors text-[#201a1b]"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[#9c4048] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Profile preview */}
          <button
            onClick={() => onNavigate('perfil')}
            className="flex items-center gap-2 pl-1 sm:pl-2 hover:opacity-90 transition-opacity text-left"
          >
            <img
              src={CURRENT_USER.avatarUrl}
              alt="Perfil"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ffd9dd]"
            />
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-bold text-[#201a1b] leading-none">
                {CURRENT_USER.firstName} G.
              </span>
              <span className="text-[10px] text-[#8a4853] font-semibold leading-none mt-0.5">
                VIP Oro
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Subnav links (Desktop) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-2.5 hidden md:block">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onNavigate('catalogo')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'catalogo'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => onNavigate('cuidado-facial')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'cuidado-facial'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Cuidado Facial
          </button>
          <button
            onClick={() => onNavigate('maquillaje')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'maquillaje'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Maquillaje
          </button>
          <button
            onClick={() => onNavigate('ofertas')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'ofertas'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Ofertas
          </button>
          <button
            onClick={() => onNavigate('mis-pedidos')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'mis-pedidos'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Trazabilidad Satelital
          </button>
          <button
            onClick={() => onNavigate('historial')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'historial'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Facturas DIAN & Historial
          </button>
          <button
            onClick={() => onNavigate('reviews')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'reviews'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Opiniones & Piel Real
          </button>
          <button
            onClick={() => onNavigate('direcciones')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'direcciones'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Direcciones & Sedes
          </button>
          <button
            onClick={() => onNavigate('pqrs')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeView === 'pqrs'
                ? 'bg-[#a6606b] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#201a1b] hover:bg-[#fef0f1]'
            }`}
          >
            Garantía INVIMA / PQRS
          </button>

          {currentRole === 'admin' && (
            <button
              onClick={() => onNavigate('admin-inventario')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full ml-auto flex items-center gap-1.5 ${
                activeView === 'admin-inventario'
                  ? 'bg-[#9c4048] text-white shadow-sm'
                  : 'bg-[#ffd9dd] text-[#70343e] hover:bg-[#ffb2bc]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              <span>Panel Operativo Logístico</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
