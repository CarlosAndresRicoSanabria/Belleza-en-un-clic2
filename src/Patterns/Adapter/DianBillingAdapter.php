<?php
namespace Belleza\Patterns\Adapter;

/**
 * Patrón de Diseño: ADAPTER
 * Adapta el modelo interno de pedidos de "Belleza en un Clic"
 * al formato estándar UBL 2.1 / XML exigido por la DIAN (Dirección de Impuestos y Aduanas Nacionales de Colombia).
 */
class DianBillingAdapter {
    public function formatUblXml(array $order, array $items, array $dianData): string {
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"/>');

        $xml->addChild('cbc:CustomizationID', '10');
        $xml->addChild('cbc:ProfileExecutionID', '1');
        $xml->addChild('cbc:ID', $dianData['numero_factura']);
        $xml->addChild('cbc:UUID', $dianData['cufe'])->addAttribute('schemeName', 'CUFE-SHA384');
        $xml->addChild('cbc:IssueDate', substr($dianData['fecha_emision'], 0, 10));
        $xml->addChild('cbc:IssueTime', substr($dianData['fecha_emision'], 11, 8));
        $xml->addChild('cbc:InvoiceTypeCode', '01'); // 01 = Factura electrónica de venta
        $xml->addChild('cbc:DocumentCurrencyCode', 'COP');

        // Emisor (Belleza en un Clic)
        $supplier = $xml->addChild('cac:AccountingSupplierParty');
        $party = $supplier->addChild('cac:Party');
        $party->addChild('cac:PartyIdentification')->addChild('cbc:ID', '901554210')->addAttribute('schemeAgencyID', '195');
        $partyLegal = $party->addChild('cac:PartyLegalEntity');
        $partyLegal->addChild('cbc:RegistrationName', 'BELLEZA EN UN CLIC S.A.S.');

        // Cliente
        $customer = $xml->addChild('cac:AccountingCustomerParty');
        $custParty = $customer->addChild('cac:Party');
        $custParty->addChild('cac:PartyIdentification')->addChild('cbc:ID', $dianData['cliente_doc'] ?? '222222222222');
        $custParty->addChild('cac:PartyLegalEntity')->addChild('cbc:RegistrationName', $dianData['cliente_nombre'] ?? 'Consumidor Final');

        // Totales monetarios
        $monetary = $xml->addChild('cac:LegalMonetaryTotal');
        $monetary->addChild('cbc:LineExtensionAmount', (string)$order['subtotal'])->addAttribute('currencyID', 'COP');
        $monetary->addChild('cbc:TaxExclusiveAmount', (string)$order['subtotal'])->addAttribute('currencyID', 'COP');
        $monetary->addChild('cbc:TaxInclusiveAmount', (string)$order['total'])->addAttribute('currencyID', 'COP');
        $monetary->addChild('cbc:PayableAmount', (string)$order['total'])->addAttribute('currencyID', 'COP');

        return $xml->asXML();
    }

    public function generateDianQrString(array $order, array $dianData): string {
        // Cadena QR reglamentaria DIAN: NumFac, FecFac, HoraFac, ValFac, CodImp1, ValImp1, ValTot, NitOfe, NumAdq, CUFE, URL
        return sprintf(
            "NumFac=%s&FecFac=%s&ValFac=%.2f&CodImp=01&ValImp=%.2f&ValTot=%.2f&NitOfe=901554210&NumAdq=%s&CUFE=%s&URL=https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=%s",
            $dianData['numero_factura'],
            substr($dianData['fecha_emision'], 0, 10),
            $order['subtotal'],
            $order['iva'],
            $order['total'],
            $dianData['cliente_doc'] ?? '222222222222',
            $dianData['cufe'],
            $dianData['cufe']
        );
    }
}
