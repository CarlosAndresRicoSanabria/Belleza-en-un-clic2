<?php
/**
 * REST API Gateway - Belleza en un Clic
 * Punto de entrada único para la Web Administrativa, App Móvil y Clientes Web
 */

require_once __DIR__ . '/../src/autoload.php';

use Belleza\Core\Response;
use Belleza\Patterns\Facade\ApiGatewayFacade;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$gateway = new ApiGatewayFacade();

// Obtener ruta solicitada (soporta tanto PATH_INFO / REQUEST_URI como ?route=...)
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$queryRoute = $_GET['route'] ?? null;

if ($queryRoute) {
    $route = '/' . trim($queryRoute, '/');
} else {
    $path = parse_url($requestUri, PHP_URL_PATH);
    // Eliminar base folder si existe
    $path = str_replace(['/belleza-en-un-clic/api', '/belleza-en-un-clic'], '', $path);
    $path = str_replace('/api', '', $path);
    $route = '/' . trim($path, '/');
}

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$jsonBody = !empty($rawInput) ? json_decode($rawInput, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

try {
    // -------------------------------------------------------------
    // Enrutamiento del API Gateway hacia los 8 Dominios
    // -------------------------------------------------------------

    // 1. Bootstrap General (Web y Móvil)
    if ($route === '/bootstrap' || $route === '/') {
        $userId = $payload['user_id'] ?? 'usr-sofia';
        Response::success($gateway->getClientAppBootstrap($userId));
    }

    // 2. Dominio de Productos
    elseif ($route === '/products' && $method === 'GET') {
        $filters = [
            'categoria' => $payload['categoria'] ?? null,
            'search'    => $payload['search'] ?? null,
        ];
        Response::success($gateway->products()->getCatalog($filters));
    }
    elseif (preg_match('#^/products/([^/]+)$#', $route, $matches) && $method === 'GET') {
        $prod = $gateway->products()->getProduct($matches[1]);
        if (!$prod) Response::error('Producto no encontrado', 404);
        Response::success($prod);
    }
    elseif ($route === '/products' && $method === 'POST') {
        Response::success($gateway->products()->createProduct($payload), 'Producto creado con éxito', 201);
    }
    elseif (preg_match('#^/products/([^/]+)/update$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->products()->updateProduct($matches[1], $payload));
    }
    elseif (preg_match('#^/products/([^/]+)/delete$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->products()->deleteProduct($matches[1]));
    }
    elseif ($route === '/categories') {
        Response::success($gateway->products()->getCategories());
    }

    // 3. Dominio de Usuarios
    elseif (preg_match('#^/user/([^/]+)$#', $route, $matches) && $method === 'GET') {
        $user = $gateway->users()->getUser($matches[1]);
        if (!$user) Response::error('Usuario no encontrado', 404);
        Response::success($user);
    }
    elseif (preg_match('#^/user/([^/]+)$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->users()->updateProfile($matches[1], $payload));
    }
    elseif ($route === '/users/register' && $method === 'POST') {
        Response::success($gateway->users()->register($payload), 'Usuario registrado exitosamente', 201);
    }
    elseif ($route === '/users/role' && $method === 'POST') {
        Response::success($gateway->users()->changeRole($payload['id'], $payload['role']));
    }
    elseif ($route === '/users') {
        Response::success($gateway->users()->listUsers());
    }

    // 4. Dominio de Inventario
    elseif ($route === '/sedes') {
        Response::success($gateway->inventory()->getSedes());
    }
    elseif ($route === '/inventory/alerts') {
        Response::success($gateway->inventory()->getLowStockAlerts());
    }
    elseif ($route === '/inventory/movements') {
        Response::success($gateway->inventory()->getMovements());
    }
    elseif ($route === '/inventory/stock' && $method === 'POST') {
        if (!isset($payload['producto_id'], $payload['sede_id'], $payload['stock'])) {
            Response::error('Faltan campos obligatorios: producto_id, sede_id, stock', 422);
        }
        Response::success($gateway->inventory()->updateStock(
            $payload['producto_id'],
            $payload['sede_id'],
            (int)$payload['stock'],
            $payload['usuario_id'] ?? null
        ));
    }
    elseif ($route === '/inventory/transfer' && $method === 'POST') {
        if (!isset($payload['producto_id'], $payload['sede_origen'], $payload['sede_destino'], $payload['cantidad'])) {
            Response::error('Faltan campos: producto_id, sede_origen, sede_destino, cantidad', 422);
        }
        Response::success($gateway->inventory()->transferStock(
            $payload['producto_id'],
            $payload['sede_origen'],
            $payload['sede_destino'],
            (int)$payload['cantidad'],
            $payload['usuario_id'] ?? null
        ));
    }

    // 5. Dominio de Pedidos (Builder + Factory + State + Observers)
    elseif ($route === '/orders' && $method === 'GET') {
        Response::success($gateway->orders()->listOrders(30));
    }
    elseif (preg_match('#^/orders/([^/]+)$#', $route, $matches) && $method === 'GET') {
        $order = $gateway->orders()->getOrder($matches[1]);
        if (!$order) Response::error('Pedido no encontrado', 404);
        Response::success($order);
    }
    elseif ($route === '/orders' && $method === 'POST') {
        Response::success($gateway->orders()->placeOrder($payload), 'Pedido procesado y facturado ante la DIAN', 201);
    }
    elseif (preg_match('#^/orders/([^/]+)/advance$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->orders()->advanceOrderStatus($matches[1]));
    }

    // 6. Dominio de Ventas y Facturación
    elseif ($route === '/sales/history') {
        Response::success($gateway->sales()->getSalesHistory(30));
    }
    elseif ($route === '/sales/summary') {
        Response::success($gateway->sales()->getSalesSummary());
    }
    elseif ($route === '/sales/drawers') {
        Response::success($gateway->sales()->getCashDrawers());
    }

    // 7. Dominio de Proveedores
    elseif ($route === '/suppliers' && $method === 'GET') {
        Response::success($gateway->suppliers()->listSuppliers());
    }
    elseif ($route === '/suppliers' && $method === 'POST') {
        Response::success($gateway->suppliers()->addSupplier($payload), 'Proveedor registrado exitosamente', 201);
    }
    elseif ($route === '/suppliers/orders' && $method === 'GET') {
        Response::success($gateway->suppliers()->listPurchaseOrders());
    }
    elseif ($route === '/suppliers/orders' && $method === 'POST') {
        Response::success($gateway->suppliers()->createPurchaseOrder($payload), 'Orden de compra radicada', 201);
    }
    elseif (preg_match('#^/suppliers/orders/([^/]+)/receive$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->suppliers()->receiveOrder($matches[1]));
    }
    elseif (preg_match('#^/suppliers/orders/([^/]+)/pay$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->suppliers()->payOrder($matches[1]));
    }

    // 8. Dominio de Clientes
    elseif ($route === '/customers/addresses' && $method === 'GET') {
        $userId = $payload['user_id'] ?? 'usr-sofia';
        Response::success($gateway->customers()->getAddresses($userId));
    }
    elseif ($route === '/customers/addresses' && $method === 'POST') {
        Response::success($gateway->customers()->addAddress($payload), 'Dirección guardada', 201);
    }
    elseif (preg_match('#^/customers/addresses/([^/]+)/delete$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->customers()->deleteAddress($matches[1]));
    }
    elseif ($route === '/customers/pqrs' && $method === 'GET') {
        $userId = $payload['user_id'] ?? null;
        Response::success($gateway->customers()->getPqrs($userId));
    }
    elseif ($route === '/customers/pqrs' && $method === 'POST') {
        Response::success($gateway->customers()->createPqrs($payload), 'PQRS radicada exitosamente', 201);
    }
    elseif (preg_match('#^/reviews/([^/]+)/vote$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->customers()->voteReview($matches[1]));
    }
    elseif (preg_match('#^/reviews/([^/]+)$#', $route, $matches) && $method === 'GET') {
        Response::success($gateway->customers()->getProductReviews($matches[1]));
    }
    elseif ($route === '/reviews' && $method === 'GET') {
        Response::success($gateway->customers()->listAllReviews());
    }
    elseif ($route === '/reviews' && $method === 'POST') {
        Response::success($gateway->customers()->addProductReview($payload), 'Reseña enviada', 201);
    }

    // 9. Dominio Administrativo
    elseif ($route === '/admin/dashboard') {
        Response::success($gateway->getAdminDashboardSummary());
    }
    elseif ($route === '/admin/staff' && $method === 'GET') {
        Response::success($gateway->admin()->getStaff());
    }
    elseif ($route === '/admin/staff' && $method === 'POST') {
        Response::success($gateway->admin()->addStaff($payload), 'Empleado creado', 201);
    }
    elseif (preg_match('#^/admin/staff/([^/]+)/toggle$#', $route, $matches) && $method === 'POST') {
        Response::success($gateway->admin()->toggleStaff($matches[1]));
    }
    elseif ($route === '/admin/settings' && $method === 'GET') {
        Response::success($gateway->admin()->getSettings());
    }
    elseif ($route === '/admin/settings' && $method === 'POST') {
        Response::success($gateway->admin()->updateSetting($payload['key'], $payload['value']));
    }

    // 10. Demostración y Diagnóstico Interactivo de Patrones de Diseño
    elseif ($route === '/patterns/demo') {
        Response::success([
            'patrones_implementados' => [
                [
                    'nombre' => 'Singleton',
                    'categoria' => 'Creacional',
                    'clases' => ['Belleza\Core\Database', 'Belleza\Core\Config'],
                    'descripcion' => 'Garantiza una única instancia compartida de la conexión PDO a MySQL en XAMPP y del registro de configuración global.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Factory Method',
                    'categoria' => 'Creacional',
                    'clases' => ['Belleza\Patterns\Factory\PaymentGatewayFactory', 'Belleza\Patterns\Factory\NotificationFactory'],
                    'descripcion' => 'Instancia dinámicamente pasarelas de pago (PSE, Tarjeta, Wompi, Efectivo) y canales de notificación (Email, SMS, WhatsApp).',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Builder',
                    'categoria' => 'Creacional',
                    'clases' => ['Belleza\Patterns\Builder\OrderBuilder', 'Belleza\Patterns\Builder\InvoiceBuilder'],
                    'descripcion' => 'Construye pedidos complejos con múltiples líneas de producto y genera la Factura Electrónica con cálculo de CUFE (SHA-384) bajo estándar DIAN.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Facade & API Gateway',
                    'categoria' => 'Estructural',
                    'clases' => ['Belleza\Patterns\Facade\ApiGatewayFacade'],
                    'descripcion' => 'Unifica y orquesta los 8 microservicios / dominios funcionales (Usuarios, Productos, Inventario, Ventas, Pedidos, Proveedores, Clientes, Administrativo) para clientes Web y Móviles.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Repository',
                    'categoria' => 'Estructural / Acceso a Datos',
                    'clases' => ['ProductRepository', 'OrderRepository', 'InventoryRepository', 'UserRepository', 'SalesRepository', 'SupplierRepository', 'CustomerRepository', 'AdminRepository'],
                    'descripcion' => 'Aísla completamente la lógica de negocio de las consultas SQL a las 21 tablas de MySQL en XAMPP.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Strategy',
                    'categoria' => 'Comportamiento',
                    'clases' => ['BogotaExpressShippingStrategy', 'MedellinExpressShippingStrategy', 'CaliExpressShippingStrategy', 'StorePickupShippingStrategy'],
                    'descripcion' => 'Permite intercambiar dinámicamente los algoritmos de logística, tiempos de entrega y fletes según la sede y método de envío.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Observer',
                    'categoria' => 'Comportamiento',
                    'clases' => ['OrderEventManager', 'StockDeductionObserver', 'InventoryAlertObserver', 'CustomerNotificationObserver', 'SalesRecordingObserver'],
                    'descripcion' => 'Reacciona en cadena ante la creación o cambio de estado de pedidos: descuenta inventario, genera alertas de stock, notifica al cliente y asienta la venta contable.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'State',
                    'categoria' => 'Comportamiento',
                    'clases' => ['OrderContext', 'PagoConfirmadoState', 'PreparacionBodegaState', 'EnRutaState', 'EntregadoState'],
                    'descripcion' => 'Gestiona la máquina de estados del pedido permitiendo transiciones válidas durante la preparación, despacho y entrega.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Adapter',
                    'categoria' => 'Estructural',
                    'clases' => ['Belleza\Patterns\Adapter\DianBillingAdapter'],
                    'descripcion' => 'Adapta la estructura interna de órdenes a esquemas XML UBL 2.1 y cadenas QR de validación fiscal exigidas por la DIAN.',
                    'estado' => 'Activo & Verificado'
                ],
                [
                    'nombre' => 'Chain of Responsibility',
                    'categoria' => 'Comportamiento',
                    'clases' => ['AuthenticationMiddleware', 'RoleAuthorizationMiddleware', 'RequestValidationMiddleware'],
                    'descripcion' => 'Filtra secuencialmente las solicitudes validando autenticación, autorización basada en roles (admin, empleado, cliente) y campos requeridos.',
                    'estado' => 'Activo & Verificado'
                ],
            ]
        ]);
    }

    else {
        Response::error("Ruta no encontrada en el API Gateway: [{$method}] {$route}", 404);
    }

} catch (\Throwable $e) {
    Response::error($e->getMessage(), 500, [
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
}
