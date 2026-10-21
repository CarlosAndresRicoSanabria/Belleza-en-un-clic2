import React, { useState, useMemo } from 'react';
import { Product, SedeId } from '../types';
import { SEDES_DATA } from '../data/mockData';

interface CatalogViewProps {
  products: Product[];
  currentSede: SedeId;
  onSelectSede: (sede: SedeId) => void;
  onAddToCart: (product: Product, selectedShade?: string) => void;
  onViewProductReviews: (product: Product) => void;
  searchQuery: string;
  categoryFilter?: string;
  onNavigateToCategory?: (category: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  currentSede,
  onSelectSede,
  onAddToCart,
  onViewProductReviews,
  searchQuery,
  categoryFilter,
}) => {
  // Filters state
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFilter ? [categoryFilter] : ['facial', 'maquillaje', 'serums', 'solar']
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([
    'RadiantSkin',
    'Glow Botanics',
    'L\'Éclat Paris',
    'Velvet Lab',
  ]);
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [sortBy, setSortBy] = useState<string>('populares');
  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const [selectedShades, setSelectedShades] = useState<Record<string, string>>({
    p3: '01 Nude Claro',
    p4: 'Rosa Nude',
  });
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const sedeInfo = SEDES_DATA[currentSede];

  // Filter & sort calculation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCategory = p.categoryLabel.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchSku && !matchCategory) return false;
        }

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
          return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Max price
        if (p.price > maxPrice) return false;

        // In-stock only for currently selected branch
        if (inStockOnly && (p.stock[currentSede] ?? 0) <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'menor-precio') return a.price - b.price;
        if (sortBy === 'mayor-precio') return b.price - a.price;
        if (sortBy === 'novedades') return b.id.localeCompare(a.id);
        // Default: más populares (rating * reviews)
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      });
  }, [products, searchQuery, selectedCategories, selectedBrands, maxPrice, inStockOnly, currentSede, sortBy]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const resetFilters = () => {
    setSelectedCategories(['facial', 'maquillaje', 'serums', 'solar']);
    setSelectedBrands(['RadiantSkin', 'Glow Botanics', 'L\'Éclat Paris', 'Velvet Lab']);
    setMaxPrice(250000);
    setInStockOnly(false);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  return (
    <div className="w-full">
      {/* Hero Banner Section */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-8 md:mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f8ebeb] via-[#fef0f1] to-[#FAF8F5] shadow-xs min-h-[400px] md:min-h-[440px] flex items-center border border-[#E8D8CF]/60">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#D8A49B]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/4 bottom-0 w-80 h-80 rounded-full bg-[#ffd9dd]/30 blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 w-full z-10 p-6 sm:p-10 lg:p-14 items-center gap-8">
            <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-white shadow-xs border border-[#E8D8CF]">
                <span className="w-2 h-2 rounded-full bg-[#2E6B4F] animate-pulse"></span>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#8a4853]">
                  Edición Botánica de Temporada
                </span>
              </div>

              <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#1E1A1D] tracking-tight max-w-xl font-bold leading-tight">
                Realza tu belleza natural con{' '}
                <span className="text-[#8a4853] italic">fórmulas certificadas</span> y entrega inmediata.
              </h1>

              <p className="text-sm md:text-base text-[#524345] max-w-lg leading-relaxed">
                Dermocosmética de vanguardia con trazabilidad en vivo por inventario local. Selecciona tu sede y recibe hoy mismo con factura electrónica DIAN.
              </p>

              {/* Sede Quick-Selector */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-white rounded-full p-1.5 flex items-center shadow-xs border border-[#E8D8CF]">
                  <span className="material-symbols-outlined text-[#8a4853] px-2 text-lg">pin_drop</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectSede('bogota')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        currentSede === 'bogota'
                          ? 'bg-[#9c4048] text-white shadow-xs'
                          : 'text-[#524345] hover:text-[#1E1A1D]'
                      }`}
                    >
                      Sede Bogotá
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectSede('medellin')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        currentSede === 'cali'
                          ? 'bg-[#9c4048] text-white shadow-xs'
                          : 'text-[#524345] hover:text-[#1E1A1D]'
                      }`}
                    >
                      Sede Cali
                    </button>
                  </div>
                </div>

                <a
                  href="#catalogo-seccion"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#8a4853] text-white text-xs font-bold shadow-xs hover:bg-[#a6606b] transition-all"
                >
                  <span>Explorar Colección</span>
                  <span className="material-symbols-outlined text-base">arrow_downward</span>
                </a>
              </div>

              {/* Badges footer */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-[#524345] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#2E6B4F] text-base">verified</span>
                  <span className="font-semibold">Aval INVIMA Vigente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#9c4048] text-base">bolt</span>
                  <span className="font-semibold">{sedeInfo.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Featured Product Presentation */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-[#F4F3F0] group border border-[#E8D8CF]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjFtfEK2cu0EfkM4gjGPWpKrHNcOpt4vdZngqoZ3CxOiZDGAf-MEiZSXVXT478_LRC9EWqqajXQgXJaNz75LwAwwNrMGDq92k6pONjWYe6oOzQXHqNTzvsBEQQ_sSIxJ9s3O9gt600MNDwhNZVyfagqGpK23AzGkyOgKmPC6BhWmT5772QVxAKXYo8wcWLY7c6Rqd2Ttaw6Q0SQK3GUB6bolrsX3j3dMVapdjZOBvrUeXcapvvGtUb"
                  alt="Colección Botánica de Temporada"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A1D]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-white/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8a4853] uppercase font-bold tracking-wider">
                        Destacado de la Semana
                      </span>
                      <p className="text-sm font-bold text-[#1E1A1D]">Rutina Iluminadora Dúo</p>
                    </div>
                    <span className="text-base font-bold text-[#9c4048]">$149.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Banner */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#E8D8CF]/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#fef0f1] flex items-center justify-center shrink-0 text-[#8a4853]">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1A1D]">Garantía de Originalidad</h3>
              <p className="text-xs text-[#524345] mt-1 leading-relaxed">
                Lotes directos de laboratorio con trazabilidad de origen y sello de esterilidad comprobada.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#E8D8CF]/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#fef0f1] flex items-center justify-center shrink-0 text-[#9c4048]">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1A1D]">Facturación Digital DIAN</h3>
              <p className="text-xs text-[#524345] mt-1 leading-relaxed">
                Emisión electrónica instantánea a tu correo con desglose tributario transparente y legal.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#E8D8CF]/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#fef0f1] flex items-center justify-center shrink-0 text-[#2e6743]">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1A1D]">Despacho Mismo Día</h3>
              <p className="text-xs text-[#524345] mt-1 leading-relaxed">
                Órdenes antes de las 2:00 PM procesadas inmediatamente desde el almacén de {sedeInfo.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid & Filters Section */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-16" id="catalogo-seccion">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 flex flex-col gap-5 sticky top-28">
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#E8D8CF]/80 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2e5e5]">
                <span className="text-sm font-bold text-[#1E1A1D] flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#8a4853]">tune</span>
                  Filtros
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#8a4853] hover:underline font-semibold"
                >
                  Limpiar todo
                </button>
              </div>

              {/* Sede Stock Filter */}
              <div className="p-3.5 rounded-xl bg-[#fef0f1] flex flex-col gap-1.5 border border-[#ffd9dd]">
                <span className="text-[10px] uppercase font-bold text-[#524345] tracking-wider">
                  Disponibilidad en Sede
                </span>
                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9c4048] accent-[#9c4048] focus:ring-0"
                  />
                  <span className="text-xs text-[#1E1A1D] font-semibold">
                    En stock inmediato ({sedeInfo.name})
                  </span>
                </label>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-[#1E1A1D] uppercase tracking-wider">
                  Categorías
                </span>
                <div className="flex flex-col gap-1.5 text-xs text-[#524345]">
                  <label className="flex items-center justify-between cursor-pointer py-1 hover:text-[#8a4853]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('facial')}
                        onChange={() => toggleCategory('facial')}
                        className="w-4 h-4 rounded accent-[#9c4048]"
                      />
                      <span>Cuidado Facial</span>
                    </div>
                    <span className="text-[10px] text-[#857374] font-semibold">12</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer py-1 hover:text-[#8a4853]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('maquillaje')}
                        onChange={() => toggleCategory('maquillaje')}
                        className="w-4 h-4 rounded accent-[#9c4048]"
                      />
                      <span>Maquillaje</span>
                    </div>
                    <span className="text-[10px] text-[#857374] font-semibold">6</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer py-1 hover:text-[#8a4853]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('serums')}
                        onChange={() => toggleCategory('serums')}
                        className="w-4 h-4 rounded accent-[#9c4048]"
                      />
                      <span>Sérums & Tratamientos</span>
                    </div>
                    <span className="text-[10px] text-[#857374] font-semibold">4</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer py-1 hover:text-[#8a4853]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('solar')}
                        onChange={() => toggleCategory('solar')}
                        className="w-4 h-4 rounded accent-[#9c4048]"
                      />
                      <span>Protección Solar</span>
                    </div>
                    <span className="text-[10px] text-[#857374] font-semibold">2</span>
                  </label>
                </div>
              </div>

              {/* Brands */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-[#1E1A1D] uppercase tracking-wider">
                  Marcas
                </span>
                <div className="flex flex-col gap-1.5 text-xs text-[#524345]">
                  {['Glow Botanics', 'RadiantSkin', 'L\'Éclat Paris', 'Velvet Lab'].map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#8a4853]">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded accent-[#9c4048]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#f2e5e5]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1A1D] uppercase tracking-wider">
                    Precio Máximo
                  </span>
                  <span className="text-xs text-[#9c4048] font-bold">
                    ${new Intl.NumberFormat('es-CO').format(maxPrice)} COP
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="250000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full accent-[#9c4048] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#857374]">
                  <span>$25.000 COP</span>
                  <span>$250.000 COP</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Feed */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            {/* Controls Bar */}
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E8D8CF]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-[#1E1A1D]">
                  {filteredProducts.length} productos en exhibición
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f8ebeb] text-[#524345] text-[10px] font-bold">
                  Stock Tiempo Real
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-1.5 bg-[#fef0f1] px-3 py-1.5 rounded-full border border-[#d7c1c3]/40">
                  <span className="text-xs text-[#524345]">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#1E1A1D] focus:outline-none cursor-pointer"
                  >
                    <option value="populares">Más populares</option>
                    <option value="menor-precio">Menor precio</option>
                    <option value="mayor-precio">Mayor precio</option>
                    <option value="novedades">Novedades</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-[#fef0f1] p-1 rounded-full border border-[#d7c1c3]/40">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 rounded-full transition-all ${
                      gridCols === 3 ? 'bg-white text-[#8a4853] shadow-xs' : 'text-[#524345] hover:text-[#1E1A1D]'
                    }`}
                    title="Vista 3 columnas"
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(2)}
                    className={`p-1.5 rounded-full transition-all ${
                      gridCols === 2 ? 'bg-white text-[#8a4853] shadow-xs' : 'text-[#524345] hover:text-[#1E1A1D]'
                    }`}
                    title="Vista 2 columnas"
                  >
                    <span className="material-symbols-outlined text-sm">view_agenda</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E8D8CF] p-8">
                <span className="material-symbols-outlined text-4xl text-[#d7c1c3] mb-2">search_off</span>
                <h3 className="text-base font-bold text-[#1E1A1D]">No se encontraron productos</h3>
                <p className="text-xs text-[#524345] mt-1 max-w-sm mx-auto">
                  Prueba ajustando los filtros de precio, sede o búsqueda para encontrar cosméticos disponibles.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-full bg-[#8a4853] text-white text-xs font-bold"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridCols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
                } gap-5 md:gap-6`}
              >
                {filteredProducts.map((product) => {
                  const stockInSede = product.stock[currentSede] ?? 0;
                  const isLowStock = stockInSede > 0 && stockInSede <= product.minRecommendedStock;
                  const isOutOfStock = stockInSede === 0;

                  return (
                    <article
                      key={product.id}
                      className="group p-4 md:p-5 rounded-2xl bg-white shadow-xs border border-[#E8D8CF]/80 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#8a4853]/40"
                    >
                      <div>
                        {/* Image Preview with Badge & Wishlist */}
                        <div className="relative w-full aspect-square rounded-xl bg-[#F4F3F0] overflow-hidden mb-3.5 border border-[#E8D8CF]/40">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {product.badge && (
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#8a4853] uppercase tracking-wider shadow-xs border border-white">
                              {product.badge}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleFavorite(product.id)}
                            aria-label="Guardar en lista de deseos"
                            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#8a4853] flex items-center justify-center hover:bg-white transition-all shadow-xs"
                          >
                            <span
                              className="material-symbols-outlined text-lg"
                              style={{ fontVariationSettings: favorites[product.id] ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              favorite
                            </span>
                          </button>
                        </div>

                        {/* Brand & Reviews button */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a4853]">
                            {product.brand}
                          </span>
                          <button
                            type="button"
                            onClick={() => onViewProductReviews(product)}
                            className="flex items-center gap-1 text-[#9c4048] text-[11px] font-semibold hover:underline"
                            title="Ver reseñas y fotos reales"
                          >
                            <span
                              className="material-symbols-outlined text-xs text-[#E5A93C]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>
                              {product.rating} ({product.reviewCount})
                            </span>
                          </button>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-[#1E1A1D] leading-snug line-clamp-2">
                          {product.name}
                        </h4>

                        {/* Description */}
                        <p className="text-xs text-[#524345] mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Shades selection (if any) */}
                        {product.shades && product.shades.length > 0 && (
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <span className="text-[10px] text-[#524345] font-semibold uppercase">
                              Tono:
                            </span>
                            <div className="flex items-center gap-1.5">
                              {product.shades.map((shade) => {
                                const isSelected = (selectedShades[product.id] || product.shades![0].name) === shade.name;
                                return (
                                  <button
                                    key={shade.name}
                                    type="button"
                                    onClick={() =>
                                      setSelectedShades((prev) => ({
                                        ...prev,
                                        [product.id]: shade.name,
                                      }))
                                    }
                                    style={{ backgroundColor: shade.colorHex }}
                                    className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${
                                      isSelected ? 'ring-2 ring-[#8a4853] scale-110 shadow-xs' : ''
                                    }`}
                                    title={shade.name}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-[10px] font-semibold text-[#1E1A1D] ml-1">
                              {selectedShades[product.id] || product.shades[0].name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Bottom: Stock pill & Price/CTA */}
                      <div className="pt-3.5 mt-2 border-t border-[#f2e5e5]/80">
                        {/* Live Branch Stock indicator */}
                        <div
                          className={`mb-3 px-3 py-1.5 rounded-full flex items-center justify-between text-[11px] font-semibold ${
                            isOutOfStock
                              ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                              : isLowStock
                              ? 'bg-[#B46522]/10 text-[#B46522]'
                              : 'bg-[#2E6B4F]/10 text-[#2E6B4F]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOutOfStock
                                  ? 'bg-[#ba1a1a]'
                                  : isLowStock
                                  ? 'bg-[#B46522]'
                                  : 'bg-[#2E6B4F] animate-pulse'
                              }`}
                            ></span>
                            <span>
                              Stock: {stockInSede} un. en {sedeInfo.name}
                            </span>
                          </div>
                          <span className="font-bold">
                            {isOutOfStock ? 'Agotado' : isLowStock ? 'Últimas uds.' : 'Inmediato'}
                          </span>
                        </div>

                        {/* Price & Add to Cart CTA */}
                        <div className="flex items-center justify-between pt-0.5">
                          <div>
                            <span className="text-[9px] text-[#857374] uppercase tracking-wider block font-semibold">
                              Precio Unitario
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-bold text-[#1E1A1D]">
                                ${new Intl.NumberFormat('es-CO').format(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10px] text-[#857374] line-through">
                                  ${new Intl.NumberFormat('es-CO').format(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onAddToCart(product, selectedShades[product.id])}
                            disabled={isOutOfStock}
                            className="px-4 py-2 rounded-full bg-[#9c4048] hover:bg-[#77242d] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs active:scale-95"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
