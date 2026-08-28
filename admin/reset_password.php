<?php
$page_title = "Reset Password | DUS CRM";
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

$token = sanitize($_GET['token'] ?? '');
$email = sanitize($_GET['email'] ?? '');
$msg = '';
$error = '';

global $pdo;
$valid_request = false;

if ($token && $email) {
    $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1");
    $stmt->execute([$email, $token]);
    $reset_row = $stmt->fetch();
    if ($reset_row) {
        $valid_request = true;
    } else {
        $error = "This password reset link is invalid or has expired.";
    }
} else {
    $error = "Missing token or email parameter.";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $valid_request) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "Invalid CSRF security token.";
    } else {
        $new_pass = $_POST['new_password'] ?? '';
        $confirm_pass = $_POST['confirm_password'] ?? '';

        if (strlen($new_pass) < 6) {
            $error = "Password must be at least 6 characters long.";
        } elseif ($new_pass !== $confirm_pass) {
            $error = "Passwords do not match.";
        } else {
            $hash = password_hash($new_pass, PASSWORD_BCRYPT);
            $upd = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
            $upd->execute([$hash, $email]);

            // Clear reset tokens
            $del = $pdo->prepare("DELETE FROM password_resets WHERE email = ?");
            $del->execute([$email]);

            ActivityLogger::log('password_reset_completed', 'auth', null, "Password reset completed for {$email}");
            $msg = "Password updated successfully! You can now <a href='" . BASE_URL . "admin/login.php' class='fw-bold text-white text-decoration-underline'>Sign In here</a>.";
            $valid_request = false;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; font-family: sans-serif; }
        .card-custom { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2.5rem; max-width: 440px; width: 100%; }
    </style>
</head>
<body>
    <div class="card-custom shadow-lg">
        <div class="text-center mb-4">
            <i class="bi bi-shield-check text-success fs-1"></i>
            <h3 class="fw-bold my-2">Set New Password</h3>
            <p class="text-secondary small">Enter your new secure account password.</p>
        </div>

        <?php if ($msg): ?>
            <div class="alert alert-success border-0 small mb-4 py-2 px-3"><?php echo $msg; ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-danger border-0 small mb-4 py-2 px-3"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <?php if ($valid_request): ?>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <div class="mb-3">
                    <label class="form-label small fw-bold">New Password</label>
                    <input type="password" name="new_password" class="form-control bg-dark text-white border-secondary" required placeholder="Minimum 6 characters">
                </div>
                <div class="mb-4">
                    <label class="form-label small fw-bold">Confirm New Password</label>
                    <input type="password" name="confirm_password" class="form-control bg-dark text-white border-secondary" required placeholder="Repeat new password">
                </div>
                <button type="submit" class="btn btn-success w-100 fw-bold rounded-pill mb-3">Update Password</button>
            </form>
        <?php endif; ?>

        <div class="text-center mt-3">
            <a href="<?php echo BASE_URL; ?>admin/login.php" class="text-secondary small text-decoration-none"><i class="bi bi-arrow-left me-1"></i> Back to Sign In</a>
        </div>
    </div>
</body>
</html>
