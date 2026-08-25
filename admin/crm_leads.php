<?php
$page_title = "Leads CRM & Enterprise Sales Workspace";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/LeadManager.php';

global $pdo;

// Fetch Dropdown Masters
$statuses = $pdo->query("SELECT * FROM lead_statuses ORDER BY sort_order ASC")->fetchAll();
$sources = $pdo->query("SELECT * FROM lead_sources WHERE status = 'active'")->fetchAll();
$employees = $pdo->query("SELECT e.id, u.name FROM employees e JOIN users u ON e.user_id = u.id")->fetchAll();
$services = $pdo->query("SELECT id, name FROM services WHERE status = 'active' ORDER BY name ASC")->fetchAll();

// Handle New Lead Submission
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'create_lead') {
        $res = LeadManager::create_lead([
            'name' => $_POST['name'] ?? '',
            'mobile' => $_POST['mobile'] ?? '',
            'email' => $_POST['email'] ?? '',
            'state' => $_POST['state'] ?? 'Rajasthan',
            'district' => $_POST['district'] ?? 'Jaipur',
            'business_name' => $_POST['business_name'] ?? '',
            'interested_service_id' => $_POST['interested_service_id'] ?? null,
            'required_loan_amount' => $_POST['required_loan_amount'] ?? 0,
            'source_id' => $_POST['source_id'] ?? 1,
            'assigned_employee_id' => $_POST['assigned_employee_id'] ?? null,
            'priority' => $_POST['priority'] ?? 'medium',
            'temperature' => $_POST['temperature'] ?? 'warm'
        ]);
        if ($res['status']) {
            $msg = '<div class="alert alert-success fw-bold"><i class="bi bi-check-circle me-1"></i> New Lead created successfully: ' . htmlspecialchars($res['lead_code']) . '</div>';
        } else {
            $msg = '<div class="alert alert-danger fw-bold"><i class="bi bi-exclamation-triangle me-1"></i> ' . htmlspecialchars($res['message']) . '</div>';
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
                $msg = "<div class='alert alert-success fw-bold'>Bulk Status updated for {$count} leads.</div>";
            } elseif ($bulk_action === 'assign') {
                $pdo->query("UPDATE leads SET assigned_employee_id = " . (int)$bulk_value . " WHERE id IN ($in_clause)");
                $msg = "<div class='alert alert-success fw-bold'>Bulk Assigned {$count} leads to employee.</div>";
            } elseif ($bulk_action === 'priority') {
                $pdo->query("UPDATE leads SET priority = " . $pdo->quote($bulk_value) . " WHERE id IN ($in_clause)");
                $msg = "<div class='alert alert-success fw-bold'>Bulk Priority updated for {$count} leads.</div>";
            }
        }
    }
}

// Build Dynamic SQL Query for Filtering & Pagination
$where = [];
$params = [];

// Search Filter
$q = trim($_GET['q'] ?? '');
if (!empty($q)) {
    $where[] = "(l.lead_code LIKE ? OR l.name LIKE ? OR l.mobile LIKE ? OR l.whatsapp_number LIKE ? OR l.email LIKE ? OR l.business_name LIKE ?)";
    $q_param = "%{$q}%";
    $params = array_merge($params, [$q_param, $q_param, $q_param, $q_param, $q_param, $q_param]);
}

// Status Filter
$status_id = $_GET['status_id'] ?? '';
if ($status_id !== '') {
    $where[] = "l.status_id = ?";
    $params[] = (int)$status_id;
}

// Source Filter
$source_id = $_GET['source_id'] ?? '';
if ($source_id !== '') {
    $where[] = "l.source_id = ?";
    $params[] = (int)$source_id;
}

// Employee Filter
$emp_id = $_GET['employee_id'] ?? '';
if ($emp_id !== '') {
    $where[] = "l.assigned_employee_id = ?";
    $params[] = (int)$emp_id;
}

// Temperature Filter
$temp = $_GET['temperature'] ?? '';
if (!empty($temp)) {
    $where[] = "l.temperature = ?";
    $params[] = $temp;
}

// Priority Filter
$priority_filter = $_GET['priority'] ?? '';
if (!empty($priority_filter)) {
    $where[] = "l.priority = ?";
    $params[] = $priority_filter;
}

