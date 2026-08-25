<?php
$page_title = "Service Master & Dynamic Workflow Builder | DUS Enterprise OS";
$active_menu = "services";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;

$msg = '';
$error = '';

$selected_service_id = intval($_GET['service_id'] ?? 1);

// Handle New Workflow Task Addition
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_workflow_task') {
    verify_csrf_token($_POST['csrf_token'] ?? '');
    
    $service_id = intval($_POST['service_id']);
    $stage_name = $_POST['stage_name'] ?? 'Internal Office';
    $task_title = trim($_POST['task_title'] ?? '');
    $assigned_role_key = $_POST['assigned_role_key'] ?? 'case_manager';
    $tat_days = intval($_POST['tat_days'] ?? 2);
    $is_qc_required = isset($_POST['is_qc_required']) ? 1 : 0;
    
    if ($task_title !== '') {
        try {
            $stmt = $pdo->prepare("INSERT INTO service_workflows (service_id, stage_name, task_title, assigned_role_key, tat_days, is_qc_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, 10)");
            $stmt->execute([$service_id, $stage_name, $task_title, $assigned_role_key, $tat_days, $is_qc_required]);
            $msg = "Workflow Task added successfully!";
        } catch (Exception $e) {
            $error = "Error adding task: " . $e->getMessage();
        }
    }
}

// Handle Document Checklist Addition
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_document_checklist') {
    verify_csrf_token($_POST['csrf_token'] ?? '');
    
    $service_id = intval($_POST['service_id']);
    $document_name = trim($_POST['document_name'] ?? '');
    $is_mandatory = isset($_POST['is_mandatory']) ? 1 : 0;
    
    if ($document_name !== '') {
        try {
            $stmt = $pdo->prepare("INSERT INTO service_document_checklists (service_id, document_name, is_mandatory) VALUES (?, ?, ?)");
            $stmt->execute([$service_id, $document_name, $is_mandatory]);
            $msg = "Document Checklist item added successfully!";
        } catch (Exception $e) {
            $error = "Error adding document: " . $e->getMessage();
        }
    }
}

// Fetch all services
$services = $pdo->query("SELECT s.*, sc.name as category_name FROM services s JOIN service_categories sc ON s.category_id = sc.id ORDER BY s.name ASC")->fetchAll();

// Fetch current service details
$stmt = $pdo->prepare("SELECT s.*, sc.name as category_name FROM services s JOIN service_categories sc ON s.category_id = sc.id WHERE s.id = ?");
$stmt->execute([$selected_service_id]);
$current_service = $stmt->fetch();

if (!$current_service && !empty($services)) {
    $current_service = $services[0];
    $selected_service_id = $current_service['id'];
}

// Fetch workflows and checklists for selected service
$workflows = [];
$checklists = [];
if ($current_service) {
    $w_stmt = $pdo->prepare("SELECT * FROM service_workflows WHERE service_id = ? ORDER BY sort_order ASC, id ASC");
    $w_stmt->execute([$selected_service_id]);
    $workflows = $w_stmt->fetchAll();

    $c_stmt = $pdo->prepare("SELECT * FROM service_document_checklists WHERE service_id = ? ORDER BY id ASC");
    $c_stmt->execute([$selected_service_id]);
    $checklists = $c_stmt->fetchAll();
}
?>

