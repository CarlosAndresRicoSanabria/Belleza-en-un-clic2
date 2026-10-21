<?php
namespace Belleza\Patterns\Repository;

use Belleza\Core\Database;
use PDO;

/**
 * Patrón de Diseño: REPOSITORY
 * Abstrae y encapsula el acceso a datos para el Dominio de Usuarios
 */
class UserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findById(string $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE id = :id AND activo = 1 LIMIT 1");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        if ($user) {
            unset($user['password_hash']);
        }
        return $user ?: null;
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        return $stmt->fetch() ?: null;
    }

    public function getAllUsers(): array {
        $stmt = $this->db->query("SELECT id, nombre, primer_nombre, email, rol, tipo_documento, numero_documento, telefono, nivel_glow, puntos_glow, sede_favorita_id, tipo_piel, created_at FROM usuarios ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function updateProfile(string $id, array $data): bool {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['nombre', 'primer_nombre', 'email_dian', 'telefono', 'tipo_piel', 'sede_favorita_id'];
        foreach ($allowed as $f) {
            if (isset($data[$f])) {
                $fields[] = "{$f} = :{$f}";
                $params[":{$f}"] = $data[$f];
            }
        }

        if (empty($fields)) return false;

        $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function addGlowPoints(string $userId, int $points): bool {
        $stmt = $this->db->prepare("UPDATE usuarios SET puntos_glow = puntos_glow + :pts WHERE id = :id");
        return $stmt->execute([':pts' => $points, ':id' => $userId]);
    }
}
