<?php
$page_title = "Lead 360° Workspace";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/LeadManager.php';

$lead_id = (int)($_GET['id'] ?? 0);
$active_tab = $_GET['tab'] ?? 'overview';
global $pdo;

// Fetch Lead Details with Joins
$stmt = $pdo->prepare("
    SELECT l.*, ls.status_name, ls.color_code, s.name AS service_name, lo.scheme_name,
           lsrc.source_name, u.name AS staff_name
    FROM leads l
    LEFT JOIN lead_statuses ls ON l.status_id = ls.id
    LEFT JOIN lead_sources lsrc ON l.source_id = lsrc.id
    LEFT JOIN services s ON l.interested_service_id = s.id
    LEFT JOIN loan_schemes lo ON l.interested_loan_scheme_id = lo.id
    LEFT JOIN employees e ON l.assigned_employee_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    WHERE l.id = ?
");
$stmt->execute([$lead_id]);
$lead = $stmt->fetch();

if (!$lead) {
    echo '<div class="alert alert-danger fw-bold m-4">Lead record not found.</div>';
    require_once __DIR__ . '/includes/admin_footer.php';
    exit;
}

$msg = '';
// Handle Post Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'add_note') {
        $note = sanitize($_POST['note'] ?? '');
        if ($note) {
            $ins = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'note', 'Internal Staff Note', ?)");
            $ins->execute([$lead_id, $current_user['id'], $note]);
            $msg = '<div class="alert alert-success fw-bold">Note posted to timeline.</div>';
        }
    } elseif ($_POST['action'] === 'convert_customer') {
        $res = LeadManager::convert_lead_to_customer($lead_id);
        if ($res['status']) {
            $msg = '<div class="alert alert-success fw-bold"><i class="bi bi-check-circle me-1"></i> Lead converted into Customer Profile! Customer ID: ' . $res['customer_id'] . '</div>';
            $stmt->execute([$lead_id]);
            $lead = $stmt->fetch();
        } else {
            $msg = '<div class="alert alert-danger fw-bold">' . htmlspecialchars($res['message']) . '</div>';
        }
    } elseif ($_POST['action'] === 'log_followup') {
        $type = sanitize($_POST['followup_type']);
        $result = sanitize($_POST['followup_result']);
        $response = sanitize($_POST['customer_response']);
        $next_action = sanitize($_POST['next_action']);
        $next_date = !empty($_POST['next_followup_date']) ? $_POST['next_followup_date'] : null;

        $ins = $pdo->prepare("
            INSERT INTO followups (
                lead_id, assigned_employee_id, followup_type, followup_date, followup_time,
                notes, followup_result, customer_response, next_action, next_followup_date, status
            ) VALUES (?, ?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?, ?, 'completed')
        ");
        $ins->execute([$lead_id, $current_user['id'], $type, $result, $result, $response, $next_action, $next_date]);

        if ($next_date) {
            $pdo->prepare("INSERT INTO followups (lead_id, assigned_employee_id, followup_type, followup_date, priority, status) VALUES (?, ?, ?, ?, 'medium', 'pending')")
                ->execute([$lead_id, $current_user['id'], $type, $next_date]);
        }

        $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'followup', 'Follow-up Logged', ?)");
        $act->execute([$lead_id, $current_user['id'], "Result: {$result} | Next Action: {$next_action}"]);

        $msg = '<div class="alert alert-success fw-bold">Follow-up interaction logged successfully!</div>';
    } elseif ($_POST['action'] === 'add_notesheet_entry') {
        $subject = sanitize($_POST['subject'] ?? 'Official NoteSheet Minute');
        $body = sanitize($_POST['body'] ?? '');
        $stage_tag = sanitize($_POST['stage_tag'] ?? 'General');
        
        if ($body) {
            $ins = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'notesheet', ?, ?)");
            $ins->execute([$lead_id, $current_user['id'], "[NoteSheet: {$stage_tag}] {$subject}", $body]);
            $msg = '<div class="alert alert-success fw-bold"><i class="bi bi-file-earmark-check-fill me-1"></i> Official NoteSheet Minute logged successfully!</div>';
        }
    } elseif ($_POST['action'] === 'update_handoff_step') {
        $next_step = intval($_POST['next_step'] ?? 1);
        $step_notes = sanitize($_POST['step_notes'] ?? '');
        
        $step_names = [
            1 => 'Step 1: Scorecard & Eligibility Evaluation',
            2 => 'Step 2: Sales & Customer Conversion',
            3 => 'Step 3: Document Vault & Device/DSC Verification',
            4 => 'Step 4: Government Department Filing',
            5 => 'Step 5: Bank Processing & Disbursement',
            6 => 'Step 6: Pendency Resolution & Closure Desk'
        ];
        $target_name = $step_names[$next_step] ?? 'Step ' . $next_step;
        
        $ins = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'handoff', ?, ?)");
        $ins->execute([$lead_id, $current_user['id'], "Case Handoff: Advanced to {$target_name}", $step_notes ?: "Handed over to next officer."]);
        
        $msg = '<div class="alert alert-success fw-bold"><i class="bi bi-arrow-right-circle-fill me-1"></i> Case Handoff Updated: Advanced to ' . htmlspecialchars($target_name) . '!</div>';
    }
}

