<?php
// Global Application Configuration & Bootstrap (Production & Local Hybrid)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../db.php';

// Dynamic Base URL auto-detection for Localhost & Live Domain (digitaludyogseva.com)
$is_https = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] == 1)) 
         || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
$protocol = $is_https ? 'https://' : 'http://';
$host_name = $_SERVER['HTTP_HOST'] ?? 'digitaludyogseva.com';
$script_name = $_SERVER['SCRIPT_NAME'] ?? '';

if (strpos($host_name, 'digitaludyogseva.com') !== false) {
    // Live domain root
    $base_path = '/';
} elseif (strpos($script_name, '/projects/dus/') !== false) {
    // Local XAMPP sub-folder
    $base_path = '/projects/dus/';
} elseif (strpos($script_name, '/dus/') !== false) {
    // Secondary local folder
    $base_path = '/dus/';
} else {
    $base_path = '/';
}

define('BASE_URL', $protocol . $host_name . $base_path);
define('APP_NAME', 'Digital Udyog Seva');
define('APP_TAGLINE', 'Business Legal Services, Tax & Government Loan Consultancy');

// Upload Paths
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', BASE_URL . 'uploads/');

// Global Date & Timezone
date_default_timezone_set('Asia/Kolkata');

// Helper to fetch website setting
function get_setting($key, $default = '') {
    global $pdo;
    try {
        if (!$pdo) return $default;
        $stmt = $pdo->prepare("SELECT setting_value FROM website_settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        return $row ? $row['setting_value'] : $default;
    } catch (Exception $e) {
        return $default;
    }
}
