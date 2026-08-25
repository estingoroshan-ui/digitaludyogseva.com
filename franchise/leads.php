<?php
$page_title = "Potential Client Leads | Franchise Portal";
$active_menu = "leads";
require_once __DIR__ . '/includes/franchise_header.php';
require_once __DIR__ . '/../classes/LeadManager.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_lead') {
    $res = LeadManager::create_lead([
        'name' => $_POST['name'] ?? '',
        'mobile' => $_POST['mobile'] ?? '',
        'email' => $_POST['email'] ?? '',
        'business_name' => $_POST['business_name'] ?? '',
        'state' => $franchise_profile['state'] ?? 'Rajasthan',
        'district' => $franchise_profile['district'] ?? 'Jaipur',
        'franchise_id' => $franchise_id,
        'source_id' => 10, // Franchise Source
        'source_detail' => 'Franchise - ' . ($franchise_profile['city'] ?? 'Jaipur') . ' / ' . ($franchise_profile['franchise_code'] ?? 'FR-2026')
    ]);

    if ($res['status']) {
        $msg = '<div class="alert alert-success fw-bold">Potential Lead created and synced with Super Admin CRM! Code: ' . $res['lead_code'] . '</div>';
    } else {
        $msg = '<div class="alert alert-danger fw-bold">' . htmlspecialchars($res['message']) . '</div>';
    }
}

$leads = $pdo->prepare("SELECT l.*, ls.status_name FROM leads l JOIN lead_statuses ls ON l.status_id = ls.id WHERE l.franchise_id = ? ORDER BY l.id DESC");
$leads->execute([$franchise_id]);
$lead_list = $leads->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Potential Client Leads</h4>
        <p class="text-muted small mb-0">Log potential client inquiries. Synced with Super Admin CRM under your franchise source tag.</p>
    </div>
    <button class="btn btn-warning btn-sm rounded-pill text-dark fw-bold px-4 shadow" data-bs-toggle="modal" data-bs-target="#newLeadModal">
        <i class="bi bi-person-plus me-1"></i> + Add Potential Lead
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Lead Code</th>
                    <th>Name & Mobile</th>
                    <th>Business Name</th>
                    <th>Created Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($lead_list)): ?>
                    <tr><td colspan="5" class="text-center text-muted py-4">No leads logged yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($lead_list as $ld): ?>
                        <tr>
                            <td><strong class="font-monospace text-primary"><?php echo htmlspecialchars($ld['lead_code']); ?></strong></td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($ld['name']); ?></strong>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($ld['mobile']); ?></small>
                            </td>
                            <td><?php echo htmlspecialchars($ld['business_name'] ?: 'Individual'); ?></td>
                            <td><small class="text-muted"><?php echo date('d M Y', strtotime($ld['created_at'])); ?></small></td>
                            <td><span class="badge bg-info text-dark"><?php echo htmlspecialchars($ld['status_name']); ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW LEAD MODAL -->
<div class="modal fade" id="newLeadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">+ Add Potential Lead</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="add_lead">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Full Name *</label>
                        <input type="text" name="name" class="form-control" required placeholder="Lead name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Mobile Number *</label>
                        <input type="tel" name="mobile" class="form-control" required placeholder="10-digit mobile">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Email Address</label>
                        <input type="email" name="email" class="form-control" placeholder="Email address">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Business Name</label>
                        <input type="text" name="business_name" class="form-control" placeholder="Company Name">
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold text-dark">Save Lead</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
