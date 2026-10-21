<?php
namespace Belleza\Patterns\Factory;

use Belleza\Core\Database;

interface NotificationChannelInterface {
    public function send(string $userId, string $recipient, string $message, string $subject = ''): array;
    public function getChannelName(): string;
}

class EmailChannel implements NotificationChannelInterface {
    public function send(string $userId, string $recipient, string $message, string $subject = ''): array {
        // Registro en la tabla notificaciones
        $this->logNotification($userId, 'email', "[{$subject}] {$message}");
        return [
            'channel' => 'Email',
            'status'  => 'sent',
            'to'      => $recipient,
            'subject' => $subject,
            'preview' => substr($message, 0, 80) . '...'
        ];
    }
    public function getChannelName(): string { return 'email'; }
    private function logNotification(string $uid, string $canal, string $msg): void {
        try {
            $pdo = Database::getInstance()->getConnection();
            $stmt = $pdo->prepare("INSERT INTO notificaciones (usuario_id, tipo, canal, mensaje) VALUES (:uid, 'pedido', :canal, :msg)");
            $stmt->execute([':uid' => $uid, ':canal' => $canal, ':msg' => $msg]);
        } catch (\Throwable $t) {}
    }
}

class SmsChannel implements NotificationChannelInterface {
    public function send(string $userId, string $recipient, string $message, string $subject = ''): array {
        $cleanMsg = "Belleza en un Clic: " . substr($message, 0, 140);
        $this->logNotification($userId, 'sms', $cleanMsg);
        return [
            'channel' => 'SMS',
            'status'  => 'sent',
            'to'      => $recipient,
            'sms_id'  => 'SMS-COL-' . rand(10000, 99999)
        ];
    }
    public function getChannelName(): string { return 'sms'; }
    private function logNotification(string $uid, string $canal, string $msg): void {
        try {
            $pdo = Database::getInstance()->getConnection();
            $stmt = $pdo->prepare("INSERT INTO notificaciones (usuario_id, tipo, canal, mensaje) VALUES (:uid, 'pedido', :canal, :msg)");
            $stmt->execute([':uid' => $uid, ':canal' => $canal, ':msg' => $msg]);
        } catch (\Throwable $t) {}
    }
}

class WhatsAppChannel implements NotificationChannelInterface {
    public function send(string $userId, string $recipient, string $message, string $subject = ''): array {
        $waMsg = "✨ *Belleza en un Clic* ✨\n\n" . $message;
        $this->logNotification($userId, 'whatsapp', $waMsg);
        return [
            'channel' => 'WhatsApp Cloud API',
            'status'  => 'delivered',
            'to'      => $recipient,
            'wa_id'   => 'WAMID.COL.' . bin2hex(random_bytes(6))
        ];
    }
    public function getChannelName(): string { return 'whatsapp'; }
    private function logNotification(string $uid, string $canal, string $msg): void {
        try {
            $pdo = Database::getInstance()->getConnection();
            $stmt = $pdo->prepare("INSERT INTO notificaciones (usuario_id, tipo, canal, mensaje) VALUES (:uid, 'pedido', :canal, :msg)");
            $stmt->execute([':uid' => $uid, ':canal' => $canal, ':msg' => $msg]);
        } catch (\Throwable $t) {}
    }
}

/**
 * Patrón de Diseño: FACTORY METHOD
 * Fabrica el canal de notificación apropiado (Email, SMS, WhatsApp)
 */
class NotificationFactory {
    public static function create(string $channel): NotificationChannelInterface {
        switch (strtolower($channel)) {
            case 'sms':
                return new SmsChannel();
            case 'whatsapp':
                return new WhatsAppChannel();
            case 'email':
            default:
                return new EmailChannel();
        }
    }
}
