<?php
// Database Configuration for Digital Udyog Seva (DUS)
// Production & Local Environment Hybrid Connection Setup

$host     = getenv('DB_HOST') ?: "localhost";
$user     = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "";
$dbname   = getenv('DB_NAME') ?: "dus";

// If deployed on live cPanel/hosting server (digitaludyogseva.com)
if (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'digitaludyogseva.com') !== false) {
    // Note: If your live cPanel MySQL credentials differ, update them here or set environment variables:
    $host     = getenv('DB_HOST') ?: "localhost";
    $user     = getenv('DB_USER') ?: "root"; 
    $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "";
    $dbname   = getenv('DB_NAME') ?: "dus";
}

if (function_exists('mysqli_report')) {
    mysqli_report(MYSQLI_REPORT_OFF);
}

$conn = null;
$pdo  = null;

try {
    // MySQLi connection for backward compatibility
    $conn = @new mysqli($host, $user, $password, $dbname);
    if ($conn->connect_error) {
        // Suppress breaking page crash on missing live db before setup
        error_log("Database Connection Error: " . $conn->connect_error);
    } else {
        $conn->set_charset("utf8mb4");
    }

    // PDO connection for modern secure prepared statements
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $user, $password, $options);
} catch (Throwable $e) {
    error_log("Database PDO Connection Exception: " . $e->getMessage());
}
?>
