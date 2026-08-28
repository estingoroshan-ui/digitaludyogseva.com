<?php
$page_title = "Loan Types Master";
$active_menu = "loan_types";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

// Handle Create / Edit / Toggle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'create') {
        $name = sanitize($_POST['name'] ?? '');
        $code = sanitize($_POST['code'] ?? '');
        $description = sanitize($_POST['description'] ?? '');

        if ($name) {
            try {
                $stmt = $pdo->prepare("INSERT INTO loan_types (name, code, description) VALUES (?, ?, ?)");
                $stmt->execute([$name, $code, $description]);
                $msg = '<div class="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Loan type created successfully. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
            } catch (PDOException $e) {
                $msg = '<div class="alert alert-danger alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> Error: Loan type already exists. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
            }
        }
    } elseif ($action === 'edit') {
        $id = (int)$_POST['id'];
        $name = sanitize($_POST['name'] ?? '');
        $code = sanitize($_POST['code'] ?? '');
        $description = sanitize($_POST['description'] ?? '');
        $status = sanitize($_POST['status'] ?? 'active');

        if ($id && $name) {
            $stmt = $pdo->prepare("UPDATE loan_types SET name = ?, code = ?, description = ?, status = ? WHERE id = ?");
            $stmt->execute([$name, $code, $description, $status, $id]);
            $msg = '<div class="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Loan type updated successfully. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
    } elseif ($action === 'toggle_status') {
        $id = (int)$_POST['id'];
        $status = sanitize($_POST['status'] ?? 'active');
        $new_status = $status === 'active' ? 'inactive' : 'active';

        $stmt = $pdo->prepare("UPDATE loan_types SET status = ? WHERE id = ?");
        $stmt->execute([$new_status, $id]);
        $msg = '<div class="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm p-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Loan type status updated. <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }
}

$loan_types = $pdo->query("SELECT * FROM loan_types ORDER BY name ASC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-tags-fill text-primary me-2"></i> Loan Types Master</h4>
        <p class="text-muted small mb-0">Manage system loan categories, codes, and availability for case applications.</p>
    </div>
    <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#createTypeModal">
        <i class="bi bi-plus-lg me-1"></i> Add New Loan Type
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 bg-white p-4">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>#ID</th>
                    <th>Loan Type Name</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($loan_types as $lt): ?>
                    <tr>
                        <td class="fw-bold text-muted">#<?php echo $lt['id']; ?></td>
                        <td class="fw-bold text-dark"><?php echo htmlspecialchars($lt['name']); ?></td>
                        <td><span class="badge bg-light text-dark border font-monospace"><?php echo htmlspecialchars($lt['code'] ?: 'N/A'); ?></span></td>
                        <td class="small text-muted"><?php echo htmlspecialchars($lt['description'] ?: '—'); ?></td>
                        <td>
                            <?php if ($lt['status'] === 'active'): ?>
                                <span class="badge bg-success-subtle text-success rounded-pill px-3">Active</span>
                            <?php else: ?>
                                <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3">Disabled</span>
                            <?php endif; ?>
                        </td>
                        <td class="small text-muted"><?php echo date('d M Y', strtotime($lt['created_at'])); ?></td>
                        <td>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#editModal<?php echo $lt['id']; ?>">
                                    <i class="bi bi-pencil me-1"></i> Edit
                                </button>
                                <form action="" method="POST">
                                    <?php render_csrf_field(); ?>
                                    <input type="hidden" name="action" value="toggle_status">
                                    <input type="hidden" name="id" value="<?php echo $lt['id']; ?>">
                                    <input type="hidden" name="status" value="<?php echo $lt['status']; ?>">
                                    <button type="submit" class="btn btn-sm btn-outline-<?php echo $lt['status'] === 'active' ? 'danger' : 'success'; ?> rounded-pill px-3">
                                        <?php echo $lt['status'] === 'active' ? 'Disable' : 'Enable'; ?>
                                    </button>
                                </form>
                            </div>

                            <!-- EDIT MODAL -->
                            <div class="modal fade" id="editModal<?php echo $lt['id']; ?>" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content rounded-4 border-0 shadow-lg">
                                        <div class="modal-header border-bottom">
                                            <h5 class="modal-title font-heading fw-bold">Edit Loan Type</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <form action="" method="POST">
                                            <?php render_csrf_field(); ?>
                                            <input type="hidden" name="action" value="edit">
                                            <input type="hidden" name="id" value="<?php echo $lt['id']; ?>">
                                            <div class="modal-body p-4">
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Loan Type Name *</label>
                                                    <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($lt['name']); ?>">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Short Code</label>
                                                    <input type="text" name="code" class="form-control" value="<?php echo htmlspecialchars($lt['code']); ?>">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Status</label>
                                                    <select name="status" class="form-select">
                                                        <option value="active" <?php echo $lt['status'] === 'active' ? 'selected' : ''; ?>>Active</option>
                                                        <option value="inactive" <?php echo $lt['status'] === 'inactive' ? 'selected' : ''; ?>>Inactive / Disabled</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label small fw-bold">Description</label>
                                                    <textarea name="description" class="form-control" rows="3"><?php echo htmlspecialchars($lt['description']); ?></textarea>
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
<div class="modal fade" id="createTypeModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-plus-circle text-primary me-2"></i> Add New Loan Type</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Loan Type Name *</label>
                        <input type="text" name="name" class="form-control" required placeholder="e.g. Business Loan, Doctor Loan">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Short Code</label>
                        <input type="text" name="code" class="form-control" placeholder="e.g. BL, DL">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Description</label>
                        <textarea name="description" class="form-control" rows="3" placeholder="Category description or eligibility rules..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Loan Type</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