<div class="content-wrapper p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-1"><i class="bi bi-diagram-3-fill text-primary me-2"></i>Service Master & Dynamic Workflow Builder</h4>
            <p class="text-muted fs-7 mb-0">Configure custom pricing, mandatory document checklists, and auto-generated task sequences without coding.</p>
        </div>
        <div>
            <a href="<?php echo BASE_URL; ?>admin/services.php" class="btn btn-outline-secondary btn-sm me-2"><i class="bi bi-arrow-left me-1"></i>Back to Catalog</a>
            <a href="<?php echo BASE_URL; ?>admin/service_workflow_builder.php" class="btn btn-primary btn-sm"><i class="bi bi-plus-circle me-1"></i>Create New Service</a>
        </div>
    </div>

    <?php if ($msg): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i><?php echo htmlspecialchars($msg); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i><?php echo htmlspecialchars($error); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="row g-4">
        <!-- Left Sidebar: Service Selector -->
        <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-3">
                <div class="card-header bg-white py-3">
                    <h6 class="fw-bold mb-0"><i class="bi bi-list-stars me-2 text-primary"></i>Service Master Catalog</h6>
                </div>
                <div class="list-group list-group-flush border-0">
                    <?php foreach ($services as $srv): ?>
                        <a href="?service_id=<?php echo $srv['id']; ?>" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center <?php echo $srv['id'] == $selected_service_id ? 'active fw-bold' : ''; ?>">
                            <div>
                                <div><?php echo htmlspecialchars($srv['name']); ?></div>
                                <small class="<?php echo $srv['id'] == $selected_service_id ? 'text-white-50' : 'text-muted'; ?>"><?php echo htmlspecialchars($srv['category_name']); ?></small>
                            </div>
                            <span class="badge <?php echo $srv['id'] == $selected_service_id ? 'bg-light text-dark' : 'bg-primary'; ?> rounded-pill">
                                ₹<?php echo number_format($srv['final_price']); ?>
                            </span>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Right Content: Workflow & Document Configuration -->
        <div class="col-lg-8">
            <?php if ($current_service): ?>
                <!-- Service Overview Header -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-soft-primary text-primary px-3 py-2 rounded-pill mb-2"><?php echo htmlspecialchars($current_service['category_name']); ?></span>
                                <h4 class="fw-bold mb-1"><?php echo htmlspecialchars($current_service['name']); ?></h4>
                                <p class="text-muted fs-7 mb-0"><?php echo htmlspecialchars($current_service['short_description'] ?? 'Dynamic Workflow & Document Engine'); ?></p>
                            </div>
                            <div class="text-end">
                                <div class="fs-4 fw-bold text-success">₹<?php echo number_format($current_service['final_price']); ?></div>
                                <small class="text-muted">Govt: ₹<?php echo number_format($current_service['govt_fee']); ?> | Prof: ₹<?php echo number_format($current_service['prof_fee']); ?></small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabbed Configuration: Workflows vs Checklists -->
                <div class="card border-0 shadow-sm rounded-3">
                    <div class="card-header bg-white border-bottom-0 pt-3">
                        <ul class="nav nav-tabs card-header-tabs" id="workflowTabs" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active fw-bold" id="tasks-tab" data-bs-toggle="tab" data-bs-target="#tasks-pane"><i class="bi bi-diagram-2 me-2"></i>Stage-wise Task Sequence (<?php echo count($workflows); ?>)</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link fw-bold" id="docs-tab" data-bs-toggle="tab" data-bs-target="#docs-pane"><i class="bi bi-file-earmark-check me-2"></i>Mandatory Document Checklist (<?php echo count($checklists); ?>)</button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body p-4">
                        <div class="tab-content" id="workflowTabsContent">
                            <!-- Tasks Pane -->
                            <div class="tab-pane fade show active" id="tasks-pane">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="fw-bold mb-0">Automated Task Lifecycle (5-Stage Architecture)</h6>
                                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addTaskModal"><i class="bi bi-plus-lg me-1"></i>Add Workflow Task</button>
                                </div>

                                <?php if (empty($workflows)): ?>
                                    <div class="text-center py-5 text-muted border rounded-3 bg-light">
                                        <i class="bi bi-info-circle fs-2 text-primary d-block mb-2"></i>
                                        <p class="mb-0">No automated tasks defined yet for this service. Click "Add Workflow Task" to create one.</p>
                                    </div>
                                <?php else: ?>
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle border">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Stage</th>
                                                    <th>Task Title</th>
                                                    <th>Assigned Role</th>
                                                    <th>TAT</th>
                                                    <th>QC Required</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php foreach ($workflows as $wf): ?>
                                                    <tr>
                                                        <td><span class="badge bg-info text-dark"><?php echo htmlspecialchars($wf['stage_name']); ?></span></td>
                                                        <td class="fw-bold"><?php echo htmlspecialchars($wf['task_title']); ?></td>
                                                        <td><span class="badge bg-secondary"><?php echo htmlspecialchars($wf['assigned_role_key']); ?></span></td>
                                                        <td><i class="bi bi-clock me-1 text-warning"></i><?php echo intval($wf['tat_days']); ?> Days</td>
                                                        <td><?php echo $wf['is_qc_required'] ? '<span class="badge bg-danger">QC Mandatory</span>' : '<span class="badge bg-success">Auto-Approved</span>'; ?></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                            </tbody>
                                        </table>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <!-- Documents Pane -->
                            <div class="tab-pane fade" id="docs-pane">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="fw-bold mb-0">Client Document Verification Checklist</h6>
                                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addDocModal"><i class="bi bi-plus-lg me-1"></i>Add Checklist Item</button>
                                </div>

                                <?php if (empty($checklists)): ?>
                                    <div class="text-center py-5 text-muted border rounded-3 bg-light">
                                        <i class="bi bi-file-earmark-x fs-2 text-primary d-block mb-2"></i>
                                        <p class="mb-0">No document checklist defined yet. Click "Add Checklist Item" to specify required uploads.</p>
                                    </div>
                                <?php else: ?>
                                    <ul class="list-group border">
                                        <?php foreach ($checklists as $chk): ?>
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <i class="bi bi-file-earmark-text text-primary me-2"></i>
                                                    <span class="fw-bold"><?php echo htmlspecialchars($chk['document_name']); ?></span>
                                                </div>
                                                <span class="badge <?php echo $chk['is_mandatory'] ? 'bg-danger' : 'bg-secondary'; ?>">
                                                    <?php echo $chk['is_mandatory'] ? 'Mandatory' : 'Optional'; ?>
                                                </span>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>

            <?php else: ?>
                <div class="alert alert-info">Please select a service from the left menu.</div>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Modal: Add Task -->
