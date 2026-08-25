<?php
// Dynamic Auto-suggest Search API for Services & Loan Schemes
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

header('Content-Type: application/json');

$query = sanitize($_GET['q'] ?? '');
if (strlen($query) < 2) {
    echo json_encode(['status' => false, 'data' => []]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT s.name, s.slug, s.final_price, sc.name AS category_name
        FROM services s
        JOIN service_categories sc ON s.category_id = sc.id
        WHERE s.name LIKE ? OR s.short_description LIKE ?
        LIMIT 6
    ");
    $searchTerm = "%{$query}%";
    $stmt->execute([$searchTerm, $searchTerm]);
    $services = $stmt->fetchAll();

    $data = [];
    foreach ($services as $srv) {
        $data[] = [
            'name' => $srv['name'],
            'category' => $srv['category_name'],
            'price' => format_inr($srv['final_price']),
            'url' => BASE_URL . 'service.php?slug=' . urlencode($srv['slug'])
        ];
    }

    // Also search Government Loan Schemes
    $loan_stmt = $pdo->prepare("
        SELECT scheme_name, state FROM loan_schemes
        WHERE scheme_name LIKE ? OR description LIKE ?
        LIMIT 3
    ");
    $loan_stmt->execute([$searchTerm, $searchTerm]);
    $loans = $loan_stmt->fetchAll();

    foreach ($loans as $ln) {
        $data[] = [
            'name' => $ln['scheme_name'],
            'category' => 'Government Business Loan (' . $ln['state'] . ')',
            'price' => 'Consultancy',
            'url' => BASE_URL . 'loan.php'
        ];
    }

    echo json_encode(['status' => true, 'data' => $data]);

} catch (Exception $e) {
    echo json_encode(['status' => false, 'data' => [], 'error' => $e->getMessage()]);
}
