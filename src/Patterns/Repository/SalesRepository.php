<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el acceso a datos para el Dominio de Ventas y Facturación
 */
class SalesRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function recordSale(string $orderId, string $sedeId, string $userId, float $total, string $paymentMethod, string $reference): int {
        $sql = "INSERT INTO ventas (pedido_id, sede_id, usuario_id, total, metodo_pago, referencia_pago)
                VALUES (:oid, :sid, :uid, :tot, :met, :ref)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':oid' => $orderId,
            ':sid' => $sedeId,
            ':uid' => $userId,
            ':tot' => $total,
            ':met' => $paymentMethod,
            ':ref' => $reference,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function getAllSales(int $limit = 50): array {
        $sql = "SELECT v.*, o.numero_guia, f.numero_factura, f.cufe, s.nombre AS sede_nombre, u.nombre AS cliente_nombre
                FROM ventas v
                JOIN pedidos o ON v.pedido_id = o.id
                LEFT JOIN facturas_dian f ON o.id = f.pedido_id
                JOIN sedes s ON v.sede_id = s.id
                JOIN usuarios u ON v.usuario_id = u.id
                ORDER BY v.fecha_venta DESC LIMIT :lim";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getCashDrawers(): array {
        $sql = "SELECT c.*, s.nombre AS sede_nombre, u.nombre AS usuario_nombre 
                FROM cuadres_caja c
                JOIN sedes s ON c.sede_id = s.id
                JOIN usuarios u ON c.usuario_id = u.id
                ORDER BY c.fecha DESC, c.id DESC";
        return $this->db->query($sql)->fetchAll();
    }

    public function getSalesSummary(): array {
        $sql = "SELECT 
                    COUNT(*) AS total_transacciones,
                    COALESCE(SUM(total), 0) AS total_recaudado,
                    COALESCE(AVG(total), 0) AS ticket_promedio
                FROM ventas";
        $summary = $this->db->query($sql)->fetch();

        // Ventas por método de pago
        $byMethod = $this->db->query("SELECT metodo_pago, COUNT(*) AS count, SUM(total) AS total FROM ventas GROUP BY metodo_pago")->fetchAll();
        $summary['por_metodo'] = $byMethod;

        // Ventas por sede
        $bySede = $this->db->query("SELECT s.nombre, COUNT(v.id) AS count, COALESCE(SUM(v.total), 0) AS total 
                                     FROM sedes s 
                                     LEFT JOIN ventas v ON s.id = v.sede_id 
                                     GROUP BY s.id, s.nombre")->fetchAll();
        $summary['por_sede'] = $bySede;

        return $summary;
    }
}
