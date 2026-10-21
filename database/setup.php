<?php
/**
 * Setup Script - Belleza en un Clic
 * Inicializa y sincroniza la base de datos MySQL en XAMPP
 */

header('Content-Type: text/plain; charset=utf-8');

$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$pass = '';
$dbName = 'belleza_en_un_clic';

echo "=========================================================\n";
echo " Belleza en un Clic - Inicialización de Base de Datos MySQL\n";
echo " XAMPP Environment: {$host}:{$port}\n";
echo "=========================================================\n\n";

try {
    // 1. Conexión al servidor MySQL
    echo "[1/4] Conectando a MySQL en XAMPP (root@{$host}:{$port})...\n";
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "  -> Conexión establecida con éxito.\n\n";

    // 2. Crear la base de datos si no existe
    echo "[2/4] Verificando/Creando base de datos '{$dbName}'...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `{$dbName}`;");
    echo "  -> Base de datos '{$dbName}' seleccionada.\n\n";

    // 3. Ejecutar schema.sql
    echo "[3/4] Ejecutando esquema DDL (database/schema.sql)...\n";
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("No se encontró el archivo {$schemaFile}");
    }
    $schemaSql = file_get_contents($schemaFile);
    $pdo->exec($schemaSql);
    echo "  -> 21 Tablas creadas con llaves foráneas e índices de los 8 Dominios.\n\n";

    // 4. Ejecutar seeds.sql
    echo "[4/4] Insertando datos iniciales y semillas (database/seeds.sql)...\n";
    $seedsFile = __DIR__ . '/seeds.sql';
    if (!file_exists($seedsFile)) {
        throw new Exception("No se encontró el archivo {$seedsFile}");
    }
    $seedsSql = file_get_contents($seedsFile);
    $pdo->exec($seedsSql);
    echo "  -> Semillas insertadas: Sedes, Usuarios, Productos, Pedidos, DIAN, Proveedores, etc.\n\n";

    // Verificación rápida de recuento
    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM productos");
    $prodCount = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM pedidos");
    $pedidosCount = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM usuarios");
    $usuariosCount = $stmt->fetch()['total'];

    echo "=========================================================\n";
    echo " ¡SINCRONIZACIÓN CON XAMPP MYSQL COMPLETADA CON ÉXITO!\n";
    echo " - Productos cargados: {$prodCount}\n";
    echo " - Pedidos iniciales: {$pedidosCount}\n";
    echo " - Usuarios de prueba: {$usuariosCount}\n";
    echo "=========================================================\n";

} catch (PDOException $e) {
    echo "ERROR en la base de datos: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
