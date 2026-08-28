<?php
$page_title = "Service Projects & Workflow Manager";
$active_menu = "projects";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

// Handle Status & Stage Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'update_project_status') {
        $case_id = (int)$_POST['case_id'];
        $status = sanitize($_POST['status']);
        $stage = sanitize($_POST['current_stage'] ?? '');
        
        $sql = "UPDATE cases SET status = ?";
        $params = [$status];
        if (!empty($stage)) {
            $sql .= ", current_stage = ?";
            $params[] = $stage;
        }
        $sql .= " WHERE id = ?";
        $params[] = $case_id;
        
        $upd = $pdo->prepare($sql);
        $upd->execute($params);
        $msg = '<div class="alert alert-success fw-bold rounded-3 shadow-sm mb-4"><i class="bi bi-check-circle-fill me-2"></i> Project status updated successfully!</div>';
    }
}

// Status Filter
$filter_status = isset($_GET['status']) ? sanitize($_GET['status']) : 'all';
$where_clause = "";
$query_params = [];

if ($filter_status !== 'all') {
    $where_clause = " WHERE c.status = ? ";
    $query_params[] = $filter_status;
}

// KPI Counts
$total_projects = $pdo->query("SELECT COUNT(*) FROM cases")->fetchColumn();
$pending_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'on_hold'")->fetchColumn();
$in_process_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'active'")->fetchColumn();
$completed_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'completed'")->fetchColumn();

