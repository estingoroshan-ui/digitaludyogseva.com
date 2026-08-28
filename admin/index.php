<?php
$page_title = "Command Center Dashboard";
$active_menu = "dashboard";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;

// Sales Overview Date Filter
$date_range = sanitize($_GET['range'] ?? 'this_month');
$where_date = "1=1";

if ($date_range === 'today') {
    $where_date = "DATE(created_at) = CURDATE()";
} elseif ($date_range === 'yesterday') {
    $where_date = "DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
} elseif ($date_range === 'this_week') {
    $where_date = "YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)";
} elseif ($date_range === 'this_month') {
    $where_date = "MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
} elseif ($date_range === 'last_month') {
    $where_date = "MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))";
} elseif ($date_range === 'this_year') {
    $where_date = "YEAR(created_at) = YEAR(CURDATE())";
}

// KPI Aggregations
$total_leads = $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
$new_leads_today = $pdo->query("SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURDATE()")->fetchColumn();
$total_customers = $pdo->query("SELECT COUNT(*) FROM customers")->fetchColumn();
$total_loans = $pdo->query("SELECT COUNT(*) FROM loan_applications")->fetchColumn();
$total_staff = $pdo->query("SELECT COUNT(*) FROM users WHERE user_type IN ('admin', 'staff') AND status = 'active'")->fetchColumn();

// Finance & Revenue Metrics
$total_revenue = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'verified' AND {$where_date}")->fetchColumn();
$pending_offline_payments = $pdo->query("SELECT COUNT(*) FROM offline_payments WHERE verification_status = 'pending'")->fetchColumn();

// Service Projects Metrics
$total_projects = $pdo->query("SELECT COUNT(*) FROM cases")->fetchColumn();
$pending_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'on_hold'")->fetchColumn();
$in_process_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'active'")->fetchColumn();
$completed_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'completed'")->fetchColumn();