// Fetch Lead Data for Sub-Sections
$statuses = $pdo->query("SELECT * FROM lead_statuses ORDER BY sort_order ASC")->fetchAll();
$followup_history = $pdo->prepare("SELECT f.*, u.name AS staff_name FROM followups f LEFT JOIN employees e ON f.assigned_employee_id = e.id LEFT JOIN users u ON e.user_id = u.id WHERE f.lead_id = ? ORDER BY f.id DESC");
$followup_history->execute([$lead_id]);
$followups = $followup_history->fetchAll();

$activities = $pdo->prepare("SELECT a.*, u.name AS staff_name FROM lead_activities a LEFT JOIN users u ON a.user_id = u.id WHERE a.lead_id = ? ORDER BY a.id DESC");
$activities->execute([$lead_id]);
$act_list = $activities->fetchAll();

$appts = $pdo->prepare("SELECT * FROM appointments WHERE lead_id = ? ORDER BY appointment_date DESC");
$appts->execute([$lead_id]);
$appt_list = $appts->fetchAll();

$tasks = $pdo->prepare("SELECT * FROM tasks WHERE lead_id = ? ORDER BY due_date ASC");
$tasks->execute([$lead_id]);
$task_list = $tasks->fetchAll();
?>

<!-- FIXED TOP SUMMARY BAR -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
            <a href="crm_leads.php" class="btn btn-light border rounded-circle p-2" title="Back to Leads List">
                <i class="bi bi-arrow-left"></i>
            </a>
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h3 class="font-heading fw-bold mb-0"><?php echo htmlspecialchars($lead['name']); ?></h3>
                    <span class="badge bg-light text-dark border font-monospace fs-7"><?php echo htmlspecialchars($lead['lead_code']); ?></span>
                    <?php if ($lead['temperature'] === 'hot'): ?>
                        <span class="badge bg-danger fs-7">🔥 Hot</span>
                    <?php else: ?>
                        <span class="badge bg-warning text-dark fs-7">🟠 Warm</span>
                    <?php endif; ?>
                </div>
                <div class="text-secondary small d-flex gap-3 align-items-center flex-wrap">
                    <span><i class="bi bi-telephone text-primary me-1"></i> <?php echo htmlspecialchars($lead['mobile']); ?></span>
                    <span><i class="bi bi-building text-primary me-1"></i> <?php echo htmlspecialchars($lead['business_name'] ?: 'Individual'); ?></span>
                    <span><i class="bi bi-geo-alt text-primary me-1"></i> <?php echo htmlspecialchars($lead['state'] . ', ' . $lead['district']); ?></span>
                    <span><i class="bi bi-person text-primary me-1"></i> Staff: <strong><?php echo htmlspecialchars($lead['staff_name'] ?: 'Unassigned'); ?></strong></span>
                </div>
            </div>
        </div>

        <!-- TOP QUICK ACTIONS -->
        <div class="d-flex align-items-center gap-2 flex-wrap">
            <a href="tel:<?php echo htmlspecialchars($lead['mobile']); ?>" class="btn btn-success rounded-pill px-3 fw-bold">
                <i class="bi bi-telephone-fill me-1"></i> Call
            </a>
            <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $lead['mobile']); ?>" target="_blank" class="btn btn-outline-success rounded-pill px-3 fw-bold">
                <i class="bi bi-whatsapp me-1"></i> WhatsApp
            </a>
            <button class="btn btn-warning text-dark rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#followupModal">
                <i class="bi bi-calendar-plus me-1"></i> Schedule Follow-up
            </button>

            <?php if ($lead['status_id'] != 17): ?>
                <form action="" method="POST" onsubmit="return confirm('Convert this Lead into a Customer profile?');">
                    <input type="hidden" name="action" value="convert_customer">
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow">
                        <i class="bi bi-person-check-fill me-1"></i> Convert Customer
                    </button>
                </form>
            <?php else: ?>
                <span class="badge bg-success fs-6 px-3 py-2 rounded-pill"><i class="bi bi-check-circle-fill me-1"></i> Converted Customer</span>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php echo $msg; ?>