<div class="modal fade" id="addTaskModal" tabindex="-1">
    <div class="modal-dialog">
        <form method="POST" class="modal-content">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            <input type="hidden" name="action" value="add_workflow_task">
            <input type="hidden" name="service_id" value="<?php echo $selected_service_id; ?>">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Add Automated Task</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Target Lifecycle Stage</label>
                    <select name="stage_name" class="form-select">
                        <option value="Internal Office">Stage 1: Internal Office (QC / DPR / Eligibility)</option>
                        <option value="Department">Stage 2: Department Filing Desk</option>
                        <option value="Bank">Stage 3: Bank Processing Desk</option>
                        <option value="Customer">Stage 4: Customer Signoff & Contribution</option>
                        <option value="Closure">Stage 5: Closure & Subsidy Claim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Task Title</label>
                    <input type="text" name="task_title" class="form-control" placeholder="e.g. Verify Financial Documents & Prepare DPR" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Assigned Role</label>
                    <select name="assigned_role_key" class="form-select">
                        <option value="case_manager">Case Manager (Internal Ops)</option>
                        <option value="loan_consultant">Loan Consultant</option>
                        <option value="qc_checker">QC / Senior Checker</option>
                        <option value="external_ca">External CA / CS Professional</option>
                        <option value="external_advocate">External Advocate</option>
                    </select>
                </div>
                <div class="row g-3">
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-semibold">TAT (Days)</label>
                        <input type="number" name="tat_days" class="form-control" value="2" min="1" required>
                    </div>
                    <div class="col-md-6 mb-3 d-flex align-items-center pt-4">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="is_qc_required" id="isQcSwitch" checked>
                            <label class="form-check-label fw-semibold" for="isQcSwitch">QC Approval Required</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Task</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal: Add Document -->
<div class="modal fade" id="addDocModal" tabindex="-1">
    <div class="modal-dialog">
        <form method="POST" class="modal-content">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            <input type="hidden" name="action" value="add_document_checklist">
            <input type="hidden" name="service_id" value="<?php echo $selected_service_id; ?>">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Add Document Checklist Item</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Document Name</label>
                    <input type="text" name="document_name" class="form-control" placeholder="e.g. Last 3 Years ITR Copies" required>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" name="is_mandatory" id="isMandatorySwitch" checked>
                    <label class="form-check-label fw-semibold" for="isMandatorySwitch">Mark as Mandatory Upload</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Document</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
