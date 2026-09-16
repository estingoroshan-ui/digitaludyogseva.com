<?php
/**
 * REST API Endpoint: /api/v1/client_billing.php
 * Handles outsourced client company management, party directory, bill outer slips & sale bills.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../classes/ClientBookkeepingEngine.php';

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? $_POST;

if (empty($action) && isset($inputData['action'])) {
    $action = $inputData['action'];
}

try {
    switch ($action) {
        case 'create_company':
            $res = ClientBookkeepingEngine::createCompany($inputData);
            echo json_encode($res);
            break;

        case 'add_party':
            $res = ClientBookkeepingEngine::addParty($inputData);
            echo json_encode($res);
            break;

        case 'generate_sale_bill':
            $res = ClientBookkeepingEngine::generateSaleBill($inputData);
            echo json_encode($res);
            break;

        default:
            echo json_encode([
                'success' => true,
                'status' => 'online',
                'service' => 'DUS Outsourced Bookkeeping & Billing REST Engine',
                'version' => '2.0.0',
                'timestamp' => date('c')
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
