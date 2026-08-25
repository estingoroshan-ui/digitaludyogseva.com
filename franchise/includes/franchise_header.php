<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';

require_login(['franchise']);
$current_user = get_current_user_data();

global $pdo;
$stmt = $pdo->prepare("SELECT * FROM franchises WHERE user_id = ?");
$stmt->execute([$current_user['id']]);
$franchise_profile = $stmt->fetch();

$franchise_id = $franchise_profile['id'] ?? 0;
$wallet_balance = (float)($franchise_profile['wallet_balance'] ?? 0);

// Fetch Unread Notifications Count
$unread_notif_count = 0;
try {
    $n_stmt = $pdo->prepare("SELECT COUNT(*) FROM followups f JOIN customers c ON f.lead_id = c.lead_id WHERE c.user_id = ? AND f.followup_date <= CURDATE() AND f.status = 'pending'");
    $n_stmt->execute([$current_user['id']]);
    $unread_notif_count = $n_stmt->fetchColumn();
} catch (Exception $e) {}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title ?? 'Franchise Partner ERP | Digital Udyog Seva'); ?></title>
    <!-- Google Fonts & Bootstrap 5 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <style>
        :root {
            --sidebar-width: 260px;
            --top-header-height: 70px;
            --brand-gold: #f59e0b;
            --brand-dark: #0f172a;
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
        }
        .font-heading { font-family: 'Outfit', sans-serif; }
        
        /* Desktop Left Sidebar */
        .franchise-sidebar {
            width: var(--sidebar-width);
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background: #0f172a;
            color: #f8fafc;
            z-index: 1000;
            overflow-y: auto;
            border-right: 1px solid rgba(255,255,255,0.08);
            transition: all 0.3s ease;
        }
        .sidebar-brand {
            padding: 1.5rem 1.25rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .sidebar-menu-group {
            padding: 1.25rem 1.25rem 0.5rem;
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 1px;
            color: #64748b;
            text-transform: uppercase;
        }
        .sidebar-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0.75rem 1.25rem;
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.92rem;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .sidebar-nav-link:hover, .sidebar-nav-link.active {
            color: #ffffff;
            background: rgba(245, 158, 11, 0.15);
            border-left: 4px solid var(--brand-gold);
        }
        
        /* Top Header */
        .franchise-header {
            margin-left: var(--sidebar-width);
            height: var(--top-header-height);
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            position: sticky;
            top: 0;
            z-index: 999;
        }
        .franchise-main {
            margin-left: var(--sidebar-width);
            padding: 2rem;
            min-height: calc(100vh - var(--top-header-height));
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #0f172a;
            border-top: 1px solid rgba(255,255,255,0.1);
            z-index: 1050;
            padding: 8px 0;
        }
        .mobile-nav-item {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.75rem;
            text-align: center;
            flex: 1;
        }
        .mobile-nav-item.active, .mobile-nav-item:hover { color: var(--brand-gold); }
        .mobile-nav-item i { font-size: 1.25rem; display: block; margin-bottom: 2px; }

        @media (max-width: 991px) {
            .franchise-sidebar { transform: translateX(-100%); }
            .franchise-header, .franchise-main { margin-left: 0; padding: 1rem; }
            .mobile-bottom-nav { display: flex; }
        }
    </style>
</head>
<body>

<!-- DESKTOP LEFT SIDEBAR -->
<aside class="franchise-sidebar">
    <div class="sidebar-brand">
        <span class="badge bg-warning text-dark font-heading fw-bold fs-6 px-3 py-2 rounded-pill">DUS ERP</span>
        <div>
            <h6 class="fw-bold text-white mb-0 font-heading">Franchise Portal</h6>
            <small class="text-warning fs-7"><?php echo htmlspecialchars($franchise_profile['franchise_code'] ?? 'FR-2026'); ?></small>
        </div>
    </div>

    <!-- SIDEBAR NAVIGATION MENU GROUPS -->
    <div class="py-2">
        <div class="sidebar-menu-group">Dashboard</div>
        <a href="<?php echo BASE_URL; ?>franchise/index.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'dashboard' ? 'active' : ''; ?>">
            <i class="bi bi-grid-1x2-fill"></i> Command Center
        </a>

        <div class="sidebar-menu-group">Customers & Clients</div>
        <a href="<?php echo BASE_URL; ?>franchise/customer_add.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'add_customer' ? 'active' : ''; ?>">
            <i class="bi bi-person-plus-fill"></i> Add New Customer
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/customers.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'customers' ? 'active' : ''; ?>">
            <i class="bi bi-people-fill"></i> All Customers Directory
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/followups.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'followups' ? 'active' : ''; ?>">
            <i class="bi bi-clock-history"></i> Follow-ups & Reminders
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/appointments.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'appointments' ? 'active' : ''; ?>">
            <i class="bi bi-calendar-check-fill"></i> Appointments Calendar
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/leads.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'leads' ? 'active' : ''; ?>">
            <i class="bi bi-funnel-fill"></i> Potential Client Leads
        </a>

        <div class="sidebar-menu-group">Services & Ecosystem</div>
        <a href="<?php echo BASE_URL; ?>franchise/service_catalog.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'catalog' ? 'active' : ''; ?>">
            <i class="bi bi-journal-bookmark-fill"></i> Service Catalog (14 Groups)
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/ecosystem_catalog.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'ecosystem' ? 'active' : ''; ?>">
            <i class="bi bi-shop"></i> Machinery & Raw Materials
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/new_application.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'new_app' ? 'active' : ''; ?>">
            <i class="bi bi-lightning-charge-fill"></i> 5-Step Application Wizard
        </a>

        <div class="sidebar-menu-group">Finance & Wallet</div>
        <a href="<?php echo BASE_URL; ?>franchise/commission_ledger.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'ledger' ? 'active' : ''; ?>">
            <i class="bi bi-wallet2"></i> Commission Ledger
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/wallet.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'wallet' ? 'active' : ''; ?>">
            <i class="bi bi-cash-coin"></i> Wallet & Payout Requests
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/payment_collect.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'payment_collect' ? 'active' : ''; ?>">
            <i class="bi bi-receipt"></i> Record Customer Payment
        </a>

        <div class="sidebar-menu-group">Support & Training</div>
        <a href="<?php echo BASE_URL; ?>franchise/training.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'training' ? 'active' : ''; ?>">
            <i class="bi bi-play-btn-fill"></i> Training Center
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/support.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'support' ? 'active' : ''; ?>">
            <i class="bi bi-headset"></i> Support Tickets
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/profile.php" class="sidebar-nav-link <?php echo ($active_menu ?? '') === 'profile' ? 'active' : ''; ?>">
            <i class="bi bi-shield-check"></i> Profile & KYC Details
        </a>
        <a href="<?php echo BASE_URL; ?>logout.php" class="sidebar-nav-link text-danger mt-3">
            <i class="bi bi-box-arrow-right"></i> Sign Out
        </a>
    </div>
</aside>

<!-- TOP HEADER -->
<header class="franchise-header">
    <!-- Global Header Search Bar -->
    <div class="d-flex align-items-center gap-2 max-w-500 w-100">
        <form action="<?php echo BASE_URL; ?>franchise/customers.php" method="GET" class="w-100 position-relative">
            <input type="text" name="q" class="form-control rounded-pill px-4" placeholder="Global Search (Customer Name, Mobile, Case ID)...">
        </form>
    </div>

    <!-- Header Actions & Profile -->
    <div class="d-flex align-items-center gap-3">
        <!-- Wallet Badge -->
        <a href="<?php echo BASE_URL; ?>franchise/wallet.php" class="btn btn-warning btn-sm rounded-pill fw-bold text-dark px-3 text-decoration-none">
            <i class="bi bi-wallet2 me-1"></i> Wallet: <?php echo format_inr($wallet_balance); ?>
        </a>

        <!-- Notification Bell -->
        <a href="<?php echo BASE_URL; ?>franchise/followups.php" class="position-relative text-dark fs-5 text-decoration-none" title="Follow-up Reminders">
            <i class="bi bi-bell-fill text-secondary"></i>
            <?php if ($unread_notif_count > 0): ?>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-7">
                    <?php echo $unread_notif_count; ?>
                </span>
            <?php endif; ?>
        </a>

        <div class="border-start ps-3 d-none d-md-block">
            <small class="d-block text-muted fs-7">Franchise Partner</small>
            <span class="fw-bold text-dark fs-7"><?php echo htmlspecialchars($franchise_profile['owner_name'] ?? $current_user['name']); ?></span>
        </div>
    </div>
</header>

<!-- MAIN CONTENT WRAPPER -->
<main class="franchise-main">
