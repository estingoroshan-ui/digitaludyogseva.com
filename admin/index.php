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

    <div class="col-xl-3 col-md-6">
        <div class="stat-card">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted text-uppercase fw-bold">Verified Revenue</small>
                    <h3 class="fw-bold my-1"><?php echo format_inr($total_revenue); ?></h3>
                    <small class="text-danger fw-bold"><?php echo $pending_offline_payments; ?> Offline Pending</small>
                </div>
                <div class="stat-icon bg-info-subtle text-info">
                    <i class="bi bi-currency-rupee"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- RECENT ACTIVITY TABLES -->
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
