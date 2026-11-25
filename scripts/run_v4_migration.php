<?php
putenv('DB_HOST=127.0.0.1');
require_once __DIR__ . '/../db.php';

if (!$pdo) {
    echo "ERROR: Could not connect to PDO database.\n";
    exit(1);
}

$sqlFile = __DIR__ . '/../database_upgrade_v4_auth_roles.sql';
$sql = file_get_contents($sqlFile);

if (!$sql) {
    echo "ERROR: Failed to read SQL file.\n";
    exit(1);
}

try {
    $pdo->exec($sql);
    echo "SUCCESS: Database migration executed successfully!\n";
    
    // Verify roles count
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM roles");
    $rolesCount = $stmt->fetch()['cnt'];
    echo "Total Roles: $rolesCount\n";
    
    // Verify permissions count
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM permissions");
    $permCount = $stmt->fetch()['cnt'];
    echo "Total Permissions: $permCount\n";
    
    // Check tables
    $tables = ['attendance', 'leaves', 'payroll', 'password_resets', 'sessions', 'login_history', 'role_permissions'];
    foreach ($tables as $t) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$t'");
        $found = $stmt->rowCount() > 0 ? 'YES' : 'NO';
        echo "Table '$t' exists: $found\n";
    }

} catch (PDOException $e) {
    echo "MIGRATION ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
