<?php
// REST API: Leads Resource for React Frontend
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch all leads
        $stmt = $pdo->query("
            SELECT l.id, l.name, l.phone, l.email, l.expected_value AS value, 
                   COALESCE(ls.status_name, 'New Leads') AS stage,
                   l.lead_source AS source,
                   l.created_at AS date
            FROM leads l
            LEFT JOIN lead_statuses ls ON l.status_id = ls.id
            ORDER BY l.id DESC LIMIT 100
        ");
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $leads]);
        exit;
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['name']) || empty($input['phone'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Name and phone are required"]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO leads (name, phone, email, expected_value, lead_source, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $input['name'],
            $input['phone'],
            $input['email'] ?? null,
            $input['value'] ?? 0,
            $input['source'] ?? 'Website React Form',
            $input['notes'] ?? 'Added via React Frontend'
        ]);

        $newId = $pdo->lastInsertId();
        echo json_encode(["status" => "success", "message" => "Lead created successfully", "lead_id" => $newId]);
        exit;
    }

    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Lead ID required"]);
            exit;
        }

        if (isset($input['stage'])) {
            // Find status_id matching stage name
            $st = $pdo->prepare("SELECT id FROM lead_statuses WHERE status_name = ? LIMIT 1");
            $st->execute([$input['stage']]);
            $statusId = $st->fetchColumn();

            if ($statusId) {
                $up = $pdo->prepare("UPDATE leads SET status_id = ? WHERE id = ?");
                $up->execute([$statusId, $input['id']]);
            }
        }

        echo json_encode(["status" => "success", "message" => "Lead updated successfully"]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
