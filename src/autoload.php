<?php
/**
 * Autoloader PSR-4 para Belleza en un Clic
 * Permite cargar automáticamente todas las clases bajo el namespace Belleza\
 */

spl_autoload_register(function ($class) {
    $prefix = 'Belleza\\';
    $baseDir = __DIR__ . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});
