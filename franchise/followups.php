<?php
$page_title = "Customer Follow-ups | Franchise Portal";
$active_menu = "followups";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$followups = $pdo->query("
    SELECT f.*, c.name AS customer_name, c.mobile, c.id AS customer_id
    FROM followups f
    JOIN leads l ON f.lead_id = l.id
    LEFT JOIN customers c ON l.id = c.lead_id
    ORDER BY f.followup_date ASC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Customer Follow-ups & Reminders</h4>
        <p class="text-muted small mb-0">Track pending customer follow-ups and log call outcomes.</p>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Scheduled Date & Time</th>
                    <th>Customer Name & Mobile</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($followups)): ?>
                    <tr><td colspan="5" class="text-center text-muted py-4">No follow-up reminders scheduled.</td></tr>
                <?php else: ?>
                    <?php foreach ($followups as $flw): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo date('d M Y', strtotime($flw['followup_date'])); ?> @ <?php echo date('h:i A', strtotime($flw['followup_time'])); ?></td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($flw['customer_name'] ?: 'Client'); ?></strong>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($flw['mobile']); ?></small>
                            </td>
                            <td><small><?php echo htmlspecialchars($flw['notes'] ?: 'Follow up on application'); ?></small></td>
                            <td><span class="badge bg-warning text-dark"><?php echo ucfirst($flw['status']); ?></span></td>
                            <td class="text-end">
                                <a href="tel:<?php echo htmlspecialchars($flw['mobile']); ?>" class="btn btn-sm btn-success rounded-pill px-3 fw-bold">
                                    Call
                                </a>
                                <a href="https://wa.me/91<?php echo preg_replace('/[^0-9]/', '', $flw['mobile']); ?>" target="_blank" class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold ms-1">
                                    WhatsApp
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
