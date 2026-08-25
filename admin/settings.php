<?php
$page_title = "Enterprise System Settings";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    foreach ($_POST['settings'] as $key => $val) {
        $key = sanitize($key);
        $val = sanitize($val);
        $stmt = $pdo->prepare("INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        $stmt->execute([$key, $val]);
    }
    $msg = '<div class="alert alert-success fw-bold">Enterprise System Settings updated successfully!</div>';
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Enterprise System Settings</h4>
        <p class="text-muted small mb-0">Configure company details, helpline contact, scorecard pricing, payment gateway & footer settings.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white max-w-800 mx-auto">
    <form action="" method="POST">
        <input type="hidden" name="action" value="save_settings">

        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">1. Company & Contact Details</h5>
        <div class="row g-3 mb-4">
            <div class="col-md-6">
                <label class="form-label small fw-bold">Company Name</label>
                <input type="text" name="settings[site_title]" class="form-control" value="<?php echo htmlspecialchars(get_setting('site_title', 'Digital Udyog Seva')); ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Helpline Phone Number</label>
                <input type="text" name="settings[helpline_phone]" class="form-control" value="<?php echo htmlspecialchars(get_setting('helpline_phone', '+91 98765 43210')); ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Support Email Address</label>
                <input type="email" name="settings[support_email]" class="form-control" value="<?php echo htmlspecialchars(get_setting('support_email', 'info@digitaludyogseva.com')); ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Office Address</label>
                <input type="text" name="settings[office_address]" class="form-control" value="<?php echo htmlspecialchars(get_setting('office_address', 'Digital Udyog Seva Complex, Jaipur, Rajasthan')); ?>">
            </div>
        </div>

        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">2. Scorecard & Payment Settings</h5>
        <div class="row g-3 mb-4">
            <div class="col-md-6">
                <label class="form-label small fw-bold">Scorecard Fee (₹)</label>
                <input type="number" name="settings[scorecard_fee]" class="form-control" value="<?php echo htmlspecialchars(get_setting('scorecard_fee', '499.00')); ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Razorpay Key ID</label>
                <input type="text" name="settings[razorpay_key_id]" class="form-control" value="<?php echo htmlspecialchars(get_setting('razorpay_key_id', 'rzp_test_DUS123456')); ?>">
            </div>
        </div>

        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">3. Mandated Footer Credit Settings</h5>
        <div class="mb-4">
            <label class="form-label small fw-bold">Footer Credit Text</label>
            <input type="text" name="settings[footer_credit_text]" class="form-control" readonly value="Managed by Digital Vyapar Seva (https://digitalvyaparseva.com/)">
            <small class="text-muted">Mandatory credit link rendered across all public and portal footers.</small>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold rounded-pill shadow">
            Save System Settings <i class="bi bi-check-circle ms-1"></i>
        </button>
    </form>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
