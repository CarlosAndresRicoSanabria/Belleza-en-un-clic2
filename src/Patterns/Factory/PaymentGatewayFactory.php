<?php
namespace Belleza\Patterns\Factory;

interface PaymentProcessorInterface {
    public function process(float $amount, array $paymentDetails): array;
    public function getName(): string;
}

class PseProcessor implements PaymentProcessorInterface {
    public function process(float $amount, array $paymentDetails): array {
        $bank = $paymentDetails['bank'] ?? 'Bancolombia';
        return [
            'status'        => 'approved',
            'reference'     => 'PSE-' . strtoupper(substr(md5(uniqid()), 0, 10)),
            'authorization' => 'AUTH-PSE-' . rand(100000, 999999),
            'method'        => 'PSE (' . $bank . ')',
            'message'       => "Transacción PSE aprobada en línea vía ACH Colombia."
        ];
    }
    public function getName(): string { return 'PSE Débito Bancario'; }
}

class CardProcessor implements PaymentProcessorInterface {
    public function process(float $amount, array $paymentDetails): array {
        return [
            'status'        => 'approved',
            'reference'     => 'CARD-' . strtoupper(substr(md5(uniqid()), 0, 10)),
            'authorization' => 'AUTH-TC-' . rand(100000, 999999),
            'method'        => 'Tarjeta de Crédito / Débito',
            'message'       => "Cobro procesado exitosamente por pasarela bancaria segura 3D Secure."
        ];
    }
    public function getName(): string { return 'Tarjeta de Crédito'; }
}

class WompiProcessor implements PaymentProcessorInterface {
    public function process(float $amount, array $paymentDetails): array {
        return [
            'status'        => 'approved',
            'reference'     => 'WOMPI-' . strtoupper(substr(md5(uniqid()), 0, 10)),
            'authorization' => 'WOMPI-TX-' . rand(100000, 999999),
            'method'        => 'Wompi Bancolombia Pay',
            'message'       => "Pago liquidado al instante a través del ecosistema Wompi."
        ];
    }
    public function getName(): string { return 'Wompi Pay'; }
}

class CashProcessor implements PaymentProcessorInterface {
    public function process(float $amount, array $paymentDetails): array {
        return [
            'status'        => 'approved',
            'reference'     => 'CASH-' . strtoupper(substr(md5(uniqid()), 0, 10)),
            'authorization' => 'CONTRAENTREGA-' . rand(1000, 9999),
            'method'        => 'Pago Contraentrega / En Sede',
            'message'       => "Pago autorizado para cobro en efectivo o datáfono portátil al momento de la entrega."
        ];
    }
    public function getName(): string { return 'Pago Contraentrega'; }
}

/**
 * Patrón de Diseño: FACTORY METHOD
 * Crea el procesador de pago adecuado según el método seleccionado por el usuario
 */
class PaymentGatewayFactory {
    public static function create(string $method): PaymentProcessorInterface {
        switch (strtolower($method)) {
            case 'pse':
                return new PseProcessor();
            case 'tarjeta':
            case 'credit_card':
                return new CardProcessor();
            case 'wompi':
                return new WompiProcessor();
            case 'efectivo':
            case 'contraentrega':
            case 'cash':
            default:
                return new CashProcessor();
        }
    }
}
