import React, { useState } from 'react';
import { Product, Review } from '../types';
import { INITIAL_REVIEWS } from '../data/mockData';

interface ReviewsViewProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToast: (msg: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  product,
  onAddToCart,
  onToast,
}) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [starRatingInput, setStarRatingInput] = useState<number>(5);
  const [inputSkinType, setInputSkinType] = useState<'grasa' | 'mixta' | 'sensible' | 'seca'>('mixta');
  const [reviewText, setReviewText] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  const starLabels = [
    '1 estrella: No cumplió mis expectativas',
    '2 estrellas: Efecto muy regular',
    '3 estrellas: Bueno pero estándar',
    '4 estrellas: ¡Muy bueno! Cumple lo prometido',
    '5 estrellas: ¡Excelente! Santo grial para mi piel',
  ];

  const filteredReviews = reviews.filter((r) => {
    if (selectedSkinType === 'all') return true;
    if (selectedSkinType === 'grasa_mixta') return r.skinType === 'grasa' || r.skinType === 'mixta';
    if (selectedSkinType === 'sensible') return r.skinType === 'sensible';
    if (selectedSkinType === 'seca') return r.skinType === 'seca';
    if (selectedSkinType === 'fotos') return (r.images?.length ?? 0) > 0;
    return true;
  });

  const handlePublishReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      onToast('Por favor escribe tu opinión antes de enviar.');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: 'Sofía Gómez Arboleda',
      location: 'Bogotá D.C.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBahX2bkwFNwlNl79RGiLu0LbqbCR-wcPIh93ocbUxbrLgkl8uH3pKahmTTUz48RPQ1X9DI-48Crliziw0AdXFN7X6FONERA3arANSsdBdmaMxWo7IiM5vDYI0pP5ZUARnIK_Y6OGj9ER2hZmrHKcrzAr2dr2dhydgelRKAXnLug4FTsdi14BM0VqFxWa9pgbJ5kfv7w-XCi9WUe3Wpzm0Fx9bWeXi7gndzz8DoGmVd5Cg6PgfknBMj',
      isVerifiedBuyer: true,
      badge: 'Glow VIP Oro',
      rating: starRatingInput,
      title: '¡Fórmula excepcional para mi rutina matutina!',
      skinType: inputSkinType,
      usageDuration: 'Uso reciente',
      content: reviewText,
      date: 'Hoy mismo',
      helpfulCount: 1,
      images: hasPhoto
        ? ['https://lh3.googleusercontent.com/aida-public/AB6AXuD2vxnYmj9_xNiV7niXIOb20EydaJQOQfK0AQ8Kfid2CjV6Ow4VT6xWTMDsFb-auNPuM8_dOUt8bU1FvV7GfACtvByoSjC18MnLYUvX-HWy95BtHaSqOu6LgSiWZd3zCS4dDfcJJHhbMVcPQhgaI3VwRtfjql30gtOY81419nCcUmFF3rrGNgnR1MyyDv7aQL9sOyg8TBTb3BC4PDWqVNcxqfmrNoAodtR9vP1yKCtln0dnaHY_r778']
        : undefined,
    };

    setReviews([newRev, ...reviews]);
    setReviewText('');
    setHasPhoto(false);
    onToast('¡Reseña verificada publicada! Se acreditaron +200 Puntos Glow a tu cuenta.');
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-6">
      {/* Product Highlight Header */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#F4F3F0] shrink-0 border border-[#E8D8CF]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-[#8a4853]/10 text-[#8a4853] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Top Ventas #1
              </span>
              <span className="bg-[#2e6743]/10 text-[#2e6743] text-[10px] font-bold px-2 py-0.5 rounded-full">
                INVIMA {product.invimaCode}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#1E1A1D]">{product.name}</h1>
            <p className="text-xs text-[#524345]">{product.formulaNote} • {product.volume}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-[#857374] uppercase block">Precio</span>
            <span className="text-base font-bold text-[#1E1A1D]">
              ${new Intl.NumberFormat('es-CO').format(product.price)} COP
            </span>
          </div>
          <button
            onClick={() => {
              onAddToCart(product);
              onToast(`+1 "${product.name}" añadido al carrito`);
            }}
            className="px-5 py-2.5 rounded-full bg-[#9c4048] hover:bg-[#77242d] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* Ratings & Satisfaction Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E8D8CF] flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#f2e5e5]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8a4853] tracking-widest block">
              Evaluación Comunitaria
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1A1D]">
              Puntuación & Experiencia en Piel
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#2e6743]/10 text-[#2e6743] text-xs font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">shield_with_heart</span>
            <span>Cosmétovigilancia Activa</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FAF8F5] p-5 sm:p-6 rounded-xl border border-[#E8D8CF]">
          {/* Big score */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-bold text-[#1E1A1D] leading-none">4.8</span>
            <div className="flex items-center gap-1 text-[#E5A93C] my-2">
              {[1, 2, 3, 4].map((s) => (
                <span key={s} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                star_half
              </span>
            </div>
            <p className="text-xs font-semibold text-[#524345]">348 opiniones verificadas ante la DIAN</p>
            <div className="mt-2 bg-white px-3 py-1 rounded-full text-[#2e6743] text-[11px] font-bold border border-[#E8D8CF] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">thumb_up</span>
              <span>96% de compradoras lo recomienda</span>
            </div>
          </div>

          {/* Breakdown progress bars */}
          <div className="md:col-span-7 flex flex-col gap-2">
            {[
              { star: '5★', pct: 82 },
              { star: '4★', pct: 12 },
              { star: '3★', pct: 4 },
              { star: '2★', pct: 1 },
              { star: '1★', pct: 1 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-2.5 text-xs">
                <span className="w-6 font-bold text-[#1E1A1D]">{row.star}</span>
                <div className="flex-1 h-2 rounded-full bg-[#E8D8CF] overflow-hidden">
                  <div
                    className="h-full bg-[#8a4853] rounded-full transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-[#524345] font-semibold">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Perception Grid */}
        <div>
          <h4 className="text-xs font-bold text-[#524345] uppercase tracking-wider mb-2.5">
            Eficacia Percibida en Piel Colombiana
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
              <span className="text-xs text-[#201a1b] font-medium">Control poros / brillo</span>
              <span className="text-sm font-bold text-[#8a4853]">4.9</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
              <span className="text-xs text-[#201a1b] font-medium">Hidratación ligera</span>
              <span className="text-sm font-bold text-[#8a4853]">4.8</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
              <span className="text-xs text-[#201a1b] font-medium">Piel sensible</span>
              <span className="text-sm font-bold text-[#8a4853]">4.7</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8CF] flex items-center justify-between">
              <span className="text-xs text-[#201a1b] font-medium">Absorción rápida</span>
              <span className="text-sm font-bold text-[#8a4853]">5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Photo Gallery */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1E1A1D] flex items-center gap-1.5">
              <span>Piel Real / Resultados</span>
              <span className="material-symbols-outlined text-[#D8A49B] text-base">auto_awesome</span>
            </h3>
            <p className="text-xs text-[#524345]">Fotos sin filtro compartidas por compradoras</p>
          </div>
          <span className="text-xs text-[#8a4853] font-bold">138 fotos verificadas</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <div className="shrink-0 w-28 sm:w-32 h-36 sm:h-40 rounded-xl overflow-hidden relative shadow-xs border border-[#E8D8CF]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvLzFka6MBJscqpAQzpJjPpzB0sVioZs5CkjZ61KD0slsNDgCMXXXd7B1-V7U7mBMHlDiFa51dYt9vWRo09MOvezDTzUEZidJVDi5NSspa4kcu8cVucu-NwAVqV0J0EuQpNURFGQNn3KdVhnrZ6Y5Oqh5Co2bf4mNo5-aEKeJuRBMkhCztUzzETlcxGbXY96ZMXJrmisPCKr_hTQkkn5V5jWXUJxACkkOXR1AYAydr9srHUqy936Yj"
              alt="4 semanas Zona T"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
              <span className="text-white text-[10px] font-semibold">4 semanas • Zona T</span>
            </div>
          </div>

          <div className="shrink-0 w-28 sm:w-32 h-36 sm:h-40 rounded-xl overflow-hidden relative shadow-xs border border-[#E8D8CF]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxpeml53i-b3jmLicQoGfU8tkLBVMer0skGYz0aXpt7sN0IDInwZKPuntRJ5_WKxrNkwWPbxSTVuw-jBgxRv0rVYE5y_BoMJdbmX7vzeGFPx9GyG_jnYCrMCS6ZQugG9255hbgwCdE0CeM6WCPxrKTZAGWHKw0IbQ9qgT4TPLQbgA4i4yHh8grZ5Z84DMQRSM6GX6QnNEhXK85_EZnUFRrTupB33eWRtORpO4ex3OLAuTId_S_I4cW"
              alt="Textura acuosa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
              <span className="text-white text-[10px] font-semibold">Textura acuosa</span>
            </div>
          </div>

          <div className="shrink-0 w-28 sm:w-32 h-36 sm:h-40 rounded-xl overflow-hidden relative shadow-xs border border-[#E8D8CF]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTex0R5noRQhpWQGJGsPFDDswi1cqG5x_TdhCjqSjqn1EUiAg1Iq4n-yL-egv_mn61Ar8TUUkDSSAN22_RmW0_HgM4lGRInjhv-bTYy5T_kDcKOqiQRJAIiSq6lAsONgsTZd8-JZMexvLmuUo4U3v4GYh5lYGlnDO96xDZhh4zxKt3kpbrdq-tOE0UlnAqJpvn4uOddzuENXiClri0Vuh_39vmqauJldjPF73SIUKrk0shBPLNJhBf"
              alt="Día 21 Piel Mixta"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
              <span className="text-white text-[10px] font-semibold">Día 21 • Piel Mixta</span>
            </div>
          </div>

          <div className="shrink-0 w-28 sm:w-32 h-36 sm:h-40 rounded-xl bg-[#fef0f1] border border-[#ffd9dd] flex flex-col items-center justify-center text-center p-3 text-[#8a4853]">
            <span className="material-symbols-outlined text-3xl mb-1">add_a_photo</span>
            <span className="text-xs font-bold text-[#1E1A1D] leading-tight">+138 Fotos Reales</span>
            <span className="text-[10px] text-[#8a4853] mt-1 underline">Explorar todas</span>
          </div>
        </div>
      </div>

      {/* Skin Type Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSkinType('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedSkinType === 'all'
              ? 'bg-[#8a4853] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          Todas (348)
        </button>
        <button
          onClick={() => setSelectedSkinType('grasa_mixta')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedSkinType === 'grasa_mixta'
              ? 'bg-[#8a4853] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          Piel Grasa / Mixta (215)
        </button>
        <button
          onClick={() => setSelectedSkinType('sensible')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedSkinType === 'sensible'
              ? 'bg-[#8a4853] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          Piel Sensible (84)
        </button>
        <button
          onClick={() => setSelectedSkinType('fotos')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            selectedSkinType === 'fotos'
              ? 'bg-[#8a4853] text-white shadow-xs'
              : 'bg-white text-[#524345] border border-[#E8D8CF] hover:bg-[#fef0f1]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">photo_camera</span>
          <span>Con fotos reales</span>
        </button>
      </div>

      {/* Reviews Cards List */}
      <div className="flex flex-col gap-4">
        {filteredReviews.map((rev) => (
          <article
            key={rev.id}
            className="p-5 rounded-2xl bg-white shadow-xs border border-[#E8D8CF] flex flex-col gap-3.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatarUrl}
                  alt={rev.author}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ffd9dd]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs sm:text-sm font-bold text-[#1E1A1D]">{rev.author}</h5>
                    {rev.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#8a4853]/10 text-[#8a4853] text-[10px] font-bold">
                        {rev.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#524345] mt-0.5">
                    <span>{rev.location}</span>
                    <span>•</span>
                    {rev.isVerifiedBuyer && (
                      <span className="text-[#2e6743] font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>Compra Verificada DIAN</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-[#857374]">{rev.date}</span>
            </div>

            {/* Stars & Title */}
            <div>
              <div className="flex items-center gap-0.5 text-[#E5A93C] mb-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-base"
                    style={{ fontVariationSettings: i < Math.floor(rev.rating) ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <h6 className="text-sm font-bold text-[#1E1A1D]">{rev.title}</h6>
            </div>

            {/* Skin tags */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-[#fef0f1] text-[#8a4853] font-bold uppercase">
                Piel {rev.skinType}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#fef0f1] text-[#8a4853] font-medium">
                {rev.usageDuration}
              </span>
              {rev.climateNote && (
                <span className="px-2 py-0.5 rounded-full bg-[#f8ebeb] text-[#524345] font-medium">
                  {rev.climateNote}
                </span>
              )}
            </div>

            <p className="text-xs text-[#201a1b] leading-relaxed">{rev.content}</p>

            {/* Review images if any */}
            {rev.images && rev.images.length > 0 && (
              <div className="flex gap-2 pt-1">
                {rev.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Evidencia clienta"
                    className="w-20 h-20 rounded-xl object-cover border border-[#E8D8CF]"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#f2e5e5] text-xs text-[#524345]">
              <button
                type="button"
                onClick={() => onToast('¡Gracias por tu voto de utilidad!')}
                className="flex items-center gap-1 hover:text-[#8a4853] transition-colors"
              >
                <span className="material-symbols-outlined text-base">thumb_up</span>
                <span>Útil ({rev.helpfulCount})</span>
              </button>
              <button
                type="button"
                onClick={() => onToast('Reporte recibido para revisión dermocosmética.')}
                className="hover:underline text-[11px]"
              >
                Reportar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Review Creation Module with Glow Points Incentive */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-[#E8D8CF] flex flex-col gap-4">
        <div className="flex items-center justify-between bg-[#ffd9dd]/40 p-3.5 rounded-xl border border-[#ffd9dd]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#8a4853] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ★
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#1E1A1D]">
                Gana +150 Puntos Glow ($1.500 COP)
              </h4>
              <p className="text-[11px] text-[#524345]">Por calificar tu compra verificada</p>
            </div>
          </div>
          <span className="bg-[#b4f1c3] text-[#00210e] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            +50 con Foto
          </span>
        </div>

        <div className="text-center">
          <h3 className="text-sm sm:text-base font-bold text-[#1E1A1D]">
            ¿Cómo ha sido tu experiencia con este Sérum?
          </h3>
          <p className="text-xs text-[#524345]">Tu opinión ayuda a miles de mujeres colombianas a elegir mejor</p>
        </div>

        {/* Interactive Star Picker */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setStarRatingInput(val)}
                className="focus:outline-none transition-transform hover:scale-125"
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{
                    color: val <= starRatingInput ? '#E5A93C' : '#d7c1c3',
                    fontVariationSettings: val <= starRatingInput ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          <span className="text-xs text-[#8a4853] font-semibold mt-1">
            {starLabels[starRatingInput - 1]}
          </span>
        </div>

        <form onSubmit={handlePublishReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E1A1D] mb-1.5">
              Selecciona tu tipo de piel:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['grasa', 'mixta', 'seca', 'sensible'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInputSkinType(t)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all capitalize ${
                    inputSkinType === t
                      ? 'bg-[#8a4853] text-white shadow-xs'
                      : 'bg-[#F4F3F0] text-[#524345] hover:bg-[#fef0f1]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1A1D] mb-1.5">
              Cuéntanos tus resultados:
            </label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="¿Cómo sentiste la textura y qué cambios notaste en tus poros, brillo o luminosidad?"
              className="w-full p-3 bg-[#FAF8F5] rounded-xl text-xs text-[#201a1b] border border-[#E8D8CF] focus:bg-white resize-none"
              required
            />
          </div>

          {/* Photo attach toggle */}
          <div className="flex items-center justify-between bg-[#F4F3F0] p-3 rounded-xl border border-[#E8D8CF]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8a4853]">add_photo_alternate</span>
              <div>
                <p className="text-xs font-bold text-[#1E1A1D]">Sube foto de tu piel o textura</p>
                <p className="text-[10px] text-[#2E6B4F] font-semibold">¡Gana +50 puntos adicionales!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHasPhoto(!hasPhoto);
                onToast(hasPhoto ? 'Foto removida.' : 'Foto de prueba adjuntada (+50 pts).');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                hasPhoto ? 'bg-[#2E6B4F] text-white' : 'bg-white text-[#8a4853] border border-[#E8D8CF]'
              }`}
            >
              {hasPhoto ? 'Foto Adjuntada ✓' : 'Adjuntar Foto'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#8a4853] hover:bg-[#9c4048] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Publicar Reseña y Sumar 200 Puntos Glow</span>
          </button>
        </form>
      </div>
    </div>
  );
};
