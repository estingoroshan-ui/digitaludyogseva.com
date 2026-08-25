<?php
$page_title = "Commission Ledger & Payout Approvals";
$active_menu = "commissions";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'process_payout') {
        $wid = (int)$_POST['withdrawal_id'];
        $ref = sanitize($_POST['payment_reference']);

        $upd = $pdo->prepare("
            UPDATE commission_withdrawals 
            SET status = 'paid', payment_reference = ?, processed_by = ?, processed_at = NOW()
            WHERE id = ?
        ");
        $upd->execute([$ref, $current_user['id'], $wid]);
        $msg = '<div class="alert alert-success fw-bold">Withdrawal payout processed & marked as paid!</div>';
    }
}

// Fetch Pending Withdrawal Requests
$withdrawals = $pdo->query("
    SELECT cw.*, f.business_name, f.owner_name, f.mobile
    FROM commission_withdrawals cw
    JOIN franchises f ON cw.franchise_id = f.id
    ORDER BY cw.id DESC
")->fetchAll();

// Fetch Commission Transactions
$transactions = $pdo->query("
    SELECT ct.*, f.business_name AS franchise_name, s.name AS service_name
    FROM commission_transactions ct
    JOIN franchises f ON ct.franchise_id = f.id
    LEFT JOIN services s ON ct.service_id = s.id
    ORDER BY ct.id DESC LIMIT 20
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Commission Ledger & Franchise Payouts</h4>
        <p class="text-muted small mb-0">Approve payout requests, review TDS deductions, and manage commission transactions.</p>
    </div>
</div>

<?php echo $msg; ?>

<!-- PENDING WITHDRAWALS -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <h5 class="font-heading fw-bold mb-3">Withdrawal Payout Requests</h5>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Withdrawal Code</th>
                    <th>Franchise Partner</th>
                    <th>Requested Amount</th>
                    <th>Bank Details</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($withdrawals)): ?>
                    <tr><td colspan="6" class="text-center text-muted py-3">No withdrawal payout requests pending.</td></tr>
                <?php else: ?>
                    <?php foreach ($withdrawals as $w): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo htmlspecialchars($w['withdrawal_code']); ?></td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($w['business_name']); ?></strong>
                                <small class="text-muted"><?php echo htmlspecialchars($w['mobile']); ?></small>
                            </td>
                            <td class="fw-bold text-success fs-6"><?php echo format_inr($w['requested_amount']); ?></td>
                            <td><small><?php echo htmlspecialchars($w['bank_details_snapshot']); ?></small></td>
                            <td><span class="badge bg-warning text-dark"><?php echo htmlspecialchars($w['status']); ?></span></td>
                            <td>
                                <?php if ($w['status'] === 'pending'): ?>
                                    <form action="" method="POST" class="d-flex gap-2">
                                        <input type="hidden" name="action" value="process_payout">
                                        <input type="hidden" name="withdrawal_id" value="<?php echo $w['id']; ?>">
                                        <input type="text" name="payment_reference" class="form-control form-control-sm" placeholder="NEFT/UPI Ref Code" required>
                                        <button type="submit" class="btn btn-sm btn-success rounded-pill px-3 fw-bold">Mark Paid</button>
                                    </form>
                                <?php else: ?>
                                    <span class="badge bg-success">Paid (Ref: <?php echo htmlspecialchars($w['payment_reference']); ?>)</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- COMMISSION LEDGER -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <h5 class="font-heading fw-bold mb-3">Recent Commission Ledger Transactions</h5>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Tx Code</th>
                    <th>Franchise</th>
                    <th>Service Case</th>
                    <th>Gross Amount</th>
                    <th>Commission</th>
                    <th>TDS (5%)</th>
                    <th>Net Earnings</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($transactions as $tx): ?>
                    <tr>
                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($tx['transaction_code']); ?></td>
                        <td><?php echo htmlspecialchars($tx['franchise_name']); ?></td>
                        <td><small><?php echo htmlspecialchars($tx['service_name'] ?: 'Service Case'); ?></small></td>
                        <td><?php echo format_inr($tx['gross_amount']); ?></td>
                        <td><?php echo format_inr($tx['commission_amount']); ?></td>
                        <td class="text-danger">-<?php echo format_inr($tx['tds_amount']); ?></td>
                        <td class="fw-bold text-success fs-6"><?php echo format_inr($tx['net_commission']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
