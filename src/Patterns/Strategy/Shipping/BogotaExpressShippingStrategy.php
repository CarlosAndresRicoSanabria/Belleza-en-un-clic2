<?php
namespace Belleza\Patterns\Strategy\Shipping;

class BogotaExpressShippingStrategy implements ShippingStrategyInterface {
    public function calculateCost(): float {
        return 0.0; // Despacho express gratis en Bogotá por compras estándar
    }
    public function getEstimatedDeliveryTime(): string {
        return 'Hoy, < 2h en Zona Norte y Chicó';
    }
    public function getCourierName(): string {
        return 'Coordinadora Express Dermo-Flota Bogotá';
    }
}
