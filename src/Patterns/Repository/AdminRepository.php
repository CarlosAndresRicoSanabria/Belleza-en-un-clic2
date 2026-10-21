<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el acceso a datos para el Dominio Administrativo
 */
class AdminRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getStaff(): array {
        $sql = "SELECT p.*, u.nombre, u.email, u.telefono, u.rol, s.nombre AS sede_nombre 
                FROM personal p
                JOIN usuarios u ON p.usuario_id = u.id
                JOIN sedes s ON p.sede_asignada_id = s.id
                ORDER BY p.created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    public function getFinancialMetrics(): array {
        $totalSales = $this->db->query("SELECT COALESCE(SUM(total), 0) AS total, COALESCE(SUM(iva), 0) AS total_iva, COALESCE(SUM(subtotal), 0) AS total_base FROM pedidos WHERE estado != 'cancelado'")->fetch();
        $totalOrders = $this->db->query("SELECT COUNT(*) AS total FROM pedidos")->fetch()['total'];
        $lowStockCount = $this->db->query("SELECT COUNT(*) AS total FROM inventario_sedes inv JOIN productos p ON inv.producto_id = p.id WHERE inv.stock <= p.stock_minimo_recomendado")->fetch()['total'];
        $staffCount = $this->db->query("SELECT COUNT(*) AS total FROM personal WHERE estado = 'activo'")->fetch()['total'];

        return [
            'total_ventas'       => (float)$totalSales['total'],
            'total_iva_dian'     => (float)$totalSales['total_iva'],
            'total_base_gravable'=> (float)$totalSales['total_base'],
            'pedidos_totales'    => (int)$totalOrders,
            'alertas_stock'      => (int)$lowStockCount,
            'empleados_activos'  => (int)$staffCount,
        ];
    }

    public function getSystemSettings(): array {
        return $this->db->query("SELECT * FROM configuracion_sistema ORDER BY clave ASC")->fetchAll();
    }

    public function updateSetting(string $key, string $value): bool {
        $stmt = $this->db->prepare("INSERT INTO configuracion_sistema (clave, valor) VALUES (:k, :v) ON DUPLICATE KEY UPDATE valor = VALUES(valor)");
        return $stmt->execute([':k' => $key, ':v' => $value]);
    }

    public function addStaff(array $data): string {
        $id = 'emp-' . rand(10, 99);
        $sql = "INSERT INTO personal (id, usuario_id, cargo, sede_asignada_id, salario_base, fecha_ingreso, estado)
                VALUES (:id, :uid, :cargo, :sede, :salario, :fecha, 'activo')";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':uid' => $data['usuario_id'],
            ':cargo' => $data['cargo'],
            ':sede' => $data['sede_id'] ?? 'bogota',
            ':salario' => $data['salario'] ?? 2000000,
            ':fecha' => date('Y-m-d')
        ]);
        return $id;
    }

    public function toggleStaffStatus(string $staffId): bool {
        $stmt = $this->db->prepare("UPDATE personal SET estado = IF(estado = 'activo', 'inactivo', 'activo') WHERE id = :id");
        return $stmt->execute([':id' => $staffId]);
    }
}
