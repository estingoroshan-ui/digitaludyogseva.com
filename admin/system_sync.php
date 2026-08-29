<?php
$page_title = "System Health & Database Synchronization Desk";
$active_menu = "settings";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;

$sync_msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'run_full_migration') {
        try {
            ensure_phase1_tables_exist($pdo);
            ensure_phase2_customer_tables_exist($pdo);
            ensure_phase3_lead_tables_exist($pdo);
            ensure_phase4_hr_tables_exist($pdo);
            ensure_phase5_project_tables_exist($pdo);
            ensure_loan_case_tables_exist($pdo);
            $sync_msg = '<div class="alert alert-success border-0 shadow-sm rounded-4 p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> All Database Tables, 17 Loan Types, Bank Masters & Schemas successfully verified and synchronized!</div>';
        } catch (Throwable $e) {
            $sync_msg = '<div class="alert alert-danger border-0 shadow-sm rounded-4 p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Migration error: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
}

// Inspect Modules and Tables
$modules_check = [
    'Loan Case Management (STEP 1)' => [
        'loan_types' => '17 Master Loan Products',
        'lenders' => 'Banks & NBFC Partner Directory',
        'cases' => 'Loan Cases Operations Registry',
        'case_bank_applications' => 'Multi-Bank Login Applications',
        'case_stage_history' => 'Pipeline Stage Audit Trail',
        'case_staff_assignments' => 'Staff Case Assignment Tracker',
        'case_followups' => 'Client Follow-ups & Reminders'
    ],
    'Leads CRM Engine' => [
        'leads' => 'Leads Database',
        'lead_statuses' => 'Lead Pipeline Statuses',
        'lead_sources' => 'Acquisition Sources Master',
        'lead_notes' => 'Lead Notes & Discussion',
        'lead_reminders' => 'Lead Follow-up Scheduler',
        'lead_attachments' => 'Lead Document Repository'
    ],
    'HR & Employee Management' => [
        'employees' => 'Staff Directory',
        'job_positions' => 'Job Roles Master',
        'hr_onboarding' => 'Onboarding Checklists',
        'hr_training' => 'Training Program Registry',
        'hr_dependants' => 'Family Records',
        'hr_qa' => 'Company Policies Q&A'
    ],
    'Core Foundation' => [
        'customers' => 'Customer Profiles',
        'users' => 'Panel Users & Admins',
        'services' => 'Portal Services Master',
        'departments' => 'Organization Departments'
    ]
];
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h3 class="font-heading fw-bold text-dark mb-1">System Health & Database Synchronization Desk</h3>
        <p class="text-muted small mb-0">Live diagnostics of all database tables, masters, and automated pipeline schemas.</p>
    </div>
    <div class="d-flex gap-2">
        <form method="POST" class="d-inline">
            <input type="hidden" name="action" value="run_full_migration">
            <button type="submit" class="btn btn-success rounded-pill px-4 fw-bold shadow-sm">
                <i class="bi bi-arrow-repeat me-2"></i> Run Full Auto-Repair & Sync
            </button>
        </form>
        <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
            <i class="bi bi-briefcase me-2"></i> Go to Loan Cases
        </a>
    </div>
</div>

<?php echo $sync_msg; ?>

<div class="row g-4">
    <?php foreach ($modules_check as $mod_name => $tables): ?>
        <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-header bg-white border-bottom py-3 px-4">
                    <h6 class="font-heading fw-bold mb-0 text-primary">
                        <i class="bi bi-hdd-stack me-2"></i> <?php echo htmlspecialchars($mod_name); ?>
                    </h6>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Table Name</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th class="text-end pe-4">Records</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($tables as $tbl => $desc): 
                                    $exists = false;
                                    $count = 0;
                                    try {
                                        $c = $pdo->query("SELECT COUNT(*) FROM `{$tbl}`")->fetchColumn();
                                        $exists = true;
                                        $count = (int)$c;
                                    } catch (Throwable $e) {
                                        $exists = false;
                                    }
                                ?>
                                <tr>
                                    <td class="ps-4 fw-bold font-monospace small">
                                        <?php echo htmlspecialchars($tbl); ?>
                                    </td>
                                    <td class="small text-muted">
                                        <?php echo htmlspecialchars($desc); ?>
                                    </td>
                                    <td>
                                        <?php if ($exists): ?>
                                            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2">
                                                <i class="bi bi-check-circle me-1"></i> Active
                                            </span>
                                        <?php else: ?>
                                            <span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2">
                                                <i class="bi bi-x-circle me-1"></i> Missing
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="text-end pe-4 fw-bold small">
                                        <?php echo $exists ? number_format($count) : '-'; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<div class="card border-0 shadow-sm rounded-4 mt-4 p-4 bg-light">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
            <h5 class="fw-bold mb-1 text-dark">Quick Navigation & Workspaces</h5>
            <p class="text-muted small mb-0">Access all upgraded modules directly from here.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
            <a href="<?php echo BASE_URL; ?>admin/projects.php" class="btn btn-outline-primary rounded-pill px-3 fw-bold small">
                <i class="bi bi-briefcase me-1"></i> Loan Cases
            </a>
            <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="btn btn-outline-success rounded-pill px-3 fw-bold small">
                <i class="bi bi-funnel me-1"></i> Leads CRM
            </a>
            <a href="<?php echo BASE_URL; ?>admin/loan_types.php" class="btn btn-outline-info rounded-pill px-3 fw-bold small">
                <i class="bi bi-tags me-1"></i> Loan Types
            </a>
            <a href="<?php echo BASE_URL; ?>admin/lenders.php" class="btn btn-outline-warning rounded-pill px-3 fw-bold small text-dark">
                <i class="bi bi-bank me-1"></i> Bank Master
            </a>
            <a href="<?php echo BASE_URL; ?>admin/customers.php" class="btn btn-outline-dark rounded-pill px-3 fw-bold small">
                <i class="bi bi-people me-1"></i> Customers
            </a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
