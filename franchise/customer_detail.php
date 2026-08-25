<?php
$page_title = "Franchise Customer 360° Profile";
$active_menu = "customers";
require_once __DIR__ . '/includes/franchise_header.php';

$cust_id = (int)($_GET['id'] ?? 0);
$active_tab = $_GET['tab'] ?? 'overview';
global $pdo;

$stmt = $pdo->prepare("SELECT c.*, u.email AS user_email FROM customers c JOIN users u ON c.user_id = u.id WHERE c.id = ?");
$stmt->execute([$cust_id]);
$cust = $stmt->fetch();

if (!$cust) {
    echo '<div class="alert alert-danger fw-bold m-4">Customer profile not found.</div>';
    require_once __DIR__ . '/includes/franchise_footer.php';
    exit;
}

// Fetch Business Profile
$bp_stmt = $pdo->prepare("SELECT * FROM customer_business_profiles WHERE customer_id = ?");
$bp_stmt->execute([$cust_id]);
$bp = $bp_stmt->fetch();

// Fetch Cases & Services
$cases_stmt = $pdo->prepare("SELECT ca.*, s.name AS service_name FROM cases ca LEFT JOIN services s ON ca.service_id = s.id WHERE ca.customer_id = ?");
$cases_stmt->execute([$cust_id]);
$cases = $cases_stmt->fetchAll();

// Fetch Loan Applications
$loan_stmt = $pdo->prepare("SELECT la.*, ls.scheme_name FROM loan_applications la JOIN loan_schemes ls ON la.scheme_id = ls.id WHERE la.customer_id = ?");
$loan_stmt->execute([$cust_id]);
$loans = $loan_stmt->fetchAll();

// Fetch Documents
$doc_stmt = $pdo->prepare("SELECT * FROM documents WHERE customer_id = ?");
$doc_stmt->execute([$cust_id]);
$docs = $doc_stmt->fetchAll();
?>

<!-- FIXED TOP SUMMARY BAR -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
            <a href="customers.php" class="btn btn-light border rounded-circle p-2" title="Back to Customers">
                <i class="bi bi-arrow-left"></i>
            </a>
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h3 class="font-heading fw-bold mb-0"><?php echo htmlspecialchars($cust['name']); ?></h3>
                    <span class="badge bg-light text-dark border font-monospace"><?php echo htmlspecialchars($cust['customer_code']); ?></span>
                    <span class="badge bg-success">Verified Customer</span>
                </div>
                <div class="text-secondary small d-flex gap-3 align-items-center flex-wrap">
                    <span><i class="bi bi-telephone text-primary me-1"></i> <?php echo htmlspecialchars($cust['mobile']); ?></span>
                    <span><i class="bi bi-building text-primary me-1"></i> <?php echo htmlspecialchars($bp['business_name'] ?? 'Individual'); ?></span>
                    <span><i class="bi bi-geo-alt text-primary me-1"></i> <?php echo htmlspecialchars($cust['city'] . ', ' . $cust['state']); ?></span>
                </div>
            </div>
        </div>

        <div class="d-flex align-items-center gap-2 flex-wrap">
            <a href="tel:<?php echo htmlspecialchars($cust['mobile']); ?>" class="btn btn-success rounded-pill px-3 fw-bold">
                <i class="bi bi-telephone-fill me-1"></i> Call
            </a>
            <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $cust['mobile']); ?>" target="_blank" class="btn btn-outline-success rounded-pill px-3 fw-bold">
                <i class="bi bi-whatsapp me-1"></i> WhatsApp
            </a>
            <a href="new_application.php?customer_id=<?php echo $cust_id; ?>" class="btn btn-warning rounded-pill px-3 fw-bold text-dark shadow">
                <i class="bi bi-plus-circle-fill me-1"></i> + Add Service
            </a>
            <a href="payment_collect.php?customer_id=<?php echo $cust_id; ?>" class="btn btn-primary rounded-pill px-3 fw-bold shadow">
                <i class="bi bi-credit-card me-1"></i> Collect Payment
            </a>
        </div>
    </div>
</div>

