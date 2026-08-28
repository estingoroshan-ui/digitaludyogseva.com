<?php
$page_title = "Loan Cases & Operations Manager";
$active_menu = "projects";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

// Handle Actions (Create Case, Change Stage, Assign Staff)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // 1. Create New Loan Case
    if ($action === 'create_case') {
        $customer_id = (int)($_POST['customer_id'] ?? 0);
        $loan_type_id = (int)($_POST['loan_type_id'] ?? 0);
        $required_amount = (float)($_POST['required_loan_amount'] ?? 0);
        $loan_purpose = sanitize($_POST['loan_purpose'] ?? '');
        $preferred_bank_id = (int)($_POST['preferred_bank_id'] ?? 0);
        $expected_rate = (float)($_POST['expected_interest_rate'] ?? 0);
        $expected_tenure = (int)($_POST['expected_tenure_months'] ?? 0);
        $priority = sanitize($_POST['priority'] ?? 'Medium');
        $assigned_staff_id = (int)($_POST['assigned_staff_id'] ?? 0);
        $deadline = $_POST['deadline'] ?: null;
        $cibil_score = (int)($_POST['cibil_score'] ?? 0);

        // Business Details
        $customer_type = sanitize($_POST['customer_type'] ?? 'Individual');
        $business_name = sanitize($_POST['business_name'] ?? '');
        $gstin = sanitize($_POST['gstin'] ?? '');
        $annual_turnover = (float)($_POST['annual_turnover'] ?? 0);
        $itr_income = (float)($_POST['itr_income'] ?? 0);
        $pan_number = strtoupper(sanitize($_POST['pan_number'] ?? ''));
        $aadhaar_last_4 = sanitize($_POST['aadhaar_last_4'] ?? '');

        // Fetch Names for cached columns
        $loan_type_name = 'Other Loan';
        if ($loan_type_id > 0) {
            $lt = $pdo->prepare("SELECT name FROM loan_types WHERE id = ?");
            $lt->execute([$loan_type_id]);
            $loan_type_name = $lt->fetchColumn() ?: 'Other Loan';
        }

        $bank_name = 'Multiple / Unspecified';
        if ($preferred_bank_id > 0) {
            $bn = $pdo->prepare("SELECT name FROM lenders WHERE id = ?");
            $bn->execute([$preferred_bank_id]);
            $bank_name = $bn->fetchColumn() ?: 'Multiple / Unspecified';
        }

        // Generate Case Code: DUS-CASE-YEAR-COUNT
        $year = date('Y');
        $count = $pdo->query("SELECT COUNT(*) FROM cases")->fetchColumn() + 1001;
        $case_code = "DUS-CASE-{$year}-{$count}";

        if ($customer_id > 0) {
            $ins = $pdo->prepare("
                INSERT INTO cases (
                    case_code, customer_id, project_name, loan_type_id, loan_type, required_loan_amount,
                    loan_purpose, preferred_bank_id, preferred_bank, expected_interest_rate, expected_tenure_months,
                    collateral_required, property_available, priority, assigned_staff_id, current_stage, status,
                    customer_type, business_name, gstin, annual_turnover, itr_income, cibil_score, pan_number, aadhaar_last_4,
                    deadline, total_amount, application_date, created_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, 'New Lead', 'active',
                    ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, NOW(), NOW()
                )
            ");
            $collateral = sanitize($_POST['collateral_required'] ?? 'No');
            $property = sanitize($_POST['property_available'] ?? 'No');

            $ins->execute([
                $case_code, $customer_id, "{$loan_type_name} - {$case_code}", $loan_type_id, $loan_type_name, $required_amount,
                $loan_purpose, $preferred_bank_id, $bank_name, $expected_rate, $expected_tenure,
                $collateral, $property, $priority, $assigned_staff_id ?: null,
                $customer_type, $business_name, $gstin, $annual_turnover, $itr_income, $cibil_score, $pan_number, $aadhaar_last_4,
                $deadline, $required_amount
            ]);

            $case_id = $pdo->lastInsertId();

            // Log Initial Stage History
            $history = $pdo->prepare("INSERT INTO case_stage_history (case_id, previous_stage, new_stage, changed_by, remarks) VALUES (?, NULL, 'New Lead', ?, 'New Loan Case Created')");
            $history->execute([$case_id, $current_user['id'] ?? 1]);

            // Log Staff Assignment if provided
            if ($assigned_staff_id > 0) {
                $stf = $pdo->prepare("INSERT INTO case_staff_assignments (case_id, staff_id, role_title, assigned_by) VALUES (?, ?, 'Case Manager', ?)");
                $stf->execute([$case_id, $assigned_staff_id, $current_user['id'] ?? 1]);
            }

            ActivityLogger::log('create_loan_case', 'case', $case_id, "Created Loan Case {$case_code} for amount ₹{$required_amount}");
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> New Loan Case <strong>' . $case_code . '</strong> created successfully! <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        } else {
            $msg = '<div class="alert alert-danger alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Please select a valid customer. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // 2. Quick Stage Transition
    elseif ($action === 'change_stage') {
        $case_id = (int)$_POST['case_id'];
        $new_stage = sanitize($_POST['new_stage'] ?? '');
        $remarks = sanitize($_POST['stage_remarks'] ?? '');

        if ($case_id && $new_stage) {
            $prev_stmt = $pdo->prepare("SELECT current_stage, status FROM cases WHERE id = ?");
            $prev_stmt->execute([$case_id]);
            $current_case = $prev_stmt->fetch();
            $prev_stage = $current_case['current_stage'] ?: 'New Lead';

            // Map Status based on Stage
            $new_status = 'active';
            if (in_array($new_stage, ['Sanctioned', 'Agreement Pending', 'Disbursement Pending', 'Partially Disbursed'])) {
                $new_status = 'sanctioned';
            } elseif (in_array($new_stage, ['Fully Disbursed', 'Completed'])) {
                $new_status = 'completed';
            } elseif (in_array($new_stage, ['On Hold', 'Customer Not Interested'])) {
                $new_status = 'on_hold';
            } elseif (strpos($new_stage, 'Rejected') === 0 || in_array($new_stage, ['Cancelled', 'Duplicate'])) {
                $new_status = 'rejected';
            }

            $upd = $pdo->prepare("UPDATE cases SET current_stage = ?, status = ?, updated_at = NOW() WHERE id = ?");
            $upd->execute([$new_stage, $new_status, $case_id]);

            // Save immutable history
            $hist = $pdo->prepare("INSERT INTO case_stage_history (case_id, previous_stage, new_stage, changed_by, remarks) VALUES (?, ?, ?, ?, ?)");
            $hist->execute([$case_id, $prev_stage, $new_stage, $current_user['id'] ?? 1, $remarks]);

            ActivityLogger::log('change_case_stage', 'case', $case_id, "Stage changed from '{$prev_stage}' to '{$new_stage}'");
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-diagram-2-fill me-2"></i> Case pipeline stage updated to <strong>' . htmlspecialchars($new_stage) . '</strong>. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // 3. Quick Staff Assignment
    elseif ($action === 'assign_staff') {
        $case_id = (int)$_POST['case_id'];
        $staff_id = (int)$_POST['staff_id'];
        $role_title = sanitize($_POST['role_title'] ?? 'Case Officer');

        if ($case_id && $staff_id) {
            $upd = $pdo->prepare("UPDATE cases SET assigned_staff_id = ? WHERE id = ?");
            $upd->execute([$staff_id, $case_id]);

            $ins = $pdo->prepare("INSERT INTO case_staff_assignments (case_id, staff_id, role_title, assigned_by) VALUES (?, ?, ?, ?)");
            $ins->execute([$case_id, $staff_id, $role_title, $current_user['id'] ?? 1]);

            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-person-check-fill me-2"></i> Case assigned to staff member successfully. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
}

// ----------------------------------------------------
// FILTERS & TAB BUILDER
// ----------------------------------------------------
$tab = isset($_GET['tab']) ? sanitize($_GET['tab']) : 'all';
$search = isset($_GET['search']) ? sanitize($_GET['search']) : '';
$filter_loan_type = isset($_GET['loan_type_id']) ? (int)$_GET['loan_type_id'] : 0;
$filter_bank = isset($_GET['bank_id']) ? (int)$_GET['bank_id'] : 0;
$filter_stage = isset($_GET['stage']) ? sanitize($_GET['stage']) : '';
$filter_staff = isset($_GET['staff_id']) ? (int)$_GET['staff_id'] : 0;
$filter_priority = isset($_GET['priority']) ? sanitize($_GET['priority']) : '';

$where_clauses = ["1=1"];
$params = [];

if ($tab === 'new') {
    $where_clauses[] = "(c.current_stage = 'New Lead' OR c.status = 'new')";
} elseif ($tab === 'doc_pending') {
    $where_clauses[] = "c.current_stage IN ('Documents Pending', 'Additional Documents Required')";
} elseif ($tab === 'bank_login') {
    $where_clauses[] = "c.current_stage IN ('Ready For Bank Login', 'Submitted To Bank', 'Bank Login Completed')";
} elseif ($tab === 'under_process') {
    $where_clauses[] = "c.current_stage IN ('Under Verification', 'Field Verification', 'Credit Assessment', 'Underwriting', 'Approval Pending')";
} elseif ($tab === 'sanctioned') {
    $where_clauses[] = "(c.current_stage = 'Sanctioned' OR c.status = 'sanctioned')";
} elseif ($tab === 'disbursement_pending') {
    $where_clauses[] = "c.current_stage IN ('Agreement Pending', 'Disbursement Pending', 'Partially Disbursed')";
} elseif ($tab === 'disbursed') {
    $where_clauses[] = "(c.current_stage = 'Fully Disbursed' OR c.status = 'completed')";
} elseif ($tab === 'rejected') {
    $where_clauses[] = "(c.current_stage LIKE 'Rejected%' OR c.status = 'rejected')";
} elseif ($tab === 'on_hold') {
    $where_clauses[] = "(c.current_stage = 'On Hold' OR c.status = 'on_hold')";
} elseif ($tab === 'overdue') {
    $where_clauses[] = "(c.next_followup_date IS NOT NULL AND c.next_followup_date < NOW())";
}

if ($search) {
    $where_clauses[] = "(c.case_code LIKE ? OR cust.name LIKE ? OR cust.mobile LIKE ? OR c.pan_number LIKE ? OR c.business_name LIKE ?)";
    $term = "%{$search}%";
    $params = array_merge($params, [$term, $term, $term, $term, $term]);
}
if ($filter_loan_type > 0) {
    $where_clauses[] = "c.loan_type_id = ?";
    $params[] = $filter_loan_type;
}
if ($filter_bank > 0) {
    $where_clauses[] = "c.preferred_bank_id = ?";
    $params[] = $filter_bank;
}
if ($filter_stage) {
    $where_clauses[] = "c.current_stage = ?";
    $params[] = $filter_stage;
}
if ($filter_staff > 0) {
    $where_clauses[] = "c.assigned_staff_id = ?";
    $params[] = $filter_staff;
}
if ($filter_priority) {
    $where_clauses[] = "c.priority = ?";
    $params[] = $filter_priority;
}

$where_sql = implode(" AND ", $where_clauses);

// ----------------------------------------------------
// REAL DATABASE KPI METRICS
// ----------------------------------------------------
$total_cases = $pdo->query("SELECT COUNT(*) FROM cases")->fetchColumn();
$new_cases_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage = 'New Lead' OR status = 'new'")->fetchColumn();
$doc_pending_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage IN ('Documents Pending', 'Additional Documents Required')")->fetchColumn();
$bank_login_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage IN ('Ready For Bank Login', 'Submitted To Bank', 'Bank Login Completed')")->fetchColumn();
$under_process_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage IN ('Under Verification', 'Field Verification', 'Credit Assessment', 'Underwriting', 'Approval Pending')")->fetchColumn();
$sanctioned_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage = 'Sanctioned' OR status = 'sanctioned'")->fetchColumn();
$disb_pending_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage IN ('Agreement Pending', 'Disbursement Pending', 'Partially Disbursed')")->fetchColumn();
$disbursed_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage = 'Fully Disbursed' OR status = 'completed'")->fetchColumn();
$rejected_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE current_stage LIKE 'Rejected%' OR status = 'rejected'")->fetchColumn();
$overdue_count = $pdo->query("SELECT COUNT(*) FROM cases WHERE next_followup_date IS NOT NULL AND next_followup_date < NOW()")->fetchColumn();

// FINANCIAL TOTALS
$total_requested_amount = $pdo->query("SELECT SUM(COALESCE(required_loan_amount, total_amount)) FROM cases")->fetchColumn() ?: 0;
$total_sanctioned_amount = $pdo->query("SELECT SUM(COALESCE(sanctioned_amount, 0)) FROM cases")->fetchColumn() ?: 0;
$total_disbursed_amount = $pdo->query("SELECT SUM(COALESCE(disbursed_amount, 0)) FROM cases")->fetchColumn() ?: 0;

// FETCH CASES LIST
$stmt = $pdo->prepare("
    SELECT c.*, cust.name AS customer_name, cust.mobile AS customer_mobile, cust.email AS customer_email,
           COALESCE(lt.name, c.loan_type, 'Other Loan') AS loan_type_display,
           COALESCE(ld.name, c.preferred_bank, 'Multiple Banks') AS bank_display,
           u.name AS staff_name,
           DATEDIFF(NOW(), c.created_at) AS ageing_days
    FROM cases c
    JOIN customers cust ON c.customer_id = cust.id
    LEFT JOIN loan_types lt ON c.loan_type_id = lt.id
    LEFT JOIN lenders ld ON c.preferred_bank_id = ld.id
    LEFT JOIN employees e ON c.assigned_staff_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    WHERE {$where_sql}
    ORDER BY c.id DESC
");
$stmt->execute($params);
$cases = $stmt->fetchAll();

// Fetch Dropdown Masters
$loan_types_list = $pdo->query("SELECT * FROM loan_types WHERE status = 'active' ORDER BY name ASC")->fetchAll();
$lenders_list = $pdo->query("SELECT * FROM lenders WHERE status = 'active' ORDER BY name ASC")->fetchAll();
$customers_list = $pdo->query("SELECT id, name, mobile FROM customers ORDER BY name ASC")->fetchAll();
$staff_list = $pdo->query("SELECT e.id, u.name FROM employees e JOIN users u ON e.user_id = u.id ORDER BY u.name ASC")->fetchAll();

$all_stages = [
    'New Lead', 'Customer Contacted', 'Documents Pending', 'Documents Received', 'Eligibility Check',
    'CIBIL Check', 'File Preparation', 'Ready For Bank Login', 'Submitted To Bank', 'Bank Login Completed',
    'Under Verification', 'Field Verification', 'Credit Assessment', 'Additional Documents Required',
    'Underwriting', 'Approval Pending', 'Sanctioned', 'Agreement Pending', 'Disbursement Pending',
    'Partially Disbursed', 'Fully Disbursed', 'Completed', 'On Hold', 'Customer Not Interested',
    'Rejected by Bank', 'Rejected – Low CIBIL', 'Rejected – Income Issue', 'Rejected – Documentation Issue',
    'Cancelled', 'Duplicate'
];
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-briefcase-fill text-primary me-2"></i> Loan Cases & Operations Desk</h4>
        <p class="text-muted small mb-0">Manage end-to-end loan applications, multi-bank logins, underwriting, sanctions & disbursements.</p>
    </div>
    <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#createCaseModal">
        <i class="bi bi-plus-circle me-2"></i> Create New Loan Case
    </button>
</div>

<?php echo $msg; ?>

<!-- FINANCIAL METRICS SUMMARY BAR -->
<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-primary text-white p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-white-50 text-uppercase fw-bold">Total Loan Requested</small>
                    <h3 class="fw-bold my-1">₹<?php echo format_inr($total_requested_amount); ?></h3>
                    <small class="text-white-50"><?php echo number_format($total_cases); ?> Total Applications</small>
                </div>
                <div class="stat-icon bg-white-20 text-white fs-3 p-3 rounded-circle">
                    <i class="bi bi-cash-stack"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-info text-white p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-white-50 text-uppercase fw-bold">Total Sanctioned</small>
                    <h3 class="fw-bold my-1">₹<?php echo format_inr($total_sanctioned_amount); ?></h3>
                    <small class="text-white-50"><?php echo number_format($sanctioned_count); ?> Sanctioned Cases</small>
                </div>
                <div class="stat-icon bg-white-20 text-white fs-3 p-3 rounded-circle">
                    <i class="bi bi-shield-check"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-success text-white p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-white-50 text-uppercase fw-bold">Total Disbursed</small>
                    <h3 class="fw-bold my-1">₹<?php echo format_inr($total_disbursed_amount); ?></h3>
                    <small class="text-white-50"><?php echo number_format($disbursed_count); ?> Fully Disbursed</small>
                </div>
                <div class="stat-icon bg-white-20 text-white fs-3 p-3 rounded-circle">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- PIPELINE KPI COUNTERS -->
<div class="row g-2 mb-4">
    <div class="col">
        <a href="?tab=all" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'all' ? 'border-start border-4 border-dark shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-dark d-block"><?php echo number_format($total_cases); ?></span>
            <small class="text-muted fw-bold">All Cases</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=new" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'new' ? 'border-start border-4 border-info shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-info d-block"><?php echo number_format($new_cases_count); ?></span>
            <small class="text-muted fw-bold">New Leads</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=doc_pending" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'doc_pending' ? 'border-start border-4 border-warning shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-warning d-block"><?php echo number_format($doc_pending_count); ?></span>
            <small class="text-muted fw-bold">Doc Pending</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=bank_login" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'bank_login' ? 'border-start border-4 border-primary shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-primary d-block"><?php echo number_format($bank_login_count); ?></span>
            <small class="text-muted fw-bold">Bank Login</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=under_process" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'under_process' ? 'border-start border-4 border-secondary shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-secondary d-block"><?php echo number_format($under_process_count); ?></span>
            <small class="text-muted fw-bold">Under Process</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=sanctioned" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'sanctioned' ? 'border-start border-4 border-success shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-success d-block"><?php echo number_format($sanctioned_count); ?></span>
            <small class="text-muted fw-bold">Sanctioned</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=disbursed" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'disbursed' ? 'border-start border-4 border-success shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-success d-block"><?php echo number_format($disbursed_count); ?></span>
            <small class="text-muted fw-bold">Disbursed</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=rejected" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'rejected' ? 'border-start border-4 border-danger shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-danger d-block"><?php echo number_format($rejected_count); ?></span>
            <small class="text-muted fw-bold">Rejected</small>
        </a>
    </div>
    <div class="col">
        <a href="?tab=overdue" class="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-center bg-white <?php echo $tab === 'overdue' ? 'border-start border-4 border-danger shadow' : ''; ?>">
            <span class="fs-4 fw-bold text-danger d-block"><?php echo number_format($overdue_count); ?></span>
            <small class="text-muted fw-bold">Overdue</small>
        </a>
    </div>
</div>

<!-- SEARCH & ADVANCED FILTER TOOLBAR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form action="" method="GET" class="row g-2 align-items-center">
        <input type="hidden" name="tab" value="<?php echo htmlspecialchars($tab); ?>">
        <div class="col-md-3">
            <input type="text" name="search" class="form-control rounded-pill px-3" placeholder="Search Case ID, Customer, PAN, Mobile..." value="<?php echo htmlspecialchars($search); ?>">
        </div>
        <div class="col-md-2">
            <select name="loan_type_id" class="form-select rounded-pill">
                <option value="0">All Loan Types...</option>
                <?php foreach ($loan_types_list as $lt): ?>
                    <option value="<?php echo $lt['id']; ?>" <?php echo $filter_loan_type === $lt['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($lt['name']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-2">
            <select name="bank_id" class="form-select rounded-pill">
                <option value="0">All Banks/NBFCs...</option>
                <?php foreach ($lenders_list as $ld): ?>
                    <option value="<?php echo $ld['id']; ?>" <?php echo $filter_bank === $ld['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($ld['name']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-2">
            <select name="stage" class="form-select rounded-pill">
                <option value="">All Pipeline Stages...</option>
                <?php foreach ($all_stages as $stg): ?>
                    <option value="<?php echo $stg; ?>" <?php echo $filter_stage === $stg ? 'selected' : ''; ?>><?php echo htmlspecialchars($stg); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-2">
            <select name="staff_id" class="form-select rounded-pill">
                <option value="0">Assigned Officer...</option>
                <?php foreach ($staff_list as $stf): ?>
                    <option value="<?php echo $stf['id']; ?>" <?php echo $filter_staff === $stf['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($stf['name']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-1">
            <button type="submit" class="btn btn-dark rounded-pill w-100 fw-bold"><i class="bi bi-funnel me-1"></i> Filter</button>
        </div>
    </form>
</div>

<!-- CASES DATA GRID -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Case ID</th>
                    <th>Customer Details</th>
                    <th>Loan Type</th>
                    <th>Required Amount</th>
                    <th>Bank / Lender</th>
                    <th>Current Stage</th>
                    <th>Assigned Staff</th>
                    <th>CIBIL</th>
                    <th>Ageing</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($cases)): ?>
                    <tr>
                        <td colspan="10" class="text-center py-5 text-muted">
                            <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                            No loan cases match the selected filter criteria.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($cases as $cs): ?>
                        <tr>
                            <td>
                                <a href="project_detail.php?id=<?php echo $cs['id']; ?>" class="fw-bold font-monospace text-primary text-decoration-none">
                                    <?php echo htmlspecialchars($cs['case_code']); ?>
                                </a>
                                <div><small class="text-muted"><?php echo date('d M Y', strtotime($cs['created_at'])); ?></small></div>
                            </td>
                            <td>
                                <a href="customers.php?id=<?php echo $cs['customer_id']; ?>" class="fw-bold text-dark text-decoration-none">
                                    <?php echo htmlspecialchars($cs['customer_name']); ?>
                                </a>
                                <div class="small text-muted"><i class="bi bi-telephone me-1"></i><?php echo htmlspecialchars($cs['customer_mobile']); ?></div>
                                <?php if ($cs['business_name']): ?><div class="small text-muted"><i class="bi bi-building me-1"></i><?php echo htmlspecialchars($cs['business_name']); ?></div><?php endif; ?>
                            </td>
                            <td><span class="badge bg-light text-dark border fw-semibold"><?php echo htmlspecialchars($cs['loan_type_display']); ?></span></td>
                            <td class="fw-bold text-dark">₹<?php echo format_inr($cs['required_loan_amount'] ?: $cs['total_amount']); ?></td>
                            <td><span class="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1"><?php echo htmlspecialchars($cs['bank_display']); ?></span></td>
                            <td>
                                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                                    <i class="bi bi-diagram-2 me-1"></i><?php echo htmlspecialchars($cs['current_stage'] ?: 'New Lead'); ?>
                                </span>
                            </td>
                            <td><span class="small fw-semibold"><?php echo htmlspecialchars($cs['staff_name'] ?: 'Unassigned'); ?></span></td>
                            <td>
                                <?php if ($cs['cibil_score'] > 0): ?>
                                    <span class="badge bg-<?php echo $cs['cibil_score'] >= 750 ? 'success' : ($cs['cibil_score'] >= 650 ? 'warning' : 'danger'); ?> rounded-pill px-2">
                                        <?php echo $cs['cibil_score']; ?>
                                    </span>
                                <?php else: ?>
                                    <span class="badge bg-secondary-subtle text-secondary rounded-pill px-2">N/A</span>
                                <?php endif; ?>
                            </td>
                            <td><span class="badge bg-light text-dark border font-monospace"><?php echo $cs['ageing_days']; ?> Days</span></td>
                            <td>
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-light border rounded-pill dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown">
                                        Action
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end rounded-3 shadow border-0 p-2">
                                        <li><a class="dropdown-item rounded-2 small" href="project_detail.php?id=<?php echo $cs['id']; ?>"><i class="bi bi-eye text-primary me-2"></i> View 360 Workspace</a></li>
                                        <li><a class="dropdown-item rounded-2 small" href="#" data-bs-toggle="modal" data-bs-target="#quickStageModal<?php echo $cs['id']; ?>"><i class="bi bi-diagram-2 text-success me-2"></i> Change Stage</a></li>
                                        <li><a class="dropdown-item rounded-2 small" href="#" data-bs-toggle="modal" data-bs-target="#quickStaffModal<?php echo $cs['id']; ?>"><i class="bi bi-person-plus text-info me-2"></i> Assign Staff</a></li>
                                    </ul>
                                </div>

                                <!-- QUICK STAGE MODAL -->
                                <div class="modal fade" id="quickStageModal<?php echo $cs['id']; ?>" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content rounded-4 border-0 shadow-lg text-start">
                                            <div class="modal-header border-bottom">
                                                <h5 class="modal-title font-heading fw-bold">Update Stage: <?php echo htmlspecialchars($cs['case_code']); ?></h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <form action="" method="POST">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="change_stage">
                                                <input type="hidden" name="case_id" value="<?php echo $cs['id']; ?>">
                                                <div class="modal-body p-4">
                                                    <div class="mb-3">
                                                        <label class="form-label small fw-bold">Select New Pipeline Stage *</label>
                                                        <select name="new_stage" class="form-select" required>
                                                            <?php foreach ($all_stages as $stg): ?>
                                                                <option value="<?php echo $stg; ?>" <?php echo $cs['current_stage'] === $stg ? 'selected' : ''; ?>><?php echo htmlspecialchars($stg); ?></option>
                                                            <?php endforeach; ?>
                                                        </select>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label small fw-bold">Remarks / Transition Reason</label>
                                                        <textarea name="stage_remarks" class="form-control" rows="3" placeholder="Notes for stage change..."></textarea>
                                                    </div>
                                                </div>
                                                <div class="modal-footer border-top">
                                                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Update Stage</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <!-- QUICK STAFF ASSIGN MODAL -->
                                <div class="modal fade" id="quickStaffModal<?php echo $cs['id']; ?>" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content rounded-4 border-0 shadow-lg text-start">
                                            <div class="modal-header border-bottom">
                                                <h5 class="modal-title font-heading fw-bold">Assign Staff: <?php echo htmlspecialchars($cs['case_code']); ?></h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <form action="" method="POST">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="assign_staff">
                                                <input type="hidden" name="case_id" value="<?php echo $cs['id']; ?>">
                                                <div class="modal-body p-4">
                                                    <div class="mb-3">
                                                        <label class="form-label small fw-bold">Select Staff Officer *</label>
                                                        <select name="staff_id" class="form-select" required>
                                                            <option value="">Select Officer...</option>
                                                            <?php foreach ($staff_list as $stf): ?>
                                                                <option value="<?php echo $stf['id']; ?>" <?php echo $cs['assigned_staff_id'] == $stf['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($stf['name']); ?></option>
                                                            <?php endforeach; ?>
                                                        </select>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label class="form-label small fw-bold">Assignment Role Title</label>
                                                        <select name="role_title" class="form-select">
                                                            <option value="Loan Consultant">Loan Consultant</option>
                                                            <option value="Relationship Manager">Relationship Manager</option>
                                                            <option value="Document Executive">Document Executive</option>
                                                            <option value="Banking Executive">Banking Executive</option>
                                                            <option value="Verification Executive">Verification Executive</option>
                                                            <option value="Team Leader">Team Leader</option>
                                                            <option value="Case Manager" selected>Case Manager</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="modal-footer border-top">
                                                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Assign Officer</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- MODAL: CREATE NEW LOAN CASE -->
<div class="modal fade" id="createCaseModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-folder-plus text-primary me-2"></i> Create New Loan Case Application</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_case">
                <div class="modal-body p-4">
                    <!-- SECTION 1: APPLICANT SELECTION -->
                    <h6 class="font-heading fw-bold text-primary mb-3 border-bottom pb-2"><i class="bi bi-person me-2"></i> 1. Customer & Applicant Information</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Select Existing Customer *</label>
                            <select name="customer_id" class="form-select" required>
                                <option value="">Search & Select Customer...</option>
                                <?php foreach ($customers_list as $cst): ?>
                                    <option value="<?php echo $cst['id']; ?>"><?php echo htmlspecialchars($cst['name']); ?> (<?php echo htmlspecialchars($cst['mobile']); ?>)</option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Customer Type</label>
                            <select name="customer_type" class="form-select">
                                <option value="Individual">Individual</option>
                                <option value="Proprietorship">Proprietorship</option>
                                <option value="Partnership">Partnership</option>
                                <option value="LLP">LLP</option>
                                <option value="Pvt Ltd">Pvt Ltd</option>
                                <option value="Ltd">Ltd</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">PAN Number</label>
                            <input type="text" name="pan_number" class="form-control" text-uppercase placeholder="ABCDE1234F">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">Aadhaar (Last 4 Digits)</label>
                            <input type="text" name="aadhaar_last_4" class="form-control" maxlength="4" placeholder="1234">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">CIBIL Score</label>
                            <input type="number" name="cibil_score" class="form-control" placeholder="e.g. 750">
                        </div>
                    </div>

                    <!-- SECTION 2: LOAN REQUIREMENT -->
                    <h6 class="font-heading fw-bold text-primary mb-3 border-bottom pb-2"><i class="bi bi-cash-coin me-2"></i> 2. Loan Requirement Details</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Loan Type *</label>
                            <select name="loan_type_id" class="form-select" required>
                                <option value="">Select Loan Category...</option>
                                <?php foreach ($loan_types_list as $lt): ?>
                                    <option value="<?php echo $lt['id']; ?>"><?php echo htmlspecialchars($lt['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Required Loan Amount (₹) *</label>
                            <input type="number" name="required_loan_amount" class="form-control" required placeholder="e.g. 2500000">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Preferred Bank / Lender</label>
                            <select name="preferred_bank_id" class="form-select">
                                <option value="">Select Preferred Bank...</option>
                                <?php foreach ($lenders_list as $ld): ?>
                                    <option value="<?php echo $ld['id']; ?>"><?php echo htmlspecialchars($ld['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">Expected Interest (%)</label>
                            <input type="number" step="0.01" name="expected_interest_rate" class="form-control" placeholder="e.g. 8.5">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">Expected Tenure (Months)</label>
                            <input type="number" name="expected_tenure_months" class="form-control" placeholder="e.g. 60">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label small fw-bold">Loan Purpose & Details</label>
                            <textarea name="loan_purpose" class="form-control" rows="2" placeholder="Describe the purpose of loan or business expansion project..."></textarea>
                        </div>
                    </div>

                    <!-- SECTION 3: BUSINESS & ASSIGNMENT -->
                    <h6 class="font-heading fw-bold text-primary mb-3 border-bottom pb-2"><i class="bi bi-building me-2"></i> 3. Business Details & Case Ownership</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Business Name (If applicable)</label>
                            <input type="text" name="business_name" class="form-control" placeholder="Firm or Enterprise Name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">GSTIN</label>
                            <input type="text" name="gstin" class="form-control" placeholder="22AAAAA0000A1Z5">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Annual Turnover (₹)</label>
                            <input type="number" name="annual_turnover" class="form-control" placeholder="e.g. 5000000">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">ITR Income (₹)</label>
                            <input type="number" name="itr_income" class="form-control" placeholder="e.g. 600000">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Assign Staff Officer</label>
                            <select name="assigned_staff_id" class="form-select">
                                <option value="">Unassigned</option>
                                <?php foreach ($staff_list as $stf): ?>
                                    <option value="<?php echo $stf['id']; ?>"><?php echo htmlspecialchars($stf['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Case Priority</label>
                            <select name="priority" class="form-select">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Loan Case</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
