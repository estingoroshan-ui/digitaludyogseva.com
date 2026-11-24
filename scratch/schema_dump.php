<?php
require_once __DIR__ . '/../db.php';
$tables = ['leads', 'customers', 'cases', 'users', 'employees', 'services', 'loan_schemes', 'invoices', 'payments'];
foreach ($tables as $t) {
    echo "=== TABLE: {$t} ===" . PHP_EOL;
    $res = $conn->query("DESCRIBE `{$t}`");
    if ($res) {
        while ($r = $res->fetch_assoc()) {
            echo "  {$r['Field']} ({$r['Type']})" . ($r['Null'] === 'NO' ? ' NOT NULL' : '') . PHP_EOL;
        }
    } else {
        echo "  Table does not exist or error: " . $conn->error . PHP_EOL;
    }
}
