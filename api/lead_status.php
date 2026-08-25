<?php
// AJAX Endpoint for In-Row & Kanban Lead Status Updates
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/auth.php';

header('Content-Type: application/json');

if (!is_logged_in()) {
    echo json_encode(['status' => false, 'message' => 'Unauthorized access']);
    exit;
}

$lead_id = (int)($_POST['lead_id'] ?? 0);
$status_id = (int)($_POST['status_id'] ?? 0);

if (!$lead_id || !$status_id) {
    echo json_encode(['status' => false, 'message' => 'Invalid parameters']);
    exit;
}

try {
    global $pdo;
    
    // Fetch status details
    $s_stmt = $pdo->prepare("SELECT status_name, color_code FROM lead_statuses WHERE id = ?");
    $s_stmt->execute([$status_id]);
    $st = $s_stmt->fetch();
    
    if (!$st) {
        echo json_encode(['status' => false, 'message' => 'Status stage not found']);
        exit;
    }

    $lost_reason = !empty($_POST['lost_reason']) ? sanitize($_POST['lost_reason']) : null;
    
    if ($lost_reason) {
        $upd = $pdo->prepare("UPDATE leads SET status_id = ?, lost_reason = ? WHERE id = ?");
        $upd->execute([$status_id, $lost_reason, $lead_id]);
    } else {
        $upd = $pdo->prepare("UPDATE leads SET status_id = ? WHERE id = ?");
        $upd->execute([$status_id, $lead_id]);
    }

    // Log activity
    $user = get_current_user_data();
    $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'status_change', 'Status Updated', ?)");
    $act->execute([$lead_id, $user['id'], 'Lead stage moved to: ' . $st['status_name'] . ($lost_reason ? " (Reason: {$lost_reason})" : '')]);

    echo json_encode([
        'status' => true,
        'color_code' => $st['color_code'] ?: '#6366f1',
        'status_name' => $st['status_name'],
        'message' => 'Lead status updated to ' . $st['status_name']
    ]);

} catch (Exception $e) {
    echo json_encode(['status' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
