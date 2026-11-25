<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../db.php';

if (!$pdo) {
    echo json_encode(['success' => false, 'error' => 'No database connection']);
    exit;
}

$sqlFile = __DIR__ . '/../../database_upgrade_v4_auth_roles.sql';
if (!file_exists($sqlFile)) {
    echo json_encode(['success' => false, 'error' => 'Migration SQL file not found']);
    exit;
}

$sql = file_get_contents($sqlFile);

try {
    // Run the migration
    $pdo->exec($sql);

    // Also ensure admin@digitaludyogseva.com has super_admin role_id = 1
    $pdo->prepare("UPDATE users SET role_id = 1, status = 'active' WHERE email = 'admin@digitaludyogseva.com'")->execute();

    // Verify
    $rolesCount = $pdo->query("SELECT COUNT(*) FROM roles")->fetchColumn();
    $tables = ['attendance', 'leaves', 'payroll', 'password_resets', 'sessions', 'login_history', 'role_permissions'];
    $tableStatus = [];
    foreach ($tables as $t) {
        $tableStatus[$t] = $pdo->query("SHOW TABLES LIKE '$t'")->rowCount() > 0;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Live database migration executed successfully!',
        'roles_count' => (int)$rolesCount,
        'tables' => $tableStatus
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
