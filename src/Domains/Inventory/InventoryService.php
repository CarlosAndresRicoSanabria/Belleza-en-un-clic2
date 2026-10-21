<?php
namespace Belleza\Domains\Inventory;

use Belleza\Patterns\Repository\InventoryRepository;

/**
 * Microservicio: Dominio de Inventario
 * Control de stock multi-sede, Entradas/Salidas, Transferencias y Alertas
 */
class InventoryService {
    private InventoryRepository $repo;

    public function __construct() {
        $this->repo = new InventoryRepository();
    }

    public function getSedes(): array {
        return $this->repo->getSedes();
    }

    public function updateStock(string $productId, string $sedeId, int $newStock, ?string $userId = null): array {
        $this->repo->updateStock($productId, $sedeId, $newStock, 'Ajuste manual desde panel', $userId);
        return [
            'success'   => true,
            'productId' => $productId,
            'sedeId'    => $sedeId,
            'newStock'  => $newStock
        ];
    }

    public function transferStock(string $productId, string $sourceSedeId, string $targetSedeId, int $quantity, ?string $userId = null): array {
        $this->repo->transferStock($productId, $sourceSedeId, $targetSedeId, $quantity, $userId);
        return [
            'success'   => true,
            'message'   => "Transferencia de {$quantity} unidades de {$sourceSedeId} hacia {$targetSedeId} completada con éxito."
        ];
    }

    public function getLowStockAlerts(): array {
        return $this->repo->getLowStockAlerts();
    }

    public function getMovements(): array {
        return $this->repo->getMovementsHistory();
    }
}
