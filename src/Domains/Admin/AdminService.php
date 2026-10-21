<?php
namespace Belleza\Domains\Admin;

use Belleza\Patterns\Repository\AdminRepository;

/**
 * Microservicio: Dominio Administrativo
 * Gestión de Personal, Reportes, Estadísticas y Configuración del Sistema
 */
class AdminService {
    private AdminRepository $repo;

    public function __construct() {
        $this->repo = new AdminRepository();
    }

    public function getStaff(): array {
        return $this->repo->getStaff();
    }

    public function getMetrics(): array {
        return $this->repo->getFinancialMetrics();
    }

    public function getSettings(): array {
        return $this->repo->getSystemSettings();
    }

    public function updateSetting(string $key, string $value): array {
        $this->repo->updateSetting($key, $value);
        return [
            'success' => true,
            'key'     => $key,
            'message' => 'Parámetro de configuración actualizado correctamente.'
        ];
    }
}
