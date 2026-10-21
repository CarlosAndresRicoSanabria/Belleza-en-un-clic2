<?php
namespace Belleza\Domains\Products;

use Belleza\Patterns\Repository\ProductRepository;

/**
 * Microservicio: Dominio de Productos
 * Catálogo, Categorías, Características, Precios y Promociones
 */
class ProductsService {
    private ProductRepository $repo;

    public function __construct() {
        $this->repo = new ProductRepository();
    }

    public function getCatalog(array $filters = []): array {
        return $this->repo->getAll($filters);
    }

    public function getProduct(string $id): ?array {
        return $this->repo->getById($id);
    }

    public function getCategories(): array {
        return $this->repo->getCategories();
    }

    public function createProduct(array $data): array {
        $id = $this->repo->create($data);
        return [
            'id'      => $id,
            'message' => 'Producto registrado exitosamente en el catálogo dermatológico.'
        ];
    }
}
