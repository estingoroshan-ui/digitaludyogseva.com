<?php
/**
 * REST API Endpoint: /api/v1/projects_engine.php
 * Handles project onboarding, support bouncing, department query logs, bank appraisal & subsidy claims.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../classes/ProjectLifecycleEngine.php';

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? $_POST;

if (empty($action) && isset($inputData['action'])) {
    $action = $inputData['action'];
}

try {
    switch ($action) {
        case 'create_project':
            $res = ProjectLifecycleEngine::createProject($inputData);
            echo json_encode($res);
            break;

        case 'bounce_to_support':
            $projectId = $inputData['projectId'] ?? '';
            $reason = $inputData['reason'] ?? 'Documents Incomplete';
            $res = ProjectLifecycleEngine::bounceToSupport($projectId, $reason);
            echo json_encode($res);
            break;

        case 'approve_qa':
            $projectId = $inputData['projectId'] ?? '';
            $res = ProjectLifecycleEngine::approveQA($projectId);
            echo json_encode($res);
            break;

        case 'log_department_query':
            $projectId = $inputData['projectId'] ?? '';
            $res = ProjectLifecycleEngine::logDepartmentQuery($projectId, $inputData);
            echo json_encode($res);
            break;

        case 'update_bank_liaison':
            $projectId = $inputData['projectId'] ?? '';
            $res = ProjectLifecycleEngine::updateBankLiaison($projectId, $inputData);
            echo json_encode($res);
            break;

        case 'update_subsidy_claim':
            $projectId = $inputData['projectId'] ?? '';
            $res = ProjectLifecycleEngine::updateSubsidyClaim($projectId, $inputData);
            echo json_encode($res);
            break;

        default:
            echo json_encode([
                'success' => true,
                'status' => 'online',
                'service' => 'DUS Project & Case Lifecycle REST Engine',
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
