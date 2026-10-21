<?php
namespace Belleza\Domains\Sales;

use Belleza\Patterns\Repository\SalesRepository;
use Belleza\Patterns\Adapter\DianBillingAdapter;

/**
 * Microservicio: Dominio de Ventas
 * Registro de ventas, Facturación DIAN, Cuadres de caja y Reportes
 */
class SalesService {
    private SalesRepository $repo;
    private DianBillingAdapter $dianAdapter;

    public function __construct() {
        $this->repo = new SalesRepository();
        $this->dianAdapter = new DianBillingAdapter();
    }

    public function getSalesHistory(int $limit = 50): array {
        return $this->repo->getAllSales($limit);
    }

    public function getCashDrawers(): array {
        return $this->repo->getCashDrawers();
    }

    public function getSalesSummary(): array {
        return $this->repo->getSalesSummary();
    }
}
