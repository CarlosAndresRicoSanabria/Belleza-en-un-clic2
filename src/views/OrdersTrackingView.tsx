import React, { useState } from 'react';
import { Order, ActiveView } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface OrdersTrackingViewProps {
  order: Order;
  onNavigate: (view: ActiveView) => void;
  onOpenPQRSForOrder?: (orderId: string) => void;
}

export const OrdersTrackingView: React.FC<OrdersTrackingViewProps> = ({
  order,
  onNavigate,
  onOpenPQRSForOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'activos' | 'historial' | 'direcciones' | 'wishlist'>('activos');
  const [copiedGuide, setCopiedGuide] = useState(false);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [pqrsType, setPqrsType] = useState('Pregunta sobre estado de Despacho');
  const [pqrsMessage, setPqrsMessage] = useState('');
  const [pqrsSubmitted, setPqrsSubmitted] = useState(false);
  const [isInvoiceDownloaded, setIsInvoiceDownloaded] = useState(false);

  const handleCopyGuide = () => {
    navigator.clipboard?.writeText(order.trackingNumber.replace('#', '')).catch(() => {});
    setCopiedGuide(true);
    setTimeout(() => setCopiedGuide(false), 2000);
  };

  const handlePqrsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pqrsMessage.trim()) return;
    setPqrsSubmitted(true);
  };

  const handleDownloadInvoice = () => {
    setIsInvoiceDownloaded(true);
    setTimeout(() => setIsInvoiceDownloaded(false), 3000);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-8">
      {/* 1. Header VIP Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#fef0f1] p-6 lg:p-8 shadow-xs border border-[#ffd9dd]">
        <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full bg-[#ffdada]/40 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={CURRENT_USER.avatarUrl}
                alt="Sofía Gómez"
                className="w-18 h-18 lg:w-22 lg:h-22 rounded-full object-cover shadow-md ring-4 ring-white"
              />
              <span className="absolute bottom-0 right-0 bg-[#8a4853] text-white rounded-full p-1 shadow-xs flex items-center justify-center">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#201a1b]">¡Hola, Sofía Gómez!</h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8a4853] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stars
                  </span>
                  Glow VIP
                </span>
              </div>
              <p className="text-xs text-[#524345]">
                Miembro selecto desde Febrero 2024 • ID Cliente: {CURRENT_USER.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex flex-col p-3.5 rounded-xl bg-white shadow-xs border border-[#E8D8CF]">
              <span className="text-[10px] text-[#524345] uppercase font-bold tracking-wider">Puntos Glow</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-[#8a4853]">2.450</span>
                <span className="text-[10px] text-[#2E6B4F] font-bold">+320 hoy</span>
              </div>
              <span className="text-[10px] text-[#524345]">Equivale a $24.500 COP</span>
            </div>

            <div className="flex flex-col p-3.5 rounded-xl bg-white shadow-xs border border-[#E8D8CF]">
              <span className="text-[10px] text-[#524345] uppercase font-bold tracking-wider">Sede Favorita</span>
              <div className="flex items-center gap-1 mt-1 text-[#201a1b] font-bold text-sm truncate">
                <span className="material-symbols-outlined text-base text-[#9c4048]">storefront</span>
                <span>Sede Bogotá</span>
              </div>
              <span className="text-[10px] text-[#2E6B4F] font-bold">Despacho exprés 3h</span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col p-3.5 rounded-xl bg-white shadow-xs border border-[#E8D8CF]">
              <span className="text-[10px] text-[#524345] uppercase font-bold tracking-wider">Garantías & DIAN</span>
              <div className="flex items-center gap-1 mt-1 font-bold text-sm text-[#201a1b]">
                <span className="material-symbols-outlined text-base text-[#2e6743]">inventory_2</span>
                <span>100% Legal</span>
              </div>
              <span className="text-[10px] text-[#524345]">Facturas al día con CUFE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Tab Buttons */}
      <div className="flex overflow-x-auto no-scrollbar items-center gap-2 pb-1">
        <button
          onClick={() => setActiveTab('activos')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
            activeTab === 'activos'
              ? 'bg-[#8a4853] text-white'
              : 'bg-[#f8ebeb] text-[#524345] hover:bg-[#f2e5e5]'
          }`}
        >
          Mis Pedidos Activos (1)
        </button>
        <button
          onClick={() => onNavigate('historial')}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#f8ebeb] text-[#524345] hover:bg-[#f2e5e5] transition-all"
        >
          Historial de Compras & Facturas DIAN (4)
        </button>
        <button
          onClick={() => onNavigate('direcciones')}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#f8ebeb] text-[#524345] hover:bg-[#f2e5e5] transition-all"
        >
          Direcciones Guardadas (2)
        </button>
        <button
          onClick={() => onNavigate('perfil')}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#f8ebeb] text-[#524345] hover:bg-[#f2e5e5] transition-all"
        >
          Puntos & Recompensas Glow VIP
        </button>
      </div>

      {/* 3. Active Tracking Card */}
      <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-xs border border-[#E8D8CF] flex flex-col gap-6">
        {/* Order Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 gap-4 border-b border-[#f2e5e5]">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-lg sm:text-xl font-bold text-[#201a1b]">{order.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#b4f1c3] text-[#00210e] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e6743] animate-ping"></span>
                {order.statusLabel}
              </span>
            </div>
            <p className="text-xs text-[#524345]">
              Comprado {order.date} • Total Pagado:{' '}
              <strong className="text-[#201a1b] font-bold text-sm">
                ${new Intl.NumberFormat('es-CO').format(order.total)} COP
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f2e5e5] hover:bg-[#eddfe0] text-[#201a1b] text-xs font-bold transition-all shadow-xs border border-[#d7c1c3]/50"
            >
              <span className="material-symbols-outlined text-base text-[#8a4853]">receipt_long</span>
              <span>{isInvoiceDownloaded ? '¡Descargado PDF & XML!' : 'Descargar Factura DIAN'}</span>
            </button>
            <button
              onClick={() => onOpenPQRSForOrder?.(order.id) || onNavigate('pqrs')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#9c4048] hover:bg-[#8a4853] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">support_agent</span>
              <span>Ayuda con este despacho</span>
            </button>
          </div>
        </div>

        {/* Origin / Courier / ETA Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fef0f1] border border-[#ffd9dd]">
            <span className="material-symbols-outlined text-[#8a4853] text-2xl shrink-0">warehouse</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#524345] tracking-wider">
                Sede de Origen
              </span>
              <span className="text-xs font-bold text-[#201a1b]">{order.sedeOrigin}</span>
              <span className="text-[11px] text-[#2E6B4F] font-semibold mt-0.5">
                Stock validado & empaquetado térmico
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fef0f1] border border-[#ffd9dd]">
            <span className="material-symbols-outlined text-[#9c4048] text-2xl shrink-0">local_shipping</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#524345] tracking-wider">
                Transportadora & Guía
              </span>
              <span className="text-xs font-bold text-[#201a1b]">{order.courierName}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-mono font-bold text-[#8a4853]">
                  {order.trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyGuide}
                  className="text-[#524345] hover:text-[#201a1b]"
                  title="Copiar guía"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedGuide ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fef0f1] border border-[#ffd9dd]">
            <span className="material-symbols-outlined text-[#2e6743] text-2xl shrink-0">schedule</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#524345] tracking-wider">
                Ventana Estimada de Entrega
              </span>
              <span className="text-xs font-bold text-[#201a1b]">{order.estimatedWindow}</span>
              <span className="text-[11px] text-[#524345] truncate mt-0.5">
                {order.deliveryAddress}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Live GPS Satelital Map with Courier Profile */}
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8D8CF] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4F] animate-ping"></span>
              <span className="text-xs font-bold text-[#201a1b]">Ruta Satelital en Vivo (GPS)</span>
            </div>
            <span className="text-[10px] text-[#524345] font-semibold bg-white px-2 py-0.5 rounded-full border border-[#E8D8CF]">
              Actualizado hace 2 min • Conexión Estable
            </span>
          </div>

          {/* Interactive Graphic Vector Map */}
          <div className="relative w-full h-56 sm:h-64 bg-[#F4F3F0] rounded-xl overflow-hidden border border-[#E8D8CF] flex items-center justify-center">
            {/* Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gpsGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#D8A49B" strokeWidth="0.75" strokeDasharray="2,2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gpsGrid)" />
            </svg>

            {/* Simulated urban city blocks */}
            <div className="absolute top-4 left-6 w-20 h-14 rounded bg-[#f2e5e5]/80"></div>
            <div className="absolute bottom-6 left-12 w-28 h-12 rounded bg-[#f2e5e5]/70"></div>
            <div className="absolute top-6 right-8 w-32 h-20 rounded bg-[#f2e5e5]/80"></div>
            <div className="absolute bottom-4 right-16 w-16 h-16 rounded bg-[#f2e5e5]/60"></div>

            {/* Road trajectory */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 200" fill="none" preserveAspectRatio="none">
              <path
                d="M 50 160 C 110 160, 140 100, 200 100"
                stroke="#2E6B4F"
                strokeWidth="4"
                strokeDasharray="6,4"
                strokeLinecap="round"
              />
              <path
                d="M 200 100 C 250 100, 280 60, 310 45"
                stroke="#8A4853"
                strokeWidth="4"
                strokeDasharray="4,6"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>

            {/* Warehouse Origin Marker */}
            <div className="absolute left-6 bottom-4 sm:bottom-6 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white text-[#8a4853] shadow-md flex items-center justify-center border border-[#E8D8CF]">
                <span className="material-symbols-outlined text-base">store</span>
              </div>
              <span className="mt-1 px-2 py-0.5 rounded bg-white text-[#201a1b] text-[10px] font-bold shadow-xs border border-[#E8D8CF]">
                Hub Calle 85
              </span>
            </div>

            {/* Courier in Motion */}
            <div className="absolute left-[54%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-9 h-9 rounded-full bg-[#8a4853]/25 animate-ping"></span>
                <div className="w-9 h-9 rounded-full bg-[#8a4853] text-white shadow-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">two_wheeler</span>
                </div>
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-[#1E1A1D] text-white text-[10px] font-bold shadow-md">
                Móvil #42
              </span>
            </div>

            {/* Customer Destination Marker */}
            <div className="absolute right-6 top-4 sm:top-6 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#9c4048] text-white shadow-md flex items-center justify-center">
                <span className="material-symbols-outlined text-base">home</span>
              </div>
              <span className="mt-1 px-2 py-0.5 rounded bg-white text-[#9c4048] text-[10px] font-bold shadow-xs border border-[#E8D8CF]">
                Tu Ubicación
              </span>
            </div>
          </div>

          {/* Assigned Courier Driver Card */}
          {order.courierDriver && (
            <div className="bg-white rounded-xl p-3.5 flex items-center justify-between gap-3 border border-[#E8D8CF]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={order.courierDriver.avatarUrl}
                    alt={order.courierDriver.name}
                    className="w-12 h-12 rounded-full object-cover shadow-xs ring-2 ring-[#ffd9dd]"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2E6B4F] text-white text-[9px] font-bold flex items-center justify-center">
                    ✓
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1E1A1D] truncate">{order.courierDriver.name}</h4>
                  <p className="text-[11px] text-[#524345] truncate">{order.courierDriver.vehicle}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-[#9c4048] font-bold">
                    <span className="material-symbols-outlined text-xs text-[#E5A93C]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span>{order.courierDriver.rating}</span>
                    <span className="text-[10px] text-[#857374] font-normal">
                      ({order.courierDriver.completedTrips} entregas en Bogotá)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${order.courierDriver.phone}`}
                  className="w-9 h-9 rounded-full bg-[#fef0f1] text-[#8a4853] hover:bg-[#8a4853] hover:text-white transition-colors flex items-center justify-center shadow-xs"
                  title="Llamar al repartidor"
                >
                  <span className="material-symbols-outlined text-base">phone</span>
                </a>
                <a
                  href="https://wa.me/573128492034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2E6B4F] text-white hover:opacity-90 transition-opacity flex items-center justify-center shadow-xs"
                  title="Escribir por WhatsApp"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 5. Stepper: Bitácora de Trazabilidad */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#201a1b]">Bitácora de Trazabilidad en Tiempo Real</h3>
            <span className="text-[10px] uppercase font-bold text-[#2E6B4F] bg-[#2E6B4F]/10 px-2 py-0.5 rounded-full">
              Certificación INVIMA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fef0f1] border border-[#ffd9dd]">
              <div className="w-8 h-8 rounded-full bg-[#2E6B4F] text-white flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-outlined text-base font-bold">check</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#201a1b]">1. Pago Confirmado</span>
                <span className="text-[11px] text-[#524345]">Aprobado vía PSE • 11:24 AM</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fef0f1] border border-[#ffd9dd]">
              <div className="w-8 h-8 rounded-full bg-[#2E6B4F] text-white flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-outlined text-base font-bold">check</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#201a1b]">2. Preparación Bodega</span>
                <span className="text-[11px] text-[#524345]">Control Lote INVIMA • 12:05 PM</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#ffdada] border border-[#fe8d93] ring-2 ring-[#9c4048]/20">
              <div className="w-8 h-8 rounded-full bg-[#9c4048] text-white flex items-center justify-center shadow-xs shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-base">local_shipping</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#9c4048]">3. En Camino (Ruta)</span>
                <span className="text-[11px] text-[#77242d] font-semibold">
                  Guía activa • 1:40 PM (21°C)
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F4F3F0] opacity-70 border border-[#E8D8CF]">
              <div className="w-8 h-8 rounded-full bg-white text-[#857374] flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-outlined text-base">home_pin</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#857374]">4. Entregado</span>
                <span className="text-[11px] text-[#857374]">Firma en portería pendiente</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Package Line Items Breakdown */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8D8CF] flex flex-col gap-4">
          <span className="text-xs font-bold text-[#201a1b] uppercase tracking-wider">
            Artículos en este paquete ({order.items.length} productos)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 bg-white p-3.5 rounded-xl border border-[#E8D8CF]/70 shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-14 h-14 rounded-lg object-cover bg-[#F4F3F0] shrink-0 border border-[#E8D8CF]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#8a4853] uppercase font-bold tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#201a1b] truncate">{item.productName}</h4>
                  <p className="text-[11px] text-[#524345]">
                    Cant: {item.quantity} • Lote {item.lotCode} • ${new Intl.NumberFormat('es-CO').format(item.price)} COP
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick WhatsApp alerts switch */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E8D8CF]/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2E6B4F] text-lg">notifications_active</span>
              <span className="text-[#201a1b] font-semibold">Notificaciones en tiempo real por WhatsApp</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#d7c1c3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2E6B4F]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 7. Dedicated Customer Service & Instant PQRS Module */}
      <div className="rounded-2xl bg-[#fef0f1] p-6 lg:p-8 shadow-xs border border-[#ffd9dd] flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 lg:w-5/12">
          <div className="flex items-center gap-2 text-[#8a4853] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">support</span>
            <span>Atención Especializada</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[#201a1b] leading-snug">
            ¿Tienes alguna duda sobre tu despacho o factura DIAN?
          </h2>

          <p className="text-xs text-[#524345] leading-relaxed">
            Nuestro equipo de logística y asesoría dermatológica responde tus solicitudes en menos de 4 horas hábiles. Radica tu solicitud conforme a las normas colombianas de protección al consumidor (SIC).
          </p>

          <div className="flex flex-col gap-2.5 pt-2 text-xs text-[#201a1b]">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#8a4853] shadow-xs">
                <span className="material-symbols-outlined text-sm">chat</span>
              </span>
              <span>Línea WhatsApp Exclusiva VIP: <strong>+57 320 900 1122</strong></span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#2e6743] shadow-xs">
                <span className="material-symbols-outlined text-sm">verified_user</span>
              </span>
              <span>Garantía total de devolución y cambio en sede física</span>
            </div>
          </div>
        </div>

        {/* PQRS Form Box */}
        <div className="flex-1 bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-[#E8D8CF] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#201a1b]">Radicar Solicitud / PQRS Inmediata</span>
            <span className="text-[10px] text-[#2E6B4F] bg-[#2E6B4F]/10 px-2 py-0.5 rounded-full font-bold">
              Respuesta Promedio: 2h
            </span>
          </div>

          {pqrsSubmitted ? (
            <div className="p-4 rounded-xl bg-[#2E6B4F]/10 border border-[#2E6B4F]/20 text-xs text-[#2E6B4F] flex flex-col gap-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                <span>¡Solicitud Radicada Exitosamente!</span>
              </div>
              <p className="text-[#201a1b]">
                Tu trámite quedó radicado bajo el número oficial <strong>#PQRS-2026-0814</strong>. Se ha enviado constancia a tu correo {CURRENT_USER.email} y al WhatsApp del pedido.
              </p>
              <button
                type="button"
                onClick={() => setPqrsSubmitted(false)}
                className="self-start text-xs font-bold underline mt-1"
              >
                Radicar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handlePqrsSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#524345]">Tipo de Solicitud</label>
                  <select
                    value={pqrsType}
                    onChange={(e) => setPqrsType(e.target.value)}
                    className="p-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium border border-[#E8D8CF]"
                  >
                    <option>Pregunta sobre estado de Despacho</option>
                    <option>Aclaración Factura Electrónica DIAN</option>
                    <option>Garantía de Producto / Avería INVIMA</option>
                    <option>Cambio de Dirección de Envío</option>
                    <option>Felicitación o Sugerencia</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#524345]">Número de Pedido Asociado</label>
                  <input
                    type="text"
                    value={order.id}
                    readOnly
                    className="p-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-mono font-bold border border-[#E8D8CF]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#524345]">Detalle de tu mensaje o inquietud</label>
                <textarea
                  rows={3}
                  value={pqrsMessage}
                  onChange={(e) => setPqrsMessage(e.target.value)}
                  placeholder="Por favor detalla tu novedad con respecto al paquete o solicitud tributaria..."
                  className="p-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] focus:bg-white border border-[#E8D8CF] resize-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#524345]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#9c4048]" />
                  <span>Acepto notificación vía WhatsApp y Correo Registrado</span>
                </label>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