<!-- WORKSPACE LAYOUT: LEFT MENU + CONTENT -->
<div class="row g-4">
    <div class="col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="nav flex-column nav-pills custom-workspace-nav gap-1">
                <a href="customer_detail.php?id=<?php echo $cust_id; ?>&tab=overview" class="nav-link <?php echo $active_tab === 'overview' ? 'active' : ''; ?>">
                    <i class="bi bi-grid me-2"></i> Overview
                </a>
                <a href="customer_detail.php?id=<?php echo $cust_id; ?>&tab=services" class="nav-link <?php echo $active_tab === 'services' ? 'active' : ''; ?>">
                    <i class="bi bi-briefcase me-2"></i> Active Services (<?php echo count($cases); ?>)
                </a>
                <a href="customer_detail.php?id=<?php echo $cust_id; ?>&tab=loans" class="nav-link <?php echo $active_tab === 'loans' ? 'active' : ''; ?>">
                    <i class="bi bi-bank me-2"></i> Loan Applications (<?php echo count($loans); ?>)
                </a>
                <a href="customer_detail.php?id=<?php echo $cust_id; ?>&tab=documents" class="nav-link <?php echo $active_tab === 'documents' ? 'active' : ''; ?>">
                    <i class="bi bi-file-earmark-check me-2"></i> Documents Vault (<?php echo count($docs); ?>)
                </a>
                <a href="customer_detail.php?id=<?php echo $cust_id; ?>&tab=followups" class="nav-link <?php echo $active_tab === 'followups' ? 'active' : ''; ?>">
                    <i class="bi bi-clock-history me-2"></i> Follow-ups History
                </a>
            </div>
        </div>
    </div>

    <div class="col-lg-9">
        <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white min-vh-50">
            <?php if ($active_tab === 'overview'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4">Customer Master Summary</h5>
                <div class="row g-4 mb-4">
                    <div class="col-md-4">
                        <div class="p-3 bg-light rounded-3">
                            <small class="text-muted text-uppercase fw-bold">Mobile Number</small>
                            <h6 class="fw-bold text-dark mt-1 mb-0"><?php echo htmlspecialchars($cust['mobile']); ?></h6>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 bg-light rounded-3">
                            <small class="text-muted text-uppercase fw-bold">Email Address</small>
                            <h6 class="fw-bold text-dark mt-1 mb-0"><?php echo htmlspecialchars($cust['email'] ?: $cust['user_email']); ?></h6>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 bg-light rounded-3">
                            <small class="text-muted text-uppercase fw-bold">Registered Date</small>
                            <h6 class="fw-bold text-primary mt-1 mb-0"><?php echo date('d M Y', strtotime($cust['created_at'])); ?></h6>
                        </div>
                    </div>
                </div>

                <h6 class="font-heading fw-bold mb-3">Active Services & Applications</h6>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Case ID</th>
                                <th>Service Name</th>
                                <th>Stage</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($cases)): ?>
                                <tr><td colspan="4" class="text-center text-muted py-3">No active service cases yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($cases as $cs): ?>
                                    <tr>
                                        <td><strong class="font-monospace text-primary"><?php echo htmlspecialchars($cs['case_code']); ?></strong></td>
                                        <td class="fw-bold"><?php echo htmlspecialchars($cs['service_name']); ?></td>
                                        <td><span class="badge bg-info text-dark"><?php echo htmlspecialchars($cs['current_stage']); ?></span></td>
                                        <td><span class="badge bg-success"><?php echo ucfirst($cs['payment_status']); ?></span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

            <?php elseif ($active_tab === 'services'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4">Active & Completed Services</h5>
                <div class="vstack gap-3">
                    <?php foreach ($cases as $cs): ?>
                        <div class="p-3 bg-light rounded-3 border-start border-4 border-primary">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="fw-bold text-dark mb-1"><?php echo htmlspecialchars($cs['service_name']); ?></h6>
                                    <small class="text-muted font-monospace">Case Code: <?php echo htmlspecialchars($cs['case_code']); ?></small>
                                </div>
                                <span class="badge bg-primary px-3 py-2 rounded-pill"><?php echo htmlspecialchars($cs['current_stage']); ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

            <?php elseif ($active_tab === 'documents'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4">Uploaded & Required Documents Vault</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Document Type</th>
                                <th>File Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($docs)): ?>
                                <tr><td colspan="4" class="text-center text-muted py-3">No documents uploaded yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($docs as $d): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo htmlspecialchars($d['doc_type']); ?></td>
                                        <td><small><?php echo htmlspecialchars($d['original_name'] ?: 'File'); ?></small></td>
                                        <td><span class="badge bg-success"><?php echo htmlspecialchars($d['status']); ?></span></td>
                                        <td>
                                            <a href="<?php echo BASE_URL . htmlspecialchars($d['file_path']); ?>" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                View Document
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

            <?php else: ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4"><?php echo ucfirst($active_tab); ?></h5>
                <p class="text-muted">Customer data details for <?php echo htmlspecialchars($active_tab); ?>.</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
