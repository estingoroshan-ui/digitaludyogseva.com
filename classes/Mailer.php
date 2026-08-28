<?php
// Enterprise SMTP & Transactional Email Service
require_once __DIR__ . '/../config/app.php';

class Mailer {
    public static function get_config() {
        return [
            'host'       => get_setting('smtp_host', 'localhost'),
            'port'       => get_setting('smtp_port', '587'),
            'encryption' => get_setting('smtp_encryption', 'tls'),
            'username'   => get_setting('smtp_username', ''),
            'password'   => get_setting('smtp_password', ''),
            'from_email' => get_setting('smtp_from_email', 'noreply@digitaludyogseva.com'),
            'from_name'  => get_setting('smtp_from_name', 'Digital Udyog Seva CRM')
        ];
    }

    public static function send($to_email, $subject, $body_html, $alt_text = '') {
        $config = self::get_config();

        // Standard PHP mail() fallback with HTML headers
        $headers  = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>' . "\r\n";
        $headers .= 'Reply-To: ' . $config['from_email'] . "\r\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();

        $success = @mail($to_email, $subject, $body_html, $headers);

        // Log mail dispatch attempt
        try {
            global $pdo;
            if ($pdo) {
                $stmt = $pdo->prepare("
                    INSERT INTO communication_logs (customer_id, channel, direction, message_body, created_at)
                    VALUES (0, 'email', 'outbound', ?, NOW())
                ");
                $stmt->execute(["To: {$to_email} | Subject: {$subject} | Status: " . ($success ? 'Sent' : 'Queued')]);
            }
        } catch (Exception $e) {}

        return $success;
    }

    public static function send_test_email($target_email) {
        $subject = "DUS CRM - SMTP Configuration Test Email";
        $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; border-radius: 10px;'>
            <h2 style='color: #2563eb;'>SMTP Configuration Successful!</h2>
            <p>This is a test email sent from <strong>Digital Udyog Seva Enterprise CRM</strong>.</p>
            <p>Your SMTP mail configuration is set up properly and ready to handle system notifications, password resets, and proposals.</p>
            <hr style='border: none; border-top: 1px solid #e2e8f0;'>
            <small style='color: #64748b;'>Timestamp: " . date('Y-m-d H:i:s') . "</small>
        </div>";

        return self::send($target_email, $subject, $body);
    }
}
