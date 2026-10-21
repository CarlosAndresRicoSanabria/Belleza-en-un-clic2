import React, { useState } from 'react';
import { ActiveView } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface ProfileViewProps {
  onNavigate: (view: ActiveView) => void;
  onToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate, onToast }) => {
  const [points, setPoints] = useState(CURRENT_USER.glowPoints);

  const handleRedeemReward = (rewardName: string, cost: number) => {
    if (points >= cost) {
      setPoints((prev) => prev - cost);
      onToast(`¡${rewardName} canjeado exitosamente! Tu nuevo saldo es de ${points - cost} pts.`);
    } else {
      onToast(`Te faltan ${cost - points} puntos para canjear este premio.`);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-8">
      {/* 1. Identity & Sede Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-[#E8D8CF]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={CURRENT_USER.avatarUrl}
                alt={CURRENT_USER.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm ring-4 ring-[#ffd9dd]"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#8a4853] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#8a4853]/10 text-[#8a4853] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Cliente VIP Oro
                </span>
                <span className="text-xs text-[#857374]">{CURRENT_USER.id}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#1E1A1D]">{CURRENT_USER.name}</h1>
              <p className="text-xs text-[#524345]">{CURRENT_USER.email}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('direcciones')}
            className="px-4 py-2 rounded-full bg-[#fef0f1] hover:bg-[#f8ebeb] text-[#8a4853] text-xs font-bold transition-all border border-[#ffd9dd] flex items-center gap-1.5 self-start sm:self-center"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Editar Datos</span>
          </button>
        </div>

        {/* Secondary Contact Bar */}
        <div className="mt-4 pt-4 border-t border-[#f2e5e5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#524345]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8a4853] text-base">call</span>
            <span className="font-semibold text-[#1E1A1D]">{CURRENT_USER.phone}</span>
            <span className="bg-[#2E6B4F]/15 text-[#2E6B4F] text-[10px] font-bold px-1.5 py-0.2 rounded">
              WhatsApp OK
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8a4853] text-base">storefront</span>
            <span>Sede habitual: <strong>Bogotá Calle 85 (Zona Rosa)</strong></span>
            <button
              onClick={() => onNavigate('direcciones')}
              className="text-[#8a4853] font-bold hover:underline ml-1"
            >
              Cambiar
            </button>
          </div>
        </div>
      </div>

      {/* 2. Glow VIP Loyalty Star Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9c4048] via-[#8a4853] to-[#1E1A1D] text-white p-6 sm:p-8 shadow-md border border-[#E8D8CF]/20">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#fe8d93]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[130px]">auto_awesome</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md self-start">
              <span className="material-symbols-outlined text-sm text-[#ffdada]">workspace_premium</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffdada]">
                Membresía Glow VIP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              Nivel Oro Glow
              <span className="material-symbols-outlined text-xl text-[#ffdada]">stars</span>
            </h2>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] text-[#ffdada] uppercase tracking-wider block font-semibold">
              Equivalencia en Compras
            </span>
            <span className="text-xl sm:text-2xl font-bold">
              ${new Intl.NumberFormat('es-CO').format(points * 10)} COP
            </span>
          </div>
        </div>

        {/* Accumulated points and progress bar */}
        <div className="relative z-10 mt-6 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{points}</span>
          <span className="text-sm font-semibold text-[#ffdada]">Puntos Glow Acumulados</span>
        </div>

        <div className="relative z-10 mt-3">
          <div className="flex items-center justify-between text-[11px] text-white/80 mb-1">
            <span>Rumbo a <strong>Platino Diamante</strong></span>
            <span>Faltan {Math.max(0, 3000 - points)} pts ({points} / 3.000)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffdada] to-[#D8A49B] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (points / 3000) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <button
            onClick={() => onToast('Puntos listos. Selecciona tu recompensa en la sección inferior.')}
            className="bg-white text-[#8a4853] hover:bg-[#FAF8F5] py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">redeem</span>
            <span>Redimir Puntos</span>
          </button>
          <button
            onClick={() => onToast('¡Cupón GLOW-ORO-20K generado! Se aplicará automáticamente en tu carrito.')}
            className="bg-white/15 hover:bg-white/25 text-white py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/20"
          >
            <span className="material-symbols-outlined text-base">confirmation_number</span>
            <span>Generar Cupón Digital</span>
          </button>
        </div>
      </div>

      {/* 3. Beneficios Nivel Oro (4 Active) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-[#1E1A1D] flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#8a4853]">award_star</span>
            <span>Beneficios Nivel Oro Activos</span>
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2E6B4F]/10 text-[#2E6B4F] px-2.5 py-0.5 rounded-full">
            4 Vigentes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1A1D]">Envíos Express Gratis</h4>
              <p className="text-[11px] text-[#524345] mt-1 leading-relaxed">
                En órdenes mayores a $100.000 COP sin costo adicional.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">science</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1A1D]">Dermo-Muestras Deluxe</h4>
              <p className="text-[11px] text-[#524345] mt-1 leading-relaxed">
                2 dosis de lujo seleccionadas en cada compra.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">lock_open</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1A1D]">Acceso Anticipado 24h</h4>
              <p className="text-[11px] text-[#524345] mt-1 leading-relaxed">
                Prioridad en lanzamientos de colecciones botánicas.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
            <div className="w-9 h-9 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">support_agent</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1A1D]">Dermo-Consultora VIP</h4>
              <p className="text-[11px] text-[#524345] mt-1 leading-relaxed">
                Asesoría directa y personalizada vía WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recompensas Canjeables */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1E1A1D]">Recompensas para Ti</h2>
            <p className="text-xs text-[#524345]">Canjea tus puntos sin costo adicional</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Reward 1 */}
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
            <div>
              <div className="h-32 rounded-xl bg-[#fef0f1] flex flex-col items-center justify-center text-[#8a4853] p-3 mb-3 relative">
                <span className="material-symbols-outlined text-4xl mb-1">payments</span>
                <span className="text-base font-bold text-[#1E1A1D]">$20.000 COP</span>
                <span className="text-[10px] text-[#524345] uppercase font-bold">Bono de Descuento</span>
                <span className="absolute top-2.5 right-2.5 bg-[#9c4048] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2.000 pts
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#1E1A1D]">Bono Digital en Catálogo</h3>
              <p className="text-[11px] text-[#524345] mt-0.5">Aplicable a cualquier rutina facial o maquillaje.</p>
            </div>

            <button
              onClick={() => handleRedeemReward('Bono Digital de $20.000 COP', 2000)}
              className="mt-4 w-full py-2.5 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold shadow-xs transition-all"
            >
              Canjear (2.000 pts)
            </button>
          </div>

          {/* Reward 2 */}
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between">
            <div>
              <div className="h-32 rounded-xl overflow-hidden bg-[#F4F3F0] relative mb-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2-LNyxumsd2R4KRkXe_zyF2AQy7NFx_4YaZG4ZB0jSwEdw-QtL5OkFzblVPTqY0sNftrb8XVbcanIitkOJ25JS6_lCws_9Z07iGA8Rag4PXOt4h4NQRPOh92P1tmyXWdLUcbwYTmFb_AtfRE4fwPiiRFe3TBFPsmLTnrg6RLzDNM7O82TE3aVj-9eZSxyMPIqyJo8y0xVUFlE03_DW38sBwChiUznU-y73eYlFuFKjJcmhojJVEiI"
                  alt="Sérum Niacinamida 15ml"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 bg-[#9c4048] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  1.800 pts
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#1E1A1D]">Sérum Niacinamida 15ml</h3>
              <p className="text-[11px] text-[#524345] mt-0.5">Control de poros y luminosidad botánica tamaño viaje.</p>
            </div>

            <button
              onClick={() => handleRedeemReward('Sérum Niacinamida 15ml', 1800)}
              className="mt-4 w-full py-2.5 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold shadow-xs transition-all"
            >
              Canjear (1.800 pts)
            </button>
          </div>

          {/* Reward 3 */}
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col justify-between opacity-90">
            <div>
              <div className="h-32 rounded-xl overflow-hidden bg-[#F4F3F0] relative mb-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw-wri5joLw8IhIs2q8GFjd3uAql3qLG4LvkITZ2clLknE05iENv9SPLe-w6Cq-UnOp2ae4V6nidNBObGH1RnzMNMD4DzOzQu4iGMmHbNkoN0LUcJaLb5Hp6PD-nJdUgK9XBZFvIVNrjwPtbhDl1pOK3oLu5Woore3CKlFiQDlAlbbRgQD9_8VWGXYkiYSELYppkEts3zmC4pNE44Lh2Xo9JMYED4UN0SszsR2zt_hDYh5pyg2CTtd"
                  alt="Neceser Terciopelo Rose"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 bg-[#1E1A1D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2.500 pts
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#1E1A1D]">Neceser Terciopelo Rose</h3>
              <p className="text-[11px] text-[#B46522] font-semibold mt-0.5">
                Te faltan {Math.max(0, 2500 - points)} pts para canjear
              </p>
            </div>

            <button
              disabled={points < 2500}
              onClick={() => handleRedeemReward('Neceser Terciopelo Rose', 2500)}
              className="mt-4 w-full py-2.5 rounded-full bg-[#F4F3F0] text-[#857374] disabled:cursor-not-allowed text-xs font-bold"
            >
              Bloqueado (Faltan {Math.max(0, 2500 - points)})
            </button>
          </div>
        </div>
      </div>

      {/* 5. Account Settings Shortcuts */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm sm:text-base font-bold text-[#1E1A1D]">Mi Cuenta & Configuración</h2>
        <div className="bg-white rounded-2xl shadow-xs border border-[#E8D8CF] overflow-hidden divide-y divide-[#f2e5e5]">
          <button
            onClick={() => onNavigate('direcciones')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#fef0f1] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">pin_drop</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E1A1D]">Direcciones de Entrega</p>
                <p className="text-[11px] text-[#524345]">2 registradas (Chicó Norte, Torre Médica)</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-base text-[#857374]">chevron_right</span>
          </button>

          <button
            onClick={() => onNavigate('historial')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#fef0f1] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#1E1A1D]">Facturación Electrónica DIAN</p>
                  <span className="bg-[#2E6B4F]/15 text-[#2E6B4F] text-[9px] font-bold px-1.5 rounded">
                    CUFE OK
                  </span>
                </div>
                <p className="text-[11px] text-[#524345]">
                  {CURRENT_USER.documentType} {CURRENT_USER.documentNumber} • {CURRENT_USER.name}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-base text-[#857374]">chevron_right</span>
          </button>

          <button
            onClick={() => onNavigate('pqrs')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#fef0f1] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fef0f1] text-[#8a4853] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">shield</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E1A1D]">Soporte, PQRS & Registro INVIMA</p>
                <p className="text-[11px] text-[#524345]">Garantía de originalidad clínica 100% oficial</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-base text-[#857374]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
