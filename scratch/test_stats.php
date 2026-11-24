<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
ob_start();
include __DIR__ . '/../api/v1/dashboard_stats.php';
$json = ob_get_clean();
$data = json_decode($json, true);
echo "Status: " . ($data['status'] ? 'SUCCESS' : 'FAILED') . PHP_EOL;
echo "Total Leads in DB: " . ($data['data']['metrics']['total_leads'] ?? 'N/A') . PHP_EOL;
echo "Total Customers in DB: " . ($data['data']['metrics']['total_customers'] ?? 'N/A') . PHP_EOL;
echo "Recent Projects Count: " . count($data['data']['recent_projects'] ?? []) . PHP_EOL;
