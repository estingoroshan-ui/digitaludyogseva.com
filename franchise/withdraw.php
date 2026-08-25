<?php
$page_title = "Payout Withdrawal Request | Franchise Portal";
$active_menu = "withdraw";
require_once __DIR__ . '/includes/franchise_header.php';
require_once __DIR__ . '/../classes/FranchiseEngine.php';

$fid = $franchise_profile['id'] ?? 0;
global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = (float)($_POST['amount'] ?? 0);
    $res = FranchiseEngine::request_withdrawal($fid, $amount);
    if ($res['status']) {
        $msg = '<div class="alert alert-success fw-bold">Withdrawal request submitted! Code: ' . $res['withdrawal_code'] . '</div>';
        // Refresh franchise record
        $stmt = $pdo->prepare("SELECT * FROM franchises WHERE id = ?");
        $stmt->execute([$fid]);
        $franchise_profile = $stmt->fetch();
    } else {
        $msg = '<div class="alert alert-danger fw-bold">' . htmlspecialchars($res['message']) . '</div>';
    }
}

// Fetch Withdrawal History
$withdrawals = $pdo->query("SELECT * FROM commission_withdrawals WHERE franchise_id = {$fid} ORDER BY id DESC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Franchise Payout Withdrawal</h4>
        <p class="text-muted small mb-0">Withdraw your available wallet earnings directly to your bank account or UPI.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="row g-4 mb-4">
    <!-- Request Form Column -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="font-heading fw-bold mb-3"><i class="bi bi-cash-stack text-success me-2"></i> Request Payout</h5>
            
            <div class="bg-light p-3 rounded-3 mb-4">
                <small class="text-muted text-uppercase fw-bold d-block">Available Wallet Balance</small>
                <h3 class="fw-bold text-success my-1"><?php echo format_inr($franchise_profile['wallet_balance'] ?? 0); ?></h3>
            </div>

            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <div class="mb-4">
                    <label class="form-label small fw-bold">Withdrawal Amount (₹) *</label>
                    <input type="number" name="amount" class="form-control form-control-lg" required min="100" max="<?php echo $franchise_profile['wallet_balance'] ?? 0; ?>" placeholder="Enter amount">
                </div>
                <button type="submit" class="btn btn-success btn-lg w-100 fw-bold rounded-pill shadow">
                    Submit Withdrawal Request <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </form>
        </div>
    </div>

    <!-- Payout History Column -->
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="font-heading fw-bold mb-3">Withdrawal Request History</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Request Code</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Reference / Remarks</th>
                            <th>Request Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($withdrawals)): ?>
                            <tr><td colspan="5" class="text-center text-muted py-4">No payout requests submitted yet.</td></tr>
                        <?php else: ?>
                            <?php foreach ($withdrawals as $w): ?>
                                <tr>
                                    <td class="fw-bold text-primary"><?php echo htmlspecialchars($w['withdrawal_code']); ?></td>
                                    <td class="fw-bold text-success"><?php echo format_inr($w['requested_amount']); ?></td>
                                    <td>
                                        <?php if ($w['status'] === 'paid'): ?>
                                            <span class="badge bg-success">Paid</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning text-dark"><?php echo htmlspecialchars($w['status']); ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td><small><?php echo htmlspecialchars($w['payment_reference'] ?: 'Under Review'); ?></small></td>
                                    <td><small><?php echo date('d M Y', strtotime($w['created_at'])); ?></small></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