<!-- WORKSPACE LAYOUT: LEFT MENU + MAIN CONTENT -->
<div class="row g-4">
    <!-- LEFT-SIDE VERTICAL NAVIGATION MENU -->
    <div class="col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="nav flex-column nav-pills custom-workspace-nav gap-1">
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=handoff" class="nav-link <?php echo $active_tab === 'handoff' ? 'active fw-bold' : ''; ?>">
                    <i class="bi bi-diagram-3-fill me-2 text-warning"></i> 6-Step Project Handoff
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=notesheet" class="nav-link <?php echo $active_tab === 'notesheet' ? 'active fw-bold' : ''; ?>">
                    <i class="bi bi-file-earmark-richtext-fill me-2 text-success"></i> Official NoteSheet
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=overview" class="nav-link <?php echo $active_tab === 'overview' ? 'active' : ''; ?>">
                    <i class="bi bi-grid me-2"></i> Overview
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=contact" class="nav-link <?php echo $active_tab === 'contact' ? 'active' : ''; ?>">
                    <i class="bi bi-person-badge me-2"></i> Contact & Business
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=followups" class="nav-link <?php echo $active_tab === 'followups' ? 'active' : ''; ?>">
                    <i class="bi bi-clock-history me-2"></i> Follow-ups History (<?php echo count($followups); ?>)
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=appointments" class="nav-link <?php echo $active_tab === 'appointments' ? 'active' : ''; ?>">
                    <i class="bi bi-calendar-check me-2"></i> Appointments (<?php echo count($appt_list); ?>)
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=notes" class="nav-link <?php echo $active_tab === 'notes' ? 'active' : ''; ?>">
                    <i class="bi bi-journal-text me-2"></i> Internal Notes & Comments
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=loan" class="nav-link <?php echo $active_tab === 'loan' ? 'active' : ''; ?>">
                    <i class="bi bi-bank me-2"></i> Loan Requirement
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=tasks" class="nav-link <?php echo $active_tab === 'tasks' ? 'active' : ''; ?>">
                    <i class="bi bi-check2-square me-2"></i> Tasks (<?php echo count($task_list); ?>)
                </a>
                <a href="crm_lead_detail.php?id=<?php echo $lead_id; ?>&tab=timeline" class="nav-link <?php echo $active_tab === 'timeline' ? 'active' : ''; ?>">
                    <i class="bi bi-diagram-2 me-2"></i> Activity Timeline
                </a>
            </div>
        </div>
    </div>

    <!-- MAIN WORKSPACE SECTION CONTENT -->
    <div class="col-lg-9">
        <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white min-vh-50">
            <?php if ($active_tab === 'handoff'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4"><i class="bi bi-diagram-3-fill text-warning me-2"></i>6-Step Stepwise Project Handoff System</h5>
                <p class="text-muted fs-7 mb-4">Each step is assigned to a specific specialist officer. Progress the case sequentially from Scorecard Evaluation to Bank & Pendency Closure.</p>

                <!-- 6-Step Visual Handoff Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="card border-0 bg-light p-3 rounded-3 h-100 border-start border-4 border-primary">
                            <span class="badge bg-primary w-fit mb-2">Step 1</span>
                            <h6 class="fw-bold mb-1">Scorecard & Eligibility</h6>
                            <small class="text-muted d-block mb-2">Evaluates CIBIL, eligibility & scheme criteria.</small>
                            <span class="badge bg-success fs-7">Officer Approved</span>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 bg-light p-3 rounded-3 h-100 border-start border-4 border-warning">
                            <span class="badge bg-warning text-dark w-fit mb-2">Step 2</span>
                            <h6 class="fw-bold mb-1">Sales & Conversion</h6>
                            <small class="text-muted d-block mb-2">Converts lead into paying client profile.</small>
                            <span class="badge bg-warning text-dark fs-7">Active</span>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 bg-light p-3 rounded-3 h-100 border-start border-4 border-secondary">
                            <span class="badge bg-secondary w-fit mb-2">Step 3</span>
                            <h6 class="fw-bold mb-1">Document & DSC / Device Desk</h6>
                            <small class="text-muted d-block mb-2">Digital Signature, Token & Document Vault verification.</small>
                            <span class="badge bg-secondary fs-7">Queued</span>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 bg-light p-3 rounded-3 h-100 border-start border-4 border-secondary">
                            <span class="badge bg-secondary w-fit mb-2">Step 4</span>
                            <h6 class="fw-bold mb-1">Government Department Desk</h6>
                            <small class="text-muted d-block mb-2">KVIC, MSME, FSSAI, GST or ROC portal filing.</small>
                            <span class="badge bg-secondary fs-7">Queued</span>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 bg-light p-3 rounded-3 h-100 border-start border-4 border-secondary">
                            <span class="badge bg-secondary w-fit mb-2">Step 5</span>
                            <h6 class="fw-bold mb-1">Bank Processing Officer</h6>
                            <small class="text-muted d-block mb-2">File submission, query reply & sanction letter.</small>
                            <span class="badge bg-secondary fs-7">Queued</span>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 bg-light p-3 rounded-3 h-100 border-start border-4 border-secondary">
                            <span class="badge bg-secondary w-fit mb-2">Step 6</span>
                            <h6 class="fw-bold mb-1">Pendency & Subsidy Closure</h6>
                            <small class="text-muted d-block mb-2">Resolves client query pendency & subsidy claims.</small>
                            <span class="badge bg-secondary fs-7">Queued</span>
                        </div>
                    </div>
                </div>

                <!-- Advance Handoff Step Form -->
                <div class="card border p-4 rounded-3 bg-white mb-4">
                    <h6 class="fw-bold mb-3"><i class="bi bi-arrow-right-circle text-primary me-2"></i>Advance Case to Next Step Specialist</h6>
                    <form method="POST" action="">
                        <input type="hidden" name="action" value="update_handoff_step">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Target Step Officer</label>
                                <select name="next_step" class="form-select">
                                    <option value="2">Step 2: Sales & Conversion Specialist</option>
                                    <option value="3">Step 3: Document Vault & DSC/Device Desk</option>
                                    <option value="4">Step 4: Government Department Desk</option>
                                    <option value="5">Step 5: Bank Processing Officer</option>
                                    <option value="6">Step 6: Pendency Resolution & Closure Officer</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Handoff Instructions / Notes</label>
                                <input type="text" name="step_notes" class="form-control" placeholder="e.g. CIBIL score is 745. Proceeds to Bank File Preparation.">
                            </div>
                            <div class="col-12 text-end">
                                <button type="submit" class="btn btn-primary fw-bold px-4">
                                    <i class="bi bi-send-check me-1"></i>Hand Over to Next Specialist
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            <?php elseif ($active_tab === 'notesheet'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4"><i class="bi bi-file-earmark-richtext-fill text-success me-2"></i>Official Internal NoteSheet & Approval Minutes</h5>
                <p class="text-muted fs-7 mb-4">Permanent green-sheet audit minute entries logged by case managers, consultants, and department officers.</p>

                <!-- New NoteSheet Entry Form -->
                <div class="card border-0 bg-light p-4 rounded-3 mb-4">
                    <h6 class="fw-bold mb-3"><i class="bi bi-pencil-square text-success me-2"></i>Log Official NoteSheet Minute</h6>
                    <form method="POST" action="">
                        <input type="hidden" name="action" value="add_notesheet_entry">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Stage Tag</label>
                                <select name="stage_tag" class="form-select">
                                    <option value="Eligibility & Scorecard">Eligibility & Scorecard</option>
                                    <option value="Sales & Agreement">Sales & Agreement</option>
                                    <option value="Device / DSC Verification">Device / DSC Verification</option>
                                    <option value="Department Clearance">Department Clearance</option>
                                    <option value="Bank Sanction">Bank Sanction</option>
                                    <option value="Pendency Resolution">Pendency Resolution</option>
                                </select>
                            </div>
                            <div class="col-md-8">
                                <label class="form-label fw-semibold">Minute Subject / Title</label>
                                <input type="text" name="subject" class="form-control" placeholder="e.g. DPR Verification & Bank NOC Approval" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold">Official Note Body / Remarks</label>
                                <textarea name="body" class="form-control" rows="3" placeholder="Enter detailed technical observations, document checklist verification, or approval notes." required></textarea>
                            </div>
                            <div class="col-12 text-end">
                                <button type="submit" class="btn btn-success fw-bold px-4">
                                    <i class="bi bi-check-lg me-1"></i>Post Official Minute
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- NoteSheet Entries Feed -->
                <h6 class="fw-bold mb-3">NoteSheet History & Minutes</h6>
                <div class="list-group border">
                    <?php 
                    $notesheet_items = array_filter($act_list, fn($a) => strpos($a['title'], '[NoteSheet') !== false || $a['activity_type'] === 'notesheet');
                    if (empty($notesheet_items)): 
                    ?>
                        <div class="text-center py-4 text-muted">No official NoteSheet minutes logged yet for this case.</div>
                    <?php else: ?>
                        <?php foreach ($notesheet_items as $ns): ?>
                            <div class="list-group-item p-3 border-start border-4 border-success">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <h6 class="fw-bold text-dark mb-0"><?php echo htmlspecialchars($ns['title']); ?></h6>
                                    <small class="text-muted"><i class="bi bi-person me-1"></i><?php echo htmlspecialchars($ns['staff_name'] ?: 'Officer'); ?> | <?php echo date('d M Y, h:i A', strtotime($ns['created_at'])); ?></small>
                                </div>
                                <p class="mb-0 text-secondary fs-7"><?php echo nl2br(htmlspecialchars($ns['description'])); ?></p>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

            <?php elseif ($active_tab === 'overview'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4">Lead Overview & Summary</h5>
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3">
                            <small class="text-muted text-uppercase fw-bold">Requirement / Service</small>
                            <h6 class="fw-bold text-primary mt-1 mb-0">
                                <?php echo htmlspecialchars($lead['service_name'] ?: ($lead['scheme_name'] ?: 'General Inquiry')); ?>
                            </h6>
                            <?php if ($lead['required_loan_amount'] > 0): ?>
                                <small class="text-success fw-bold">Loan Amount: ₹<?php echo format_inr($lead['required_loan_amount']); ?></small>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3">
                            <small class="text-muted text-uppercase fw-bold">Acquisition Channel</small>
                            <h6 class="fw-bold text-dark mt-1 mb-0"><?php echo htmlspecialchars($lead['source_name'] ?: 'Website'); ?></h6>
                            <small class="text-muted"><?php echo htmlspecialchars($lead['source_detail'] ?: 'Direct Inquiry'); ?></small>
                        </div>
                    </div>
                </div>

                <h6 class="font-heading fw-bold mb-3">Recent Timeline Updates</h6>
                <div class="timeline border-start border-2 border-primary ps-3">
                    <?php foreach (array_slice($act_list, 0, 5) as $act): ?>
                        <div class="mb-3">
                            <strong class="d-block text-dark"><?php echo htmlspecialchars($act['title']); ?></strong>
                            <small class="text-muted"><?php echo date('d M Y, h:i A', strtotime($act['created_at'])); ?></small>
                            <p class="small text-secondary mb-0"><?php echo htmlspecialchars($act['description']); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>

            <?php elseif ($active_tab === 'followups'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4">Chronological Follow-up Interaction History</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Date & Time</th>
                                <th>Type</th>
                                <th>Staff Member</th>
                                <th>Outcome / Result</th>
                                <th>Customer Response</th>
                                <th>Next Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($followups)): ?>
                                <tr><td colspan="6" class="text-center text-muted py-4">No follow-up history recorded yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($followups as $flw): ?>
                                    <tr>
                                        <td class="fw-bold text-dark"><?php echo date('d M Y, h:i A', strtotime($flw['followup_date'] . ' ' . $flw['followup_time'])); ?></td>
                                        <td><span class="badge bg-secondary"><?php echo strtoupper($flw['followup_type'] ?: 'CALL'); ?></span></td>
                                        <td><small><?php echo htmlspecialchars($flw['staff_name'] ?: 'Staff'); ?></small></td>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($flw['followup_result'] ?: $flw['notes']); ?></td>
                                        <td><small><?php echo htmlspecialchars($flw['customer_response'] ?: 'N/A'); ?></small></td>
                                        <td><span class="badge bg-info text-dark"><?php echo htmlspecialchars($flw['next_action'] ?: 'None'); ?></span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

            <?php elseif ($active_tab === 'notes'): ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4">Internal Staff Notes & Comments</h5>
                <form action="" method="POST" class="mb-4">
                    <input type="hidden" name="action" value="add_note">
                    <div class="mb-3">
                        <textarea name="note" class="form-control" rows="3" required placeholder="Type internal note or discussion summary..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Post Internal Note</button>
                </form>

                <div class="vstack gap-3">
                    <?php foreach ($act_list as $act): ?>
                        <?php if ($act['activity_type'] === 'note'): ?>
                            <div class="p-3 bg-light border-start border-4 border-primary rounded-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <strong class="text-dark"><?php echo htmlspecialchars($act['staff_name'] ?: 'Staff'); ?></strong>
                                    <small class="text-muted"><?php echo date('d M Y, h:i A', strtotime($act['created_at'])); ?></small>
                                </div>
                                <p class="small text-secondary mb-0"><?php echo nl2br(htmlspecialchars($act['description'])); ?></p>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>

            <?php else: ?>
                <h5 class="font-heading fw-bold border-bottom pb-2 mb-4"><?php echo ucfirst($active_tab); ?> Details</h5>
                <p class="text-muted">Section content displayed cleanly for <?php echo htmlspecialchars($active_tab); ?>.</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- SCHEDULE FOLLOW-UP MODAL -->
<div class="modal fade" id="followupModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Log & Schedule Follow-up</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="log_followup">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Follow-up Type *</label>
                        <select name="followup_type" class="form-select">
                            <option value="call">Phone Call</option>
                            <option value="whatsapp">WhatsApp Chat</option>
                            <option value="meeting">Office Meeting</option>
                            <option value="video_call">Video Call</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Discussion Outcome / Result *</label>
                        <input type="text" name="followup_result" class="form-control" required placeholder="Outcome of the call...">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Customer Response</label>
                        <textarea name="customer_response" class="form-control" rows="2" placeholder="Client remarks..."></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Next Action Required</label>
                        <input type="text" name="next_action" class="form-control" placeholder="e.g. Send PMEGP Project Report">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Next Follow-up Date</label>
                        <input type="date" name="next_followup_date" class="form-control" value="<?php echo date('Y-m-d', strtotime('+2 days')); ?>">
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Log & Schedule</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
