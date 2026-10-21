import React, { useState } from 'react';
import { Product, SedeId } from '../types';
import { SEDES_DATA } from '../data/mockData';

interface AdminInventoryViewProps {
  products: Product[];
  currentSede: SedeId;
  onSelectSede: (sede: SedeId) => void;
  onUpdateStock: (productId: string, newStock: number, sede: SedeId) => void;
  onToast: (msg: string) => void;
}

export const AdminInventoryView: React.FC<AdminInventoryViewProps> = ({
  products,
  currentSede,
  onSelectSede,
  onUpdateStock,
  onToast,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferProduct, setTransferProduct] = useState<Product | null>(null);
  const [transferOrigin, setTransferOrigin] = useState<SedeId>('medellin');
  const [transferDest, setTransferDest] = useState<SedeId>('bogota');
  const [transferQty, setTransferQty] = useState(6);
  const [transferNotes, setTransferNotes] = useState('Reabastecimiento stock crítico para e-commerce');

  // Adjustment Modal State
  const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
  const [ajusteProduct, setAjusteProduct] = useState<Product | null>(null);
  const [ajusteType, setAjusteType] = useState<'ingreso' | 'merma' | 'conteo'>('ingreso');
  const [ajusteQty, setAjusteQty] = useState(5);
  const [ajusteReason, setAjusteReason] = useState('Recepción de lote por auditor de sede');

  // In-transit simulated transfers
  const [activeTransfers, setActiveTransfers] = useState([
    {
      id: '#TR-4089',
      origin: 'Medellín',
      dest: 'Bogotá',
      itemsDesc: '24 un. Cuidado Facial',
      eta: 'Hoy 4:30 PM',
      status: 'En Carretera',
    },
  ]);

  const sedeInfo = SEDES_DATA[currentSede];

  // Filtered inventory rows
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchEan = p.ean.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchEan) return false;
    }
    return true;
  });

  const handleOpenTransfer = (prod: Product, origin: SedeId = 'medellin', dest: SedeId = 'bogota') => {
    setTransferProduct(prod);
    setTransferOrigin(origin);
    setTransferDest(dest);
    setTransferQty(Math.min(6, Math.max(1, prod.stock[origin])));
    setIsTransferModalOpen(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferProduct) return;

    const availableAtOrigin = transferProduct.stock[transferOrigin];
    if (transferQty > availableAtOrigin) {
      onToast(`No hay suficientes unidades en origen (Disponibles: ${availableAtOrigin}).`);
      return;
    }

    // Deduct from origin, add to destination
    onUpdateStock(transferProduct.id, availableAtOrigin - transferQty, transferOrigin);
    onUpdateStock(transferProduct.id, transferProduct.stock[transferDest] + transferQty, transferDest);

    setActiveTransfers([
      {
        id: `#TR-${Math.floor(4000 + Math.random() * 900)}`,
        origin: SEDES_DATA[transferOrigin].name,
        dest: SEDES_DATA[transferDest].name,
        itemsDesc: `${transferQty} un. ${transferProduct.name}`,
        eta: 'Hoy 6:00 PM',
        status: 'En Tránsito',
      },
      ...activeTransfers,
    ]);

    setIsTransferModalOpen(false);
    onToast(`¡Traslado registrado! Se transfirieron ${transferQty} un. de ${transferProduct.sku} a ${SEDES_DATA[transferDest].name}.`);
  };

  const handleOpenAjuste = (prod: Product) => {
    setAjusteProduct(prod);
    setAjusteQty(5);
    setIsAjusteModalOpen(true);
  };

  const handleExecuteAjuste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ajusteProduct) return;

    const currentStock = ajusteProduct.stock[currentSede];
    let newStock = currentStock;

    if (ajusteType === 'ingreso') {
      newStock += ajusteQty;
    } else if (ajusteType === 'merma') {
      newStock = Math.max(0, currentStock - ajusteQty);
    } else {
      newStock = ajusteQty;
    }

    onUpdateStock(ajusteProduct.id, newStock, currentSede);
    setIsAjusteModalOpen(false);
    onToast(`Ajuste de inventario aplicado para ${ajusteProduct.sku} (${currentStock} -> ${newStock} un.).`);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-8">
      {/* 1. Top Context & Sede Switcher */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a4853]">
              Flujo Operativo 2.3
            </span>
            <span className="text-[#d7c1c3] text-xs">•</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#524345]">
              RF-03 & RF-04 PostgreSQL Live Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1A1D] tracking-tight">
            Inventario Multisede & Despacho
          </h1>
          <p className="text-xs sm:text-sm text-[#524345] max-w-2xl mt-1 leading-relaxed">
            Consolidación de existencias en tiempo real, control de mermas y balance logístico de SKUs cosméticos en Bogotá, Medellín y Cali.
          </p>
        </div>

        {/* Branch Switcher Tabs */}
        <div className="bg-[#fef0f1] p-1.5 rounded-full flex items-center gap-1 shadow-xs border border-[#ffd9dd] self-start xl:self-auto">
          <button
            type="button"
            onClick={() => onSelectSede('bogota')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${
              currentSede === 'bogota'
                ? 'bg-[#9c4048] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#1E1A1D]'
            }`}
          >
            Sede Principal Bogotá
          </button>
          <button
            type="button"
            onClick={() => onSelectSede('medellin')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${
              currentSede === 'medellin'
                ? 'bg-[#9c4048] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#1E1A1D]'
            }`}
          >
            Sede Medellín
          </button>
          <button
            type="button"
            onClick={() => onSelectSede('cali')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${
              currentSede === 'cali'
                ? 'bg-[#9c4048] text-white shadow-xs'
                : 'text-[#524345] hover:text-[#1E1A1D]'
            }`}
          >
            Sede Cali
          </button>
        </div>
      </section>

      {/* 2. Metric KPI Cards Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase text-[#524345] tracking-wider">
              Productos Activos
            </span>
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] flex items-center justify-center text-[#8a4853]">
              <span className="material-symbols-outlined text-lg">category</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1E1A1D]">142</span>
              <span className="text-xs text-[#524345]">SKUs</span>
            </div>
            <p className="text-[11px] text-[#2E6B4F] font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>100% categorizados</span>
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase text-[#524345] tracking-wider">
              Stock Consolidado
            </span>
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] flex items-center justify-center text-[#2e6743]">
              <span className="material-symbols-outlined text-lg">warehouse</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1E1A1D]">3.840</span>
              <span className="text-xs text-[#524345]">unidades</span>
            </div>
            <div className="w-full bg-[#f2e5e5] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#2e6743] h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase text-[#B46522] tracking-wider">
              Stock Crítico (&lt;5)
            </span>
            <div className="w-9 h-9 rounded-full bg-[#B46522]/15 flex items-center justify-center text-[#B46522]">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#B46522]">4</span>
              <span className="text-xs text-[#524345]">productos</span>
            </div>
            <p className="text-[11px] text-[#9E2A2B] font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Requiere reposición inmediata</span>
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase text-[#524345] tracking-wider">
              Despachos Hoy
            </span>
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] flex items-center justify-center text-[#9c4048]">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1E1A1D]">18</span>
              <span className="text-xs text-[#524345]">guías pendientes</span>
            </div>
            <p className="text-[11px] text-[#524345] mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#2E6B4F]">check_circle</span>
              <span>6 enviadas en {sedeInfo.name}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Action Bar & Search Filter */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-base">
              filter_alt
            </span>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar por nombre, categoría o SKU..."
              className="w-full pl-9 pr-4 py-2 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] placeholder:text-[#857374] focus:outline-none focus:bg-white border border-[#E8D8CF]"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#F4F3F0] px-3 py-2 rounded-xl border border-[#E8D8CF]">
            <span className="material-symbols-outlined text-xs text-[#857374]">tune</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#201a1b] focus:outline-none cursor-pointer"
            >
              <option value="all">Todas las Categorías</option>
              <option value="facial">Cuidado Facial</option>
              <option value="maquillaje">Maquillaje</option>
              <option value="serums">Sérums & Tratamientos</option>
              <option value="solar">Protección Solar</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() => handleOpenAjuste(products[0])}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#f2e5e5] hover:bg-[#eddfe0] text-[#1E1A1D] transition-colors flex items-center gap-1.5 whitespace-nowrap border border-[#d7c1c3]"
          >
            <span className="material-symbols-outlined text-sm text-[#8a4853]">edit_note</span>
            <span>Ajuste Rápido</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenTransfer(products[3] || products[0])}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#a6606b] hover:bg-[#8a4853] text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            <span>Registrar Traslado</span>
          </button>
          <button
            type="button"
            onClick={() => onToast('Abriendo formulario de catalogación y registro INVIMA para nuevo SKU.')}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#9c4048] hover:bg-[#77242d] text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Nuevo Producto</span>
          </button>
        </div>
      </section>

      {/* 4. Live Multi-Sede Inventory Table */}
      <section className="bg-white rounded-2xl shadow-xs border border-[#E8D8CF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F3F0] text-[#524345] text-[10px] font-bold uppercase tracking-wider border-b border-[#E8D8CF]">
                <th className="py-3.5 px-5">SKU / Identificador</th>
                <th className="py-3.5 px-5">Producto & Fórmula</th>
                <th className="py-3.5 px-5">Categoría</th>
                <th className="py-3.5 px-5">Stock en {sedeInfo.name}</th>
                <th className="py-3.5 px-5">Stock Global</th>
                <th className="py-3.5 px-5">Precio Venta</th>
                <th className="py-3.5 px-5">Estado Operativo</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2e5e5] text-xs text-[#201a1b]">
              {filteredProducts.map((prod) => {
                const stockInSede = prod.stock[currentSede] ?? 0;
                const totalStock = prod.stock.bogota + prod.stock.medellin + prod.stock.cali;
                const isOutOfStock = stockInSede === 0;
                const isLowStock = stockInSede > 0 && stockInSede <= prod.minRecommendedStock;

                return (
                  <tr
                    key={prod.id}
                    className={`hover:bg-[#fef0f1]/50 transition-colors ${
                      isOutOfStock ? 'bg-[#ba1a1a]/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#8a4853] block">{prod.sku}</span>
                      <span className="text-[10px] text-[#857374]">{prod.ean}</span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[#F4F3F0] border border-[#E8D8CF]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1E1A1D]">{prod.name}</span>
                          <span className="text-[10px] text-[#524345] truncate max-w-xs">{prod.volume} • {prod.formulaNote}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-[#f8ebeb] text-[10px] font-bold text-[#524345]">
                        {prod.categoryLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold text-sm ${
                            isOutOfStock
                              ? 'text-[#ba1a1a]'
                              : isLowStock
                              ? 'text-[#B46522]'
                              : 'text-[#1E1A1D]'
                          }`}
                        >
                          {stockInSede}
                        </span>
                        <span className="text-[10px] text-[#524345]">unidades</span>
                      </div>
                      <span className="text-[10px] text-[#857374] block">
                        {prod.aisleLocation || 'Pasillo A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#1E1A1D]">{totalStock} un.</span>
                      <span className="text-[10px] text-[#857374] block">
                        Bog:{prod.stock.bogota} | Med:{prod.stock.medellin} | Cal:{prod.stock.cali}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 font-bold">
                      ${new Intl.NumberFormat('es-CO').format(prod.price)}
                    </td>

                    <td className="py-3.5 px-5">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ba1a1a]/15 text-[#ba1a1a] text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                          Agotado en Sede
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B46522]/15 text-[#B46522] text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B46522]"></span>
                          Stock Bajo (&lt;{prod.minRecommendedStock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E6B4F]/15 text-[#2E6B4F] text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F]"></span>
                          Óptimo
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAjuste(prod)}
                          className="px-2.5 py-1 rounded-lg bg-[#f8ebeb] hover:bg-[#f2e5e5] text-[11px] font-bold text-[#1E1A1D] flex items-center gap-1"
                          title="Ajuste manual (+/-)"
                        >
                          <span className="material-symbols-outlined text-xs">tune</span>
                          <span>Ajustar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenTransfer(prod, currentSede === 'medellin' ? 'medellin' : 'medellin', currentSede)}
                          className="p-1 rounded-lg hover:bg-[#fef0f1] text-[#8a4853]"
                          title="Trasladar desde otra sede"
                        >
                          <span className="material-symbols-outlined text-base">swap_horiz</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Audit footer */}
        <div className="bg-[#FAF8F5] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#E8D8CF] text-[11px] text-[#524345]">
          <div className="flex items-center gap-2">
            <span className="uppercase text-[#857374] font-bold">Última conciliación PostgreSQL:</span>
            <span className="font-bold text-[#1E1A1D]">Hace 2 minutos (Transacción #TX-9041)</span>
          </div>
          <span className="font-semibold">Mostrando {filteredProducts.length} de 142 registros</span>
        </div>
      </section>

      {/* 5. Logistics Interconnection & Priority Dispatch Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a4853]">
                Topología Logística
              </span>
              <h2 className="text-base font-bold text-[#1E1A1D]">
                Interconexión entre Bodegas de Despacho
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2E6B4F]/10 text-[#2E6B4F]">
              Rutas Activas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-2">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8D8CF] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E1A1D]">Bogotá (Centro)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4F]"></span>
              </div>
              <p className="text-[11px] text-[#524345] my-2 leading-relaxed">
                Hub principal de distribución nacional y e-commerce.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E8D8CF]/60 text-xs">
                <span className="text-[#857374] text-[10px]">Capacidad: 84%</span>
                <span className="font-bold text-[#8a4853]">2.410 un.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8D8CF] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E1A1D]">Medellín (Poblado)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4F]"></span>
              </div>
              <p className="text-[11px] text-[#524345] my-2 leading-relaxed">
                Punto de reabastecimiento regional Antioquia y Eje Cafetero.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E8D8CF]/60 text-xs">
                <span className="text-[#857374] text-[10px]">Capacidad: 62%</span>
                <span className="font-bold text-[#8a4853]">980 un.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8D8CF] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E1A1D]">Cali (Granada)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#B46522]"></span>
              </div>
              <p className="text-[11px] text-[#524345] my-2 leading-relaxed">
                Bodega boutique y despacho express suroccidente.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E8D8CF]/60 text-xs">
                <span className="text-[#857374] text-[10px]">Capacidad: 45%</span>
                <span className="font-bold text-[#B46522]">450 un.</span>
              </div>
            </div>
          </div>

          {/* Transfers in transit */}
          <div className="flex flex-col gap-2 mt-3">
            {activeTransfers.map((tr) => (
              <div
                key={tr.id}
                className="bg-[#fef0f1] p-3 rounded-xl border border-[#ffd9dd] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#9c4048] text-xl">local_shipping</span>
                  <div>
                    <p className="font-bold text-[#1E1A1D]">
                      Traslado {tr.id}: {tr.origin} → {tr.dest}
                    </p>
                    <p className="text-[11px] text-[#524345]">
                      {tr.itemsDesc} • ETA: {tr.eta}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#8a4853] text-[10px] font-bold border border-[#ffd9dd]">
                  {tr.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Dispatch Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a4853]">
                Flujo RF-04
              </span>
              <span className="text-[10px] font-bold text-[#2E6B4F]">En Vivo</span>
            </div>
            <h2 className="text-base font-bold text-[#1E1A1D]">Pedidos por Despachar</h2>
            <p className="text-xs text-[#524345] mb-4">Cola prioritaria según corte horario en {sedeInfo.name}.</p>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E1A1D] block">Orden #ORD-8821</span>
                  <span className="text-[10px] text-[#524345]">Cliente: Mariana Restrepo (2 items)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#a6606b] text-white text-[10px] font-bold">
                  Picking
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E1A1D] block">Orden #ORD-8822</span>
                  <span className="text-[10px] text-[#524345]">Cliente: Carlos E. Villa (1 item)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f2e5e5] text-[#201a1b] text-[10px] font-bold border border-[#d7c1c3]">
                  Empaque
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E1A1D] block">Orden #ORD-8823</span>
                  <span className="text-[10px] text-[#524345]">Cliente: Salón Aura Belleza (8 items)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdada] text-[#40000b] text-[10px] font-bold">
                  Guía Lista
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToast('Enviando 18 guías generadas a cola de impresión térmica...')}
            className="w-full mt-4 py-2.5 rounded-full bg-[#F4F3F0] hover:bg-[#E8D8CF] text-xs font-bold text-[#1E1A1D] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Imprimir Lote de Guías (18)</span>
          </button>
        </div>
      </section>

      {/* Transfer Modal */}
      {isTransferModalOpen && transferProduct && (
        <div className="fixed inset-0 z-50 bg-[#1E1A1D]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 border border-[#E8D8CF] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2e5e5]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#a6606b] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">swap_horiz</span>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1A1D]">Registrar Traslado de Stock</h3>
                  <span className="text-[10px] text-[#857374]">Transacción ACID en PostgreSQL</span>
                </div>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-[#524345] hover:text-[#1E1A1D]">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF]">
                <p className="text-xs font-bold text-[#1E1A1D]">{transferProduct.name}</p>
                <p className="text-[10px] text-[#8a4853] font-bold">{transferProduct.sku}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#524345] mb-1">Sede de Origen</label>
                  <select
                    value={transferOrigin}
                    onChange={(e) => setTransferOrigin(e.target.value as SedeId)}
                    className="w-full bg-[#F4F3F0] p-2 rounded-xl text-xs font-medium border border-[#E8D8CF]"
                  >
                    <option value="medellin">Medellín (Disp: {transferProduct.stock.medellin} un.)</option>
                    <option value="bogota">Bogotá (Disp: {transferProduct.stock.bogota} un.)</option>
                    <option value="cali">Cali (Disp: {transferProduct.stock.cali} un.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#524345] mb-1">Sede de Destino</label>
                  <select
                    value={transferDest}
                    onChange={(e) => setTransferDest(e.target.value as SedeId)}
                    className="w-full bg-[#F4F3F0] p-2 rounded-xl text-xs font-medium border border-[#E8D8CF]"
                  >
                    <option value="bogota">Bogotá (Actual: {transferProduct.stock.bogota} un.)</option>
                    <option value="medellin">Medellín</option>
                    <option value="cali">Cali</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#524345]">Cantidad a Trasladar</label>
                  <span className="text-[10px] text-[#8a4853] font-bold">
                    Máx. disponible: {transferProduct.stock[transferOrigin]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTransferQty(Math.max(1, transferQty - 1))}
                    className="w-9 h-9 rounded-xl bg-[#F4F3F0] text-sm font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={transferQty}
                    onChange={(e) => setTransferQty(parseInt(e.target.value, 10) || 1)}
                    max={transferProduct.stock[transferOrigin]}
                    min={1}
                    className="flex-1 py-1.5 text-center bg-[#F4F3F0] rounded-xl font-bold text-sm border border-[#E8D8CF]"
                  />
                  <button
                    type="button"
                    onClick={() => setTransferQty(Math.min(transferProduct.stock[transferOrigin], transferQty + 1))}
                    className="w-9 h-9 rounded-xl bg-[#F4F3F0] text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Motivo del Traslado</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F3F0] rounded-xl text-xs font-medium border border-[#E8D8CF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#f2e5e5]">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#F4F3F0] text-xs font-bold text-[#524345]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold shadow-xs"
                >
                  Confirmar Traslado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {isAjusteModalOpen && ajusteProduct && (
        <div className="fixed inset-0 z-50 bg-[#1E1A1D]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 border border-[#E8D8CF] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2e5e5]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#f2e5e5] text-[#8a4853] flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">tune</span>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1A1D]">Ajuste Manual de Inventario</h3>
                  <span className="text-[10px] text-[#857374]">Auditoría en {sedeInfo.name}</span>
                </div>
              </div>
              <button onClick={() => setIsAjusteModalOpen(false)} className="text-[#524345] hover:text-[#1E1A1D]">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteAjuste} className="space-y-4">
              <div>
                <p className="text-xs font-bold text-[#1E1A1D]">{ajusteProduct.name}</p>
                <span className="text-[10px] text-[#8a4853] font-bold">
                  {ajusteProduct.sku} • Stock Actual: {ajusteProduct.stock[currentSede]} un.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Tipo de Movimiento</label>
                <select
                  value={ajusteType}
                  onChange={(e) => setAjusteType(e.target.value as any)}
                  className="w-full bg-[#F4F3F0] p-2.5 rounded-xl text-xs font-medium border border-[#E8D8CF]"
                >
                  <option value="ingreso">Entrada (+): Recepción de Proveedor / Fabricación</option>
                  <option value="merma">Salida (-): Merma / Deterioro / Lote Vencido</option>
                  <option value="conteo">Ajuste Directo: Corrección por Auditoría Física</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Cantidad del Movimiento</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAjusteQty(Math.max(1, ajusteQty - 1))}
                    className="w-9 h-9 rounded-xl bg-[#F4F3F0] text-sm font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={ajusteQty}
                    onChange={(e) => setAjusteQty(parseInt(e.target.value, 10) || 1)}
                    min={1}
                    className="flex-1 py-1.5 text-center bg-[#F4F3F0] rounded-xl font-bold text-sm border border-[#E8D8CF]"
                  />
                  <button
                    type="button"
                    onClick={() => setAjusteQty(ajusteQty + 1)}
                    className="w-9 h-9 rounded-xl bg-[#F4F3F0] text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Justificación del Registro</label>
                <input
                  type="text"
                  value={ajusteReason}
                  onChange={(e) => setAjusteReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F3F0] rounded-xl text-xs font-medium border border-[#E8D8CF]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#f2e5e5]">
                <button
                  type="button"
                  onClick={() => setIsAjusteModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#F4F3F0] text-xs font-bold text-[#524345]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold shadow-xs"
                >
                  Guardar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
