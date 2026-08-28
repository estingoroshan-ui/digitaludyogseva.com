<?php
$page_title = "Enterprise System Settings";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/Mailer.php';
require_permission('settings_edit');

global $pdo;
$msg = '';
$error = '';
$active_tab = sanitize($_GET['tab'] ?? 'company');

// Handle Settings Form Submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        if ($action === 'save_settings') {
            $settings_data = $_POST['settings'] ?? [];
            $stmt = $pdo->prepare("
                INSERT INTO website_settings (setting_key, setting_value, setting_group)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            ");

            foreach ($settings_data as $key => $val) {
                $group = 'general';
                if (strpos($key, 'company_') === 0) $group = 'company';
                elseif (strpos($key, 'smtp_') === 0) $group = 'email';

                $stmt->execute([sanitize($key), trim($val), $group]);
            }
            ActivityLogger::log('save_settings', 'settings', null, "Updated enterprise system settings ({$active_tab})");
            $msg = "System settings updated successfully!";
        } elseif ($action === 'send_test_email') {
            $test_email = trim($_POST['test_email'] ?? '');
            if (empty($test_email) || !filter_var($test_email, FILTER_VALIDATE_EMAIL)) {
                $error = "Please enter a valid test email address.";
            } else {
                $res = Mailer::send_test_email($test_email);
                if ($res) {
                    $msg = "Test email sent successfully to <strong>" . htmlspecialchars($test_email) . "</strong>!";
                } else {
                    $error = "Failed to send test email. Please check your SMTP configuration.";
                }
            }
        }
    }
}
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-sliders text-primary me-2"></i> Enterprise System Settings</h4>
        <p class="text-muted small mb-0">Configure company metadata, localization, SMTP mail servers, and security parameters.</p>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<div class="row g-4">
    <!-- SETTINGS NAVIGATION TABS -->
    <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="nav flex-column nav-pills" id="v-pills-tab">
                <a class="nav-link text-start rounded-3 fw-bold mb-1 <?php echo $active_tab === 'company' ? 'active bg-primary text-white' : 'text-dark'; ?>" href="?tab=company">
                    <i class="bi bi-building me-2"></i> Company Information
                </a>
                <a class="nav-link text-start rounded-3 fw-bold mb-1 <?php echo $active_tab === 'localization' ? 'active bg-primary text-white' : 'text-dark'; ?>" href="?tab=localization">
                    <i class="bi bi-globe me-2"></i> Localization & Regional
                </a>
                <a class="nav-link text-start rounded-3 fw-bold mb-1 <?php echo $active_tab === 'email' ? 'active bg-primary text-white' : 'text-dark'; ?>" href="?tab=email">
                    <i class="bi bi-envelope-at me-2"></i> Email & SMTP Config
                </a>
                <a class="nav-link text-start rounded-3 fw-bold mb-1 <?php echo $active_tab === 'custom_fields' ? 'active bg-primary text-white' : 'text-dark'; ?>" href="<?php echo BASE_URL; ?>admin/custom_fields.php">
                    <i class="bi bi-ui-checks me-2"></i> Custom Fields Engine
                </a>
                <a class="nav-link text-start rounded-3 fw-bold mb-1 <?php echo $active_tab === 'tags' ? 'active bg-primary text-white' : 'text-dark'; ?>" href="<?php echo BASE_URL; ?>admin/tags.php">
                    <i class="bi bi-tags me-2"></i> Tags Master
                </a>
                <a class="nav-link text-start rounded-3 fw-bold mb-1 <?php echo $active_tab === 'activity' ? 'active bg-primary text-white' : 'text-dark'; ?>" href="<?php echo BASE_URL; ?>admin/activity_log.php">
                    <i class="bi bi-journal-text me-2"></i> System Audit Log
                </a>
            </div>
        </div>
    </div>

    <!-- TAB CONTENTS -->
    <div class="col-md-9">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <?php if ($active_tab === 'company'): ?>
                <h5 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-building me-2 text-primary"></i> Company & Organization Information</h5>
                <form action="?tab=company" method="POST">
                    <?php render_csrf_field(); ?>
                    <input type="hidden" name="action" value="save_settings">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Company Name</label>
                            <input type="text" name="settings[company_name]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_name', 'Digital Udyog Seva')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Company Tagline</label>
                            <input type="text" name="settings[company_tagline]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_tagline', 'Business Legal Services & Loan Consultancy')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Official Contact Email</label>
                            <input type="email" name="settings[company_email]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_email', 'care@digitaludyogseva.com')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Official Phone / Helpline</label>
                            <input type="text" name="settings[company_phone]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_phone', '+91 9876543210')); ?>">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label small fw-bold">Corporate Address</label>
                            <textarea name="settings[company_address]" class="form-control" rows="2"><?php echo htmlspecialchars(get_setting('company_address', 'Corporate Tower, Financial District')); ?></textarea>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">City</label>
                            <input type="text" name="settings[company_city]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_city', 'New Delhi')); ?>">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">State</label>
                            <input type="text" name="settings[company_state]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_state', 'Delhi')); ?>">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">Postal / PIN Code</label>
                            <input type="text" name="settings[company_pincode]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_pincode', '110001')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">GSTIN / Tax Registration Number</label>
                            <input type="text" name="settings[company_gstin]" class="form-control" value="<?php echo htmlspecialchars(get_setting('company_gstin', '07AAAAA0000A1Z5')); ?>">
                        </div>
                    </div>
                    <div class="mt-4 text-end">
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Company Settings</button>
                    </div>
                </form>

            <?php elseif ($active_tab === 'localization'): ?>
                <h5 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-globe me-2 text-primary"></i> Localization & Regional Parameters</h5>
                <form action="?tab=localization" method="POST">
                    <?php render_csrf_field(); ?>
                    <input type="hidden" name="action" value="save_settings">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">System Timezone</label>
                            <select name="settings[default_timezone]" class="form-select">
                                <option value="Asia/Kolkata" <?php echo get_setting('default_timezone') === 'Asia/Kolkata' ? 'selected' : ''; ?>>Asia/Kolkata (IST +5:30)</option>
                                <option value="UTC" <?php echo get_setting('default_timezone') === 'UTC' ? 'selected' : ''; ?>>UTC Universal</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Date Format</label>
                            <select name="settings[date_format]" class="form-select">
                                <option value="d-m-Y" <?php echo get_setting('date_format') === 'd-m-Y' ? 'selected' : ''; ?>>DD-MM-YYYY (e.g. 28-08-2026)</option>
                                <option value="Y-m-d" <?php echo get_setting('date_format') === 'Y-m-d' ? 'selected' : ''; ?>>YYYY-MM-DD (e.g. 2026-08-28)</option>
                                <option value="d M Y" <?php echo get_setting('date_format') === 'd M Y' ? 'selected' : ''; ?>>DD Mon YYYY (e.g. 28 Aug 2026)</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Base Currency Code</label>
                            <input type="text" name="settings[default_currency]" class="form-control" value="<?php echo htmlspecialchars(get_setting('default_currency', 'INR')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Currency Symbol</label>
                            <input type="text" name="settings[currency_symbol]" class="form-control" value="<?php echo htmlspecialchars(get_setting('currency_symbol', '₹')); ?>">
                        </div>
                    </div>
                    <div class="mt-4 text-end">
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Localization Settings</button>
                    </div>
                </form>

            <?php elseif ($active_tab === 'email'): ?>
                <h5 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-envelope-at me-2 text-primary"></i> SMTP Server & Mail Configuration</h5>
                <form action="?tab=email" method="POST" class="mb-4">
                    <?php render_csrf_field(); ?>
                    <input type="hidden" name="action" value="save_settings">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">SMTP Host Server</label>
                            <input type="text" name="settings[smtp_host]" class="form-control" value="<?php echo htmlspecialchars(get_setting('smtp_host', 'smtp.gmail.com')); ?>" placeholder="smtp.domain.com">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">SMTP Port</label>
                            <input type="text" name="settings[smtp_port]" class="form-control" value="<?php echo htmlspecialchars(get_setting('smtp_port', '587')); ?>">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">Encryption Type</label>
                            <select name="settings[smtp_encryption]" class="form-select">
                                <option value="tls" <?php echo get_setting('smtp_encryption') === 'tls' ? 'selected' : ''; ?>>TLS / STARTTLS</option>
                                <option value="ssl" <?php echo get_setting('smtp_encryption') === 'ssl' ? 'selected' : ''; ?>>SSL</option>
                                <option value="none" <?php echo get_setting('smtp_encryption') === 'none' ? 'selected' : ''; ?>>None</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">SMTP Username / Email</label>
                            <input type="text" name="settings[smtp_username]" class="form-control" value="<?php echo htmlspecialchars(get_setting('smtp_username', '')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">SMTP Password</label>
                            <input type="password" name="settings[smtp_password]" class="form-control" value="<?php echo htmlspecialchars(get_setting('smtp_password', '')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">From Email Address</label>
                            <input type="email" name="settings[smtp_from_email]" class="form-control" value="<?php echo htmlspecialchars(get_setting('smtp_from_email', 'care@digitaludyogseva.com')); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">From Sender Name</label>
                            <input type="text" name="settings[smtp_from_name]" class="form-control" value="<?php echo htmlspecialchars(get_setting('smtp_from_name', 'Digital Udyog Seva CRM')); ?>">
                        </div>
                    </div>
                    <div class="mt-4 text-end">
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save SMTP Settings</button>
                    </div>
                </form>

                <!-- TEST EMAIL DISPATCH -->
                <div class="p-3 bg-light rounded-4 border">
                    <h6 class="fw-bold text-dark mb-2"><i class="bi bi-send me-1 text-success"></i> Test SMTP Mail Delivery</h6>
                    <form action="?tab=email" method="POST" class="row g-2 align-items-center">
                        <?php render_csrf_field(); ?>
                        <input type="hidden" name="action" value="send_test_email">
                        <div class="col-md-8">
                            <input type="email" name="test_email" class="form-control" required placeholder="Enter recipient email address to test..." value="<?php echo htmlspecialchars($_SESSION['user']['email'] ?? ''); ?>">
                        </div>
                        <div class="col-md-4">
                            <button type="submit" class="btn btn-success w-100 rounded-pill fw-bold">Send Test Email</button>
                        </div>
                    </form>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