// Lead Pipeline Overview Breakdown
$lead_stats = $pdo->query("
    SELECT ls.status_name, ls.color_code, COUNT(l.id) AS count
    FROM lead_statuses ls
    LEFT JOIN leads l ON ls.id = l.status_id
    GROUP BY ls.id
    ORDER BY ls.sort_order ASC LIMIT 6
")->fetchAll();

// Task Overview Breakdown
$task_pending = $pdo->query("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")->fetchColumn();
$task_in_progress = $pdo->query("SELECT COUNT(*) FROM tasks WHERE status = 'in_progress'")->fetchColumn();
$task_completed = $pdo->query("SELECT COUNT(*) FROM tasks WHERE status = 'completed'")->fetchColumn();

// Fetch Recent Activity
$recent_leads = $pdo->query("
    SELECT l.*, ls.status_name, ls.color_code
    FROM leads l
    JOIN lead_statuses ls ON l.status_id = ls.id
    ORDER BY l.id DESC LIMIT 5
")->fetchAll();

$recent_projects = $pdo->query("
    SELECT c.*, cust.name AS customer_name, COALESCE(s.name, 'Service Case Project') AS service_name
    FROM cases c
    JOIN customers cust ON c.customer_id = cust.id
    LEFT JOIN services s ON c.service_id = s.id
    ORDER BY c.id DESC LIMIT 5
")->fetchAll();
?>

<!-- DASHBOARD HEADER & DATE FILTER -->
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-speedometer2 text-primary me-2"></i> CRM Enterprise Command Center</h4>
        <p class="text-muted small mb-0">Real-time operational summary across Sales, Leads, Projects, Customers, and Staff.</p>
    </div>
    <!-- Date Range Selector for Sales & Revenue -->
    <form action="" method="GET" class="d-flex align-items-center gap-2">
        <label class="small fw-bold text-muted text-nowrap"><i class="bi bi-funnel me-1"></i> Sales Period:</label>
        <select name="range" class="form-select form-select-sm rounded-pill fw-bold" onchange="this.form.submit()" style="min-width: 150px;">
            <option value="today" <?php echo $date_range === 'today' ? 'selected' : ''; ?>>Today</option>
            <option value="yesterday" <?php echo $date_range === 'yesterday' ? 'selected' : ''; ?>>Yesterday</option>
            <option value="this_week" <?php echo $date_range === 'this_week' ? 'selected' : ''; ?>>This Week</option>
            <option value="this_month" <?php echo $date_range === 'this_month' ? 'selected' : ''; ?>>This Month</option>
            <option value="last_month" <?php echo $date_range === 'last_month' ? 'selected' : ''; ?>>Last Month</option>
            <option value="this_year" <?php echo $date_range === 'this_year' ? 'selected' : ''; ?>>This Year</option>
        </select>
    </form>
</div>

<!-- TOP MASTER KPI CARDS GRID -->
<div class="row g-3 mb-4">
    <div class="col-xl-2-4 col-md-4 col-sm-6">
        <a href="<?php echo BASE_URL; ?>admin/customers.php" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-primary">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Total Customers</small>
                        <h3 class="fw-bold my-1 text-dark"><?php echo number_format($total_customers); ?></h3>
                        <small class="text-muted">360° Profile Linked</small>
                    </div>
                    <div class="stat-icon bg-primary-subtle text-primary"><i class="bi bi-people"></i></div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-2-4 col-md-4 col-sm-6">
        <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-info">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Total Leads</small>
                        <h3 class="fw-bold my-1 text-dark"><?php echo number_format($total_leads); ?></h3>
                        <small class="text-success fw-bold">+<?php echo $new_leads_today; ?> Today</small>
                    </div>
                    <div class="stat-icon bg-info-subtle text-info"><i class="bi bi-funnel"></i></div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-2-4 col-md-4 col-sm-6">
        <a href="<?php echo BASE_URL; ?>admin/projects.php" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-warning">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Active Projects</small>
                        <h3 class="fw-bold my-1 text-dark"><?php echo number_format($total_projects); ?></h3>
                        <small class="text-warning fw-bold"><?php echo $in_process_projects; ?> In Process</small>
                    </div>
                    <div class="stat-icon bg-warning-subtle text-warning"><i class="bi bi-briefcase"></i></div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-2-4 col-md-4 col-sm-6">
        <a href="<?php echo BASE_URL; ?>admin/payments.php" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-success">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Sales / Revenue</small>
                        <h3 class="fw-bold my-1 text-success"><?php echo format_inr($total_revenue); ?></h3>
                        <small class="text-muted"><?php echo ucfirst(str_replace('_', ' ', $date_range)); ?></small>
                    </div>
                    <div class="stat-icon bg-success-subtle text-success"><i class="bi bi-currency-rupee"></i></div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-2-4 col-md-4 col-sm-6">
        <a href="<?php echo BASE_URL; ?>admin/staff.php" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-dark">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Staff Team</small>
                        <h3 class="fw-bold my-1 text-dark"><?php echo number_format($total_staff); ?></h3>
                        <small class="text-muted">Active Members</small>
                    </div>
                    <div class="stat-icon bg-dark-subtle text-dark"><i class="bi bi-shield-lock"></i></div>
                </div>
            </div>
        </a>
    </div>
</div>

<!-- SALES, LEAD & TASK OVERVIEWS GRID -->
<div class="row g-4 mb-4">
    <!-- Lead Pipeline Breakdown Widget -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="font-heading fw-bold mb-0"><i class="bi bi-diagram-3 text-primary me-2"></i> Lead Pipeline Overview</h6>
                <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="btn btn-sm btn-light border rounded-pill fs-7">Pipeline</a>
            </div>
            <div class="d-flex flex-column gap-2">
                <?php foreach ($lead_stats as $ls): ?>
                    <div class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light border">
                        <div class="d-flex align-items-center gap-2">
                            <span class="rounded-circle d-inline-block" style="width: 12px; height: 12px; background-color: <?php echo htmlspecialchars($ls['color_code']); ?>;"></span>
                            <span class="small fw-semibold text-dark"><?php echo htmlspecialchars($ls['status_name']); ?></span>
                        </div>
                        <span class="badge bg-white text-dark border fw-bold"><?php echo number_format($ls['count']); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- Task & Workload Breakdown Widget -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="font-heading fw-bold mb-0"><i class="bi bi-check2-square text-success me-2"></i> Staff Task Overview</h6>
                <a href="<?php echo BASE_URL; ?>admin/tasks.php" class="btn btn-sm btn-light border rounded-pill fs-7">Tasks</a>
            </div>
            <div class="row g-2 mb-3 text-center">
                <div class="col-4">
                    <div class="p-3 bg-warning-subtle rounded-3 border border-warning">
                        <h4 class="fw-bold text-warning mb-0"><?php echo $task_pending; ?></h4>
                        <small class="text-muted fs-7">Pending</small>
                    </div>
                </div>
                <div class="col-4">
                    <div class="p-3 bg-primary-subtle rounded-3 border border-primary">
                        <h4 class="fw-bold text-primary mb-0"><?php echo $task_in_progress; ?></h4>
                        <small class="text-muted fs-7">In Progress</small>
                    </div>
                </div>
                <div class="col-4">
                    <div class="p-3 bg-success-subtle rounded-3 border border-success">
                        <h4 class="fw-bold text-success mb-0"><?php echo $task_completed; ?></h4>
                        <small class="text-muted fs-7">Completed</small>
                    </div>
                </div>
            </div>
            <div class="p-3 bg-light rounded-3 border">
                <small class="text-muted d-block mb-1"><i class="bi bi-info-circle me-1"></i> Quick Action:</small>
                <a href="<?php echo BASE_URL; ?>admin/tasks.php" class="btn btn-sm btn-primary rounded-pill w-100 fw-bold">Manage Staff Tasks</a>
            </div>
        </div>
    </div>

    <!-- Service Projects Status Tracker Widget -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="font-heading fw-bold mb-0"><i class="bi bi-briefcase text-info me-2"></i> Service Projects Summary</h6>
                <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-sm btn-light border rounded-pill fs-7">Projects</a>
            </div>
            <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-warning-subtle border border-warning">
                    <span class="small fw-bold text-warning"><i class="bi bi-clock me-1"></i> Pending Projects</span>
                    <span class="badge bg-warning text-dark fw-bold"><?php echo $pending_projects; ?></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-primary-subtle border border-primary">
                    <span class="small fw-bold text-primary"><i class="bi bi-arrow-repeat me-1"></i> In Process</span>
                    <span class="badge bg-primary fw-bold"><?php echo $in_process_projects; ?></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-success-subtle border border-success">
                    <span class="small fw-bold text-success"><i class="bi bi-check-circle me-1"></i> Completed</span>
                    <span class="badge bg-success fw-bold"><?php echo $completed_projects; ?></span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- RECENT CRM LEADS AND RECENT PROJECTS TABLES -->
<div class="row g-4">
    <!-- Recent Leads -->
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="font-heading fw-bold mb-0">Recent CRM Leads</h6>
                <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="btn btn-sm btn-outline-primary rounded-pill">View All</a>
            </div>
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Lead ID</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent_leads as $ld): ?>
                            <tr>
                                <td class="fw-bold small"><?php echo htmlspecialchars($ld['lead_code']); ?></td>
                                <td><?php echo htmlspecialchars($ld['name']); ?></td>
                                <td><?php echo htmlspecialchars($ld['mobile']); ?></td>
                                <td>
                                    <span class="badge" style="background-color: <?php echo htmlspecialchars($ld['color_code']); ?>">
                                        <?php echo htmlspecialchars($ld['status_name']); ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="<?php echo BASE_URL; ?>admin/crm_lead_detail.php?id=<?php echo $ld['id']; ?>" class="btn btn-sm btn-light">
                                        <i class="bi bi-eye"></i> 360°
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Recent Service Projects -->
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="font-heading fw-bold mb-0">Recent Service Projects</h6>
                <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-sm btn-outline-primary rounded-pill">View All</a>
            </div>
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Code</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Stage</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent_projects as $pj): ?>
                            <tr>
                                <td class="fw-bold small text-primary"><?php echo htmlspecialchars($pj['case_code']); ?></td>
                                <td><?php echo htmlspecialchars($pj['customer_name']); ?></td>
                                <td><small><?php echo htmlspecialchars($pj['service_name']); ?></small></td>
                                <td><span class="badge bg-info-subtle text-info-emphasis"><?php echo htmlspecialchars($pj['current_stage'] ?: 'Application Received'); ?></span></td>
                                <td>
                                    <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-sm btn-light">
                                        <i class="bi bi-gear"></i>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
