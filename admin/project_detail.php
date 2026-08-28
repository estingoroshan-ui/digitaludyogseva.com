<?php
$page_title = "Loan Case 360° Workspace";
$active_menu = "projects";
require_once __DIR__ . '/includes/admin_header.php';

$case_id = (int)($_GET['id'] ?? 0);
global $pdo;

// Fetch Loan Case Details with Joins
$stmt = $pdo->prepare("
    SELECT c.*, cust.name AS customer_name, cust.company_name AS customer_company, cust.mobile AS customer_mobile, cust.email AS customer_email,
           cust.address AS customer_address, cust.city AS customer_city, cust.state AS customer_state, cust.pincode AS customer_pincode,
           COALESCE(lt.name, c.loan_type, 'Other Loan') AS loan_type_display,
           COALESCE(ld.name, c.preferred_bank, 'Multiple Banks') AS bank_display,
           u.name AS staff_name, u.email AS staff_email, u.mobile AS staff_phone
    FROM cases c
    JOIN customers cust ON c.customer_id = cust.id
    LEFT JOIN loan_types lt ON c.loan_type_id = lt.id
    LEFT JOIN lenders ld ON c.preferred_bank_id = ld.id
    LEFT JOIN employees e ON c.assigned_staff_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    WHERE c.id = ?
");
$stmt->execute([$case_id]);
$case = $stmt->fetch();

if (!$case) {
    echo '<div class="alert alert-danger fw-bold m-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Loan Case record not found.</div>';
    require_once __DIR__ . '/includes/admin_footer.php';
    exit;
}

$msg = '';

// Handle Post Actions inside Case 360
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // 1. Edit Case Master Details
    if ($action === 'edit_case_master') {
        $required_amount = (float)($_POST['required_loan_amount'] ?? 0);
        $loan_purpose = sanitize($_POST['loan_purpose'] ?? '');
        $pan_number = strtoupper(sanitize($_POST['pan_number'] ?? ''));
        $aadhaar_last_4 = sanitize($_POST['aadhaar_last_4'] ?? '');
        $cibil_score = (int)($_POST['cibil_score'] ?? 0);
        $business_name = sanitize($_POST['business_name'] ?? '');
        $gstin = sanitize($_POST['gstin'] ?? '');
        $udyam_number = sanitize($_POST['udyam_number'] ?? '');
        $annual_turnover = (float)($_POST['annual_turnover'] ?? 0);
        $itr_income = (float)($_POST['itr_income'] ?? 0);
        $existing_emi = (float)($_POST['existing_emi'] ?? 0);
        $priority = sanitize($_POST['priority'] ?? 'Medium');

        $upd = $pdo->prepare("
            UPDATE cases SET
                required_loan_amount = ?, loan_purpose = ?, pan_number = ?, aadhaar_last_4 = ?,
                cibil_score = ?, business_name = ?, gstin = ?, udyam_number = ?, annual_turnover = ?,
                itr_income = ?, existing_emi = ?, priority = ?, updated_at = NOW()
            WHERE id = ?
        ");
        $upd->execute([
            $required_amount, $loan_purpose, $pan_number, $aadhaar_last_4,
            $cibil_score, $business_name, $gstin, $udyam_number, $annual_turnover,
            $itr_income, $existing_emi, $priority, $case_id
        ]);
        ActivityLogger::log('edit_case_master', 'case', $case_id, "Updated master loan case parameters");
        $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Case information updated successfully. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }

    // 2. Change Pipeline Stage
    elseif ($action === 'change_stage') {
        $new_stage = sanitize($_POST['new_stage'] ?? '');
        $remarks = sanitize($_POST['stage_remarks'] ?? '');
        $prev_stage = $case['current_stage'] ?: 'New Lead';

        if ($new_stage) {
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

            $hist = $pdo->prepare("INSERT INTO case_stage_history (case_id, previous_stage, new_stage, changed_by, remarks) VALUES (?, ?, ?, ?, ?)");
            $hist->execute([$case_id, $prev_stage, $new_stage, $current_user['id'] ?? 1, $remarks]);

            ActivityLogger::log('change_case_stage', 'case', $case_id, "Stage changed to '{$new_stage}'");
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-diagram-2-fill me-2"></i> Stage updated to <strong>' . htmlspecialchars($new_stage) . '</strong>. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // 3. Add Bank Application
    elseif ($action === 'add_bank_app') {
        $lender_id = (int)($_POST['lender_id'] ?? 0);
        $bank_name = sanitize($_POST['bank_name'] ?? '');
        $branch = sanitize($_POST['branch'] ?? '');
        $contact_person = sanitize($_POST['contact_person'] ?? '');
        $contact_number = sanitize($_POST['contact_number'] ?? '');
        $applied_amount = (float)($_POST['applied_amount'] ?? 0);
        $app_date = $_POST['application_date'] ?: null;
        $app_num = sanitize($_POST['bank_app_number'] ?? '');
        $lan = sanitize($_POST['login_id_lan'] ?? '');
        $status = sanitize($_POST['current_bank_status'] ?? 'Submitted');
        $remarks = sanitize($_POST['remarks'] ?? '');

        if (!$bank_name && $lender_id > 0) {
            $ld_stmt = $pdo->prepare("SELECT name FROM lenders WHERE id = ?");
            $ld_stmt->execute([$lender_id]);
            $bank_name = $ld_stmt->fetchColumn() ?: 'Bank Application';
        }

        if ($bank_name) {
            $ins = $pdo->prepare("
                INSERT INTO case_bank_applications (
                    case_id, lender_id, bank_name, branch, contact_person, contact_number,
                    applied_amount, application_date, bank_app_number, login_id_lan, current_bank_status, remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $ins->execute([
                $case_id, $lender_id ?: null, $bank_name, $branch, $contact_person, $contact_number,
                $applied_amount, $app_date, $app_num, $lan, $status, $remarks
            ]);
            ActivityLogger::log('add_bank_application', 'case', $case_id, "Submitted bank application to {$bank_name} for ₹{$applied_amount}");
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-bank me-2"></i> Bank Application for <strong>' . htmlspecialchars($bank_name) . '</strong> added. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // 4. Update Bank Application Status / Sanction
    elseif ($action === 'update_bank_app') {
        $app_id = (int)$_POST['bank_app_id'];
        $status = sanitize($_POST['current_bank_status'] ?? 'Submitted');
        $approved_amount = (float)($_POST['approved_amount'] ?? 0);
        $interest_rate = (float)($_POST['interest_rate_offered'] ?? 0);
        $tenure = (int)($_POST['tenure_offered'] ?? 0);
        $sanction_date = $_POST['sanction_date'] ?: null;
        $rejection_reason = sanitize($_POST['rejection_reason'] ?? '');

        $upd = $pdo->prepare("
            UPDATE case_bank_applications SET
                current_bank_status = ?, approved_amount = ?, interest_rate_offered = ?,
                tenure_offered = ?, sanction_date = ?, rejection_reason = ?
            WHERE id = ? AND case_id = ?
        ");
        $upd->execute([$status, $approved_amount, $interest_rate, $tenure, $sanction_date, $rejection_reason, $app_id, $case_id]);

        if ($status === 'Sanctioned' && $approved_amount > 0) {
            $pdo->prepare("UPDATE cases SET sanctioned_amount = ?, sanction_date = ? WHERE id = ?")->execute([$approved_amount, $sanction_date, $case_id]);
        }

        $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Bank Application status updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }

    // 5. Upload File to Document Vault
    elseif ($action === 'upload_file') {
        if (isset($_FILES['project_file']) && $_FILES['project_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['project_file'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'zip'];
            
            if (in_array($ext, $allowed)) {
                $upload_dir = __DIR__ . '/../uploads/project_files/';
                if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

                $stored_name = 'case_file_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                $target_path = $upload_dir . $stored_name;

                if (move_uploaded_file($file['tmp_name'], $target_path)) {
                    $db_path = 'uploads/project_files/' . $stored_name;
                    $orig_name = sanitize($file['name']);
                    $file_size = (int)$file['size'];

                    $ins = $pdo->prepare("
                        INSERT INTO project_files (case_id, file_path, file_name, original_filename, file_size, file_type, uploaded_by)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ");
                    $ins->execute([$case_id, $db_path, $stored_name, $orig_name, $file_size, $ext, $current_user['id'] ?? 1]);

                    ActivityLogger::log('upload_case_file', 'case', $case_id, "Uploaded file {$orig_name}");
                    $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-file-earmark-arrow-up-fill me-2"></i> Document uploaded to Case Vault. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
                }
            }
        }
    }

    // 6. Add Follow-up Entry & Set Next Date
    elseif ($action === 'add_followup') {
        $remarks = sanitize($_POST['followup_remarks'] ?? '');
        $next_date = $_POST['next_followup_date'] ?: null;
        $ftype = sanitize($_POST['followup_type'] ?? 'Call');

        if ($remarks) {
            $ins = $pdo->prepare("INSERT INTO case_followups (case_id, followup_type, remarks, next_followup_date, created_by) VALUES (?, ?, ?, ?, ?)");
            $ins->execute([$case_id, $ftype, $remarks, $next_date, $current_user['id'] ?? 1]);

            if ($next_date) {
                $pdo->prepare("UPDATE cases SET next_followup_date = ? WHERE id = ?")->execute([$next_date, $case_id]);
            }
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-telephone-out-fill me-2"></i> Follow-up log saved. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // 7. Add Team Discussion Note
    elseif ($action === 'add_note') {
        $note = sanitize($_POST['note'] ?? '');
        if ($note) {
            $ins = $pdo->prepare("INSERT INTO project_notes (case_id, note, created_by) VALUES (?, ?, ?)");
            $ins->execute([$case_id, $note, $current_user['id'] ?? 1]);
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-journal-text me-2"></i> Discussion note posted. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // 8. Record Disbursement
    elseif ($action === 'record_disbursement') {
        $disb_amount = (float)($_POST['disbursed_amount'] ?? 0);
        $disb_date = $_POST['disbursement_date'] ?: date('Y-m-d');
        $lan = sanitize($_POST['loan_account_number'] ?? '');

        if ($disb_amount > 0) {
            $pdo->prepare("UPDATE cases SET disbursed_amount = disbursed_amount + ?, disbursement_date = ?, loan_account_number = ?, current_stage = 'Fully Disbursed', status = 'completed' WHERE id = ?")->execute([$disb_amount, $disb_date, $lan, $case_id]);
            ActivityLogger::log('record_disbursement', 'case', $case_id, "Recorded disbursement of ₹{$disb_amount}");
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-cash-coin me-2"></i> Disbursement recorded successfully! <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // Refresh case object after post
    $stmt->execute([$case_id]);
    $case = $stmt->fetch();
}

// ----------------------------------------------------
// FETCH SUB-RESOURCES FOR REAL WORKING TABS
// ----------------------------------------------------
$stage_history = $pdo->query("SELECT h.*, u.name AS author_name FROM case_stage_history h LEFT JOIN users u ON h.changed_by = u.id WHERE h.case_id = {$case_id} ORDER BY h.id DESC")->fetchAll();
$bank_apps = $pdo->query("SELECT b.*, l.type AS lender_type FROM case_bank_applications b LEFT JOIN lenders l ON b.lender_id = l.id WHERE b.case_id = {$case_id} ORDER BY b.id DESC")->fetchAll();
$case_files = $pdo->query("SELECT f.*, u.name AS uploader_name FROM project_files f LEFT JOIN users u ON f.uploaded_by = u.id WHERE f.case_id = {$case_id} ORDER BY f.id DESC")->fetchAll();
$case_notes = $pdo->query("SELECT n.*, u.name AS author_name FROM project_notes n LEFT JOIN users u ON n.created_by = u.id WHERE n.case_id = {$case_id} ORDER BY n.id DESC")->fetchAll();
$case_followups = $pdo->query("SELECT f.*, u.name AS author_name FROM case_followups f LEFT JOIN users u ON f.created_by = u.id WHERE f.case_id = {$case_id} ORDER BY f.id DESC")->fetchAll();
$case_tasks = $pdo->query("SELECT * FROM tasks WHERE case_id = {$case_id} ORDER BY due_date ASC")->fetchAll();
$case_payments = $pdo->query("SELECT * FROM payments WHERE case_id = {$case_id} ORDER BY id DESC")->fetchAll();
$case_assignments = $pdo->query("SELECT a.*, u.name AS staff_name, u2.name AS assigned_by_name FROM case_staff_assignments a LEFT JOIN employees e ON a.staff_id = e.id LEFT JOIN users u ON e.user_id = u.id LEFT JOIN users u2 ON a.assigned_by = u2.id WHERE a.case_id = {$case_id} ORDER BY a.id DESC")->fetchAll();
$case_activities = $pdo->query("SELECT * FROM activity_logs WHERE module = 'case' AND record_id = {$case_id} ORDER BY id DESC LIMIT 50")->fetchAll();

$loan_types_list = $pdo->query("SELECT * FROM loan_types WHERE status = 'active' ORDER BY name ASC")->fetchAll();
$lenders_list = $pdo->query("SELECT * FROM lenders WHERE status = 'active' ORDER BY name ASC")->fetchAll();
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

// Financial Calculations for Eligibility
$annual_inc = $case['itr_income'] > 0 ? $case['itr_income'] : ($case['annual_turnover'] * 0.10); // Assume 10% margin if no ITR
$monthly_inc = $annual_inc / 12;
$existing_emi = $case['existing_emi'] ?: 0;
$foir_percent = $monthly_inc > 0 ? min(100, round(($existing_emi / $monthly_inc) * 100, 1)) : 0;
?>

<?php echo $msg; ?>

<!-- CASE HEADER BAR -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
            <a href="projects.php" class="btn btn-light border rounded-circle p-2" title="Back to Cases">
                <i class="bi bi-arrow-left fs-5"></i>
            </a>
            <div>
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h3 class="font-heading fw-bold mb-0 text-dark"><?php echo htmlspecialchars($case['loan_type_display']); ?></h3>
                    <span class="badge bg-primary-subtle text-primary font-monospace px-3 py-1 rounded-pill fw-bold"><?php echo htmlspecialchars($case['case_code']); ?></span>
                    <span class="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-1 fw-bold">
                        <i class="bi bi-diagram-2 me-1"></i><?php echo htmlspecialchars($case['current_stage'] ?: 'New Lead'); ?>
                    </span>
                    <span class="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold fs-6">
                        Req: ₹<?php echo format_inr($case['required_loan_amount'] ?: $case['total_amount']); ?>
                    </span>
                    <?php if ($case['sanctioned_amount'] > 0): ?>
                        <span class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-1 fw-bold fs-6">
                            Sanctioned: ₹<?php echo format_inr($case['sanctioned_amount']); ?>
                        </span>
                    <?php endif; ?>
                </div>
                <div class="text-secondary small d-flex gap-3 align-items-center flex-wrap mt-2">
                    <span><i class="bi bi-person-fill text-primary me-1"></i> Customer: <a href="customers.php?id=<?php echo $case['customer_id']; ?>" class="fw-bold text-dark text-decoration-none"><?php echo htmlspecialchars($case['customer_name']); ?></a> (<?php echo htmlspecialchars($case['customer_mobile']); ?>)</span>
                    <span><i class="bi bi-bank text-primary me-1"></i> Lender: <strong><?php echo htmlspecialchars($case['bank_display']); ?></strong></span>
                    <span><i class="bi bi-person-badge text-primary me-1"></i> Officer: <strong><?php echo htmlspecialchars($case['staff_name'] ?: 'Unassigned'); ?></strong></span>
                    <span><i class="bi bi-speedometer2 text-primary me-1"></i> CIBIL: <strong class="text-<?php echo $case['cibil_score'] >= 750 ? 'success' : 'warning'; ?>"><?php echo $case['cibil_score'] ?: 'Pending'; ?></strong></span>
                </div>
            </div>
        </div>

        <!-- QUICK ACTION CONTROLS -->
        <div class="d-flex gap-2 flex-wrap align-items-center">
            <button class="btn btn-outline-primary rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#editCaseModal">
                <i class="bi bi-pencil me-1"></i> Edit Case
            </button>
            <button class="btn btn-outline-success rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#stageModal">
                <i class="bi bi-diagram-2 me-1"></i> Change Stage
            </button>
            <button class="btn btn-outline-info text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#addBankModal">
                <i class="bi bi-bank me-1"></i> Add Bank Application
            </button>
            <button class="btn btn-outline-secondary rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#uploadModal">
                <i class="bi bi-paperclip me-1"></i> Upload Document
            </button>
            <button class="btn btn-outline-warning text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#followupModal">
                <i class="bi bi-telephone-out me-1"></i> Add Follow-up
            </button>
        </div>
    </div>
</div>

<!-- WORKSPACE REAL WORKING TABS CONTAINER -->
<div class="card border-0 shadow-sm rounded-4 bg-white mb-4">
    <div class="card-header bg-white border-bottom p-3">
        <ul class="nav nav-pills card-header-pills gap-2 flex-wrap" role="tablist">
            <li class="nav-item"><button class="nav-link active rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-overview"><i class="bi bi-grid-1x2 me-1"></i> Overview</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-applicant"><i class="bi bi-person me-1"></i> Applicant Details</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-business"><i class="bi bi-building me-1"></i> Business Info</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-requirement"><i class="bi bi-cash-stack me-1"></i> Loan Requirement</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-banks"><i class="bi bi-bank me-1"></i> Bank Apps <span class="badge bg-primary ms-1"><?php echo count($bank_apps); ?></span></button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-vault"><i class="bi bi-paperclip me-1"></i> Doc Vault <span class="badge bg-secondary ms-1"><?php echo count($case_files); ?></span></button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-eligibility"><i class="bi bi-calculator me-1"></i> Eligibility & FOIR</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-followups"><i class="bi bi-telephone-out me-1"></i> Follow-ups <span class="badge bg-warning text-dark ms-1"><?php echo count($case_followups); ?></span></button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-notes"><i class="bi bi-journal-text me-1"></i> Team Notes <span class="badge bg-info text-dark ms-1"><?php echo count($case_notes); ?></span></button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-tasks"><i class="bi bi-check2-square me-1"></i> Tasks <span class="badge bg-dark ms-1"><?php echo count($case_tasks); ?></span></button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-disbursement"><i class="bi bi-cash-coin me-1"></i> Sanction & Disbursement</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-activity"><i class="bi bi-clock-history me-1"></i> Activity Logs</button></li>
        </ul>
    </div>

    <div class="card-body p-4">
        <div class="tab-content">

            <!-- TAB 1: OVERVIEW & WORKFLOW -->
            <div class="tab-pane fade show active" id="tab-overview">
                <div class="row g-4">
                    <div class="col-md-7">
                        <h6 class="font-heading fw-bold mb-3"><i class="bi bi-diagram-2 text-primary me-2"></i> Stage Transition Audit History</h6>
                        <div class="list-group list-group-flush border rounded-4 overflow-hidden mb-4">
                            <?php if (empty($stage_history)): ?>
                                <div class="p-4 text-center text-muted">No stage transitions logged yet.</div>
                            <?php else: ?>
                                <?php foreach ($stage_history as $sh): ?>
                                    <div class="list-group-item p-3 border-bottom">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <span class="badge bg-primary-subtle text-primary border rounded-pill px-3"><?php echo htmlspecialchars($sh['new_stage']); ?></span>
                                            <small class="text-muted"><?php echo date('d M Y, h:i A', strtotime($sh['created_at'])); ?></small>
                                        </div>
                                        <div class="small text-dark">
                                            Changed from: <em><?php echo htmlspecialchars($sh['previous_stage'] ?: 'Initial Entry'); ?></em>
                                            by <strong><?php echo htmlspecialchars($sh['author_name'] ?: 'System'); ?></strong>
                                        </div>
                                        <?php if ($sh['remarks']): ?>
                                            <div class="small text-muted bg-light p-2 rounded-3 mt-2"><i class="bi bi-chat-quote me-1"></i> <?php echo htmlspecialchars($sh['remarks']); ?></div>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="col-md-5">
                        <h6 class="font-heading fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i> Quick Snapshot</h6>
                        <div class="bg-light p-3 rounded-4 mb-3">
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">PAN Number</span>
                                <strong class="font-monospace"><?php echo htmlspecialchars($case['pan_number'] ?: '—'); ?></strong>
                            </div>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Aadhaar Last 4</span>
                                <strong class="font-monospace"><?php echo htmlspecialchars($case['aadhaar_last_4'] ? 'XXXX-XXXX-' . $case['aadhaar_last_4'] : '—'); ?></strong>
                            </div>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Business Name</span>
                                <strong><?php echo htmlspecialchars($case['business_name'] ?: '—'); ?></strong>
                            </div>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Annual Turnover</span>
                                <strong>₹<?php echo format_inr($case['annual_turnover']); ?></strong>
                            </div>
                            <div class="d-flex justify-content-between py-2">
                                <span class="text-muted">Next Follow-up</span>
                                <strong class="text-danger"><?php echo $case['next_followup_date'] ? date('d M Y, h:i A', strtotime($case['next_followup_date'])) : 'Not Scheduled'; ?></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 2: APPLICANT DETAILS -->
            <div class="tab-pane fade" id="tab-applicant">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="p-3 border rounded-4">
                            <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-person-lines-fill me-2"></i> Primary Applicant Details</h6>
                            <table class="table table-sm table-borderless">
                                <tr><td class="text-muted w-40">Full Name</td><td class="fw-bold"><?php echo htmlspecialchars($case['customer_name']); ?></td></tr>
                                <tr><td class="text-muted">Mobile Number</td><td><?php echo htmlspecialchars($case['customer_mobile']); ?></td></tr>
                                <tr><td class="text-muted">Alternate Mobile</td><td><?php echo htmlspecialchars($case['alternate_mobile'] ?: '—'); ?></td></tr>
                                <tr><td class="text-muted">Email Address</td><td><?php echo htmlspecialchars($case['customer_email'] ?: '—'); ?></td></tr>
                                <tr><td class="text-muted">Customer Type</td><td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($case['customer_type']); ?></span></td></tr>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 border rounded-4">
                            <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-shield-check me-2"></i> Identity & Address</h6>
                            <table class="table table-sm table-borderless">
                                <tr><td class="text-muted w-40">PAN Card</td><td class="fw-bold font-monospace"><?php echo htmlspecialchars($case['pan_number'] ?: 'N/A'); ?></td></tr>
                                <tr><td class="text-muted">Aadhaar (Last 4)</td><td class="fw-bold font-monospace"><?php echo htmlspecialchars($case['aadhaar_last_4'] ? 'XXXX-XXXX-' . $case['aadhaar_last_4'] : 'N/A'); ?></td></tr>
                                <tr><td class="text-muted">CIBIL Score</td><td><span class="badge bg-success rounded-pill px-3"><?php echo $case['cibil_score'] ?: 'N/A'; ?></span></td></tr>
                                <tr><td class="text-muted">Address</td><td><?php echo htmlspecialchars($case['customer_address'] ?: '—'); ?></td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 3: BUSINESS DETAILS -->
            <div class="tab-pane fade" id="tab-business">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="p-3 border rounded-4">
                            <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-building me-2"></i> Business & Establishment</h6>
                            <table class="table table-sm table-borderless">
                                <tr><td class="text-muted w-40">Business Name</td><td class="fw-bold"><?php echo htmlspecialchars($case['business_name'] ?: 'N/A'); ?></td></tr>
                                <tr><td class="text-muted">GSTIN</td><td class="font-monospace"><?php echo htmlspecialchars($case['gstin'] ?: 'N/A'); ?></td></tr>
                                <tr><td class="text-muted">Udyam Registration</td><td class="font-monospace"><?php echo htmlspecialchars($case['udyam_number'] ?: 'N/A'); ?></td></tr>
                                <tr><td class="text-muted">Industry / Sector</td><td><?php echo htmlspecialchars($case['industry'] ?: '—'); ?></td></tr>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 border rounded-4">
                            <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-graph-up-arrow me-2"></i> Financial Turnovers</h6>
                            <table class="table table-sm table-borderless">
                                <tr><td class="text-muted w-40">Annual Turnover</td><td class="fw-bold text-success">₹<?php echo format_inr($case['annual_turnover']); ?></td></tr>
                                <tr><td class="text-muted">ITR Net Income</td><td class="fw-bold">₹<?php echo format_inr($case['itr_income']); ?></td></tr>
                                <tr><td class="text-muted">Existing Monthly EMI</td><td class="text-danger">₹<?php echo format_inr($case['existing_emi']); ?></td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 4: LOAN REQUIREMENT -->
            <div class="tab-pane fade" id="tab-requirement">
                <div class="p-4 border rounded-4 bg-light">
                    <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-cash-coin me-2"></i> Requested Loan Parameters</h6>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <small class="text-muted d-block">Loan Type</small>
                            <span class="fw-bold fs-5 text-dark"><?php echo htmlspecialchars($case['loan_type_display']); ?></span>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted d-block">Required Amount</small>
                            <span class="fw-bold fs-4 text-primary">₹<?php echo format_inr($case['required_loan_amount']); ?></span>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted d-block">Preferred Lender</small>
                            <span class="fw-bold fs-5 text-dark"><?php echo htmlspecialchars($case['bank_display']); ?></span>
                        </div>
                        <div class="col-md-12 mt-3">
                            <small class="text-muted d-block">Loan Purpose & Scope</small>
                            <p class="mb-0 fw-semibold text-dark"><?php echo htmlspecialchars($case['loan_purpose'] ?: 'No details specified.'); ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 5: BANK APPLICATIONS -->
            <div class="tab-pane fade" id="tab-banks">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="font-heading fw-bold mb-0"><i class="bi bi-bank text-primary me-2"></i> Lender Applications Grid</h6>
                    <button class="btn btn-primary btn-sm rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#addBankModal">
                        <i class="bi bi-plus-lg me-1"></i> Add Lender Submission
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle border rounded-4">
                        <thead class="table-light">
                            <tr>
                                <th>Bank / Lender</th>
                                <th>Applied Amount</th>
                                <th>App Date</th>
                                <th>App No / LAN</th>
                                <th>Bank Status</th>
                                <th>Approved Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($bank_apps)): ?>
                                <tr><td colspan="7" class="text-center py-4 text-muted">No lender applications logged yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($bank_apps as $ba): ?>
                                    <tr>
                                        <td class="fw-bold text-dark"><?php echo htmlspecialchars($ba['bank_name']); ?></td>
                                        <td class="fw-bold text-primary">₹<?php echo format_inr($ba['applied_amount']); ?></td>
                                        <td><?php echo $ba['application_date'] ? date('d M Y', strtotime($ba['application_date'])) : '—'; ?></td>
                                        <td><span class="font-monospace small"><?php echo htmlspecialchars($ba['login_id_lan'] ?: $ba['bank_app_number'] ?: '—'); ?></span></td>
                                        <td><span class="badge bg-info-subtle text-info-emphasis rounded-pill px-3"><?php echo htmlspecialchars($ba['current_bank_status']); ?></span></td>
                                        <td class="fw-bold text-success">₹<?php echo format_inr($ba['approved_amount']); ?></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#updateBankAppModal<?php echo $ba['id']; ?>">
                                                Update Status
                                            </button>

                                            <!-- UPDATE BANK APP MODAL -->
                                            <div class="modal fade" id="updateBankAppModal<?php echo $ba['id']; ?>" tabindex="-1">
                                                <div class="modal-dialog modal-dialog-centered">
                                                    <div class="modal-content rounded-4 border-0 shadow-lg">
                                                        <div class="modal-header border-bottom">
                                                            <h5 class="modal-title font-heading fw-bold">Update Lender Submission</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                        </div>
                                                        <form action="" method="POST">
                                                            <?php render_csrf_field(); ?>
                                                            <input type="hidden" name="action" value="update_bank_app">
                                                            <input type="hidden" name="bank_app_id" value="<?php echo $ba['id']; ?>">
                                                            <div class="modal-body p-4">
                                                                <div class="mb-3">
                                                                    <label class="form-label small fw-bold">Current Bank Status *</label>
                                                                    <select name="current_bank_status" class="form-select">
                                                                        <option value="Submitted" <?php echo $ba['current_bank_status'] === 'Submitted' ? 'selected' : ''; ?>>Submitted</option>
                                                                        <option value="Under Review" <?php echo $ba['current_bank_status'] === 'Under Review' ? 'selected' : ''; ?>>Under Review</option>
                                                                        <option value="Credit Approved" <?php echo $ba['current_bank_status'] === 'Credit Approved' ? 'selected' : ''; ?>>Credit Approved</option>
                                                                        <option value="Sanctioned" <?php echo $ba['current_bank_status'] === 'Sanctioned' ? 'selected' : ''; ?>>Sanctioned</option>
                                                                        <option value="Disbursed" <?php echo $ba['current_bank_status'] === 'Disbursed' ? 'selected' : ''; ?>>Disbursed</option>
                                                                        <option value="Rejected" <?php echo $ba['current_bank_status'] === 'Rejected' ? 'selected' : ''; ?>>Rejected</option>
                                                                    </select>
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label class="form-label small fw-bold">Approved / Sanctioned Amount (₹)</label>
                                                                    <input type="number" name="approved_amount" class="form-control" value="<?php echo $ba['approved_amount']; ?>">
                                                                </div>
                                                                <div class="row g-3 mb-3">
                                                                    <div class="col-md-6">
                                                                        <label class="form-label small fw-bold">Offered Interest Rate (%)</label>
                                                                        <input type="number" step="0.01" name="interest_rate_offered" class="form-control" value="<?php echo $ba['interest_rate_offered']; ?>">
                                                                    </div>
                                                                    <div class="col-md-6">
                                                                        <label class="form-label small fw-bold">Offered Tenure (Months)</label>
                                                                        <input type="number" name="tenure_offered" class="form-control" value="<?php echo $ba['tenure_offered']; ?>">
                                                                    </div>
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label class="form-label small fw-bold">Sanction Date</label>
                                                                    <input type="date" name="sanction_date" class="form-control" value="<?php echo $ba['sanction_date']; ?>">
                                                                </div>
                                                            </div>
                                                            <div class="modal-footer border-top">
                                                                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Status</button>
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

            <!-- TAB 6: DOCUMENT VAULT -->
            <div class="tab-pane fade" id="tab-vault">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="font-heading fw-bold mb-0"><i class="bi bi-paperclip text-primary me-2"></i> Case Documents Vault</h6>
                    <button class="btn btn-primary btn-sm rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#uploadModal">
                        <i class="bi bi-cloud-upload me-1"></i> Upload File
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle border rounded-4">
                        <thead class="table-light">
                            <tr>
                                <th>File Name</th>
                                <th>Type</th>
                                <th>Uploaded By</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($case_files)): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No documents uploaded to this case vault.</td></tr>
                            <?php else: ?>
                                <?php foreach ($case_files as $cf): ?>
                                    <tr>
                                        <td class="fw-bold text-dark"><i class="bi bi-file-earmark-text me-2 text-primary"></i><?php echo htmlspecialchars($cf['original_filename']); ?></td>
                                        <td><span class="badge bg-light text-dark border font-monospace"><?php echo strtoupper($cf['file_type']); ?></span></td>
                                        <td><?php echo htmlspecialchars($cf['uploader_name'] ?: 'Staff'); ?></td>
                                        <td class="small text-muted"><?php echo date('d M Y', strtotime($cf['created_at'])); ?></td>
                                        <td>
                                            <a href="<?php echo BASE_URL . $cf['file_path']; ?>" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                <i class="bi bi-download me-1"></i> Download
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 7: ELIGIBILITY & FOIR -->
            <div class="tab-pane fade" id="tab-eligibility">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-light">
                            <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-calculator-fill me-2"></i> FOIR & Debt Burden Ratio</h6>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Estimated Monthly Income</span>
                                <strong class="text-success fs-5">₹<?php echo format_inr($monthly_inc); ?></strong>
                            </div>
                            <div class="d-flex justify-content-between py-2 border-bottom">
                                <span class="text-muted">Existing Monthly Obligations</span>
                                <strong class="text-danger fs-5">₹<?php echo format_inr($existing_emi); ?></strong>
                            </div>
                            <div class="d-flex justify-content-between py-2 mt-2">
                                <span class="fw-bold text-dark">Current FOIR Percentage</span>
                                <span class="badge bg-<?php echo $foir_percent <= 50 ? 'success' : ($foir_percent <= 65 ? 'warning' : 'danger'); ?> fs-6 rounded-pill px-3"><?php echo $foir_percent; ?>%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 8: FOLLOW-UPS -->
            <div class="tab-pane fade" id="tab-followups">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="font-heading fw-bold mb-0"><i class="bi bi-telephone-out text-primary me-2"></i> Follow-up Log History</h6>
                    <button class="btn btn-warning btn-sm text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#followupModal">
                        <i class="bi bi-plus-lg me-1"></i> Log Follow-up
                    </button>
                </div>
                <div class="list-group border rounded-4 overflow-hidden">
                    <?php if (empty($case_followups)): ?>
                        <div class="p-4 text-center text-muted">No follow-ups logged yet.</div>
                    <?php else: ?>
                        <?php foreach ($case_followups as $fl): ?>
                            <div class="list-group-item p-3 border-bottom">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3"><i class="bi bi-telephone me-1"></i><?php echo htmlspecialchars($fl['followup_type']); ?></span>
                                    <small class="text-muted"><?php echo date('d M Y, h:i A', strtotime($fl['created_at'])); ?></small>
                                </div>
                                <p class="mb-1 text-dark fw-semibold"><?php echo htmlspecialchars($fl['remarks']); ?></p>
                                <small class="text-muted">Logged by: <strong><?php echo htmlspecialchars($fl['author_name'] ?: 'Staff'); ?></strong></small>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

            <!-- TAB 9: TEAM NOTES -->
            <div class="tab-pane fade" id="tab-notes">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="font-heading fw-bold mb-0"><i class="bi bi-journal-text text-primary me-2"></i> Team Discussion Notes</h6>
                    <button class="btn btn-info btn-sm text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#noteModal">
                        <i class="bi bi-plus-lg me-1"></i> Post Note
                    </button>
                </div>
                <div class="row g-3">
                    <?php if (empty($case_notes)): ?>
                        <div class="col-12 text-center py-4 text-muted">No notes posted yet.</div>
                    <?php else: ?>
                        <?php foreach ($case_notes as $cn): ?>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-4 bg-light">
                                    <p class="mb-2 text-dark"><?php echo htmlspecialchars($cn['note']); ?></p>
                                    <div class="d-flex justify-content-between small text-muted">
                                        <span><i class="bi bi-person me-1"></i><?php echo htmlspecialchars($cn['author_name'] ?: 'Staff'); ?></span>
                                        <span><?php echo date('d M Y, h:i A', strtotime($cn['created_at'])); ?></span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

            <!-- TAB 10: TASKS -->
            <div class="tab-pane fade" id="tab-tasks">
                <h6 class="font-heading fw-bold mb-3"><i class="bi bi-check2-square text-primary me-2"></i> Connected Case Tasks</h6>
                <div class="table-responsive">
                    <table class="table align-middle border rounded-4">
                        <thead class="table-light">
                            <tr><th>Task</th><th>Due Date</th><th>Priority</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            <?php if (empty($case_tasks)): ?>
                                <tr><td colspan="4" class="text-center py-4 text-muted">No tasks assigned to this case.</td></tr>
                            <?php else: ?>
                                <?php foreach ($case_tasks as $ct): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo htmlspecialchars($ct['title']); ?></td>
                                        <td><?php echo date('d M Y', strtotime($ct['due_date'])); ?></td>
                                        <td><span class="badge bg-warning text-dark"><?php echo htmlspecialchars($ct['priority']); ?></span></td>
                                        <td><span class="badge bg-success"><?php echo htmlspecialchars($ct['status']); ?></span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 11: DISBURSEMENT -->
            <div class="tab-pane fade" id="tab-disbursement">
                <div class="p-4 border rounded-4 bg-light">
                    <h6 class="font-heading fw-bold text-success mb-3"><i class="bi bi-cash-coin me-2"></i> Sanction & Disbursement Record</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <small class="text-muted d-block">Sanctioned Amount</small>
                            <span class="fw-bold fs-4 text-warning-emphasis">₹<?php echo format_inr($case['sanctioned_amount']); ?></span>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted d-block">Disbursed Amount</small>
                            <span class="fw-bold fs-4 text-success">₹<?php echo format_inr($case['disbursed_amount']); ?></span>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted d-block">Loan Account Number (LAN)</small>
                            <span class="font-monospace fw-bold fs-5"><?php echo htmlspecialchars($case['loan_account_number'] ?: '—'); ?></span>
                        </div>
                    </div>
                    <button class="btn btn-success rounded-pill px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#disbModal">
                        <i class="bi bi-check-circle me-1"></i> Record Disbursement Entry
                    </button>
                </div>
            </div>

            <!-- TAB 12: ACTIVITY LOGS -->
            <div class="tab-pane fade" id="tab-activity">
                <h6 class="font-heading fw-bold mb-3"><i class="bi bi-clock-history text-primary me-2"></i> System Audit Activity Trail</h6>
                <div class="list-group border rounded-4 overflow-hidden">
                    <?php if (empty($case_activities)): ?>
                        <div class="p-4 text-center text-muted">No audit logs recorded for this case.</div>
                    <?php else: ?>
                        <?php foreach ($case_activities as $ca): ?>
                            <div class="list-group-item p-3 border-bottom">
                                <div class="d-flex justify-content-between small text-muted mb-1">
                                    <span class="fw-bold text-dark"><?php echo htmlspecialchars($ca['action']); ?></span>
                                    <span><?php echo date('d M Y, h:i A', strtotime($ca['created_at'])); ?></span>
                                </div>
                                <div class="small text-secondary"><?php echo htmlspecialchars($ca['details']); ?></div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- MODAL: EDIT CASE MASTER -->
<div class="modal fade" id="editCaseModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Edit Loan Case Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="edit_case_master">
                <div class="modal-body p-4">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Required Loan Amount (₹)</label>
                            <input type="number" name="required_loan_amount" class="form-control" value="<?php echo $case['required_loan_amount']; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">CIBIL Score</label>
                            <input type="number" name="cibil_score" class="form-control" value="<?php echo $case['cibil_score']; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">PAN Number</label>
                            <input type="text" name="pan_number" class="form-control text-uppercase" value="<?php echo htmlspecialchars($case['pan_number']); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Aadhaar Last 4</label>
                            <input type="text" name="aadhaar_last_4" class="form-control" maxlength="4" value="<?php echo htmlspecialchars($case['aadhaar_last_4']); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Business Name</label>
                            <input type="text" name="business_name" class="form-control" value="<?php echo htmlspecialchars($case['business_name']); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">GSTIN</label>
                            <input type="text" name="gstin" class="form-control" value="<?php echo htmlspecialchars($case['gstin']); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Annual Turnover (₹)</label>
                            <input type="number" name="annual_turnover" class="form-control" value="<?php echo $case['annual_turnover']; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Existing Monthly EMI (₹)</label>
                            <input type="number" name="existing_emi" class="form-control" value="<?php echo $case['existing_emi']; ?>">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Master Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: CHANGE STAGE -->
<div class="modal fade" id="stageModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Update Pipeline Stage</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="change_stage">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Pipeline Stage *</label>
                        <select name="new_stage" class="form-select" required>
                            <?php foreach ($all_stages as $stg): ?>
                                <option value="<?php echo $stg; ?>" <?php echo $case['current_stage'] === $stg ? 'selected' : ''; ?>><?php echo htmlspecialchars($stg); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Remarks / Reason</label>
                        <textarea name="stage_remarks" class="form-control" rows="3" placeholder="Stage update notes..."></textarea>
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

<!-- MODAL: ADD BANK APP -->
<div class="modal fade" id="addBankModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Add Lender Application</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_bank_app">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Select Lender / Bank *</label>
                        <select name="lender_id" class="form-select" required>
                            <option value="">Select Bank...</option>
                            <?php foreach ($lenders_list as $ld): ?>
                                <option value="<?php echo $ld['id']; ?>"><?php echo htmlspecialchars($ld['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Applied Amount (₹)</label>
                            <input type="number" name="applied_amount" class="form-control" value="<?php echo $case['required_loan_amount']; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Application Date</label>
                            <input type="date" name="application_date" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Bank App No / Login ID</label>
                            <input type="text" name="login_id_lan" class="form-control" placeholder="e.g. LAN123456">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Branch</label>
                            <input type="text" name="branch" class="form-control" placeholder="Main Branch">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Submit Application</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: UPLOAD FILE -->
<div class="modal fade" id="uploadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Upload Document</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" enctype="multipart/form-data">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="upload_file">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Select File (PDF, Images, Office docs)</label>
                        <input type="file" name="project_file" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Upload</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: FOLLOWUP -->
<div class="modal fade" id="followupModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Log Follow-up</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_followup">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Follow-up Type</label>
                        <select name="followup_type" class="form-select">
                            <option value="Call">Call</option>
                            <option value="Email">Email</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Meeting">Meeting</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Follow-up Remarks *</label>
                        <textarea name="followup_remarks" class="form-control" rows="3" required placeholder="Outcome of conversation..."></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Next Follow-up Date & Time</label>
                        <input type="datetime-local" name="next_followup_date" class="form-control">
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold text-dark">Save Follow-up</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: NOTE -->
<div class="modal fade" id="noteModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Post Team Discussion Note</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_note">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Internal Note *</label>
                        <textarea name="note" class="form-control" rows="4" required placeholder="Type internal discussion or instruction..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-info rounded-pill px-4 fw-bold text-dark">Post Note</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: RECORD DISBURSEMENT -->
<div class="modal fade" id="disbModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold">Record Disbursement</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="record_disbursement">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Disbursed Amount (₹) *</label>
                        <input type="number" name="disbursed_amount" class="form-control" required value="<?php echo $case['sanctioned_amount'] ?: $case['required_loan_amount']; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Disbursement Date</label>
                        <input type="date" name="disbursement_date" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Loan Account Number (LAN)</label>
                        <input type="text" name="loan_account_number" class="form-control" placeholder="e.g. LAN987654321">
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-success rounded-pill px-4 fw-bold">Record Disbursement</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
