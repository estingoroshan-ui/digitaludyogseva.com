<?php
$page_title = "Track Application Status | Digital Udyog Seva";
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$code = sanitize($_GET['code'] ?? '');
$case = null;
$loan = null;
$error = '';

if ($code) {
    global $pdo;
    try {
        // Search Cases
        $stmt = $pdo->prepare("
            SELECT c.*, s.name AS service_name, cust.name AS customer_name
            FROM cases c
            LEFT JOIN services s ON c.service_id = s.id
            JOIN customers cust ON c.customer_id = cust.id
            WHERE c.case_code = ?
        ");
        $stmt->execute([$code]);
        $case = $stmt->fetch();

        if (!$case) {
            // Search Loan Applications
            $l_stmt = $pdo->prepare("
                SELECT la.*, ls.scheme_name, cust.name AS customer_name
                FROM loan_applications la
                JOIN loan_schemes ls ON la.scheme_id = ls.id
                JOIN customers cust ON la.customer_id = cust.id
                WHERE la.application_code = ?
            ");
            $l_stmt->execute([$code]);
            $loan = $l_stmt->fetch();
        }

        if (!$case && !$loan) {
            $error = "No application or case found matching code: " . htmlspecialchars($code);
        }
    } catch (Exception $e) {
        $error = "Tracking error: " . $e->getMessage();
    }
}
?>

<!-- HERO BANNER -->
<div class="hero-wrapper py-5">
    <div class="container text-center max-w-700 mx-auto">
        <div class="hero-badge mb-2">Real-Time Case Tracking Engine</div>
        <h1 class="display-5 font-heading fw-bold text-white mb-3">Track Application Status</h1>
        <p class="lead text-secondary mb-4">Immediate status tracking for Business Registrations, Legal Services, GST Filings, and Government Loan Assistance.</p>

        <div class="max-w-600 mx-auto">
            <form action="" method="GET" class="d-flex gap-2">
                <input type="text" name="code" class="form-control form-control-lg rounded-pill px-4" value="<?php echo htmlspecialchars($code); ?>" placeholder="Enter Code (e.g. DUS-2026-1001 or LOAN-2026-XXXXXX)" required>
                <button type="submit" class="dus-btn dus-btn-accent text-nowrap">
                    Track Status <i class="bi bi-search ms-1"></i>
                </button>
            </form>
        </div>
    </div>
</div>

<div class="dus-section">
    <div class="container max-w-800">
        <?php if ($error): ?>
            <div class="alert alert-danger fw-bold text-center p-4 rounded-4 shadow-sm"><?php echo $error; ?></div>
        <?php elseif ($case): ?>
            <div class="bg-white border rounded-4 p-4 p-lg-5 shadow-lg">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <div>
                        <span class="badge bg-primary px-3 py-2 rounded-pill fw-bold">Service Case</span>
                        <h3 class="font-heading fw-bold mb-0 mt-2"><?php echo htmlspecialchars($case['service_name'] ?: 'Legal Service Case'); ?></h3>
                        <small class="text-muted">Case ID: <?php echo htmlspecialchars($case['case_code']); ?></small>
                    </div>
                    <span class="badge bg-success fs-6 px-3 py-2 rounded-pill"><?php echo htmlspecialchars($case['current_stage']); ?></span>
                </div>

                <h5 class="fw-bold mb-4">Application Progress Timeline</h5>
                <div class="tracking-timeline">
                    <div class="tracking-step done">
                        <div class="tracking-icon"><i class="bi bi-check-lg"></i></div>
                        <div class="small fw-bold text-dark">Applied</div>
                    </div>
                    <div class="tracking-step done">
                        <div class="tracking-icon"><i class="bi bi-check-lg"></i></div>
                        <div class="small fw-bold text-dark">KYC Docs</div>
                    </div>
                    <div class="tracking-step active">
                        <div class="tracking-icon"><i class="bi bi-gear-wide-connected"></i></div>
                        <div class="small fw-bold text-primary">Processing</div>
                    </div>
                    <div class="tracking-step">
                        <div class="tracking-icon"><i class="bi bi-award"></i></div>
                        <div class="small text-muted">Completed</div>
                    </div>
                </div>

                <div class="bg-light p-4 rounded-3 border">
                    <div class="row">
                        <div class="col-md-6">
                            <strong class="d-block text-secondary small">Customer Name:</strong>
                            <span class="fw-bold text-dark"><?php echo htmlspecialchars($case['customer_name']); ?></span>
                        </div>
                        <div class="col-md-6 mt-2 mt-md-0">
                            <strong class="d-block text-secondary small">Current Department:</strong>
                            <span class="fw-bold text-dark"><?php echo htmlspecialchars($case['department']); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        <?php elseif ($loan): ?>
            <div class="bg-white border rounded-4 p-4 p-lg-5 shadow-lg">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <div>
                        <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">Government Loan Application</span>
                        <h3 class="font-heading fw-bold mb-0 mt-2"><?php echo htmlspecialchars($loan['scheme_name']); ?></h3>
                        <small class="text-muted">App ID: <?php echo htmlspecialchars($loan['application_code']); ?></small>
                    </div>
                    <span class="badge bg-info text-dark fs-6 px-3 py-2 rounded-pill"><?php echo htmlspecialchars($loan['status_stage']); ?></span>
                </div>

                <h5 class="fw-bold mb-4">Loan Workflow Timeline</h5>
                <div class="tracking-timeline">
                    <div class="tracking-step done">
                        <div class="tracking-icon"><i class="bi bi-check-lg"></i></div>
                        <div class="small fw-bold text-dark">Submitted</div>
                    </div>
                    <div class="tracking-step done">
                        <div class="tracking-icon"><i class="bi bi-check-lg"></i></div>
                        <div class="small fw-bold text-dark">Credit Eval</div>
                    </div>
                    <div class="tracking-step active">
                        <div class="tracking-icon"><i class="bi bi-shield-check"></i></div>
                        <div class="small fw-bold text-primary">Scorecard Advisory</div>
                    </div>
                    <div class="tracking-step">
                        <div class="tracking-icon"><i class="bi bi-bank"></i></div>
                        <div class="small text-muted">Bank Submission</div>
                    </div>
                </div>

                <div class="bg-light p-4 rounded-3 border">
                    <div class="row">
                        <div class="col-md-6">
                            <strong class="d-block text-secondary small">Required Amount:</strong>
                            <span class="fw-bold text-dark"><?php echo format_inr($loan['required_amount']); ?></span>
                        </div>
                        <div class="col-md-6 mt-2 mt-md-0">
                            <strong class="d-block text-secondary small">Scorecard Status:</strong>
                            <span class="fw-bold text-success"><?php echo $loan['scorecard_unlocked'] ? 'Scorecard Unlocked & Verified' : 'Advisory Fee Pending'; ?></span>
                        </div>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <div class="text-center text-muted py-5">
                <i class="bi bi-search display-1 text-secondary opacity-50 d-block mb-3"></i>
                <h5>Enter your Application or Case ID above to track status.</h5>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
