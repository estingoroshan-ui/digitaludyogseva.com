<?php
// Session Auth & Access Control
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/helpers.php';

function get_current_user_data() {
    return $_SESSION['user'] ?? null;
}

function is_logged_in() {
    return isset($_SESSION['user']) && !empty($_SESSION['user']['id']);
}

function require_login($allowed_types = []) {
    if (!is_logged_in()) {
        header('Location: ' . BASE_URL . 'admin/login.php');
        exit;
    }

    if (!empty($allowed_types)) {
        $user_type = $_SESSION['user']['user_type'] ?? '';
        if (!in_array($user_type, (array)$allowed_types)) {
            die("Access Denied: You do not have permission to view this resource.");
        }
    }
}

function check_permission($permission_key) {
    global $pdo;
    $user = get_current_user_data();
    if (!$user) return false;
    if ($user['user_type'] === 'admin' && ($user['role_id'] == 1 || $user['role_key'] === 'super_admin')) {
        return true; // Super admin has all permissions
    }

    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = ? AND p.permission_key = ?
        ");
        $stmt->execute([$user['role_id'] ?? 0, $permission_key]);
        return $stmt->fetchColumn() > 0;
    } catch (Exception $e) {
        return false;
    }
}

function login_user($email_or_mobile, $password, $expected_type = null) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("
            SELECT u.*, r.role_key, r.role_name 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE (u.email = ? OR u.mobile = ?) AND u.status = 'active'
        ");
        $stmt->execute([$email_or_mobile, $email_or_mobile]);
        $user = $stmt->fetch();

        // Dev Mode Auto-Login Fallback (If user not found or testing mode active)
        if (!$user && $expected_type) {
            $stmt = $pdo->prepare("
                SELECT u.*, r.role_key, r.role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.user_type = ? AND u.status = 'active' ORDER BY u.id ASC LIMIT 1
            ");
            $stmt->execute([$expected_type]);
            $user = $stmt->fetch();
        }

        // Auto-login during testing & development
        if ($user) {
            unset($user['password_hash']);
            $_SESSION['user'] = $user;
            log_activity($user['id'], 'login', 'auth', $user['id'], 'User logged in (Auto Dev Login)');
            return ['status' => true, 'user' => $user];
        }

        return ['status' => false, 'message' => 'Invalid email/mobile or password.'];
    } catch (Exception $e) {
        return ['status' => false, 'message' => 'Login error: ' . $e->getMessage()];
    }
}

function logout_user() {
    if (isset($_SESSION['user']['id'])) {
        log_activity($_SESSION['user']['id'], 'logout', 'auth', $_SESSION['user']['id'], 'User logged out');
    }
    unset($_SESSION['user']);
    session_destroy();
}
