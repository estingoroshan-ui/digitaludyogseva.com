<?php
$page_title = "360° Customer Master Directory";
$active_menu = "customers";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/CustomerManager.php';

global $pdo;

$selected_customer_id = (int)($_GET['id'] ?? 0);
$profile_data = null;

if ($selected_customer_id) {
    $profile_data = CustomerManager::get_360_profile($selected_customer_id);
}

// Fetch all customers list
$customers = $pdo->query("
    SELECT c.*, u.status AS user_status,
           (SELECT COUNT(*) FROM cases WHERE customer_id = c.id) AS case_count,
           (SELECT COUNT(*) FROM loan_applications WHERE customer_id = c.id) AS loan_count
    FROM customers c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.id DESC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Customer Master (360° Unified View)</h4>
        <p class="text-muted small mb-0">Unified customer profile aggregating cases, loans, scorecards, docs & payments.</p>
    </div>
</div>

<?php if ($profile_data && $profile_data['status']): ?>
    <?php $cust = $profile_data['customer']; ?>
    <div class="card border-0 shadow-lg rounded-4 p-4 bg-white mb-5">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
                <a href="<?php echo BASE_URL; ?>admin/customers.php" class="text-muted small text-decoration-none"><i class="bi bi-arrow-left me-1"></i> Back to All Customers</a>
                <h3 class="font-heading fw-bold mb-0 mt-1"><?php echo htmlspecialchars($cust['name']); ?></h3>
                <small class="text-muted">Customer Code: <?php echo htmlspecialchars($cust['customer_code']); ?> | Mobile: <?php echo htmlspecialchars($cust['mobile']); ?></small>
            </div>
            <span class="badge bg-success fs-6 px-3 py-2 rounded-pill">360° Profile Active</span>
        </div>

        <!-- TABS NAV -->
        <ul class="nav nav-pills mb-4 gap-2" id="profileTabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link active rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-overview">Overview & KYC</button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-cases">Service Cases (<?php echo count($profile_data['cases']); ?>)</button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-loans">Loan Apps & Scorecards (<?php echo count($profile_data['loans']); ?>)</button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-docs">Documents (<?php echo count($profile_data['documents']); ?>)</button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-payments">Payments (<?php echo count($profile_data['payments']); ?>)</button>
            </li>
        </ul>

        <!-- TABS CONTENT -->
        <div class="tab-content" id="profileTabsContent">
            <!-- TAB 1: OVERVIEW -->
            <div class="tab-pane fade show active" id="tab-overview">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="bg-light p-4 rounded-4">
                            <h5 class="fw-bold mb-3">Personal KYC Details</h5>
                            <p class="mb-2"><strong>Full Name:</strong> <?php echo htmlspecialchars($cust['name']); ?></p>
                            <p class="mb-2"><strong>Mobile:</strong> <?php echo htmlspecialchars($cust['mobile']); ?></p>
                            <p class="mb-2"><strong>Email:</strong> <?php echo htmlspecialchars($cust['email']); ?></p>
                            <p class="mb-2"><strong>State / District:</strong> <?php echo htmlspecialchars($cust['state'] . ', ' . $cust['district']); ?></p>
                            <p class="mb-0"><strong>Address:</strong> <?php echo htmlspecialchars($cust['address'] ?: 'N/A'); ?></p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="bg-light p-4 rounded-4">
                            <h5 class="fw-bold mb-3">Business Profile</h5>
                            <?php if (!empty($profile_data['business_profiles'])): ?>
                                <?php $bp = $profile_data['business_profiles'][0]; ?>
                                <p class="mb-2"><strong>Business Name:</strong> <?php echo htmlspecialchars($bp['business_name']); ?></p>
                                <p class="mb-2"><strong>Constitution:</strong> <?php echo htmlspecialchars(strtoupper($bp['constitution'])); ?></p>
                                <p class="mb-2"><strong>Vintage:</strong> <?php echo (int)$bp['vintage_years']; ?> Years</p>
                                <p class="mb-0"><strong>GSTIN / Udyam:</strong> <?php echo htmlspecialchars($bp['gstin'] ?: ($bp['udyam_number'] ?: 'None')); ?></p>
                            <?php else: ?>
                                <p class="text-muted">No business profile record linked yet.</p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 2: SERVICE CASES -->
            <div class="tab-pane fade" id="tab-cases">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Case ID</th>
                                <th>Service Name</th>
                                <th>Stage</th>
                                <th>Amount</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($profile_data['cases'] as $cs): ?>
                                <tr>
                                    <td class="fw-bold"><?php echo htmlspecialchars($cs['case_code']); ?></td>
                                    <td><?php echo htmlspecialchars($cs['service_name'] ?: 'General Case'); ?></td>
                                    <td><span class="badge bg-primary"><?php echo htmlspecialchars($cs['current_stage']); ?></span></td>
                                    <td class="fw-bold"><?php echo format_inr($cs['total_amount']); ?></td>
                                    <td><span class="badge bg-success"><?php echo htmlspecialchars($cs['payment_status']); ?></span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: LOAN APPS -->
            <div class="tab-pane fade" id="tab-loans">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>App Code</th>
                                <th>Scheme Name</th>
                                <th>Required Loan</th>
                                <th>Scorecard</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($profile_data['loans'] as $ln): ?>
                                <tr>
                                    <td class="fw-bold"><?php echo htmlspecialchars($ln['application_code']); ?></td>
                                    <td><?php echo htmlspecialchars($ln['scheme_name']); ?></td>
                                    <td class="fw-bold"><?php echo format_inr($ln['required_amount']); ?></td>
                                    <td>
                                        <span class="badge bg-info text-dark fw-bold">
                                            Score: <?php echo $ln['total_score'] ?: 'N/A'; ?> (<?php echo htmlspecialchars($ln['result_category'] ?: 'Pending'); ?>)
                                        </span>
                                    </td>
                                    <td><span class="badge bg-warning text-dark"><?php echo htmlspecialchars($ln['status_stage']); ?></span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 4: DOCUMENTS -->
            <div class="tab-pane fade" id="tab-docs">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>File Name</th>
                                <th>Uploaded Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($profile_data['documents'] as $dc): ?>
                                <tr>
                                    <td><i class="bi bi-file-earmark-text me-2"></i> <?php echo htmlspecialchars($dc['file_name']); ?></td>
                                    <td><?php echo date('d M Y', strtotime($dc['created_at'])); ?></td>
                                    <td><span class="badge bg-success"><?php echo htmlspecialchars($dc['verification_status']); ?></span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 5: PAYMENTS -->
            <div class="tab-pane fade" id="tab-payments">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Payment Code</th>
                                <th>Mode</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($profile_data['payments'] as $py): ?>
                                <tr>
                                    <td class="fw-bold"><?php echo htmlspecialchars($py['payment_code']); ?></td>
                                    <td><?php echo htmlspecialchars($py['payment_mode']); ?></td>
                                    <td class="fw-bold text-success"><?php echo format_inr($py['amount']); ?></td>
                                    <td><span class="badge bg-success"><?php echo htmlspecialchars($py['status']); ?></span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>

<!-- CUSTOMERS LIST TABLE -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <h5 class="font-heading fw-bold mb-3">All Customer Directory</h5>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>State/District</th>
                    <th>Cases</th>
                    <th>Loans</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($customers as $c): ?>
                    <tr>
                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($c['customer_code']); ?></td>
                        <td class="fw-bold"><?php echo htmlspecialchars($c['name']); ?></td>
                        <td><?php echo htmlspecialchars($c['mobile']); ?></td>
                        <td><?php echo htmlspecialchars($c['state'] . ', ' . $c['district']); ?></td>
                        <td><span class="badge bg-secondary"><?php echo $c['case_count']; ?></span></td>
                        <td><span class="badge bg-warning text-dark"><?php echo $c['loan_count']; ?></span></td>
                        <td>
                            <a href="<?php echo BASE_URL; ?>admin/customers.php?id=<?php echo $c['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-3">
                                <i class="bi bi-eye"></i> View 360°
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
