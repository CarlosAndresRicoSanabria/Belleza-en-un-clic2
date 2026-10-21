<?php
namespace Belleza\Domains\Customers;

use Belleza\Patterns\Repository\CustomerRepository;

/**
 * Microservicio: Dominio de Clientes
 * Registro de clientes, Direcciones, PQRS y Reviews Dermocosméticas
 */
class CustomersService {
    private CustomerRepository $repo;

    public function __construct() {
        $this->repo = new CustomerRepository();
    }

    public function getAddresses(string $userId): array {
        return $this->repo->getAddressesByUser($userId);
    }

    public function addAddress(array $data): array {
        $id = $this->repo->addAddress($data);
        return [
            'success' => true,
            'id'      => $id,
            'message' => 'Dirección guardada exitosamente en tu libreta.'
        ];
    }

    public function getPqrs(string $userId = null): array {
        return $this->repo->getPqrs($userId);
    }

    public function createPqrs(array $data): array {
        $id = $this->repo->createPqrs($data);
        return [
            'success' => true,
            'radicado'=> $id,
            'message' => "Tu solicitud ha sido radicada con el consecutivo {$id} y asignada al área de calidad dermatológica."
        ];
    }

    public function getProductReviews(string $productId): array {
        return $this->repo->getReviewsByProduct($productId);
    }

    public function addProductReview(array $data): array {
        $id = $this->repo->addReview($data);
        return [
            'success' => true,
            'id'      => $id,
            'message' => '¡Gracias por tu reseña! Tu opinión ayuda a la comunidad Glow.'
        ];
    }

    public function deleteAddress(string $addressId): array {
        $ok = $this->repo->deleteAddress($addressId);
        return [
            'success' => $ok,
            'message' => 'Dirección eliminada de la libreta.'
        ];
    }

    public function voteReview(string $reviewId): array {
        $ok = $this->repo->voteHelpful($reviewId);
        return [
            'success' => $ok,
            'message' => 'Voto de utilidad registrado.'
        ];
    }

    public function listAllReviews(): array {
        return $this->repo->getAllReviews();
    }
}