// Fetch Cases / Service Projects
$stmt = $pdo->prepare("
    SELECT c.*, cust.name AS customer_name, cust.mobile AS customer_mobile, cust.email AS customer_email,
           COALESCE(s.name, 'Custom Service Project') AS service_name
    FROM cases c
    JOIN customers cust ON c.customer_id = cust.id
    LEFT JOIN services s ON c.service_id = s.id
    {$where_clause}
    ORDER BY c.id DESC
");
$stmt->execute($query_params);
$projects = $stmt->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-briefcase-fill text-primary me-2"></i> Service Projects & Operations Manager</h4>
        <p class="text-muted small mb-0">Track real-time progress of Pending, In Process, and Completed service projects.</p>
    </div>
</div>

<?php echo $msg; ?>

<!-- PROJECT SUMMARY CARDS -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <a href="?status=all" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-dark <?php echo $filter_status === 'all' ? 'shadow-lg bg-light' : ''; ?>">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Total Projects</small>
                        <h3 class="fw-bold my-1 text-dark"><?php echo number_format($total_projects); ?></h3>
                        <small class="text-muted">All Time Orders</small>
                    </div>
                    <div class="stat-icon bg-dark-subtle text-dark">
                        <i class="bi bi-folder2-open"></i>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-md-3">
        <a href="?status=on_hold" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-warning <?php echo $filter_status === 'on_hold' ? 'shadow-lg bg-warning-subtle' : ''; ?>">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-warning text-uppercase fw-bold">Pending Projects</small>
                        <h3 class="fw-bold my-1 text-warning"><?php echo number_format($pending_projects); ?></h3>
                        <small class="text-muted">On Hold / Action Req.</small>
                    </div>
                    <div class="stat-icon bg-warning-subtle text-warning">
                        <i class="bi bi-clock-history"></i>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-md-3">
        <a href="?status=active" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-primary <?php echo $filter_status === 'active' ? 'shadow-lg bg-primary-subtle' : ''; ?>">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-primary text-uppercase fw-bold">In Process</small>
                        <h3 class="fw-bold my-1 text-primary"><?php echo number_format($in_process_projects); ?></h3>
                        <small class="text-muted">Currently Active</small>
                    </div>
                    <div class="stat-icon bg-primary-subtle text-primary">
                        <i class="bi bi-gear-wide-connected"></i>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-md-3">
        <a href="?status=completed" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-success <?php echo $filter_status === 'completed' ? 'shadow-lg bg-success-subtle' : ''; ?>">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-success text-uppercase fw-bold">Completed</small>
                        <h3 class="fw-bold my-1 text-success"><?php echo number_format($completed_projects); ?></h3>
                        <small class="text-muted">Delivered & Closed</small>
                    </div>
                    <div class="stat-icon bg-success-subtle text-success">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                </div>
            </div>
        </a>
    </div>
</div>

<!-- PROJECTS LIST TABLE -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 class="font-heading fw-bold mb-0">Project Orders List</h5>
        <div class="btn-group btn-group-sm rounded-pill p-1 bg-light border">
            <a href="?status=all" class="btn rounded-pill <?php echo $filter_status === 'all' ? 'btn-dark' : 'btn-light'; ?>">All (<?php echo $total_projects; ?>)</a>
            <a href="?status=on_hold" class="btn rounded-pill <?php echo $filter_status === 'on_hold' ? 'btn-warning text-dark fw-bold' : 'btn-light'; ?>">Pending (<?php echo $pending_projects; ?>)</a>
            <a href="?status=active" class="btn rounded-pill <?php echo $filter_status === 'active' ? 'btn-primary' : 'btn-light'; ?>">In Process (<?php echo $in_process_projects; ?>)</a>
            <a href="?status=completed" class="btn rounded-pill <?php echo $filter_status === 'completed' ? 'btn-success' : 'btn-light'; ?>">Completed (<?php echo $completed_projects; ?>)</a>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Project Code</th>
                    <th>Customer</th>
                    <th>Service Name</th>
                    <th>Current Stage</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created On</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($projects)): ?>
                    <tr>
                        <td colspan="8" class="text-center py-4 text-muted">
                            <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                            No service projects found in this status category.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($projects as $pj): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo htmlspecialchars($pj['case_code']); ?></td>
                            <td>
                                <div><strong><?php echo htmlspecialchars($pj['customer_name']); ?></strong></div>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i><?php echo htmlspecialchars($pj['customer_mobile']); ?></small>
                            </td>
                            <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($pj['service_name']); ?></span></td>
                            <td>
                                <span class="badge bg-info-subtle text-info-emphasis px-2 py-1">
                                    <i class="bi bi-diagram-2 me-1"></i><?php echo htmlspecialchars($pj['current_stage'] ?: 'Application Received'); ?>
                                </span>
                            </td>
                            <td>
                                <?php if ($pj['status'] === 'active'): ?>
                                    <span class="badge bg-primary rounded-pill px-3"><i class="bi bi-arrow-repeat me-1"></i> In Process</span>
                                <?php elseif ($pj['status'] === 'on_hold'): ?>
                                    <span class="badge bg-warning text-dark rounded-pill px-3"><i class="bi bi-clock me-1"></i> Pending</span>
                                <?php elseif ($pj['status'] === 'completed'): ?>
                                    <span class="badge bg-success rounded-pill px-3"><i class="bi bi-check-lg me-1"></i> Completed</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary rounded-pill px-3"><?php echo htmlspecialchars(ucfirst($pj['status'])); ?></span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php 
                                $priority_cls = 'bg-secondary';
                                if ($pj['priority'] === 'high') $priority_cls = 'bg-danger';
                                elseif ($pj['priority'] === 'urgent') $priority_cls = 'bg-dark';
                                elseif ($pj['priority'] === 'medium') $priority_cls = 'bg-warning text-dark';
                                ?>
                                <span class="badge <?php echo $priority_cls; ?>"><?php echo htmlspecialchars(ucfirst($pj['priority'])); ?></span>
                            </td>
                            <td class="small text-muted"><?php echo date('d M Y', strtotime($pj['created_at'])); ?></td>
                            <td>
                                <!-- Quick Status Update Modal / Form -->
                                <form action="" method="POST" class="d-flex align-items-center gap-1">
                                    <input type="hidden" name="action" value="update_project_status">
                                    <input type="hidden" name="case_id" value="<?php echo $pj['id']; ?>">
                                    <select name="status" class="form-select form-select-sm rounded-pill" onchange="this.form.submit()" style="min-width: 130px;">
                                        <option value="active" <?php echo $pj['status'] === 'active' ? 'selected' : ''; ?>>In Process</option>
                                        <option value="on_hold" <?php echo $pj['status'] === 'on_hold' ? 'selected' : ''; ?>>Pending</option>
                                        <option value="completed" <?php echo $pj['status'] === 'completed' ? 'selected' : ''; ?>>Completed</option>
                                        <option value="cancelled" <?php echo $pj['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                                    </select>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
