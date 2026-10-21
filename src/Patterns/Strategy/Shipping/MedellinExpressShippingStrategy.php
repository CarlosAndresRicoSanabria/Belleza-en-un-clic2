<?php
namespace Belleza\Patterns\Strategy\Shipping;

class MedellinExpressShippingStrategy implements ShippingStrategyInterface {
    public function calculateCost(): float {
        return 0.0;
    }
    public function getEstimatedDeliveryTime(): string {
        return 'Hoy, < 3h Valle de Aburrá / El Poblado';
    }
    public function getCourierName(): string {
        return 'Envía Express Antioquia';
    }
}
