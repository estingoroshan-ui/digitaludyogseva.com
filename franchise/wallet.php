<?php
$page_title = "Wallet & Payout Manager | Franchise Portal";
$active_menu = "wallet";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;
$msg = '';

$fr_id = $franchise_profile['id'] ?? 0;

// Handle Payout Request Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'request_payout') {
    $amount = (float)$_POST['amount'];
    $bank_info = sanitize($_POST['bank_info'] ?? '');
    $upi_id = sanitize($_POST['upi_id'] ?? '');

    if ($amount > 0 && $amount <= $wallet_balance) {
        $p_code = generate_code('PAYOUT', 6);
        $ins = $pdo->prepare("
            INSERT INTO commission_withdrawals (payout_code, franchise_id, amount, bank_info, upi_id, status)
            VALUES (?, ?, ?, ?, ?, 'requested')
        ");
        $ins->execute([$p_code, $fr_id, $amount, $bank_info, $upi_id]);

        $msg = '<div class="alert alert-success fw-bold">Payout Withdrawal request submitted for ₹' . format_inr($amount) . '! Code: ' . $p_code . '</div>';
    } else {
        $msg = '<div class="alert alert-danger fw-bold">Invalid withdrawal amount. Must not exceed available wallet balance.</div>';
    }
}

// Fetch Payout Requests
$payouts = $pdo->prepare("SELECT * FROM commission_withdrawals WHERE franchise_id = ? ORDER BY id DESC");
$payouts->execute([$fr_id]);
$payout_list = $payouts->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Wallet & Payout Manager</h4>
        <p class="text-muted small mb-0">Withdraw your earned commissions directly to your bank account or UPI ID.</p>
    </div>
    <button class="btn btn-warning btn-sm rounded-pill text-dark fw-bold px-4 shadow" data-bs-toggle="modal" data-bs-target="#withdrawModal">
        <i class="bi bi-cash-stack me-1"></i> Request Payout Withdrawal
    </button>
</div>

<?php echo $msg; ?>

<!-- WALLET CARDS -->
<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white">
            <small class="text-warning text-uppercase fw-bold">Available Wallet Balance</small>
            <h2 class="display-6 fw-bold text-white my-2"><?php echo format_inr($wallet_balance); ?></h2>
            <small class="text-secondary">Ready for instant payout withdrawal</small>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <small class="text-muted text-uppercase fw-bold">Pending Commission</small>
            <h2 class="display-6 fw-bold text-warning my-2">₹0.00</h2>
            <small class="text-muted">Awaiting Admin case verification</small>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <small class="text-muted text-uppercase fw-bold">Bank Account Info</small>
            <h6 class="fw-bold text-dark mt-2 mb-1"><?php echo htmlspecialchars($franchise_profile['bank_name'] ?: 'State Bank of India'); ?></h6>
            <small class="text-muted d-block">Acc: <?php echo htmlspecialchars($franchise_profile['account_no'] ?: '38495029481'); ?></small>
            <small class="text-muted">IFSC: <?php echo htmlspecialchars($franchise_profile['ifsc'] ?: 'SBIN0001234'); ?></small>
        </div>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="p-4 border-bottom">
        <h5 class="font-heading fw-bold mb-0"><i class="bi bi-list-check text-primary me-2"></i> Payout Withdrawal Requests</h5>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Payout Code</th>
                    <th>Requested Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($payout_list)): ?>
                    <tr><td colspan="5" class="text-center text-muted py-4">No payout requests submitted yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($payout_list as $po): ?>
                        <tr>
                            <td><strong class="font-monospace text-primary"><?php echo htmlspecialchars($po['payout_code'] ?: 'PAYOUT-' . $po['id']); ?></strong></td>
                            <td class="fw-bold"><?php echo date('d M Y', strtotime($po['created_at'])); ?></td>
                            <td class="fw-bold text-success">₹<?php echo format_inr($po['amount']); ?></td>
                            <td><small><?php echo htmlspecialchars($po['bank_info'] ?: ($po['upi_id'] ?: 'Bank NEFT')); ?></small></td>
                            <td><span class="badge bg-warning text-dark"><?php echo ucfirst($po['status']); ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- PAYOUT WITHDRAWAL MODAL -->
<div class="modal fade" id="withdrawModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Request Payout Withdrawal</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="request_payout">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Available Wallet Balance</label>
                        <input type="text" class="form-control" readonly value="₹<?php echo format_inr($wallet_balance); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Withdrawal Amount (₹) *</label>
                        <input type="number" name="amount" class="form-control" required max="<?php echo $wallet_balance; ?>" value="<?php echo min(5000, $wallet_balance); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Bank Account Details</label>
                        <input type="text" name="bank_info" class="form-control" value="SBI Acc: 38495029481 | IFSC: SBIN0001234">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">UPI ID (Optional)</label>
                        <input type="text" name="upi_id" class="form-control" placeholder="franchise@upi">
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Submit Payout Request</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
