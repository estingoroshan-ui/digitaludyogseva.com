<?php
// Enterprise In-App Notification Service
require_once __DIR__ . '/../config/app.php';

class NotificationService {
    public static function create($user_id, $title, $message, $link = '') {
        global $pdo;
        if (!$pdo || empty($user_id)) return false;

        try {
            $stmt = $pdo->prepare("
                INSERT INTO notifications (user_id, title, message, link, is_read, created_at)
                VALUES (?, ?, ?, ?, 0, NOW())
            ");
            return $stmt->execute([
                (int)$user_id,
                sanitize($title),
                sanitize($message),
                sanitize($link)
            ]);
        } catch (Exception $e) {
            error_log("NotificationService Error: " . $e->getMessage());
            return false;
        }
    }

    public static function notify_roles($role_keys, $title, $message, $link = '') {
        global $pdo;
        if (!$pdo || empty($role_keys)) return false;

        try {
            $in_clause = implode(',', array_fill(0, count($role_keys), '?'));
            $stmt = $pdo->prepare("
                SELECT u.id FROM users u 
                JOIN roles r ON u.role_id = r.id 
                WHERE r.role_key IN ($in_clause) AND u.status = 'active'
            ");
            $stmt->execute($role_keys);
            $user_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

            foreach ($user_ids as $uid) {
                self::create($uid, $title, $message, $link);
            }
            return true;
        } catch (Exception $e) {
            error_log("NotificationService notify_roles Error: " . $e->getMessage());
            return false;
        }
    }

    public static function get_unread_count($user_id) {
        global $pdo;
        if (!$pdo || empty($user_id)) return 0;
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0");
            $stmt->execute([(int)$user_id]);
            return (int)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0;
        }
    }

    public static function get_latest($user_id, $limit = 10) {
        global $pdo;
        if (!$pdo || empty($user_id)) return [];
        try {
            $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ?");
            $stmt->bindValue(1, (int)$user_id, PDO::PARAM_INT);
            $stmt->bindValue(2, (int)$limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }

    public static function mark_as_read($notification_id, $user_id) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
            return $stmt->execute([(int)$notification_id, (int)$user_id]);
        } catch (Exception $e) {
            return false;
        }
    }

    public static function mark_all_read($user_id) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
            return $stmt->execute([(int)$user_id]);
        } catch (Exception $e) {
            return false;
        }
    }
}
