<?php
$page_title = "Appointments Calendar | Franchise Portal";
$active_menu = "appointments";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$appts = $pdo->query("
    SELECT a.*, c.name AS customer_name, l.name AS lead_name
    FROM appointments a
    LEFT JOIN customers c ON a.customer_id = c.id
    LEFT JOIN leads l ON a.lead_id = l.id
    ORDER BY a.appointment_date DESC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Appointments Calendar</h4>
        <p class="text-muted small mb-0">Scheduled client meetings, document verification & loan consultation appointments.</p>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Date & Time</th>
                    <th>Client Name</th>
                    <th>Appointment Type</th>
                    <th>Mode</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($appts)): ?>
                    <tr><td colspan="5" class="text-center text-muted py-4">No appointments scheduled.</td></tr>
                <?php else: ?>
                    <?php foreach ($appts as $ap): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo date('d M Y', strtotime($ap['appointment_date'])); ?> @ <?php echo date('h:i A', strtotime($ap['appointment_time'])); ?></td>
                            <td class="fw-bold"><?php echo htmlspecialchars($ap['customer_name'] ?: ($ap['lead_name'] ?: 'Client')); ?></td>
                            <td><span class="badge bg-secondary"><?php echo htmlspecialchars($ap['appointment_type']); ?></span></td>
                            <td><span class="badge bg-info text-dark"><?php echo ucfirst($ap['mode']); ?></span></td>
                            <td><span class="badge bg-success"><?php echo ucfirst($ap['status']); ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
