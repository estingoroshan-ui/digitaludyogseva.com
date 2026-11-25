<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../db.php';

if (!$pdo) {
    echo json_encode(['success' => false, 'error' => 'No PDO connection']);
    exit;
}

try {
    $rolesCount = $pdo->query("SELECT COUNT(*) FROM roles")->fetchColumn();
    $usersCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $topUsers = $pdo->query("SELECT id, email, user_type, status FROM users LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'roles_count' => (int)$rolesCount,
        'users_count' => (int)$usersCount,
        'sample_users' => $topUsers
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
