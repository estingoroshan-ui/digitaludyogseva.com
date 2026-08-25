<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/csrf.php';

$helpline = get_setting('helpline_phone', '+91 98765 43210');
$email = get_setting('support_email', 'info@digitaludyogseva.com');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title ?? get_setting('site_title', 'Digital Udyog Seva | Business Registration, Tax & Government Loan Portal')); ?></title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!-- FinTech / LegalTech Design System Stylesheet -->
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/style.css">
    <script>
        const BASE_URL = '<?php echo BASE_URL; ?>';
    </script>
</head>
<body>

<!-- LEVEL 1: TOP UTILITY BAR -->
<div class="top-utility-bar d-none d-lg-block">
    <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-4">
            <span><i class="bi bi-telephone-fill text-saffron me-1"></i> Helpline: <strong><?php echo htmlspecialchars($helpline); ?></strong></span>
            <span><i class="bi bi-envelope-fill text-saffron me-1"></i> <?php echo htmlspecialchars($email); ?></span>
            <span><i class="bi bi-clock-fill text-saffron me-1"></i> Mon - Sat: 9:30 AM - 7:00 PM</span>
        </div>
        <div class="d-flex align-items-center gap-3">
            <a href="<?php echo BASE_URL; ?>track.php"><i class="bi bi-search me-1 text-saffron"></i> Track Application</a>
            <span class="divider">|</span>
            <a href="<?php echo BASE_URL; ?>customer/login.php"><i class="bi bi-person-circle me-1"></i> Customer Login</a>
            <span class="divider">|</span>
            <a href="<?php echo BASE_URL; ?>franchise/login.php"><i class="bi bi-building me-1"></i> Franchise Login</a>
            <span class="divider">|</span>
            <a href="<?php echo BASE_URL; ?>admin/login.php"><i class="bi bi-shield-lock me-1"></i> Staff Login</a>
        </div>
    </div>
</div>
