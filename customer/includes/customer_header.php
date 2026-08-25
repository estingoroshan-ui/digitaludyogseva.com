<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';

require_login(['customer']);
$current_user = get_current_user_data();

// Get customer profile id
global $pdo;
$stmt = $pdo->prepare("SELECT * FROM customers WHERE user_id = ?");
$stmt->execute([$current_user['id']]);
$customer_profile = $stmt->fetch();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title ?? 'Customer Dashboard | Digital Udyog Seva'); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/style.css">
</head>
<body class="bg-light">

<nav class="navbar navbar-expand-lg navbar-dus shadow-sm">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="<?php echo BASE_URL; ?>">
            <span class="brand-badge">DUS</span>
            <span class="brand-title">Customer Portal</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#custNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="custNavbar">
            <ul class="navbar-nav ms-auto align-items-center gap-2">
                <li class="nav-item">
                    <a class="nav-link nav-link-dus <?php echo ($active_menu ?? '') === 'dashboard' ? 'active text-primary fw-bold' : ''; ?>" href="<?php echo BASE_URL; ?>customer/index.php">
                        <i class="bi bi-speedometer2 me-1"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-dus <?php echo ($active_menu ?? '') === 'documents' ? 'active text-primary fw-bold' : ''; ?>" href="<?php echo BASE_URL; ?>customer/documents.php">
                        <i class="bi bi-file-earmark-arrow-up me-1"></i> Upload Documents
                    </a>
                </li>
                <li class="nav-item ms-lg-3">
                    <span class="fw-bold text-dark me-2"><?php echo htmlspecialchars($current_user['name']); ?></span>
                    <a href="<?php echo BASE_URL; ?>logout.php" class="btn btn-sm btn-outline-danger rounded-pill px-3">Logout</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<div class="py-4">
    <div class="container">
