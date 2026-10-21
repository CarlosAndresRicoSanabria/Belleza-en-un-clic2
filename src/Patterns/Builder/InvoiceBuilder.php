<?php
namespace Belleza\Patterns\Builder;

use Belleza\Core\Config;

/**
 * Patrón de Diseño: BUILDER
 * Construye la Factura Electrónica bajo normativa DIAN Colombia
 * Generando el CUFE criptográfico (SHA-384) y desglose fiscal reglamentario.
 */
class InvoiceBuilder {
    private string $invoiceNumber;
    private string $orderId;
    private float $subtotal;
    private float $iva;
    private float $total;
    private string $customerDoc;
    private string $customerName;
    private string $customerEmail;
    private string $sedePrefix = 'BOG';
    private string $cufe;
    private string $issueDate;

    public function __construct(string $orderId) {
        $this->orderId = $orderId;
        $this->issueDate = date('Y-m-d H:i:s');
    }

    public function withSedePrefix(string $sede): self {
        $map = ['bogota' => 'BOG', 'medellin' => 'MED', 'cali' => 'CAL'];
        $this->sedePrefix = $map[$sede] ?? 'BOG';
        $this->invoiceNumber = "FE-{$this->sedePrefix}-" . rand(10000, 99999);
        return $this;
    }

    public function withAmounts(float $subtotal, float $iva, float $total): self {
        $this->subtotal = $subtotal;
        $this->iva = $iva;
        $this->total = $total;
        return $this;
    }

    public function withCustomer(string $name, string $doc, string $email): self {
        $this->customerName = $name;
        $this->customerDoc = $doc;
        $this->customerEmail = $email;
        return $this;
    }

    /**
     * Construye y calcula el CUFE oficial simulado (SHA-384) según algoritmo DIAN
     */
    public function build(): array {
        if (empty($this->invoiceNumber)) {
            $this->withSedePrefix('bogota');
        }

        $technicalKey = Config::getInstance()->get('dian_cufe_key', 'DIAN_KEY_2026_SECRET');
        // Cadena CUFE: NumFac + FecFac + ValFac + CodImp1 + ValImp1 + ValTot + NitEmisor + NumAdq + ClaveTec
        $rawCufeString = "{$this->invoiceNumber}|{$this->issueDate}|{$this->subtotal}|01|{$this->iva}|{$this->total}|901554210|{$this->customerDoc}|{$technicalKey}";
        $this->cufe = hash('sha384', $rawCufeString);

        return [
            'pedido_id'       => $this->orderId,
            'numero_factura'  => $this->invoiceNumber,
            'cufe'            => $this->cufe,
            'fecha_emision'   => $this->issueDate,
            'cliente_nombre'  => $this->customerName,
            'cliente_doc'     => $this->customerDoc,
            'cliente_email'   => $this->customerEmail,
            'subtotal'        => $this->subtotal,
            'iva'             => $this->iva,
            'total'           => $this->total,
            'xml_emitido'     => true,
            'pdf_listo'       => true,
            'resolucion_dian' => Config::getInstance()->get('dian_resolucion_facturacion', 'RES-DIAN-1876400921'),
        ];
    }
}
