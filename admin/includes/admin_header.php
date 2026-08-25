<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';

require_login(['admin', 'staff']);
$current_user = get_current_user_data();

global $pdo;
$unread_notifications = 0;
try {
    $unread_notifications = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date <= CURDATE() AND status = 'pending'")->fetchColumn();
} catch (Exception $e) {}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title ?? 'DUS CRM & Enterprise Admin Panel'); ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!-- Admin & CRM CSS -->
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/admin.css">
    <script>
        const BASE_URL = '<?php echo BASE_URL; ?>';
    </script>
</head>
<body>

<div class="admin-layout">
    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar">
        <div class="sidebar-header">
            <span class="brand-badge me-2">DUS</span>
            <div>
                <h6 class="fw-bold text-white mb-0">Digital Udyog Seva</h6>
                <small class="text-muted fs-7">Enterprise Command</small>
            </div>
        </div>

        <div class="sidebar-menu">
            <div class="sidebar-group-title">Dashboard</div>
            <a href="<?php echo BASE_URL; ?>admin/index.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'dashboard' ? 'active' : ''; ?>">
                <i class="bi bi-speedometer2"></i> Command Center
            </a>

            <div class="sidebar-group-title">CRM & Sales</div>
            <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'leads' ? 'active' : ''; ?>">
                <i class="bi bi-funnel"></i> Leads & 21-Stage Pipeline
            </a>
            <a href="<?php echo BASE_URL; ?>admin/followups_today.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'leads' && strpos($_SERVER['REQUEST_URI'], 'followups_today') !== false ? 'active' : ''; ?>">
                <i class="bi bi-clock-history"></i> Today's Follow-ups
            </a>
            <a href="<?php echo BASE_URL; ?>admin/appointments.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'leads' && strpos($_SERVER['REQUEST_URI'], 'appointments') !== false ? 'active' : ''; ?>">
                <i class="bi bi-calendar-check"></i> Appointments Calendar
            </a>
            <a href="<?php echo BASE_URL; ?>admin/customers.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'customers' ? 'active' : ''; ?>">
                <i class="bi bi-people"></i> 360° Customer Master
            </a>

            <div class="sidebar-group-title">Loans & Scorecards</div>
            <a href="<?php echo BASE_URL; ?>admin/loan_applications.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'loan_apps' ? 'active' : ''; ?>">
                <i class="bi bi-bank"></i> Loan Applications & Cases
            </a>
            <a href="<?php echo BASE_URL; ?>admin/loan_schemes.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'loan_schemes' ? 'active' : ''; ?>">
                <i class="bi bi-journal-bookmark"></i> Loan Schemes Master
            </a>

            <div class="sidebar-group-title">Services & Operations</div>
            <a href="<?php echo BASE_URL; ?>admin/services.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'services' && strpos($_SERVER['REQUEST_URI'], 'service_workflow_builder') === false ? 'active' : ''; ?>">
                <i class="bi bi-gear"></i> Service Catalog CMS
            </a>
            <a href="<?php echo BASE_URL; ?>admin/service_workflow_builder.php" class="sidebar-link <?php echo strpos($_SERVER['REQUEST_URI'], 'service_workflow_builder') !== false ? 'active' : ''; ?>">
                <i class="bi bi-diagram-3-fill"></i> Dynamic Workflow Builder
            </a>

            <div class="sidebar-group-title">Franchise & Ecosystem</div>
            <a href="<?php echo BASE_URL; ?>admin/franchises.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'franchises' ? 'active' : ''; ?>">
                <i class="bi bi-diagram-3"></i> Franchise Network
            </a>
            <a href="<?php echo BASE_URL; ?>admin/ecosystem_requirements.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'ecosystem' ? 'active' : ''; ?>">
                <i class="bi bi-cpu-fill"></i> Ecosystem (Machinery/Raw)
            </a>
            <a href="<?php echo BASE_URL; ?>admin/commissions.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'commissions' ? 'active' : ''; ?>">
                <i class="bi bi-wallet2"></i> Commissions & Payouts
            </a>
            <a href="<?php echo BASE_URL; ?>admin/payments.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'payments' ? 'active' : ''; ?>">
                <i class="bi bi-credit-card"></i> Payments & Verifications
            </a>

            <div class="sidebar-group-title">System & Security</div>
            <a href="<?php echo BASE_URL; ?>admin/tasks.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'leads' && strpos($_SERVER['REQUEST_URI'], 'tasks') !== false ? 'active' : ''; ?>">
                <i class="bi bi-check2-square"></i> Staff Tasks
            </a>
            <a href="<?php echo BASE_URL; ?>admin/reports.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'reports' ? 'active' : ''; ?>">
                <i class="bi bi-graph-up"></i> Reports & Analytics
            </a>
            <a href="<?php echo BASE_URL; ?>admin/staff.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'staff' ? 'active' : ''; ?>">
                <i class="bi bi-shield-lock"></i> Staff & RBAC
            </a>
            <a href="<?php echo BASE_URL; ?>admin/settings.php" class="sidebar-link <?php echo ($active_menu ?? '') === 'staff' && strpos($_SERVER['REQUEST_URI'], 'settings') !== false ? 'active' : ''; ?>">
                <i class="bi bi-sliders"></i> Enterprise Settings
            </a>
            <a href="<?php echo BASE_URL; ?>logout.php" class="sidebar-link text-danger mt-3">
                <i class="bi bi-box-arrow-right"></i> Logout
            </a>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-main">
        <header class="admin-header">
            <!-- Global Header Search Bar -->
            <div class="d-flex align-items-center gap-3 flex-grow-1 max-w-500">
                <form action="<?php echo BASE_URL; ?>admin/crm_leads.php" method="GET" class="w-100 position-relative">
                    <input type="text" name="q" class="form-control rounded-pill px-4" placeholder="Global Search (Lead ID, Cust ID, Mobile, Name)...">
                </form>
            </div>

            <!-- Header Utility Actions -->
            <div class="d-flex align-items-center gap-3">
                <!-- Notification Bell -->
                <a href="<?php echo BASE_URL; ?>admin/followups_today.php" class="position-relative text-dark fs-5 text-decoration-none" title="Follow-up Reminders">
                    <i class="bi bi-bell-fill text-warning"></i>
                    <?php if ($unread_notifications > 0): ?>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-7">
                            <?php echo $unread_notifications; ?>
                        </span>
                    <?php endif; ?>
                </a>

                <span class="badge bg-primary px-3 py-2 rounded-pill"><?php echo htmlspecialchars($current_user['role_name'] ?? 'Staff'); ?></span>
                <span class="fw-bold text-dark"><?php echo htmlspecialchars($current_user['name']); ?></span>
                <a href="<?php echo BASE_URL; ?>logout.php" class="btn btn-sm btn-outline-danger rounded-pill px-3">Logout</a>
            </div>
        </header>
        <div class="admin-content">
