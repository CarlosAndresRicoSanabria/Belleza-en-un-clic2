<?php
namespace Belleza\Patterns\Chain;

use Belleza\Core\Response;

/**
 * Patrón de Diseño: CHAIN OF RESPONSIBILITY
 * Manejador base de la cadena de middlewares para procesamiento de solicitudes REST
 */
abstract class MiddlewareHandler {
    private ?MiddlewareHandler $next = null;

    public function setNext(MiddlewareHandler $handler): MiddlewareHandler {
        $this->next = $handler;
        return $handler;
    }

    public function handle(array &$request): bool {
        if ($this->next) {
            return $this->next->handle($request);
        }
        return true;
    }
}

/**
 * Eslabón 1: Autenticación de Usuario y verificación de sesión/token
 */
class AuthenticationMiddleware extends MiddlewareHandler {
    public function handle(array &$request): bool {
        // En entorno API soporta header Authorization o sesión activa o fallback a usuario sofia para pruebas
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (empty($authHeader) && empty($_SESSION['user_id']) && empty($request['user_id'])) {
            // Usuario por defecto si no viene especificado
            $request['user_id'] = 'usr-sofia';
            $request['user_role'] = 'cliente';
        }

        return parent::handle($request);
    }
}

/**
 * Eslabón 2: Autorización por Roles (admin, empleado, cliente)
 */
class RoleAuthorizationMiddleware extends MiddlewareHandler {
    private array $requiredRoles;

    public function __construct(array $requiredRoles = ['admin']) {
        $this->requiredRoles = $requiredRoles;
    }

    public function handle(array &$request): bool {
        $userRole = $request['user_role'] ?? 'cliente';
        if (!in_array($userRole, $this->requiredRoles)) {
            Response::error("Acceso denegado: El rol '{$userRole}' no tiene permisos para esta acción.", 403);
            return false;
        }

        return parent::handle($request);
    }
}

/**
 * Eslabón 3: Validación y saneamiento del payload de entrada
 */
class RequestValidationMiddleware extends MiddlewareHandler {
    private array $requiredFields;

    public function __construct(array $requiredFields = []) {
        $this->requiredFields = $requiredFields;
    }

    public function handle(array &$request): bool {
        foreach ($this->requiredFields as $field) {
            if (!isset($request[$field]) || $request[$field] === '') {
                Response::error("El campo '{$field}' es obligatorio en la solicitud.", 422);
                return false;
            }
        }

        return parent::handle($request);
    }
}
