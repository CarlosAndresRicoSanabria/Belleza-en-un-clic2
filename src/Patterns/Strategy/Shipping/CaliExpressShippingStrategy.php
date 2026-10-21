<?php
namespace Belleza\Patterns\Strategy\Shipping;

class CaliExpressShippingStrategy implements ShippingStrategyInterface {
    public function calculateCost(): float {
        return 0.0;
    }
    public function getEstimatedDeliveryTime(): string {
        return 'Hoy, < 3h Zona Urbana Granada / Cali';
    }
    public function getCourierName(): string {
        return 'Servientrega Express Suroccidente';
    }
}
