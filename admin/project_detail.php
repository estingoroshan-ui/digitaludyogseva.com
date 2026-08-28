<?php
$page_title = "Project 360° Workspace";
$active_menu = "projects";
require_once __DIR__ . '/includes/admin_header.php';

$case_id = (int)($_GET['id'] ?? 0);
global $pdo;

// Fetch Project 360 Details with Joins
$stmt = $pdo->prepare("
    SELECT c.*, cust.name AS customer_name, cust.company_name AS customer_company, cust.mobile AS customer_mobile, cust.email AS customer_email,
           COALESCE(s.name, 'Custom Service Project') AS service_name,
           u.name AS staff_name, u.email AS staff_email
    FROM cases c
    JOIN customers cust ON c.customer_id = cust.id
    LEFT JOIN services s ON c.service_id = s.id
    LEFT JOIN employees e ON c.assigned_staff_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    WHERE c.id = ?
");
$stmt->execute([$case_id]);
$project = $stmt->fetch();

if (!$project) {
    echo '<div class="alert alert-danger fw-bold m-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Project record not found.</div>';
    require_once __DIR__ . '/includes/admin_footer.php';
    exit;
}

$msg = '';

// Handle Post Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // Update Status & Stage
    if ($action === 'update_status') {
        $status = sanitize($_POST['status']);
        $stage = sanitize($_POST['current_stage'] ?? '');
        $progress = (int)($_POST['progress_percent'] ?? 0);
        
        $upd = $pdo->prepare("UPDATE cases SET status = ?, current_stage = ?, progress_percent = ?, updated_at = NOW() WHERE id = ?");
        $upd->execute([$status, $stage, $progress, $case_id]);

        ActivityLogger::log('update_project_status', 'case', $case_id, "Updated project status to {$status} ({$progress}%)");
        $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Project status and progress updated successfully. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }
    // Add Project Note
    elseif ($action === 'add_note') {
        $note = sanitize($_POST['note'] ?? '');
        if ($note) {
            $ins = $pdo->prepare("INSERT INTO project_notes (case_id, note, created_by) VALUES (?, ?, ?)");
            $ins->execute([$case_id, $note, $current_user['id'] ?? 1]);
            ActivityLogger::log('add_project_note', 'case', $case_id, "Added internal project note");
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Project discussion note posted. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Upload Project File
    elseif ($action === 'upload_file') {
        if (isset($_FILES['project_file']) && $_FILES['project_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['project_file'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
            
            if (!in_array($ext, $allowed)) {
                $msg = '<div class="alert alert-danger alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Invalid file type. Executable or script files are strictly blocked. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
            } else {
                $upload_dir = __DIR__ . '/../uploads/project_files/';
                if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

                $stored_name = 'prj_file_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
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

                    ActivityLogger::log('upload_project_file', 'case', $case_id, "Uploaded project file {$orig_name}");
                    $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-file-earmark-arrow-up-fill me-2"></i> Document uploaded to Project Vault. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
                }
            }
        }
    }
    // Add Milestone
    elseif ($action === 'add_milestone') {
        $m_name = sanitize($_POST['milestone_name'] ?? '');
        $m_due = $_POST['due_date'] ?: null;
        if ($m_name) {
            $ins = $pdo->prepare("INSERT INTO project_milestones (case_id, milestone_name, due_date, status) VALUES (?, ?, ?, 'pending')");
            $ins->execute([$case_id, $m_name, $m_due]);
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Project milestone created. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Update Milestone Status
    elseif ($action === 'update_milestone_status') {
        $m_id = (int)$_POST['milestone_id'];
        $st = sanitize($_POST['status']);
        $pdo->prepare("UPDATE project_milestones SET status = ?, completed_at = " . ($st === 'completed' ? "NOW()" : "NULL") . " WHERE id = ? AND case_id = ?")->execute([$st, $m_id, $case_id]);
        $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Milestone status updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }

    // Refresh project details
    $stmt->execute([$case_id]);
    $project = $stmt->fetch();
}

// Fetch Sub-resources
$project_notes = $pdo->query("SELECT n.*, u.name AS author_name FROM project_notes n LEFT JOIN users u ON n.created_by = u.id WHERE n.case_id = {$case_id} ORDER BY n.id DESC")->fetchAll();
$project_files = $pdo->query("SELECT f.*, u.name AS uploader_name FROM project_files f LEFT JOIN users u ON f.uploaded_by = u.id WHERE f.case_id = {$case_id} ORDER BY f.id DESC")->fetchAll();
$project_milestones = $pdo->query("SELECT * FROM project_milestones WHERE case_id = {$case_id} ORDER BY id ASC")->fetchAll();
$project_tasks = $pdo->query("SELECT * FROM tasks WHERE case_id = {$case_id} ORDER BY due_date ASC")->fetchAll();
$project_payments = $pdo->query("SELECT * FROM payments WHERE case_id = {$case_id} ORDER BY id DESC")->fetchAll();
$staff_list = $pdo->query("SELECT e.id, u.name FROM employees e JOIN users u ON e.user_id = u.id")->fetchAll();
?>

<?php echo $msg; ?>

<!-- PROJECT HEADER BAR -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
            <a href="projects.php" class="btn btn-light border rounded-circle p-2" title="Back to Projects">
                <i class="bi bi-arrow-left fs-5"></i>
            </a>
            <div>
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h3 class="font-heading fw-bold mb-0 text-dark"><?php echo htmlspecialchars($project['project_name'] ?: $project['service_name']); ?></h3>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle font-monospace px-3 py-1 rounded-pill"><?php echo htmlspecialchars($project['case_code']); ?></span>
                    <span class="badge bg-<?php echo $project['status'] === 'completed' ? 'success' : ($project['status'] === 'active' ? 'primary' : 'warning'); ?> rounded-pill px-3 py-1">
                        <?php echo ucfirst($project['status']); ?>
                    </span>
                    <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">Deal: ₹<?php echo format_inr($project['total_amount']); ?></span>
                </div>
                <div class="text-secondary small d-flex gap-3 align-items-center flex-wrap mt-1">
                    <span><i class="bi bi-person text-primary me-1"></i> Customer: <a href="customers.php?id=<?php echo $project['customer_id']; ?>" class="fw-bold text-dark text-decoration-none"><?php echo htmlspecialchars($project['customer_name']); ?></a></span>
                    <span><i class="bi bi-diagram-2 text-primary me-1"></i> Stage: <strong><?php echo htmlspecialchars($project['current_stage'] ?: 'In Process'); ?></strong></span>
                    <span><i class="bi bi-person-badge text-primary me-1"></i> Assigned Officer: <strong><?php echo htmlspecialchars($project['staff_name'] ?: 'Unassigned'); ?></strong></span>
                    <span><i class="bi bi-calendar-event text-primary me-1"></i> Deadline: <strong><?php echo $project['deadline'] ? date('d-m-Y', strtotime($project['deadline'])) : 'N/A'; ?></strong></span>
                </div>
            </div>
        </div>

        <!-- QUICK ACTION CONTROLS -->
        <div class="d-flex gap-2 flex-wrap align-items-center">
            <button class="btn btn-outline-primary rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#statusModal">
                <i class="bi bi-sliders me-1"></i> Update Status & Progress
            </button>
            <button class="btn btn-outline-secondary rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#noteModal">
                <i class="bi bi-journal-plus me-1"></i> Add Note
            </button>
            <button class="btn btn-outline-info text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#uploadModal">
                <i class="bi bi-paperclip me-1"></i> Upload File
            </button>
            <button class="btn btn-outline-warning text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#milestoneModal">
                <i class="bi bi-flag me-1"></i> Add Milestone
            </button>
        </div>
    </div>

    <!-- PROGRESS BAR -->
    <div class="mt-4 pt-3 border-top">
        <div class="d-flex justify-content-between align-items-center mb-1 small fw-bold">
            <span>Overall Project Progress</span>
            <span class="text-primary"><?php echo (int)$project['progress_percent']; ?>% Completed</span>
        </div>
        <div class="progress rounded-pill" style="height: 12px;">
            <div class="progress-bar bg-primary rounded-pill progress-bar-striped progress-bar-animated" style="width: <?php echo (int)$project['progress_percent']; ?>%;"></div>
        </div>
    </div>
</div>

<!-- WORKSPACE TABS CONTAINER -->
<div class="card border-0 shadow-sm rounded-4 bg-white mb-4">
    <div class="card-header bg-white border-bottom p-3">
        <ul class="nav nav-pills card-header-pills gap-2 flex-wrap" role="tablist">
            <li class="nav-item">
                <button class="nav-link active rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-overview"><i class="bi bi-grid-1x2 me-1"></i> Overview & Workflow</button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-milestones"><i class="bi bi-flag me-1"></i> Milestones <span class="badge bg-secondary ms-1"><?php echo count($project_milestones); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-files"><i class="bi bi-paperclip me-1"></i> Document Vault <span class="badge bg-primary ms-1"><?php echo count($project_files); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-notes"><i class="bi bi-journal-text me-1"></i> Team Notes <span class="badge bg-info text-dark ms-1"><?php echo count($project_notes); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-payments"><i class="bi bi-credit-card me-1"></i> Invoices & Payments <span class="badge bg-success ms-1"><?php echo count($project_payments); ?></span></button>
            </li>
        </ul>
    </div>

    <div class="card-body p-4">
        <div class="tab-content">
            <!-- ========================================================================= -->
            <!-- TAB 1: OVERVIEW & WORKFLOW -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade show active" id="tab-overview">
                <div class="row g-4">
                    <div class="col-md-7">
                        <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-info-circle me-1"></i> Project Scope & Deliverables</h6>
                        <div class="table-responsive mb-4">
                            <table class="table table-bordered align-middle">
                                <tbody>
                                    <tr>
                                        <th width="30%" class="bg-light text-muted">Project Name</th>
                                        <td class="fw-bold text-dark"><?php echo htmlspecialchars($project['project_name'] ?: $project['service_name']); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Customer Name</th>
                                        <td class="fw-bold text-primary"><a href="customers.php?id=<?php echo $project['customer_id']; ?>"><?php echo htmlspecialchars($project['customer_name']); ?></a></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Service Category</th>
                                        <td><?php echo htmlspecialchars($project['service_name']); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Financial Deal Value</th>
                                        <td class="fw-bold text-success fs-5">₹<?php echo format_inr($project['total_amount']); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Current Workflow Stage</th>
                                        <td><span class="badge bg-info-subtle text-dark border px-3 py-1"><?php echo htmlspecialchars($project['current_stage'] ?: 'Application Received'); ?></span></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Description / Scope</th>
                                        <td><?php echo nl2br(htmlspecialchars($project['project_description'] ?: 'No scope details specified.')); ?></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- WORKFLOW STEP PROGRESSION CARD -->
                        <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-diagram-3 me-1"></i> 6-Step Government & Service Workflow Stage</h6>
                        <div class="d-flex flex-column gap-2">
                            <?php
                            $steps = [
                                1 => 'Step 1: Scorecard & Eligibility Evaluation',
                                2 => 'Step 2: Sales & Customer Conversion',
                                3 => 'Step 3: Document Vault & Device/DSC Verification',
                                4 => 'Step 4: Government Department Filing',
                                5 => 'Step 5: Bank Processing & Disbursement',
                                6 => 'Step 6: Pendency Resolution & Closure Desk'
                            ];
                            foreach ($steps as $st_idx => $st_title):
                                $is_active_step = (strpos($project['current_stage'], "Step {$st_idx}") !== false);
                            ?>
                                <div class="p-3 rounded-3 border d-flex justify-content-between align-items-center <?php echo $is_active_step ? 'bg-primary-subtle border-primary text-primary fw-bold' : 'bg-light text-muted'; ?>">
                                    <span><?php echo $st_title; ?></span>
                                    <?php if ($is_active_step): ?>
                                        <span class="badge bg-primary rounded-pill">Current Stage</span>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: FINANCIAL & STAFF CONTROL -->
                    <div class="col-md-5">
                        <div class="card border-0 bg-light rounded-4 p-4 mb-4">
                            <h6 class="font-heading fw-bold text-dark mb-3"><i class="bi bi-wallet2 me-1"></i> Financial Billing Summary</h6>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="text-muted">Total Contract Value:</span>
                                <span class="fw-bold text-dark">₹<?php echo format_inr($project['total_amount']); ?></span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="text-muted">Paid Amount:</span>
                                <span class="fw-bold text-success">₹<?php echo format_inr($project['paid_amount']); ?></span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center border-top pt-2">
                                <span class="fw-bold text-dark">Outstanding Balance:</span>
                                <span class="fw-bold text-danger fs-5">₹<?php echo format_inr(max(0, $project['total_amount'] - $project['paid_amount'])); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 2: MILESTONES -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-milestones">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Project Milestones & Deliverables</h6>
                    <button class="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#milestoneModal"><i class="bi bi-plus-lg me-1"></i> Add Milestone</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Milestone Name</th>
                                <th>Target Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($project_milestones)): ?>
                                <tr><td colspan="4" class="text-center py-4 text-muted">No milestones created yet. Click <strong>+ Add Milestone</strong> to set target checkpoints.</td></tr>
                            <?php else: ?>
                                <?php foreach ($project_milestones as $ms): ?>
                                    <tr>
                                        <td class="fw-bold text-dark"><?php echo htmlspecialchars($ms['milestone_name']); ?></td>
                                        <td><?php echo $ms['due_date'] ? date('d-m-Y', strtotime($ms['due_date'])) : 'N/A'; ?></td>
                                        <td><span class="badge bg-<?php echo $ms['status'] === 'completed' ? 'success' : 'warning'; ?> rounded-pill"><?php echo ucfirst($ms['status']); ?></span></td>
                                        <td>
                                            <?php if ($ms['status'] === 'pending'): ?>
                                                <form action="" method="POST" class="d-inline">
                                                    <?php render_csrf_field(); ?>
                                                    <input type="hidden" name="action" value="update_milestone_status">
                                                    <input type="hidden" name="milestone_id" value="<?php echo $ms['id']; ?>">
                                                    <input type="hidden" name="status" value="completed">
                                                    <button type="submit" class="btn btn-sm btn-success rounded-pill px-3">Mark Achieved</button>
                                                </form>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 3: FILES VAULT -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-files">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Project Document Vault</h6>
                    <button class="btn btn-sm btn-info text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#uploadModal"><i class="bi bi-paperclip me-1"></i> Upload File</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>File Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Uploaded By</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($project_files)): ?>
                                <tr><td colspan="6" class="text-center py-4 text-muted">No documents uploaded to Project Vault.</td></tr>
                            <?php else: ?>
                                <?php foreach ($project_files as $pf): ?>
                                    <tr>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($pf['original_filename']); ?></td>
                                        <td><span class="badge bg-light text-dark border uppercase"><?php echo strtoupper($pf['file_type']); ?></span></td>
                                        <td><?php echo round($pf['file_size'] / 1024, 1); ?> KB</td>
                                        <td><?php echo htmlspecialchars($pf['uploader_name'] ?: 'Staff'); ?></td>
                                        <td class="small text-muted"><?php echo date('d-m-Y H:i', strtotime($pf['created_at'])); ?></td>
                                        <td>
                                            <a href="<?php echo BASE_URL . $pf['file_path']; ?>" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">Download</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 4: NOTES -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-notes">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Internal Team Discussions & Notes</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#noteModal"><i class="bi bi-plus-lg me-1"></i> Add Note</button>
                </div>

                <?php if (empty($project_notes)): ?>
                    <div class="text-center py-4 text-muted border border-dashed rounded-4">No team notes posted yet.</div>
                <?php else: ?>
                    <div class="d-flex flex-column gap-3">
                        <?php foreach ($project_notes as $pn): ?>
                            <div class="card border shadow-sm rounded-4 p-3 bg-white">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <div class="fw-bold text-dark"><i class="bi bi-person-circle text-primary me-1"></i> <?php echo htmlspecialchars($pn['author_name'] ?: 'Staff Officer'); ?></div>
                                    <small class="text-muted"><?php echo date('d-m-Y H:i', strtotime($pn['created_at'])); ?></small>
                                </div>
                                <p class="text-secondary mb-0"><?php echo nl2br(htmlspecialchars($pn['note'])); ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 5: INVOICES & PAYMENTS -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-payments">
                <h6 class="fw-bold mb-3"><i class="bi bi-credit-card text-success me-1"></i> Financial Invoices & Payments Received</h6>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Transaction Code</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Payment Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($project_payments)): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No financial payments logged for this project yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($project_payments as $pm): ?>
                                    <tr>
                                        <td class="fw-bold font-monospace text-primary"><?php echo htmlspecialchars($pm['payment_code']); ?></td>
                                        <td class="fw-bold text-success">₹<?php echo format_inr($pm['amount']); ?></td>
                                        <td><?php echo htmlspecialchars($pm['payment_method']); ?></td>
                                        <td><?php echo date('d-m-Y', strtotime($pm['payment_date'])); ?></td>
                                        <td><span class="badge bg-success rounded-pill">Verified Paid</span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ========================================================================= -->
<!-- MODALS -->
<!-- ========================================================================= -->
<!-- UPDATE STATUS MODAL -->
<div class="modal fade" id="statusModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-sliders text-primary me-2"></i> Update Project Status & Progress</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="update_status">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Project Status Stage</label>
                        <select name="status" class="form-select">
                            <option value="active" <?php echo $project['status'] === 'active' ? 'selected' : ''; ?>>In Process (Active)</option>
                            <option value="on_hold" <?php echo $project['status'] === 'on_hold' ? 'selected' : ''; ?>>Pending (On Hold)</option>
                            <option value="completed" <?php echo $project['status'] === 'completed' ? 'selected' : ''; ?>>Completed & Closed</option>
                            <option value="cancelled" <?php echo $project['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Workflow Step Stage</label>
                        <select name="current_stage" class="form-select">
                            <option value="Step 1: Scorecard & Eligibility Evaluation" <?php echo strpos($project['current_stage'], 'Step 1') !== false ? 'selected' : ''; ?>>Step 1: Scorecard & Eligibility</option>
                            <option value="Step 2: Sales & Customer Conversion" <?php echo strpos($project['current_stage'], 'Step 2') !== false ? 'selected' : ''; ?>>Step 2: Sales & Conversion</option>
                            <option value="Step 3: Document Vault & Device/DSC Verification" <?php echo strpos($project['current_stage'], 'Step 3') !== false ? 'selected' : ''; ?>>Step 3: Document Vault & DSC</option>
                            <option value="Step 4: Government Department Filing" <?php echo strpos($project['current_stage'], 'Step 4') !== false ? 'selected' : ''; ?>>Step 4: Government Filing</option>
                            <option value="Step 5: Bank Processing & Disbursement" <?php echo strpos($project['current_stage'], 'Step 5') !== false ? 'selected' : ''; ?>>Step 5: Bank Disbursement</option>
                            <option value="Step 6: Pendency Resolution & Closure Desk" <?php echo strpos($project['current_stage'], 'Step 6') !== false ? 'selected' : ''; ?>>Step 6: Closure Desk</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Overall Progress Percentage (0-100%)</label>
                        <input type="number" name="progress_percent" class="form-control" min="0" max="100" value="<?php echo (int)$project['progress_percent']; ?>">
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- ADD NOTE MODAL -->
<div class="modal fade" id="noteModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-journal-plus text-primary me-2"></i> Add Team Discussion Note</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_note">
                <div class="modal-body">
                    <textarea name="note" class="form-control" rows="4" required placeholder="Write internal team note or observation..."></textarea>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Post Note</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- UPLOAD FILE MODAL -->
<div class="modal fade" id="uploadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-paperclip text-primary me-2"></i> Upload Document to Vault</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" enctype="multipart/form-data">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="upload_file">
                <div class="modal-body">
                    <input type="file" name="project_file" class="form-control" required>
                    <small class="text-muted mt-1 d-block">Allowed: PDF, JPG, PNG, DOCX, XLSX.</small>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Upload to Vault</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- ADD MILESTONE MODAL -->
<div class="modal fade" id="milestoneModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-flag text-warning me-2"></i> Add Project Milestone</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_milestone">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Milestone Name *</label>
                        <input type="text" name="milestone_name" class="form-control" required placeholder="e.g. Government Portal Registration Clearance">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Target Target Date</label>
                        <input type="date" name="due_date" class="form-control" value="<?php echo date('Y-m-d', strtotime('+7 days')); ?>">
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-warning text-dark rounded-pill px-4 fw-bold">Save Milestone</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
