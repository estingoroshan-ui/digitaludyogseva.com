<?php
require_once __DIR__ . '/../config/app.php';
if (isset($_GET['view']) && $_GET['view'] === 'estimates') {
    header("Location: " . BASE_URL . "admin/estimates.php");
    exit;
}
$page_title = "Leads CRM & Sales Workspace";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/LeadManager.php';

global $pdo;
ensure_phase3_lead_tables_exist($pdo);

// Fetch Dropdown Masters
$statuses = [];
$sources = [];
$employees = [];
$services = [];
try {
    $statuses = $pdo->query("SELECT * FROM lead_statuses ORDER BY sort_order ASC")->fetchAll();
} catch (Throwable $e) {}
try {
    $sources = $pdo->query("SELECT * FROM lead_sources WHERE status = 'active'")->fetchAll();
} catch (Throwable $e) {}
try {
    $employees = $pdo->query("SELECT e.id, u.name FROM employees e JOIN users u ON e.user_id = u.id")->fetchAll();
} catch (Throwable $e) {}
try {
    $services = $pdo->query("SELECT id, name FROM services WHERE status = 'active' ORDER BY name ASC")->fetchAll();
} catch (Throwable $e) {}

// Handle Form Submissions
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'create_lead') {
        $res = LeadManager::create_lead($_POST, $current_user['id'] ?? 1);
        if ($res['status']) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Lead created successfully: <strong>' . htmlspecialchars($res['lead_code']) . '</strong> <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        } else {
            $msg = '<div class="alert alert-danger alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> ' . htmlspecialchars($res['message']) . ' <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    } elseif ($_POST['action'] === 'bulk_update') {
        $selected_ids = $_POST['lead_ids'] ?? [];
        $bulk_action = $_POST['bulk_type'] ?? '';
        $bulk_value = $_POST['bulk_value'] ?? '';

        if (!empty($selected_ids) && !empty($bulk_action)) {
            $count = count($selected_ids);
            $in_clause = implode(',', array_map('intval', $selected_ids));
            if ($bulk_action === 'status') {
                $pdo->query("UPDATE leads SET status_id = " . (int)$bulk_value . " WHERE id IN ($in_clause)");
                $msg = "<div class='alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4'><i class='bi bi-check-circle-fill me-2'></i> Bulk Status updated for {$count} leads. <button type='button' class='btn-close' data-bs-dismiss='alert'></button></div>";
            } elseif ($bulk_action === 'assign') {
                $pdo->query("UPDATE leads SET assigned_employee_id = " . (int)$bulk_value . " WHERE id IN ($in_clause)");
                $msg = "<div class='alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4'><i class='bi bi-check-circle-fill me-2'></i> Bulk Assigned {$count} leads to staff member. <button type='button' class='btn-close' data-bs-dismiss='alert'></button></div>";
            } elseif ($bulk_action === 'priority') {
                $pdo->query("UPDATE leads SET priority = " . $pdo->quote($bulk_value) . " WHERE id IN ($in_clause)");
                $msg = "<div class='alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4'><i class='bi bi-check-circle-fill me-2'></i> Bulk Priority updated for {$count} leads. <button type='button' class='btn-close' data-bs-dismiss='alert'></button></div>";
            } elseif ($bulk_action === 'delete') {
                $pdo->query("DELETE FROM leads WHERE id IN ($in_clause)");
                $msg = "<div class='alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4'><i class='bi bi-check-circle-fill me-2'></i> Deleted {$count} leads cleanly. <button type='button' class='btn-close' data-bs-dismiss='alert'></button></div>";
            }
        }
    }
}

// Build SQL Query Filters
$where = [];
$params = [];

$q = trim($_GET['q'] ?? '');
if (!empty($q)) {
    $where[] = "(l.lead_code LIKE ? OR l.name LIKE ? OR l.company LIKE ? OR l.mobile LIKE ? OR l.email LIKE ? OR l.gstin LIKE ?)";
    $qp = "%{$q}%";
    $params = array_merge($params, [$qp, $qp, $qp, $qp, $qp, $qp]);
}

