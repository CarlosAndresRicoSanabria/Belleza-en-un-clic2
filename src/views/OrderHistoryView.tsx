import React, { useState } from 'react';
import { Order, Product, ActiveView } from '../types';

interface OrderHistoryViewProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onNavigate: (view: ActiveView) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onReorder,
  onNavigate,
}) => {
  const [filterYear, setFilterYear] = useState<string>('all');
  const [searchInvoice, setSearchInvoice] = useState<string>('');
  const [ratings, setRatings] = useState<Record<string, number>>({
    '#BEC-2026-7712': 5,
  });
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const handleDownload = (invoiceNumber: string) => {
    setDownloadNotification(`Generando comprobante fiscal ${invoiceNumber} validado ante la DIAN en formato PDF & XML...`);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3500);
  };

  const filteredOrders = orders.filter((o) => {
    if (searchInvoice.trim()) {
      const q = searchInvoice.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchInvoice = o.dianInvoice.number.toLowerCase().includes(q);
      const matchCufe = o.dianInvoice.cufe.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.productName.toLowerCase().includes(q));
      if (!matchId && !matchInvoice && !matchCufe && !matchItem) return false;
    }

    if (filterYear === '2026') return o.date.includes('2026');
    if (filterYear === '2025') return o.date.includes('2025');
    return true;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-8">
      {/* Download Alert Toast */}
      {downloadNotification && (
        <div className="fixed top-24 right-6 z-50 bg-[#1E1A1D] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#E8D8CF]/20 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[#b4f1c3] text-lg">check_circle</span>
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Top Header & DIAN Invoicing Overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#fef0f1] border border-[#ffd9dd] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#8a4853] text-white rounded-xl shadow-xs">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-[#201a1b]">
              Historial de Facturación Electrónica DIAN
            </h1>
            <p className="text-xs text-[#524345]">
              Documentos tributarios oficiales con CUFE y firma digital válida en Colombia (Decreto 358)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-base">
              search
            </span>
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Buscar por #BEC, ítem o CUFE..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-full text-xs text-[#201a1b] focus:outline-none shadow-xs border border-[#E8D8CF]"
            />
          </div>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 bg-white rounded-full text-xs font-bold text-[#201a1b] focus:outline-none shadow-xs border border-[#E8D8CF] cursor-pointer"
          >
            <option value="all">Año 2025 - 2026</option>
            <option value="2026">Año 2026</option>
            <option value="2025">Año 2025</option>
          </select>
        </div>
      </div>

      {/* Quick year pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterYear('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterYear === 'all'
              ? 'bg-[#1E1A1D] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          Todos los Registros ({orders.length})
        </button>
        <button
          onClick={() => setFilterYear('2026')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterYear === '2026'
              ? 'bg-[#1E1A1D] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          2026
        </button>
        <button
          onClick={() => setFilterYear('2025')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterYear === '2025'
              ? 'bg-[#1E1A1D] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          2025 (1)
        </button>
        <button
          onClick={() => handleDownload('Certificado-Consolidado')}
          className="ml-auto px-3.5 py-1.5 rounded-full bg-[#b4f1c3] text-[#00210e] text-xs font-bold hover:bg-[#98d4a8] transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>DIAN CUFE 100% Validado</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-5">
        {filteredOrders.map((order) => {
          const currentRating = ratings[order.id] || 5;

          return (
            <article
              key={order.id}
              className="bg-white rounded-2xl shadow-xs border border-[#E8D8CF] overflow-hidden transition-all hover:shadow-md"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8D8CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-[#1E1A1D] tracking-tight">
                      {order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2E6B4F]/15 text-[#2E6B4F] text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F]"></span>
                      {order.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#524345] mt-0.5">
                    {order.date} • Sede: <strong>{order.sedeOrigin}</strong>
                  </p>
                </div>

                <div className="flex items-baseline sm:text-right gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#524345] tracking-wider block">
                    Total Pagado:
                  </span>
                  <span className="text-base sm:text-lg font-bold text-[#9c4048]">
                    ${new Intl.NumberFormat('es-CO').format(order.total)} COP
                  </span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="p-4 sm:p-5 flex flex-col gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover bg-[#F4F3F0] shrink-0 border border-[#E8D8CF]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1E1A1D] truncate">{item.productName}</h4>
                      <p className="text-[11px] text-[#524345]">
                        {item.quantity} unidad • {item.volumeOrGrams || 'Presentación oficial'} • Lote {item.lotCode}
                      </p>
                      <span className="text-xs text-[#8a4853] font-bold">
                        ${new Intl.NumberFormat('es-CO').format(item.price)} COP
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Electronic Invoice Bar */}
              <div className="mx-4 sm:mx-5 p-3 rounded-xl bg-[#fef0f1] border border-[#ffd9dd] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#2E6B4F]">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1E1A1D]">
                      Factura Electrónica #{order.dianInvoice.number}
                    </span>
                    <span className="text-[10px] text-[#524345] font-mono">
                      CUFE: {order.dianInvoice.cufe.slice(0, 20)}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#2E6B4F]/15 text-[#2E6B4F] px-2 py-0.5 rounded-full font-bold">
                    Validada DIAN
                  </span>
                  <span className="text-[10px] text-[#2E6B4F] font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">verified</span> XML Emitido
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 sm:p-5 pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Rating touchpoint */}
                <div className="flex items-center gap-2 text-xs text-[#524345]">
                  <span>¿Qué tal tu experiencia?</span>
                  <div className="flex items-center gap-0.5 text-[#E5A93C]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatings((prev) => ({ ...prev, [order.id]: star }))}
                        className="hover:scale-125 transition-transform"
                      >
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: star <= currentRating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                    <span className="text-[11px] font-bold text-[#1E1A1D] ml-1">
                      {currentRating}.0
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleDownload(order.dianInvoice.number)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#f8ebeb] hover:bg-[#f2e5e5] text-[#1E1A1D] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#d7c1c3]"
                  >
                    <span className="material-symbols-outlined text-base text-[#8a4853]">download</span>
                    <span>Descargar DIAN (PDF & XML)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#8a4853] hover:bg-[#9c4048] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-base">repeat</span>
                    <span>Volver a Comprar</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Legal Guarantee Banner */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8D8CF] flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#fef0f1] flex items-center justify-center shrink-0 text-[#8a4853]">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1E1A1D]">Respaldo Tributario DIAN Colombia</h4>
            <p className="text-xs text-[#524345] mt-1 leading-relaxed">
              Todas tus compras en Belleza en un Clic cuentan con factura electrónica conforme al{' '}
              <strong>Decreto 358</strong> y <strong>Resolución 000042 de la DIAN</strong>. Tus archivos XML y PDF quedan archivados en tu cuenta por 5 años con plena validez fiscal para deducciones tributarias de personas naturales y jurídicas.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8D8CF]/80">
          <button
            type="button"
            onClick={() => handleDownload('Consolidado-Anual-2025-2026')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-[#fef0f1] text-[#1E1A1D] text-xs font-bold shadow-xs border border-[#E8D8CF] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base text-[#2E6B4F]">folder_zip</span>
            <span>Descargar Certificado Anual Consolidado 2025 - 2026</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('pqrs')}
            className="text-xs font-bold text-[#8a4853] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">help_center</span>
            <span>PQRS o Aclaración de Facturas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
