<?php
namespace Belleza\Core;

/**
 * Manejador estándar de Respuestas HTTP y JSON para la API REST y Vistas
 */
class Response {
    public static function json($data, int $statusCode = 200, array $headers = []): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

        foreach ($headers as $key => $value) {
            header("{$key}: {$value}");
        }

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success($data = null, string $message = 'Operación exitosa', int $code = 200): void {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'timestamp' => date('c'),
        ], $code);
    }

    public static function error(string $message = 'Error en la solicitud', int $code = 400, $errors = null): void {
        self::json([
            'success' => false,
            'error'   => $message,
            'details' => $errors,
            'timestamp' => date('c'),
        ], $code);
    }
}
