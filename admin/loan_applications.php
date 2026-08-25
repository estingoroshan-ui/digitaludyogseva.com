<?php
$page_title = "Government Loan Applications & Scorecard Manager";
$active_menu = "loan_apps";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/PaymentGateway.php';

global $pdo;
$msg = '';

// Handle Stage Update or Scorecard Unlock
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'update_stage') {
        $app_id = (int)$_POST['app_id'];
        $stage = sanitize($_POST['stage']);
        $upd = $pdo->prepare("UPDATE loan_applications SET status_stage = ? WHERE id = ?");
        $upd->execute([$stage, $app_id]);
        $msg = '<div class="alert alert-success fw-bold">Loan application stage updated to: ' . htmlspecialchars($stage) . '</div>';
    } elseif ($_POST['action'] === 'unlock_scorecard') {
        $app_id = (int)$_POST['app_id'];
        $upd = $pdo->prepare("UPDATE loan_applications SET scorecard_payment_status = 'verified', scorecard_unlocked = TRUE WHERE id = ?");
        $upd->execute([$app_id]);
        $sc_upd = $pdo->prepare("UPDATE scorecards SET payment_status = 'verified', unlocked_at = NOW() WHERE loan_application_id = ?");
        $sc_upd->execute([$app_id]);
        $msg = '<div class="alert alert-success fw-bold">Scorecard unlocked for applicant successfully!</div>';
    }
}

// Fetch Loan Applications
$applications = $pdo->query("
    SELECT la.*, c.name AS customer_name, c.mobile, c.email, ls.scheme_name,
           sc.id AS scorecard_id, sc.total_score, sc.result_category, sc.payment_status AS sc_payment
    FROM loan_applications la
    JOIN customers c ON la.customer_id = c.id
    JOIN loan_schemes ls ON la.scheme_id = ls.id
    LEFT JOIN scorecards sc ON la.id = sc.loan_application_id
    ORDER BY la.id DESC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Government Business Loan Applications</h4>
        <p class="text-muted small mb-0">Track loan cases, manage advisory scorecards, and update bank submission stages.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>App Code</th>
                    <th>Applicant Name</th>
                    <th>Mobile</th>
                    <th>Scheme Name</th>
                    <th>Amount</th>
                    <th>Scorecard</th>
                    <th>Current Stage</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($applications as $app): ?>
                    <tr>
                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($app['application_code']); ?></td>
                        <td><?php echo htmlspecialchars($app['customer_name']); ?></td>
                        <td><?php echo htmlspecialchars($app['mobile']); ?></td>
                        <td><small><?php echo htmlspecialchars($app['scheme_name']); ?></small></td>
                        <td class="fw-bold"><?php echo format_inr($app['required_amount']); ?></td>
                        <td>
                            <?php if ($app['scorecard_id']): ?>
                                <div class="mb-1">
                                    <span class="badge bg-info text-dark fw-bold">
                                        Score: <?php echo $app['total_score']; ?> (<?php echo htmlspecialchars($app['result_category']); ?>)
                                    </span>
                                </div>
                                <?php if ($app['scorecard_unlocked']): ?>
                                    <span class="badge bg-success"><i class="bi bi-unlock-fill"></i> Unlocked</span>
                                <?php else: ?>
                                    <form action="" method="POST" class="d-inline" onsubmit="return confirm('Unlock scorecard for customer without online payment?');">
                                        <input type="hidden" name="action" value="unlock_scorecard">
                                        <input type="hidden" name="app_id" value="<?php echo $app['id']; ?>">
                                        <button type="submit" class="btn btn-sm btn-warning text-dark fw-bold py-0 rounded-pill fs-7">
                                            Unlock Scorecard
                                        </button>
                                    </form>
                                <?php endif; ?>
                            <?php else: ?>
                                <span class="badge bg-secondary">Pending Calculation</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="badge bg-warning text-dark"><?php echo htmlspecialchars($app['status_stage']); ?></span>
                        </td>
                        <td>
                            <!-- Stage Update Form -->
                            <form action="" method="POST" class="d-flex gap-1">
                                <input type="hidden" name="action" value="update_stage">
                                <input type="hidden" name="app_id" value="<?php echo $app['id']; ?>">
                                <select name="stage" class="form-select form-select-sm" onchange="this.form.submit()">
                                    <option value="">-- Move Stage --</option>
                                    <option value="Application Received">Application Received</option>
                                    <option value="KYC Completed">KYC Completed</option>
                                    <option value="Scorecard Unlocked">Scorecard Unlocked</option>
                                    <option value="Project Report Prepared">Project Report Prepared</option>
                                    <option value="Submitted to Bank">Submitted to Bank</option>
                                    <option value="Sanctioned / Approved">Sanctioned / Approved</option>
                                    <option value="Disbursed">Disbursed</option>
                                    <option value="Closed / Rejected">Closed / Rejected</option>
                                </select>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
