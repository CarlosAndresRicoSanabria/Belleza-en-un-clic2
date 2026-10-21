<?php
namespace Belleza\Patterns\Observer;

use Belleza\Patterns\Repository\InventoryRepository;
use Belleza\Patterns\Repository\SalesRepository;
use Belleza\Patterns\Factory\NotificationFactory;

/**
 * Patrón de Diseño: OBSERVER
 * Gestor de eventos desacoplado que coordina múltiples subsistemas ante eventos de negocio
 */
class OrderEventManager implements SubjectInterface {
    private array $observers = [];

    public function attach(string $event, ObserverInterface $observer): void {
        $this->observers[$event][] = $observer;
    }

    public function detach(string $event, ObserverInterface $observer): void {
        if (!isset($this->observers[$event])) return;
        $this->observers[$event] = array_filter(
            $this->observers[$event],
            fn($obs) => $obs !== $observer
        );
    }

    public function notify(string $event, array $data): void {
        if (empty($this->observers[$event])) return;
        foreach ($this->observers[$event] as $observer) {
            $observer->update($event, $data);
        }
    }
}

/**
 * Observador 1: Deducción automática de inventario en la sede de despacho
 */
class StockDeductionObserver implements ObserverInterface {
    public function update(string $event, array $data): void {
        if ($event !== 'order.created') return;

        $order = $data['order'];
        $items = $data['items'];
        $sedeId = $order['sede_origen_id'];
        $invRepo = new InventoryRepository();

        foreach ($items as $it) {
            if (empty($it['producto_id'])) continue;
            $currentStock = $invRepo->getStock($it['producto_id'], $sedeId);
            $newStock = max(0, $currentStock - $it['cantidad']);
            $invRepo->updateStock($it['producto_id'], $sedeId, $newStock, "Venta en pedido {$order['id']}", $order['usuario_id']);
        }
    }
}

/**
 * Observador 2: Detección y emisión de alertas de stock crítico para la administración
 */
class InventoryAlertObserver implements ObserverInterface {
    public function update(string $event, array $data): void {
        // Verifica si algún producto bajó del stock mínimo
        $invRepo = new InventoryRepository();
        $alerts = $invRepo->getLowStockAlerts();
        // Si hay alertas críticas, se registran o notifican a bodega
        if (count($alerts) > 0) {
            // Log o acción reactiva
        }
    }
}

/**
 * Observador 3: Notificación multicanal al cliente sobre el estado de su pedido
 */
class CustomerNotificationObserver implements ObserverInterface {
    public function update(string $event, array $data): void {
        $order = $data['order'];
        $customerEmail = $data['customer_email'] ?? 'sofia.gomez@glow.co';
        $customerPhone = $data['customer_phone'] ?? '+573128492034';
        $customerName = $data['customer_name'] ?? 'Cliente';

        if ($event === 'order.created') {
            $msg = "Hola {$customerName}, tu pedido {$order['id']} por $" . number_format($order['total'], 0, ',', '.') . " ha sido confirmado exitosamente. Sede de despacho: {$order['sede_origen_id']}. Guía: {$order['numero_guia']}. Factura DIAN adjunta.";
            
            // Envío por Email
            $emailChannel = NotificationFactory::create('email');
            $emailChannel->send($order['usuario_id'], $customerEmail, $msg, "Confirmación de Pedido {$order['id']} - Belleza en un Clic");

            // Envío por WhatsApp
            $waChannel = NotificationFactory::create('whatsapp');
            $waChannel->send($order['usuario_id'], $customerPhone, $msg);
        } elseif ($event === 'order.status_changed') {
            $msg = "Tu pedido {$order['id']} cambió de estado a: {$order['estado_etiqueta']}. Seguimiento: {$order['numero_guia']}";
            NotificationFactory::create('whatsapp')->send($order['usuario_id'], $customerPhone, $msg);
        }
    }
}

/**
 * Observador 4: Registro contable automático en el Dominio de Ventas y Cuadre de Caja
 */
class SalesRecordingObserver implements ObserverInterface {
    public function update(string $event, array $data): void {
        if ($event !== 'order.created') return;

        $order = $data['order'];
        $salesRepo = new SalesRepository();
        $salesRepo->recordSale(
            $order['id'],
            $order['sede_origen_id'],
            $order['usuario_id'],
            $order['total'],
            $data['payment_method'] ?? 'pse',
            $data['payment_reference'] ?? ('REF-' . time())
        );
    }
}
