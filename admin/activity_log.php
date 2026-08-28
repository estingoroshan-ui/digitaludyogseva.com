<?php
$page_title = "Central System Audit & Activity Log";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_permission('settings_view');

global $pdo;

$search = sanitize($_GET['q'] ?? '');
$module_filter = sanitize($_GET['module'] ?? 'all');

$where = ["1=1"];
$params = [];

if ($search) {
    $where[] = "(al.details LIKE ? OR u.name LIKE ? OR al.ip_address LIKE ?)";
    $q = "%{$search}%";
    $params[] = $q; $params[] = $q; $params[] = $q;
}
if ($module_filter !== 'all') {
    $where[] = "al.module = ?";
    $params[] = $module_filter;
}

$where_sql = implode(' AND ', $where);

// Fetch Log Entries
$stmt = $pdo->prepare("
    SELECT al.*, u.name AS user_name, u.email AS user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE {$where_sql}
    ORDER BY al.id DESC LIMIT 100
");
$stmt->execute($params);
$logs = $stmt->fetchAll();

// Unique Modules for Filter
$modules = $pdo->query("SELECT DISTINCT module FROM activity_logs ORDER BY module ASC")->fetchAll(PDO::FETCH_COLUMN);
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-journal-text text-primary me-2"></i> System Audit & Activity Log</h4>
        <p class="text-muted small mb-0">Track all security events, logins, data updates, and administrative actions.</p>
    </div>
    <div>
        <a href="<?php echo BASE_URL; ?>admin/settings.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to Settings
        </a>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form action="" method="GET" class="row g-2 align-items-center">
        <div class="col-md-6">
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control bg-light border-start-0" value="<?php echo htmlspecialchars($search); ?>" placeholder="Search action description, IP address, user name...">
            </div>
        </div>
        <div class="col-md-4">
            <select name="module" class="form-select bg-light" onchange="this.form.submit()">
                <option value="all">All Modules</option>
                <?php foreach ($modules as $m): ?>
                    <option value="<?php echo htmlspecialchars($m); ?>" <?php echo $module_filter === $m ? 'selected' : ''; ?>><?php echo ucfirst(htmlspecialchars($m)); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-2">
            <a href="activity_log.php" class="btn btn-light border w-100"><i class="bi bi-arrow-counterclockwise me-1"></i> Reset</a>
        </div>
    </form>
</div>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Timestamp</th>
                    <th>User / Staff</th>
                    <th>Action</th>
                    <th>Module</th>
                    <th>Description & Details</th>
                    <th>IP Address</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($logs)): ?>
                    <tr>
                        <td colspan="6" class="text-center py-4 text-muted">No audit log entries found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($logs as $l): ?>
                        <tr>
                            <td class="small text-muted fw-semibold">
                                <?php echo date('d M Y, h:i A', strtotime($l['created_at'])); ?>
                            </td>
                            <td>
                                <strong><?php echo htmlspecialchars($l['user_name'] ?: 'System / Guest'); ?></strong>
                                <?php if ($l['user_email']): ?>
                                    <small class="text-muted d-block"><?php echo htmlspecialchars($l['user_email']); ?></small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="badge bg-light text-dark border fw-bold"><?php echo htmlspecialchars($l['action']); ?></span>
                            </td>
                            <td>
                                <span class="badge bg-primary-subtle text-primary"><?php echo htmlspecialchars(ucfirst($l['module'])); ?></span>
                            </td>
                            <td class="small text-break" style="max-width: 350px;">
                                <?php echo htmlspecialchars($l['details']); ?>
                            </td>
                            <td class="small font-monospace text-muted"><?php echo htmlspecialchars($l['ip_address'] ?: '127.0.0.1'); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
