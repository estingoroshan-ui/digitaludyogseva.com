<?php
// Shared Helper Utilities for DUS Platform
require_once __DIR__ . '/../config/app.php';

// Sanitize string input
function sanitize($input) {
    if (is_array($input)) {
        return array_map('sanitize', $input);
    }
    return htmlspecialchars(trim($input ?? ''), ENT_QUOTES, 'UTF-8');
}

// Format currency in Indian Rupees (INR)
function format_inr($amount) {
    return '₹' . number_format((float)$amount, 2, '.', ',');
}

// Generate Unique Code
function generate_code($prefix = 'DUS', $length = 6) {
    return $prefix . '-' . date('Y') . '-' . str_pad(mt_rand(1, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
}

// Mask Aadhaar Number (Only show last 4 digits)
function mask_aadhaar($aadhaar) {
    $clean = preg_replace('/[^0-9]/', '', $aadhaar);
    if (strlen($clean) === 12) {
        return 'XXXX-XXXX-' . substr($clean, -4);
    }
    return $aadhaar;
}

// Mask PAN Number (Only show first 2 & last 2 chars)
function mask_pan($pan) {
    $clean = strtoupper(trim($pan));
    if (strlen($clean) === 10) {
        return substr($clean, 0, 2) . 'XXXXX' . substr($clean, -3);
    }
    return $pan;
}

// JSON Response helper for AJAX APIs
function json_response($status = true, $message = '', $data = []) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Secure File Upload Handler
function upload_file($file, $target_dir, $allowed_exts = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']) {
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['status' => false, 'message' => 'File upload error code: ' . ($file['error'] ?? 'missing')];
    }

    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed_exts)) {
        return ['status' => false, 'message' => 'Invalid file extension. Allowed: ' . implode(', ', $allowed_exts)];
    }

    if ($file['size'] > 10 * 1024 * 1024) { // 10MB limit
        return ['status' => false, 'message' => 'File size exceeds maximum limit of 10MB.'];
    }

    $filename = uniqid('file_', true) . '_' . time() . '.' . $ext;
    $target_path = rtrim($target_dir, '/') . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        return [
            'status' => true,
            'file_name' => $file['name'],
            'file_path' => $filename,
            'full_path' => $target_path,
            'file_size' => $file['size']
        ];
    }

    return ['status' => false, 'message' => 'Failed to move uploaded file.'];
}

// Audit Logger
function log_activity($user_id, $action, $module, $record_id = null, $details = '') {
    global $pdo;
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action, module, record_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $action, $module, $record_id, $details, $ip]);
    } catch (Exception $e) {
        // Silent catch for audit log failures
    }
}
