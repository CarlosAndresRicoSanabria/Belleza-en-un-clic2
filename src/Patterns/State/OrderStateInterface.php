<?php
namespace Belleza\Patterns\State;

interface OrderStateInterface {
    public function getStatusKey(): string;
    public function getLabel(): string;
    public function next(OrderContext $context): void;
    public function canCancel(): bool;
}

class PagoConfirmadoState implements OrderStateInterface {
    public function getStatusKey(): string { return 'pago_confirmado'; }
    public function getLabel(): string { return 'Pago Aprobado · En Alistamiento de Bodega'; }
    public function next(OrderContext $context): void {
        $context->setState(new PreparacionBodegaState());
    }
    public function canCancel(): bool { return true; }
}

class PreparacionBodegaState implements OrderStateInterface {
    public function getStatusKey(): string { return 'preparacion_bodega'; }
    public function getLabel(): string { return 'Empacado & Listo para Despacho'; }
    public function next(OrderContext $context): void {
        $context->setState(new EnRutaState());
    }
    public function canCancel(): bool { return false; }
}

class EnRutaState implements OrderStateInterface {
    public function getStatusKey(): string { return 'en_ruta'; }
    public function getLabel(): string { return 'En Tránsito Nacional / Conductor Asignado'; }
    public function next(OrderContext $context): void {
        $context->setState(new EntregadoState());
    }
    public function canCancel(): bool { return false; }
}

class EntregadoState implements OrderStateInterface {
    public function getStatusKey(): string { return 'entregado'; }
    public function getLabel(): string { return 'Entregado con Éxito al Cliente'; }
    public function next(OrderContext $context): void {
        throw new \Exception("El pedido ya se encuentra en su estado final de entrega.");
    }
    public function canCancel(): bool { return false; }
}

/**
 * Patrón de Diseño: STATE
 * Maneja la máquina de estados del pedido controlando las transiciones válidas del ciclo de vida
 */
class OrderContext {
    private OrderStateInterface $state;
    private string $orderId;

    public function __construct(string $orderId, ?string $currentStatus = 'pago_confirmado') {
        $this->orderId = $orderId;
        $this->state = self::createStateFromString($currentStatus);
    }

    public static function createStateFromString(string $status): OrderStateInterface {
        switch ($status) {
            case 'preparacion_bodega':
                return new PreparacionBodegaState();
            case 'en_ruta':
                return new EnRutaState();
            case 'entregado':
                return new EntregadoState();
            case 'pago_confirmado':
            default:
                return new PagoConfirmadoState();
        }
    }

    public function setState(OrderStateInterface $state): void {
        $this->state = $state;
    }

    public function getState(): OrderStateInterface {
        return $this->state;
    }

    public function advance(): void {
        $this->state->next($this);
    }

    public function getStatusKey(): string {
        return $this->state->getStatusKey();
    }

    public function getLabel(): string {
        return $this->state->getLabel();
    }
}
