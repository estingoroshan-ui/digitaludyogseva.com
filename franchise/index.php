<?php
$page_title = "Franchise Enterprise Dashboard | Digital Udyog Seva";
$active_menu = "dashboard";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

// Fetch Real KPI Statistics from Database for this Franchise
$fr_id = $franchise_profile['id'] ?? 0;

// Business Stats
$total_customers = $pdo->prepare("SELECT COUNT(*) FROM customers WHERE user_id IN (SELECT id FROM users WHERE user_type = 'customer')");
$total_customers->execute();
$cust_count = $total_customers->fetchColumn();

$active_cases = $pdo->prepare("SELECT COUNT(*) FROM cases WHERE franchise_id = ? AND status = 'active'");
$active_cases->execute([$fr_id]);
$case_count = $active_cases->fetchColumn();

$loan_apps = $pdo->prepare("SELECT COUNT(*) FROM loan_applications WHERE franchise_id = ?");
$loan_apps->execute([$fr_id]);
$loan_count = $loan_apps->fetchColumn();

// Finance & Commission Stats
$wallet_bal = (float)($franchise_profile['wallet_balance'] ?? 0);

$total_comm_stmt = $pdo->prepare("SELECT SUM(commission_amount) FROM commission_transactions WHERE franchise_id = ?");
$total_comm_stmt->execute([$fr_id]);
$total_comm = (float)($total_comm_stmt->fetchColumn() ?: 0);

$pending_comm_stmt = $pdo->prepare("SELECT SUM(commission_amount) FROM commission_transactions WHERE franchise_id = ? AND status = 'pending'");
$pending_comm_stmt->execute([$fr_id]);
$pending_comm = (float)($pending_comm_stmt->fetchColumn() ?: 0);

$approved_comm_stmt = $pdo->prepare("SELECT SUM(commission_amount) FROM commission_transactions WHERE franchise_id = ? AND status = 'approved'");
$approved_comm_stmt->execute([$fr_id]);
$approved_comm = (float)($approved_comm_stmt->fetchColumn() ?: 0);

$total_withdrawn_stmt = $pdo->prepare("SELECT SUM(amount) FROM commission_withdrawals WHERE franchise_id = ? AND status = 'paid'");
$total_withdrawn_stmt->execute([$fr_id]);
$total_withdrawn = (float)($total_withdrawn_stmt->fetchColumn() ?: 0);

// Follow-ups & Documents Stats
$flw_today = $pdo->prepare("SELECT COUNT(*) FROM followups f JOIN customers c ON f.lead_id = c.lead_id WHERE f.followup_date = CURDATE() AND f.status = 'pending'");
$flw_today->execute();
$today_flw_count = $flw_today->fetchColumn();

$flw_overdue = $pdo->prepare("SELECT COUNT(*) FROM followups f JOIN customers c ON f.lead_id = c.lead_id WHERE f.followup_date < CURDATE() AND f.status = 'pending'");
$flw_overdue->execute();
$overdue_flw_count = $flw_overdue->fetchColumn();

$pending_docs = $pdo->prepare("SELECT COUNT(*) FROM documents WHERE status = 'pending'");
$pending_docs->execute();
$docs_pending_count = $pending_docs->fetchColumn();

