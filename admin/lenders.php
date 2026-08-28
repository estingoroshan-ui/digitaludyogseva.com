<?php
$page_title = "Bank / NBFC Master";
$active_menu = "lenders";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

// Handle Create / Edit / Toggle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'create') {
        $name = sanitize($_POST['name'] ?? '');
        $type = sanitize($_POST['type'] ?? 'Bank');
        $code = sanitize($_POST['code'] ?? '');
        $contact_person = sanitize($_POST['contact_person'] ?? '');
        $contact_number = sanitize($_POST['contact_number'] ?? '');
        $email = sanitize($_POST['email'] ?? '');

        if ($name) {
            try {
                $stmt = $pdo->prepare("INSERT INTO lenders (name, type, code, contact_person, contact_number, email) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $type, $code, $contact_person, $contact_number, $email]);
                $msg = '<div class="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Bank/NBFC master created. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
            } catch (PDOException $e) {
                $msg = '<div class="alert alert-danger alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Lender already exists. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
            }
        }
    } elseif ($action === 'edit') {
        $id = (int)$_POST['id'];
        $name = sanitize($_POST['name'] ?? '');
        $type = sanitize($_POST['type'] ?? 'Bank');
        $code = sanitize($_POST['code'] ?? '');
        $contact_person = sanitize($_POST['contact_person'] ?? '');
        $contact_number = sanitize($_POST['contact_number'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $status = sanitize($_POST['status'] ?? 'active');

        if ($id && $name) {
            $stmt = $pdo->prepare("UPDATE lenders SET name = ?, type = ?, code = ?, contact_person = ?, contact_number = ?, email = ?, status = ? WHERE id = ?");
            $stmt->execute([$name, $type, $code, $contact_person, $contact_number, $email, $status, $id]);
            $msg = '<div class="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Bank details updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    } elseif ($action === 'toggle_status') {
        $id = (int)$_POST['id'];
        $status = sanitize($_POST['status'] ?? 'active');
        $new_status = $status === 'active' ? 'inactive' : 'active';

        $stmt = $pdo->prepare("UPDATE lenders SET status = ? WHERE id = ?");
        $stmt->execute([$new_status, $id]);
        $msg = '<div class="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Lender status updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }
}

$lenders = $pdo->query("SELECT * FROM lenders ORDER BY name ASC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-bank2 text-primary me-2"></i> Bank / NBFC Master</h4>
        <p class="text-muted small mb-0">Manage partner Banks, NBFCs, and financial institution directories for loan login.</p>
    </div>
    <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#createLenderModal">
        <i class="bi bi-plus-lg me-1"></i> Add Bank / NBFC
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 bg-white p-4">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>#ID</th>
                    <th>Bank / Institution Name</th>
                    <th>Category</th>
                    <th>Code</th>
                    <th>Contact Officer</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($lenders as $ld): ?>
                    <tr>
                        <td class="fw-bold text-muted">#<?php echo $ld['id']; ?></td>
                        <td>
                            <div class="fw-bold text-dark"><?php echo htmlspecialchars($ld['name']); ?></div>
                            <?php if ($ld['email']): ?><small class="text-muted"><i class="bi bi-envelope me-1"></i><?php echo htmlspecialchars($ld['email']); ?></small><?php endif; ?>
                        </td>
                        <td><span class="badge bg-info-subtle text-info-emphasis rounded-pill px-3"><?php echo htmlspecialchars($ld['type']); ?></span></td>
                        <td><span class="badge bg-light text-dark border font-monospace"><?php echo htmlspecialchars($ld['code'] ?: 'N/A'); ?></span></td>
                        <td>
                            <div><?php echo htmlspecialchars($ld['contact_person'] ?: '—'); ?></div>
                            <?php if ($ld['contact_number']): ?><small class="text-muted"><i class="bi bi-telephone me-1"></i><?php echo htmlspecialchars($ld['contact_number']); ?></small><?php endif; ?>
                        </td>
                        <td>
                            <?php if ($ld['status'] === 'active'): ?>
                                <span class="badge bg-success-subtle text-success rounded-pill px-3">Active</span>
                            <?php else: ?>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3">Disabled</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#editModal<?php echo $ld['id']; ?>">
                                    <i class="bi bi-pencil me-1"></i> Edit
                                </button>
                                <form action="" method="POST">
                                    <?php render_csrf_field(); ?>
                                    <input type="hidden" name="action" value="toggle_status">
                                    <input type="hidden" name="id" value="<?php echo $ld['id']; ?>">
                                    <input type="hidden" name="status" value="<?php echo $ld['status']; ?>">
                                    <button type="submit" class="btn btn-sm btn-outline-<?php echo $ld['status'] === 'active' ? 'danger' : 'success'; ?> rounded-pill px-3">
                                        <?php echo $ld['status'] === 'active' ? 'Disable' : 'Enable'; ?>
                                    </button>
                                </form>
                            </div>

                            <!-- EDIT MODAL -->
                            <div class="modal fade" id="editModal<?php echo $ld['id']; ?>" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content rounded-4 border-0 shadow-lg">
                                        <div class="modal-header border-bottom">
                                            <h5 class="modal-title font-heading fw-bold">Edit Institution</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <form action="" method="POST">
                                            <?php render_csrf_field(); ?>
                                            <input type="hidden" name="action" value="edit">
                                            <input type="hidden" name="id" value="<?php echo $ld['id']; ?>">
                                            <div class="modal-body p-4">
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Bank / NBFC Name *</label>
                                                    <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($ld['name']); ?>">
                                                </div>
                                                <div class="row g-3 mb-3">
                                                    <div class="col-md-6">
                                                        <label class="form-label small fw-bold">Category</label>
                                                        <select name="type" class="form-select">
                                                            <option value="Bank" <?php echo $ld['type'] === 'Bank' ? 'selected' : ''; ?>>Bank</option>
                                                            <option value="NBFC" <?php echo $ld['type'] === 'NBFC' ? 'selected' : ''; ?>>NBFC</option>
                                                            <option value="Fintech" <?php echo $ld['type'] === 'Fintech' ? 'selected' : ''; ?>>Fintech</option>
                                                            <option value="Cooperative" <?php echo $ld['type'] === 'Cooperative' ? 'selected' : ''; ?>>Cooperative Bank</option>
                                                            <option value="Other" <?php echo $ld['type'] === 'Other' ? 'selected' : ''; ?>>Other</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label class="form-label small fw-bold">Code</label>
                                                        <input type="text" name="code" class="form-control" value="<?php echo htmlspecialchars($ld['code']); ?>">
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Nodal Contact Person</label>
                                                    <input type="text" name="contact_person" class="form-control" value="<?php echo htmlspecialchars($ld['contact_person']); ?>">
                                                </div>
                                                <div class="row g-3 mb-3">
                                                    <div class="col-md-6">
                                                        <label class="form-label small fw-bold">Contact Number</label>
                                                        <input type="text" name="contact_number" class="form-control" value="<?php echo htmlspecialchars($ld['contact_number']); ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label class="form-label small fw-bold">Contact Email</label>
                                                        <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($ld['email']); ?>">
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Status</label>
                                                    <select name="status" class="form-select">
                                                        <option value="active" <?php echo $ld['status'] === 'active' ? 'selected' : ''; ?>>Active</option>
                                                        <option value="inactive" <?php echo $ld['status'] === 'inactive' ? 'selected' : ''; ?>>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="modal-footer border-top">
                                                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                                <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Changes</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- CREATE MODAL -->
<div class="modal fade" id="createLenderModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-bank text-primary me-2"></i> Add Bank / NBFC</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Bank / NBFC Name *</label>
                        <input type="text" name="name" class="form-control" required placeholder="e.g. State Bank of India, HDFC Bank">
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Category</label>
                            <select name="type" class="form-select">
                                <option value="Bank">Bank</option>
                                <option value="NBFC">NBFC</option>
                                <option value="Fintech">Fintech</option>
                                <option value="Cooperative">Cooperative Bank</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Bank Code</label>
                            <input type="text" name="code" class="form-control" placeholder="e.g. SBI, HDFC">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Contact Person / Nodal Manager</label>
                        <input type="text" name="contact_person" class="form-control" placeholder="e.g. Rakesh Verma">
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Contact Number</label>
                            <input type="text" name="contact_number" class="form-control" placeholder="e.g. 9876543210">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Email Address</label>
                            <input type="email" name="email" class="form-control" placeholder="e.g. nodal@bank.com">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Partner Bank</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
