<?php
namespace Belleza\Domains\Suppliers;

use Belleza\Patterns\Repository\SupplierRepository;

/**
 * Microservicio: Dominio de Proveedores
 * Registro de proveedores, Órdenes de compra y Abastecimiento
 */
class SuppliersService {
    private SupplierRepository $repo;

    public function __construct() {
        $this->repo = new SupplierRepository();
    }

    public function listSuppliers(): array {
        return $this->repo->getAll();
    }

    public function listPurchaseOrders(): array {
        return $this->repo->getPurchaseOrders();
    }

    public function createPurchaseOrder(array $data): array {
        $id = $this->repo->createPurchaseOrder($data);
        return [
            'success' => true,
            'id'      => $id,
            'message' => "Orden de compra {$id} radicada ante el laboratorio proveedor."
        ];
    }
}
