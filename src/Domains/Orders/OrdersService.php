<?php
namespace Belleza\Domains\Orders;

use Belleza\Patterns\Builder\OrderBuilder;
use Belleza\Patterns\Builder\InvoiceBuilder;
use Belleza\Patterns\Factory\PaymentGatewayFactory;
use Belleza\Patterns\Observer\OrderEventManager;
use Belleza\Patterns\Observer\StockDeductionObserver;
use Belleza\Patterns\Observer\InventoryAlertObserver;
use Belleza\Patterns\Observer\CustomerNotificationObserver;
use Belleza\Patterns\Observer\SalesRecordingObserver;
use Belleza\Patterns\Repository\OrderRepository;
use Belleza\Patterns\Repository\ProductRepository;
use Belleza\Patterns\Repository\UserRepository;
use Belleza\Patterns\State\OrderContext;

/**
 * Microservicio: Dominio de Pedidos
 * Creación de pedidos, Estados, Seguimiento y Notificaciones
 */
class OrdersService {
    private OrderRepository $repo;
    private OrderEventManager $eventManager;

    public function __construct() {
        $this->repo = new OrderRepository();
        $this->eventManager = new OrderEventManager();

        // Conectar observadores al gestor de eventos (Observer Pattern)
        $this->eventManager->attach('order.created', new StockDeductionObserver());
        $this->eventManager->attach('order.created', new InventoryAlertObserver());
        $this->eventManager->attach('order.created', new CustomerNotificationObserver());
        $this->eventManager->attach('order.created', new SalesRecordingObserver());
        $this->eventManager->attach('order.status_changed', new CustomerNotificationObserver());
    }

    public function listOrders(int $limit = 50): array {
        return $this->repo->getAll($limit);
    }

    public function getOrder(string $id): ?array {
        return $this->repo->getById($id);
    }

    /**
     * Crea un pedido orquestando el Builder, Factory de Pagos, Factura DIAN y Observers
     */
    public function placeOrder(array $payload): array {
        $userId = $payload['usuario_id'] ?? 'usr-sofia';
        $sedeId = $payload['sede_id'] ?? 'bogota';
        $shippingMethod = $payload['metodo_envio'] ?? 'domicilio';
        $address = $payload['direccion_entrega'] ?? 'Dirección Principal';
        $coupon = $payload['codigo_cupon'] ?? null;
        $cartItems = $payload['items'] ?? [];
        $paymentMethod = $payload['metodo_pago'] ?? 'pse';

        if (empty($cartItems)) {
            throw new \Exception("El carrito no puede estar vacío.");
        }

        // 1. Obtener datos del cliente
        $userRepo = new UserRepository();
        $user = $userRepo->findById($userId);
        $customerName = $user['nombre'] ?? 'Cliente Belleza';
        $customerDoc = $user['numero_documento'] ?? '1020458912';
        $customerEmail = $user['email'] ?? 'sofia.gomez@glow.co';
        $customerPhone = $user['telefono'] ?? '+573128492034';

        // 2. Construir Pedido usando Builder Pattern
        $builder = new OrderBuilder();
        $builder->forUser($userId)
                ->fromSede($sedeId)
                ->withShippingMethod($shippingMethod, $address)
                ->applyCoupon($coupon);

        $prodRepo = new ProductRepository();
        foreach ($cartItems as $cItem) {
            $prod = $prodRepo->getById($cItem['product_id']);
            if ($prod) {
                $builder->addItem($prod, (int)$cItem['quantity'], $cItem['shade'] ?? null);
            }
        }

        $orderBundle = $builder->build();
        $orderData = $orderBundle['order'];
        $itemsData = $orderBundle['items'];

        // 3. Procesar Pago usando Factory Method Pattern
        $paymentProcessor = PaymentGatewayFactory::create($paymentMethod);
        $paymentResult = $paymentProcessor->process((float)$orderData['total'], [
            'bank' => $payload['banco'] ?? 'Bancolombia'
        ]);

        // 4. Construir Factura DIAN con CUFE usando InvoiceBuilder
        $invoiceBuilder = new InvoiceBuilder($orderData['id']);
        $invoiceBuilder->withSedePrefix($sedeId)
                       ->withAmounts((float)$orderData['subtotal'], (float)$orderData['iva'], (float)$orderData['total'])
                       ->withCustomer($customerName, $customerDoc, $customerEmail);
        $dianData = $invoiceBuilder->build();

        // 5. Persistir en la base de datos MySQL de XAMPP vía Repository
        $this->repo->save($orderData, $itemsData, $dianData);

        // 6. Notificar a los observadores (Observer Pattern)
        $this->eventManager->notify('order.created', [
            'order'             => $orderData,
            'items'             => $itemsData,
            'dian'              => $dianData,
            'payment'           => $paymentResult,
            'payment_method'    => $paymentMethod,
            'payment_reference' => $paymentResult['reference'],
            'customer_name'     => $customerName,
            'customer_email'    => $customerEmail,
            'customer_phone'    => $customerPhone,
        ]);

        return [
            'success'   => true,
            'order_id'  => $orderData['id'],
            'guia'      => $orderData['numero_guia'],
            'factura'   => $dianData['numero_factura'],
            'cufe'      => $dianData['cufe'],
            'total'     => $orderData['total'],
            'payment'   => $paymentResult,
            'message'   => "¡Pedido {$orderData['id']} generado con éxito! Factura DIAN {$dianData['numero_factura']} radicada."
        ];
    }

    /**
     * Avanza el estado del pedido usando el State Pattern
     */
    public function advanceOrderStatus(string $orderId): array {
        $order = $this->repo->getById($orderId);
        if (!$order) {
            throw new \Exception("Pedido no encontrado.");
        }

        $context = new OrderContext($orderId, $order['estado']);
        $context->advance();

        $newStatus = $context->getStatusKey();
        $newLabel = $context->getLabel();

        $this->repo->updateStatus($orderId, $newStatus, $newLabel);

        $order['estado'] = $newStatus;
        $order['estado_etiqueta'] = $newLabel;

        $this->eventManager->notify('order.status_changed', [
            'order'          => $order,
            'customer_phone' => $order['conductor_telefono'] ?? '+573128492034',
        ]);

        return [
            'success'        => true,
            'order_id'       => $orderId,
            'nuevo_estado'   => $newStatus,
            'etiqueta'       => $newLabel,
        ];
    }
}
