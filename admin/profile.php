<?php
$page_title = "My Profile & Account Settings";
$active_menu = "profile";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$user_id = (int)$_SESSION['user']['id'];
$msg = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $mobile = trim($_POST['mobile'] ?? '');
        $language = sanitize($_POST['language'] ?? 'en');
        $email_signature = trim($_POST['email_signature'] ?? '');
        $new_password = $_POST['new_password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';

        if (empty($name) || empty($email) || empty($mobile)) {
            $error = "Name, Email, and Mobile are required.";
        } else {
            $upd = $pdo->prepare("UPDATE users SET name = ?, email = ?, mobile = ?, language = ?, email_signature = ? WHERE id = ?");
            $upd->execute([$name, $email, $mobile, $language, $email_signature, $user_id]);

            if (!empty($new_password)) {
                if (strlen($new_password) < 6) {
                    $error = "Password must be at least 6 characters long.";
                } elseif ($new_password !== $confirm_password) {
                    $error = "Passwords do not match.";
                } else {
                    $hash = password_hash($new_password, PASSWORD_BCRYPT);
                    $upd_p = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                    $upd_p->execute([$hash, $user_id]);
                    ActivityLogger::log('change_password', 'profile', $user_id, "User updated their password");
                }
            }

            if (!$error) {
                // Update session
                $_SESSION['user']['name'] = $name;
                $_SESSION['user']['email'] = $email;
                $_SESSION['user']['mobile'] = $mobile;
                $_SESSION['user']['language'] = $language;
                $_SESSION['user']['email_signature'] = $email_signature;

                ActivityLogger::log('update_profile', 'profile', $user_id, "User updated profile details");
                $msg = "Profile details updated successfully!";
            }
        }
    }
}

// Fetch Latest User Profile Data
$stmt = $pdo->prepare("SELECT u.*, r.role_name, d.name AS department_name FROM users u LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN departments d ON u.department_id = d.id WHERE u.id = ?");
$stmt->execute([$user_id]);
$profile = $stmt->fetch();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-person-bounding-box text-primary me-2"></i> My Profile & Account Settings</h4>
        <p class="text-muted small mb-0">Manage your personal account credentials, email signature, and preferences.</p>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<div class="row g-4">
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
            <div class="rounded-circle bg-primary-subtle text-primary fw-bold mx-auto d-flex align-items-center justify-content-center mb-3 fs-2" style="width: 80px; height: 80px;">
                <?php echo strtoupper(substr($profile['name'], 0, 1)); ?>
            </div>
            <h5 class="fw-bold mb-1 text-dark"><?php echo htmlspecialchars($profile['name']); ?></h5>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold mb-2">
                <?php echo htmlspecialchars($profile['role_name'] ?: 'Staff'); ?>
            </span>
            <p class="text-muted small mb-3"><?php echo htmlspecialchars($profile['department_name'] ?: 'General Department'); ?></p>

            <div class="border-top pt-3 text-start small text-muted">
                <div class="mb-2"><i class="bi bi-envelope me-2 text-primary"></i><?php echo htmlspecialchars($profile['email']); ?></div>
                <div class="mb-2"><i class="bi bi-telephone me-2 text-primary"></i><?php echo htmlspecialchars($profile['mobile']); ?></div>
                <div class="mb-2"><i class="bi bi-clock-history me-2 text-primary"></i>Last Login: <?php echo $profile['last_login_at'] ? date('d M Y, h:i A', strtotime($profile['last_login_at'])) : 'N/A'; ?></div>
                <div><i class="bi bi-shield-check me-2 text-primary"></i>Status: <span class="badge bg-success">Active</span></div>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3 border-bottom pb-2">Edit Account Information</h5>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Full Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($profile['name']); ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Email Address <span class="text-danger">*</span></label>
                        <input type="email" name="email" class="form-control" required value="<?php echo htmlspecialchars($profile['email']); ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Mobile Number <span class="text-danger">*</span></label>
                        <input type="text" name="mobile" class="form-control" required value="<?php echo htmlspecialchars($profile['mobile']); ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Preferred Language</label>
                        <select name="language" class="form-select">
                            <option value="en" <?php echo ($profile['language'] ?? '') === 'en' ? 'selected' : ''; ?>>English</option>
                            <option value="hi" <?php echo ($profile['language'] ?? '') === 'hi' ? 'selected' : ''; ?>>Hindi</option>
                        </select>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label small fw-bold">Email Signature</label>
                        <textarea name="email_signature" class="form-control" rows="3" placeholder="Signature appended to emails"><?php echo htmlspecialchars($profile['email_signature'] ?? ''); ?></textarea>
                    </div>

                    <div class="col-12 mt-4">
                        <h6 class="fw-bold mb-2 border-bottom pb-2">Change Password</h6>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">New Password</label>
                        <input type="password" name="new_password" class="form-control" placeholder="Leave blank to keep current">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Confirm New Password</label>
                        <input type="password" name="confirm_password" class="form-control" placeholder="Repeat new password">
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                        <i class="bi bi-check-lg me-1"></i> Save Profile Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
