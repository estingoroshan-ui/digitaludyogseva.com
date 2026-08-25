<?php
$page_title = "Record Customer Payment | Franchise Portal";
$active_menu = "payment_collect";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;
$msg = '';

$cust_id = (int)($_GET['customer_id'] ?? 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $c_id = (int)$_POST['customer_id'];
    $amount = (float)$_POST['amount'];
    $mode = sanitize($_POST['payment_mode']);
    $txn_ref = sanitize($_POST['transaction_ref'] ?? '');

    if ($c_id && $amount > 0) {
        $p_code = generate_code('PAY', 6);
        $ins = $pdo->prepare("
            INSERT INTO payments (payment_code, customer_id, franchise_id, amount, payment_mode, transaction_id, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, 'verified')
        ");
        $ins->execute([$p_code, $c_id, $franchise_id, $amount, $mode, $txn_ref]);

        $msg = '<div class="alert alert-success border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 class="fw-bold text-dark mb-1"><i class="bi bi-check-circle-fill text-success me-2"></i> Payment Recorded Successfully!</h5>
            <p class="text-secondary small mb-2">Receipt Code: <strong>' . $p_code . '</strong> | Amount: <strong>₹' . format_inr($amount) . '</strong></p>
            <a href="customer_detail.php?id=' . $c_id . '" class="btn btn-primary btn-sm rounded-pill fw-bold px-3">Return to Customer Profile</a>
        </div>';
    }
}

$customers = $pdo->query("SELECT id, name, mobile, customer_code FROM customers ORDER BY name ASC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Record Customer Payment</h4>
        <p class="text-muted small mb-0">Record cash, UPI, or bank payments collected from clients and generate digital receipts.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white max-w-700 mx-auto">
    <form action="" method="POST">
        <?php render_csrf_field(); ?>
        <div class="mb-3">
            <label class="form-label small fw-bold">Select Customer *</label>
            <select name="customer_id" class="form-select" required>
                <option value="">Select customer...</option>
                <?php foreach ($customers as $c): ?>
                    <option value="<?php echo $c['id']; ?>" <?php echo $cust_id == $c['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($c['name']) . ' (' . htmlspecialchars($c['mobile']) . ') - ' . htmlspecialchars($c['customer_code']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label small fw-bold">Amount Collected (₹) *</label>
            <input type="number" name="amount" class="form-control" required placeholder="e.g. 1499">
        </div>
        <div class="mb-3">
            <label class="form-label small fw-bold">Payment Mode *</label>
            <select name="payment_mode" class="form-select">
                <option value="cash">Cash Collected</option>
                <option value="upi">UPI / QR Code Transfer</option>
                <option value="bank_transfer">Bank Transfer / NEFT</option>
                <option value="cheque">Cheque</option>
            </select>
        </div>
        <div class="mb-4">
            <label class="form-label small fw-bold">Transaction Reference / UTR Number</label>
            <input type="text" name="transaction_ref" class="form-control" placeholder="e.g. UPI/1234567890">
        </div>

        <button type="submit" class="btn btn-warning btn-lg w-100 fw-bold rounded-pill text-dark shadow">
            Record Payment & Issue Receipt <i class="bi bi-check-circle ms-1"></i>
        </button>
    </form>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
