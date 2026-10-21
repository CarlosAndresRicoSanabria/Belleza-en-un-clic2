<?php
namespace Belleza\Patterns\Strategy\Shipping;

class StorePickupShippingStrategy implements ShippingStrategyInterface {
    public function calculateCost(): float {
        return 0.0;
    }
    public function getEstimatedDeliveryTime(): string {
        return 'Listo en 45 min para retiro en mostrador';
    }
    public function getCourierName(): string {
        return 'Retiro en Tienda / Mostrador Sede';
    }
}
