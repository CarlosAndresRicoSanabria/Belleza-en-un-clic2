<?php
namespace Belleza\Patterns\Strategy\Shipping;

/**
 * Patrón de Diseño: STRATEGY
 * Interfaz común para algoritmos de cálculo de fletes y logística según la sede y método
 */
interface ShippingStrategyInterface {
    public function calculateCost(): float;
    public function getEstimatedDeliveryTime(): string;
    public function getCourierName(): string;
}
