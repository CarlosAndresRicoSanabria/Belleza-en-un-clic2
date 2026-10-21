<?php
namespace Belleza\Core;

/**
 * Enrutador REST / HTTP para microservicios y vistas web
 */
class Router {
    private array $routes = [];

    public function get(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    public function post(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    public function put(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('PUT', $path, $handler, $middlewares);
    }

    public function delete(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('DELETE', $path, $handler, $middlewares);
    }

    private function addRoute(string $method, string $path, $handler, array $middlewares = []): void {
        $this->routes[] = [
            'method'      => $method,
            'path'        => $path,
            'handler'     => $handler,
            'middlewares' => $middlewares,
        ];
    }

    public function dispatch(string $method, string $uri) {
        // Soporte CORS preflight
        if ($method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            http_response_code(200);
            exit;
        }

        // Limpiar URI de query params y base path
        $parsedUrl = parse_url($uri, PHP_URL_PATH);
        $cleanUri = '/' . trim(str_replace('/belleza-en-un-clic', '', $parsedUrl), '/');
        if ($cleanUri === '') $cleanUri = '/';

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            // Convertir /ruta/{id} a regex
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $cleanUri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                // Ejecutar middlewares de la ruta
                foreach ($route['middlewares'] as $mw) {
                    if (is_callable($mw)) {
                        $mw();
                    } elseif (is_string($mw) && class_exists($mw)) {
                        (new $mw())->handle();
                    }
                }

                $handler = $route['handler'];
                if (is_callable($handler)) {
                    return call_user_func_array($handler, $params);
                }

                if (is_array($handler) && count($handler) === 2) {
                    [$class, $action] = $handler;
                    $controller = is_string($class) ? new $class() : $class;
                    return call_user_func_array([$controller, $action], $params);
                }
            }
        }

        Response::error("Ruta no encontrada: [{$method}] {$cleanUri}", 404);
    }
}
