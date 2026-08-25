<?php
$page_title = "Appointment & Consultation Calendar";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'book_appointment') {
    $cust_id = !empty($_POST['customer_id']) ? (int)$_POST['customer_id'] : null;
    $lead_id = !empty($_POST['lead_id']) ? (int)$_POST['lead_id'] : null;
    $type = sanitize($_POST['appointment_type']);
    $date = $_POST['appointment_date'];
    $time = $_POST['appointment_time'];
    $mode = sanitize($_POST['mode']);
    $link = sanitize($_POST['meeting_link'] ?? '');
    $notes = sanitize($_POST['notes'] ?? '');

    $ins = $pdo->prepare("
        INSERT INTO appointments (
            customer_id, lead_id, staff_id, appointment_type, appointment_date, appointment_time, mode, meeting_link, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    ");
    $ins->execute([$cust_id, $lead_id, $current_user['id'], $type, $date, $time, $mode, $link, $notes]);
    $msg = '<div class="alert alert-success fw-bold">Appointment booked successfully on ' . date('d M Y', strtotime($date)) . ' at ' . date('h:i A', strtotime($time)) . '!</div>';
}

$appointments = $pdo->query("
    SELECT a.*, l.name AS lead_name, c.name AS customer_name, u.name AS staff_name
    FROM appointments a
    LEFT JOIN leads l ON a.lead_id = l.id
    LEFT JOIN customers c ON a.customer_id = c.id
    LEFT JOIN employees e ON a.staff_id = e.id
    LEFT JOIN users u ON e.user_id = u.id
    ORDER BY a.appointment_date DESC, a.appointment_time ASC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Appointment & Consultation Calendar</h4>
        <p class="text-muted small mb-0">Schedule and manage consultations, office meetings & loan verification appointments.</p>
    </div>
    <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#newApptModal">
        <i class="bi bi-calendar-plus me-1"></i> Schedule Appointment
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <h5 class="font-heading fw-bold mb-3"><i class="bi bi-calendar3 text-primary me-2"></i> Scheduled Appointments Directory</h5>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Date & Time</th>
                    <th>Client / Lead Name</th>
                    <th>Appointment Type</th>
                    <th>Mode</th>
                    <th>Assigned Staff</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($appointments)): ?>
                    <tr><td colspan="6" class="text-center text-muted py-4">No appointments scheduled yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($appointments as $ap): ?>
                        <tr>
                            <td class="fw-bold text-primary">
                                <?php echo date('d M Y', strtotime($ap['appointment_date'])); ?> @ <?php echo date('h:i A', strtotime($ap['appointment_time'])); ?>
                            </td>
                            <td class="fw-bold"><?php echo htmlspecialchars($ap['customer_name'] ?: ($ap['lead_name'] ?: 'Client')); ?></td>
                            <td><span class="badge bg-secondary"><?php echo htmlspecialchars($ap['appointment_type']); ?></span></td>
                            <td>
                                <span class="badge bg-info text-dark"><i class="bi bi-camera-video me-1"></i> <?php echo htmlspecialchars($ap['mode']); ?></span>
                            </td>
                            <td><small><?php echo htmlspecialchars($ap['staff_name'] ?: 'Staff'); ?></small></td>
                            <td><span class="badge bg-success"><?php echo htmlspecialchars($ap['status']); ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW APPOINTMENT MODAL -->
<div class="modal fade" id="newApptModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Schedule Consultation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="book_appointment">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Appointment Type *</label>
                        <select name="appointment_type" class="form-select" required>
                            <option value="Phone Consultation">Phone Consultation</option>
                            <option value="Office Meeting">Office Meeting</option>
                            <option value="Video Meeting">Video Meeting (Google Meet/Zoom)</option>
                            <option value="Document Verification">Document Verification</option>
                            <option value="Loan Consultation">Government Business Loan Consultation</option>
                            <option value="CA Consultation">CA / Tax Consultation</option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-bold">Date *</label>
                            <input type="date" name="appointment_date" class="form-control" required value="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-bold">Start Time *</label>
                            <input type="time" name="appointment_time" class="form-control" required value="11:00">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Mode *</label>
                        <select name="mode" class="form-select">
                            <option value="phone">Phone Call</option>
                            <option value="video">Video Call</option>
                            <option value="office">Office Visit</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Video Meeting Link (Optional)</label>
                        <input type="url" name="meeting_link" class="form-control" placeholder="https://meet.google.com/xyz-abc">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Consultation Notes</label>
                        <textarea name="notes" class="form-control" rows="2" placeholder="Agenda or customer notes..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Book Appointment</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
