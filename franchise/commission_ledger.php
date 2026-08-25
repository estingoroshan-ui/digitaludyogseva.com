<?php
$page_title = "Commission Ledger | Franchise Portal";
$active_menu = "ledger";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$fr_id = $franchise_profile['id'] ?? 0;

$stmt = $pdo->prepare("
    SELECT ct.*, c.name AS customer_name, s.name AS service_name, ca.case_code
    FROM commission_transactions ct
    LEFT JOIN cases ca ON ct.case_id = ca.id
    LEFT JOIN customers c ON ca.customer_id = c.id
    LEFT JOIN services s ON ca.service_id = s.id
    WHERE ct.franchise_id = ?
    ORDER BY ct.id DESC
");
$stmt->execute([$fr_id]);
$ledger = $stmt->fetchAll();

// Ledger totals
$tot_gross = 0;
$tot_comm = 0;
$tot_tds = 0;
$tot_net = 0;

foreach ($ledger as $l) {
    $tot_gross += (float)$l['gross_amount'];
    $tot_comm += (float)$l['commission_amount'];
    $tot_tds += (float)$l['tds_amount'];
    $tot_net += (float)$l['net_commission'];
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Commission Ledger & Payout Audit</h4>
        <p class="text-muted small mb-0">Track all case commissions, statutory 5% TDS deductions, and net payable amounts.</p>
    </div>
    <a href="wallet.php" class="btn btn-warning btn-sm rounded-pill text-dark fw-bold px-4 shadow">
        <i class="bi bi-wallet2 me-1"></i> Open Wallet
    </a>
</div>

<!-- TOTAL SUMMARY CARDS -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small class="text-muted text-uppercase fw-bold fs-7">Gross Customer Volume</small>
            <h4 class="fw-bold text-dark my-1"><?php echo format_inr($tot_gross); ?></h4>
            <small class="text-muted">Total Sales</small>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small class="text-muted text-uppercase fw-bold fs-7">Gross Commission</small>
            <h4 class="fw-bold text-primary my-1"><?php echo format_inr($tot_comm); ?></h4>
            <small class="text-muted">Earned Rate</small>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small class="text-muted text-uppercase fw-bold fs-7">TDS Deducted (5%)</small>
            <h4 class="fw-bold text-danger my-1"><?php echo format_inr($tot_tds); ?></h4>
            <small class="text-muted">Govt Tax</small>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
            <small class="text-success text-uppercase fw-bold fs-7">Net Commission</small>
            <h4 class="fw-bold text-success my-1"><?php echo format_inr($tot_net); ?></h4>
            <small class="text-muted">Net Credited</small>
        </div>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Date & Case Code</th>
                    <th>Customer Name</th>
                    <th>Service Name</th>
                    <th>Customer Price</th>
                    <th>Gross Commission</th>
                    <th>TDS (5%)</th>
                    <th>Net Commission</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($ledger)): ?>
                    <tr><td colspan="8" class="text-center text-muted py-4">No commission transactions recorded yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($ledger as $item): ?>
                        <tr>
                            <td>
                                <strong class="d-block text-primary font-monospace"><?php echo htmlspecialchars($item['case_code'] ?: 'TXN-' . $item['id']); ?></strong>
                                <small class="text-muted"><?php echo date('d M Y', strtotime($item['created_at'])); ?></small>
                            </td>
                            <td class="fw-bold"><?php echo htmlspecialchars($item['customer_name'] ?: 'Client'); ?></td>
                            <td><small><?php echo htmlspecialchars($item['service_name'] ?: 'Service'); ?></small></td>
                            <td>₹<?php echo format_inr($item['gross_amount']); ?></td>
                            <td class="fw-bold">₹<?php echo format_inr($item['commission_amount']); ?></td>
                            <td class="text-danger">₹<?php echo format_inr($item['tds_amount']); ?></td>
                            <td class="fw-bold text-success">₹<?php echo format_inr($item['net_commission']); ?></td>
                            <td>
                                <?php if ($item['status'] === 'approved' || $item['status'] === 'paid'): ?>
                                    <span class="badge bg-success">Approved</span>
                                <?php elseif ($item['status'] === 'pending'): ?>
                                    <span class="badge bg-warning text-dark">Pending Review</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary"><?php echo ucfirst($item['status']); ?></span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
