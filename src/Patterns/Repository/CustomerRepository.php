<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el acceso a datos para el Dominio de Clientes (Direcciones, PQRS y Reviews)
 */
class CustomerRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Direcciones
    public function getAddressesByUser(string $userId): array {
        $stmt = $this->db->prepare("SELECT * FROM direcciones_cliente WHERE usuario_id = :uid ORDER BY es_predeterminada DESC, created_at DESC");
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function addAddress(array $data): string {
        $id = 'addr-' . time();
        $sql = "INSERT INTO direcciones_cliente (id, usuario_id, nombre, telefono, direccion_linea, ciudad, barrio, notas, es_predeterminada, tipo, sede_cercana, distancia_km)
                VALUES (:id, :uid, :nombre, :tel, :dir, :ciu, :bar, :not, :pred, :tipo, :sede, :dist)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':uid' => $data['usuario_id'],
            ':nombre' => $data['nombre'],
            ':tel' => $data['telefono'] ?? '+57 300 000 0000',
            ':dir' => $data['direccion_linea'],
            ':ciu' => $data['ciudad'] ?? 'Bogotá D.C.',
            ':bar' => $data['barrio'] ?? '',
            ':not' => $data['notas'] ?? '',
            ':pred' => !empty($data['es_predeterminada']) ? 1 : 0,
            ':tipo' => $data['tipo'] ?? 'casa',
            ':sede' => $data['sede_cercana'] ?? 'Sede Bogotá Calle 85',
            ':dist' => $data['distancia_km'] ?? '2.0 km',
        ]);
        return $id;
    }

    // PQRS
    public function getPqrs(string $userId = null): array {
        $sql = "SELECT p.*, u.nombre AS usuario_nombre, u.email AS usuario_email
                FROM pqrs p
                JOIN usuarios u ON p.usuario_id = u.id";
        if ($userId) {
            $sql .= " WHERE p.usuario_id = :uid";
            $stmt = $this->db->prepare($sql . " ORDER BY p.created_at DESC");
            $stmt->execute([':uid' => $userId]);
        } else {
            $stmt = $this->db->query($sql . " ORDER BY p.created_at DESC");
        }
        return $stmt->fetchAll();
    }

    public function createPqrs(array $data): string {
        $id = '#PQRS-2026-' . rand(1000, 9999);
        $sql = "INSERT INTO pqrs (id, usuario_id, pedido_id, lote_codigo, tipo, titulo, descripcion, estado, fecha_formato)
                VALUES (:id, :uid, :pid, :lote, :tipo, :titulo, :desc, 'Radicado', :fecha)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':uid' => $data['usuario_id'],
            ':pid' => $data['pedido_id'] ?? null,
            ':lote' => $data['lote_codigo'] ?? null,
            ':tipo' => $data['tipo'],
            ':titulo' => $data['titulo'],
            ':desc' => $data['descripcion'],
            ':fecha' => date('d M Y'),
        ]);
        return $id;
    }

    // Reviews Dermocosméticas
    public function getReviewsByProduct(string $productId): array {
        $stmt = $this->db->prepare("SELECT * FROM reviews WHERE producto_id = :pid ORDER BY helpful_count DESC, created_at DESC");
        $stmt->execute([':pid' => $productId]);
        $reviews = $stmt->fetchAll();
        foreach ($reviews as &$r) {
            $r['imagenes'] = !empty($r['imagenes_json']) ? json_decode($r['imagenes_json'], true) : [];
        }
        return $reviews;
    }

    public function addReview(array $data): string {
        $id = 'rev-' . time();
        $sql = "INSERT INTO reviews (id, producto_id, usuario_id, autor, ubicacion, avatar_url, es_comprador_verificado, es_profesional, badge, rating, titulo, tipo_piel, tiempo_uso, nota_clima, contenido, helpful_count, imagenes_json, fecha_formato)
                VALUES (:id, :pid, :uid, :autor, :ubi, :avatar, 1, :prof, :badge, :rating, :titulo, :piel, :tiempo, :clima, :cont, 0, :imgs, 'Hoy')";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':pid' => $data['producto_id'],
            ':uid' => $data['usuario_id'] ?? null,
            ':autor' => $data['autor'],
            ':ubi' => $data['ubicacion'] ?? 'Bogotá D.C.',
            ':avatar' => $data['avatar_url'] ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
            ':prof' => !empty($data['es_profesional']) ? 1 : 0,
            ':badge' => $data['badge'] ?? 'Compra Verificada',
            ':rating' => $data['rating'] ?? 5,
            ':titulo' => $data['titulo'],
            ':piel' => $data['tipo_piel'] ?? 'mixta',
            ':tiempo' => $data['tiempo_uso'] ?? '2 semanas',
            ':clima' => $data['nota_clima'] ?? 'Templado',
            ':cont' => $data['contenido'],
            ':imgs' => !empty($data['imagenes']) ? json_encode($data['imagenes']) : null,
        ]);
        return $id;
    }
}
