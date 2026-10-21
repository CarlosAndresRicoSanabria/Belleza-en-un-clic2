import React, { useState, useEffect } from 'react';
import { CartItem, SedeId } from '../types';
import { SEDES_DATA } from '../data/mockData';

interface CheckoutViewProps {
  cartItems: CartItem[];
  currentSede: SedeId;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOrderSuccess: (orderData: {
    total: number;
    paymentMethod: string;
    shippingMethod: string;
    dianDoc: string;
  }) => void;
  onBackToCatalog: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  currentSede,
  onUpdateQuantity,
  onOrderSuccess,
  onBackToCatalog,
}) => {
  // Timer for 15 minutes stock reservation
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60 + 48);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s} min`;
  };

  // Form states
  const [fullName, setFullName] = useState('Valeria Gómez Arboleda');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('1.020.458.912');
  const [email, setEmail] = useState('valeria.gomez@empresa.com.co');
  const [phone, setPhone] = useState('+57 312 849 2034');

  const [shippingMethod, setShippingMethod] = useState<'home' | 'pickup'>('home');
  const [address, setAddress] = useState('Carrera 15 # 88 - 21, Apto 502');
  const [city, setCity] = useState('Bogotá, D.C.');
  const [instructions, setInstructions] = useState('Portería 24h, torre norte, timbre 502');

  const [paymentChoice, setPaymentChoice] = useState<'card' | 'pse' | 'fintech'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8109');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('731');
  const [installments, setInstallments] = useState('1');
  const [selectedBank, setSelectedBank] = useState('Bancolombia Personas');

  const [couponApplied, setCouponApplied] = useState(true);
  const [couponCode, setCouponCode] = useState('BIENVENIDA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = couponApplied ? 15000 : 0;
  const ivaAmount = Math.round((subtotal - discountAmount) * 0.19);
  const grandTotal = subtotal - discountAmount + ivaAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BIENVENIDA') {
      setCouponApplied(true);
    }
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onOrderSuccess({
          total: grandTotal,
          paymentMethod: paymentChoice,
          shippingMethod,
          dianDoc: docNumber,
        });
      }, 1200);
    }, 1500);
  };

  const sedeInfo = SEDES_DATA[currentSede];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8">
      {/* Top Stepper Indicator */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fef0f1] px-5 sm:px-8 py-3.5 rounded-2xl border border-[#ffd9dd]">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#8a4853] text-white text-xs font-bold shadow-xs">
              1
            </span>
            <span className="text-xs font-bold text-[#201a1b]">Datos & Factura</span>
          </div>

          <div className="hidden sm:block w-10 h-0.5 bg-[#d7c1c3]/60"></div>

          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#8a4853] text-white text-xs font-bold shadow-xs">
              2
            </span>
            <span className="text-xs font-bold text-[#201a1b]">Envío & Sede</span>
          </div>

          <div className="hidden sm:block w-10 h-0.5 bg-[#d7c1c3]/60"></div>

          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#9c4048] text-white text-xs font-bold shadow-xs ring-4 ring-[#ffdada]">
              3
            </span>
            <span className="text-xs font-bold text-[#9c4048]">Pago Seguro</span>
          </div>

          <div className="hidden sm:block w-10 h-0.5 bg-[#d7c1c3]/60"></div>

          <div className="flex items-center gap-1.5 text-[#524345] text-xs font-semibold">
            <span className="material-symbols-outlined text-base text-[#2E6B4F]">verified</span>
            <span>Compra Protegida DIAN</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Form + Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* STEP 1: DIAN Customer Data & Invoicing */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-xs border border-[#E8D8CF]">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#f2e5e5]">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ffdada] text-[#40000b] text-sm font-bold">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#201a1b]">
                    Información del Cliente y Facturación DIAN
                  </h2>
                  <p className="text-xs text-[#524345]">
                    Factura electrónica legal conforme a la resolución vigente DIAN Colombia (Decreto 358)
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#8a4853] text-2xl">receipt_long</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#201a1b]" htmlFor="fullname">
                  Nombre y Apellidos / Razón Social *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-lg">
                    person
                  </span>
                  <input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#201a1b]" htmlFor="doc-type">
                  Tipo de Documento *
                </label>
                <select
                  id="doc-type"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF] cursor-pointer"
                >
                  <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                  <option value="NIT">NIT Persona Jurídica</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#201a1b]" htmlFor="doc-number">
                  Número Cédula / NIT *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-lg">
                    badge
                  </span>
                  <input
                    id="doc-number"
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#201a1b]" htmlFor="email">
                  Correo para Factura Electrónica (CUFE) *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-lg">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#201a1b]" htmlFor="phone">
                  Teléfono Celular (Actualizaciones SMS / WhatsApp) *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-lg">
                    phone_android
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Shipping Method & Fulfillment Branch */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-xs border border-[#E8D8CF]">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#f2e5e5]">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ffdada] text-[#40000b] text-sm font-bold">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#201a1b]">
                    Dirección y Sede de Despacho
                  </h2>
                  <p className="text-xs text-[#524345]">
                    Ruteo inteligente desde centros de distribución verificados con control térmico
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#8a4853] text-2xl">local_shipping</span>
            </div>

            {/* Radio Selection: Shipping vs Pickup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-5">
              <label
                onClick={() => setShippingMethod('home')}
                className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${
                  shippingMethod === 'home'
                    ? 'bg-[#fef0f1] border-[#9c4048] shadow-xs'
                    : 'bg-[#F4F3F0] border-transparent hover:bg-[#f8ebeb]'
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === 'home'}
                      onChange={() => setShippingMethod('home')}
                      className="w-4 h-4 text-[#9c4048] accent-[#9c4048]"
                    />
                    <span className="text-xs font-bold text-[#201a1b]">Envío a Domicilio</span>
                  </div>
                  <span className="text-[10px] bg-[#2e6743]/15 text-[#2e6743] px-2 py-0.5 rounded-full font-bold">
                    GRATIS
                  </span>
                </div>
                <p className="text-xs text-[#524345] pl-6 leading-relaxed">
                  Despacho express a nivel nacional con trazabilidad satelital en tiempo real vía Coordinadora.
                </p>
              </label>

              <label
                onClick={() => setShippingMethod('pickup')}
                className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${
                  shippingMethod === 'pickup'
                    ? 'bg-[#fef0f1] border-[#9c4048] shadow-xs'
                    : 'bg-[#F4F3F0] border-transparent hover:bg-[#f8ebeb]'
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === 'pickup'}
                      onChange={() => setShippingMethod('pickup')}
                      className="w-4 h-4 text-[#9c4048] accent-[#9c4048]"
                    />
                    <span className="text-xs font-bold text-[#201a1b]">Retiro en Sede Física</span>
                  </div>
                  <span className="text-[10px] bg-white text-[#524345] px-2 py-0.5 rounded-full border border-[#d7c1c3] font-bold">
                    Listo hoy
                  </span>
                </div>
                <p className="text-xs text-[#524345] pl-6 leading-relaxed">
                  Disponible para reclamar en taquilla inteligente preferencial de 2 a 4 horas.
                </p>
              </label>
            </div>

            {/* Branch Stock Routing Box */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl mb-5 border border-[#E8D8CF]">
              <div className="flex items-center justify-between pb-2.5">
                <span className="text-xs font-bold text-[#201a1b] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#9c4048] text-base">hub</span>
                  Sede de Despacho Asignada Automáticamente
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E6B4F]/15 text-[#2E6B4F] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F]"></span>
                  Stock Confirmado (100%)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E8D8CF]/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#8a4853] text-2xl">warehouse</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#201a1b]">{sedeInfo.fullName}</h4>
                    <p className="text-[11px] text-[#524345]">
                      {sedeInfo.address} • Entrega estimada: Hoy antes de las 6:00 PM
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onBackToCatalog}
                  className="text-xs font-bold text-[#8a4853] hover:text-[#9c4048] self-start sm:self-center underline"
                >
                  Cambiar Sede
                </button>
              </div>
            </div>

            {/* Address Form */}
            {shippingMethod === 'home' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#201a1b]" htmlFor="address">
                    Dirección Residencial / Corporativa *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#201a1b]" htmlFor="city">
                    Ciudad / Municipio *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>

                <div className="sm:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#201a1b]" htmlFor="instructions">
                    Instrucciones Especiales para Entrega (Opcional)
                  </label>
                  <input
                    id="instructions"
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ej: Portería 24h, torre norte, timbre 502"
                    className="w-full px-3.5 py-2.5 bg-[#F4F3F0] rounded-xl text-xs text-[#201a1b] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8a4853]/30 transition-all border border-[#E8D8CF]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Integrated Digital Payments */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-xs border border-[#E8D8CF]">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#f2e5e5]">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#9c4048] text-white text-sm font-bold">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#201a1b]">
                    Método de Pago Digital
                  </h2>
                  <p className="text-xs text-[#524345]">
                    Transacciones bancarias cifradas con confirmación instantánea
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#9c4048] text-2xl">lock</span>
            </div>

            <div className="flex flex-col gap-3.5 pt-4">
              {/* Option 1: Card */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  paymentChoice === 'card'
                    ? 'bg-[#fef0f1] border-[#9c4048]'
                    : 'bg-[#F4F3F0] border-transparent hover:bg-[#f8ebeb]'
                }`}
              >
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentChoice === 'card'}
                      onChange={() => setPaymentChoice('card')}
                      className="w-4 h-4 accent-[#9c4048]"
                    />
                    <span className="text-xs font-bold text-[#201a1b]">Tarjeta Débito / Crédito</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#201a1b] shadow-xs">
                      VISA
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#9c4048] shadow-xs">
                      MASTERCARD
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#524345] shadow-xs">
                      AMEX
                    </span>
                  </div>
                </label>

                {paymentChoice === 'card' && (
                  <div className="mt-4 pt-4 border-t border-[#d7c1c3]/50 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#524345]">Número de Tarjeta</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#857374] text-base">
                          credit_card
                        </span>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white rounded-lg text-xs text-[#201a1b] font-medium focus:outline-none border border-[#E8D8CF]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#524345]">Fecha Vencimiento</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg text-xs text-[#201a1b] font-medium focus:outline-none border border-[#E8D8CF]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#524345]">Código CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg text-xs text-[#201a1b] font-medium focus:outline-none border border-[#E8D8CF]"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#524345]">Cuotas</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg text-xs text-[#201a1b] font-medium focus:outline-none border border-[#E8D8CF]"
                      >
                        <option value="1">1 cuota (Sin intereses bancarios)</option>
                        <option value="3">3 cuotas mensuales sin interés</option>
                        <option value="6">6 cuotas mensuales</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: PSE */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  paymentChoice === 'pse'
                    ? 'bg-[#fef0f1] border-[#9c4048]'
                    : 'bg-[#F4F3F0] border-transparent hover:bg-[#f8ebeb]'
                }`}
              >
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentChoice === 'pse'}
                      onChange={() => setPaymentChoice('pse')}
                      className="w-4 h-4 accent-[#9c4048]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#201a1b]">
                        PSE • Transferencia Bancaria Segura
                      </span>
                      <span className="text-[11px] text-[#524345]">
                        Débito directo desde cuentas de ahorro o corriente nacionales
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white text-[#8a4853] text-xs font-bold rounded-lg shadow-xs border border-[#E8D8CF]">
                    PSE
                  </span>
                </label>

                {paymentChoice === 'pse' && (
                  <div className="mt-3 pt-3 border-t border-[#d7c1c3]/50">
                    <label className="text-[11px] font-bold text-[#524345] block mb-1">
                      Selecciona tu Banco Aliado:
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg text-xs text-[#201a1b] font-medium border border-[#E8D8CF]"
                    >
                      <option>Bancolombia Personas</option>
                      <option>Davivienda</option>
                      <option>Nu Colombia</option>
                      <option>Banco de Bogotá</option>
                      <option>Lulo Bank</option>
                      <option>Scotiabank Colpatria</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Option 3: Addi / Nequi QR */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  paymentChoice === 'fintech'
                    ? 'bg-[#fef0f1] border-[#9c4048]'
                    : 'bg-[#F4F3F0] border-transparent hover:bg-[#f8ebeb]'
                }`}
              >
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentChoice === 'fintech'}
                      onChange={() => setPaymentChoice('fintech')}
                      className="w-4 h-4 accent-[#9c4048]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#201a1b]">
                        Addi / Bancolombia QR / Nequi
                      </span>
                      <span className="text-[11px] text-[#524345]">
                        Compra a cuotas sin tarjeta de crédito o escaneo QR instantáneo
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#201a1b] shadow-xs">
                      ADDI
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#9c4048] shadow-xs">
                      NEQUI
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Order Summary, Stock Timer & Final CTA (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sticky top-28">
          {/* Stock Reservation Banner */}
          <div className="bg-[#b4f1c3] text-[#00210e] p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-[#98d4a8]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2e6743] text-2xl animate-pulse">
                timer
              </span>
              <div>
                <p className="text-xs font-bold text-[#00210e]">Stock reservado en {sedeInfo.name}</p>
                <p className="text-[11px] text-[#16512f]">
                  Tu inventario está apartado por{' '}
                  <span className="font-bold underline">{formatTimer(secondsRemaining)}</span>
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#2e6743] text-xl">inventory_2</span>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E8D8CF] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2e5e5]">
              <h3 className="text-base font-bold text-[#201a1b]">Resumen de Orden</h3>
              <span className="text-xs font-semibold text-[#524345]">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Productos
              </span>
            </div>

            {/* Cart Items with interactive counters */}
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8D8CF]/60"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-[#E8D8CF]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#8a4853] uppercase font-bold tracking-wider">
                      {item.product.categoryLabel}
                    </span>
                    <h4 className="text-xs font-bold text-[#201a1b] truncate">{item.product.name}</h4>
                    {item.selectedShade && (
                      <p className="text-[10px] text-[#524345]">Tono: {item.selectedShade}</p>
                    )}
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center bg-white rounded-full p-0.5 shadow-xs border border-[#E8D8CF]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded-full text-[#201a1b] hover:bg-[#F4F3F0] text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#201a1b]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded-full text-[#201a1b] hover:bg-[#F4F3F0] text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#201a1b]">
                        ${new Intl.NumberFormat('es-CO').format(item.product.price * item.quantity)}{' '}
                        <span className="text-[10px] text-[#857374] font-normal">COP</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            {couponApplied ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fef0f1] border border-[#ffd9dd]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9c4048] text-base">loyalty</span>
                  <span className="text-xs text-[#9c4048] font-bold tracking-wider">
                    CUPÓN BIENVENIDA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9c4048] font-bold">-$15.000 COP</span>
                  <button
                    type="button"
                    onClick={() => setCouponApplied(false)}
                    aria-label="Eliminar cupón"
                    className="material-symbols-outlined text-[#857374] hover:text-[#ba1a1a] text-sm"
                  >
                    close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cupón de descuento (Ej: BIENVENIDA)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#F4F3F0] rounded-xl text-xs uppercase focus:outline-none focus:bg-white border border-[#E8D8CF]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8a4853] text-white text-xs font-bold rounded-xl hover:bg-[#9c4048]"
                >
                  Aplicar
                </button>
              </form>
            )}

            {/* Financial Breakdown Table */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#f2e5e5]">
              <div className="flex items-center justify-between text-xs text-[#524345]">
                <span>Subtotal Productos</span>
                <span className="text-[#201a1b] font-bold">
                  ${new Intl.NumberFormat('es-CO').format(subtotal)} COP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#524345]">
                <span className="flex items-center gap-1">
                  IVA General (19%)
                  <span
                    className="material-symbols-outlined text-[#857374] text-xs cursor-help"
                    title="Impuesto al Valor Agregado según norma tributaria DIAN Colombia"
                  >
                    info
                  </span>
                </span>
                <span className="text-[#201a1b] font-bold">
                  ${new Intl.NumberFormat('es-CO').format(ivaAmount)} COP
                </span>
              </div>

              {couponApplied && (
                <div className="flex items-center justify-between text-xs text-[#9c4048]">
                  <span>Descuento Promocional</span>
                  <span className="font-bold">-$15.000 COP</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#2E6B4F]">
                <span className="flex items-center gap-1">
                  Envío Nacional Express
                  <span className="material-symbols-outlined text-xs">local_shipping</span>
                </span>
                <span className="font-bold uppercase tracking-wider text-[11px]">GRATIS</span>
              </div>

              {/* Grand Total */}
              <div className="pt-3.5 mt-2 bg-[#f2e5e5]/50 p-4 rounded-xl flex items-baseline justify-between border border-[#eddfe0]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#524345] font-bold block">
                    Total a Pagar
                  </span>
                  <span className="text-[10px] text-[#857374]">Incluye retenciones e IVA</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#9c4048] leading-none">
                    ${new Intl.NumberFormat('es-CO').format(grandTotal)}
                  </span>
                  <span className="block text-[10px] text-[#524345] font-bold">COP</span>
                </div>
              </div>
            </div>

            {/* Primary Purchase CTA */}
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isProcessing || isSuccess}
              className={`w-full py-4 px-6 text-white text-sm font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] ${
                isSuccess
                  ? 'bg-[#2E6B4F]'
                  : 'bg-[#9c4048] hover:bg-[#77242d]'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">sync</span>
                  <span>Procesando pago DIAN & PSE...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                  <span>¡Pago Aprobado con Éxito!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                  <span>Confirmar y Pagar Pedido Seguramente</span>
                </>
              )}
            </button>

            {/* Guarantees List */}
            <div className="flex flex-col gap-2.5 pt-1 text-xs text-[#524345]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#2E6B4F] text-base shrink-0">
                  enhanced_encryption
                </span>
                <span>Cifrado bancario seguro SSL 256-bit y tokenización PCI-DSS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#8a4853] text-base shrink-0">
                  mark_email_read
                </span>
                <span>Emisión automática de factura electrónica validada por DIAN en PDF/XML</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#2e6743] text-base shrink-0">
                  published_with_changes
                </span>
                <span>Garantía de originalidad con sello INVIMA y despacho el mismo día</span>
              </div>
            </div>
          </div>

          {/* Trust Badges & Invoicing Preview Pill */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl flex items-center justify-between text-xs text-[#524345] border border-[#E8D8CF]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#8a4853]">description</span>
              <span className="font-semibold">Factura #FEL-2026-00892</span>
            </div>
            <span className="bg-white px-2 py-0.5 rounded text-[11px] text-[#201a1b] font-bold border border-[#E8D8CF]">
              DIAN CUFE: Validador Activo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
