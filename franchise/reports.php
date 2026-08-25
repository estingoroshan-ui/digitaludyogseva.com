<?php
$page_title = "Franchise Reports & Analytics | Digital Udyog Seva";
$active_menu = "reports";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$fr_id = $franchise_profile['id'] ?? 0;

$sales_summary = $pdo->prepare("
    SELECT COUNT(*) AS total_cases, SUM(total_amount) AS total_revenue
    FROM cases WHERE franchise_id = ?
");
$sales_summary->execute([$fr_id]);
$sales = $sales_summary->fetch();

$comm_summary = $pdo->prepare("
    SELECT SUM(commission_amount) AS gross_comm, SUM(tds_amount) AS total_tds, SUM(net_commission) AS net_comm
    FROM commission_transactions WHERE franchise_id = ?
");
$comm_summary->execute([$fr_id]);
$comm = $comm_summary->fetch();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Franchise Business Reports & Analytics</h4>
        <p class="text-muted small mb-0">Sales revenue, commission earned, TDS deductions, and client metrics summary.</p>
    </div>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="font-heading fw-bold border-bottom pb-2 mb-3">Sales Performance</h5>
            <table class="table table-borderless small mb-0">
                <tr>
                    <td class="text-muted">Total Client Cases:</td>
                    <td class="fw-bold text-dark"><?php echo (int)($sales['total_cases'] ?? 0); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">Total Customer Billing Volume:</td>
                    <td class="fw-bold text-primary fs-5"><?php echo format_inr($sales['total_revenue'] ?? 0); ?></td>
                </tr>
            </table>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="font-heading fw-bold border-bottom pb-2 mb-3">Commission & TDS Ledger Summary</h5>
            <table class="table table-borderless small mb-0">
                <tr>
                    <td class="text-muted">Gross Commission Earned:</td>
                    <td class="fw-bold text-dark"><?php echo format_inr($comm['gross_comm'] ?? 0); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">Total TDS Deducted (5%):</td>
                    <td class="fw-bold text-danger"><?php echo format_inr($comm['total_tds'] ?? 0); ?></td>
                </tr>
                <tr class="border-top">
                    <td class="fw-bold text-dark">Net Commission Credited:</td>
                    <td class="fw-bold text-success fs-5"><?php echo format_inr($comm['net_comm'] ?? 0); ?></td>
                </tr>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
