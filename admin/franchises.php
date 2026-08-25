<?php
$page_title = "Franchise Partner Network";
$active_menu = "franchises";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'approve_franchise') {
        $fid = (int)$_POST['franchise_id'];
        $upd = $pdo->prepare("UPDATE franchises SET status = 'approved' WHERE id = ?");
        $upd->execute([$fid]);
        $msg = '<div class="alert alert-success fw-bold">Franchise approved successfully!</div>';
    }
}

$franchises = $pdo->query("
    SELECT f.*, ft.type_name
    FROM franchises f
    LEFT JOIN franchise_types ft ON f.franchise_type_id = ft.id
    ORDER BY f.id DESC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Franchise Network Management</h4>
        <p class="text-muted small mb-0">Manage State, District & City franchise partners, wallet balances & security deposits.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Franchise Code</th>
                    <th>Business / Owner Name</th>
                    <th>Mobile</th>
                    <th>Tier / Type</th>
                    <th>Location</th>
                    <th>Wallet Balance</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($franchises)): ?>
                    <tr><td colspan="8" class="text-center text-muted py-4">No franchise partners registered yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($franchises as $fr): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo htmlspecialchars($fr['franchise_code']); ?></td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($fr['business_name']); ?></strong>
                                <small class="text-muted"><?php echo htmlspecialchars($fr['owner_name']); ?></small>
                            </td>
                            <td><?php echo htmlspecialchars($fr['mobile']); ?></td>
                            <td><span class="badge bg-primary"><?php echo htmlspecialchars($fr['type_name'] ?: 'City Partner'); ?></span></td>
                            <td><small><?php echo htmlspecialchars($fr['state'] . ', ' . $fr['district']); ?></small></td>
                            <td class="fw-bold text-success"><?php echo format_inr($fr['wallet_balance']); ?></td>
                            <td><span class="badge bg-success"><?php echo htmlspecialchars($fr['status']); ?></span></td>
                            <td>
                                <?php if ($fr['status'] === 'pending'): ?>
                                    <form action="" method="POST" class="d-inline">
                                        <input type="hidden" name="action" value="approve_franchise">
                                        <input type="hidden" name="franchise_id" value="<?php echo $fr['id']; ?>">
                                        <button type="submit" class="btn btn-sm btn-success rounded-pill px-3">Approve</button>
                                    </form>
                                <?php else: ?>
                                    <span class="badge bg-light text-dark border">Active</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
