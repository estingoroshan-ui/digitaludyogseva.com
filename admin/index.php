<?php
$page_title = "Command Center Dashboard";
$active_menu = "dashboard";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;

// KPI Query Aggregations
$total_leads = $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
$new_leads_today = $pdo->query("SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURDATE()")->fetchColumn();
$total_customers = $pdo->query("SELECT COUNT(*) FROM customers")->fetchColumn();
$total_cases = $pdo->query("SELECT COUNT(*) FROM cases")->fetchColumn();
$total_loans = $pdo->query("SELECT COUNT(*) FROM loan_applications")->fetchColumn();
$pending_offline_payments = $pdo->query("SELECT COUNT(*) FROM offline_payments WHERE verification_status = 'pending'")->fetchColumn();
$total_franchises = $pdo->query("SELECT COUNT(*) FROM franchises WHERE status = 'approved'")->fetchColumn();
$total_revenue = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'verified'")->fetchColumn();

// Service Projects KPI Aggregations (Pending, In Process, Completed)
$total_projects = $pdo->query("SELECT COUNT(*) FROM cases")->fetchColumn();
$pending_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'on_hold'")->fetchColumn();
$in_process_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'active'")->fetchColumn();
$completed_projects = $pdo->query("SELECT COUNT(*) FROM cases WHERE status = 'completed'")->fetchColumn();