$status_id = $_GET['status_id'] ?? '';
if ($status_id !== '') {
    $where[] = "l.status_id = ?";
    $params[] = (int)$status_id;
}

$source_id = $_GET['source_id'] ?? '';
if ($source_id !== '') {
    $where[] = "l.source_id = ?";
    $params[] = (int)$source_id;
}

$emp_id = $_GET['employee_id'] ?? '';
if ($emp_id !== '') {
    $where[] = "l.assigned_employee_id = ?";
    $params[] = (int)$emp_id;
}

$temp = $_GET['temperature'] ?? '';
if (!empty($temp)) {
    $where[] = "l.temperature = ?";
    $params[] = $temp;
}

$view_mode = $_GET['view'] ?? 'list'; // 'list' or 'kanban'

$where_sql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

// Summary Metrics
$total_leads = 0; $new_today = 0; $followup_today = 0; $hot_leads = 0; $converted_leads = 0; $total_deal_value = 0.0;
try { $total_leads = (int)$pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn(); } catch (Throwable $e) {}
try { $new_today = (int)$pdo->query("SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURRENT_DATE()")->fetchColumn(); } catch (Throwable $e) {}
try { $followup_today = (int)$pdo->query("SELECT COUNT(*) FROM lead_reminders WHERE reminder_date = CURRENT_DATE() AND status = 'pending'")->fetchColumn(); } catch (Throwable $e) {}
try { $hot_leads = (int)$pdo->query("SELECT COUNT(*) FROM leads WHERE temperature = 'hot'")->fetchColumn(); } catch (Throwable $e) {}
try { $converted_leads = (int)$pdo->query("SELECT COUNT(*) FROM leads WHERE status_id = 10 OR status_id IN (SELECT id FROM lead_statuses WHERE status_key = 'converted')")->fetchColumn(); } catch (Throwable $e) {}
try { $total_deal_value = (float)$pdo->query("SELECT COALESCE(SUM(lead_value), 0) FROM leads")->fetchColumn(); } catch (Throwable $e) {}

// Fetch Leads Data
$leads = [];
try {
    $sql = "
        SELECT l.*, ls.status_name, ls.color_code, lsrc.source_name,
               srv.name AS service_name, u.name AS staff_name,
               (SELECT CONCAT(r.reminder_date, ' ', r.reminder_time) FROM lead_reminders r WHERE r.lead_id = l.id AND r.status = 'pending' ORDER BY r.reminder_date ASC LIMIT 1) AS next_flw_datetime
        FROM leads l
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        LEFT JOIN lead_sources lsrc ON l.source_id = lsrc.id
        LEFT JOIN services srv ON l.service_id = srv.id
        LEFT JOIN employees e ON l.assigned_employee_id = e.id
        LEFT JOIN users u ON e.user_id = u.id
        {$where_sql}
        ORDER BY l.id DESC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $leads = $stmt->fetchAll();
} catch (Throwable $e) {
    error_log("CRM Leads Fetch Error: " . $e->getMessage());
}
?>

<!-- TOP ACTION HEADER -->
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h3 class="font-heading fw-bold text-dark mb-1">Leads CRM & Sales Workspace</h3>
        <p class="text-muted small mb-0">Perfex-grade Lead Pipeline. Capture, qualify, schedule follow-ups, and convert leads to Customers.</p>
    </div>
    <div class="d-flex gap-2 flex-wrap">
        <!-- View Toggle Buttons -->
        <div class="btn-group p-1 bg-light border rounded-pill" role="group">
            <a href="?view=list<?php echo $q ? '&q='.urlencode($q) : ''; ?>" class="btn btn-sm rounded-pill px-3 <?php echo $view_mode === 'list' ? 'btn-primary shadow-sm' : 'btn-light'; ?>">
                <i class="bi bi-list-task me-1"></i> Table View
            </a>
            <a href="?view=kanban<?php echo $q ? '&q='.urlencode($q) : ''; ?>" class="btn btn-sm rounded-pill px-3 <?php echo $view_mode === 'kanban' ? 'btn-primary shadow-sm' : 'btn-light'; ?>">
                <i class="bi bi-kanban me-1"></i> Kanban Board
            </a>
        </div>

        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#addLeadModal">
            <i class="bi bi-plus-lg me-1"></i> + Add New Lead
        </button>
        <button class="btn btn-light border rounded-circle" onclick="window.location.reload();" title="Refresh Workspace">
            <i class="bi bi-arrow-clockwise"></i>
        </button>
    </div>
