<?php
$page_title = "Business Loan Advisory Scorecard | Digital Udyog Seva";
require_once __DIR__ . '/includes/customer_header.php';
require_once __DIR__ . '/../classes/CustomerManager.php';
require_once __DIR__ . '/../classes/PaymentGateway.php';
require_once __DIR__ . '/../includes/scorecard_engine.php';

$app_id = (int)($_GET['app_id'] ?? 0);
global $pdo;

// Fetch Loan App & Scorecard
$stmt = $pdo->prepare("
    SELECT la.*, ls.scheme_name, sc.*, sc.id AS scorecard_record_id, sc.payment_status AS sc_pay_status
    FROM loan_applications la
    JOIN loan_schemes ls ON la.scheme_id = ls.id
    LEFT JOIN scorecards sc ON la.id = sc.loan_application_id
    WHERE la.id = ? AND la.customer_id = ?
");
$stmt->execute([$app_id, $customer_profile['id'] ?? 0]);
$data = $stmt->fetch();

if (!$data) {
    echo '<div class="alert alert-danger fw-bold">Loan application or scorecard record not found.</div>';
    require_once __DIR__ . '/includes/customer_footer.php';
    exit;
}

$msg = '';

// Handle Offline Payment Upload Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit_offline') {
    $pay_res = PaymentGateway::create_payment(
        $customer_profile['id'],
        $data['scorecard_fee'] ?: 499.00,
        'bank_transfer',
        null,
        $app_id,
        $data['scorecard_record_id']
    );

    if ($pay_res['status']) {
        $off_res = PaymentGateway::submit_offline_proof(
            $pay_res['payment_id'],
            $_FILES['proof_file'],
            sanitize($_POST['bank_name'] ?? 'UPI'),
            sanitize($_POST['transaction_id'] ?? ''),
            date('Y-m-d')
        );
        if ($off_res['status']) {
            $msg = '<div class="alert alert-success fw-bold">Offline payment proof submitted successfully! Your scorecard will be unlocked upon Accounts verification.</div>';
            // Refresh data
            $stmt->execute([$app_id, $customer_profile['id'] ?? 0]);
            $data = $stmt->fetch();
        } else {
            $msg = '<div class="alert alert-danger fw-bold">' . htmlspecialchars($off_res['message']) . '</div>';
        }
    }
}

// Calculate/Fetch detailed breakdown
$engine_data = calculate_loan_scorecard($app_id);
$is_unlocked = (bool)($data['scorecard_unlocked'] || ($data['sc_pay_status'] === 'verified'));
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Business Loan Eligibility Scorecard</h4>
        <p class="text-muted small mb-0">Application Code: <strong><?php echo htmlspecialchars($data['application_code']); ?></strong> | Scheme: <?php echo htmlspecialchars($data['scheme_name']); ?></p>
    </div>
</div>

<?php echo $msg; ?>

