<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['action'] = 'list';
ob_start();
include __DIR__ . '/../api/v1/lead_engine.php';
$json = ob_get_clean();
echo "RAW OUTPUT: " . substr($json, 0, 500) . PHP_EOL;
$data = json_decode($json, true);
echo "Decoded Status: " . (isset($data['status']) && $data['status'] ? 'SUCCESS' : 'FAILED') . PHP_EOL;
echo "Found " . count($data['data'] ?? []) . " leads from database:" . PHP_EOL;
if (!empty($data['data'])) {
    print_r(array_slice($data['data'], 0, 2));
}
