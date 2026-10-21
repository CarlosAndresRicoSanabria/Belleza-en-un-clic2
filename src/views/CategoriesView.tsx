import React from 'react';
import { ActiveView } from '../types';

interface CategoriesViewProps {
  onSelectCategory: (categoryKey: string) => void;
  onNavigate: (view: ActiveView) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  onSelectCategory,
  onNavigate,
}) => {
  const categories = [
    {
      id: 'facial',
      name: 'Cuidado Facial',
      subtitle: 'Limpieza, hidratación y barrera lipídica',
      count: '12 Fórmulas',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf2tszO_fl_7fdJnUsKIjALppfBJcDiU18Sr73Kcoksl619doy_8Sw8eAvdy3Ar31mmGn0yd3cZ06sIfnN--t2MqJJdkeQoBKg9m8JbToAIz6fvkc-_CEifOBYAZIj6odjwKxDHL5dSt5VfMvIQnp4cGX6vmUkQlP5_5xnyAYOwuOu8m2LqgFgBWUJubrj680j8_ssZ-Bs6SOrasY8giPJupOGw5W8ZqEDXr1s2j5ItPYUCfv6o73W',
      color: '#8a4853',
    },
    {
      id: 'serums',
      name: 'Sérums & Tratamientos',
      subtitle: 'Niacinamida, Ácido Hialurónico y Vitamina C',
      count: '8 Fórmulas',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQXQhLb-rTymgecPLtWGLGiVKUMWnIOCn8l3YeYtDgdix0r2YenKy3Q9JnzA4zAmb3R2Y4d5SAL_nrkjl_ZvRA8jIRpIlY7Jnqyj4Ty3OeuVdVgkyJt6Dtk4tDpRv3Sr3pPK9IY4zLaMvodKZgOd5y5L_5S-nt7Ur9I5gTDcZYl9e5asjTCOewH2Rv1ci9cPgn6voabHP0CgF2fu_978lHZ7d4T082pbPT3jFpTzIbnm0SGDL5EKUv',
      color: '#9c4048',
    },
    {
      id: 'maquillaje',
      name: 'Maquillaje Consciente',
      subtitle: 'Bases fluidas modulables, labiales velvet y correctores',
      count: '14 Tonos',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB13CFFUFKpTUqALYNBvMEBBW7LR5zmBE03zf7dQCZM9NjICzQR_oNoZ13R2KTOw-ipJeISnJIyRHmJOc9aTho9b6IXIEOfpXGBMwijnfWTbn247qpJoW094CxT-KaOZxsAnBclbU8qtp8ZN7SqWJon0lrJpGivG5pvNfnveCUnKVkVAZMZKUOu3SGMgBRdQLaY1G-Pm-TVMrTaKhnulrSEmLiqy9u7buvETx8bUsPmMHQGjk1OIgVx',
      color: '#B76E79',
    },
    {
      id: 'solar',
      name: 'Protección Solar Fotoestable',
      subtitle: 'Toque seco invisible, filtros minerales y SPF 50+',
      count: '6 Productos',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmwmI0C-Y35SOiIWFWNGERHDr4JZJrjYpG46abuA5EZ7x3XY4YrBXDsnFDy3Wqz85zb5eVl0d2EP79eeiYSvs9o46a9--Au2ofRIdlp1qUbpLnkx9jLGAtB_8GMZZkuA5fpaW03jhml7ZjF5n4usmAq6R0q7rHW2D4dCIGMyuTSi_-bDTN8LWwOWx_MCmObnVHJD_BoBqC-gwZWHVBQ3yfCVznnTnJ64OIaI0aWJtctC_NnBaR24AL',
      color: '#2e6743',
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1A1D]">Categorías Dermatológicas</h1>
        <p className="text-xs text-[#524345] mt-1">
          Fórmulas científicas clasificadas por objetivo clínico y necesidad cutánea
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id);
              onNavigate('catalogo');
            }}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-xs border border-[#E8D8CF] cursor-pointer hover:shadow-lg transition-all p-5 flex items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-1.5 flex-1 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a4853]">
                {cat.count}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1E1A1D] group-hover:text-[#8a4853] transition-colors">
                {cat.name}
              </h2>
              <p className="text-xs text-[#524345] leading-relaxed max-w-xs">{cat.subtitle}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#9c4048]">
                <span>Explorar Colección</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden bg-[#F4F3F0] shrink-0 border border-[#E8D8CF]">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
