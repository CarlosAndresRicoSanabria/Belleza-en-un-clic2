<?php
namespace Belleza\Core;

use PDO;
use PDOException;

/**
 * Patrón de Diseño: SINGLETON
 * Garantiza una única instancia de la conexión PDO a MySQL en XAMPP
 * durante todo el ciclo de vida de la petición.
 */
class Database {
    private static ?Database $instance = null;
    private ?PDO $connection = null;

    // Constructor privado para evitar instanciación externa (Singleton)
    private function __construct() {
        $configFile = dirname(__DIR__, 2) . '/config/database.php';
        $config = file_exists($configFile) ? require $configFile : [
            'host' => '127.0.0.1',
            'port' => 3306,
            'database' => 'belleza_en_un_clic',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8mb4'
        ];

        $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
        
        try {
            $options = $config['options'] ?? [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $this->connection = new PDO($dsn, $config['username'], $config['password'], $options);
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'error'   => 'Error al conectar con MySQL en XAMPP: ' . $e->getMessage(),
                'hint'    => 'Asegúrate de que Apache y MySQL estén iniciados en el panel de control de XAMPP.'
            ]));
        }
    }

    // Evitar clonación del Singleton
    private function __clone() {}

    // Evitar deserialización del Singleton
    public function __wakeup() {
        throw new \Exception("No se puede deserializar una instancia Singleton.");
    }

    /**
     * Retorna la única instancia de Database
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Retorna la conexión activa PDO
     */
    public function getConnection(): PDO {
        return $this->connection;
    }
}
