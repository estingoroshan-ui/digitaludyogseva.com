<?php
putenv('DB_HOST=127.0.0.1');

function test_post($url, $data) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => json_decode($res, true) ?: $res];
}

// Or directly invoke auth.php via simulated environment
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_USER_AGENT'] = 'TestRunner/1.0';
$_GET['action'] = 'login';

$testPayload = [
    'username' => 'manish872@gmail.com',
    'password' => 'admin123',
    'portal' => 'admin'
];

// Write simulated php://input
ob_start();
// Test direct script execution
$GLOBALS['testInputData'] = $testPayload;
require __DIR__ . '/../api/v1/auth.php';
$output = ob_get_clean();

echo "Auth API Test Output:\n$output\n";
