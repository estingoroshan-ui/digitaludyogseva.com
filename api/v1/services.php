<?php
// REST API: Services Resource for React Frontend
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../db.php';

try {
    $stmt = $pdo->query("
        SELECT s.id, s.name, s.slug, s.short_description AS `desc`, s.base_price AS rawPrice,
               CONCAT('₹', FORMAT(s.base_price, 0)) AS price,
               COALESCE(sc.name, 'General') AS category
        FROM services s
        LEFT JOIN service_categories sc ON s.category_id = sc.id
        WHERE s.status = 'active'
        ORDER BY s.id ASC
    ");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "count" => count($services), "data" => $services]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
