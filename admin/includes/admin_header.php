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

$uri = $_SERVER['REQUEST_URI'] ?? '';
$active_menu = $active_menu ?? '';

// Collapsible dropdown active checks
$is_hr_active = ($active_menu === 'staff' || strpos($uri, 'staff') !== false);
$is_mail_active = (strpos($uri, 'mailflow') !== false);
$is_sales_active = ($active_menu === 'payments' || strpos($uri, 'payments') !== false || strpos($uri, 'proposals') !== false || strpos($uri, 'estimates') !== false);
$is_comm_active = ($active_menu === 'commissions' || strpos($uri, 'commissions') !== false || strpos($uri, 'franchises') !== false);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title ?? 'DUS CRM & Enterprise Admin Panel'); ?></title>
    <!-- Google Font Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!-- Admin & CRM CSS (Perfex CRM Theme) -->
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/admin.css?v=<?php echo time(); ?>">
    <script>
        const BASE_URL = '<?php echo BASE_URL; ?>';
    </script>
</head>
<body>

<div class="admin-layout">
    <!-- Sidebar Navigation (Exact Perfex CRM Layout & Design) -->
    <aside class="admin-sidebar">
        <!-- 1. Top Profile Box Card -->
        <div class="sidebar-profile-card">
            <div class="sidebar-profile-avatar">
                <i class="bi bi-person-fill"></i>
            </div>
            <div class="sidebar-profile-info">
                <div class="sidebar-profile-name"><?php echo htmlspecialchars($current_user['name'] ?? 'Roshan Bhardwaj'); ?></div>
                <div class="sidebar-profile-email"><?php echo htmlspecialchars($current_user['email'] ?? 'care@digitalvyaparseva.com'); ?></div>
            </div>
        </div>

        <div class="sidebar-menu">
            <!-- 2. Dashboard -->
            <a href="<?php echo BASE_URL; ?>admin/index.php" class="sidebar-item-link <?php echo ($active_menu === 'dashboard') ? 'active' : ''; ?>">
                <span><i class="bi bi-aspect-ratio item-icon"></i> Dashboard</span>
            </a>

            <!-- 3. Customers -->
            <a href="<?php echo BASE_URL; ?>admin/customers.php" class="sidebar-item-link <?php echo ($active_menu === 'customers') ? 'active' : ''; ?>">
                <span><i class="bi bi-person item-icon"></i> Customers</span>
            </a>

            <!-- 4. HR records (Collapsible) -->
            <div class="sidebar-group-item">
                <a class="sidebar-item-link <?php echo !$is_hr_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuHr" role="button" aria-expanded="<?php echo $is_hr_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-people-fill item-icon"></i> HR records</span>
                    <i class="bi bi-chevron-left chevron-icon"></i>
                </a>
                <div class="collapse sidebar-submenu-list <?php echo $is_hr_active ? 'show' : ''; ?>" id="menuHr">
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=dashboard" class="sidebar-submenu-link"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=jobs" class="sidebar-submenu-link"><i class="bi bi-card-checklist me-2"></i> Job descriptions</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=org" class="sidebar-submenu-link"><i class="bi bi-diagram-3 me-2"></i> Org chart</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=onboarding" class="sidebar-submenu-link"><i class="bi bi-person-check me-2"></i> Onboarding</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php" class="sidebar-submenu-link <?php echo ($active_menu === 'staff' && strpos($uri, 'tasks') === false) ? 'active' : ''; ?>"><i class="bi bi-people me-2"></i> HR records</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=training" class="sidebar-submenu-link"><i class="bi bi-mortarboard me-2"></i> Training</a>
                    <a href="<?php echo BASE_URL; ?>admin/projects.php?tab=contracts" class="sidebar-submenu-link"><i class="bi bi-file-earmark-text me-2"></i> Contracts</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=dependants" class="sidebar-submenu-link"><i class="bi bi-person-heart me-2"></i> Dependants</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=layoff" class="sidebar-submenu-link"><i class="bi bi-x-circle me-2"></i> Layoff checklist</a>
                    <a href="<?php echo BASE_URL; ?>admin/staff.php?tab=qa" class="sidebar-submenu-link"><i class="bi bi-question-circle me-2"></i> Q&A</a>
                    <a href="<?php echo BASE_URL; ?>admin/reports.php" class="sidebar-submenu-link"><i class="bi bi-graph-up me-2"></i> Reports</a>
                    <a href="<?php echo BASE_URL; ?>admin/settings.php" class="sidebar-submenu-link"><i class="bi bi-gear me-2"></i> Settings</a>
                </div>
            </div>

            <!-- 5. Reminder -->
            <a href="<?php echo BASE_URL; ?>admin/followups_today.php" class="sidebar-item-link <?php echo (strpos($uri, 'followups_today') !== false) ? 'active' : ''; ?>">
                <span><i class="bi bi-calendar-event item-icon"></i> Reminder</span>
            </a>

            <!-- 6. MailFlow (Collapsible) -->
            <div class="sidebar-group-item">
                <a class="sidebar-item-link <?php echo !$is_mail_active ? 'collapsed' : ''; ?>" data-bs-toggle="collapse" href="#menuMailFlow" role="button" aria-expanded="<?php echo $is_mail_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-envelope item-icon"></i> MailFlow</span>
                    <i class="bi bi-chevron-left chevron-icon"></i>
                </a>
                <div class="collapse sidebar-submenu-list <?php echo $is_mail_active ? 'show' : ''; ?>" id="menuMailFlow">
                    <a href="<?php echo BASE_URL; ?>admin/reports.php?tab=mailflow" class="sidebar-submenu-link"><i class="bi bi-send me-2"></i> Email Campaigns</a>
                    <a href="<?php echo BASE_URL; ?>admin/reports.php?tab=maillogs" class="sidebar-submenu-link"><i class="bi bi-journal-text me-2"></i> Mail Logs</a>
                </div>
            </div>

            <!-- 7. StyleFlow -->
            <a href="<?php echo BASE_URL; ?>admin/settings.php?tab=styleflow" class="sidebar-item-link">
                <span><i class="bi bi-palette item-icon"></i> StyleFlow</span>
            </a>

            <!-- 8. Sales (Collapsible) -->
            <div class="sidebar-group-item">
                <a class="sidebar-item-link <?php echo !$is_sales_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuSales" role="button" aria-expanded="<?php echo $is_sales_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-lightning-charge-fill item-icon"></i> Sales</span>
                    <i class="bi bi-chevron-left chevron-icon"></i>
                </a>
                <div class="collapse sidebar-submenu-list <?php echo $is_sales_active ? 'show' : ''; ?>" id="menuSales">
                    <a href="<?php echo BASE_URL; ?>admin/payments.php" class="sidebar-submenu-link <?php echo ($active_menu === 'payments') ? 'active' : ''; ?>"><i class="bi bi-file-earmark-spreadsheet me-2"></i> Invoices</a>
                    <a href="<?php echo BASE_URL; ?>admin/crm_leads.php?view=estimates" class="sidebar-submenu-link"><i class="bi bi-file-earmark-text me-2"></i> Estimates</a>
                    <a href="<?php echo BASE_URL; ?>admin/crm_leads.php?view=proposals" class="sidebar-submenu-link"><i class="bi bi-file-earmark-check me-2"></i> Proposals</a>
                    <a href="<?php echo BASE_URL; ?>admin/payments.php" class="sidebar-submenu-link"><i class="bi bi-credit-card me-2"></i> Payments</a>
                    <a href="<?php echo BASE_URL; ?>admin/payments.php?tab=credit" class="sidebar-submenu-link"><i class="bi bi-receipt me-2"></i> Credit Notes</a>
                </div>
            </div>

            <!-- 9. Subscriptions -->
            <a href="<?php echo BASE_URL; ?>admin/services.php" class="sidebar-item-link <?php echo ($active_menu === 'services' && strpos($uri, 'service_workflow_builder') === false) ? 'active' : ''; ?>">
                <span><i class="bi bi-arrow-repeat item-icon"></i> Subscriptions</span>
            </a>

            <!-- 10. Expenses -->
            <a href="<?php echo BASE_URL; ?>admin/commissions.php?tab=expenses" class="sidebar-item-link">
                <span><i class="bi bi-file-earmark-text item-icon"></i> Expenses</span>
            </a>

            <!-- 11. Contracts -->
            <a href="<?php echo BASE_URL; ?>admin/projects.php?tab=contracts" class="sidebar-item-link">
                <span><i class="bi bi-file-earmark item-icon"></i> Contracts</span>
            </a>

            <!-- 12. Projects -->
            <a href="<?php echo BASE_URL; ?>admin/projects.php" class="sidebar-item-link <?php echo ($active_menu === 'projects') ? 'active' : ''; ?>">
                <span><i class="bi bi-bar-chart-steps item-icon"></i> Projects</span>
            </a>

            <!-- 13. Commission (Collapsible) -->
            <div class="sidebar-group-item">
                <a class="sidebar-item-link <?php echo !$is_comm_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuCommission" role="button" aria-expanded="<?php echo $is_comm_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-percent item-icon"></i> Commission</span>
                    <i class="bi bi-chevron-left chevron-icon"></i>
                </a>
                <div class="collapse sidebar-submenu-list <?php echo $is_comm_active ? 'show' : ''; ?>" id="menuCommission">
                    <a href="<?php echo BASE_URL; ?>admin/franchises.php" class="sidebar-submenu-link <?php echo ($active_menu === 'franchises') ? 'active' : ''; ?>"><i class="bi bi-shop me-2"></i> Franchise Network</a>
                    <a href="<?php echo BASE_URL; ?>admin/commissions.php" class="sidebar-submenu-link <?php echo ($active_menu === 'commissions') ? 'active' : ''; ?>"><i class="bi bi-wallet2 me-2"></i> Commission Ledger</a>
                </div>
            </div>

            <!-- 14. Tasks -->
            <a href="<?php echo BASE_URL; ?>admin/tasks.php" class="sidebar-item-link <?php echo (strpos($uri, 'tasks') !== false) ? 'active' : ''; ?>">
                <span><i class="bi bi-check-circle item-icon"></i> Tasks</span>
            </a>

            <!-- 15. Support -->
            <a href="<?php echo BASE_URL; ?>admin/ecosystem_requirements.php" class="sidebar-item-link <?php echo ($active_menu === 'ecosystem') ? 'active' : ''; ?>">
                <span><i class="bi bi-life-preserver item-icon"></i> Support</span>
            </a>

            <!-- 16. Leads -->
            <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="sidebar-item-link <?php echo ($active_menu === 'leads' && strpos($uri, 'followups') === false && strpos($uri, 'appointments') === false) ? 'active' : ''; ?>">
                <span><i class="bi bi-crosshair item-icon"></i> Leads</span>
            </a>

            <!-- 17. Estimate Request -->
            <a href="<?php echo BASE_URL; ?>admin/crm_leads.php?view=estimates" class="sidebar-item-link">
                <span><i class="bi bi-file-earmark-text item-icon"></i> Estimate Request</span>
            </a>

            <!-- Logout -->
            <a href="<?php echo BASE_URL; ?>logout.php" class="sidebar-item-link text-danger mt-3">
                <span><i class="bi bi-box-arrow-right item-icon text-danger"></i> Logout</span>
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
