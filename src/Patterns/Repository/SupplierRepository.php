<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el acceso a datos para el Dominio de Proveedores
 */
class SupplierRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM proveedores ORDER BY razon_social ASC");
        return $stmt->fetchAll();
    }

    public function getPurchaseOrders(): array {
        $sql = "SELECT oc.*, p.razon_social AS proveedor_nombre, s.nombre AS sede_destino_nombre
                FROM ordenes_compra oc
                JOIN proveedores p ON oc.proveedor_id = p.id
                JOIN sedes s ON oc.sede_destino_id = s.id
                ORDER BY oc.fecha_emision DESC";
        return $this->db->query($sql)->fetchAll();
    }

    public function createPurchaseOrder(array $data): string {
        $id = 'OC-2026-' . rand(100, 999);
        $sql = "INSERT INTO ordenes_compra (id, proveedor_id, sede_destino_id, fecha_emision, total, estado, notas)
                VALUES (:id, :prov, :sede, :fecha, :total, :estado, :notas)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':prov' => $data['proveedor_id'],
            ':sede' => $data['sede_destino_id'],
            ':fecha' => date('Y-m-d'),
            ':total' => $data['total'] ?? 0,
            ':estado' => $data['estado'] ?? 'enviada',
            ':notas' => $data['notas'] ?? 'Reposición automática de stock crítico'
        ]);
        return $id;
    }

    public function addSupplier(array $data): string {
        $id = 'prov-' . time();
        $sql = "INSERT INTO proveedores (id, nit, razon_social, contacto_nombre, email, telefono, direccion, ciudad, categoria_suministro)
                VALUES (:id, :nit, :razon, :contacto, :email, :tel, :dir, :ciudad, :cat)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':nit' => $data['nit'],
            ':razon' => $data['razon_social'],
            ':contacto' => $data['contacto_nombre'] ?? 'Contacto Principal',
            ':email' => $data['email'],
            ':tel' => $data['telefono'] ?? '+57 (601) 000 0000',
            ':dir' => $data['direccion'] ?? 'Zona Industrial',
            ':ciudad' => $data['ciudad'] ?? 'Bogotá D.C.',
            ':cat' => $data['categoria_suministro'] ?? 'Dermocosmética'
        ]);
        return $id;
    }

    public function receivePurchaseOrder(string $orderId): bool {
        $stmt = $this->db->prepare("UPDATE ordenes_compra SET estado = 'recibida' WHERE id = :id");
        return $stmt->execute([':id' => $orderId]);
    }

    public function markPurchaseOrderPaid(string $orderId): bool {
        $stmt = $this->db->prepare("UPDATE ordenes_compra SET estado = 'pagada' WHERE id = :id");
        return $stmt->execute([':id' => $orderId]);
    }
}
