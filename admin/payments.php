<?php
$page_title = "Payments & Offline Verifications Queue";
$active_menu = "payments";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/PaymentGateway.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'verify_payment') {
        $pid = (int)$_POST['payment_id'];
        $ref = sanitize($_POST['txn_ref'] ?? '');
        $res = PaymentGateway::verify_payment($pid, $current_user['id'], $ref);
        if ($res['status']) {
            $msg = '<div class="alert alert-success fw-bold">' . htmlspecialchars($res['message']) . '</div>';
        } else {
            $msg = '<div class="alert alert-danger fw-bold">' . htmlspecialchars($res['message']) . '</div>';
        }
    }
}

// Fetch Pending Offline Payments
$offline_queue = $pdo->query("
    SELECT op.*, p.payment_code, p.amount, p.payment_mode, c.name AS customer_name, c.mobile
    FROM offline_payments op
    JOIN payments p ON op.payment_id = p.id
    JOIN customers c ON p.customer_id = c.id
    WHERE op.verification_status = 'pending'
    ORDER BY op.id DESC
")->fetchAll();

// Fetch All Payment Logs
$all_payments = $pdo->query("
    SELECT p.*, c.name AS customer_name, c.mobile
    FROM payments p
    JOIN customers c ON p.customer_id = c.id
    ORDER BY p.id DESC LIMIT 30
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Central Payments & Accounts Verification</h4>
        <p class="text-muted small mb-0">Verify offline payment proofs, view Razorpay online transactions & release scorecards.</p>
    </div>
</div>

<?php echo $msg; ?>

<!-- OFFLINE VERIFICATION QUEUE -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="font-heading fw-bold mb-0 text-danger"><i class="bi bi-clock-history me-1"></i> Accounts Verification Queue</h5>
        <span class="badge bg-danger rounded-pill px-3 py-2"><?php echo count($offline_queue); ?> Pending Verification</span>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Pay Code</th>
                    <th>Customer Name</th>
                    <th>Amount</th>
                    <th>Bank & Txn Ref</th>
                    <th>Payment Date</th>
                    <th>Uploaded Proof</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($offline_queue)): ?>
                    <tr><td colspan="7" class="text-center text-muted py-4">No offline payment proofs waiting in verification queue.</td></tr>
                <?php else: ?>
                    <?php foreach ($offline_queue as $off): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo htmlspecialchars($off['payment_code']); ?></td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($off['customer_name']); ?></strong>
                                <small class="text-muted"><?php echo htmlspecialchars($off['mobile']); ?></small>
                            </td>
                            <td class="fw-bold text-success fs-6"><?php echo format_inr($off['amount']); ?></td>
                            <td>
                                <span class="fw-bold d-block text-dark"><?php echo htmlspecialchars($off['bank_name'] ?: 'UPI / Bank Transfer'); ?></span>
                                <small class="text-muted">Ref: <?php echo htmlspecialchars($off['transaction_id']); ?></small>
                            </td>
                            <td><?php echo date('d M Y', strtotime($off['payment_date'])); ?></td>
                            <td>
                                <a href="<?php echo UPLOAD_URL . 'payments/' . date('Y/m') . '/' . htmlspecialchars($off['proof_file_path']); ?>" target="_blank" class="btn btn-sm btn-outline-info rounded-pill">
                                    <i class="bi bi-file-earmark-image"></i> View Receipt
                                </a>
                            </td>
                            <td>
                                <form action="" method="POST" class="d-flex gap-2" onsubmit="return confirm('Verify and approve this payment?');">
                                    <input type="hidden" name="action" value="verify_payment">
                                    <input type="hidden" name="payment_id" value="<?php echo $off['payment_id']; ?>">
                                    <input type="hidden" name="txn_ref" value="<?php echo htmlspecialchars($off['transaction_id']); ?>">
                                    <button type="submit" class="btn btn-sm btn-success rounded-pill px-3 fw-bold">Approve & Unlock</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- ALL PAYMENTS LOG -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <h5 class="font-heading fw-bold mb-3">All Transaction Logs</h5>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Payment Code</th>
                    <th>Customer Name</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Txn Reference</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($all_payments as $p): ?>
                    <tr>
                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($p['payment_code']); ?></td>
                        <td><?php echo htmlspecialchars($p['customer_name']); ?></td>
                        <td class="fw-bold text-dark"><?php echo format_inr($p['amount']); ?></td>
                        <td><span class="badge bg-secondary"><?php echo htmlspecialchars($p['payment_mode']); ?></span></td>
                        <td><small><?php echo htmlspecialchars($p['transaction_reference'] ?: 'Pending'); ?></small></td>
                        <td>
                            <?php if ($p['status'] === 'verified' || $p['status'] === 'paid'): ?>
                                <span class="badge bg-success">Verified</span>
                            <?php else: ?>
                                <span class="badge bg-warning text-dark"><?php echo htmlspecialchars($p['status']); ?></span>
                            <?php endif; ?>
                        </td>
                        <td><small><?php echo date('d M Y, h:i A', strtotime($p['created_at'])); ?></small></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
