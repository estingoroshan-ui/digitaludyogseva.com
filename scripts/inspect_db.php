<?php
require_once __DIR__ . '/../db.php';

echo "=== DATABASE COUNTS ===\n";
foreach (['leads', 'customers', 'cases', 'loan_schemes', 'invoices', 'payments', 'users', 'departments', 'lead_statuses'] as $table) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) FROM `$table`");
        echo "$table: " . $stmt->fetchColumn() . "\n";
    } catch (Throwable $e) {
        echo "$table: ERROR (" . $e->getMessage() . ")\n";
    }
}

echo "\n=== CUSTOMERS IN DB ===\n";
try {
    $stmt = $pdo->query("SELECT * FROM customers");
    $custs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Found " . count($custs) . " customers:\n";
    print_r($custs);
} catch (Throwable $e) {
    echo "Error querying customers: " . $e->getMessage() . "\n";
}

echo "\n=== LEADS IN DB (First 5) ===\n";
try {
    $stmt = $pdo->query("SELECT id, name, business_name, phone, status, state, city, required_loan_amount FROM leads LIMIT 5");
    $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Found " . count($leads) . " leads:\n";
    print_r($leads);
} catch (Throwable $e) {
    echo "Error querying leads: " . $e->getMessage() . "\n";
}
