<?php
$page_title = "Forgot Password | DUS CRM";
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../classes/Mailer.php';

$msg = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "Invalid CSRF security token.";
    } else {
        $email = trim($_POST['email'] ?? '');
        global $pdo;
        if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ? AND user_type IN ('admin', 'staff') AND status = 'active'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user) {
                $token = bin2hex(random_bytes(32));
                $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

                $ins = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at, created_at) VALUES (?, ?, ?, NOW())");
                $ins->execute([$email, $token, $expires]);

                $reset_url = BASE_URL . "admin/reset_password.php?token=" . $token . "&email=" . urlencode($email);
                
                $mail_body = "
                <div style='font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; border-radius: 10px;'>
                    <h3 style='color: #1e293b;'>Password Reset Request</h3>
                    <p>Hello <strong>" . htmlspecialchars($user['name']) . "</strong>,</p>
                    <p>We received a request to reset your password for your <strong>Digital Udyog Seva CRM</strong> account.</p>
                    <p><a href='{$reset_url}' style='background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;'>Reset My Password</a></p>
                    <p style='color: #64748b; font-size: 13px;'>Or copy and paste this link in your browser:<br><code>{$reset_url}</code></p>
                    <p style='color: #ef4444; font-size: 12px;'>This link will expire in 1 hour.</p>
                </div>";

                Mailer::send($email, "Password Reset Request - DUS CRM", $mail_body);
                ActivityLogger::log('forgot_password_request', 'auth', $user['id'], "Password reset requested for {$email}");

                $msg = "Password reset instructions have been generated. Check your inbox or click the link directly: <br><a href='{$reset_url}' class='text-decoration-underline fw-bold'>Reset Password Link</a>";
            } else {
                $error = "No active staff/admin account found with that email address.";
            }
        } else {
            $error = "Please enter a valid email address.";
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
            <i class="bi bi-key-fill text-warning fs-1"></i>
            <h3 class="fw-bold my-2">Forgot Password?</h3>
            <p class="text-secondary small">Enter your account email address to receive reset instructions.</p>
        </div>

        <?php if ($msg): ?>
            <div class="alert alert-success border-0 small mb-4 py-2 px-3"><?php echo $msg; ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-danger border-0 small mb-4 py-2 px-3"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form action="" method="POST">
            <?php render_csrf_field(); ?>
            <div class="mb-3">
                <label class="form-label small fw-bold">Account Email Address</label>
                <input type="email" name="email" class="form-control bg-dark text-white border-secondary" required placeholder="name@company.com">
            </div>
            <button type="submit" class="btn btn-primary w-100 fw-bold rounded-pill mb-3">Send Reset Instructions</button>
        </form>

        <div class="text-center mt-3">
            <a href="<?php echo BASE_URL; ?>admin/login.php" class="text-secondary small text-decoration-none"><i class="bi bi-arrow-left me-1"></i> Back to Sign In</a>
        </div>
    </div>
</body>
</html>
