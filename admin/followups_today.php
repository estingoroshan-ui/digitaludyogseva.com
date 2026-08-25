<?php
$page_title = "Today's Follow-up Command Center";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

// Handle Followup Completion / Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'log_followup') {
        $lead_id = (int)$_POST['lead_id'];
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

        $msg = '<div class="alert alert-success fw-bold">Follow-up interaction logged successfully! Timeline updated.</div>';
    }
}

// KPI Statistics Queries
$today_count = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date = CURDATE() AND status = 'pending'")->fetchColumn();
$overdue_count = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date < CURDATE() AND status = 'pending'")->fetchColumn();
$completed_today = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date = CURDATE() AND status = 'completed'")->fetchColumn();
$upcoming_count = $pdo->query("SELECT COUNT(*) FROM followups WHERE followup_date > CURDATE() AND status = 'pending'")->fetchColumn();

// Fetch All Pending Follow-ups (Overdue & Today)
$pending_followups = $pdo->query("
    SELECT f.*, l.id AS lead_id, l.lead_code, l.name AS lead_name, l.mobile, l.business_name, l.temperature, l.priority AS lead_priority,
           s.name AS service_name, u.name AS staff_name
    FROM followups f
    JOIN leads l ON f.lead_id = l.id
    LEFT JOIN services s ON l.interested_service_id = s.id
    LEFT JOIN employees e ON f.assigned_employee_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    WHERE f.status = 'pending' AND f.followup_date <= CURDATE()
    ORDER BY f.followup_date ASC, f.followup_time ASC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Today's Follow-up Command Center</h4>
        <p class="text-muted small mb-0">High-density list of overdue & scheduled follow-ups. Execute calls & log interactions.</p>
    </div>
    <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="btn btn-primary rounded-pill px-4 fw-bold">
        <i class="bi bi-list-task me-1"></i> Leads CRM List
    </a>
</div>

<?php echo $msg; ?>

<!-- KPI STATS CARDS -->
<div class="row g-3 mb-4">
    <div class="col-xl-3 col-md-6">
        <div class="stat-card p-3 border-danger bg-danger-subtle">
            <small class="text-danger text-uppercase fw-bold">Overdue Queue</small>
            <h3 class="fw-bold text-danger my-1"><?php echo $overdue_count; ?></h3>
            <small class="text-muted">Action Required</small>
        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="stat-card p-3 border-warning bg-warning-subtle">
            <small class="text-warning-emphasis text-uppercase fw-bold">Scheduled Today</small>
            <h3 class="fw-bold text-dark my-1"><?php echo $today_count; ?></h3>
            <small class="text-muted">Today's Queue</small>
        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="stat-card p-3 border-success bg-success-subtle">
            <small class="text-success text-uppercase fw-bold">Completed Today</small>
            <h3 class="fw-bold text-success my-1"><?php echo $completed_today; ?></h3>
            <small class="text-muted">Log Activity</small>
        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="stat-card p-3">
            <small class="text-muted text-uppercase fw-bold">Upcoming Days</small>
            <h3 class="fw-bold text-primary my-1"><?php echo $upcoming_count; ?></h3>
            <small class="text-muted">Scheduled Future</small>
        </div>
    </div>
</div>

<!-- HIGH DENSITY LIST TABLE OF PENDING & OVERDUE FOLLOW-UPS -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <h5 class="font-heading fw-bold mb-3"><i class="bi bi-clock-history text-primary me-2"></i> Pending & Overdue Follow-ups Queue</h5>
    
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Scheduled Date & Time</th>
                    <th>Lead Code & Name</th>
                    <th>Mobile</th>
                    <th>Requirement</th>
                    <th>Assigned Staff</th>
                    <th>Overdue Indicator</th>
                    <th class="text-end">Quick Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($pending_followups)): ?>
                    <tr><td colspan="7" class="text-center text-muted py-5">No pending follow-ups found for today. Great job!</td></tr>
                <?php else: ?>
                    <?php foreach ($pending_followups as $flw): ?>
                        <?php
                        $is_overdue = strtotime($flw['followup_date']) < strtotime(date('Y-m-d'));
                        ?>
                        <tr class="<?php echo $is_overdue ? 'table-danger-subtle' : ''; ?>">
                            <td class="fw-bold <?php echo $is_overdue ? 'text-danger' : 'text-primary'; ?>">
                                <?php echo date('d M Y', strtotime($flw['followup_date'])); ?> @ <?php echo date('h:i A', strtotime($flw['followup_time'])); ?>
                            </td>
                            <td>
                                <strong class="d-block text-dark">
                                    <a href="crm_lead_detail.php?id=<?php echo $flw['lead_id']; ?>" class="text-dark text-decoration-none hover-primary">
                                        <?php echo htmlspecialchars($flw['lead_name']); ?>
                                    </a>
                                </strong>
                                <small class="text-muted font-monospace"><?php echo htmlspecialchars($flw['lead_code']); ?></small>
                            </td>
                            <td class="fw-bold"><i class="bi bi-telephone me-1 text-primary"></i> <?php echo htmlspecialchars($flw['mobile']); ?></td>
                            <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($flw['service_name'] ?: 'General Inquiry'); ?></span></td>
                            <td><small><?php echo htmlspecialchars($flw['staff_name'] ?: 'Unassigned'); ?></small></td>
                            <td>
                                <?php if ($is_overdue): ?>
                                    <span class="badge bg-danger text-white fs-7">🚨 OVERDUE</span>
                                <?php else: ?>
                                    <span class="badge bg-warning text-dark fs-7">⏰ TODAY</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-end">
                                <div class="d-flex gap-2 justify-content-end">
                                    <a href="tel:<?php echo htmlspecialchars($flw['mobile']); ?>" class="btn btn-sm btn-success rounded-pill px-3 fw-bold">
                                        <i class="bi bi-telephone-fill me-1"></i> Call
                                    </a>
                                    <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $flw['mobile']); ?>" target="_blank" class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold">
                                        <i class="bi bi-whatsapp me-1"></i> WhatsApp
                                    </a>
                                    <button class="btn btn-sm btn-primary rounded-pill px-3 fw-bold" data-bs-toggle="modal" data-bs-target="#logModal<?php echo $flw['id']; ?>">
                                        Log Result
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- LOG FOLLOWUP MODAL -->
                        <div class="modal fade" id="logModal<?php echo $flw['id']; ?>" tabindex="-1">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content rounded-4 border-0">
                                    <div class="modal-header border-0 pb-0">
                                        <h5 class="modal-title font-heading fw-bold">Log Interaction Result</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <form action="" method="POST">
                                        <input type="hidden" name="action" value="log_followup">
                                        <input type="hidden" name="lead_id" value="<?php echo $flw['lead_id']; ?>">
                                        <div class="modal-body">
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Interaction Mode *</label>
                                                <select name="followup_type" class="form-select">
                                                    <option value="call">Phone Call</option>
                                                    <option value="whatsapp">WhatsApp Chat</option>
                                                    <option value="meeting">Office Meeting</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Discussion Result / Outcome *</label>
                                                <input type="text" name="followup_result" class="form-control" required placeholder="e.g. Interested, sent loan eligibility details">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Customer Response</label>
                                                <textarea name="customer_response" class="form-control" rows="2" placeholder="Client remarks..."></textarea>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Next Action Required</label>
                                                <input type="text" name="next_action" class="form-control" placeholder="e.g. Schedule document verification meeting">
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
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
