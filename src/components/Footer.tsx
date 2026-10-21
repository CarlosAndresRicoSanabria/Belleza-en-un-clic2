import React from 'react';
import { ActiveView } from '../types';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#FAF8F5] pt-14 pb-12 mt-16 border-t border-[#E8D8CF]/80">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E8D8CF]/60">
          {/* Brand Col */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDINIssPX-rdoZqYVUlTqTwETFVkF_JrPO0ORbkl0h78L16XX0jml8EzErU9yvCCTb-j-SzpKIYhRQ9OvriBHYH_AowdOCT1gd1GIRgpSy5GQQoH7Pw7954dtLe_swr6ydtQvVCf7j8lWwiaMNC81HHWmjepDGGCI1kimpzXRYzH9zYOPw-PloqGwkkXXDxo3oiS5CmNXtUH5qTP2D96HUAHN71o2pwRKBIeFVj4bmqIr6eZw3PYj_B"
                alt="Belleza en un Clic Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm text-lg font-bold text-[#8a4853] tracking-tight">
                Belleza en un Clic
              </span>
            </div>
            <p className="text-xs text-[#524345] leading-relaxed">
              Cosmética consciente, formulaciones dermatológicas premium y disponibilidad en tiempo real por sedes nacionales en Bogotá, Medellín y Cali.
            </p>
            <div className="flex items-center gap-2 text-[#2e6743] text-xs font-semibold">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Certificación INVIMA & Cruelty-free</span>
            </div>
          </div>

          {/* Legal Info */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-[#201a1b] uppercase tracking-wider">
              Información Legal
            </h4>
            <button
              onClick={() => onNavigate('direcciones')}
              className="text-left text-xs text-[#524345] hover:text-[#201a1b] transition-colors"
            >
              Términos de Envío y Cobertura
            </button>
            <button
              onClick={() => onNavigate('historial')}
              className="text-left text-xs text-[#524345] hover:text-[#201a1b] transition-colors"
            >
              Facturación Electrónica DIAN & CUFE
            </button>
            <button
              onClick={() => onNavigate('pqrs')}
              className="text-left text-xs text-[#524345] hover:text-[#201a1b] transition-colors"
            >
              Garantías y Política de Retracto (SIC)
            </button>
            <span className="text-xs text-[#524345]">
              Aviso Legal & Razón Social S.A.S.
            </span>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-[#201a1b] uppercase tracking-wider">
              Atención al Cliente
            </h4>
            <button
              onClick={() => onNavigate('pqrs')}
              className="text-left text-xs text-[#524345] hover:text-[#8a4853] font-medium transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-[#8a4853]">assignment</span>
              <span>Radicar Solicitud PQRS Oficial</span>
            </button>
            <button
              onClick={() => onNavigate('mis-pedidos')}
              className="text-left text-xs text-[#524345] hover:text-[#8a4853] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-[#8a4853]">gps_fixed</span>
              <span>Rastreo Satelital de Guía</span>
            </button>
            <button
              onClick={() => onNavigate('direcciones')}
              className="text-left text-xs text-[#524345] hover:text-[#8a4853] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-[#8a4853]">storefront</span>
              <span>Horarios de Sedes Físicas</span>
            </button>
            <div className="pt-1 flex flex-col text-xs text-[#524345]">
              <span className="font-semibold text-[#201a1b]">Línea Nacional: 01 8000 456 789</span>
              <span className="text-[11px] text-[#857374]">WhatsApp VIP: +57 312 849 2034</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-[#201a1b] uppercase tracking-wider">
              Métodos de Pago Protegidos
            </h4>
            <p className="text-xs text-[#524345]">
              Transacciones bancarias cifradas con protocolo SSL 256-bit y tokenización PCI-DSS.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[#524345]">
              <span className="px-2.5 py-1 bg-white rounded border border-[#E8D8CF] text-[10px] font-bold">
                PSE
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-[#E8D8CF] text-[10px] font-bold">
                Tarjetas Crédito/Débito
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-[#E8D8CF] text-[10px] font-bold">
                Bancolombia
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-[#E8D8CF] text-[10px] font-bold">
                Nequi / Daviplata
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-[#E8D8CF] text-[10px] font-bold">
                Addi a Cuotas
              </span>
              <span className="px-2.5 py-1 bg-white rounded border border-[#E8D8CF] text-[10px] font-bold text-[#2e6743]">
                Contra Entrega en Sede
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#524345]">
          <p>© 2025 - 2026 Belleza en un Clic S.A.S. Todos los derechos reservados. NIT: 901.842.310-4.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:underline cursor-pointer">Términos de servicio</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Cookies & Privacidad</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Canal de Denuncias INVIMA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