// Fetch Recent Leads
$recent_leads = $pdo->query("
    SELECT l.*, ls.status_name, ls.color_code
    FROM leads l
    JOIN lead_statuses ls ON l.status_id = ls.id
    ORDER BY l.id DESC LIMIT 5
")->fetchAll();

// Fetch Recent Loan Applications
$recent_loans = $pdo->query("
    SELECT la.*, c.name AS customer_name, ls.scheme_name
    FROM loan_applications la
    JOIN customers c ON la.customer_id = c.id
    JOIN loan_schemes ls ON la.scheme_id = ls.id
    ORDER BY la.id DESC LIMIT 5
")->fetchAll();

// Fetch Recent Service Projects
$recent_projects = $pdo->query("
    SELECT c.*, cust.name AS customer_name, COALESCE(s.name, 'Service Case Project') AS service_name
    FROM cases c
    JOIN customers cust ON c.customer_id = cust.id
    LEFT JOIN services s ON c.service_id = s.id
    ORDER BY c.id DESC LIMIT 5
")->fetchAll();
?>

<!-- KPI CARDS GRID -->
<div class="row g-3 mb-4">
    <div class="col-xl-3 col-md-6">
        <div class="stat-card">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted text-uppercase fw-bold">Total Leads</small>
                    <h3 class="fw-bold my-1"><?php echo number_format($total_leads); ?></h3>
                    <small class="text-success fw-bold">+<?php echo $new_leads_today; ?> Today</small>
                </div>
                <div class="stat-icon bg-primary-subtle text-primary">
                    <i class="bi bi-funnel"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="stat-card">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted text-uppercase fw-bold">Converted Customers</small>
                    <h3 class="fw-bold my-1"><?php echo number_format($total_customers); ?></h3>
                    <small class="text-muted">360° Profile Linked</small>
                </div>
                <div class="stat-icon bg-success-subtle text-success">
                    <i class="bi bi-people"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- DEDICATED SERVICE PROJECTS KPI CARD -->
    <div class="col-xl-3 col-md-6">
        <a href="<?php echo BASE_URL; ?>admin/projects.php" class="text-decoration-none">
            <div class="stat-card border-start border-4 border-info">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <div>
                        <small class="text-muted text-uppercase fw-bold">Service Projects</small>
                        <h3 class="fw-bold my-1 text-dark"><?php echo number_format($total_projects); ?></h3>
                    </div>
                    <div class="stat-icon bg-info-subtle text-info">
                        <i class="bi bi-briefcase-fill"></i>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-wrap mt-1">
                    <span class="badge bg-warning text-dark"><i class="bi bi-clock me-1"></i><?php echo $pending_projects; ?> Pending</span>
                    <span class="badge bg-primary"><i class="bi bi-arrow-repeat me-1"></i><?php echo $in_process_projects; ?> In Process</span>
                    <span class="badge bg-success"><i class="bi bi-check-circle me-1"></i><?php echo $completed_projects; ?> Done</span>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="stat-card">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted text-uppercase fw-bold">Loan Applications</small>
                    <h3 class="fw-bold my-1"><?php echo number_format($total_loans); ?></h3>
                    <small class="text-primary fw-bold">Scorecard Engine Active</small>
                </div>
                <div class="stat-icon bg-warning-subtle text-warning">
                    <i class="bi bi-bank"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- RECENT SERVICE PROJECTS LIVE STATUS SECTION -->
<div class="row g-4 mb-4">
    <div class="col-12">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h5 class="font-heading fw-bold mb-0"><i class="bi bi-briefcase-fill text-primary me-2"></i> Service Projects Status Tracker</h5>
                    <small class="text-muted">Monitor orders by status: Pending, In Process, and Completed</small>
                </div>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <a href="<?php echo BASE_URL; ?>admin/projects.php?status=on_hold" class="badge bg-warning text-dark text-decoration-none px-3 py-2 rounded-pill">
                        <i class="bi bi-clock me-1"></i> Pending: <strong><?php echo $pending_projects; ?></strong>
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/projects.php?status=active" class="badge bg-primary text-decoration-none px-3 py-2 rounded-pill">
                        <i class="bi bi-arrow-repeat me-1"></i> In Process: <strong><?php echo $in_process_projects; ?></strong>
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/projects.php?status=completed" class="badge bg-success text-decoration-none px-3 py-2 rounded-pill">
                        <i class="bi bi-check-lg me-1"></i> Completed: <strong><?php echo $completed_projects; ?></strong>
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-sm btn-outline-primary rounded-pill ms-2">
                        View All Projects <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table align-middle table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Project Code</th>
                            <th>Customer Name</th>
                            <th>Service Name</th>
                            <th>Current Stage</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($recent_projects)): ?>
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">No service projects found.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($recent_projects as $pj): ?>
                                <tr>
                                    <td class="fw-bold text-primary"><?php echo htmlspecialchars($pj['case_code']); ?></td>
                                    <td class="fw-bold"><?php echo htmlspecialchars($pj['customer_name']); ?></td>
                                    <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($pj['service_name']); ?></span></td>
                                    <td>
                                        <span class="badge bg-info-subtle text-info-emphasis">
                                            <i class="bi bi-diagram-2 me-1"></i><?php echo htmlspecialchars($pj['current_stage'] ?: 'Application Received'); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?php 
                                        $p_cls = 'bg-secondary';
                                        if ($pj['priority'] === 'high') $p_cls = 'bg-danger';
                                        elseif ($pj['priority'] === 'urgent') $p_cls = 'bg-dark';
                                        elseif ($pj['priority'] === 'medium') $p_cls = 'bg-warning text-dark';
                                        ?>
                                        <span class="badge <?php echo $p_cls; ?>"><?php echo htmlspecialchars(ucfirst($pj['priority'])); ?></span>
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
                                        <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-sm btn-light border rounded-pill px-3">
                                            <i class="bi bi-gear-fill me-1"></i> Manage
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- RECENT CRM LEADS AND RECENT BUSINESS LOANS TABLES -->
<div class="row g-4">
    <!-- Recent Leads -->
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="font-heading fw-bold mb-0">Recent CRM Leads</h5>
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

    <!-- Recent Government Loans -->
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="font-heading fw-bold mb-0">Recent Business Loans</h5>
                <a href="<?php echo BASE_URL; ?>admin/loan_applications.php" class="btn btn-sm btn-outline-primary rounded-pill">View All</a>
            </div>
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>App Code</th>
                            <th>Applicant</th>
                            <th>Scheme</th>
                            <th>Amount</th>
                            <th>Stage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent_loans as $ln): ?>
                            <tr>
                                <td class="fw-bold small"><?php echo htmlspecialchars($ln['application_code']); ?></td>
                                <td><?php echo htmlspecialchars($ln['customer_name']); ?></td>
                                <td><small><?php echo htmlspecialchars($ln['scheme_name']); ?></small></td>
                                <td class="fw-bold"><?php echo format_inr($ln['required_amount']); ?></td>
                                <td><span class="badge bg-warning text-dark"><?php echo htmlspecialchars($ln['status_stage']); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
