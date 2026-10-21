import React, { useState } from 'react';
import { PQRSItem, Order } from '../types';
import { INITIAL_PQRS_ITEMS, CURRENT_USER } from '../data/mockData';

interface PqrsViewProps {
  initialOrderId?: string;
  activeOrders: Order[];
  onToast: (msg: string) => void;
}

export const PqrsView: React.FC<PqrsViewProps> = ({
  initialOrderId,
  activeOrders,
  onToast,
}) => {
  const [selectedType, setSelectedType] = useState<'peticion' | 'queja' | 'envio' | 'dermatologica'>('peticion');
  const [selectedOrder, setSelectedOrder] = useState<string>(initialOrderId || activeOrders[0]?.id || '#BEC-2026-8942');
  const [lotCode, setLotCode] = useState('#H24-902 (Impreso en base)');
  const [motivo, setMotivo] = useState('dano');
  const [description, setDescription] = useState('');
  const [notificationChannel, setNotificationChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'foto_empaque_lote_H24.jpg (1.2 MB)',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);
  const [pqrsHistory, setPqrsHistory] = useState<PQRSItem[]>(INITIAL_PQRS_ITEMS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `#PQRS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedTicket(ticketId);
      setIsSubmitting(false);

      const newItem: PQRSItem = {
        id: ticketId,
        type: selectedType,
        title: motivo === 'reaccion' ? 'Reacción Cutánea / Cosmétovigilancia' : 'Garantía de Empaque y Lote',
        orderId: selectedOrder,
        lotCode: lotCode,
        status: 'Radicado',
        date: 'Hoy, 21 Oct 2026',
        description: description || 'Novedad reportada con evidencia fotográfica.',
        resolution: 'En asignación a perito dermocosmético (Respuesta en < 24h).',
      };

      setPqrsHistory([newItem, ...pqrsHistory]);
      onToast(`¡Radicado ${ticketId} generado oficialmente con validez INVIMA y SIC!`);
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-6">
      {/* Sub-bar Top Context */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4F] animate-pulse"></span>
          <span className="font-bold text-[#2E6B4F] uppercase tracking-wider">
            Vigilancia Sanitaria Activa
          </span>
        </div>

        <a
          href="https://wa.me/573128492034"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#fef0f1] text-[#8a4853] font-bold shadow-xs border border-[#E8D8CF]"
        >
          <span className="material-symbols-outlined text-sm text-[#2E6B4F]">chat</span>
          <span>Dermoconsulta VIP WhatsApp</span>
        </a>
      </div>

      {/* Official Health Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fef0f1] via-[#FAF8F5] to-[#f8ebeb] p-5 sm:p-7 shadow-xs border border-[#ffd9dd]">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#2e6743]/10 text-[#2e6743] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-[#1E1A1D]">
                Garantía Dermocosmética Oficial
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2e6743]/15 text-[#2E6B4F] text-[10px] font-bold uppercase tracking-wider">
                INVIMA & SIC
              </span>
            </div>

            <p className="text-xs text-[#524345] mt-1 leading-relaxed">
              Respaldo legal bajo Decreto 219 de 1998 y Resolución 3773 de Cosmétovigilancia. Trazabilidad de lote químico garantizada y respuesta regulatoria estricta ante novedades cosméticas.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-xs border border-[#E8D8CF]">
                <span className="material-symbols-outlined text-sm text-[#8a4853]">schedule</span>
                <span className="font-semibold text-[#201a1b]">Término Legal: 24h a 48h hábiles</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E6B4F]/10 text-[#2E6B4F] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F]"></span>
                <span>Farmacovigilancia y peritaje activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Request Type Selector Pills */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#524345] uppercase tracking-wider">
            1. Tipo de Solicitud
          </span>
          <span className="text-[10px] font-bold text-[#8a4853]">Selección requerida</span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedType('peticion')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedType === 'peticion'
                ? 'bg-[#8a4853] text-white shadow-xs'
                : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
            }`}
          >
            Petición
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('queja')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedType === 'queja'
                ? 'bg-[#8a4853] text-white shadow-xs'
                : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
            }`}
          >
            Queja o Reclamo
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('envio')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedType === 'envio'
                ? 'bg-[#8a4853] text-white shadow-xs'
                : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
            }`}
          >
            Novedad de Envío
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('dermatologica')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedType === 'dermatologica'
                ? 'bg-[#8a4853] text-white shadow-xs'
                : 'bg-[#ffdad6]/40 text-[#ba1a1a] border border-[#ffdad6] hover:bg-[#ffdad6]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">health_and_safety</span>
            <span>Reacción / INVIMA</span>
            <span className="bg-[#ba1a1a] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              Prioritario
            </span>
          </button>
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Customer Data */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E8D8CF]">
          <div className="flex items-center justify-between pb-3 border-b border-[#f2e5e5]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8a4853] text-lg">person</span>
              <span className="text-xs font-bold text-[#1E1A1D]">Titular de la Radicación</span>
            </div>
            <span className="text-xs text-[#8a4853] font-semibold">Cliente Autenticado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 text-xs text-[#524345]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#857374] block">Nombre Completo</span>
              <span className="font-bold text-[#1E1A1D]">{CURRENT_USER.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#857374] block">Documento de Identidad</span>
              <span className="font-bold text-[#1E1A1D]">{CURRENT_USER.documentType} {CURRENT_USER.documentNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#857374] block">Teléfono / WhatsApp</span>
              <span className="font-bold text-[#1E1A1D]">{CURRENT_USER.phone}</span>
            </div>
          </div>
        </div>

        {/* 2. Order Selection */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E8D8CF] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f2e5e5]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8a4853] text-lg">inventory_2</span>
              <span className="text-xs font-bold text-[#1E1A1D]">2. Pedido o Producto Asociado</span>
            </div>
            <span className="text-[10px] font-bold text-[#2E6B4F] bg-[#2E6B4F]/10 px-2 py-0.5 rounded-full">
              Verificado
            </span>
          </div>

          <div className="flex items-center gap-3.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8D8CF]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQXQhLb-rTymgecPLtWGLGiVKUMWnIOCn8l3YeYtDgdix0r2YenKy3Q9JnzA4zAmb3R2Y4d5SAL_nrkjl_ZvRA8jIRpIlY7Jnqyj4Ty3OeuVdVgkyJt6Dtk4tDpRv3Sr3pPK9IY4zLaMvodKZgOd5y5L_5S-nt7Ur9I5gTDcZYl9e5asjTCOewH2Rv1ci9cPgn6voabHP0CgF2fu_978lHZ7d4T082pbPT3jFpTzIbnm0SGDL5EKUv"
              alt="Producto"
              className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-[#E8D8CF]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8a4853]">{selectedOrder}</span>
                <span className="text-[10px] text-[#857374]">Despacho en Sede Bogotá</span>
              </div>
              <p className="text-xs font-bold text-[#1E1A1D] truncate">
                Sérum Facial Niacinamida 10% + Crema Hidratante
              </p>
              <p className="text-[11px] text-[#524345]">Guía Coordinadora: #ENV-983124</p>
            </div>
          </div>
        </div>

        {/* 3. Sanitary Batch and Technical Issue Details */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E8D8CF] flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f2e5e5]">
            <span className="material-symbols-outlined text-[#8a4853] text-lg">assignment_late</span>
            <span className="text-xs font-bold text-[#1E1A1D]">3. Detalle de la Novedad Sanitaria</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#1E1A1D]">Código de Lote INVIMA</label>
                <span className="text-[10px] text-[#2E6B4F] font-bold">Obligatorio en cosmétovigilancia</span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-base">
                  qr_code_scanner
                </span>
                <input
                  type="text"
                  value={lotCode}
                  onChange={(e) => setLotCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium border border-[#E8D8CF]"
                  required
                />
              </div>
              <span className="text-[10px] text-[#857374] mt-0.5 block">
                Encuentra este código grabado con láser en la base del frasco o solapa.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1A1D] mb-1">Motivo del Inconveniente</label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium border border-[#E8D8CF]"
              >
                <option value="dano">Producto defectuoso / Daño de empaque o sello roto</option>
                <option value="reaccion">Reacción adversa cutánea o alergia inmediata</option>
                <option value="transportadora">Demora o entrega fallida con transportadora</option>
                <option value="facturacion">Aclaración de facturación electrónica DIAN</option>
                <option value="reposicion">Solicitud directa de reposición o devolución</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1A1D] mb-1">Descripción de los Hechos</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente lo ocurrido (fecha de apertura, síntomas o estado físico del cosmético) para el peritaje de nuestro equipo dermatológico..."
              className="w-full p-3 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] border border-[#E8D8CF] focus:bg-white resize-none"
              required
            />
          </div>

          {/* Photographic Evidence Attachment */}
          <div>
            <span className="block text-xs font-bold text-[#1E1A1D] mb-1">
              Evidencia Fotográfica y Documental
            </span>
            <div
              onClick={() => {
                setUploadedFiles([...uploadedFiles, `lote_foto_${Date.now().toString().slice(-4)}.jpg (1.4 MB)`]);
                onToast('Foto adicional adjuntada para el peritaje.');
              }}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-dashed border-[#d7c1c3] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#fef0f1] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8a4853] shadow-xs mb-1">
                <span className="material-symbols-outlined text-xl">add_a_photo</span>
              </div>
              <p className="text-xs font-bold text-[#1E1A1D]">Toca para capturar o subir evidencia</p>
              <p className="text-[11px] text-[#857374]">Foto nítida del frasco, lote visible o guía Coordinadora</p>
            </div>

            {/* Uploaded files preview */}
            <div className="mt-2.5 flex flex-col gap-2">
              {uploadedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fef0f1] border border-[#ffd9dd] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#2E6B4F]">check_circle</span>
                    <span className="font-semibold text-[#1E1A1D]">{f}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                    className="text-[#ba1a1a] hover:opacity-80"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Notification Channel Preference */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E8D8CF] flex flex-col gap-3">
          <span className="text-xs font-bold text-[#1E1A1D] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8a4853] text-base">notifications_active</span>
            <span>4. Canal de Notificación Preferente</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              onClick={() => setNotificationChannel('whatsapp')}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                notificationChannel === 'whatsapp'
                  ? 'bg-[#fef0f1] border-[#8a4853]'
                  : 'bg-[#FAF8F5] border-[#E8D8CF]'
              }`}
            >
              <input
                type="radio"
                name="notif"
                checked={notificationChannel === 'whatsapp'}
                onChange={() => setNotificationChannel('whatsapp')}
                className="w-4 h-4 accent-[#8a4853]"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1E1A1D]">WhatsApp Prioritario</span>
                  <span className="text-[9px] bg-[#2E6B4F]/15 text-[#2E6B4F] px-1.5 py-0.2 rounded font-bold">
                    Rápido
                  </span>
                </div>
                <span className="text-[11px] text-[#524345]">{CURRENT_USER.phone}</span>
              </div>
            </label>

            <label
              onClick={() => setNotificationChannel('email')}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                notificationChannel === 'email'
                  ? 'bg-[#fef0f1] border-[#8a4853]'
                  : 'bg-[#FAF8F5] border-[#E8D8CF]'
              }`}
            >
              <input
                type="radio"
                name="notif"
                checked={notificationChannel === 'email'}
                onChange={() => setNotificationChannel('email')}
                className="w-4 h-4 accent-[#8a4853]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1E1A1D]">Correo Electrónico Oficial</span>
                <span className="text-[11px] text-[#524345]">{CURRENT_USER.email}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                <span>Generando Radicado Oficial INVIMA & SIC...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
                <span>Radicar PQRS y Generar Código</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-[#857374] text-center">
            Se generará un número alfanumérico único con validez probatoria ante la Superintendencia de Industria y Comercio (SIC) y el INVIMA.
          </p>
        </div>
      </form>

      {/* Generated Ticket Banner */}
      {generatedTicket && (
        <div className="p-5 rounded-2xl bg-[#2E6B4F]/10 border border-[#2E6B4F]/30 text-xs text-[#2E6B4F] flex flex-col gap-2 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-xl">verified</span>
            <span>¡Radicado Generado Exitosamente: {generatedTicket}!</span>
          </div>
          <p className="text-[#201a1b] leading-relaxed">
            Hemos asignado tu caso al equipo técnico farmacéutico. Recibirás respuesta formal en un plazo máximo de 24 horas a través de {notificationChannel === 'whatsapp' ? 'tu WhatsApp' : 'tu correo'}.
          </p>
        </div>
      )}

      {/* Previous PQRS Tickets */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#1E1A1D] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8a4853] text-lg">history</span>
          <span>Tus Radicados Anteriores</span>
        </h3>

        <div className="flex flex-col gap-3">
          {pqrsHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8a4853]">{item.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#2E6B4F]/15 text-[#2E6B4F] text-[10px] font-bold">
                  {item.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#1E1A1D]">{item.title}</h4>
              <p className="text-[11px] text-[#524345]">{item.description}</p>
              {item.resolution && (
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl text-[11px] text-[#2E6B4F] font-medium border border-[#E8D8CF]">
                  {item.resolution}
                </div>
              )}
              <span className="text-[10px] text-[#857374] self-end">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