</div>

<?php echo $msg; ?>

<!-- 6 KPI SUMMARY METRIC CARDS -->
<div class="row g-3 mb-4">
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div class="text-muted small fw-bold text-uppercase mb-1">Total Leads</div>
            <div class="fs-3 fw-bold text-dark"><?php echo number_format($total_leads); ?></div>
            <small class="text-muted" style="font-size: 11px;">Registered In CRM</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-info border-4">
            <div class="text-muted small fw-bold text-uppercase mb-1">New Today</div>
            <div class="fs-3 fw-bold text-info"><?php echo number_format($new_today); ?></div>
            <small class="text-muted" style="font-size: 11px;">Added Today</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-warning border-4">
            <div class="text-muted small fw-bold text-uppercase mb-1">Reminders Today</div>
            <div class="fs-3 fw-bold text-warning"><?php echo number_format($followup_today); ?></div>
            <small class="text-muted" style="font-size: 11px;">Follow-up Queue</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-danger border-4">
            <div class="text-muted small fw-bold text-uppercase mb-1">Hot Leads 🔥</div>
            <div class="fs-3 fw-bold text-danger"><?php echo number_format($hot_leads); ?></div>
            <small class="text-muted" style="font-size: 11px;">High Conversion</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-success border-4">
            <div class="text-muted small fw-bold text-uppercase mb-1">Converted</div>
            <div class="fs-3 fw-bold text-success"><?php echo number_format($converted_leads); ?></div>
            <small class="text-muted" style="font-size: 11px;">Transferred to Clients</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-primary border-4">
            <div class="text-muted small fw-bold text-uppercase mb-1">Total Deal Value</div>
            <div class="fs-4 fw-bold text-primary">₹<?php echo format_inr($total_deal_value); ?></div>
            <small class="text-muted" style="font-size: 11px;">Pipeline Estimate</small>
        </div>
    </div>
</div>

