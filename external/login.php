<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf_token($_POST['csrf_token'] ?? '');
    
    $login_input = trim($_POST['login_input'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if ($login_input !== '' && $password !== '') {
        $user = authenticate_user($login_input, $password);
        if ($user) {
            // Log in external user
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['role_id'] = $user['role_id'];
            $_SESSION['user_name'] = $user['name'];
            
            header("Location: " . BASE_URL . "external/index.php");
            exit;
        } else {
            $error = "Invalid Mobile/Email or Password for External Professional Access.";
        }
    } else {
        $error = "Please fill in all fields.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>External Professional Desk (CA / CS / Advocate) | Digital Udyog Seva</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { background: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .login-card { max-width: 420px; width: 100%; border-radius: 12px; border: none; }
        .brand-badge { background: #0d6efd; color: #fff; padding: 6px 12px; border-radius: 6px; font-weight: bold; }
    </style>
</head>
<body class="d-flex align-items-center justify-content-center min-vh-100 p-3">

<div class="card login-card shadow-lg">
    <div class="card-body p-4 p-sm-5">
        <div class="text-center mb-4">
            <span class="brand-badge fs-5 mb-2 d-inline-block">DUS EXTERNAL DESK</span>
            <h5 class="fw-bold text-dark mb-1">External Professional Portal</h5>
            <small class="text-muted">For CA, CS, Advocates & Outsourced Consultants</small>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-danger py-2 fs-7" role="alert">
                <i class="bi bi-exclamation-circle-fill me-2"></i><?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            
            <div class="mb-3">
                <label class="form-label fw-semibold">Registered Email or Mobile</label>
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                    <input type="text" name="login_input" class="form-control" placeholder="ca.jaipur@digitaludyogseva.com" required>
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label fw-semibold">Password</label>
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                    <input type="password" name="password" class="form-control" placeholder="••••••••" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                <i class="bi bi-box-arrow-in-right me-2"></i>Sign In to Professional Desk
            </button>
        </form>

        <div class="text-center mt-4 pt-3 border-top">
            <small class="text-muted">Data Security Warning: You are accessing confidential assigned case records. All activities are recorded with IP & Timestamp logs.</small>
        </div>
    </div>
</div>

</body>
</html>
