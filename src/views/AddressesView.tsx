import React, { useState } from 'react';
import { Address, SedeId } from '../types';
import { USER_ADDRESSES, SEDES_DATA } from '../data/mockData';

interface AddressesViewProps {
  currentSede: SedeId;
  onSelectSede: (sede: SedeId) => void;
  onToast: (msg: string) => void;
}

export const AddressesView: React.FC<AddressesViewProps> = ({
  currentSede,
  onSelectSede,
  onToast,
}) => {
  const [addresses, setAddresses] = useState<Address[]>(USER_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);

  // New address form
  const [newCity, setNewCity] = useState('Bogotá D.C., Cundinamarca');
  const [newAddress, setNewAddress] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newType, setNewType] = useState<'casa' | 'trabajo' | 'consultorio'>('casa');
  const [newNotes, setNewNotes] = useState('');

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    onToast('Dirección predeterminada actualizada para tus despachos.');
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      onToast('Debes mantener al menos una dirección registrada.');
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    onToast('Dirección eliminada de tu libreta.');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      onToast('Por favor ingresa la dirección con nomenclatura.');
      return;
    }

    const created: Address = {
      id: `addr-${Date.now()}`,
      name: newType === 'casa' ? 'Casa / Residencia' : newType === 'trabajo' ? 'Trabajo / Oficina' : 'Consultorio',
      phone: '+57 312 849 2034',
      addressLine: newAddress,
      city: newCity,
      neighborhood: newNeighborhood || 'Zona Urbana',
      notes: newNotes || 'Entregar en recepción o portería',
      isDefault: false,
      type: newType,
      nearestSede: 'Sede Bogotá Calle 85',
      distanceKm: '2.5 km',
    };

    setAddresses([...addresses, created]);
    setNewAddress('');
    setNewNeighborhood('');
    setNewNotes('');
    setShowAddForm(false);
    onToast('¡Nueva dirección guardada con cobertura express confirmada!');
  };

  const handleGpsLocate = () => {
    onToast('GPS Sincronizado: Coordenadas fijadas en Chicó Norte, Bogotá (Cobertura 100% Express).');
  };

  const sedeInfo = SEDES_DATA[currentSede];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ffd9dd] to-[#fef0f1] p-4 sm:p-5 shadow-xs border border-[#ffd9dd]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white text-[#8a4853] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm font-bold text-[#201a1b]">Envío Dermoprotegido Activo</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b4f1c3] text-[#00210e]">
                COBERTURA 100% NACIONAL
              </span>
            </div>
            <p className="text-xs text-[#524345] mt-0.5 leading-relaxed">
              Tus cosméticos viajan en empaque termolábil certificado con control térmico para activos limpios en Bogotá, Medellín y Cali.
            </p>
          </div>
        </div>
      </div>

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E1A1D]">Direcciones de Entrega</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f8ebeb] text-[#8a4853]">
              {addresses.length} REGISTRADAS
            </span>
          </div>
          <p className="text-xs text-[#524345] mt-1">
            Lugares habituales y despacho express para tus compras cosméticas
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#8a4853] hover:bg-[#9c4048] text-white text-xs font-bold transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add_location_alt</span>
          <span>Agregar Nueva Dirección</span>
        </button>
      </div>

      {/* Fast GPS Autofill Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E8D8CF] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#ffdada] text-[#9c4048] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              my_location
            </span>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#1E1A1D] truncate">Usar mi ubicación actual</h4>
            <p className="text-[11px] text-[#524345] truncate">Fijar coordenadas exactas con GPS en tu sede</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGpsLocate}
          className="px-4 py-2 rounded-full bg-[#fef0f1] hover:bg-[#ffd9dd] text-[#9c4048] text-xs font-bold transition-colors shrink-0"
        >
          Localizar
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.map((addr) => (
          <article
            key={addr.id}
            className={`rounded-2xl p-5 bg-white shadow-xs border flex flex-col justify-between transition-all ${
              addr.isDefault ? 'border-[#8a4853] ring-1 ring-[#8a4853]/30' : 'border-[#E8D8CF]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">
                      {addr.type === 'casa' ? 'home' : 'apartment'}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-[#1E1A1D]">{addr.name}</span>
                </div>

                {addr.isDefault ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8a4853] text-white text-[10px] font-bold uppercase tracking-wider">
                    Predeterminada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#F4F3F0] text-[#524345] text-[10px] font-semibold uppercase">
                    Secundaria
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-[#1E1A1D]">{addr.addressLine}</p>
                <p className="text-xs text-[#524345]">{addr.neighborhood}, {addr.city}</p>
                <p className="text-xs text-[#857374]">{addr.phone}</p>
              </div>

              <div className="mt-3.5 rounded-xl bg-[#fef0f1] p-3 text-xs text-[#524345] border border-[#ffd9dd]">
                <span className="font-bold text-[#8a4853]">Instrucción:</span> {addr.notes}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FAF8F5] p-2.5 border border-[#E8D8CF]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#2E6B4F] shrink-0"></span>
                  <p className="text-[11px] text-[#2E6B4F] font-semibold truncate">
                    {addr.nearestSede} • Cobertura Express &lt; 2h
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#524345] px-2 py-0.5 bg-white rounded shadow-xs">
                  {addr.distanceKm}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f2e5e5] flex items-center justify-between">
              {addr.isDefault ? (
                <span className="text-xs font-bold text-[#8a4853] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Activa para compras</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-bold text-[#8a4853] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">radio_button_unchecked</span>
                  <span>Fijar como Principal</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToast('Editando dirección...')}
                  className="px-3 py-1 rounded-full text-xs text-[#524345] hover:bg-[#fef0f1]"
                >
                  Editar
                </button>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="px-3 py-1 rounded-full text-xs text-[#ba1a1a] hover:bg-[#ba1a1a]/10"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Boutique Pickup Store (Click & Collect) Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E8D8CF] flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2e6743]/10 text-[#2e6743] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#2e6743] tracking-wider">
                Punto de Retiro Preferido
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#1E1A1D]">{sedeInfo.fullName}</h3>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#b4f1c3] text-[#00210e]">
            RETIRO GRATIS
          </span>
        </div>

        <div className="space-y-1 text-xs text-[#524345]">
          <p className="font-semibold text-[#1E1A1D]">{sedeInfo.address}</p>
          <p>{sedeInfo.hours}</p>
          <p className="text-[#2e6743] font-semibold">
            • Tu pedido queda listo para reclamar en taquilla preferencial de 2 a 4 horas.
          </p>
        </div>

        {/* Storefront Image */}
        <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-xl border border-[#E8D8CF]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe7_kItlUiIr1969S1cNTOaQsYhQc6BqyV9G02krOQ8K4jDJLbTX3Le5H4E_zhznBJQqOlvfH315-dJ_S0p6_Q4RmuGT-bdeDovECrVSz9cGsuxfTibT_6Ss07ZdovWVdgFxmDINJrIn2jIjXP4RLTAQPBLqO2U1C9rodJgVyktZ0dYqSqAQI8RdJLh4kUPp2Vt5a-ESSNQRtfOpKqdqEhY0xgeMbU9Cmxqhw05MH9-Ap2KexalkqN"
            alt="Boutique Calle 85"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-bold text-white bg-[#8a4853]/85 backdrop-blur-md px-3 py-1 rounded-full">
              Mostrador Dermatológico & Make-Up Bar
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#524345]">¿Prefieres retirar en otra ciudad?</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onSelectSede('bogota')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentSede === 'bogota' ? 'bg-[#8a4853] text-white' : 'bg-[#F4F3F0] text-[#524345]'
              }`}
            >
              Bogotá
            </button>
            <button
              onClick={() => onSelectSede('medellin')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentSede === 'medellin' ? 'bg-[#8a4853] text-white' : 'bg-[#F4F3F0] text-[#524345]'
              }`}
            >
              Medellín
            </button>
            <button
              onClick={() => onSelectSede('cali')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentSede === 'cali' ? 'bg-[#8a4853] text-white' : 'bg-[#F4F3F0] text-[#524345]'
              }`}
            >
              Cali
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Form Modal / Inline Section */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-md border border-[#8a4853] animate-fade-in flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f2e5e5]">
            <h3 className="text-sm sm:text-base font-bold text-[#1E1A1D] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8a4853]">add_circle</span>
              <span>Registro Rápido de Domicilio</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-[#524345] hover:text-[#1E1A1D]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <form onSubmit={handleAddAddress} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Ciudad / Municipio</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F3F0] text-xs font-medium border border-[#E8D8CF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Tipo de Lugar</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F3F0] text-xs font-medium border border-[#E8D8CF]"
                >
                  <option value="casa">Casa / Apartamento</option>
                  <option value="trabajo">Oficina / Coworking</option>
                  <option value="consultorio">Consultorio Médico</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#524345] mb-1">
                  Dirección Completa (Nomenclatura) *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Calle 127 # 15-40, Torre 1 Apto 302"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F3F0] text-xs font-medium border border-[#E8D8CF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Barrio / Sector</label>
                <input
                  type="text"
                  placeholder="Ej. Santa Bárbara"
                  value={newNeighborhood}
                  onChange={(e) => setNewNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F3F0] text-xs font-medium border border-[#E8D8CF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#524345] mb-1">Instrucciones de Portería</label>
                <input
                  type="text"
                  placeholder="Ej. Dejar con vigilante en recepción"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F3F0] text-xs font-medium border border-[#E8D8CF]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-full bg-[#F4F3F0] text-xs font-bold text-[#524345]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#8a4853] text-white text-xs font-bold hover:bg-[#9c4048]"
              >
                Guardar Dirección
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
