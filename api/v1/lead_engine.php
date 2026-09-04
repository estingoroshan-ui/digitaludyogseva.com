<?php
// ==========================================================================
// REST API: Lead 360° Autopilot Engine
// ==========================================================================
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../classes/LeadManager.php';
require_once __DIR__ . '/../../classes/Lead360Engine.php';

$action = $_GET['action'] ?? ($_POST['action'] ?? 'list');
$method = $_SERVER['REQUEST_METHOD'];

try {
    // 1. GET: Fetch Complete 360° Lead Dossier
    if ($action === 'detail') {
        $lead_id = (int)($_GET['id'] ?? 0);
        if (!$lead_id) {
            echo json_encode(["status" => false, "message" => "Valid Lead ID is required."]);
            exit;
        }
        $res = Lead360Engine::get_lead_360_complete($lead_id);
        echo json_encode($res);
        exit;
    }

    // 2. GET: Fetch Leads List with Filter & Summary Counts
    if ($action === 'list') {
        $stmt = $pdo->query("
            SELECT l.id, l.lead_code, l.name, l.mobile, l.email, l.company, l.business_name,
                   COALESCE(l.lead_value, l.expected_value, 5000) AS value,
                   COALESCE(ls.status_name, 'New Lead') AS stage,
                   ls.color_code AS stage_color,
                   COALESCE(lsrc.source_name, l.lead_source, 'Website') AS source,
                   s.name AS service,
                   u.name AS assigned_to,
                   l.temperature,
                   l.created_at AS date
            FROM leads l
            LEFT JOIN lead_statuses ls ON l.status_id = ls.id
            LEFT JOIN lead_sources lsrc ON l.source_id = lsrc.id
            LEFT JOIN services s ON l.interested_service_id = s.id
            LEFT JOIN employees e ON l.assigned_employee_id = e.id
            LEFT JOIN users u ON e.user_id = u.id
            ORDER BY l.id DESC LIMIT 200
        ");
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => true, "data" => $leads]);
        exit;
    }

    // 3. POST: Ingest New Lead (Autopilot Flow)
    if ($action === 'create' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $res = Lead360Engine::ingest_lead($input, 1);
        echo json_encode($res);
        exit;
    }

    // 4. POST: Process Voice Memo (Voice to CRM)
    if ($action === 'voice_memo' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $lead_id = (int)($input['lead_id'] ?? 0);
        $transcript = $input['transcript'] ?? '';
        $res = Lead360Engine::process_voice_memo($lead_id, $transcript, 1);
        echo json_encode($res);
        exit;
    }

    // 5. POST: Log In-Lead Call
    if ($action === 'log_call' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $lead_id = (int)($input['lead_id'] ?? 0);
        $res = Lead360Engine::log_call($lead_id, $input, 1);
        echo json_encode($res);
        exit;
    }

    // 6. POST: Create Estimate & Formal Proposal
    if ($action === 'create_proposal' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $lead_id = (int)($input['lead_id'] ?? 0);
        $res = Lead360Engine::create_estimate_proposal($lead_id, $input, 1);
        echo json_encode($res);
        exit;
    }

    // 7. POST: Assign External CA/CS Sub-Task
    if ($action === 'assign_external' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $lead_id = (int)($input['lead_id'] ?? 0);
        $res = Lead360Engine::assign_external_task($lead_id, $input, 1);
        echo json_encode($res);
        exit;
    }

    // 8. POST: Update Lead Stage / Status
    if ($action === 'update_status' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $lead_id = (int)($input['lead_id'] ?? 0);
        $status_id = (int)($input['status_id'] ?? 1);
        $res = LeadManager::update_status($lead_id, $status_id, 1);
        echo json_encode(["status" => (bool)$res, "message" => "Lead stage updated."]);
        exit;
    }

    // 9. POST: Convert Lead to Customer & Launch Project
    if ($action === 'convert' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $lead_id = (int)($input['lead_id'] ?? 0);
        $res = LeadManager::convert_lead_to_customer($lead_id);
        echo json_encode($res);
        exit;
    }

    echo json_encode(["status" => false, "message" => "Unknown action: {$action}"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => $e->getMessage()]);
}
?>
