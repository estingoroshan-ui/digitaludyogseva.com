<?php
$page_title = "Franchise Support Desk | Digital Udyog Seva";
$active_menu = "support";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_ticket') {
    $cat = sanitize($_POST['category']);
    $subj = sanitize($_POST['subject']);
    $message = sanitize($_POST['message']);

    $t_code = generate_code('TKT', 6);
    $ins = $pdo->prepare("
        INSERT INTO support_tickets (ticket_code, franchise_id, user_id, category, subject, message, status)
        VALUES (?, ?, ?, ?, ?, ?, 'open')
    ");
    $ins->execute([$t_code, $franchise_id, $current_user['id'], $cat, $subj, $message]);

    $msg = '<div class="alert alert-success fw-bold">Support ticket created successfully! Ticket Code: ' . $t_code . '</div>';
}

$tickets = $pdo->prepare("SELECT * FROM support_tickets WHERE franchise_id = ? ORDER BY id DESC");
$tickets->execute([$franchise_id]);
$ticket_list = $tickets->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Franchise Support Desk</h4>
        <p class="text-muted small mb-0">Raise tickets for case processing issues, payment verifications, or technical support.</p>
    </div>
    <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#newTicketModal">
        <i class="bi bi-headset me-1"></i> Open Support Ticket
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Ticket Code</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Created Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($ticket_list)): ?>
                    <tr><td colspan="5" class="text-center text-muted py-4">No support tickets raised yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($ticket_list as $t): ?>
                        <tr>
                            <td><strong class="font-monospace text-primary"><?php echo htmlspecialchars($t['ticket_code']); ?></strong></td>
                            <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($t['category']); ?></span></td>
                            <td class="fw-bold"><?php echo htmlspecialchars($t['subject']); ?></td>
                            <td><small class="text-muted"><?php echo date('d M Y', strtotime($t['created_at'])); ?></small></td>
                            <td><span class="badge bg-warning text-dark"><?php echo ucfirst($t['status']); ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW TICKET MODAL -->
<div class="modal fade" id="newTicketModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Open Support Ticket</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="create_ticket">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Category *</label>
                        <select name="category" class="form-select" required>
                            <option value="Application Issue">Application Processing Issue</option>
                            <option value="Payment Issue">Payment Verification Issue</option>
                            <option value="Commission">Commission & Wallet Issue</option>
                            <option value="Document Issue">Document Review Issue</option>
                            <option value="Technical Issue">Technical Support</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Subject *</label>
                        <input type="text" name="subject" class="form-control" required placeholder="Short summary of issue">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Detailed Description *</label>
                        <textarea name="message" class="form-control" rows="3" required placeholder="Describe your inquiry or issue..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Submit Ticket</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
