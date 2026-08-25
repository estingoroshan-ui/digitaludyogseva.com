<?php
$page_title = "My Dashboard | Customer Portal";
$active_menu = "dashboard";
require_once __DIR__ . '/includes/customer_header.php';
require_once __DIR__ . '/../classes/CustomerManager.php';

$cust_id = $customer_profile['id'] ?? 0;
$profile_data = CustomerManager::get_360_profile($cust_id);
?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
            <h3 class="font-heading fw-bold mb-1">Welcome back, <?php echo htmlspecialchars($current_user['name']); ?>!</h3>
            <p class="text-muted small mb-0">Customer ID: <strong class="text-primary"><?php echo htmlspecialchars($customer_profile['customer_code'] ?? 'N/A'); ?></strong> | Mobile: <?php echo htmlspecialchars($current_user['mobile']); ?></p>
        </div>
        <a href="<?php echo BASE_URL; ?>customer/documents.php" class="btn btn-warning fw-bold rounded-pill px-4 text-dark shadow-sm">
            <i class="bi bi-cloud-arrow-up me-1"></i> Upload Pending Documents
        </a>
    </div>
</div>

<div class="row g-4">
    <!-- Active Loan Applications & Scorecard -->
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold mb-3"><i class="bi bi-bank text-warning me-2"></i> Government Business Loans</h5>
            <?php if (empty($profile_data['loans'])): ?>
                <p class="text-muted small my-3">No active government business loan applications found.</p>
                <a href="<?php echo BASE_URL; ?>loan.php" class="btn btn-sm btn-outline-primary rounded-pill fw-bold">Apply Government Loan</a>
            <?php else: ?>
                <div class="d-flex flex-column gap-3">
                    <?php foreach ($profile_data['loans'] as $ln): ?>
                        <div class="p-3 bg-light rounded-3 border">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="fw-bold text-dark"><?php echo htmlspecialchars($ln['scheme_name']); ?></span>
                                <span class="badge bg-warning text-dark"><?php echo htmlspecialchars($ln['status_stage']); ?></span>
                            </div>
                            <p class="small text-muted mb-2">Requested Amount: <strong class="text-dark"><?php echo format_inr($ln['required_amount']); ?></strong></p>
                            
                            <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <small class="text-muted d-block">Advisory Score:</small>
                                    <span class="badge bg-info text-dark fw-bold"><?php echo $ln['total_score'] ?: 'N/A'; ?> / 100</span>
                                </div>
                                <a href="<?php echo BASE_URL; ?>customer/scorecard.php?app_id=<?php echo $ln['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-3 fw-bold">
                                    <i class="bi bi-award me-1"></i> View Scorecard
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Active Service Cases -->
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold mb-3"><i class="bi bi-briefcase text-primary me-2"></i> Active Service Cases</h5>
            <?php if (empty($profile_data['cases'])): ?>
                <p class="text-muted small my-3">No active service registrations or compliance cases.</p>
                <a href="<?php echo BASE_URL; ?>" class="btn btn-sm btn-outline-primary rounded-pill fw-bold">Explore Legal Services</a>
            <?php else: ?>
                <div class="d-flex flex-column gap-3">
                    <?php foreach ($profile_data['cases'] as $cs): ?>
                        <div class="p-3 bg-light rounded-3 border">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="fw-bold text-dark"><?php echo htmlspecialchars($cs['service_name'] ?: 'Service Case'); ?></span>
                                <span class="badge bg-primary"><?php echo htmlspecialchars($cs['current_stage']); ?></span>
                            </div>
                            <p class="small text-muted mb-2">Case ID: <strong><?php echo htmlspecialchars($cs['case_code']); ?></strong></p>
                            <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                                <span class="small fw-bold text-success">Fee: <?php echo format_inr($cs['total_amount']); ?></span>
                                <a href="<?php echo BASE_URL; ?>track.php?code=<?php echo $cs['case_code']; ?>" class="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                    Track Progress <i class="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/customer_footer.php'; ?>
