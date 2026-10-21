<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula la persistencia del Dominio de Pedidos
 */
class OrderRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll(int $limit = 50): array {
        $stmt = $this->db->prepare("SELECT o.*, s.nombre AS sede_nombre, u.nombre AS cliente_nombre, u.email AS cliente_email
                                    FROM pedidos o
                                    JOIN sedes s ON o.sede_origen_id = s.id
                                    JOIN usuarios u ON o.usuario_id = u.id
                                    ORDER BY o.created_at DESC LIMIT :lim");
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $orders = $stmt->fetchAll();

        foreach ($orders as &$ord) {
            $ord['items'] = $this->getOrderItems($ord['id']);
            $ord['dian_invoice'] = $this->getDianInvoice($ord['id']);
        }
        return $orders;
    }

    public function getById(string $id): ?array {
        $stmt = $this->db->prepare("SELECT o.*, s.nombre AS sede_nombre, u.nombre AS cliente_nombre, u.email AS cliente_email
                                    FROM pedidos o
                                    JOIN sedes s ON o.sede_origen_id = s.id
                                    JOIN usuarios u ON o.usuario_id = u.id
                                    WHERE o.id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $order = $stmt->fetch();
        if (!$order) return null;

        $order['items'] = $this->getOrderItems($id);
        $order['dian_invoice'] = $this->getDianInvoice($id);
        return $order;
    }

    public function getOrderItems(string $orderId): array {
        $stmt = $this->db->prepare("SELECT * FROM pedido_items WHERE pedido_id = :oid");
        $stmt->execute([':oid' => $orderId]);
        return $stmt->fetchAll();
    }

    public function getDianInvoice(string $orderId): ?array {
        $stmt = $this->db->prepare("SELECT * FROM facturas_dian WHERE pedido_id = :oid LIMIT 1");
        $stmt->execute([':oid' => $orderId]);
        return $stmt->fetch() ?: null;
    }

    public function save(array $orderData, array $items, array $dianData): string {
        $this->db->beginTransaction();
        try {
            $sql = "INSERT INTO pedidos (id, usuario_id, fecha_formato, timestamp, estado, estado_etiqueta, total, subtotal, descuento, iva, envio, codigo_cupon, sede_origen_id, metodo_envio, direccion_entrega, ventana_estimada, transportadora, numero_guia, conductor_nombre, conductor_vehiculo, conductor_rating, conductor_viajes, conductor_telefono, conductor_avatar)
                    VALUES (:id, :usuario_id, :fecha_formato, :timestamp, :estado, :estado_etiqueta, :total, :subtotal, :descuento, :iva, :envio, :codigo_cupon, :sede_origen_id, :metodo_envio, :direccion_entrega, :ventana_estimada, :transportadora, :numero_guia, :conductor_nombre, :conductor_vehiculo, :conductor_rating, :conductor_viajes, :conductor_telefono, :conductor_avatar)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id' => $orderData['id'],
                ':usuario_id' => $orderData['usuario_id'],
                ':fecha_formato' => $orderData['fecha_formato'],
                ':timestamp' => $orderData['timestamp'],
                ':estado' => $orderData['estado'],
                ':estado_etiqueta' => $orderData['estado_etiqueta'],
                ':total' => $orderData['total'],
                ':subtotal' => $orderData['subtotal'],
                ':descuento' => $orderData['descuento'],
                ':iva' => $orderData['iva'],
                ':envio' => $orderData['envio'],
                ':codigo_cupon' => $orderData['codigo_cupon'] ?? null,
                ':sede_origen_id' => $orderData['sede_origen_id'],
                ':metodo_envio' => $orderData['metodo_envio'],
                ':direccion_entrega' => $orderData['direccion_entrega'],
                ':ventana_estimada' => $orderData['ventana_estimada'],
                ':transportadora' => $orderData['transportadora'],
                ':numero_guia' => $orderData['numero_guia'],
                ':conductor_nombre' => $orderData['conductor_nombre'] ?? null,
                ':conductor_vehiculo' => $orderData['conductor_vehiculo'] ?? null,
                ':conductor_rating' => $orderData['conductor_rating'] ?? 4.9,
                ':conductor_viajes' => $orderData['conductor_viajes'] ?? 100,
                ':conductor_telefono' => $orderData['conductor_telefono'] ?? null,
                ':conductor_avatar' => $orderData['conductor_avatar'] ?? null,
            ]);

            // Guardar items
            $itemStmt = $this->db->prepare("INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, categoria, cantidad, precio_unitario, codigo_lote, imagen_url, volumen_gramos, tono_seleccionado)
                                            VALUES (:pedido_id, :producto_id, :nombre_producto, :categoria, :cantidad, :precio_unitario, :codigo_lote, :imagen_url, :volumen_gramos, :tono_seleccionado)");
            foreach ($items as $item) {
                $itemStmt->execute([
                    ':pedido_id' => $orderData['id'],
                    ':producto_id' => $item['producto_id'] ?? null,
                    ':nombre_producto' => $item['nombre_producto'],
                    ':categoria' => $item['categoria'] ?? 'Dermocosmética',
                    ':cantidad' => $item['cantidad'],
                    ':precio_unitario' => $item['precio_unitario'],
                    ':codigo_lote' => $item['codigo_lote'] ?? '#LOTE-DEF',
                    ':imagen_url' => $item['imagen_url'] ?? '',
                    ':volumen_gramos' => $item['volumen_gramos'] ?? '30 ml',
                    ':tono_seleccionado' => $item['tono_seleccionado'] ?? null,
                ]);
            }

            // Guardar Factura DIAN
            $dianStmt = $this->db->prepare("INSERT INTO facturas_dian (pedido_id, numero_factura, cufe, xml_emitido, pdf_listo)
                                            VALUES (:pid, :num, :cufe, 1, 1)");
            $dianStmt->execute([
                ':pid' => $orderData['id'],
                ':num' => $dianData['numero_factura'],
                ':cufe' => $dianData['cufe'],
            ]);

            $this->db->commit();
            return $orderData['id'];
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateStatus(string $orderId, string $status, string $label): bool {
        $stmt = $this->db->prepare("UPDATE pedidos SET estado = :st, estado_etiqueta = :lbl WHERE id = :id");
        return $stmt->execute([':st' => $status, ':lbl' => $label, ':id' => $orderId]);
    }
}