<?php if (!$is_unlocked): ?>
    <!-- PAYMENT GATE: SCORECARD LOCKED -->
    <div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white max-w-700 mx-auto text-center mb-5">
        <div class="badge bg-warning text-dark p-3 rounded-circle mx-auto mb-3" style="width:70px; height:70px; display:inline-flex; align-items:center; justify-content:center;">
            <i class="bi bi-lock-fill fs-2"></i>
        </div>
        <h3 class="font-heading fw-bold">Unlock Your Business Loan Scorecard</h3>
        <p class="text-muted mb-4">Your preliminary eligibility score has been calculated. Pay nominal advisory fee to view parameter breakdown, consultant remarks, missing documents & downloadable PDF report.</p>

        <div class="bg-light p-4 rounded-4 mb-4 text-start">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-secondary">Advisory Scorecard Fee:</span>
                <span class="fw-bold text-dark fs-5"><?php echo format_inr($data['scorecard_fee'] ?: 499.00); ?></span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold text-secondary">Includes:</span>
                <small class="text-muted">Advisory Report + Bank Scheme Guidance + Consultant Review</small>
            </div>
        </div>

        <div class="row g-4 text-start">
            <!-- Online Razorpay Payment Column -->
            <div class="col-md-6 border-end">
                <h6 class="fw-bold text-primary mb-3"><i class="bi bi-credit-card me-1"></i> Option 1: Instant Online Payment</h6>
                <button type="button" class="btn btn-primary btn-lg w-100 fw-bold rounded-pill" onclick="alert('Razorpay Gateway simulation: Server verification active. Unlocking scorecard.'); window.location.href='<?php echo BASE_URL; ?>admin/payments.php';">
                    Pay <?php echo format_inr($data['scorecard_fee'] ?: 499.00); ?> Online
                </button>
            </div>

            <!-- Offline Bank Transfer / UPI Column -->
            <div class="col-md-6">
                <h6 class="fw-bold text-success mb-3"><i class="bi bi-qr-code-scan me-1"></i> Option 2: UPI / Bank Proof Upload</h6>
                <form action="" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="submit_offline">
                    <div class="mb-2">
                        <input type="text" name="transaction_id" class="form-control form-control-sm" required placeholder="UPI / Bank Txn Ref No.">
                    </div>
                    <div class="mb-2">
                        <input type="file" name="proof_file" class="form-control form-control-sm" required>
                    </div>
                    <button type="submit" class="btn btn-outline-success btn-sm w-100 fw-bold rounded-pill">
                        Submit Receipt for Verification
                    </button>
                </form>
            </div>
        </div>
    </div>
<?php else: ?>

    <!-- SCORECARD UNLOCKED DISPLAY -->
    <div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white mb-5">
        <div class="row align-items-center mb-4">
            <div class="col-md-8">
                <span class="badge bg-success px-3 py-2 rounded-pill fw-bold mb-2"><i class="bi bi-check-circle-fill me-1"></i> Verified & Unlocked</span>
                <h2 class="font-heading fw-bold"><?php echo htmlspecialchars($data['scheme_name']); ?> Scorecard</h2>
                <p class="text-muted mb-0">Advisory Evaluation for <?php echo htmlspecialchars($customer_profile['name'] ?? ''); ?></p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                <div class="badge bg-primary fs-3 px-4 py-3 rounded-4 shadow">
                    <?php echo $engine_data['total_score']; ?> / 100
                </div>
                <small class="d-block fw-bold text-success mt-1"><?php echo htmlspecialchars($engine_data['result_category']); ?></small>
            </div>
        </div>

        <h5 class="fw-bold border-bottom pb-2 mb-3">Parameter Evaluation Breakdown</h5>
        <div class="row g-3 mb-4">
            <?php foreach ($engine_data['breakdown'] as $k => $item): ?>
                <div class="col-md-4">
                    <div class="p-3 bg-light rounded-3 border">
                        <small class="text-muted text-uppercase fw-bold d-block mb-1"><?php echo str_replace('_', ' ', $k); ?></small>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-dark"><?php echo htmlspecialchars($item['val']); ?></span>
                            <span class="badge bg-primary"><?php echo $item['score']; ?> / <?php echo $item['max']; ?> Pts</span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="card border-0 bg-light p-4 rounded-4 mb-4">
            <h5 class="fw-bold text-primary mb-2"><i class="bi bi-lightbulb me-1"></i> Advisory Consultant Recommendations</h5>
            <p class="text-secondary mb-0"><?php echo nl2br(htmlspecialchars($engine_data['recommendations'])); ?></p>
        </div>

        <div class="alert alert-secondary small mb-0">
            <i class="bi bi-info-circle me-1"></i> <strong>Legal Disclaimer:</strong> This scorecard is an internal advisory eligibility assessment generated by Digital Udyog Seva for consultancy purposes and does not constitute a loan sanction or guarantee of approval by any bank, NBFC, or government authority.
        </div>
    </div>

<?php endif; ?>

<?php require_once __DIR__ . '/includes/customer_footer.php'; ?>
