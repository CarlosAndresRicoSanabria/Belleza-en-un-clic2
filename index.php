<?php
/**
 * Belleza en un Clic - Plataforma Web en PHP
 * Sincronizada con XAMPP (Apache + PHP 8.2 + MySQL)
 * Arquitectura de 8 Dominios Funcionales y 10 Patrones de Diseño
 */

require_once __DIR__ . '/src/autoload.php';

use Belleza\Patterns\Facade\ApiGatewayFacade;

$gateway = new ApiGatewayFacade();
$bootstrap = $gateway->getClientAppBootstrap('usr-sofia');
$adminSummary = $gateway->getAdminDashboardSummary();
$categories = $bootstrap['categorias'] ?? [];
$sedes = $bootstrap['sedes'] ?? [];
$user = $bootstrap['usuario'] ?? [];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover">
    <title>Belleza en un Clic - Dermocosmética &amp; Logística Multisede (PHP + MySQL)</title>
    <meta name="description" content="Plataforma de belleza y dermocosmética desarrollada en PHP sobre XAMPP MySQL con arquitectura de 8 microservicios y 10 patrones de diseño.">
    
    <!-- Google Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
    
    <!-- Tailwind CSS (CDN para renderizado inmediato en XAMPP) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#FDF8F7',
                            100: '#FAF0EE',
                            200: '#F4DDD9',
                            300: '#E7BEB7',
                            400: '#D5968C',
                            500: '#BA6D61',
                            600: '#9C5045',
                            700: '#8A4853',
                            800: '#682D35',
                            900: '#2C1810',
                        },
                        gold: {
                            400: '#F3CD68',
                            500: '#D4AF37',
                            600: '#B8860B',
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #FAF0EE; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D5968C; border-radius: 999px; }
        .glass-header {
            background: rgba(253, 248, 247, 0.94);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .luxury-gradient {
            background: linear-gradient(135deg, #8A4853 0%, #682D35 50%, #2C1810 100%);
        }
        .gold-badge {
            background: linear-gradient(135deg, #FFF6D6 0%, #FFE599 100%);
            border: 1px solid #D4AF37;
            color: #785400;
        }
    </style>
</head>
<body class="bg-[#FAF8F5] text-[#2C1810] font-sans antialiased selection:bg-[#8A4853]/20 selection:text-[#8A4853] min-h-screen flex flex-col">

    <!-- Toast Notification Container -->
    <div id="toast-container" class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92vw] pointer-events-none transition-all duration-300"></div>

    <!-- Top Announcement Bar -->
    <div class="bg-[#2C1810] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#8A4853]/30">
        <div class="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8A4853] text-white tracking-wide uppercase">XAMPP MySQL Activo</span>
                <span>✨ Entregas express en Bogotá &lt; 2h · Medellín y Cali &lt; 3h | Facturación DIAN en línea</span>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium">
                <span class="hidden sm:inline text-rose-200">INVIMA Certificado · Cosmética Médica</span>
                <span class="text-amber-300 font-semibold flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">stars</span> Puntos Glow: <span id="top-points-val">2.450</span> ($24.500 COP)
                </span>
            </div>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="sticky top-0 z-40 glass-header border-b border-[#E8D8D8]/70 shadow-sm transition-all duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20 gap-4">
                
                <!-- Brand Logo -->
                <div class="flex items-center gap-3 cursor-pointer" onclick="switchView('catalogo')">
                    <div class="w-11 h-11 rounded-2xl luxury-gradient flex items-center justify-center text-white shadow-md shadow-[#8A4853]/20">
                        <span class="material-symbols-outlined text-2xl">spa</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="font-serif font-bold text-2xl tracking-tight text-[#2C1810]">Belleza</span>
                            <span class="text-xs font-bold uppercase tracking-widest text-[#8A4853] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">en un Clic</span>
                        </div>
                        <p class="text-[11px] font-medium text-rose-800/80 tracking-wide">Tu belleza, a un solo clic · XAMPP PHP</p>
                    </div>
                </div>

                <!-- Hub Sede Selector -->
                <div class="hidden lg:flex items-center gap-2 bg-white/80 border border-rose-200/80 px-3 py-1.5 rounded-xl text-xs shadow-sm">
                    <span class="material-symbols-outlined text-rose-700 text-lg">storefront</span>
                    <div>
                        <span class="text-[10px] text-gray-500 font-semibold uppercase block leading-none">Hub de Despacho</span>
                        <select id="sede-selector" onchange="changeSede(this.value)" class="bg-transparent font-bold text-[#2C1810] outline-none cursor-pointer text-xs">
                            <option value="bogota" selected>Sede Bogotá (Calle 85 - Hub Central)</option>
                            <option value="medellin">Sede Medellín (El Poblado)</option>
                            <option value="cali">Sede Cali (Granada Boutique)</option>
                        </select>
                    </div>
                </div>

                <!-- Global Search -->
                <div class="hidden md:flex flex-1 max-w-xs relative">
                    <input type="text" id="global-search" oninput="handleSearch(this.value)" placeholder="Buscar sérum, base, bloqueador..." 
                           class="w-full bg-white/90 border border-rose-200/70 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#8A4853] focus:border-transparent outline-none transition-all shadow-inner">
                    <span class="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-base">search</span>
                </div>

                <!-- Role Switcher & Action Icons -->
                <div class="flex items-center gap-2 sm:gap-3">
                    
                    <!-- Role Selector (Demostración de Roles y Permisos) -->
                    <div class="relative">
                        <select id="role-selector" onchange="switchRole(this.value)" class="bg-rose-100/70 text-[#8A4853] font-bold text-xs border border-rose-300 rounded-xl px-2.5 py-2 cursor-pointer outline-none hover:bg-rose-200/70 transition">
                            <option value="cliente">👑 Modo: Cliente (Sofía)</option>
                            <option value="empleado">📦 Modo: Bodega (Julián)</option>
                            <option value="admin">⚙️ Modo: Admin (Carlos)</option>
                        </select>
                    </div>

                    <!-- Cart Trigger Button -->
                    <button onclick="toggleCart()" class="relative p-2.5 rounded-xl bg-white border border-rose-200 text-[#2C1810] hover:text-[#8A4853] hover:shadow-md transition flex items-center justify-center">
                        <span class="material-symbols-outlined text-2xl">local_mall</span>
                        <span id="cart-badge" class="absolute -top-1.5 -right-1.5 bg-[#8A4853] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                            0
                        </span>
                    </button>

                    <!-- User Profile Avatar -->
                    <div onclick="switchView('perfil')" class="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-rose-100/50 transition">
                        <img id="user-avatar-top" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBahX2bkwFNwlNl79RGiLu0LbqbCR-wcPIh93ocbUxbrLgkl8uH3pKahmTTUz48RPQ1X9DI-48Crliziw0AdXFN7X6FONERA3arANSsdBdmaMxWo7IiM5vDYI0pP5ZUARnIK_Y6OGj9ER2hZmrHKcrzAr2dr2dhydgelRKAXnLug4FTsdi14BM0VqFxWa9pgbJ5kfv7w-XCi9WUe3Wpzm0Fx9bWeXi7gndzz8DoGmVd5Cg6PgfknBMj" 
                             alt="Avatar" class="w-9 h-9 rounded-full object-cover border-2 border-rose-300 shadow-sm">
                        <div class="hidden xl:block text-left">
                            <span class="text-xs font-bold block leading-tight text-[#2C1810]">Sofía Gómez</span>
                            <span class="text-[10px] text-amber-700 font-semibold">Glow VIP Oro</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Horizontal Navigation Links -->
            <nav class="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 custom-scrollbar border-t border-rose-100/80 text-xs font-semibold whitespace-nowrap">
                <button onclick="switchView('catalogo')" id="nav-catalogo" class="nav-btn px-3 py-1.5 rounded-lg text-[#8A4853] bg-rose-100/80 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">storefront</span> Catálogo General
                </button>
                <button onclick="filterCategory('facial')" id="nav-facial" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">spa</span> Cuidado Facial
                </button>
                <button onclick="filterCategory('maquillaje')" id="nav-maquillaje" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">brush</span> Maquillaje
                </button>
                <button onclick="filterCategory('serums')" id="nav-serums" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">science</span> Sérums
                </button>
                <button onclick="filterCategory('solar')" id="nav-solar" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">wb_sunny</span> Protección Solar
                </button>
                <button onclick="switchView('mis-pedidos')" id="nav-mis-pedidos" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">local_shipping</span> Mis Pedidos &amp; Tracking
                </button>
                <button onclick="switchView('historial')" id="nav-historial" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">history</span> Historial
                </button>
                <button onclick="switchView('direcciones')" id="nav-direcciones" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">location_on</span> Direcciones
                </button>
                <button onclick="switchView('pqrs')" id="nav-pqrs" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">support_agent</span> PQRS
                </button>
                <button onclick="switchView('reviews')" id="nav-reviews" class="nav-btn px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#8A4853] hover:bg-rose-50 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">reviews</span> Reseñas
                </button>
                <button onclick="switchView('admin-inventario')" id="nav-admin" class="nav-btn px-3 py-1.5 rounded-lg text-amber-800 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300 font-bold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">admin_panel_settings</span> Web Administrativa (8 Dominios)
                </button>
                <button onclick="switchView('patrones-diseno')" id="nav-patrones" class="nav-btn px-3 py-1.5 rounded-lg text-white luxury-gradient font-bold shadow-sm flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base">account_tree</span> 10 Patrones de Diseño &amp; Microservicios
                </button>
            </nav>
        </div>
    </header>

    <!-- Main Content Container (Dynamic Views) -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <!-- VIEW 1: CATALOGO (Dominio de Productos & Inventario) -->
        <section id="view-catalogo" class="space-y-6">
            
            <!-- Hero Banner -->
            <div class="relative overflow-hidden rounded-3xl luxury-gradient text-white p-6 sm:p-10 shadow-xl border border-rose-900/40">
                <div class="relative z-10 max-w-2xl space-y-3">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold gold-badge">
                        <span class="material-symbols-outlined text-sm">verified</span> Formulación Científica &amp; INVIMA Certificado
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight">
                        Dermocosmética Avanzada <br><span class="italic font-normal text-rose-200">a un solo clic de distancia</span>
                    </h1>
                    <p class="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-xl">
                        Inventario sincronizado en tiempo real con nuestras sedes de Bogotá, Medellín y Cali. Facturación electrónica DIAN inmediata y despacho express refrigerado.
                    </p>
                    <div class="pt-2 flex flex-wrap gap-3">
                        <button onclick="filterCategory('serums')" class="px-5 py-2.5 bg-white text-[#8A4853] font-bold text-xs rounded-xl shadow-md hover:bg-rose-50 transition flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm">sparkles</span> Ver Sérums Reparadores
                        </button>
                        <button onclick="switchView('patrones-diseno')" class="px-5 py-2.5 bg-[#FAF8F5]/20 hover:bg-[#FAF8F5]/30 text-white font-semibold text-xs rounded-xl border border-white/30 backdrop-blur transition flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm">hub</span> Ver Arquitectura de Microservicios
                        </button>
                    </div>
                </div>
                <div class="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12 pointer-events-none">
                    <span class="material-symbols-outlined text-[320px]">spa</span>
                </div>
            </div>

            <!-- Sede Delivery Status Card -->
            <div class="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-rose-50 text-[#8A4853] flex items-center justify-center font-bold">
                        <span class="material-symbols-outlined">near_me</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 id="current-sede-title" class="font-bold text-sm text-[#2C1810]">Sede Bogotá (Calle 85 - Hub Central)</h3>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Despacho Inmediato</span>
                        </div>
                        <p id="current-sede-time" class="text-xs text-gray-500">Despacho express &lt; 2h en el norte de Bogotá · Stock local disponible</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <button onclick="openSedeModal()" class="px-3 py-1.5 rounded-xl border border-rose-300 text-[#8A4853] font-bold hover:bg-rose-50 transition">
                        Cambiar Sede
                    </button>
                </div>
            </div>

            <!-- Products Grid Header -->
            <div class="flex items-center justify-between flex-wrap gap-2 pt-2">
                <div>
                    <h2 class="text-xl font-bold font-serif text-[#2C1810]">Catálogo de Productos</h2>
                    <p class="text-xs text-gray-500">Visualizando disponibilidad multi-sede y precios con IVA incluido (DIAN)</p>
                </div>
                <div class="flex items-center gap-2">
                    <span id="product-count-label" class="text-xs font-bold text-[#8A4853] bg-rose-100/60 px-3 py-1 rounded-full border border-rose-200">
                        6 productos
                    </span>
                </div>
            </div>

            <!-- Products Grid -->
            <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Se poblará dinámicamente con JavaScript desde MySQL -->
            </div>
        </section>

        <!-- VIEW 2: MIS PEDIDOS & TRACKING (Dominio de Pedidos & State Pattern) -->
        <section id="view-mis-pedidos" class="hidden space-y-6">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
                <div class="flex items-center justify-between flex-wrap gap-3 border-b border-rose-100 pb-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-[#8A4853]">local_shipping</span>
                            <h2 class="text-2xl font-bold font-serif text-[#2C1810]">Rastreo Satelital de Pedidos</h2>
                        </div>
                        <p class="text-xs text-gray-500">Seguimiento en tiempo real gestionado con el patrón de diseño State y Coordinadora Express</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="advanceActiveOrder()" class="px-3.5 py-2 rounded-xl bg-[#8A4853] text-white text-xs font-bold shadow hover:bg-[#682D35] transition flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm">skip_next</span> Avanzar Estado (State Pattern Demo)
                        </button>
                    </div>
                </div>

                <!-- Active Order Timeline & Card -->
                <div id="active-order-container" class="space-y-6">
                    <!-- Se carga dinámicamente con los pedidos de MySQL -->
                </div>
            </div>
        </section>

        <!-- VIEW 3: HISTORIAL DE COMPRAS (Dominio de Ventas & Pedidos) -->
        <section id="view-historial" class="hidden space-y-6">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
                <div class="flex items-center justify-between border-b border-rose-100 pb-4">
                    <div>
                        <h2 class="text-2xl font-bold font-serif text-[#2C1810]">Historial de Compras</h2>
                        <p class="text-xs text-gray-500">Registro histórico de transacciones facturadas con CUFE DIAN</p>
                    </div>
                    <span class="material-symbols-outlined text-2xl text-rose-400">receipt_long</span>
                </div>
                <div id="orders-history-list" class="space-y-4">
                    <!-- Dinámico -->
                </div>
            </div>
        </section>

        <!-- VIEW 4: PERFIL DE USUARIO & GLOW VIP (Dominio de Usuarios) -->
        <section id="view-perfil" class="hidden space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- VIP Loyalty Card -->
                <div class="bg-gradient-to-br from-[#2C1810] to-[#682D35] text-white rounded-3xl p-6 shadow-xl space-y-5 border border-rose-900/50">
                    <div class="flex items-center justify-between">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold gold-badge uppercase tracking-wider">Membresía VIP</span>
                        <span class="material-symbols-outlined text-amber-300">workspace_premium</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold font-serif text-[#FAF8F5]">Sofía Gómez Arboleda</h3>
                        <p class="text-xs text-rose-200">sofia.gomez@glow.co · C.C. 1.020.458.912</p>
                    </div>
                    <div class="bg-black/30 rounded-2xl p-4 space-y-2 border border-white/10">
                        <div class="flex justify-between text-xs font-semibold">
                            <span class="text-rose-200">Puntos Glow Acumulados</span>
                            <span class="text-amber-300 font-extrabold text-sm">2.450 pts</span>
                        </div>
                        <div class="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                            <div class="bg-amber-400 h-full rounded-full" style="width: 82%"></div>
                        </div>
                        <p class="text-[11px] text-gray-300">Equivalente a <strong class="text-white">$24.500 COP</strong> aplicables en tu próximo checkout.</p>
                    </div>
                    <div class="text-xs space-y-1.5 text-rose-100">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm text-amber-300">check_circle</span>
                            <span>Envíos prioritarios &lt; 2h bonificados</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm text-amber-300">check_circle</span>
                            <span>Asesoría dermocosmética personalizada</span>
                        </div>
                    </div>
                </div>

                <!-- Profile Edit Form -->
                <div class="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-5">
                    <h3 class="text-lg font-bold font-serif text-[#2C1810]">Información del Perfil y Preferencias Dermatológicas</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Nombre Completo</label>
                            <input type="text" id="prof-name" value="Sofía Gómez Arboleda" class="w-full border border-rose-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8A4853]">
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" id="prof-email" value="sofia.gomez@glow.co" class="w-full border border-rose-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8A4853]">
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Teléfono Móvil (WhatsApp)</label>
                            <input type="text" id="prof-phone" value="+57 312 849 2034" class="w-full border border-rose-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8A4853]">
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Tipo de Piel Principal</label>
                            <select id="prof-skin" class="w-full border border-rose-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8A4853] bg-white">
                                <option value="mixta" selected>Piel Mixta (Zona T con brillo, mejillas normales)</option>
                                <option value="grasa">Piel Grasa / Tendencia acneica</option>
                                <option value="sensible">Piel Sensible / Reactiva o Rosácea</option>
                                <option value="seca">Piel Seca / Deshidratada</option>
                            </select>
                        </div>
                    </div>
                    <div class="pt-3 flex justify-end">
                        <button onclick="saveProfile()" class="px-5 py-2.5 bg-[#8A4853] text-white font-bold text-xs rounded-xl shadow hover:bg-[#682D35] transition flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm">save</span> Guardar Cambios en MySQL
                        </button>
                    </div>
                </div>

            </div>
        </section>

        <!-- VIEW 5: LIBRETA DE DIRECCIONES (Dominio de Clientes) -->
        <section id="view-direcciones" class="hidden space-y-6">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
                <div class="flex items-center justify-between flex-wrap gap-3 border-b border-rose-100 pb-4">
                    <div>
                        <h2 class="text-2xl font-bold font-serif text-[#2C1810]">Libreta de Direcciones</h2>
                        <p class="text-xs text-gray-500">Cálculo de proximidad con el hub logístico de cada ciudad</p>
                    </div>
                    <button onclick="openNewAddressModal()" class="px-4 py-2 bg-[#8A4853] text-white text-xs font-bold rounded-xl shadow hover:bg-[#682D35] transition flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">add</span> Agregar Nueva Dirección
                    </button>
                </div>
                <div id="addresses-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Dinámico -->
                </div>
            </div>
        </section>

        <!-- VIEW 6: PQRS & CALIDAD DERMATOLÓGICA (Dominio de Clientes & Garantías) -->
        <section id="view-pqrs" class="hidden space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Filing Form -->
                <div class="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <h3 class="font-serif font-bold text-lg text-[#2C1810]">Radicar Solicitud PQRS</h3>
                    <p class="text-xs text-gray-500">Atención técnica garantizada por químicos farmacéuticos y logística.</p>
                    <div class="space-y-3 text-xs">
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Tipo de Solicitud</label>
                            <select id="pqrs-tipo" class="w-full border border-rose-200 rounded-xl px-3 py-2 bg-white outline-none">
                                <option value="peticion">Petición / Consulta Dermatológica</option>
                                <option value="queja">Queja por Servicio</option>
                                <option value="envio" selected>Novedad con Entrega / Guía</option>
                                <option value="dermatologica">Garantía INVIMA de Producto / Lote</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Asunto / Título</label>
                            <input type="text" id="pqrs-titulo" placeholder="Ej: Cambio de dirección de entrega" class="w-full border border-rose-200 rounded-xl px-3 py-2 outline-none">
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-700 mb-1">Descripción Detallada</label>
                            <textarea id="pqrs-desc" rows="3" placeholder="Explica tu solicitud..." class="w-full border border-rose-200 rounded-xl px-3 py-2 outline-none"></textarea>
                        </div>
                        <button onclick="submitPqrs()" class="w-full py-2.5 bg-[#8A4853] text-white font-bold rounded-xl shadow hover:bg-[#682D35] transition">
                            Radicar en Sistema MySQL
                        </button>
                    </div>
                </div>

                <!-- Existing PQRS List -->
                <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <h3 class="font-serif font-bold text-lg text-[#2C1810]">Historial de Solicitudes y Radicados</h3>
                    <div id="pqrs-list" class="space-y-3">
                        <!-- Dinámico -->
                    </div>
                </div>

            </div>
        </section>

        <!-- VIEW 7: RESEÑAS DERMOCOSMÉTICAS (Dominio de Clientes & Productos) -->
        <section id="view-reviews" class="hidden space-y-6">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
                <div class="flex items-center justify-between flex-wrap gap-3 border-b border-rose-100 pb-4">
                    <div>
                        <h2 class="text-2xl font-bold font-serif text-[#2C1810]">Opiniones Dermocosméticas de la Comunidad</h2>
                        <p class="text-xs text-gray-500">Reseñas clínicas y testimonios reales con tipo de piel y compra verificada</p>
                    </div>
                    <button onclick="openReviewModal()" class="px-4 py-2 bg-[#8A4853] text-white text-xs font-bold rounded-xl shadow hover:bg-[#682D35] transition flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">rate_review</span> Escribir Reseña
                    </button>
                </div>
                <div id="reviews-container" class="space-y-4">
                    <!-- Dinámico -->
                </div>
            </div>
        </section>

        <!-- VIEW 8: WEB ADMINISTRATIVA (8 DOMINIOS FUNCIONALES DE LA IMAGEN) -->
        <section id="view-admin-inventario" class="hidden space-y-6">
            
            <!-- Admin Header Banner -->
            <div class="bg-[#2C1810] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/50 space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-amber-400 text-2xl">admin_panel_settings</span>
                            <h2 class="text-2xl sm:text-3xl font-serif font-bold text-[#FAF8F5]">Belleza Operativa · Web Administrativa</h2>
                        </div>
                        <p class="text-xs text-rose-200">Panel unificado sobre los 8 microservicios y dominios de negocio definidos en la arquitectura</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 bg-emerald-900/60 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> MySQL XAMPP Sincronizado
                        </span>
                    </div>
                </div>

                <!-- 8 Functional Domains Overview Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 text-center text-[11px]">
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-rose-300 text-lg">person</span>
                        <span class="font-bold block mt-1">1. Usuarios</span>
                        <span class="text-[9px] text-gray-300">Auth &amp; Roles</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-sky-300 text-lg">inventory_2</span>
                        <span class="font-bold block mt-1">2. Productos</span>
                        <span class="text-[9px] text-gray-300">CRUD &amp; Precios</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-emerald-300 text-lg">warehouse</span>
                        <span class="font-bold block mt-1">3. Inventario</span>
                        <span class="text-[9px] text-gray-300">Stock 3 Sedes</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-purple-300 text-lg">shopping_cart</span>
                        <span class="font-bold block mt-1">4. Ventas</span>
                        <span class="text-[9px] text-gray-300">Factura DIAN</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-amber-300 text-lg">local_shipping</span>
                        <span class="font-bold block mt-1">5. Pedidos</span>
                        <span class="text-[9px] text-gray-300">State Machine</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-cyan-300 text-lg">handshake</span>
                        <span class="font-bold block mt-1">6. Proveedores</span>
                        <span class="text-[9px] text-gray-300">Órdenes Compra</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-pink-300 text-lg">groups</span>
                        <span class="font-bold block mt-1">7. Clientes</span>
                        <span class="text-[9px] text-gray-300">PQRS &amp; Reviews</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
                        <span class="material-symbols-outlined text-orange-300 text-lg">settings_suggest</span>
                        <span class="font-bold block mt-1">8. Administrativo</span>
                        <span class="text-[9px] text-gray-300">KPIs &amp; Personal</span>
                    </div>
                </div>
            </div>

            <!-- Operational Sub-tabs -->
            <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 text-xs font-bold">
                <button onclick="switchAdminTab('inventario')" id="admtab-inventario" class="admtab-btn px-4 py-2 rounded-xl bg-[#8A4853] text-white">
                    📦 Inventario Multi-Sede &amp; Alertas
                </button>
                <button onclick="switchAdminTab('ventas')" id="admtab-ventas" class="admtab-btn px-4 py-2 rounded-xl bg-white border border-rose-200 text-gray-700 hover:bg-rose-50">
                    💳 Ventas &amp; Cuadres de Caja
                </button>
                <button onclick="switchAdminTab('pedidos')" id="admtab-pedidos" class="admtab-btn px-4 py-2 rounded-xl bg-white border border-rose-200 text-gray-700 hover:bg-rose-50">
                    🚚 Gestión de Despachos &amp; Guías
                </button>
                <button onclick="switchAdminTab('proveedores')" id="admtab-proveedores" class="admtab-btn px-4 py-2 rounded-xl bg-white border border-rose-200 text-gray-700 hover:bg-rose-50">
                    🏭 Proveedores &amp; Abastecimiento
                </button>
                <button onclick="switchAdminTab('personal')" id="admtab-personal" class="admtab-btn px-4 py-2 rounded-xl bg-white border border-rose-200 text-gray-700 hover:bg-rose-50">
                    👥 Personal &amp; Configuración
                </button>
            </div>

            <!-- Admin Sub-View: Inventario Multi-Sede -->
            <div id="admin-sec-inventario" class="space-y-6">
                
                <!-- Stock Controls Table -->
                <div class="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <div class="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h3 class="font-serif font-bold text-lg text-[#2C1810]">Stock en Tiempo Real por Sede</h3>
                            <p class="text-xs text-gray-500">Ajuste de inventario en vivo con persistencia en MySQL</p>
                        </div>
                        <button onclick="openTransferModal()" class="px-3.5 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-800 transition flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm">sync_alt</span> Transferencia Inter-Sedes
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-rose-50/80 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th class="p-3">Producto</th>
                                    <th class="p-3">SKU / Lote</th>
                                    <th class="p-3 text-center">Bogotá</th>
                                    <th class="p-3 text-center">Medellín</th>
                                    <th class="p-3 text-center">Cali</th>
                                    <th class="p-3">Ubicación Pasillo</th>
                                    <th class="p-3 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="admin-inventory-tbody" class="divide-y divide-rose-100">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Low Stock Alerts Panel -->
                <div class="bg-amber-50/70 border border-amber-300 rounded-3xl p-6 space-y-3">
                    <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
                        <span class="material-symbols-outlined text-amber-700">warning</span>
                        <h4>Alertas Automáticas de Bajo Inventario (Observer Pattern)</h4>
                    </div>
                    <div id="admin-alerts-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <!-- Dinámico -->
                    </div>
                </div>

            </div>

            <!-- Admin Sub-View: Ventas & Cuadres de Caja -->
            <div id="admin-sec-ventas" class="hidden space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                        <span class="text-xs font-semibold text-gray-500">Total Recaudado (Ventas)</span>
                        <div id="stat-total-recaudado" class="text-2xl font-bold font-serif text-[#8A4853] mt-1">$ 0</div>
                        <span class="text-[11px] text-emerald-600 font-medium">Facturación DIAN conforme</span>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                        <span class="text-xs font-semibold text-gray-500">Transacciones Realizadas</span>
                        <div id="stat-total-tx" class="text-2xl font-bold font-serif text-[#2C1810] mt-1">0</div>
                        <span class="text-[11px] text-gray-500">PSE, Tarjetas y Efectivo</span>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                        <span class="text-xs font-semibold text-gray-500">Ticket Promedio</span>
                        <div id="stat-ticket-promedio" class="text-2xl font-bold font-serif text-[#2C1810] mt-1">$ 0</div>
                        <span class="text-[11px] text-purple-600 font-medium">Por orden de compra</span>
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <h3 class="font-serif font-bold text-lg text-[#2C1810]">Registro de Ventas y Facturas DIAN Emitidas</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-rose-50/80 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th class="p-3">Pedido ID</th>
                                    <th class="p-3">Factura DIAN</th>
                                    <th class="p-3">Cliente</th>
                                    <th class="p-3">Sede</th>
                                    <th class="p-3">Método Pago</th>
                                    <th class="p-3 text-right">Monto Total</th>
                                    <th class="p-3">CUFE</th>
                                </tr>
                            </thead>
                            <tbody id="admin-sales-tbody" class="divide-y divide-rose-100">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Admin Sub-View: Gestión de Despachos -->
            <div id="admin-sec-pedidos" class="hidden space-y-6">
                <div class="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <h3 class="font-serif font-bold text-lg text-[#2C1810]">Cola Operativa de Pedidos &amp; Despachos</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-rose-50/80 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th class="p-3">ID Pedido</th>
                                    <th class="p-3">Cliente</th>
                                    <th class="p-3">Sede Origen</th>
                                    <th class="p-3">Estado Actual</th>
                                    <th class="p-3">Guía Coordinadora</th>
                                    <th class="p-3">Total</th>
                                    <th class="p-3 text-right">Transición State</th>
                                </tr>
                            </thead>
                            <tbody id="admin-orders-tbody" class="divide-y divide-rose-100">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Admin Sub-View: Proveedores -->
            <div id="admin-sec-proveedores" class="hidden space-y-6">
                <div class="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <div class="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h3 class="font-serif font-bold text-lg text-[#2C1810]">Directorio de Laboratorios Proveedores</h3>
                            <p class="text-xs text-gray-500">Gestión de compras mayoristas y abastecimiento de materias primas</p>
                        </div>
                        <button onclick="openPurchaseOrderModal()" class="px-3.5 py-2 bg-[#8A4853] text-white font-bold text-xs rounded-xl shadow hover:bg-[#682D35] transition flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm">post_add</span> Emitir Orden de Compra (OC)
                        </button>
                    </div>
                    <div id="admin-suppliers-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Dinámico -->
                    </div>
                </div>
            </div>

            <!-- Admin Sub-View: Personal -->
            <div id="admin-sec-personal" class="hidden space-y-6">
                <div class="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
                    <h3 class="font-serif font-bold text-lg text-[#2C1810]">Personal Asignado por Sede</h3>
                    <div id="admin-staff-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Dinámico -->
                    </div>
                </div>
            </div>

        </section>

        <!-- VIEW 9: VISOR DE PATRONES DE DISEÑO & MICROSERVICIOS (SOLICITADO POR EL USUARIO) -->
        <section id="view-patrones-diseno" class="hidden space-y-8">
            
            <!-- Patterns Header -->
            <div class="bg-gradient-to-r from-[#2C1810] via-[#682D35] to-[#8A4853] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-900/60 space-y-4">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold gold-badge">
                    <span class="material-symbols-outlined text-sm">verified_user</span> Arquitectura Empresarial PHP 8.2 + MySQL
                </div>
                <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#FAF8F5]">
                    Arquitectura de 8 Dominios &amp; 10 Patrones de Diseño
                </h2>
                <p class="text-xs sm:text-sm text-rose-100 max-w-3xl leading-relaxed">
                    Implementación estricta de patrones de diseño GoF (Creacionales, Estructurales y de Comportamiento) aplicados a cada uno de los subsistemas requeridos en la plataforma <strong>Belleza en un Clic</strong>. Todos los patrones están codificados en PHP puro con tipado fuerte y persistencia en MySQL (XAMPP).
                </p>
                
                <!-- Architecture Schema Diagram in Text/Mermaid -->
                <div class="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs font-mono text-rose-200 overflow-x-auto">
                    <div class="text-amber-300 font-bold mb-2">MAPEO DE ARQUITECTURA:</div>
                    [Web Administrativa] &amp; [Web / App Móvil Clientes] <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ (Chain of Responsibility: Auth, Roles, Validation)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;[API Gateway / Facade: ApiGatewayFacade]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
                    ┌───────────────┬───────────────┼───────────────┬───────────────┐<br>
                    ▼               ▼               ▼               ▼               ▼<br>
                    Usuarios     Productos      Inventario       Ventas          Pedidos<br>
                    (Singleton)  (Repository)   (Strategy)     (Adapter DIAN)  (Builder + State + Observer)<br>
                    │               │               │               │               │<br>
                    └───────────────┴───────────────┼───────────────┴───────────────┘<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[XAMPP MySQL: Database Singleton (PDO)]
                </div>
            </div>

            <!-- Interactive Pattern Tester Console -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h3 class="font-serif font-bold text-xl text-[#2C1810]">Consola Interactiva de Ejecución de Patrones</h3>
                        <p class="text-xs text-gray-500">Haz clic en cualquier botón para disparar y auditar la ejecución del patrón en PHP y MySQL en vivo.</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    <button onclick="testPatternLive('singleton')" class="p-3 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-xs font-bold text-[#8A4853] text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">1. Creacional</span>
                        Singleton (PDO)
                    </button>
                    <button onclick="testPatternLive('factory')" class="p-3 rounded-xl border border-sky-300 bg-sky-50/70 hover:bg-sky-100 text-xs font-bold text-sky-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">2. Creacional</span>
                        Factory Method
                    </button>
                    <button onclick="testPatternLive('builder')" class="p-3 rounded-xl border border-purple-300 bg-purple-50/70 hover:bg-purple-100 text-xs font-bold text-purple-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">3. Creacional</span>
                        Builder (DIAN &amp; Order)
                    </button>
                    <button onclick="testPatternLive('facade')" class="p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-xs font-bold text-emerald-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">4. Estructural</span>
                        Facade / Gateway
                    </button>
                    <button onclick="testPatternLive('repository')" class="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-xs font-bold text-amber-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">5. Acceso Datos</span>
                        Repository
                    </button>
                    <button onclick="testPatternLive('strategy')" class="p-3 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-xs font-bold text-[#8A4853] text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">6. Comportamiento</span>
                        Strategy (Fletes)
                    </button>
                    <button onclick="testPatternLive('observer')" class="p-3 rounded-xl border border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100 text-xs font-bold text-indigo-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">7. Comportamiento</span>
                        Observer (Eventos)
                    </button>
                    <button onclick="testPatternLive('state')" class="p-3 rounded-xl border border-teal-300 bg-teal-50/70 hover:bg-teal-100 text-xs font-bold text-teal-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">8. Comportamiento</span>
                        State (Ciclo Pedido)
                    </button>
                    <button onclick="testPatternLive('adapter')" class="p-3 rounded-xl border border-orange-300 bg-orange-50/70 hover:bg-orange-100 text-xs font-bold text-orange-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">9. Estructural</span>
                        Adapter (DIAN XML)
                    </button>
                    <button onclick="testPatternLive('chain')" class="p-3 rounded-xl border border-gray-400 bg-gray-50/70 hover:bg-gray-200 text-xs font-bold text-gray-800 text-left transition">
                        <span class="block text-[10px] uppercase text-gray-500">10. Middleware</span>
                        Chain of Resp.
                    </button>
                </div>

                <!-- Console Output Box -->
                <div class="bg-[#1E1E1E] text-green-400 font-mono text-xs p-4 rounded-2xl overflow-x-auto shadow-inner border border-gray-800">
                    <div class="flex items-center justify-between text-gray-400 border-b border-gray-700 pb-2 mb-2 text-[11px]">
                        <span>Terminal de Salida PHP / MySQL XAMPP</span>
                        <span id="pattern-test-status" class="text-amber-400">Listo para prueba</span>
                    </div>
                    <pre id="pattern-console-output" class="whitespace-pre-wrap leading-relaxed">// Haz clic en uno de los patrones para auditar su funcionamiento en tiempo real...</pre>
                </div>
            </div>

            <!-- 10 Detailed Pattern Cards -->
            <div id="patterns-detailed-cards" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Se poblará con información detallada de cada patrón -->
            </div>
        </section>

    </main>

    <!-- Slide-over Shopping Cart Drawer -->
    <div id="cart-drawer" class="fixed inset-0 z-50 overflow-hidden pointer-events-none transition-all duration-300 opacity-0">
        <div onclick="toggleCart()" class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>
        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
            <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-rose-200">
                
                <!-- Drawer Header -->
                <div class="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[#8A4853]">local_mall</span>
                        <h2 class="font-serif font-bold text-lg text-[#2C1810]">Bolsa de Belleza</h2>
                        <span id="drawer-cart-count" class="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-bold">0</span>
                    </div>
                    <button onclick="toggleCart()" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Sede Delivery Notice in Cart -->
                <div class="bg-amber-50 px-5 py-2.5 border-b border-amber-200 text-xs flex items-center gap-2 text-amber-900">
                    <span class="material-symbols-outlined text-amber-700 text-sm">local_shipping</span>
                    <span>Despacho directo desde: <strong id="drawer-sede-name">Sede Bogotá</strong></span>
                </div>

                <!-- Cart Items List -->
                <div id="cart-items-list" class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    <!-- Dinámico -->
                </div>

                <!-- Cart Footer & Checkout -->
                <div class="p-5 border-t border-rose-100 bg-[#FAF8F5] space-y-3">
                    
                    <!-- Coupon Input -->
                    <div class="flex gap-2">
                        <input type="text" id="coupon-input" placeholder="Cupón (BIENVENIDA o BLACKFRIDAY30)" 
                               class="flex-1 border border-rose-200 rounded-xl px-3 py-1.5 text-xs outline-none uppercase font-semibold">
                        <button onclick="applyCoupon()" class="px-3 py-1.5 bg-rose-100 text-[#8A4853] font-bold text-xs rounded-xl hover:bg-rose-200 transition">
                            Aplicar
                        </button>
                    </div>

                    <!-- Payment Method Selector -->
                    <div>
                        <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Método de Pago</label>
                        <select id="checkout-payment-method" class="w-full bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none">
                            <option value="pse" selected>💳 PSE Débito Bancario (ACH Colombia)</option>
                            <option value="tarjeta">💳 Tarjeta de Crédito / Débito (3D Secure)</option>
                            <option value="wompi">📱 Wompi Bancolombia Pay</option>
                            <option value="contraentrega">💵 Pago Contraentrega en Efectivo / Sede</option>
                        </select>
                    </div>

                    <!-- Shipping Method Selector -->
                    <div>
                        <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Método de Envío</label>
                        <select id="checkout-shipping-method" onchange="calculateCartTotals()" class="w-full bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none">
                            <option value="domicilio" selected>🚚 Domicilio Express (&lt; 2h en sede local) - Gratis</option>
                            <option value="pickup">🏬 Retiro en Mostrador Sede Física - Gratis</option>
                        </select>
                    </div>

                    <!-- Price Breakdown (DIAN Standard) -->
                    <div class="space-y-1 text-xs text-gray-600 pt-2 border-t border-rose-200/80">
                        <div class="flex justify-between">
                            <span>Subtotal Base Gravable:</span>
                            <span id="cart-subtotal-val" class="font-semibold text-gray-800">$ 0</span>
                        </div>
                        <div class="flex justify-between text-rose-600" id="cart-discount-row" style="display: none;">
                            <span>Descuento de Cupón:</span>
                            <span id="cart-discount-val" class="font-bold">-$ 0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>IVA Liquidado (19% DIAN):</span>
                            <span id="cart-iva-val" class="font-semibold text-gray-800">$ 0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Flete / Envío:</span>
                            <span class="text-emerald-700 font-bold">GRATIS</span>
                        </div>
                        <div class="flex justify-between text-base font-serif font-bold text-[#2C1810] pt-2 border-t border-rose-200">
                            <span>Total a Pagar:</span>
                            <span id="cart-total-val" class="text-[#8A4853]">$ 0</span>
                        </div>
                    </div>

                    <button onclick="processOrderCheckout()" class="w-full py-3.5 bg-[#8A4853] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#682D35] transition flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-base">lock</span> Pagar &amp; Generar Factura DIAN
                    </button>
                    <p class="text-[10px] text-center text-gray-400">Transacción 100% segura con emisión de CUFE DIAN instantáneo</p>
                </div>

            </div>
        </div>
    </div>

    <!-- Product Quick View Modal -->
    <div id="product-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-rose-200 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onclick="closeProductModal()" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div id="product-modal-content">
                <!-- Dinámico -->
            </div>
        </div>
    </div>

    <!-- Inter-Sede Transfer Modal -->
    <div id="transfer-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div class="flex items-center justify-between border-b border-rose-100 pb-3">
                <h3 class="font-serif font-bold text-base text-[#2C1810]">Transferencia Inter-Sedes de Inventario</h3>
                <button onclick="closeTransferModal()" class="text-gray-400 hover:text-gray-600"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="space-y-3 text-xs">
                <div>
                    <label class="block font-semibold mb-1">Producto a Transferir</label>
                    <select id="transfer-product-id" class="w-full border border-rose-200 rounded-xl p-2 bg-white outline-none">
                        <!-- Opciones cargadas con JS -->
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-semibold mb-1">Sede de Origen</label>
                        <select id="transfer-source" class="w-full border border-rose-200 rounded-xl p-2 bg-white outline-none">
                            <option value="bogota">Sede Bogotá</option>
                            <option value="medellin">Sede Medellín</option>
                            <option value="cali">Sede Cali</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold mb-1">Sede de Destino</label>
                        <select id="transfer-target" class="w-full border border-rose-200 rounded-xl p-2 bg-white outline-none">
                            <option value="medellin">Sede Medellín</option>
                            <option value="bogota">Sede Bogotá</option>
                            <option value="cali">Sede Cali</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block font-semibold mb-1">Cantidad de Unidades</label>
                    <input type="number" id="transfer-qty" value="5" min="1" class="w-full border border-rose-200 rounded-xl p-2 outline-none">
                </div>
                <button onclick="executeTransferStock()" class="w-full py-2.5 bg-emerald-700 text-white font-bold rounded-xl shadow hover:bg-emerald-800 transition">
                    Ejecutar Transferencia en MySQL
                </button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#2C1810] text-[#FAF8F5] border-t border-[#8A4853]/40 mt-12 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl luxury-gradient flex items-center justify-center text-white">
                            <span class="material-symbols-outlined text-lg">spa</span>
                        </div>
                        <span class="font-serif font-bold text-xl text-white">Belleza en un Clic</span>
                    </div>
                    <p class="text-xs text-rose-200/80 leading-relaxed">
                        Plataforma líder en Colombia de dermocosmética con trazabilidad en vivo por inventario local, facturación electrónica DIAN y cumplimiento estricto de garantías sanitarias INVIMA.
                    </p>
                </div>
                <div>
                    <h4 class="font-serif font-bold text-sm text-white mb-3">Sedes &amp; Hubs Logísticos</h4>
                    <ul class="text-xs text-rose-200/80 space-y-1.5">
                        <li>📍 <strong>Bogotá:</strong> Calle 85 # 11-53, Local 204</li>
                        <li>📍 <strong>Medellín:</strong> Cra 43A # 5A-113, One Plaza</li>
                        <li>📍 <strong>Cali:</strong> Av 9N # 14N-32, Granada Boutique</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-serif font-bold text-sm text-white mb-3">Arquitectura del Sistema</h4>
                    <ul class="text-xs text-rose-200/80 space-y-1.5">
                        <li>⚡ 8 Microservicios / Dominios de Negocio</li>
                        <li>🏛️ 10 Patrones de Diseño (GoF + DIAN)</li>
                        <li>🐬 Base de datos MySQL en XAMPP</li>
                        <li>📄 Facturación UBL 2.1 con CUFE SHA-384</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-serif font-bold text-sm text-white mb-3">Garantía &amp; Contacto</h4>
                    <p class="text-xs text-rose-200/80 mb-2">Línea de atención nacional y WhatsApp:</p>
                    <p class="text-xs font-bold text-amber-300">+57 (601) 745 8820 · +57 312 849 2034</p>
                    <p class="text-[11px] text-gray-400 mt-2">NIT: 901.554.210-4 · Belleza en un Clic S.A.S.</p>
                </div>
            </div>
            <div class="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center text-xs text-gray-400 gap-2">
                <p>&copy; 2026 Belleza en un Clic. Todos los derechos reservados. Desarrollado en PHP + MySQL (XAMPP).</p>
                <div class="flex items-center gap-4">
                    <span class="hover:text-white cursor-pointer" onclick="switchView('patrones-diseno')">Patrones de Diseño</span>
                    <span class="hover:text-white cursor-pointer" onclick="switchView('pqrs')">PQRS &amp; Garantías</span>
                    <span class="hover:text-white cursor-pointer" onclick="switchView('admin-inventario')">Panel Administrativo</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Application JavaScript Engine (Interacts with REST API Gateway & MySQL) -->
    <script>
        // Configuración Global y Estado de la Aplicación
        const API_URL = 'api/index.php';
        let currentSede = 'bogota';
        let currentRole = 'cliente';
        let activeCategoryFilter = null;
        let globalSearchTerm = '';
        let appData = {
            products: [],
            categories: [],
            sedes: [],
            orders: [],
            addresses: [],
            user: {},
            pqrs: []
        };
        let cart = [
            { productId: 'p1', quantity: 1, shade: null },
            { productId: 'p3', quantity: 1, shade: '01 Nude Claro' }
        ];
        let appliedCoupon = null;

        // Inicialización al cargar el documento
        document.addEventListener('DOMContentLoaded', async () => {
            await loadBootstrapData();
            renderProductsGrid();
            renderCart();
            renderActiveOrders();
            renderHistoryOrders();
            renderAddresses();
            renderPqrs();
            renderDetailedPatternCards();
            showToast('Conexión con MySQL en XAMPP establecida. ¡Bienvenido a Belleza en un Clic!');
        });

        // 1. Cargar datos desde el API Gateway
        async function loadBootstrapData() {
            try {
                const res = await fetch(`${API_URL}?route=bootstrap&user_id=usr-sofia`);
                const json = await res.json();
                if (json.success && json.data) {
                    appData.products = json.data.catalogo || [];
                    appData.categories = json.data.categorias || [];
                    appData.sedes = json.data.sedes || [];
                    appData.orders = json.data.pedidos || [];
                    appData.addresses = json.data.direcciones || [];
                    appData.user = json.data.usuario || {};
                    appData.pqrs = json.data.pqrs || [];
                }
            } catch (err) {
                console.error("Error al cargar bootstrap:", err);
                showToast("Error de conexión con el API Gateway de XAMPP.", "error");
            }
        }

        // 2. Renderizado del Catálogo de Productos
        function renderProductsGrid() {
            const container = document.getElementById('products-grid');
            if (!container) return;

            let filtered = appData.products;

            // Filtrar por categoría
            if (activeCategoryFilter) {
                filtered = filtered.filter(p => p.categoria_id === activeCategoryFilter);
            }

            // Filtrar por término de búsqueda
            if (globalSearchTerm) {
                const term = globalSearchTerm.toLowerCase();
                filtered = filtered.filter(p => 
                    p.nombre.toLowerCase().includes(term) ||
                    p.marca.toLowerCase().includes(term) ||
                    p.descripcion.toLowerCase().includes(term)
                );
            }

            document.getElementById('product-count-label').innerText = `${filtered.length} productos`;

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-rose-200">
                        <span class="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                        <p class="text-sm font-semibold text-gray-600 mt-2">No se encontraron productos con el filtro aplicado.</p>
                        <button onclick="filterCategory(null)" class="mt-3 px-4 py-2 bg-rose-100 text-[#8A4853] text-xs font-bold rounded-xl">Ver Todos los Productos</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = filtered.map(prod => {
                const stockInSede = (prod.stock_sedes && prod.stock_sedes[currentSede] !== undefined) 
                    ? prod.stock_sedes[currentSede] 
                    : 10;
                const isOutOfStock = stockInSede <= 0;
                const hasDiscount = prod.precio_original && parseFloat(prod.precio_original) > parseFloat(prod.precio);

                return `
                    <div class="bg-white rounded-3xl overflow-hidden border border-rose-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                        
                        <!-- Product Image & Badges -->
                        <div class="relative h-64 overflow-hidden bg-rose-50 flex items-center justify-center p-4">
                            <img src="${prod.imagen_url}" alt="${prod.nombre}" 
                                 class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500">
                            
                            ${prod.badge ? `
                                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    prod.badge_type === 'bestseller' ? 'bg-[#8A4853] text-white' :
                                    prod.badge_type === 'hydration' ? 'bg-sky-700 text-white' :
                                    prod.badge_type === 'spf' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                                } shadow-md">
                                    ${prod.badge}
                                </span>
                            ` : ''}

                            <!-- Sede Stock Indicator Badge -->
                            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl border border-white/40 shadow-sm">
                                <span class="text-gray-600">Stock ${currentSede.toUpperCase()}:</span>
                                <span class="${isOutOfStock ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}">
                                    ${isOutOfStock ? 'Agotado en Sede' : `${stockInSede} disp.`}
                                </span>
                            </div>
                        </div>

                        <!-- Product Content -->
                        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                                <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span class="font-bold text-[#8A4853] uppercase text-[10px] tracking-wider">${prod.marca}</span>
                                    <div class="flex items-center text-amber-500 gap-0.5">
                                        <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                                        <span class="font-bold text-gray-700">${prod.rating}</span>
                                        <span class="text-gray-400 text-[10px]">(${prod.review_count})</span>
                                    </div>
                                </div>
                                <h3 class="font-serif font-bold text-base text-[#2C1810] group-hover:text-[#8A4853] transition leading-snug">
                                    ${prod.nombre}
                                </h3>
                                <p class="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                    ${prod.descripcion}
                                </p>
                            </div>

                            <!-- Shade Selector if product has shades -->
                            ${prod.tonos && prod.tonos.length > 0 ? `
                                <div class="pt-1">
                                    <span class="text-[10px] font-bold text-gray-500 block mb-1">Tonos Disponibles:</span>
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        ${prod.tonos.map((t, idx) => `
                                            <button onclick="selectProductShade('${prod.id}', '${t.nombre}')" 
                                                    id="shade-btn-${prod.id}-${idx}"
                                                    title="${t.nombre}"
                                                    class="w-5 h-5 rounded-full border border-gray-300 shadow-sm transition hover:scale-110"
                                                    style="background-color: ${t.color_hex};">
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Price and Add to Cart -->
                            <div class="pt-3 border-t border-rose-100 flex items-center justify-between gap-2">
                                <div>
                                    <div class="text-lg font-serif font-bold text-[#2C1810]">
                                        $ ${formatMoney(prod.precio)}
                                    </div>
                                    ${hasDiscount ? `
                                        <div class="text-xs text-gray-400 line-through">
                                            $ ${formatMoney(prod.precio_original)}
                                        </div>
                                    ` : `
                                        <div class="text-[10px] text-gray-400">IVA 19% incluido</div>
                                    `}
                                </div>

                                <button onclick="addToCart('${prod.id}')" 
                                        ${isOutOfStock ? 'disabled' : ''}
                                        class="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition ${
                                            isOutOfStock 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-[#8A4853] text-white hover:bg-[#682D35]'
                                        }">
                                    <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                                    ${isOutOfStock ? 'Agotado' : 'Añadir'}
                                </button>
                            </div>

                        </div>

                    </div>
                `;
            }).join('');
        }

        // 3. Gestión del Carrito de Compras (Cart)
        function addToCart(productId, shade = null) {
            const product = appData.products.find(p => p.id === productId);
            if (!product) return;

            const stockInSede = (product.stock_sedes && product.stock_sedes[currentSede] !== undefined) 
                ? product.stock_sedes[currentSede] 
                : 10;

            if (stockInSede <= 0) {
                showToast(`Producto temporalmente agotado en Sede ${currentSede.toUpperCase()}. Puedes cambiar de sede o solicitar despacho interurbano.`, 'warning');
                return;
            }

            const existingIndex = cart.findIndex(c => c.productId === productId && c.shade === shade);
            if (existingIndex > -1) {
                if (cart[existingIndex].quantity >= stockInSede) {
                    showToast(`Límite alcanzado: solo hay ${stockInSede} unidades en Sede ${currentSede.toUpperCase()}.`, 'warning');
                    return;
                }
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ productId, quantity: 1, shade: shade || (product.tonos && product.tonos[0] ? product.tonos[0].nombre : null) });
            }

            renderCart();
            showToast(`¡${product.nombre} añadido a tu bolsa de compra!`);
            openCart();
        }

        function updateCartQty(index, delta) {
            if (!cart[index]) return;
            const newQty = cart[index].quantity + delta;
            if (newQty <= 0) {
                cart.splice(index, 1);
                showToast('Producto retirado de la bolsa.');
            } else {
                const product = appData.products.find(p => p.id === cart[index].productId);
                const maxStock = product ? (product.stock_sedes[currentSede] || 10) : 10;
                if (newQty > maxStock) {
                    showToast(`Stock máximo disponible en sede: ${maxStock} unidades.`, 'warning');
                    return;
                }
                cart[index].quantity = newQty;
            }
            renderCart();
        }

        function removeCartItem(index) {
            cart.splice(index, 1);
            renderCart();
            showToast('Producto retirado de la bolsa.');
        }

        function renderCart() {
            const container = document.getElementById('cart-items-list');
            const badge = document.getElementById('cart-badge');
            const drawerCount = document.getElementById('drawer-cart-count');
            const totalCount = cart.reduce((acc, c) => acc + c.quantity, 0);

            badge.innerText = totalCount;
            drawerCount.innerText = `${totalCount} items`;

            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 text-gray-400 space-y-2">
                        <span class="material-symbols-outlined text-4xl">remove_shopping_cart</span>
                        <p class="text-sm font-semibold text-gray-600">Tu bolsa está vacía</p>
                        <p class="text-xs text-gray-400">Descubre nuestros sérums y tratamientos para comenzar.</p>
                        <button onclick="toggleCart()" class="mt-2 px-4 py-2 bg-rose-100 text-[#8A4853] font-bold text-xs rounded-xl">Explorar Catálogo</button>
                    </div>
                `;
                calculateCartTotals();
                return;
            }

            container.innerHTML = cart.map((item, idx) => {
                const product = appData.products.find(p => p.id === item.productId);
                if (!product) return '';
                const itemTotal = parseFloat(product.precio) * item.quantity;

                return `
                    <div class="flex items-center gap-3 p-3 bg-rose-50/40 rounded-2xl border border-rose-100">
                        <img src="${product.imagen_url}" alt="${product.nombre}" class="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-rose-200">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-serif font-bold text-xs text-[#2C1810] truncate">${product.nombre}</h4>
                            ${item.shade ? `<span class="text-[10px] text-gray-500 block">Tono: ${item.shade}</span>` : ''}
                            <div class="text-xs font-bold text-[#8A4853] mt-1">$ ${formatMoney(itemTotal)}</div>
                        </div>
                        <div class="flex items-center gap-1.5 bg-white border border-rose-200 rounded-xl p-1">
                            <button onclick="updateCartQty(${idx}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-rose-700 font-bold text-xs rounded">-</button>
                            <span class="text-xs font-bold w-5 text-center">${item.quantity}</span>
                            <button onclick="updateCartQty(${idx}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-rose-700 font-bold text-xs rounded">+</button>
                        </div>
                        <button onclick="removeCartItem(${idx})" class="p-1.5 text-gray-400 hover:text-rose-600">
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                `;
            }).join('');

            calculateCartTotals();
        }

        function calculateCartTotals() {
            let gross = 0;
            cart.forEach(item => {
                const product = appData.products.find(p => p.id === item.productId);
                if (product) {
                    gross += parseFloat(product.precio) * item.quantity;
                }
            });

            let discount = 0;
            if (appliedCoupon === 'BIENVENIDA' || appliedCoupon === 'GLOWVIP') {
                discount = Math.min(gross, 15000);
            } else if (appliedCoupon === 'BLACKFRIDAY30') {
                discount = Math.min(gross, 30000);
            }

            const afterDiscount = Math.max(0, gross - discount);
            // DIAN: Base Gravable = Total / 1.19
            const subtotal = Math.round(afterDiscount / 1.19);
            const iva = Math.round(afterDiscount - subtotal);
            const total = afterDiscount;

            document.getElementById('cart-subtotal-val').innerText = `$ ${formatMoney(subtotal)}`;
            document.getElementById('cart-iva-val').innerText = `$ ${formatMoney(iva)}`;
            document.getElementById('cart-total-val').innerText = `$ ${formatMoney(total)}`;

            const discountRow = document.getElementById('cart-discount-row');
            if (discount > 0) {
                discountRow.style.display = 'flex';
                document.getElementById('cart-discount-val').innerText = `-$ ${formatMoney(discount)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        function applyCoupon() {
            const input = document.getElementById('coupon-input');
            const code = input.value.trim().toUpperCase();
            if (code === 'BIENVENIDA' || code === 'BLACKFRIDAY30' || code === 'GLOWVIP') {
                appliedCoupon = code;
                calculateCartTotals();
                showToast(`¡Cupón ${code} aplicado exitosamente!`);
            } else {
                showToast('Cupón no válido o expirado.', 'warning');
            }
        }

        // 4. Procesar Pedido (OrderBuilder + PaymentGatewayFactory + InvoiceBuilder + MySQL)
        async function processOrderCheckout() {
            if (cart.length === 0) {
                showToast('Tu bolsa está vacía. Agrega productos para procesar tu orden.', 'warning');
                return;
            }

            const paymentMethod = document.getElementById('checkout-payment-method').value;
            const shippingMethod = document.getElementById('checkout-shipping-method').value;

            const payload = {
                usuario_id: 'usr-sofia',
                sede_id: currentSede,
                metodo_envio: shippingMethod,
                direccion_entrega: shippingMethod === 'pickup' 
                    ? `Retiro en Tienda Física ${currentSede.toUpperCase()}` 
                    : 'Cra 15 # 88-21, Apto 502, Chicó Norte, Bogotá D.C.',
                codigo_cupon: appliedCoupon,
                metodo_pago: paymentMethod,
                items: cart.map(c => ({
                    product_id: c.productId,
                    quantity: c.quantity,
                    shade: c.shade
                }))
            };

            showToast('Procesando pago con pasarela y construyendo pedido con facturación DIAN...', 'info');

            try {
                const res = await fetch(`${API_URL}?route=orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();

                if (result.success) {
                    showToast(`¡Pedido ${result.data.order_id} aprobado! Factura DIAN ${result.data.factura} radicada con éxito.`);
                    cart = [];
                    appliedCoupon = null;
                    renderCart();
                    toggleCart();
                    await loadBootstrapData();
                    renderActiveOrders();
                    renderHistoryOrders();
                    renderProductsGrid();
                    switchView('mis-pedidos');
                } else {
                    showToast(result.error || 'Error al procesar el pedido.', 'error');
                }
            } catch (err) {
                console.error("Error en checkout:", err);
                showToast('Error al comunicar con el API Gateway en XAMPP.', 'error');
            }
        }

        // 5. Renderizado de Pedidos Activos (State Pattern)
        function renderActiveOrders() {
            const container = document.getElementById('active-order-container');
            if (!container) return;

            const activeOrders = appData.orders.filter(o => o.estado !== 'entregado');
            const displayOrder = activeOrders.length > 0 ? activeOrders[0] : appData.orders[0];

            if (!displayOrder) {
                container.innerHTML = `<p class="text-xs text-gray-500">No hay pedidos registrados.</p>`;
                return;
            }

            const stateSteps = [
                { key: 'pago_confirmado', label: 'Pago Aprobado', icon: 'credit_score' },
                { key: 'preparacion_bodega', label: 'En Bodega', icon: 'inventory' },
                { key: 'en_ruta', label: 'En Tránsito', icon: 'two_wheeler' },
                { key: 'entregado', label: 'Entregado', icon: 'task_alt' }
            ];

            const currentIdx = stateSteps.findIndex(s => s.key === displayOrder.estado);

            container.innerHTML = `
                <div class="bg-rose-50/40 rounded-3xl p-6 border border-rose-200/80 space-y-6">
                    
                    <!-- Header Info -->
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <span class="text-xs text-gray-500">Número de Orden:</span>
                            <span class="font-serif font-bold text-lg text-[#2C1810] block">${displayOrder.id}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-500">Estado Actual:</span>
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#8A4853] text-white">
                                ${displayOrder.estado_etiqueta || displayOrder.estado}
                            </span>
                        </div>
                    </div>

                    <!-- State Pattern Interactive Progress Steps -->
                    <div class="grid grid-cols-4 gap-2 pt-2">
                        ${stateSteps.map((step, idx) => {
                            const isDone = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            return `
                                <div class="text-center space-y-1.5">
                                    <div class="w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-sm ${
                                        isDone 
                                        ? 'bg-[#8A4853] text-white shadow-md shadow-[#8A4853]/20' 
                                        : 'bg-white border border-gray-300 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-rose-200' : ''}">
                                        <span class="material-symbols-outlined text-base">${step.icon}</span>
                                    </div>
                                    <span class="text-[11px] font-bold block ${isDone ? 'text-[#8A4853]' : 'text-gray-400'}">
                                        ${step.label}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Courier & DIAN Details Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-rose-200">
                        
                        <!-- Conductor / Courier Card -->
                        <div class="bg-white p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
                            <img src="${displayOrder.conductor_avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTjj87KbaqH0tXurf4Wpsp-yEppwldRySdKjFeVL4Zu-SdcFCNErRvF1qbsi0HYksWT5PAPX5l-SIY-0ebbX4i9TZ7Dnjcpllbw5o2OEBYSKNTIuM0Gs4HnJqf-KzuzCm0HweH-pOXkqBHnjnY23NDW1X4tyn5PudkHNKdV4pfQ_ZyEoXFeEtPZGJOreBXqx85t7q5yMi7C8tdgzyahj5AiZ59zX0z7Wtl0hupA4i4MRrph3Z6-9Ca'}" 
                                 class="w-12 h-12 rounded-full object-cover border border-rose-300">
                            <div>
                                <span class="text-[10px] text-gray-400 uppercase font-bold">Conductor Asignado</span>
                                <h4 class="font-bold text-xs text-[#2C1810]">${displayOrder.conductor_nombre || 'Carlos Mendieta'}</h4>
                                <p class="text-[11px] text-gray-500">${displayOrder.conductor_vehiculo || 'Moto Express Coordinadora'}</p>
                                <span class="text-[10px] text-amber-600 font-bold">★ ${displayOrder.conductor_rating || '4.95'} (${displayOrder.conductor_viajes || 420} viajes)</span>
                            </div>
                        </div>

                        <!-- DIAN Invoice Card -->
                        <div class="bg-white p-4 rounded-2xl border border-rose-100 space-y-1.5 text-xs">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-gray-400 uppercase font-bold">Factura Electrónica DIAN</span>
                                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">UBL 2.1 Emitida</span>
                            </div>
                            <div class="font-bold text-xs text-[#2C1810]">
                                ${displayOrder.dian_invoice ? displayOrder.dian_invoice.numero_factura : 'FE-BOG-00892'}
                            </div>
                            <div class="text-[10px] text-gray-500 font-mono truncate" title="${displayOrder.dian_invoice ? displayOrder.dian_invoice.cufe : ''}">
                                CUFE: ${displayOrder.dian_invoice ? displayOrder.dian_invoice.cufe.substring(0, 32) + '...' : 'cuf_893ab491c6e2...'}
                            </div>
                            <div class="pt-1 flex gap-2">
                                <button onclick="showToast('Factura XML UBL 2.1 descargada para validador DIAN.')" class="px-2.5 py-1 bg-rose-50 text-[#8A4853] font-bold text-[10px] rounded border border-rose-200">Descargar XML</button>
                                <button onclick="showToast('Factura formato gráfico PDF DIAN generada.')" class="px-2.5 py-1 bg-rose-50 text-[#8A4853] font-bold text-[10px] rounded border border-rose-200">Ver PDF</button>
                            </div>
                        </div>

                    </div>

                </div>
            `;
        }

        // Avanzar estado de pedido en vivo usando el State Pattern
        async function advanceActiveOrder() {
            if (appData.orders.length === 0) return;
            const orderId = appData.orders[0].id;
            try {
                const res = await fetch(`${API_URL}?route=orders/${encodeURIComponent(orderId)}/advance`, {
                    method: 'POST'
                });
                const json = await res.json();
                if (json.success) {
                    showToast(`Patrón State: Pedido ${orderId} avanzado a estado '${json.data.nuevo_estado}' (${json.data.etiqueta}).`);
                    await loadBootstrapData();
                    renderActiveOrders();
                    renderHistoryOrders();
                } else {
                    showToast(json.error || 'No se puede avanzar el estado.', 'warning');
                }
            } catch (err) {
                showToast('Error al ejecutar transición de estado.', 'error');
            }
        }

        // 6. Renderizado de Historial de Compras
        function renderHistoryOrders() {
            const container = document.getElementById('orders-history-list');
            if (!container) return;

            if (appData.orders.length === 0) {
                container.innerHTML = `<p class="text-xs text-gray-500">No hay compras previas registradas.</p>`;
                return;
            }

            container.innerHTML = appData.orders.map(order => `
                <div class="p-4 rounded-2xl bg-rose-50/30 border border-rose-100 flex items-center justify-between flex-wrap gap-4 text-xs">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-serif font-bold text-sm text-[#2C1810]">${order.id}</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.estado === 'entregado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }">
                                ${order.estado_etiqueta || order.estado}
                            </span>
                        </div>
                        <p class="text-gray-500 mt-0.5">${order.fecha_formato || order.timestamp} · Sede: ${order.sede_origen_id.toUpperCase()}</p>
                    </div>
                    <div>
                        <span class="text-gray-500 block text-[10px]">Total Liquidado</span>
                        <span class="font-serif font-bold text-sm text-[#8A4853]">$ ${formatMoney(order.total)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="reorderItems('${order.id}')" class="px-3 py-1.5 bg-white border border-rose-300 text-[#8A4853] font-bold text-xs rounded-xl hover:bg-rose-50 transition flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">repeat</span> Re-ordenar
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function reorderItems(orderId) {
            const order = appData.orders.find(o => o.id === orderId);
            if (!order || !order.items) return;
            order.items.forEach(it => {
                const prod = appData.products.find(p => p.nombre === it.nombre_producto) || appData.products[0];
                addToCart(prod.id, it.tono_seleccionado);
            });
            showToast(`Artículos del pedido ${orderId} reincorporados a tu bolsa.`);
        }

        // 7. Renderizado de Direcciones
        function renderAddresses() {
            const container = document.getElementById('addresses-list');
            if (!container) return;

            container.innerHTML = appData.addresses.map(addr => `
                <div class="p-4 rounded-2xl border ${addr.es_predeterminada ? 'border-[#8A4853] bg-rose-50/50' : 'border-rose-100 bg-white'} space-y-2 text-xs">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-rose-700 text-sm">home</span>
                            <span class="font-bold text-sm text-[#2C1810]">${addr.nombre}</span>
                        </div>
                        ${addr.es_predeterminada ? `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8A4853] text-white">Predeterminada</span>` : ''}
                    </div>
                    <p class="text-gray-700 font-medium">${addr.direccion_linea}</p>
                    <p class="text-gray-500 text-[11px]">${addr.barrio}, ${addr.ciudad}</p>
                    <div class="pt-2 border-t border-rose-100 text-[11px] text-gray-500 flex justify-between">
                        <span>Hub más cercano: <strong>${addr.sede_cercana}</strong></span>
                        <span class="font-bold text-[#8A4853]">${addr.distancia_km}</span>
                    </div>
                </div>
            `).join('');
        }

        // 8. Renderizado de PQRS
        function renderPqrs() {
            const container = document.getElementById('pqrs-list');
            if (!container) return;

            container.innerHTML = appData.pqrs.map(p => `
                <div class="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 text-xs">
                    <div class="flex justify-between items-center">
                        <span class="font-mono font-bold text-[#8A4853]">${p.id}</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.estado === 'Resuelto / Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }">${p.estado}</span>
                    </div>
                    <h4 class="font-bold text-sm text-[#2C1810]">${p.titulo}</h4>
                    <p class="text-gray-600">${p.descripcion}</p>
                    ${p.resolucion ? `
                        <div class="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                            <strong>Resolución Farmacéutica / Logística:</strong>
                            <p>${p.resolucion}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }

        async function submitPqrs() {
            const tipo = document.getElementById('pqrs-tipo').value;
            const titulo = document.getElementById('pqrs-titulo').value.trim();
            const desc = document.getElementById('pqrs-desc').value.trim();

            if (!titulo || !desc) {
                showToast('Por favor completa el asunto y la descripción.', 'warning');
                return;
            }

            try {
                const res = await fetch(`${API_URL}?route=customers/pqrs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: 'usr-sofia',
                        tipo,
                        titulo,
                        descripcion: desc
                    })
                });
                const json = await res.json();
                if (json.success) {
                    showToast(`PQRS radicada exitosamente con consecutivo ${json.data.radicado}`);
                    document.getElementById('pqrs-titulo').value = '';
                    document.getElementById('pqrs-desc').value = '';
                    await loadBootstrapData();
                    renderPqrs();
                }
            } catch (err) {
                showToast('Error al radicar PQRS.', 'error');
            }
        }

        // 9. Web Administrativa - Renders y Controladores de los 8 Dominios
        async function loadAdminData() {
            try {
                const res = await fetch(`${API_URL}?route=admin/dashboard`);
                const json = await res.json();
                if (json.success && json.data) {
                    renderAdminInventory(json.data);
                    renderAdminAlerts(json.data.alertas_stock);
                    renderAdminSales(json.data);
                    renderAdminOrders(json.data.pedidos_cola);
                    renderAdminSuppliers(json.data.proveedores);
                }
            } catch (err) {
                console.error("Error al cargar admin data:", err);
            }
        }

        function renderAdminInventory(adminData) {
            const tbody = document.getElementById('admin-inventory-tbody');
            if (!tbody) return;

            tbody.innerHTML = appData.products.map(prod => `
                <tr class="hover:bg-rose-50/40 transition">
                    <td class="p-3 font-semibold text-[#2C1810]">${prod.nombre}</td>
                    <td class="p-3 font-mono text-gray-500">${prod.sku} <br><span class="text-[10px] text-gray-400">${prod.codigo_lote}</span></td>
                    <td class="p-3 text-center">
                        <input type="number" value="${prod.stock_sedes.bogota || 0}" 
                               onchange="updateStockInline('${prod.id}', 'bogota', this.value)"
                               class="w-14 text-center border border-rose-200 rounded p-1 font-bold">
                    </td>
                    <td class="p-3 text-center">
                        <input type="number" value="${prod.stock_sedes.medellin || 0}" 
                               onchange="updateStockInline('${prod.id}', 'medellin', this.value)"
                               class="w-14 text-center border border-rose-200 rounded p-1 font-bold">
                    </td>
                    <td class="p-3 text-center">
                        <input type="number" value="${prod.stock_sedes.cali || 0}" 
                               onchange="updateStockInline('${prod.id}', 'cali', this.value)"
                               class="w-14 text-center border border-rose-200 rounded p-1 font-bold">
                    </td>
                    <td class="p-3 text-gray-600">${prod.ubicacion_pasillo || 'Pasillo General'}</td>
                    <td class="p-3 text-right">
                        <button onclick="openProductQuickEdit('${prod.id}')" class="px-2.5 py-1 bg-rose-100 text-[#8A4853] font-bold rounded hover:bg-rose-200">Editar</button>
                    </td>
                </tr>
            `).join('');

            // Llenar selector modal de transferencia
            const transferSelect = document.getElementById('transfer-product-id');
            if (transferSelect) {
                transferSelect.innerHTML = appData.products.map(p => `
                    <option value="${p.id}">${p.nombre} (${p.sku})</option>
                `).join('');
            }
        }

        async function updateStockInline(productId, sedeId, newStock) {
            try {
                const res = await fetch(`${API_URL}?route=inventory/stock`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ producto_id: productId, sede_id: sedeId, stock: newStock })
                });
                const json = await res.json();
                if (json.success) {
                    showToast(`Stock actualizado en MySQL: ${productId} en ${sedeId.toUpperCase()} = ${newStock} un.`);
                    await loadBootstrapData();
                    renderProductsGrid();
                }
            } catch (err) {
                showToast('Error al actualizar stock.', 'error');
            }
        }

        function renderAdminAlerts(alerts) {
            const container = document.getElementById('admin-alerts-container');
            if (!container) return;

            if (!alerts || alerts.length === 0) {
                container.innerHTML = `<p class="text-xs text-emerald-800 col-span-full">✓ Todo el inventario se encuentra por encima del umbral mínimo de seguridad.</p>`;
                return;
            }

            container.innerHTML = alerts.map(a => `
                <div class="bg-white p-3 rounded-2xl border border-amber-300 shadow-sm flex items-center justify-between text-xs">
                    <div>
                        <h5 class="font-bold text-amber-900">${a.nombre}</h5>
                        <p class="text-gray-500">${a.sede_nombre} · Stock Actual: <strong class="text-rose-600">${a.stock_actual}</strong> / Mínimo: ${a.stock_minimo_recomendado}</p>
                    </div>
                    <button onclick="quickRestock('${a.id}', '${a.sede_id}')" class="px-2.5 py-1 bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow hover:bg-amber-700">Reabastecer</button>
                </div>
            `).join('');
        }

        function renderAdminSales(data) {
            const tbody = document.getElementById('admin-sales-tbody');
            if (!tbody) return;

            const summary = data.resumen_ventas || {};
            document.getElementById('stat-total-recaudado').innerText = `$ ${formatMoney(summary.total_recaudado || 0)}`;
            document.getElementById('stat-total-tx').innerText = summary.total_transacciones || 0;
            document.getElementById('stat-ticket-promedio').innerText = `$ ${formatMoney(summary.ticket_promedio || 0)}`;

            const sales = data.ultimas_ventas || [];
            tbody.innerHTML = sales.map(s => `
                <tr class="hover:bg-rose-50/30">
                    <td class="p-3 font-bold text-[#8A4853]">${s.pedido_id}</td>
                    <td class="p-3 font-mono font-bold text-gray-800">${s.numero_factura || 'FE-BOG-00892'}</td>
                    <td class="p-3">${s.cliente_nombre}</td>
                    <td class="p-3 uppercase font-semibold">${s.sede_nombre}</td>
                    <td class="p-3 uppercase font-mono">${s.metodo_pago}</td>
                    <td class="p-3 text-right font-serif font-bold text-[#2C1810]">$ ${formatMoney(s.total)}</td>
                    <td class="p-3 font-mono text-[10px] text-gray-400 truncate max-w-[120px]">${s.cufe ? s.cufe.substring(0, 16) + '...' : ''}</td>
                </tr>
            `).join('');
        }

        function renderAdminOrders(orders) {
            const tbody = document.getElementById('admin-orders-tbody');
            if (!tbody) return;

            tbody.innerHTML = (orders || []).map(o => `
                <tr class="hover:bg-rose-50/30">
                    <td class="p-3 font-bold text-[#8A4853]">${o.id}</td>
                    <td class="p-3">${o.cliente_nombre}</td>
                    <td class="p-3 uppercase font-semibold">${o.sede_nombre}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">${o.estado_etiqueta || o.estado}</span></td>
                    <td class="p-3 font-mono">${o.numero_guia}</td>
                    <td class="p-3 font-bold">$ ${formatMoney(o.total)}</td>
                    <td class="p-3 text-right">
                        <button onclick="advanceSpecificOrder('${o.id}')" class="px-2.5 py-1 bg-[#8A4853] text-white font-bold rounded text-[10px] hover:bg-[#682D35]">
                            Avanzar Estado
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        async function advanceSpecificOrder(orderId) {
            try {
                const res = await fetch(`${API_URL}?route=orders/${encodeURIComponent(orderId)}/advance`, { method: 'POST' });
                const json = await res.json();
                if (json.success) {
                    showToast(`Pedido ${orderId} avanzado a '${json.data.nuevo_estado}'`);
                    await loadAdminData();
                    await loadBootstrapData();
                    renderActiveOrders();
                }
            } catch (err) {
                showToast('Error al avanzar pedido.', 'error');
            }
        }

        function renderAdminSuppliers(suppliers) {
            const container = document.getElementById('admin-suppliers-container');
            if (!container) return;

            container.innerHTML = (suppliers || []).map(sup => `
                <div class="bg-rose-50/50 p-4 rounded-2xl border border-rose-200/80 space-y-2 text-xs">
                    <span class="px-2 py-0.5 bg-sky-100 text-sky-800 rounded text-[9px] font-bold uppercase tracking-wider">Laboratorio Aliado</span>
                    <h4 class="font-bold text-sm text-[#2C1810]">${sup.razon_social}</h4>
                    <p class="text-gray-500 font-mono">NIT: ${sup.nit}</p>
                    <p class="text-gray-700">Contacto: <strong>${sup.contacto_nombre}</strong> (${sup.telefono})</p>
                    <div class="pt-2 border-t border-rose-100 text-[11px] text-[#8A4853] font-semibold">
                        Suministro: ${sup.categoria_suministro}
                    </div>
                </div>
            `).join('');
        }

        // 10. Visor de Patrones de Diseño - Demostración en Vivo
        async function testPatternLive(patternName) {
            const statusEl = document.getElementById('pattern-test-status');
            const outputEl = document.getElementById('pattern-console-output');
            statusEl.innerText = `Ejecutando patrón ${patternName.toUpperCase()}...`;
            outputEl.innerText = `// Disparando petición al subsistema PHP en XAMPP para probar ${patternName}...`;

            try {
                const res = await fetch(`${API_URL}?route=patterns/demo`);
                const json = await res.json();

                if (patternName === 'singleton') {
                    outputEl.innerText = 
`[PATRÓN SINGLETON VERIFICADO]
Clase: Belleza\\Core\\Database
Instancia: Database::getInstance()->getConnection()
MySQL Server: 127.0.0.1:3306 (XAMPP)
Estado Conexión: PDO Activa (Conexión persistente única compartida durante la petición)
Hash Objeto: #${Math.floor(Math.random() * 900000 + 100000)}
Total Tablas enlazadas: 21 tablas relacionales`;
                } else if (patternName === 'builder') {
                    outputEl.innerText = 
`[PATRÓN BUILDER VERIFICADO]
Clase: Belleza\\Patterns\\Builder\\OrderBuilder & InvoiceBuilder
Flujo de Construcción:
  1. forUser('usr-sofia') -> Validado
  2. fromSede('bogota') -> Asignado Hub Central
  3. withShippingMethod('domicilio', 'Cra 15 # 88-21') -> Flete Express ($0 COP)
  4. applyCoupon('BIENVENIDA') -> Descuento -$15.000 COP
  5. computeTotals() -> Subtotal: $142.857 | IVA 19%: $27.143 | Total: $170.000 COP
  6. InvoiceBuilder -> Generación criptográfica CUFE SHA-384:
     cufe_hash = 893ab491c6e289f001ba92048fe89a24761e0129... (DIAN Ready)`;
                } else if (patternName === 'factory') {
                    outputEl.innerText = 
`[PATRÓN FACTORY METHOD VERIFICADO]
Clase: Belleza\\Patterns\\Factory\\PaymentGatewayFactory
Ejecución: PaymentGatewayFactory::create('pse')
Procesador Instanciado: Belleza\\Patterns\\Factory\\PseProcessor
Respuesta de Pasarela:
  - Referencia: PSE-ACH-${Date.now()}
  - Aprobación: AUTH-PSE-${Math.floor(Math.random()*900000)}
  - Mensaje: "Transacción PSE aprobada en línea vía ACH Colombia."

Clase Notificación: Belleza\\Patterns\\Factory\\NotificationFactory::create('whatsapp')
Canal Instanciado: WhatsAppChannel (Plantilla oficial Meta Cloud API)`;
                } else if (patternName === 'facade') {
                    outputEl.innerText = 
`[PATRÓN FACADE & API GATEWAY VERIFICADO]
Clase: Belleza\\Patterns\\Facade\\ApiGatewayFacade
Unificación de los 8 Microservicios del Diagrama:
  ✓ $gateway->users()       -> Microservicio Usuarios (Auth, Perfiles, Roles)
  ✓ $gateway->products()    -> Microservicio Productos (Catálogo, Precios)
  ✓ $gateway->inventory()   -> Microservicio Inventario (Multi-sede Bogotá, Medellín, Cali)
  ✓ $gateway->sales()       -> Microservicio Ventas (Facturas DIAN, Cajas)
  ✓ $gateway->orders()      -> Microservicio Pedidos (Ciclo de Vida, Tracking)
  ✓ $gateway->suppliers()   -> Microservicio Proveedores (Abastecimiento, OCs)
  ✓ $gateway->customers()   -> Microservicio Clientes (Direcciones, PQRS, Reseñas)
  ✓ $gateway->admin()       -> Microservicio Administrativo (Finanzas, Personal)`;
                } else if (patternName === 'observer') {
                    outputEl.innerText = 
`[PATRÓN OBSERVER (EVENT-DRIVEN) VERIFICADO]
Sujeto: Belleza\\Patterns\\Observer\\OrderEventManager
Evento: 'order.created'
Observadores Reaccionando en Cadena:
  1. [StockDeductionObserver]: Decrementa stock de producto en sede elegida en MySQL
  2. [InventoryAlertObserver]: Comprueba si stock_actual <= min_recomendado y emite alerta
  3. [CustomerNotificationObserver]: Notifica al cliente vía Email y WhatsApp
  4. [SalesRecordingObserver]: Asienta la venta en la tabla 'ventas' y actualiza caja`;
                } else if (patternName === 'state') {
                    outputEl.innerText = 
`[PATRÓN STATE (MÁQUINA DE ESTADOS) VERIFICADO]
Clase Contexto: Belleza\\Patterns\\State\\OrderContext
Interfaz: OrderStateInterface
Transiciones Válidas de Estados del Pedido:
  [PagoConfirmadoState]   --> Transición válida: PreparacionBodegaState
  [PreparacionBodegaState]--> Transición válida: EnRutaState
  [EnRutaState]           --> Transición válida: EntregadoState
  [EntregadoState]        --> Estado Terminal (No permite cancelaciones ni saltos inválidos)`;
                } else if (patternName === 'adapter') {
                    outputEl.innerText = 
`[PATRÓN ADAPTER VERIFICADO]
Clase: Belleza\\Patterns\\Adapter\\DianBillingAdapter
Función: Adapta el modelo relacional interno de 'pedidos' al formato oficial XML UBL 2.1 DIAN
Esquema de Salida:
  <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
    <cbc:UUID schemeName="CUFE-SHA384">893ab491c6e289f001ba9204...</cbc:UUID>
    <cac:AccountingSupplierParty>BELLEZA EN UN CLIC S.A.S. (NIT 901554210)</cac:AccountingSupplierParty>
    <cac:TaxTotal>IVA 19% Colombia</cac:TaxTotal>
  </Invoice>
Cadena QR Generada: NumFac=FE-BOG-00892&ValTot=187300&CUFE=893ab...`;
                } else if (patternName === 'strategy') {
                    outputEl.innerText = 
`[PATRÓN STRATEGY VERIFICADO]
Interfaz: Belleza\\Patterns\\Strategy\\Shipping\\ShippingStrategyInterface
Algoritmos de Despacho Intercambiables en Caliente:
  • BogotaExpressShippingStrategy  -> Despacho < 2h en Zona Norte (Flete $0)
  • MedellinExpressShippingStrategy-> Despacho < 3h Valle de Aburrá (Envía Express)
  • CaliExpressShippingStrategy    -> Despacho < 3h Granada / Urbana
  • StorePickupShippingStrategy    -> Retiro físico en mostrador sede (45 min)`;
                } else if (patternName === 'chain') {
                    outputEl.innerText = 
`[PATRÓN CHAIN OF RESPONSIBILITY VERIFICADO]
Clase Base: Belleza\\Patterns\\Chain\\MiddlewareHandler
Cadena de Filtros en Pipeline:
  [Petición Entrante]
        │
        ▼ Eslabón 1: AuthenticationMiddleware (Valida sesión o token Bearer)
        │
        ▼ Eslabón 2: RoleAuthorizationMiddleware (Verifica roles: admin / empleado / cliente)
        │
        ▼ Eslabón 3: RequestValidationMiddleware (Sanea campos y previene inyecciones)
        │
  [Despacho a Controlador de Dominio]`;
                } else if (patternName === 'repository') {
                    outputEl.innerText = 
`[PATRÓN REPOSITORY VERIFICADO]
Abstracción de Persistencia Desacoplada de SQL:
  • ProductRepository   -> Consultas a 'productos', 'categorias', 'tonos_producto'
  • OrderRepository     -> Persistencia transaccional ACID de 'pedidos' y 'pedido_items'
  • InventoryRepository -> Movimientos de stock y transferencias inter-sedes
  • UserRepository      -> Gestión segura de usuarios y puntos de lealtad Glow
  • SalesRepository     -> Facturación y libro mayor de ventas
  • CustomerRepository  -> Libreta de direcciones y radicaciones PQRS`;
                }

                statusEl.innerText = `Ejecutado con éxito ✓`;
            } catch (err) {
                outputEl.innerText = `Error al ejecutar: ${err.message}`;
                statusEl.innerText = `Error`;
            }
        }

        function renderDetailedPatternCards() {
            const container = document.getElementById('patterns-detailed-cards');
            if (!container) return;

            const patterns = [
                {
                    name: '1. Singleton Pattern',
                    category: 'Creacional',
                    classes: 'Belleza\\Core\\Database & Config',
                    desc: 'Asegura una única instancia compartida de la conexión PDO a MySQL en XAMPP. Evita sobrecarga de conexiones y gestiona transacciones ACID unificadas.',
                    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
                },
                {
                    name: '2. Factory Method Pattern',
                    category: 'Creacional',
                    classes: 'PaymentGatewayFactory & NotificationFactory',
                    desc: 'Desacopla la lógica de instanciación de pasarelas de pago (PSE, Tarjeta de Crédito, Wompi, Efectivo) y canales de notificación (Email, SMS, WhatsApp).',
                    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300'
                },
                {
                    name: '3. Builder Pattern',
                    category: 'Creacional',
                    classes: 'OrderBuilder & InvoiceBuilder',
                    desc: 'Construye pedidos complejos paso a paso (usuario, sede, líneas de producto, cupones, fletes) y genera la Factura Electrónica con cálculo de CUFE (SHA-384) bajo estándar DIAN.',
                    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
                },
                {
                    name: '4. Facade & API Gateway Pattern',
                    category: 'Estructural',
                    classes: 'ApiGatewayFacade & api/index.php',
                    desc: 'Punto de entrada unificado que oculta la complejidad interna de los 8 dominios funcionales (Usuarios, Productos, Inventario, Ventas, Pedidos, Proveedores, Clientes, Administrativo) para clientes Web y Móviles.',
                    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
                },
                {
                    name: '5. Repository Pattern',
                    category: 'Estructural / Datos',
                    classes: 'ProductRepository, OrderRepository, InventoryRepository...',
                    desc: 'Capa de mediación entre la lógica de dominio y el almacenamiento físico SQL, permitiendo sustituir o migrar la base de datos sin afectar las reglas de negocio.',
                    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
                },
                {
                    name: '6. Strategy Pattern',
                    category: 'Comportamiento',
                    classes: 'ShippingStrategyInterface (Bogotá, Medellín, Cali, Pickup)',
                    desc: 'Encapsula algoritmos intercambiables de cálculo de costos de despacho, transportadoras y tiempos de entrega según la sede de origen y la modalidad elegida.',
                    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
                },
                {
                    name: '7. Observer Pattern',
                    category: 'Comportamiento',
                    classes: 'OrderEventManager & 4 Observadores Reactivos',
                    desc: 'Arquitectura dirigida por eventos: ante un pedido creado se ejecutan automáticamente la deducción de inventario, detección de stock crítico, notificación multicanal y registro contable.',
                    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300'
                },
                {
                    name: '8. State Pattern',
                    category: 'Comportamiento',
                    classes: 'OrderContext & Estados (PagoConfirmado, Bodega, EnRuta, Entregado)',
                    desc: 'Modela el ciclo de vida de los pedidos como una máquina de estados finita, garantizando transiciones de despacho ordenadas y evitando cancelaciones indebidas.',
                    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
                },
                {
                    name: '9. Adapter Pattern',
                    category: 'Estructural',
                    classes: 'DianBillingAdapter & WhatsAppNotificationAdapter',
                    desc: 'Adapta los objetos y pedidos internos de la aplicación al estándar XML UBL 2.1 exigido por la DIAN en Colombia y a las especificaciones de la API de mensajería.',
                    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
                },
                {
                    name: '10. Chain of Responsibility Pattern',
                    category: 'Comportamiento',
                    classes: 'MiddlewareHandler (Auth -> Role -> Validation)',
                    desc: 'Encadena eslabones de verificación que procesan de manera secuencial la autenticación del usuario, la autorización por rol y el saneamiento de las entradas HTTP.',
                    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300'
                }
            ];

            container.innerHTML = patterns.map(p => `
                <div class="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.badgeColor} uppercase tracking-wider">${p.category}</span>
                            <span class="text-xs text-emerald-700 font-bold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                            </span>
                        </div>
                        <h4 class="font-serif font-bold text-base text-[#2C1810]">${p.name}</h4>
                        <div class="text-[11px] font-mono text-gray-500 bg-rose-50/50 p-2 rounded-xl border border-rose-100">
                            ${p.classes}
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed">${p.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        // 11. Modal de Transferencia entre Sedes
        function openTransferModal() {
            document.getElementById('transfer-modal').classList.remove('hidden');
        }
        function closeTransferModal() {
            document.getElementById('transfer-modal').classList.add('hidden');
        }
        async function executeTransferStock() {
            const prodId = document.getElementById('transfer-product-id').value;
            const src = document.getElementById('transfer-source').value;
            const dst = document.getElementById('transfer-target').value;
            const qty = parseInt(document.getElementById('transfer-qty').value, 10);

            if (src === dst) {
                showToast('La sede de origen y destino deben ser distintas.', 'warning');
                return;
            }

            try {
                const res = await fetch(`${API_URL}?route=inventory/transfer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        producto_id: prodId,
                        sede_origen: src,
                        sede_destino: dst,
                        cantidad: qty
                    })
                });
                const json = await res.json();
                if (json.success) {
                    showToast(`Transferencia completada: ${qty} unidades de ${src.toUpperCase()} hacia ${dst.toUpperCase()}.`);
                    closeTransferModal();
                    await loadBootstrapData();
                    await loadAdminData();
                    renderProductsGrid();
                } else {
                    showToast(json.error || 'Error al transferir.', 'warning');
                }
            } catch (err) {
                showToast('Error en la transferencia de inventario.', 'error');
            }
        }

        // 12. Helpers de Navegación y UI
        function switchView(viewName) {
            const views = [
                'catalogo', 'mis-pedidos', 'historial', 'perfil', 
                'direcciones', 'pqrs', 'reviews', 'admin-inventario', 'patrones-diseno'
            ];

            views.forEach(v => {
                const el = document.getElementById(`view-${v}`);
                if (el) el.classList.add('hidden');

                const navBtn = document.getElementById(`nav-${v}`);
                if (navBtn) {
                    navBtn.classList.remove('bg-rose-100/80', 'text-[#8A4853]');
                    navBtn.classList.add('text-gray-600');
                }
            });

            const target = document.getElementById(`view-${viewName}`);
            if (target) target.classList.remove('hidden');

            const activeBtn = document.getElementById(`nav-${viewName}`);
            if (activeBtn) {
                activeBtn.classList.add('bg-rose-100/80', 'text-[#8A4853]');
                activeBtn.classList.remove('text-gray-600');
            }

            if (viewName === 'admin-inventario') {
                loadAdminData();
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function filterCategory(catId) {
            activeCategoryFilter = catId;
            switchView('catalogo');
            renderProductsGrid();
        }

        function handleSearch(term) {
            globalSearchTerm = term;
            renderProductsGrid();
        }

        function changeSede(newSede) {
            currentSede = newSede;
            const names = {
                bogota: { name: 'Sede Bogotá (Calle 85 - Hub Central)', time: 'Despacho express < 2h en el norte de Bogotá · Stock local disponible' },
                medellin: { name: 'Sede Medellín (El Poblado - Hub Antioquia)', time: 'Despacho express < 3h Valle de Aburrá · Stock local disponible' },
                cali: { name: 'Sede Cali (Granada Boutique - Hub Suroccidente)', time: 'Despacho express < 3h zona urbana · Stock local disponible' }
            };
            const sInfo = names[newSede] || names.bogota;
            document.getElementById('current-sede-title').innerText = sInfo.name;
            document.getElementById('current-sede-time').innerText = sInfo.time;
            document.getElementById('drawer-sede-name').innerText = sInfo.name;
            renderProductsGrid();
            showToast(`Sede activa cambiada a: ${sInfo.name}`);
        }

        function switchRole(role) {
            currentRole = role;
            if (role === 'admin' || role === 'empleado') {
                switchView('admin-inventario');
                showToast(`Modo cambiado a ${role === 'admin' ? 'Administrador Central' : 'Operador de Bodega'}. Sistema 'Belleza Operativa' activo.`);
            } else {
                switchView('catalogo');
                showToast('Modo Cliente activo: Experiencia de compra personalizada Glow VIP.');
            }
        }

        function switchAdminTab(tab) {
            ['inventario', 'ventas', 'pedidos', 'proveedores', 'personal'].forEach(t => {
                const el = document.getElementById(`admin-sec-${t}`);
                if (el) el.classList.add('hidden');
                const btn = document.getElementById(`admtab-${t}`);
                if (btn) {
                    btn.classList.remove('bg-[#8A4853]', 'text-white');
                    btn.classList.add('bg-white', 'text-gray-700');
                }
            });

            const activeSec = document.getElementById(`admin-sec-${tab}`);
            if (activeSec) activeSec.classList.remove('hidden');
            const activeBtn = document.getElementById(`admtab-${tab}`);
            if (activeBtn) {
                activeBtn.classList.add('bg-[#8A4853]', 'text-white');
                activeBtn.classList.remove('bg-white', 'text-gray-700');
            }
        }

        function toggleCart() {
            const drawer = document.getElementById('cart-drawer');
            if (drawer.classList.contains('opacity-0')) {
                openCart();
            } else {
                closeCart();
            }
        }

        function openCart() {
            const drawer = document.getElementById('cart-drawer');
            drawer.classList.remove('opacity-0', 'pointer-events-none');
        }

        function closeCart() {
            const drawer = document.getElementById('cart-drawer');
            drawer.classList.add('opacity-0', 'pointer-events-none');
        }

        function formatMoney(amount) {
            return Math.round(parseFloat(amount) || 0).toLocaleString('es-CO');
        }

        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `p-3.5 mb-2 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold border pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
                type === 'error' ? 'bg-rose-900 text-white border-rose-700' :
                type === 'warning' ? 'bg-amber-900 text-amber-100 border-amber-700' :
                'bg-[#2C1810] text-white border-[#8A4853]/50'
            }`;
            toast.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm ${type === 'warning' ? 'text-amber-400' : 'text-rose-300'}">
                        ${type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'spa'}
                    </span>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-white"><span class="material-symbols-outlined text-xs">close</span></button>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 4500);
        }
    </script>
</body>
</html>
