<?php
namespace Belleza\Patterns\Builder;

use Belleza\Patterns\Strategy\Shipping\ShippingStrategyInterface;
use Belleza\Patterns\Strategy\Shipping\BogotaExpressShippingStrategy;
use Belleza\Patterns\Strategy\Shipping\MedellinExpressShippingStrategy;
use Belleza\Patterns\Strategy\Shipping\CaliExpressShippingStrategy;
use Belleza\Patterns\Strategy\Shipping\StorePickupShippingStrategy;

/**
 * Patrón de Diseño: BUILDER
 * Construcción incremental y validación de pedidos complejos con
 * cálculo de impuestos DIAN, fletes por estrategia multi-sede y asignación de transportadora.
 */
class OrderBuilder {
    private string $id;
    private string $userId;
    private string $sedeId = 'bogota';
    private string $shippingMethod = 'domicilio';
    private string $deliveryAddress = '';
    private ?string $couponCode = null;
    private float $discountAmount = 0.0;
    private array $items = [];
    private float $subtotal = 0.0;
    private float $iva = 0.0;
    private float $shippingCost = 0.0;
    private float $total = 0.0;
    private string $estimatedWindow = 'Hoy, en 2 a 4 horas';
    private string $courierName = 'Coordinadora Express';
    private string $trackingNumber;
    private array $courierDriver = [];

    public function __construct() {
        $this->id = '#BEC-2026-' . rand(1000, 9999);
        $this->trackingNumber = '#ENV-' . rand(100000, 999999);
    }

    public function forUser(string $userId): self {
        $this->userId = $userId;
        return $this;
    }

    public function fromSede(string $sedeId): self {
        $this->sedeId = $sedeId;
        return $this;
    }

    public function withShippingMethod(string $method, string $address): self {
        $this->shippingMethod = $method;
        $this->deliveryAddress = $address;

        // Seleccionar estrategia de envío según sede y método (Strategy Pattern)
        $strategy = $this->resolveShippingStrategy($this->sedeId, $method);
        $this->shippingCost = $strategy->calculateCost();
        $this->estimatedWindow = $strategy->getEstimatedDeliveryTime();
        $this->courierName = $strategy->getCourierName();

        return $this;
    }

    public function addItem(array $product, int $quantity, ?string $selectedShade = null): self {
        $unitPrice = (float)$product['precio'];
        $itemTotal = $unitPrice * $quantity;

        $this->items[] = [
            'producto_id'       => $product['id'],
            'nombre_producto'   => $product['nombre'],
            'categoria'         => $product['categoria_nombre'] ?? 'Dermocosmética',
            'cantidad'          => $quantity,
            'precio_unitario'   => $unitPrice,
            'codigo_lote'       => $product['codigo_lote'] ?? '#LOTE-' . rand(100, 999),
            'imagen_url'        => $product['imagen_url'],
            'volumen_gramos'    => $product['volumen'] ?? '30 ml',
            'tono_seleccionado' => $selectedShade,
            'subtotal'          => $itemTotal
        ];

        return $this;
    }

    public function applyCoupon(?string $code): self {
        $this->couponCode = $code ? strtoupper(trim($code)) : null;
        if ($this->couponCode === 'BIENVENIDA' || $this->couponCode === 'GLOWVIP') {
            $this->discountAmount = 15000.0;
        } elseif ($this->couponCode === 'BLACKFRIDAY30') {
            $this->discountAmount = 30000.0;
        } else {
            $this->discountAmount = 0.0;
        }
        return $this;
    }

    public function assignDriver(array $driverInfo): self {
        $this->courierDriver = $driverInfo;
        return $this;
    }

    /**
     * Calcula los totales fiscales DIAN (Subtotal antes de IVA, IVA 19%, y Total)
     */
    public function computeTotals(): self {
        $gross = 0.0;
        foreach ($this->items as $it) {
            $gross += $it['subtotal'];
        }

        $grossAfterDiscount = max(0, $gross - $this->discountAmount);
        
        // En Colombia el precio al consumidor incluye IVA 19%
        // Base gravable = Total / 1.19
        $this->subtotal = round($grossAfterDiscount / 1.19, 2);
        $this->iva = round($grossAfterDiscount - $this->subtotal, 2);
        $this->total = round($grossAfterDiscount + $this->shippingCost, 2);

        // Conductor por defecto
        if (empty($this->courierDriver)) {
            $this->courierDriver = [
                'name'    => 'Carlos Mendieta',
                'vehicle' => 'Yamaha Crypton Dermo-Box • Placa WXZ-98E',
                'rating'  => 4.95,
                'trips'   => 1420,
                'phone'   => '+57 312 849 2011',
                'avatar'  => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTjj87KbaqH0tXurf4Wpsp-yEppwldRySdKjFeVL4Zu-SdcFCNErRvF1qbsi0HYksWT5PAPX5l-SIY-0ebbX4i9TZ7Dnjcpllbw5o2OEBYSKNTIuM0Gs4HnJqf-KzuzCm0HweH-pOXkqBHnjnY23NDW1X4tyn5PudkHNKdV4pfQ_ZyEoXFeEtPZGJOreBXqx85t7q5yMi7C8tdgzyahj5AiZ59zX0z7Wtl0hupA4i4MRrph3Z6-9Ca'
            ];
        }

        return $this;
    }

    public function build(): array {
        $this->computeTotals();

        return [
            'order' => [
                'id'                 => $this->id,
                'usuario_id'         => $this->userId,
                'fecha_formato'      => 'Hoy, ' . date('h:i A'),
                'timestamp'          => date('Y-m-d H:i:s'),
                'estado'             => 'pago_confirmado',
                'estado_etiqueta'    => 'Pago Confirmado • Alistamiento en Bodega',
                'total'              => $this->total,
                'subtotal'           => $this->subtotal,
                'descuento'          => $this->discountAmount,
                'iva'                => $this->iva,
                'envio'              => $this->shippingCost,
                'codigo_cupon'       => $this->couponCode,
                'sede_origen_id'     => $this->sedeId,
                'metodo_envio'       => $this->shippingMethod,
                'direccion_entrega'  => $this->deliveryAddress,
                'ventana_estimada'   => $this->estimatedWindow,
                'transportadora'     => $this->courierName,
                'numero_guia'        => $this->trackingNumber,
                'conductor_nombre'   => $this->courierDriver['name'] ?? null,
                'conductor_vehiculo' => $this->courierDriver['vehicle'] ?? null,
                'conductor_rating'   => $this->courierDriver['rating'] ?? 5.0,
                'conductor_viajes'   => $this->courierDriver['trips'] ?? 100,
                'conductor_telefono' => $this->courierDriver['phone'] ?? null,
                'conductor_avatar'   => $this->courierDriver['avatar'] ?? null,
            ],
            'items' => $this->items,
        ];
    }

    private function resolveShippingStrategy(string $sedeId, string $method): ShippingStrategyInterface {
        if ($method === 'pickup') {
            return new StorePickupShippingStrategy();
        }

        switch ($sedeId) {
            case 'medellin':
                return new MedellinExpressShippingStrategy();
            case 'cali':
                return new CaliExpressShippingStrategy();
            case 'bogota':
            default:
                return new BogotaExpressShippingStrategy();
        }
    }
}
