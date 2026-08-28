<?php
// Centralized Audit & Activity Logging Service
require_once __DIR__ . '/../config/app.php';

class ActivityLogger {
    public static function log($action, $module, $record_id = null, $description = '', $details = null, $user_id = null) {
        global $pdo;
        if (!$pdo) return false;

        try {
            if (!$user_id && isset($_SESSION['user']['id'])) {
                $user_id = (int)$_SESSION['user']['id'];
            }

            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

            // Sanitize sensitive info from details if array/json
            if (is_array($details) || is_object($details)) {
                $details_copy = (array)$details;
                unset($details_copy['password'], $details_copy['password_hash'], $details_copy['smtp_password'], $details_copy['remember_token']);
                $details_json = json_encode($details_copy);
            } else {
                $details_json = (string)$details;
            }

            $stmt = $pdo->prepare("
                INSERT INTO activity_logs (user_id, action, module, record_id, details, ip_address, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
            return $stmt->execute([
                $user_id ?: null,
                sanitize($action),
                sanitize($module),
                $record_id ? (int)$record_id : null,
                $description . ($details_json ? ' | ' . $details_json : ''),
                $ip_address
            ]);
        } catch (Exception $e) {
            error_log("ActivityLogger Error: " . $e->getMessage());
            return false;
        }
    }
}
