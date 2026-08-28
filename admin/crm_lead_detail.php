<?php
$page_title = "Lead 360° Workspace";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/LeadManager.php';

$lead_id = (int)($_GET['id'] ?? 0);
$active_tab = $_GET['tab'] ?? 'overview';
global $pdo;

// Fetch 360 Lead Data
$profile = LeadManager::get_lead_360($lead_id);

if (!$profile['status']) {
    echo '<div class="alert alert-danger fw-bold m-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Lead record not found.</div>';
    require_once __DIR__ . '/includes/admin_footer.php';
    exit;
}

$lead = $profile['lead'];
$msg = '';

// Handle Post Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    // Update Status
    if ($action === 'update_status') {
        $status_id = (int)$_POST['status_id'];
        if (LeadManager::update_status($lead_id, $status_id, $current_user['id'] ?? 1)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Status updated successfully. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Update Source
    elseif ($action === 'update_source') {
        $source_id = (int)$_POST['source_id'];
        if (LeadManager::update_source($lead_id, $source_id, $current_user['id'] ?? 1)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Lead source updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Assign Staff
    elseif ($action === 'assign_staff') {
        $staff_id = (int)$_POST['assigned_employee_id'];
        if (LeadManager::assign_staff($lead_id, $staff_id, $current_user['id'] ?? 1)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Assigned officer updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Add Note
    elseif ($action === 'add_note') {
        $note = sanitize($_POST['note'] ?? '');
        if (LeadManager::add_note($lead_id, $note, $current_user['id'] ?? 1)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Internal note posted to timeline. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Delete Note
    elseif ($action === 'delete_note') {
        $note_id = (int)$_POST['note_id'];
        if (LeadManager::delete_note($note_id, $lead_id)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Note deleted. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Add Reminder
    elseif ($action === 'add_reminder') {
        if (LeadManager::add_reminder($lead_id, $_POST, $current_user['id'] ?? 1)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-alarm-fill me-2"></i> Follow-up reminder scheduled. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Update Reminder Status
    elseif ($action === 'update_reminder_status') {
        $r_id = (int)$_POST['reminder_id'];
        $st = sanitize($_POST['status']);
        $pdo->prepare("UPDATE lead_reminders SET status = ? WHERE id = ? AND lead_id = ?")->execute([$st, $r_id, $lead_id]);
        $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Reminder status updated to ' . ucfirst($st) . '. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }
    // Log Followup Interaction
    elseif ($action === 'log_followup') {
        if (LeadManager::log_followup($lead_id, $_POST, $current_user['id'] ?? 1)) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-telephone-check-fill me-2"></i> Call / Meeting interaction logged! <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Upload Attachment
    elseif ($action === 'upload_attachment') {
        if (isset($_FILES['attachment_file']) && $_FILES['attachment_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['attachment_file'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
            
            if (!in_array($ext, $allowed)) {
                $msg = '<div class="alert alert-danger alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Invalid file type. Executable or script files are strictly blocked. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
            } else {
                $upload_dir = __DIR__ . '/../uploads/lead_files/';
                if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

                $stored_name = 'lead_doc_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                $target_path = $upload_dir . $stored_name;

                if (move_uploaded_file($file['tmp_name'], $target_path)) {
                    $db_path = 'uploads/lead_files/' . $stored_name;
                    $orig_name = sanitize($file['name']);
                    $file_size = (int)$file['size'];

                    $ins = $pdo->prepare("
                        INSERT INTO lead_attachments (lead_id, file_path, file_name, original_filename, file_size, file_type, uploaded_by)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ");
                    $ins->execute([$lead_id, $db_path, $stored_name, $orig_name, $file_size, $ext, $current_user['id'] ?? 1]);

                    $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'file', 'Document Uploaded', ?)")
                        ->execute([$lead_id, $current_user['id'] ?? 1, "Uploaded attachment: {$orig_name}"]);

                    $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-file-earmark-arrow-up-fill me-2"></i> File attachment uploaded to Lead Vault. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
                }
            }
        }
    }
    // Delete Attachment
    elseif ($action === 'delete_attachment') {
        $att_id = (int)$_POST['att_id'];
        $att = $pdo->query("SELECT * FROM lead_attachments WHERE id = {$att_id} AND lead_id = {$lead_id}")->fetch();
        if ($att) {
            if (file_exists(__DIR__ . '/../' . $att['file_path'])) {
                @unlink(__DIR__ . '/../' . $att['file_path']);
            }
            $pdo->prepare("DELETE FROM lead_attachments WHERE id = ?")->execute([$att_id]);
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> File deleted. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }
    // Convert to Customer
    elseif ($action === 'convert_customer') {
        $res = LeadManager::convert_lead_to_customer($lead_id);
        if ($res['status']) {
            $msg = '<div class="alert alert-success alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Lead converted into Customer Profile! <a href="customers.php?id=' . $res['customer_id'] . '" class="fw-bold text-success text-decoration-underline ms-2">View Customer 360° Profile #CUST-' . $res['customer_id'] . '</a> <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        } else {
            $msg = '<div class="alert alert-danger alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> ' . htmlspecialchars($res['message']) . ' <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    }

    // Refresh profile data after post action
    $profile = LeadManager::get_lead_360($lead_id);
    $lead = $profile['lead'];
}

// Fetch Dropdowns
$statuses = $pdo->query("SELECT * FROM lead_statuses ORDER BY sort_order ASC")->fetchAll();
$sources = $pdo->query("SELECT * FROM lead_sources WHERE status = 'active'")->fetchAll();
$employees = $pdo->query("SELECT e.id, u.name FROM employees e JOIN users u ON e.user_id = u.id")->fetchAll();
?>

<?php echo $msg; ?>

<!-- PERFEX-STYLE LEAD HEADER WORKSPACE BAR -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
            <a href="crm_leads.php" class="btn btn-light border rounded-circle p-2" title="Back to Leads Directory">
                <i class="bi bi-arrow-left fs-5"></i>
            </a>
            <div>
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h3 class="font-heading fw-bold mb-0 text-dark"><?php echo htmlspecialchars($lead['name']); ?></h3>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle font-monospace px-3 py-1 rounded-pill"><?php echo htmlspecialchars($lead['lead_code']); ?></span>
                    <?php if ($lead['temperature'] === 'hot'): ?>
                        <span class="badge bg-danger rounded-pill px-3 py-1">🔥 Hot Lead</span>
                    <?php else: ?>
                        <span class="badge bg-warning text-dark rounded-pill px-3 py-1">🟠 Warm Lead</span>
                    <?php endif; ?>
                    <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">Deal: ₹<?php echo format_inr($lead['lead_value']); ?></span>
                </div>
                <div class="text-secondary small d-flex gap-3 align-items-center flex-wrap mt-1">
                    <span><i class="bi bi-building text-primary me-1"></i> <?php echo htmlspecialchars($lead['company'] ?: 'Individual Client'); ?></span>
                    <span><i class="bi bi-telephone text-primary me-1"></i> <a href="tel:<?php echo htmlspecialchars($lead['mobile']); ?>" class="text-decoration-none text-dark"><?php echo htmlspecialchars($lead['mobile']); ?></a></span>
                    <span><i class="bi bi-envelope text-primary me-1"></i> <?php echo htmlspecialchars($lead['email'] ?: 'N/A'); ?></span>
                    <span><i class="bi bi-geo-alt text-primary me-1"></i> <?php echo htmlspecialchars($lead['state'] . ', ' . $lead['district']); ?></span>
                    <span><i class="bi bi-person text-primary me-1"></i> Staff: <strong><?php echo htmlspecialchars($lead['staff_name'] ?: 'Unassigned'); ?></strong></span>
                </div>
            </div>
        </div>

        <!-- QUICK ACTION CONTROLS -->
        <div class="d-flex gap-2 flex-wrap align-items-center">
            <a href="tel:<?php echo htmlspecialchars($lead['mobile']); ?>" class="btn btn-outline-success rounded-pill px-3 fw-bold" title="Call Client">
                <i class="bi bi-telephone-fill me-1"></i> Call
            </a>
            <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $lead['mobile']); ?>" target="_blank" class="btn btn-outline-success rounded-pill px-3 fw-bold" title="WhatsApp Message">
                <i class="bi bi-whatsapp me-1"></i> WhatsApp
            </a>
            <button class="btn btn-outline-primary rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#noteModal">
                <i class="bi bi-journal-plus me-1"></i> Add Note
            </button>
            <button class="btn btn-outline-warning text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#reminderModal">
                <i class="bi bi-alarm me-1"></i> Reminder
            </button>
            <button class="btn btn-outline-info text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#followupModal">
                <i class="bi bi-telephone-out me-1"></i> Log Call
            </button>

            <!-- CONVERT TO CUSTOMER BUTTON -->
            <form action="" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to convert this Lead into an Official Customer Profile?');">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="convert_customer">
                <button type="submit" class="btn btn-success rounded-pill px-4 fw-bold shadow-sm">
                    <i class="bi bi-person-check-fill me-1"></i> Convert to Customer
                </button>
            </form>
        </div>
    </div>
</div>

<!-- WORKSPACE TABS CONTAINER -->
<div class="card border-0 shadow-sm rounded-4 bg-white mb-4">
    <div class="card-header bg-white border-bottom p-3">
        <ul class="nav nav-pills card-header-pills gap-2 flex-wrap" role="tablist">
            <li class="nav-item">
                <button class="nav-link active rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-overview"><i class="bi bi-grid-1x2 me-1"></i> Overview & Profile</button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-notes"><i class="bi bi-journal-text me-1"></i> Notes & Thread <span class="badge bg-secondary ms-1"><?php echo count($profile['notes']); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-reminders"><i class="bi bi-alarm me-1"></i> Reminders <span class="badge bg-warning text-dark ms-1"><?php echo count($profile['reminders']); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-followups"><i class="bi bi-telephone-out me-1"></i> Call Logs <span class="badge bg-info text-dark ms-1"><?php echo count($profile['followups']); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-files"><i class="bi bi-paperclip me-1"></i> Document Vault <span class="badge bg-primary ms-1"><?php echo count($profile['attachments']); ?></span></button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-timeline"><i class="bi bi-clock-history me-1"></i> Activity Timeline</button>
            </li>
        </ul>
    </div>

    <div class="card-body p-4">
        <div class="tab-content">
            <!-- ========================================================================= -->
            <!-- TAB 1: OVERVIEW & PROFILE -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade show active" id="tab-overview">
                <div class="row g-4">
                    <!-- LEFT COLUMN: LEAD DETAILS -->
                    <div class="col-md-7">
                        <h6 class="font-heading fw-bold text-primary mb-3"><i class="bi bi-info-circle me-1"></i> Detailed Lead Information</h6>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle">
                                <tbody>
                                    <tr>
                                        <th width="30%" class="bg-light text-muted">Full Name</th>
                                        <td class="fw-bold text-dark"><?php echo htmlspecialchars($lead['name']); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Title / Designation</th>
                                        <td><?php echo htmlspecialchars($lead['title'] ?: 'N/A'); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Company / Business</th>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($lead['company'] ?: 'Individual'); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Primary Mobile</th>
                                        <td><a href="tel:<?php echo htmlspecialchars($lead['mobile']); ?>" class="fw-bold text-dark text-decoration-none"><i class="bi bi-telephone me-1 text-primary"></i> <?php echo htmlspecialchars($lead['mobile']); ?></a></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">WhatsApp Number</th>
                                        <td><?php echo htmlspecialchars($lead['whatsapp_number'] ?: 'N/A'); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Email Address</th>
                                        <td><?php echo htmlspecialchars($lead['email'] ?: 'N/A'); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Estimated Deal Value</th>
                                        <td class="fw-bold text-success fs-5">₹<?php echo format_inr($lead['lead_value']); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">GSTIN / PAN</th>
                                        <td><?php echo htmlspecialchars($lead['gstin'] ?: ($lead['pan'] ?: 'N/A')); ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Website</th>
                                        <td><?php echo $lead['website'] ? '<a href="' . htmlspecialchars($lead['website']) . '" target="_blank">' . htmlspecialchars($lead['website']) . '</a>' : 'N/A'; ?></td>
                                    </tr>
                                    <tr>
                                        <th class="bg-light text-muted">Address</th>
                                        <td><?php echo htmlspecialchars($lead['address'] ?: ($lead['state'] . ', ' . $lead['district'])); ?></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: QUICK SELECTORS & PIPELINE CONFIG -->
                    <div class="col-md-5">
                        <div class="card border-0 bg-light rounded-4 p-4">
                            <h6 class="font-heading fw-bold text-dark mb-3"><i class="bi bi-sliders me-1"></i> Pipeline & Assignment Control</h6>

                            <!-- STATUS SELECTOR FORM -->
                            <form action="" method="POST" class="mb-3">
                                <?php render_csrf_field(); ?>
                                <input type="hidden" name="action" value="update_status">
                                <label class="form-label small fw-bold">Current Status Stage</label>
                                <div class="input-group">
                                    <select name="status_id" class="form-select fw-bold">
                                        <?php foreach ($statuses as $st): ?>
                                            <option value="<?php echo $st['id']; ?>" <?php echo $lead['status_id'] == $st['id'] ? 'selected' : ''; ?>>
                                                <?php echo htmlspecialchars($st['status_name']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <button type="submit" class="btn btn-primary fw-bold px-3">Update Stage</button>
                                </div>
                            </form>

                            <!-- SOURCE SELECTOR FORM -->
                            <form action="" method="POST" class="mb-3">
                                <?php render_csrf_field(); ?>
                                <input type="hidden" name="action" value="update_source">
                                <label class="form-label small fw-bold">Lead Source</label>
                                <div class="input-group">
                                    <select name="source_id" class="form-select">
                                        <?php foreach ($sources as $src): ?>
                                            <option value="<?php echo $src['id']; ?>" <?php echo $lead['source_id'] == $src['id'] ? 'selected' : ''; ?>>
                                                <?php echo htmlspecialchars($src['source_name']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <button type="submit" class="btn btn-outline-secondary fw-bold px-3">Save Source</button>
                                </div>
                            </form>

                            <!-- ASSIGN STAFF FORM -->
                            <form action="" method="POST">
                                <?php render_csrf_field(); ?>
                                <input type="hidden" name="action" value="assign_staff">
                                <label class="form-label small fw-bold">Assigned Staff Officer</label>
                                <div class="input-group">
                                    <select name="assigned_employee_id" class="form-select">
                                        <option value="0">Unassigned</option>
                                        <?php foreach ($employees as $emp): ?>
                                            <option value="<?php echo $emp['id']; ?>" <?php echo $lead['assigned_employee_id'] == $emp['id'] ? 'selected' : ''; ?>>
                                                <?php echo htmlspecialchars($emp['name']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <button type="submit" class="btn btn-outline-primary fw-bold px-3">Assign Officer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 2: NOTES & THREAD -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-notes">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Internal Staff Notes Thread</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#noteModal"><i class="bi bi-plus-lg me-1"></i> Add Internal Note</button>
                </div>

                <?php if (empty($profile['notes'])): ?>
                    <div class="text-center py-5 text-muted border border-dashed rounded-4">No internal staff notes posted yet.</div>
                <?php else: ?>
                    <div class="d-flex flex-column gap-3">
                        <?php foreach ($profile['notes'] as $nt): ?>
                            <div class="card border shadow-sm rounded-4 p-3 bg-white">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <div class="fw-bold text-dark"><i class="bi bi-person-circle text-primary me-1"></i> <?php echo htmlspecialchars($nt['author_name'] ?: 'Staff'); ?></div>
                                    <div class="d-flex align-items-center gap-2">
                                        <small class="text-muted"><?php echo date('d-m-Y H:i', strtotime($nt['created_at'])); ?></small>
                                        <form action="" method="POST" onsubmit="return confirm('Delete this note?');">
                                            <?php render_csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete_note">
                                            <input type="hidden" name="note_id" value="<?php echo $nt['id']; ?>">
                                            <button type="submit" class="btn btn-sm btn-light text-danger rounded-circle p-1" title="Delete Note"><i class="bi bi-trash"></i></button>
                                        </form>
                                    </div>
                                </div>
                                <p class="text-secondary mb-0"><?php echo nl2br(htmlspecialchars($nt['note'])); ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 3: REMINDERS -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-reminders">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Follow-up Schedule & Reminders</h6>
                    <button class="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#reminderModal"><i class="bi bi-alarm me-1"></i> Add Reminder</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Schedule Date & Time</th>
                                <th>Description / Action Plan</th>
                                <th>Assigned Officer</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile['reminders'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No scheduled reminders found.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile['reminders'] as $rm): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo date('d-m-Y', strtotime($rm['reminder_date'])); ?> <?php echo date('h:i A', strtotime($rm['reminder_time'])); ?></td>
                                        <td><?php echo htmlspecialchars($rm['description']); ?></td>
                                        <td><?php echo htmlspecialchars($rm['staff_name'] ?: 'Staff'); ?></td>
                                        <td><span class="badge bg-<?php echo $rm['status'] === 'completed' ? 'success' : 'warning'; ?> rounded-pill"><?php echo ucfirst($rm['status']); ?></span></td>
                                        <td>
                                            <?php if ($rm['status'] === 'pending'): ?>
                                                <form action="" method="POST" class="d-inline">
                                                    <?php render_csrf_field(); ?>
                                                    <input type="hidden" name="action" value="update_reminder_status">
                                                    <input type="hidden" name="reminder_id" value="<?php echo $rm['id']; ?>">
                                                    <input type="hidden" name="status" value="completed">
                                                    <button type="submit" class="btn btn-sm btn-success rounded-pill px-3">Mark Complete</button>
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
            <!-- TAB 4: CALL LOGS -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-followups">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Phone Call & Meeting Interaction History</h6>
                    <button class="btn btn-sm btn-info text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#followupModal"><i class="bi bi-telephone-out me-1"></i> Log Call</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Date & Time</th>
                                <th>Type</th>
                                <th>Logged By</th>
                                <th>Outcome / Result</th>
                                <th>Next Action Plan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile['followups'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No call interactions logged.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile['followups'] as $fl): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo date('d-m-Y H:i', strtotime($fl['created_at'])); ?></td>
                                        <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($fl['followup_type']); ?></span></td>
                                        <td><?php echo htmlspecialchars($fl['staff_name'] ?: 'Staff'); ?></td>
                                        <td><?php echo htmlspecialchars($fl['notes'] ?: $fl['followup_result']); ?></td>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($fl['next_action'] ?: 'N/A'); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 5: DOCUMENT VAULT & ATTACHMENTS -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-files">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Lead Document Vault & File Attachments</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#uploadModal"><i class="bi bi-paperclip me-1"></i> Upload File</button>
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
                            <?php if (empty($profile['attachments'])): ?>
                                <tr><td colspan="6" class="text-center py-4 text-muted">No files uploaded to vault.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile['attachments'] as $at): ?>
                                    <tr>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($at['original_filename']); ?></td>
                                        <td><span class="badge bg-light text-dark border uppercase"><?php echo strtoupper($at['file_type']); ?></span></td>
                                        <td><?php echo round($at['file_size'] / 1024, 1); ?> KB</td>
                                        <td><?php echo htmlspecialchars($at['uploader_name'] ?: 'Staff'); ?></td>
                                        <td class="small text-muted"><?php echo date('d-m-Y H:i', strtotime($at['created_at'])); ?></td>
                                        <td>
                                            <a href="<?php echo BASE_URL . $at['file_path']; ?>" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1">Download</a>
                                            <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete this file?');">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="delete_attachment">
                                                <input type="hidden" name="att_id" value="<?php echo $at['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-light text-danger rounded-circle p-1"><i class="bi bi-trash"></i></button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- TAB 6: TIMELINE -->
            <!-- ========================================================================= -->
            <div class="tab-pane fade" id="tab-timeline">
                <h6 class="fw-bold mb-3"><i class="bi bi-clock-history text-primary me-1"></i> Chronological Activity Audit Trail</h6>
                <div class="d-flex flex-column gap-3">
                    <?php if (empty($profile['activities'])): ?>
                        <div class="text-center py-4 text-muted">No activities logged yet.</div>
                    <?php else: ?>
                        <?php foreach ($profile['activities'] as $act): ?>
                            <div class="d-flex gap-3 align-items-start border-start border-3 border-primary ps-3 py-1">
                                <div>
                                    <div class="fw-bold text-dark"><?php echo htmlspecialchars($act['title']); ?></div>
                                    <p class="text-muted small mb-1"><?php echo htmlspecialchars($act['description']); ?></p>
                                    <small class="text-secondary" style="font-size: 11px;"><?php echo date('d-m-Y H:i:s', strtotime($act['created_at'])); ?> | Officer: <?php echo htmlspecialchars($act['staff_name'] ?: 'System'); ?></small>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ========================================================================= -->
<!-- MODALS: NOTE, REMINDER, FOLLOWUP, UPLOAD -->
<!-- ========================================================================= -->
<!-- ADD NOTE MODAL -->
<div class="modal fade" id="noteModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-journal-plus text-primary me-2"></i> Add Internal Staff Note</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_note">
                <div class="modal-body">
                    <label class="form-label small fw-bold">Internal Note Content *</label>
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

<!-- ADD REMINDER MODAL -->
<div class="modal fade" id="reminderModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-alarm text-warning me-2"></i> Schedule Follow-up Reminder</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_reminder">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Date *</label>
                            <input type="date" name="reminder_date" class="form-control" required value="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Time</label>
                            <input type="time" name="reminder_time" class="form-control" value="10:00">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label small fw-bold">Assigned Staff Officer</label>
                            <select name="assigned_staff_id" class="form-select">
                                <?php foreach ($employees as $emp): ?>
                                    <option value="<?php echo $emp['id']; ?>" <?php echo $lead['assigned_employee_id'] == $emp['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($emp['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label small fw-bold">Description / Action Required *</label>
                            <textarea name="description" class="form-control" rows="3" required placeholder="Follow-up call details, meeting agenda..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-warning text-dark rounded-pill px-4 fw-bold">Schedule Reminder</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- LOG CALL MODAL -->
<div class="modal fade" id="followupModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-telephone-out text-info me-2"></i> Log Phone Call / Meeting</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="log_followup">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Interaction Type</label>
                            <select name="followup_type" class="form-select">
                                <option value="Call">Phone Call</option>
                                <option value="WhatsApp">WhatsApp Chat</option>
                                <option value="Meeting">In-Person Meeting</option>
                                <option value="Email">Email Communication</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Next Followup Date</label>
                            <input type="date" name="next_followup_date" class="form-control">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label small fw-bold">Call Outcome / Summary *</label>
                            <textarea name="followup_result" class="form-control" rows="3" required placeholder="Summary of phone conversation..."></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label small fw-bold">Next Action Plan</label>
                            <input type="text" name="next_action" class="form-control" placeholder="e.g. Send proposal document via WhatsApp">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-info text-dark rounded-pill px-4 fw-bold">Log Interaction</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- UPLOAD ATTACHMENT MODAL -->
<div class="modal fade" id="uploadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-paperclip text-primary me-2"></i> Upload File to Lead Vault</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" enctype="multipart/form-data">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="upload_attachment">
                <div class="modal-body">
                    <label class="form-label small fw-bold">Select File (PDF, JPG, PNG, DOCX, XLSX) *</label>
                    <input type="file" name="attachment_file" class="form-control" required>
                    <small class="text-muted mt-1 d-block">Executables & scripts are strictly blocked.</small>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Upload to Vault</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
