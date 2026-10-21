<?php
namespace Belleza\Core;

/**
 * Patrón de Diseño: SINGLETON
 * Registro central de configuración global del sistema y parámetros fiscales
 */
class Config {
    private static ?Config $instance = null;
    private array $settings = [];

    private function __construct() {
        // Valores por defecto
        $this->settings = [
            'app_name'      => 'Belleza en un Clic',
            'version'       => '2.0.0-PHP',
            'currency'      => 'COP',
            'iva_rate'      => 0.19,
            'base_url'      => '/belleza-en-un-clic',
            'dian_cufe_key' => 'DIAN_CUFE_SECRET_2026_COLOMBIA',
        ];

        // Cargar parámetros dinámicos desde la tabla configuracion_sistema si existe conexión
        try {
            $pdo = Database::getInstance()->getConnection();
            $stmt = $pdo->query("SELECT clave, valor FROM configuracion_sistema");
            while ($row = $stmt->fetch()) {
                $this->settings[$row['clave']] = $row['valor'];
            }
        } catch (\Throwable $t) {
            // Fallback sin fallar si aún no está inicializada
        }
    }

    private function __clone() {}

    public static function getInstance(): Config {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get(string $key, $default = null) {
        return $this->settings[$key] ?? $default;
    }

    public function set(string $key, $value): void {
        $this->settings[$key] = $value;
    }

    public function all(): array {
        return $this->settings;
    }
}
