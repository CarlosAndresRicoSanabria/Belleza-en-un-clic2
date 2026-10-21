<?php
namespace Belleza\Patterns\Facade;

use Belleza\Domains\Users\UsersService;
use Belleza\Domains\Products\ProductsService;
use Belleza\Domains\Inventory\InventoryService;
use Belleza\Domains\Sales\SalesService;
use Belleza\Domains\Orders\OrdersService;
use Belleza\Domains\Suppliers\SuppliersService;
use Belleza\Domains\Customers\CustomersService;
use Belleza\Domains\Admin\AdminService;

/**
 * Patrón de Diseño: FACADE & API GATEWAY
 * Puerta de enlace unificada que orquesta y expone de forma simplificada
 * las operaciones de los 8 microservicios / dominios funcionales.
 */
class ApiGatewayFacade {
    private UsersService $users;
    private ProductsService $products;
    private InventoryService $inventory;
    private SalesService $sales;
    private OrdersService $orders;
    private SuppliersService $suppliers;
    private CustomersService $customers;
    private AdminService $admin;

    public function __construct() {
        $this->users = new UsersService();
        $this->products = new ProductsService();
        $this->inventory = new InventoryService();
        $this->sales = new SalesService();
        $this->orders = new OrdersService();
        $this->suppliers = new SuppliersService();
        $this->customers = new CustomersService();
        $this->admin = new AdminService();
    }

    // Acceso a cada microservicio
    public function users(): UsersService { return $this->users; }
    public function products(): ProductsService { return $this->products; }
    public function inventory(): InventoryService { return $this->inventory; }
    public function sales(): SalesService { return $this->sales; }
    public function orders(): OrdersService { return $this->orders; }
    public function suppliers(): SuppliersService { return $this->suppliers; }
    public function customers(): CustomersService { return $this->customers; }
    public function admin(): AdminService { return $this->admin; }

    /**
     * Resumen integrado para la Web Administrativa (Dashboard de Operaciones)
     */
    public function getAdminDashboardSummary(): array {
        return [
            'metricas'       => $this->admin->getMetrics(),
            'alertas_stock'  => $this->inventory->getLowStockAlerts(),
            'ultimas_ventas' => $this->sales->getSalesHistory(10),
            'resumen_ventas' => $this->sales->getSalesSummary(),
            'pedidos_cola'   => $this->orders->listOrders(10),
            'proveedores'    => $this->suppliers->listSuppliers(),
            'sedes'          => $this->inventory->getSedes(),
        ];
    }

    /**
     * Resumen integrado para la Web y App Móvil del Cliente
     */
    public function getClientAppBootstrap(string $userId = 'usr-sofia'): array {
        return [
            'usuario'     => $this->users->getUser($userId),
            'catalogo'    => $this->products->getCatalog(),
            'categorias'  => $this->products->getCategories(),
            'sedes'       => $this->inventory->getSedes(),
            'direcciones' => $this->customers->getAddresses($userId),
            'pedidos'     => $this->orders->listOrders(20),
            'pqrs'        => $this->customers->getPqrs($userId),
        ];
    }
}