// Fetch Today's Work List
$todays_work = $pdo->query("
    SELECT f.*, c.name AS customer_name, c.mobile
    FROM followups f
    JOIN leads l ON f.lead_id = l.id
    LEFT JOIN customers c ON l.id = c.lead_id
    WHERE f.followup_date <= CURDATE() AND f.status = 'pending'
    ORDER BY f.followup_date ASC, f.followup_time ASC
    LIMIT 5
")->fetchAll();

// Fetch Recent Customers
$recent_customers = $pdo->query("
    SELECT * FROM customers ORDER BY id DESC LIMIT 5
")->fetchAll();

// Fetch Favorite Services
$fav_services = $pdo->query("
    SELECT * FROM services WHERE id IN (1, 2, 8, 5, 17) AND status = 'active'
")->fetchAll();
?>

<!-- WELCOME BANNER SECTION -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white mb-4 position-relative overflow-hidden">
    <div class="position-absolute end-0 bottom-0 opacity-10 me-4 mb-3">
        <i class="bi bi-building-check display-1"></i>
    </div>
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 position-relative z-1">
        <div>
            <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-warning text-dark font-monospace fw-bold px-3 py-1 rounded-pill">
                    <?php echo htmlspecialchars($franchise_profile['franchise_code'] ?? 'FR-2026-000001'); ?>
                </span>
                <span class="badge bg-success px-3 py-1 rounded-pill">Status: Approved Partner</span>
            </div>
            <h2 class="font-heading fw-bold mb-1">
                Welcome, <?php echo htmlspecialchars($franchise_profile['business_name'] ?? 'Jaipur Franchise Partner'); ?>
            </h2>
            <p class="text-secondary small mb-0">
                <i class="bi bi-geo-alt text-warning me-1"></i> <?php echo htmlspecialchars($franchise_profile['city'] . ', ' . $franchise_profile['state']); ?>
                <span class="mx-2">|</span>
                <i class="bi bi-person-badge text-warning me-1"></i> Account Manager: Jaipur Regional Command Desk
            </p>
        </div>

        <div class="d-flex gap-2">
            <a href="<?php echo BASE_URL; ?>franchise/customer_add.php" class="btn btn-warning btn-lg fw-bold rounded-pill text-dark px-4 shadow">
                <i class="bi bi-person-plus-fill me-1"></i> + Add Customer
            </a>
            <a href="<?php echo BASE_URL; ?>franchise/new_application.php" class="btn btn-outline-light btn-lg fw-bold rounded-pill px-4">
                <i class="bi bi-lightning-charge-fill me-1"></i> + New Application
            </a>
        </div>
    </div>
</div>

<!-- REAL DATABASE KPI CARDS -->
<div class="row g-3 mb-4">
    <!-- BUSINESS METRICS -->
    <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small class="text-muted text-uppercase fw-bold fs-7">Total Customers</small>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <h3 class="fw-bold text-dark mb-0"><?php echo $cust_count; ?></h3>
                <span class="badge bg-primary-subtle text-primary rounded-circle p-2"><i class="bi bi-people fs-4"></i></span>
            </div>
            <small class="text-success fw-bold fs-7 mt-2 d-block"><i class="bi bi-arrow-up-right me-1"></i> Active Database</small>
        </div>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small class="text-muted text-uppercase fw-bold fs-7">Active Service Cases</small>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <h3 class="fw-bold text-primary mb-0"><?php echo $case_count; ?></h3>
                <span class="badge bg-info-subtle text-info rounded-circle p-2"><i class="bi bi-briefcase fs-4"></i></span>
            </div>
            <small class="text-muted fs-7 mt-2 d-block">In Processing</small>
        </div>
    </div>

    <!-- FINANCE METRICS -->
    <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning">
            <small class="text-warning-emphasis text-uppercase fw-bold fs-7">Available Wallet</small>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <h3 class="fw-bold text-dark mb-0"><?php echo format_inr($wallet_bal); ?></h3>
                <span class="badge bg-warning-subtle text-warning rounded-circle p-2"><i class="bi bi-wallet2 fs-4"></i></span>
            </div>
            <small class="text-muted fs-7 mt-2 d-block">Ready to Withdraw</small>
        </div>
    </div>

    <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
            <small class="text-success text-uppercase fw-bold fs-7">Total Commission Earned</small>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <h3 class="fw-bold text-success mb-0"><?php echo format_inr($total_comm); ?></h3>
                <span class="badge bg-success-subtle text-success rounded-circle p-2"><i class="bi bi-cash-stack fs-4"></i></span>
            </div>
            <small class="text-muted fs-7 mt-2 d-block">Approved Ledger Total</small>
        </div>
    </div>
</div>

<!-- FREQUENTLY USED SERVICES SHORTCUTS -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="font-heading fw-bold mb-0"><i class="bi bi-star-fill text-warning me-2"></i> Frequently Used Services (Fast Launch)</h5>
        <a href="service_catalog.php" class="text-primary text-decoration-none small fw-bold">View All 14 Categories <i class="bi bi-arrow-right"></i></a>
    </div>

    <div class="row g-3">
        <?php foreach ($fav_services as $fsrv): ?>
            <div class="col-xl-2 col-md-4 col-6">
                <a href="new_application.php?service_id=<?php echo $fsrv['id']; ?>" class="text-decoration-none">
                    <div class="card border shadow-none rounded-4 p-3 text-center bg-light hover-shadow transition">
                        <i class="bi <?php echo htmlspecialchars($fsrv['icon'] ?: 'bi-gear'); ?> fs-2 text-primary mb-2"></i>
                        <h6 class="fw-bold text-dark small mb-1"><?php echo htmlspecialchars($fsrv['name']); ?></h6>
                        <small class="text-success fw-bold">Earn ₹<?php echo format_inr($fsrv['franchise_commission_value']); ?></small>
                    </div>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- TODAY'S WORK ACTION CENTER & RECENT CUSTOMERS -->
<div class="row g-4 mb-4">
    <!-- TODAY'S WORK LIST -->
    <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="font-heading fw-bold mb-0"><i class="bi bi-calendar-check text-primary me-2"></i> Today's Work & Client Follow-ups</h5>
                <a href="followups.php" class="text-primary text-decoration-none small fw-bold">View All</a>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light fs-7 text-uppercase">
                        <tr>
                            <th>Customer</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th class="text-end">Quick Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($todays_work)): ?>
                            <tr><td colspan="4" class="text-center text-muted py-4">No follow-ups pending for today. Great job!</td></tr>
                        <?php else: ?>
                            <?php foreach ($todays_work as $tw): ?>
                                <tr>
                                    <td>
                                        <strong class="d-block text-dark"><?php echo htmlspecialchars($tw['customer_name'] ?: 'Client'); ?></strong>
                                        <small class="text-muted"><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($tw['mobile']); ?></small>
                                    </td>
                                    <td class="fw-bold text-primary"><?php echo date('h:i A', strtotime($tw['followup_time'])); ?></td>
                                    <td><span class="badge bg-warning text-dark fs-7">Pending</span></td>
                                    <td class="text-end">
                                        <div class="d-inline-flex gap-1">
                                            <a href="tel:<?php echo htmlspecialchars($tw['mobile']); ?>" class="btn btn-sm btn-success rounded-circle p-1" title="Call"><i class="bi bi-telephone-fill px-1"></i></a>
                                            <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $tw['mobile']); ?>" target="_blank" class="btn btn-sm btn-outline-success rounded-circle p-1" title="WhatsApp"><i class="bi bi-whatsapp px-1"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- RECENT CUSTOMERS DIRECTORY -->
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="font-heading fw-bold mb-0"><i class="bi bi-people text-primary me-2"></i> Recent Customers</h5>
                <a href="customers.php" class="text-primary text-decoration-none small fw-bold">All Customers</a>
            </div>

            <div class="vstack gap-2">
                <?php if (empty($recent_customers)): ?>
                    <p class="text-muted small">No customers added yet.</p>
                <?php else: ?>
                    <?php foreach ($recent_customers as $rc): ?>
                        <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="fw-bold text-dark mb-0">
                                    <a href="customer_detail.php?id=<?php echo $rc['id']; ?>" class="text-dark text-decoration-none">
                                        <?php echo htmlspecialchars($rc['name']); ?>
                                    </a>
                                </h6>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($rc['mobile']); ?></small>
                            </div>
                            <a href="customer_detail.php?id=<?php echo $rc['id']; ?>" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                                360° Profile
                            </a>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