// Quick Filter Tab Handling
$tab = $_GET['tab'] ?? 'all';
if ($tab === 'new') {
    $where[] = "l.status_id = 1";
} elseif ($tab === 'followup_today') {
    $where[] = "EXISTS (SELECT 1 FROM followups f WHERE f.lead_id = l.id AND f.followup_date = CURDATE() AND f.status = 'pending')";
} elseif ($tab === 'overdue') {
    $where[] = "EXISTS (SELECT 1 FROM followups f WHERE f.lead_id = l.id AND f.followup_date < CURDATE() AND f.status = 'pending')";
} elseif ($tab === 'interested') {
    $where[] = "l.status_id = 6";
} elseif ($tab === 'hot') {
    $where[] = "l.temperature = 'hot'";
} elseif ($tab === 'appointment') {
    $where[] = "l.status_id = 9";
} elseif ($tab === 'converted') {
    $where[] = "l.status_id = 17";
} elseif ($tab === 'lost') {
    $where[] = "l.status_id = 19";
}

// Next Follow-up Filter
$n_flw = $_GET['next_followup'] ?? '';
if ($n_flw === 'today') {
    $where[] = "EXISTS (SELECT 1 FROM followups f WHERE f.lead_id = l.id AND f.followup_date = CURDATE() AND f.status = 'pending')";
} elseif ($n_flw === 'tomorrow') {
    $where[] = "EXISTS (SELECT 1 FROM followups f WHERE f.lead_id = l.id AND f.followup_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND f.status = 'pending')";
} elseif ($n_flw === 'overdue') {
    $where[] = "EXISTS (SELECT 1 FROM followups f WHERE f.lead_id = l.id AND f.followup_date < CURDATE() AND f.status = 'pending')";
} elseif ($n_flw === 'no_followup') {
    $where[] = "NOT EXISTS (SELECT 1 FROM followups f WHERE f.lead_id = l.id AND f.status = 'pending')";
}

$where_sql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

// Count Query for Pagination & Tab Badges
$total_leads_count = $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
$new_count = $pdo->query("SELECT COUNT(*) FROM leads WHERE status_id = 1")->fetchColumn();
$flw_today_count = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date = CURDATE() AND status = 'pending'")->fetchColumn();
$overdue_count = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date < CURDATE() AND status = 'pending'")->fetchColumn();
$interested_count = $pdo->query("SELECT COUNT(*) FROM leads WHERE status_id = 6")->fetchColumn();

// Pagination
$per_page = (int)($_GET['per_page'] ?? 25);
$page = (int)($_GET['page'] ?? 1);
if ($page < 1) $page = 1;
$offset = ($page - 1) * $per_page;

// Count filtered leads
$count_stmt = $pdo->prepare("SELECT COUNT(*) FROM leads l {$where_sql}");
$count_stmt->execute($params);
$filtered_count = $count_stmt->fetchColumn();
$total_pages = ceil($filtered_count / $per_page);

// Fetch Leads Data Table
$sql = "
    SELECT l.*, ls.status_name, ls.color_code, lsrc.source_name,
           srv.name AS service_name, u.name AS staff_name,
           (SELECT CONCAT(f.followup_date, ' ', f.followup_time) FROM followups f WHERE f.lead_id = l.id AND f.status = 'pending' ORDER BY f.followup_date ASC LIMIT 1) AS next_flw_datetime
    FROM leads l
    LEFT JOIN lead_statuses ls ON l.status_id = ls.id
    LEFT JOIN lead_sources lsrc ON l.source_id = lsrc.id
    LEFT JOIN services srv ON l.interested_service_id = srv.id
    LEFT JOIN employees e ON l.assigned_employee_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    {$where_sql}
    ORDER BY l.id DESC
    LIMIT {$per_page} OFFSET {$offset}
";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$leads = $stmt->fetchAll();
?>

<!-- TOP HEADER AREA -->
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h4 class="font-heading fw-bold mb-1">Leads CRM</h4>
        <p class="text-muted small mb-0">High-density sales operating system. Manage, filter & convert leads instantly.</p>
    </div>
    <div class="d-flex gap-2">
        <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#addLeadModal">
            <i class="bi bi-plus-lg me-1"></i> + Add New Lead
        </button>
        <a href="<?php echo BASE_URL; ?>admin/lead_import.php" class="btn btn-outline-secondary rounded-pill px-3">
            <i class="bi bi-file-earmark-arrow-up me-1"></i> Import Leads
        </a>
        <a href="<?php echo BASE_URL; ?>admin/followups_today.php" class="btn btn-warning text-dark fw-bold rounded-pill px-3">
            <i class="bi bi-clock-history me-1"></i> Today's Follow-ups
        </a>
        <button class="btn btn-light border rounded-pill px-3" onclick="window.location.reload();" title="Refresh List">
            <i class="bi bi-arrow-clockwise"></i>
        </button>
    </div>
