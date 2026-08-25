<?php
$page_title = "5-Step Service Application Wizard | Franchise Portal";
$active_menu = "new_app";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$msg = '';
$selected_cust_id = (int)($_GET['customer_id'] ?? 0);
$selected_srv_id = (int)($_GET['service_id'] ?? 0);

// Handle Application Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit_application') {
    $cust_id = (int)$_POST['customer_id'];
    $srv_id = (int)$_POST['service_id'];
    $payment_mode = sanitize($_POST['payment_mode'] ?? 'cash');

    $s_stmt = $pdo->prepare("SELECT * FROM services WHERE id = ?");
    $s_stmt->execute([$srv_id]);
    $service = $s_stmt->fetch();

    if ($cust_id && $service) {
        $case_code = generate_code('CASE', 6);
        $total_amount = (float)$service['final_price'];
        $comm_amount = (float)$service['franchise_commission_value'];

        // 1. Create Case Record
        $c_ins = $pdo->prepare("
            INSERT INTO cases (case_code, customer_id, service_id, franchise_id, total_amount, payment_status, current_stage, status)
            VALUES (?, ?, ?, ?, ?, 'verified', 'Application Submitted', 'active')
        ");
        $c_ins->execute([$case_code, $cust_id, $srv_id, $franchise_id, $total_amount]);
        $case_id = $pdo->lastInsertId();

        // 2. Insert Commission Transaction as Pending (Smart Commission Logic)
        $comm_ins = $pdo->prepare("
            INSERT INTO commission_transactions (franchise_id, case_id, gross_amount, commission_amount, tds_amount, net_commission, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ");
        $tds = ($comm_amount * 0.05); // 5% TDS Deduction
        $net_comm = $comm_amount - $tds;
        $comm_ins->execute([$franchise_id, $case_id, $total_amount, $comm_amount, $tds, $net_comm]);

        // 3. Insert Payment Record
        $p_ins = $pdo->prepare("
            INSERT INTO payments (payment_code, customer_id, case_id, franchise_id, amount, payment_mode, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, 'verified')
        ");
        $p_ins->execute([generate_code('PAY', 6), $cust_id, $case_id, $franchise_id, $total_amount, $payment_mode]);

        $msg = '<div class="alert alert-success border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 class="fw-bold text-dark mb-1"><i class="bi bi-check-circle-fill text-success me-2"></i> Application Submitted Successfully!</h5>
            <p class="text-secondary small mb-2">Case Code: <strong>' . htmlspecialchars($case_code) . '</strong> | Service: <strong>' . htmlspecialchars($service['name']) . '</strong></p>
            <p class="text-success small fw-bold mb-3"><i class="bi bi-info-circle me-1"></i> Commission of ₹' . format_inr($comm_amount) . ' logged as Pending in Ledger. Wallet will be credited upon Admin Case Verification.</p>
            <a href="commission_ledger.php" class="btn btn-primary btn-sm rounded-pill fw-bold px-4">View Commission Ledger</a>
        </div>';
    } else {
        $msg = '<div class="alert alert-danger fw-bold">Please select a valid customer and service.</div>';
    }
}

// Fetch Dropdown Data
$customers = $pdo->query("SELECT id, name, mobile, customer_code FROM customers ORDER BY name ASC")->fetchAll();
$services = $pdo->query("SELECT s.*, sc.name AS category_name FROM services s JOIN service_categories sc ON s.category_id = sc.id WHERE s.status = 'active' ORDER BY s.name ASC")->fetchAll();

$current_cust = null;
if ($selected_cust_id) {
    $c_find = $pdo->prepare("SELECT * FROM customers WHERE id = ?");
    $c_find->execute([$selected_cust_id]);
    $current_cust = $c_find->fetch();
}

$current_srv = null;
if ($selected_srv_id) {
    $s_find = $pdo->prepare("SELECT * FROM services WHERE id = ?");
    $s_find->execute([$selected_srv_id]);
    $current_srv = $s_find->fetch();
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">5-Step Service Application Wizard</h4>
        <p class="text-muted small mb-0">Step-by-step application workflow for client registration, service selection & payment confirmation.</p>
    </div>
    <a href="service_catalog.php" class="btn btn-outline-secondary rounded-pill px-4">
        <i class="bi bi-journal-bookmark me-1"></i> Service Catalog
    </a>
</div>

<?php echo $msg; ?>

<!-- WIZARD STEP INDICATOR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 text-center small fw-bold">
        <div class="flex-fill p-2 rounded-3 <?php echo $current_cust ? 'bg-success text-white' : 'bg-warning text-dark'; ?>">
            1. Select Customer
        </div>
        <div class="flex-fill p-2 rounded-3 <?php echo $current_srv ? 'bg-success text-white' : ($current_cust ? 'bg-warning text-dark' : 'bg-light text-muted'); ?>">
            2. Choose Service
        </div>
        <div class="flex-fill p-2 rounded-3 bg-light text-muted">
            3. Required Details
        </div>
        <div class="flex-fill p-2 rounded-3 bg-light text-muted">
            4. Upload Documents
        </div>
        <div class="flex-fill p-2 rounded-3 bg-light text-muted">
            5. Submit & Commission
        </div>
    </div>
</div>

<div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white max-w-800 mx-auto">
    <form action="" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="action" value="submit_application">

        <!-- STEP 1: SELECT CUSTOMER -->
        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">Step 1: Select Customer Profile</h5>
        <div class="mb-4">
            <label class="form-label small fw-bold">Choose Customer *</label>
            <select name="customer_id" class="form-select form-select-lg" required onchange="window.location.href='new_application.php?customer_id='+this.value+'&service_id=<?php echo $selected_srv_id; ?>'">
                <option value="">Select registered customer...</option>
                <?php foreach ($customers as $c): ?>
                    <option value="<?php echo $c['id']; ?>" <?php echo $selected_cust_id == $c['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($c['name']) . ' (' . htmlspecialchars($c['mobile']) . ') - ' . htmlspecialchars($c['customer_code']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <small class="text-muted mt-1 d-block">
                Client not registered yet? <a href="customer_add.php" class="text-primary fw-bold">+ Add New Customer First</a>
            </small>
        </div>

        <!-- STEP 2: CHOOSE SERVICE -->
        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">Step 2: Select Service from Catalog</h5>
        <div class="mb-4">
            <label class="form-label small fw-bold">Select Service *</label>
            <select name="service_id" class="form-select form-select-lg" required onchange="window.location.href='new_application.php?customer_id=<?php echo $selected_cust_id; ?>&service_id='+this.value">
                <option value="">Select service to apply...</option>
                <?php foreach ($services as $srv): ?>
                    <option value="<?php echo $srv['id']; ?>" <?php echo $selected_srv_id == $srv['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($srv['name']) . ' - Fee: ₹' . format_inr($srv['final_price']) . ' (Earn Commission: ₹' . format_inr($srv['franchise_commission_value']) . ')'; ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <?php if ($current_srv): ?>
            <!-- STEP 3 & 4: PRICING & DOCUMENT CHECKLIST -->
            <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">Step 3 & 4: Documents Checklist & Pricing</h5>
            
            <div class="bg-light p-4 rounded-4 mb-4">
                <h6 class="fw-bold text-dark mb-2">Required Documents Checklist:</h6>
                <p class="small text-secondary mb-3"><?php echo nl2br(htmlspecialchars($current_srv['required_docs'] ?: 'Aadhaar Card, PAN Card, Photo, Address Proof')); ?></p>

                <div class="mb-3">
                    <label class="form-label small fw-bold">Upload Client File / Document (PDF/JPG)</label>
                    <input type="file" name="client_document" class="form-control">
                </div>
            </div>

            <!-- STEP 5: PRICING & PAYMENT SUMMARY -->
            <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">Step 5: Payment & Commission Summary</h5>
            
            <div class="card border-primary bg-primary-subtle p-3 rounded-4 mb-4">
                <div class="d-flex justify-content-between mb-2">
                    <span>Customer Total Selling Price:</span>
                    <strong class="fs-5 text-dark">₹<?php echo format_inr($current_srv['final_price']); ?></strong>
                </div>
                <div class="d-flex justify-content-between text-success fw-bold border-top pt-2">
                    <span>Your Franchise Commission:</span>
                    <span class="fs-5">₹<?php echo format_inr($current_srv['franchise_commission_value']); ?></span>
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label small fw-bold">Customer Payment Mode Collected *</label>
                <select name="payment_mode" class="form-select">
                    <option value="cash">Cash Collected at Branch</option>
                    <option value="upi">UPI / QR Code Transfer</option>
                    <option value="bank_transfer">Bank Transfer / NEFT</option>
                    <option value="gateway">Online Payment Gateway</option>
                </select>
            </div>

            <button type="submit" class="btn btn-warning btn-lg w-100 fw-bold rounded-pill text-dark shadow">
                Submit Application & Log Pending Commission <i class="bi bi-arrow-right ms-1"></i>
            </button>
        <?php endif; ?>
    </form>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
