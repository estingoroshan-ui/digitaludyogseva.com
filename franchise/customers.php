<?php
$page_title = "Customer Directory | Franchise Portal";
$active_menu = "customers";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$q = trim($_GET['q'] ?? '');
$where = [];
$params = [];

if (!empty($q)) {
    $where[] = "(c.name LIKE ? OR c.mobile LIKE ? OR c.customer_code LIKE ? OR c.email LIKE ?)";
    $qp = "%{$q}%";
    $params = [$qp, $qp, $qp, $qp];
}

$where_sql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
$stmt = $pdo->prepare("SELECT c.*, u.email AS user_email FROM customers c JOIN users u ON c.user_id = u.id {$where_sql} ORDER BY c.id DESC");
$stmt->execute($params);
$customers = $stmt->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Customer Master Directory</h4>
        <p class="text-muted small mb-0">View & manage all clients registered under your franchise network.</p>
    </div>
    <a href="customer_add.php" class="btn btn-warning btn-sm rounded-pill fw-bold text-dark px-4 shadow">
        <i class="bi bi-person-plus-fill me-1"></i> + Add New Customer
    </a>
</div>

<!-- SEARCH BAR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form action="" method="GET" class="row g-2">
        <div class="col-md-9">
            <input type="text" name="q" class="form-control rounded-pill px-3" placeholder="Search Customer Name, Mobile, Code..." value="<?php echo htmlspecialchars($q); ?>">
        </div>
        <div class="col-md-3 d-flex gap-2">
            <button type="submit" class="btn btn-primary rounded-pill w-100 fw-bold">Search</button>
            <a href="customers.php" class="btn btn-outline-secondary rounded-pill w-100">Reset</a>
        </div>
    </form>
</div>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Customer Code</th>
                    <th>Name & Mobile</th>
                    <th>Email Address</th>
                    <th>Location</th>
                    <th>Registered Date</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($customers)): ?>
                    <tr><td colspan="6" class="text-center text-muted py-4">No customer records found.</td></tr>
                <?php else: ?>
                    <?php foreach ($customers as $c): ?>
                        <tr>
                            <td><span class="badge bg-light text-dark border font-monospace"><?php echo htmlspecialchars($c['customer_code']); ?></span></td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($c['name']); ?></strong>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($c['mobile']); ?></small>
                            </td>
                            <td><small><?php echo htmlspecialchars($c['email'] ?: $c['user_email']); ?></small></td>
                            <td><small><?php echo htmlspecialchars($c['city'] . ', ' . $c['state']); ?></small></td>
                            <td><small class="text-muted"><?php echo date('d M Y', strtotime($c['created_at'])); ?></small></td>
                            <td class="text-end">
                                <a href="customer_detail.php?id=<?php echo $c['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-3 fw-bold">
                                    360° Profile
                                </a>
                                <a href="new_application.php?customer_id=<?php echo $c['id']; ?>" class="btn btn-sm btn-outline-warning text-dark rounded-pill px-3 fw-bold ms-1">
                                    + Apply Service
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
