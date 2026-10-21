<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el control de inventario multi-sede, transferencias y alertas
 */
class InventoryRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getSedes(): array {
        $stmt = $this->db->query("SELECT * FROM sedes WHERE activa = 1 ORDER BY id ASC");
        return $stmt->fetchAll();
    }

    public function getStock(string $productId, string $sedeId): int {
        $stmt = $this->db->prepare("SELECT stock FROM inventario_sedes WHERE producto_id = :pid AND sede_id = :sid");
        $stmt->execute([':pid' => $productId, ':sid' => $sedeId]);
        $row = $stmt->fetch();
        return $row ? (int)$row['stock'] : 0;
    }

    public function updateStock(string $productId, string $sedeId, int $newStock, string $reason = 'Ajuste manual', ?string $userId = null): bool {
        $current = $this->getStock($productId, $sedeId);
        $diff = $newStock - $current;

        $stmt = $this->db->prepare("INSERT INTO inventario_sedes (producto_id, sede_id, stock) 
                                    VALUES (:pid, :sid, :stock) 
                                    ON DUPLICATE KEY UPDATE stock = VALUES(stock)");
        $stmt->execute([':pid' => $productId, ':sid' => $sedeId, ':stock' => $newStock]);

        // Registrar movimiento
        $tipo = $diff >= 0 ? 'entrada' : 'salida';
        $logStmt = $this->db->prepare("INSERT INTO movimientos_inventario (producto_id, sede_origen_id, tipo, cantidad, motivo, usuario_id) 
                                       VALUES (:pid, :sid, :tipo, :qty, :motivo, :uid)");
        $logStmt->execute([
            ':pid' => $productId,
            ':sid' => $sedeId,
            ':tipo' => $tipo,
            ':qty' => abs($diff),
            ':motivo' => $reason,
            ':uid' => $userId
        ]);

        return true;
    }

    public function transferStock(string $productId, string $sourceSedeId, string $targetSedeId, int $quantity, ?string $userId = null): bool {
        $sourceStock = $this->getStock($productId, $sourceSedeId);
        if ($sourceStock < $quantity) {
            throw new \Exception("Stock insuficiente en sede de origen ({$sourceStock} disponibles, se solicitaron {$quantity}).");
        }

        $this->db->beginTransaction();
        try {
            // Descontar origen
            $this->updateStock($productId, $sourceSedeId, $sourceStock - $quantity, "Transferencia hacia {$targetSedeId}", $userId);
            
            // Incrementar destino
            $targetStock = $this->getStock($productId, $targetSedeId);
            $this->updateStock($productId, $targetSedeId, $targetStock + $quantity, "Transferencia desde {$sourceSedeId}", $userId);

            // Registrar movimiento de transferencia
            $stmt = $this->db->prepare("INSERT INTO movimientos_inventario (producto_id, sede_origen_id, sede_destino_id, tipo, cantidad, motivo, usuario_id) 
                                        VALUES (:pid, :src, :dst, 'transferencia', :qty, 'Transferencia inter-sede', :uid)");
            $stmt->execute([
                ':pid' => $productId,
                ':src' => $sourceSedeId,
                ':dst' => $targetSedeId,
                ':qty' => $quantity,
                ':uid' => $userId
            ]);

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function getLowStockAlerts(): array {
        $sql = "SELECT p.id, p.nombre, p.sku, p.codigo_lote, p.ubicacion_pasillo, p.stock_minimo_recomendado,
                       s.id AS sede_id, s.nombre AS sede_nombre, COALESCE(inv.stock, 0) AS stock_actual
                FROM productos p
                CROSS JOIN sedes s
                LEFT JOIN inventario_sedes inv ON p.id = inv.producto_id AND s.id = inv.sede_id
                WHERE COALESCE(inv.stock, 0) <= p.stock_minimo_recomendado
                ORDER BY stock_actual ASC";
        return $this->db->query($sql)->fetchAll();
    }

    public function getMovementsHistory(int $limit = 50): array {
        $sql = "SELECT m.*, p.nombre AS producto_nombre, p.sku,
                       s1.nombre AS sede_origen_nombre, s2.nombre AS sede_destino_nombre
                FROM movimientos_inventario m
                JOIN productos p ON m.producto_id = p.id
                JOIN sedes s1 ON m.sede_origen_id = s1.id
                LEFT JOIN sedes s2 ON m.sede_destino_id = s2.id
                ORDER BY m.created_at DESC LIMIT :lim";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
