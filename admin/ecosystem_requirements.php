<?php
$page_title = "Business Ecosystem Hub (Machinery, Raw Material & Manpower) | DUS OS";
$active_menu = "ecosystem";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;

$msg = '';
$error = '';

// Handle Requirement Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_eco_status') {
    verify_csrf_token($_POST['csrf_token'] ?? '');
    
    $eco_id = intval($_POST['eco_id']);
    $new_status = $_POST['status'] ?? 'new';
    
    try {
        $stmt = $pdo->prepare("UPDATE ecosystem_requirements SET status = ? WHERE id = ?");
        $stmt->execute([$new_status, $eco_id]);
        $msg = "Ecosystem requirement status updated successfully!";
    } catch (Exception $e) {
        $error = "Error updating status: " . $e->getMessage();
    }
}

// Fetch all ecosystem requirements
$requirements = [];
try {
    $stmt = $pdo->query("
        SELECT er.*, c.name as customer_name, c.mobile as customer_mobile, c.district as customer_district 
        FROM ecosystem_requirements er 
        JOIN customers c ON er.customer_id = c.id 
        ORDER BY er.created_at DESC
    ");
    $requirements = $stmt->fetchAll();
} catch (Exception $e) {
    //
}
?>

<div class="content-wrapper p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-1"><i class="bi bi-cpu-fill text-primary me-2"></i>Business Ecosystem Hub</h4>
            <p class="text-muted fs-7 mb-0">Manage customer & franchise requirements for Machinery, Raw Materials, Manpower & Industrial Supplies.</p>
        </div>
        <div>
            <span class="badge bg-primary px-3 py-2 fs-7">Ecosystem Active</span>
        </div>
    </div>

    <?php if ($msg): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i><?php echo htmlspecialchars($msg); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i><?php echo htmlspecialchars($error); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0"><i class="bi bi-truck me-2 text-primary"></i>Live Client Ecosystem Requirements</h6>
        </div>
        <div class="card-body p-0">
            <?php if (empty($requirements)): ?>
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 text-secondary d-block mb-2"></i>
                    <p class="mb-0">No active ecosystem requests logged yet. Client requests for Machinery & Raw Materials will appear here.</p>
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Category</th>
                                <th>Client Name</th>
                                <th>Requirement Title</th>
                                <th>Budget Estimate</th>
                                <th>District</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($requirements as $req): ?>
                                <tr>
                                    <td>
                                        <?php if ($req['category_type'] === 'machinery'): ?>
                                            <span class="badge bg-warning text-dark"><i class="bi bi-gear-wide-connected me-1"></i>Machinery</span>
                                        <?php elseif ($req['category_type'] === 'raw_material'): ?>
                                            <span class="badge bg-info text-dark"><i class="bi bi-box-seam me-1"></i>Raw Material</span>
                                        <?php else: ?>
                                            <span class="badge bg-success"><i class="bi bi-person-badge me-1"></i>Manpower</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="fw-bold"><?php echo htmlspecialchars($req['customer_name']); ?><br><small class="text-muted"><?php echo htmlspecialchars($req['customer_mobile']); ?></small></td>
                                    <td><?php echo htmlspecialchars($req['title']); ?></td>
                                    <td class="fw-bold text-success">₹<?php echo number_format($req['budget_estimate']); ?></td>
                                    <td><span class="badge bg-secondary"><?php echo htmlspecialchars($req['customer_district']); ?></span></td>
                                    <td>
                                        <span class="badge <?php echo $req['status'] === 'order_placed' ? 'bg-success' : 'bg-primary'; ?>">
                                            <?php echo htmlspecialchars(str_replace('_', ' ', strtoupper($req['status']))); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <form method="POST" class="d-inline-flex gap-1">
                                            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                            <input type="hidden" name="action" value="update_eco_status">
                                            <input type="hidden" name="eco_id" value="<?php echo $req['id']; ?>">
                                            <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                                                <option value="new" <?php echo $req['status'] === 'new' ? 'selected' : ''; ?>>New Request</option>
                                                <option value="routed_to_supplier" <?php echo $req['status'] === 'routed_to_supplier' ? 'selected' : ''; ?>>Routed to Supplier</option>
                                                <option value="quotation_sent" <?php echo $req['status'] === 'quotation_sent' ? 'selected' : ''; ?>>Quotation Sent</option>
                                                <option value="order_placed" <?php echo $req['status'] === 'order_placed' ? 'selected' : ''; ?>>Order Placed</option>
                                                <option value="closed" <?php echo $req['status'] === 'closed' ? 'selected' : ''; ?>>Closed</option>
                                            </select>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
