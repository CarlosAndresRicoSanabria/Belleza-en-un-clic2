<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el acceso a datos para el Dominio de Productos
 */
class ProductRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll(array $filters = []): array {
        $sql = "SELECT p.*, c.nombre AS categoria_nombre 
                FROM productos p 
                JOIN categorias c ON p.categoria_id = c.id 
                WHERE p.activo = 1";
        $params = [];

        if (!empty($filters['categoria'])) {
            $sql .= " AND p.categoria_id = :categoria";
            $params[':categoria'] = $filters['categoria'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (p.nombre LIKE :search OR p.marca LIKE :search OR p.descripcion LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $sql .= " ORDER BY p.rating DESC, p.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        foreach ($products as &$prod) {
            $prod['tonos'] = $this->getShades($prod['id']);
            $prod['stock_sedes'] = $this->getStockPerSedes($prod['id']);
        }

        return $products;
    }

    public function getById(string $id): ?array {
        $stmt = $this->db->prepare("SELECT p.*, c.nombre AS categoria_nombre 
                                    FROM productos p 
                                    JOIN categorias c ON p.categoria_id = c.id 
                                    WHERE p.id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $prod = $stmt->fetch();
        if (!$prod) return null;

        $prod['tonos'] = $this->getShades($id);
        $prod['stock_sedes'] = $this->getStockPerSedes($id);
        return $prod;
    }

    public function getShades(string $productId): array {
        $stmt = $this->db->prepare("SELECT nombre, color_hex FROM tonos_producto WHERE producto_id = :id");
        $stmt->execute([':id' => $productId]);
        return $stmt->fetchAll();
    }

    public function getStockPerSedes(string $productId): array {
        $stmt = $this->db->prepare("SELECT s.id, s.nombre, COALESCE(inv.stock, 0) AS stock 
                                    FROM sedes s 
                                    LEFT JOIN inventario_sedes inv ON s.id = inv.sede_id AND inv.producto_id = :id");
        $stmt->execute([':id' => $productId]);
        $rows = $stmt->fetchAll();
        $stockMap = [];
        foreach ($rows as $r) {
            $stockMap[$r['id']] = (int)$r['stock'];
        }
        return $stockMap;
    }

    public function getCategories(): array {
        $stmt = $this->db->query("SELECT * FROM categorias ORDER BY nombre ASC");
        return $stmt->fetchAll();
    }

    public function create(array $data): string {
        $id = $data['id'] ?? 'p' . time();
        $sql = "INSERT INTO productos (id, sku, ean, nombre, marca, categoria_id, precio, precio_original, rating, review_count, descripcion, nota_formula, volumen, imagen_url, badge, badge_type, codigo_invima, codigo_lote, ubicacion_pasillo, stock_minimo_recomendado)
                VALUES (:id, :sku, :ean, :nombre, :marca, :categoria_id, :precio, :precio_original, 5.0, 0, :descripcion, :nota_formula, :volumen, :imagen_url, :badge, :badge_type, :codigo_invima, :codigo_lote, :ubicacion_pasillo, :stock_minimo_recomendado)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':sku' => $data['sku'] ?? 'SKU-BE-' . rand(100, 999),
            ':ean' => $data['ean'] ?? 'EAN-' . rand(10000000, 99999999),
            ':nombre' => $data['nombre'],
            ':marca' => $data['marca'] ?? 'Belleza Derm',
            ':categoria_id' => $data['categoria_id'],
            ':precio' => $data['precio'],
            ':precio_original' => $data['precio_original'] ?? null,
            ':descripcion' => $data['descripcion'],
            ':nota_formula' => $data['nota_formula'] ?? '',
            ':volumen' => $data['volumen'] ?? '30 ml',
            ':imagen_url' => $data['imagen_url'] ?? 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
            ':badge' => $data['badge'] ?? null,
            ':badge_type' => $data['badge_type'] ?? null,
            ':codigo_invima' => $data['codigo_invima'] ?? 'NSOC' . rand(10000, 99999) . '-26CO',
            ':codigo_lote' => $data['codigo_lote'] ?? '#LOTE-' . rand(100, 999),
            ':ubicacion_pasillo' => $data['ubicacion_pasillo'] ?? 'Pasillo General',
            ':stock_minimo_recomendado' => $data['stock_minimo_recomendado'] ?? 10
        ]);

        // Inicializar stock en 0 para todas las sedes
        $sedes = ['bogota', 'medellin', 'cali'];
        $invStmt = $this->db->prepare("INSERT INTO inventario_sedes (producto_id, sede_id, stock) VALUES (:pid, :sid, :stock)");
        foreach ($sedes as $s) {
            $invStmt->execute([':pid' => $id, ':sid' => $s, ':stock' => $data["stock_{$s}"] ?? 10]);
        }

        return $id;
    }
}