</div>

<?php echo $msg; ?>

<!-- ADVANCED COMPACT HEADER FILTER BAR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
    <form action="" method="GET" class="row g-2 align-items-center">
        <!-- Search Input -->
        <div class="col-md-3">
            <div class="input-group input-group-sm">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control form-control-sm border-start-0" placeholder="Search ID, Name, Mobile, Email, Business..." value="<?php echo htmlspecialchars($q); ?>">
            </div>
        </div>

        <!-- Status Filter -->
        <div class="col-md-2">
            <select name="status_id" class="form-select form-select-sm">
                <option value="">All Statuses</option>
                <?php foreach ($statuses as $st): ?>
                    <option value="<?php echo $st['id']; ?>" <?php echo $status_id == $st['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($st['status_name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <!-- Source Filter -->
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

        <!-- Next Follow-up Filter -->
        <div class="col-md-2">
            <select name="next_followup" class="form-select form-select-sm border-warning fw-bold">
                <option value="">Next Follow-up...</option>
                <option value="today" <?php echo $n_flw === 'today' ? 'selected' : ''; ?>>⏰ Follow-up Today</option>
                <option value="tomorrow" <?php echo $n_flw === 'tomorrow' ? 'selected' : ''; ?>>📅 Follow-up Tomorrow</option>
                <option value="overdue" <?php echo $n_flw === 'overdue' ? 'selected' : ''; ?>>🚨 Overdue Queue</option>
                <option value="no_followup" <?php echo $n_flw === 'no_followup' ? 'selected' : ''; ?>>❌ No Follow-up Set</option>
            </select>
        </div>

        <!-- Priority & Temp Filter -->
        <div class="col-md-1">
            <select name="temperature" class="form-select form-select-sm">
                <option value="">Temp</option>
                <option value="hot" <?php echo $temp === 'hot' ? 'selected' : ''; ?>>🔥 Hot</option>
                <option value="warm" <?php echo $temp === 'warm' ? 'selected' : ''; ?>>🟠 Warm</option>
                <option value="cold" <?php echo $temp === 'cold' ? 'selected' : ''; ?>>🔵 Cold</option>
            </select>
        </div>

        <!-- Filter Action Buttons -->
        <div class="col-md-2 d-flex gap-2">
            <button type="submit" class="btn btn-sm btn-primary rounded-pill w-100 fw-bold">Apply</button>
            <a href="crm_leads.php" class="btn btn-sm btn-outline-secondary rounded-pill w-100">Reset</a>
        </div>
    </form>
</div>

<!-- REAL-TIME QUICK FILTER TABS -->
<div class="d-flex align-items-center gap-2 overflow-x-auto pb-2 mb-3">
    <a href="crm_leads.php?tab=all" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'all' ? 'btn-primary' : 'btn-light border'; ?>">
        All Leads <span class="badge bg-secondary ms-1"><?php echo $total_leads_count; ?></span>
    </a>
    <a href="crm_leads.php?tab=new" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'new' ? 'btn-primary' : 'btn-light border'; ?>">
        New <span class="badge bg-info text-dark ms-1"><?php echo $new_count; ?></span>
    </a>
    <a href="crm_leads.php?tab=followup_today" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'followup_today' ? 'btn-warning text-dark' : 'btn-light border'; ?>">
        Follow-up Today <span class="badge bg-warning text-dark ms-1"><?php echo $flw_today_count; ?></span>
    </a>
    <a href="crm_leads.php?tab=overdue" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'overdue' ? 'btn-danger' : 'btn-light border text-danger'; ?>">
        Overdue 🚨 <span class="badge bg-danger ms-1"><?php echo $overdue_count; ?></span>
    </a>
    <a href="crm_leads.php?tab=interested" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'interested' ? 'btn-purple text-white' : 'btn-light border'; ?>">
        Interested <span class="badge bg-secondary ms-1"><?php echo $interested_count; ?></span>
    </a>
    <a href="crm_leads.php?tab=hot" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'hot' ? 'btn-danger' : 'btn-light border'; ?>">
        🔥 Hot Leads
    </a>
    <a href="crm_leads.php?tab=converted" class="btn btn-sm rounded-pill fw-bold px-3 <?php echo $tab === 'converted' ? 'btn-success' : 'btn-light border'; ?>">
        Converted
    </a>
</div>

<!-- HIGH-DENSITY PROFESSIONAL DATA TABLE -->
<form action="" method="POST" id="bulkForm">
    <input type="hidden" name="action" value="bulk_update">
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-3">
        <!-- Bulk Action Bar -->
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2 bg-light rounded-top-4">
            <div class="d-flex align-items-center gap-2">
                <input type="checkbox" class="form-check-input" id="selectAll">
                <span class="small text-muted fw-bold">Select All</span>
                <span class="small text-secondary ms-3">Showing <strong><?php echo count($leads); ?></strong> of <strong><?php echo $filtered_count; ?></strong> leads</span>
            </div>

            <!-- Bulk Dropdowns -->
            <div class="d-flex align-items-center gap-2">
                <select name="bulk_type" id="bulkType" class="form-select form-select-sm" style="width: 140px;">
                    <option value="">Bulk Actions...</option>
                    <option value="status">Change Status</option>
                    <option value="assign">Assign Staff</option>
                    <option value="priority">Set Priority</option>
                </select>

                <select name="bulk_value" id="bulkValue" class="form-select form-select-sm" style="width: 160px;">
                    <option value="">Select Value...</option>
                    <!-- Populated dynamically via JS -->
                </select>

                <button type="submit" class="btn btn-sm btn-outline-primary rounded-pill px-3">Apply Bulk</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 text-nowrap">
                <thead class="table-light fs-7 text-uppercase text-muted">
                    <tr>
                        <th width="30">#</th>
                        <th>Lead ID & Date</th>
                        <th>Client Name & Mobile</th>
                        <th>Business / Requirement</th>
                        <th>Source</th>
                        <th width="160">Status Stage</th>
                        <th>Assigned Staff</th>
                        <th>Next Follow-up</th>
                        <th>Priority</th>
                        <th width="140" class="text-end">Quick Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($leads)): ?>
                        <tr><td colspan="10" class="text-center text-muted py-5">No leads found matching current filters.</td></tr>
                    <?php else: ?>
                        <?php foreach ($leads as $ld): ?>
                            <tr>
                                <td>
                                    <input type="checkbox" name="lead_ids[]" value="<?php echo $ld['id']; ?>" class="form-check-input lead-check">
                                </td>

                                <!-- Lead ID & Date -->
                                <td>
                                    <strong class="d-block text-primary font-monospace fs-7"><?php echo htmlspecialchars($ld['lead_code']); ?></strong>
                                    <small class="text-muted fs-7"><?php echo date('d M Y', strtotime($ld['created_at'])); ?></small>
                                </td>

                                <!-- Name & Mobile -->
                                <td>
                                    <strong class="d-block text-dark">
                                        <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="text-dark text-decoration-none hover-primary">
                                            <?php echo htmlspecialchars($ld['name']); ?>
                                        </a>
                                    </strong>
                                    <small class="text-secondary fs-7"><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($ld['mobile']); ?></small>
                                </td>

                                <!-- Business / Requirement -->
                                <td>
                                    <span class="fw-bold d-block text-dark fs-7"><?php echo htmlspecialchars($ld['business_name'] ?: 'Individual'); ?></span>
                                    <small class="text-muted fs-7">
                                        <?php echo htmlspecialchars($ld['service_name'] ?: ($ld['required_loan_amount'] > 0 ? 'Loan ₹' . format_inr($ld['required_loan_amount']) : 'General Inquiry')); ?>
                                    </small>
                                </td>

                                <!-- Source -->
                                <td>
                                    <span class="badge bg-light text-dark border fs-7"><?php echo htmlspecialchars($ld['source_name'] ?: 'Website'); ?></span>
                                    <?php if ($ld['source_detail']): ?>
                                        <small class="d-block text-muted fs-7"><?php echo htmlspecialchars($ld['source_detail']); ?></small>
                                    <?php endif; ?>
                                </td>

                                <!-- Interactive In-Row Status Dropdown -->
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
                                    <small class="fw-bold text-dark d-block"><?php echo htmlspecialchars($ld['staff_name'] ?: 'Unassigned'); ?></small>
                                </td>

                                <!-- Next Follow-up & Overdue Tag -->
                                <td>
                                    <?php if ($ld['next_flw_datetime']): ?>
                                        <?php
                                        $flw_ts = strtotime($ld['next_flw_datetime']);
                                        $is_overdue = $flw_ts < time();
                                        ?>
                                        <?php if ($is_overdue): ?>
                                            <span class="badge bg-danger text-white fs-7 mb-1">🚨 OVERDUE</span>
                                        <?php endif; ?>
                                        <small class="d-block fw-bold <?php echo $is_overdue ? 'text-danger' : 'text-primary'; ?>">
                                            <?php echo date('d M, h:i A', $flw_ts); ?>
                                        </small>
                                    <?php else: ?>
                                        <small class="text-muted">None Set</small>
                                    <?php endif; ?>
                                </td>

                                <!-- Priority / Temp -->
                                <td>
                                    <?php if ($ld['temperature'] === 'hot'): ?>
                                        <span class="badge bg-danger fs-7 me-1">🔥 Hot</span>
                                    <?php else: ?>
                                        <span class="badge bg-warning text-dark fs-7 me-1">🟠 Warm</span>
                                    <?php endif; ?>
                                    <span class="badge bg-light text-dark border fs-7"><?php echo ucfirst($ld['priority']); ?></span>
                                </td>

                                <!-- Quick Actions -->
                                <td class="text-end">
                                    <div class="d-inline-flex gap-1 align-items-center">
                                        <a href="tel:<?php echo htmlspecialchars($ld['mobile']); ?>" class="btn btn-sm btn-outline-success rounded-circle p-1" title="Call"><i class="bi bi-telephone-fill px-1"></i></a>
                                        <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $ld['mobile']); ?>" target="_blank" class="btn btn-sm btn-outline-success rounded-circle p-1" title="WhatsApp"><i class="bi bi-whatsapp px-1"></i></a>
                                        <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>&tab=followups" class="btn btn-sm btn-outline-primary rounded-circle p-1" title="Schedule Follow-up"><i class="bi bi-calendar-event px-1"></i></a>
                                        <a href="crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-2 py-0 fs-7 ms-1 fw-bold">360°</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div class="p-3 d-flex justify-content-between align-items-center border-top">
            <span class="small text-muted">Page <strong><?php echo $page; ?></strong> of <strong><?php echo max(1, $total_pages); ?></strong></span>
            <ul class="pagination pagination-sm mb-0">
                <?php if ($page > 1): ?>
                    <li class="page-item"><a class="page-link" href="?<?php echo http_build_query(array_merge($_GET, ['page' => $page - 1])); ?>">Prev</a></li>
                <?php endif; ?>
                <li class="page-item active"><span class="page-link"><?php echo $page; ?></span></li>
                <?php if ($page < $total_pages): ?>
                    <li class="page-item"><a class="page-link" href="?<?php echo http_build_query(array_merge($_GET, ['page' => $page + 1])); ?>">Next</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</form>

