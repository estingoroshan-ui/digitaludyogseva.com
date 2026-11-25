<?php
putenv('DB_HOST=127.0.0.1');
require_once __DIR__ . '/../db.php';

$tables = ['users', 'employees', 'customers', 'roles', 'permissions', 'role_permissions', 'attendance', 'payroll', 'login_history', 'sessions'];

echo "=== TABLE CHECK ===\n";
foreach ($tables as $t) {
    try {
        $c = $pdo->query("SHOW TABLES LIKE '$t'")->rowCount();
        echo str_pad($t, 20) . ": " . ($c ? "EXISTS" : "MISSING") . "\n";
    } catch (Exception $e) {
        echo str_pad($t, 20) . ": ERROR (" . $e->getMessage() . ")\n";
    }
}

echo "\n=== DESCRIBE USERS ===\n";
try {
    $stmt = $pdo->query("DESCRIBE users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['Field']} ({$row['Type']})\n";
    }
} catch (Exception $e) {
    echo "Users error: " . $e->getMessage() . "\n";
}

echo "\n=== ROLES ===\n";
try {
    $stmt = $pdo->query("SELECT id, role_name, role_key FROM roles");
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "#{$r['id']} {$r['role_name']} ({$r['role_key']})\n";
    }
} catch (Exception $e) {
    echo "Roles error: " . $e->getMessage() . "\n";
}

echo "\n=== DESCRIBE EMPLOYEES ===\n";
try {
    $stmt = $pdo->query("DESCRIBE employees");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['Field']} ({$row['Type']})\n";
    }
} catch (Exception $e) {
    echo "Employees error: " . $e->getMessage() . "\n";
}

echo "\n=== DESCRIBE CUSTOMERS ===\n";
try {
    $stmt = $pdo->query("DESCRIBE customers");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['Field']} ({$row['Type']})\n";
    }
} catch (Exception $e) {
    echo "Customers error: " . $e->getMessage() . "\n";
}


