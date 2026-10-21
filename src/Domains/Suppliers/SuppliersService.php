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

    public function addSupplier(array $data): array {
        $id = $this->repo->addSupplier($data);
        return [
            'success' => true,
            'id'      => $id,
            'message' => "Laboratorio proveedor registrado exitosamente en MySQL."
        ];
    }

    public function receiveOrder(string $orderId): array {
        $this->repo->receivePurchaseOrder($orderId);
        return [
            'success' => true,
            'message' => "Mercancía de orden {$orderId} ingresada a bodega e inventario actualizado."
        ];
    }

    public function payOrder(string $orderId): array {
        $this->repo->markPurchaseOrderPaid($orderId);
        return [
            'success' => true,
            'message' => "Orden {$orderId} marcada como pagada al proveedor."
        ];
    }
}
