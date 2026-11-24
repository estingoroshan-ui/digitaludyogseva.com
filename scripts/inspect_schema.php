<?php
require_once __DIR__ . '/../db.php';

function print_columns($pdo, $table) {
    echo "=== COLUMNS FOR $table ===\n";
    try {
        $stmt = $pdo->query("DESCRIBE `$table`");
        while ($col = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "{$col['Field']} ({$col['Type']})\n";
        }
    } catch (Throwable $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
    echo "\n";
}

print_columns($pdo, 'customers');
print_columns($pdo, 'cases');
print_columns($pdo, 'invoices');
print_columns($pdo, 'payments');
print_columns($pdo, 'loan_schemes');