<!-- + ADD NEW LEAD MODAL -->
<div class="modal fade" id="addLeadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">+ Add New Lead</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="create_lead">
                <div class="modal-body">
                    <h6 class="font-heading fw-bold text-primary mb-3">1. Contact & Location</h6>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Full Name *</label>
                            <input type="text" name="name" class="form-control" required placeholder="Full Name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Mobile Number *</label>
                            <input type="tel" name="mobile" class="form-control" required placeholder="10-digit Mobile">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Email Address</label>
                            <input type="email" name="email" class="form-control" placeholder="client@example.com">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">State</label>
                            <input type="text" name="state" class="form-control" value="Rajasthan">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">District</label>
                            <input type="text" name="district" class="form-control" value="Jaipur">
                        </div>
                    </div>

                    <h6 class="font-heading fw-bold text-primary mb-3">2. Business & Requirement Details</h6>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Business Name</label>
                            <input type="text" name="business_name" class="form-control" placeholder="Company / Enterprise Name">
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
                            <label class="form-label small fw-bold">Loan Requirement Amount (₹)</label>
                            <input type="number" name="required_loan_amount" class="form-control" placeholder="e.g. 1000000">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Lead Source *</label>
                            <select name="source_id" class="form-select" required>
                                <?php foreach ($sources as $src): ?>
                                    <option value="<?php echo $src['id']; ?>"><?php echo htmlspecialchars($src['source_name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <h6 class="font-heading fw-bold text-primary mb-3">3. CRM Assignment & Priority</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Assign to Staff Member</label>
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
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Lead</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- JS FOR IN-ROW STATUS CHANGE & BULK DROPDOWNS -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Select All Checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function () {
            document.querySelectorAll('.lead-check').forEach(cb => cb.checked = this.checked);
        });
    }

    // Dynamic Bulk Action Options
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

    // In-Row Instant AJAX Status Dropdown Change
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
