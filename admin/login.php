<?php
$page_title = "Staff & Admin Login | Digital Udyog Seva CRM";
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

$error = '';
$email_val = $_POST['email'] ?? 'admin@digitaludyogseva.com';
$password_val = $_POST['password'] ?? 'admin123';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "Invalid CSRF security token.";
    } else {
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $res = login_user($email, $password, 'admin');
        if ($res['status']) {
            header('Location: ' . BASE_URL . 'admin/index.php');
            exit;
        } else {
            $error = $res['message'];
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
    <!-- Google Fonts & Bootstrap 5 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <style>
        :root {
            --bg-dark: #0a0f1d;
            --card-bg: rgba(15, 23, 42, 0.85);
            --primary-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            --accent-glow: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-dark);
            background-image: var(--accent-glow), 
                              radial-gradient(circle at 10% 90%, rgba(245, 158, 11, 0.08) 0%, transparent 40%);
            background-attachment: fixed;
            color: #f8fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        .login-card {
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.15);
            max-width: 480px;
            width: 100%;
            padding: 2.75rem 2.5rem;
        }
        .brand-badge-crm {
            background: var(--primary-gradient);
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 1rem;
            letter-spacing: 0.5px;
            padding: 8px 18px;
            border-radius: 50px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        .form-control-custom {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            border-radius: 12px;
            padding: 0.85rem 1.15rem;
            font-size: 0.95rem;
            transition: all 0.25s ease;
        }
        .form-control-custom:focus {
            background: rgba(30, 41, 59, 0.95);
            border-color: #3b82f6;
            color: #ffffff;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
        }
        .form-control-custom::placeholder {
            color: #64748b;
        }
        .btn-login {
            background: var(--primary-gradient);
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 1.05rem;
            border: none;
            border-radius: 50px;
            padding: 0.9rem 1.5rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.6);
            color: #ffffff;
        }
        .demo-notice-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 0.85rem;
            color: #93c5fd;
        }
        .input-group-text-custom {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-left: none;
            color: #94a3b8;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <div class="login-card">
        <!-- Logo & Branding Header -->
        <div class="text-center mb-4">
            <div class="brand-badge-crm mb-3">
                <i class="bi bi-shield-lock-fill"></i> DUS COMMAND CENTER
            </div>
            <h2 class="font-heading fw-bold mb-1">Staff & Admin Login</h2>
            <p class="text-secondary small mb-0">Digital Udyog Seva Master Operating System</p>
        </div>

        <!-- Default Credentials Info Pill -->
        <div class="demo-notice-box mb-4 text-center">
            <i class="bi bi-info-circle-fill me-1 text-warning"></i>
            <strong>Default Credentials Loaded:</strong> One-click sign in enabled.
        </div>

        <?php if ($error): ?>
            <div class="alert alert-danger border-0 text-white bg-danger bg-opacity-75 rounded-3 fw-bold small mb-4 py-2 px-3">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <!-- Login Form -->
        <form action="" method="POST">
            <?php render_csrf_field(); ?>

            <div class="mb-3">
                <label class="form-label small fw-bold text-light">Email Address or Mobile</label>
                <div class="input-group">
                    <input type="text" name="email" class="form-control form-control-custom" required value="<?php echo htmlspecialchars($email_val); ?>" placeholder="admin@digitaludyogseva.com">
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label small fw-bold text-light">Password</label>
                <div class="input-group">
                    <input type="password" name="password" id="passInput" class="form-control form-control-custom border-end-0" required value="<?php echo htmlspecialchars($password_val); ?>" placeholder="••••••••">
                    <span class="input-group-text input-group-text-custom" onclick="togglePass()">
                        <i class="bi bi-eye" id="passIcon"></i>
                    </span>
                </div>
            </div>

            <button type="submit" class="btn btn-login w-100 mb-3">
                Sign In to CRM <i class="bi bi-arrow-right-short fs-5 ms-1"></i>
            </button>
        </form>

        <div class="text-center mt-3">
            <a href="<?php echo BASE_URL; ?>" class="text-secondary small text-decoration-none hover-white">
                <i class="bi bi-house-door me-1"></i> Back to Public Homepage
            </a>
        </div>
    </div>

    <script>
        function togglePass() {
            const input = document.getElementById('passInput');
            const icon = document.getElementById('passIcon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'bi bi-eye';
            }
        }
    </script>
</body>
</html>
