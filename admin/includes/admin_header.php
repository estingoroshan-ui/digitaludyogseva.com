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

$is_crm_active = ($active_menu === 'leads' || $active_menu === 'customers' || strpos($uri, 'crm_lead') !== false || strpos($uri, 'followup') !== false || strpos($uri, 'appointment') !== false || strpos($uri, 'lead_import') !== false);
$is_sales_active = ($active_menu === 'payments' || $active_menu === 'commissions' || strpos($uri, 'payments') !== false || strpos($uri, 'commissions') !== false);
$is_services_active = ($active_menu === 'projects' || $active_menu === 'services' || strpos($uri, 'service') !== false || strpos($uri, 'projects') !== false);
$is_loans_active = ($active_menu === 'loan_apps' || $active_menu === 'loan_schemes' || strpos($uri, 'loan') !== false);
$is_franchise_active = ($active_menu === 'franchises' || $active_menu === 'ecosystem' || strpos($uri, 'franchise') !== false || strpos($uri, 'ecosystem') !== false);
$is_hr_active = ($active_menu === 'staff' || strpos($uri, 'staff') !== false || strpos($uri, 'tasks') !== false);
$is_system_active = ($active_menu === 'reports' || strpos($uri, 'reports') !== false || strpos($uri, 'settings') !== false);
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
    <!-- Sidebar Navigation (Perfex CRM Style Collapsible Accordion) -->
    <aside class="admin-sidebar">
        <div class="sidebar-header">
            <span class="brand-badge me-2">DUS</span>
            <div>
                <h6 class="fw-bold text-white mb-0">Digital Udyog Seva</h6>
                <small class="text-muted fs-7">Enterprise Command</small>
            </div>
        </div>

        <div class="sidebar-menu">
            <!-- 1. DASHBOARD -->
            <a href="<?php echo BASE_URL; ?>admin/index.php" class="sidebar-link mb-2 <?php echo ($active_menu === 'dashboard') ? 'active' : ''; ?>">
                <i class="bi bi-speedometer2"></i> Dashboard
            </a>

            <!-- 2. CRM & SALES -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_crm_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuCrm" role="button" aria-expanded="<?php echo $is_crm_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-funnel me-2"></i> CRM & Sales</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_crm_active ? 'show' : ''; ?>" id="menuCrm">
                    <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="sidebar-link <?php echo ($active_menu === 'leads' && strpos($uri, 'followups') === false && strpos($uri, 'appointments') === false && strpos($uri, 'lead_import') === false) ? 'active' : ''; ?>">
                        <i class="bi bi-diagram-3 me-2"></i> Leads & 21-Stage Pipeline
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/lead_import.php" class="sidebar-link <?php echo strpos($uri, 'lead_import') !== false ? 'active' : ''; ?>">
                        <i class="bi bi-file-earmark-arrow-up me-2"></i> Bulk Lead Import
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/followups_today.php" class="sidebar-link <?php echo strpos($uri, 'followups_today') !== false ? 'active' : ''; ?>">
                        <i class="bi bi-clock-history me-2"></i> Today's Follow-ups
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/appointments.php" class="sidebar-link <?php echo strpos($uri, 'appointments') !== false ? 'active' : ''; ?>">
                        <i class="bi bi-calendar-check me-2"></i> Appointments Calendar
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/customers.php" class="sidebar-link <?php echo ($active_menu === 'customers') ? 'active' : ''; ?>">
                        <i class="bi bi-people me-2"></i> 360° Customer Master
                    </a>
                </div>
            </div>

            <!-- 3. SALES & FINANCE -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_sales_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuSales" role="button" aria-expanded="<?php echo $is_sales_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-receipt me-2"></i> Sales & Finance</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_sales_active ? 'show' : ''; ?>" id="menuSales">
                    <a href="<?php echo BASE_URL; ?>admin/payments.php" class="sidebar-link <?php echo ($active_menu === 'payments') ? 'active' : ''; ?>">
                        <i class="bi bi-credit-card me-2"></i> Payments & Billing
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/payments.php?tab=offline" class="sidebar-link">
                        <i class="bi bi-cash-stack me-2"></i> Offline Verification
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/commissions.php" class="sidebar-link <?php echo ($active_menu === 'commissions') ? 'active' : ''; ?>">
                        <i class="bi bi-wallet2 me-2"></i> Commission Ledger
                    </a>
                </div>
            </div>

            <!-- 4. SERVICES & OPERATIONS -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_services_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuServices" role="button" aria-expanded="<?php echo $is_services_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-gear-wide-connected me-2"></i> Services & Operations</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_services_active ? 'show' : ''; ?>" id="menuServices">
                    <a href="<?php echo BASE_URL; ?>admin/projects.php" class="sidebar-link <?php echo ($active_menu === 'projects') ? 'active' : ''; ?>">
                        <i class="bi bi-briefcase-fill me-2"></i> Service Projects & Cases
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/services.php" class="sidebar-link <?php echo ($active_menu === 'services' && strpos($uri, 'service_workflow_builder') === false) ? 'active' : ''; ?>">
                        <i class="bi bi-sliders me-2"></i> Service Catalog CMS
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/service_workflow_builder.php" class="sidebar-link <?php echo strpos($uri, 'service_workflow_builder') !== false ? 'active' : ''; ?>">
                        <i class="bi bi-diagram-3-fill me-2"></i> Dynamic Workflow Builder
                    </a>
                </div>
            </div>

            <!-- 5. GOVERNMENT LOANS & SCORECARDS -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_loans_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuLoans" role="button" aria-expanded="<?php echo $is_loans_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-bank me-2"></i> Loans & Scorecards</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_loans_active ? 'show' : ''; ?>" id="menuLoans">
                    <a href="<?php echo BASE_URL; ?>admin/loan_applications.php" class="sidebar-link <?php echo ($active_menu === 'loan_apps') ? 'active' : ''; ?>">
                        <i class="bi bi-file-text me-2"></i> Loan Applications & Cases
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/loan_schemes.php" class="sidebar-link <?php echo ($active_menu === 'loan_schemes') ? 'active' : ''; ?>">
                        <i class="bi bi-journal-bookmark me-2"></i> Loan Schemes Master
                    </a>
                </div>
            </div>

            <!-- 6. FRANCHISE & ECOSYSTEM -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_franchise_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuFranchise" role="button" aria-expanded="<?php echo $is_franchise_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-diagram-3 me-2"></i> Franchise & Ecosystem</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_franchise_active ? 'show' : ''; ?>" id="menuFranchise">
                    <a href="<?php echo BASE_URL; ?>admin/franchises.php" class="sidebar-link <?php echo ($active_menu === 'franchises') ? 'active' : ''; ?>">
                        <i class="bi bi-shop me-2"></i> Franchise Network
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/ecosystem_requirements.php" class="sidebar-link <?php echo ($active_menu === 'ecosystem') ? 'active' : ''; ?>">
                        <i class="bi bi-cpu-fill me-2"></i> Ecosystem (Machinery/Raw)
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/commissions.php" class="sidebar-link <?php echo ($active_menu === 'commissions') ? 'active' : ''; ?>">
                        <i class="bi bi-wallet2 me-2"></i> Commissions & Payouts
                    </a>
                </div>
            </div>

            <!-- 7. HR RECORDS (Perfex CRM Style HR Records Collapsible Category) -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_hr_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuHr" role="button" aria-expanded="<?php echo $is_hr_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-person-workspace me-2"></i> HR Records</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_hr_active ? 'show' : ''; ?>" id="menuHr">
                    <a href="<?php echo BASE_URL; ?>admin/staff.php" class="sidebar-link <?php echo ($active_menu === 'staff' && strpos($uri, 'tasks') === false) ? 'active' : ''; ?>">
                        <i class="bi bi-shield-lock me-2"></i> Staff Directory & RBAC
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/tasks.php" class="sidebar-link <?php echo strpos($uri, 'tasks') !== false ? 'active' : ''; ?>">
                        <i class="bi bi-check2-square me-2"></i> Staff Tasks & Reminders
                    </a>
                </div>
            </div>

            <!-- 8. SYSTEM & SETTINGS -->
            <div class="sidebar-category-item">
                <a class="sidebar-category-toggle <?php echo !$is_system_active ? 'collapsed' : 'active'; ?>" data-bs-toggle="collapse" href="#menuSystem" role="button" aria-expanded="<?php echo $is_system_active ? 'true' : 'false'; ?>">
                    <span><i class="bi bi-sliders me-2"></i> System & Settings</span>
                    <i class="bi bi-chevron-right toggle-icon"></i>
                </a>
                <div class="collapse sidebar-submenu <?php echo $is_system_active ? 'show' : ''; ?>" id="menuSystem">
                    <a href="<?php echo BASE_URL; ?>admin/reports.php" class="sidebar-link <?php echo ($active_menu === 'reports') ? 'active' : ''; ?>">
                        <i class="bi bi-graph-up me-2"></i> Reports & Analytics
                    </a>
                    <a href="<?php echo BASE_URL; ?>admin/settings.php" class="sidebar-link <?php echo strpos($uri, 'settings') !== false ? 'active' : ''; ?>">
                        <i class="bi bi-gear-fill me-2"></i> Enterprise Settings
                    </a>
                </div>
            </div>

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