<!-- ADVANCED FILTERS BAR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form action="" method="GET" class="row g-2 align-items-center">
        <input type="hidden" name="view" value="<?php echo htmlspecialchars($view_mode); ?>">
        
        <div class="col-md-3">
            <div class="input-group input-group-sm">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control form-control-sm border-start-0" placeholder="Search Code, Name, Company, Mobile, GST..." value="<?php echo htmlspecialchars($q); ?>">
            </div>
        </div>

        <div class="col-md-2">
            <select name="status_id" class="form-select form-select-sm">
                <option value="">All Status Stages</option>
                <?php foreach ($statuses as $st): ?>
                    <option value="<?php echo $st['id']; ?>" <?php echo $status_id == $st['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($st['status_name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="col-md-2">
            <select name="source_id" class="form-select form-select-sm">
                <option value="">All Lead Sources</option>
                <?php foreach ($sources as $src): ?>
                    <option value="<?php echo $src['id']; ?>" <?php echo $source_id == $src['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($src['source_name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="col-md-2">
            <select name="employee_id" class="form-select form-select-sm">
                <option value="">All Assigned Staff</option>
                <?php foreach ($employees as $emp): ?>
                    <option value="<?php echo $emp['id']; ?>" <?php echo $emp_id == $emp['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($emp['name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="col-md-1">
            <select name="temperature" class="form-select form-select-sm">
                <option value="">Temp</option>
                <option value="hot" <?php echo $temp === 'hot' ? 'selected' : ''; ?>>🔥 Hot</option>
                <option value="warm" <?php echo $temp === 'warm' ? 'selected' : ''; ?>>🟠 Warm</option>
                <option value="cold" <?php echo $temp === 'cold' ? 'selected' : ''; ?>>🔵 Cold</option>
            </select>
        </div>

        <div class="col-md-2 d-flex gap-2">
            <button type="submit" class="btn btn-sm btn-primary rounded-pill w-100 fw-bold">Apply</button>
            <a href="crm_leads.php?view=<?php echo $view_mode; ?>" class="btn btn-sm btn-outline-secondary rounded-pill w-100">Reset</a>
        </div>
    </form>
</div>

<?php if ($view_mode === 'kanban'): ?>
    <!-- ========================================================================= -->
    <!-- KANBAN BOARD VIEW -->
    <!-- ========================================================================= -->
    <div class="d-flex gap-3 overflow-x-auto pb-4" style="min-height: 600px;">
        <?php foreach ($statuses as $st): ?>
            <?php
            $stage_leads = array_filter($leads, function($l) use ($st) {
                return $l['status_id'] == $st['id'];
            });
            $stage_value = array_reduce($stage_leads, function($carry, $item) {
                return $carry + (float)($item['lead_value'] ?? 0);
            }, 0);
            ?>
            <div class="bg-light rounded-4 p-3 shadow-sm flex-shrink-0" style="width: 320px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center gap-2">
                        <span class="rounded-circle d-inline-block" style="width: 12px; height: 12px; background-color: <?php echo $st['color_code'] ?: '#6366f1'; ?>;"></span>
                        <h6 class="fw-bold mb-0 text-dark"><?php echo htmlspecialchars($st['status_name']); ?></h6>
                    </div>
                    <span class="badge bg-white text-dark border rounded-pill px-2 py-1 small"><?php echo count($stage_leads); ?></span>
                </div>
                <div class="text-muted small mb-3">Value: <strong>₹<?php echo format_inr($stage_value); ?></strong></div>

                <div class="d-flex flex-column gap-3">
                    <?php if (empty($stage_leads)): ?>
                        <div class="text-center py-4 text-muted border border-dashed rounded-3 small">No leads in stage</div>
                    <?php else: ?>
                        <?php foreach ($stage_leads as $ld): ?>
                            <div class="card border-0 shadow-sm rounded-3 p-3 bg-white hover-shadow transition-all position-relative">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="fw-bold text-primary font-monospace small text-decoration-none">
                                        <?php echo htmlspecialchars($ld['lead_code']); ?>
                                    </a>
                                    <?php if ($ld['temperature'] === 'hot'): ?>
                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill small">🔥 Hot</span>
                                    <?php else: ?>
                                        <span class="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill small">🟠 Warm</span>
                                    <?php endif; ?>
                                </div>
                                <h6 class="fw-bold text-dark mb-1">
                                    <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="text-dark text-decoration-none">
                                        <?php echo htmlspecialchars($ld['name']); ?>
                                    </a>
                                </h6>
                                <?php if (!empty($ld['company'])): ?>
                                    <small class="text-muted d-block mb-2"><i class="bi bi-building me-1"></i> <?php echo htmlspecialchars($ld['company']); ?></small>
                                <?php endif; ?>

                                <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-2 small">
                                    <span class="fw-bold text-success">₹<?php echo format_inr($ld['lead_value']); ?></span>
                                    <span class="badge bg-light text-secondary border"><?php echo htmlspecialchars($ld['staff_name'] ?: 'Unassigned'); ?></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

<?php else: ?>
    <!-- ========================================================================= -->
    <!-- DATA TABLE VIEW -->
    <!-- ========================================================================= -->
    <form action="" method="POST" id="bulkForm">
        <input type="hidden" name="action" value="bulk_update">
        <div class="card border-0 shadow-sm rounded-4 bg-white mb-4">
            <!-- BULK BAR -->
            <div class="p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2 bg-light rounded-top-4">
                <div class="d-flex align-items-center gap-2">
                    <input type="checkbox" class="form-check-input" id="selectAll">
                    <span class="small text-muted fw-bold">Select All</span>
                    <span class="small text-secondary ms-3">Total <strong><?php echo count($leads); ?></strong> leads found</span>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <select name="bulk_type" id="bulkType" class="form-select form-select-sm" style="width: 140px;">
                        <option value="">Bulk Actions...</option>
                        <option value="status">Change Status</option>
                        <option value="assign">Assign Staff</option>
                        <option value="priority">Set Priority</option>
                        <option value="delete">Delete Selected</option>
                    </select>

                    <select name="bulk_value" id="bulkValue" class="form-select form-select-sm" style="width: 160px;">
                        <option value="">Select Value...</option>
                    </select>

                    <button type="submit" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">Apply Bulk</button>
                </div>
            </div>

            <!-- DIRECTORY TABLE -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 text-nowrap" id="leadsTable">
                    <thead class="table-light fs-7 text-uppercase text-muted">
                        <tr>
                            <th width="30">#</th>
                            <th>Lead Code & Date</th>
                            <th>Client / Company Name</th>
                            <th>Contact Info</th>
                            <th>Source</th>
                            <th>Deal Value</th>
                            <th width="160">Status Stage</th>
                            <th>Assigned Staff</th>
                            <th>Temp</th>
                            <th width="160" class="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($leads)): ?>
                            <tr>
                                <td colspan="10" class="text-center py-5 text-muted">
                                    <i class="bi bi-person-workspace fs-1 d-block mb-2 text-secondary"></i>
                                    No lead records found. Click <strong>+ Add New Lead</strong> to create one.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($leads as $ld): ?>
                                <tr>
                                    <td>
                                        <input type="checkbox" name="lead_ids[]" value="<?php echo $ld['id']; ?>" class="form-check-input lead-check">
                                    </td>

                                    <!-- Lead ID & Date -->
                                    <td>
                                        <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="fw-bold text-primary font-monospace text-decoration-none">
                                            <?php echo htmlspecialchars($ld['lead_code']); ?>
                                        </a>
                                        <small class="text-muted d-block" style="font-size: 11px;"><?php echo date('d-m-Y', strtotime($ld['created_at'])); ?></small>
                                    </td>

                                    <!-- Client Name & Company -->
                                    <td>
                                        <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="fw-bold text-dark text-decoration-none">
                                            <?php echo htmlspecialchars($ld['company'] ?: $ld['name']); ?>
                                        </a>
                                        <?php if (!empty($ld['company']) && $ld['company'] !== $ld['name']): ?>
                                            <small class="text-muted d-block"><?php echo htmlspecialchars($ld['name']); ?></small>
                                        <?php endif; ?>
                                    </td>

                                    <!-- Contact Info -->
                                    <td>
                                        <a href="tel:<?php echo htmlspecialchars($ld['mobile']); ?>" class="text-dark text-decoration-none fw-semibold small">
                                            <i class="bi bi-telephone text-muted me-1"></i><?php echo htmlspecialchars($ld['mobile']); ?>
                                        </a>
                                        <?php if ($ld['email']): ?>
                                            <small class="text-muted d-block"><?php echo htmlspecialchars($ld['email']); ?></small>
                                        <?php endif; ?>
                                    </td>

                                    <!-- Source -->
                                    <td>
                                        <span class="badge bg-light text-dark border rounded-pill px-2 py-1 small"><?php echo htmlspecialchars($ld['source_name'] ?: 'Direct'); ?></span>
                                    </td>

                                    <!-- Deal Value -->
                                    <td class="fw-bold text-success">
                                        ₹<?php echo format_inr($ld['lead_value']); ?>
                                    </td>

                                    <!-- In-Row Instant Status Dropdown -->
                                    <td>
                                        <select class="form-select form-select-sm border-0 fw-bold rounded-pill text-white row-status-select" 
                                                data-lead-id="<?php echo $ld['id']; ?>"
                                                style="background-color: <?php echo htmlspecialchars($ld['color_code'] ?: '#6366f1'); ?>;">
                                            <?php foreach ($statuses as $st): ?>
                                                <option value="<?php echo $st['id']; ?>" <?php echo $ld['status_id'] == $st['id'] ? 'selected' : ''; ?>>
                                                    <?php echo htmlspecialchars($st['status_name']); ?>
                                                </option>
                                            <?php endforeach; ?>
                                        </select>
                                    </td>

                                    <!-- Assigned Staff -->
                                    <td>
                                        <span class="badge bg-info-subtle text-dark border rounded-pill px-2 py-1 small"><?php echo htmlspecialchars($ld['staff_name'] ?: 'Unassigned'); ?></span>
                                    </td>

                                    <!-- Temperature -->
                                    <td>
                                        <?php if ($ld['temperature'] === 'hot'): ?>
                                            <span class="badge bg-danger rounded-pill px-2">🔥 Hot</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning text-dark rounded-pill px-2">🟠 Warm</span>
                                        <?php endif; ?>
                                    </td>

                                    <!-- Action Column -->
                                    <td class="text-end text-nowrap">
                                        <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-3 shadow-sm me-1 fw-bold">
                                            <i class="bi bi-eye me-1"></i> View 360°
                                        </a>
                                        <div class="dropdown d-inline">
                                            <button class="btn btn-sm btn-outline-secondary rounded-circle" type="button" data-bs-toggle="dropdown" title="More Options">
                                                <i class="bi bi-three-dots-vertical"></i>
                                            </button>
                                            <ul class="dropdown-menu shadow border-0 rounded-3 dropdown-menu-end">
                                                <li><a class="dropdown-item py-2" href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>"><i class="bi bi-eye text-primary me-2"></i> Lead 360° Profile</a></li>
                                                <li><a class="dropdown-item py-2" href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>#tab-reminders"><i class="bi bi-alarm text-warning me-2"></i> Add Reminder</a></li>
                                                <li><a class="dropdown-item py-2" href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>#tab-followups"><i class="bi bi-telephone-out text-success me-2"></i> Log Phone Call</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </form>
<?php endif; ?>

<!-- ========================================================================= -->
<!-- MODAL: ADD NEW LEAD -->
<!-- ========================================================================= -->
<div class="modal fade" id="addLeadModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom pb-3">
                <h5 class="modal-title font-heading fw-bold text-dark"><i class="bi bi-person-plus-fill text-primary me-2"></i> Add New Lead</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="create_lead">
                <div class="modal-body p-4">
                    <!-- Nav Tabs -->
                    <ul class="nav nav-pills nav-fill bg-light p-1 rounded-pill mb-4" role="tablist">
                        <li class="nav-item">
                            <button class="nav-item nav-link active rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#modal-lead-basic" type="button"><i class="bi bi-person me-1"></i> Contact & Company</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-item nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#modal-lead-financials" type="button"><i class="bi bi-currency-rupee me-1"></i> Deal & Requirements</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-item nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#modal-lead-sales" type="button"><i class="bi bi-funnel me-1"></i> Pipeline & Assignment</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- TAB 1: BASIC INFO -->
                        <div class="tab-pane fade show active" id="modal-lead-basic">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">First Name *</label>
                                    <input type="text" name="first_name" class="form-control" required placeholder="First Name">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Last Name</label>
                                    <input type="text" name="last_name" class="form-control" placeholder="Last Name">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Title / Designation</label>
                                    <input type="text" name="title" class="form-control" placeholder="Owner / CEO / Manager">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Company / Enterprise Name</label>
                                    <input type="text" name="company" class="form-control" placeholder="Firm / Company Name">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Primary Mobile Number *</label>
                                    <input type="tel" name="mobile" class="form-control" required placeholder="10-digit Mobile">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">WhatsApp Number</label>
                                    <input type="tel" name="whatsapp_number" class="form-control" placeholder="WhatsApp Number">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Email Address</label>
                                    <input type="email" name="email" class="form-control" placeholder="lead@company.com">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">State</label>
                                    <input type="text" name="state" class="form-control" value="Rajasthan">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">District</label>
                                    <input type="text" name="district" class="form-control" value="Jaipur">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Website</label>
                                    <input type="url" name="website" class="form-control" placeholder="https://example.com">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2: DEAL & REQUIREMENTS -->
                        <div class="tab-pane fade" id="modal-lead-financials">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Lead Estimated Deal Value (₹)</label>
                                    <input type="number" name="lead_value" class="form-control" placeholder="e.g. 50000">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Interested Service</label>
                                    <select name="interested_service_id" class="form-select">
                                        <option value="">Select Service...</option>
                                        <?php foreach ($services as $srv): ?>
                                            <option value="<?php echo $srv['id']; ?>"><?php echo htmlspecialchars($srv['name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">GSTIN Number</label>
                                    <input type="text" name="gstin" class="form-control" placeholder="GSTIN (if applicable)">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">PAN Number</label>
                                    <input type="text" name="pan" class="form-control" placeholder="PAN Number">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label small fw-bold">Address / Requirement Notes</label>
                                    <textarea name="address" class="form-control" rows="3" placeholder="Requirement notes or address..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 3: PIPELINE & ASSIGNMENT -->
                        <div class="tab-pane fade" id="modal-lead-sales">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Initial Status Stage *</label>
                                    <select name="status_id" class="form-select" required>
                                        <?php foreach ($statuses as $st): ?>
                                            <option value="<?php echo $st['id']; ?>"><?php echo htmlspecialchars($st['status_name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Lead Source *</label>
                                    <select name="source_id" class="form-select" required>
                                        <?php foreach ($sources as $src): ?>
                                            <option value="<?php echo $src['id']; ?>"><?php echo htmlspecialchars($src['source_name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Assigned Staff Member</label>
                                    <select name="assigned_employee_id" class="form-select">
                                        <option value="">Unassigned</option>
                                        <?php foreach ($employees as $emp): ?>
                                            <option value="<?php echo $emp['id']; ?>"><?php echo htmlspecialchars($emp['name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">Priority</label>
                                    <select name="priority" class="form-select">
                                        <option value="urgent">Urgent</option>
                                        <option value="high">High</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">Temperature</label>
                                    <select name="temperature" class="form-select">
                                        <option value="hot">🔥 Hot</option>
                                        <option value="warm" selected>🟠 Warm</option>
                                        <option value="cold">🔵 Cold</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top p-3">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Lead Record</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- JS FOR BULK & AJAX STATUS -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function () {
            document.querySelectorAll('.lead-check').forEach(cb => cb.checked = this.checked);
        });
    }

    const bulkType = document.getElementById('bulkType');
    const bulkValue = document.getElementById('bulkValue');
    const statusesJS = <?php echo json_encode($statuses); ?>;
    const employeesJS = <?php echo json_encode($employees); ?>;

    if (bulkType) {
        bulkType.addEventListener('change', function () {
            bulkValue.innerHTML = '<option value="">Select Value...</option>';
            if (this.value === 'status') {
                statusesJS.forEach(st => {
                    bulkValue.innerHTML += `<option value="${st.id}">${st.status_name}</option>`;
                });
            } else if (this.value === 'assign') {
                employeesJS.forEach(emp => {
                    bulkValue.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;
                });
            } else if (this.value === 'priority') {
                bulkValue.innerHTML += '<option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>';
            }
        });
    }

    document.querySelectorAll('.row-status-select').forEach(select => {
        select.addEventListener('change', function () {
            const leadId = this.getAttribute('data-lead-id');
            const statusId = this.value;
            const selectElement = this;

            fetch(BASE_URL + 'api/lead_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `lead_id=${leadId}&status_id=${statusId}`
            })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    if (data.color_code) {
                        selectElement.style.backgroundColor = data.color_code;
                    }
                } else {
                    alert(data.message || 'Status update failed.');
                }
            })
            .catch(err => console.error(err));
        });
    });
});
</script>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
