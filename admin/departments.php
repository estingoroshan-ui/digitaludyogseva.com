<?php
$page_title = "Department Management";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_permission('departments_manage');

global $pdo;
$msg = '';
$error = '';

// Handle Department Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        if ($action === 'create_department' || $action === 'edit_department') {
            $dept_id = (int)($_POST['dept_id'] ?? 0);
            $name = trim($_POST['name'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $manager_id = (int)($_POST['manager_id'] ?? 0) ?: null;
            $status = sanitize($_POST['status'] ?? 'active');

            if (empty($name)) {
                $error = "Department Name is required.";
            } else {
                if ($action === 'create_department') {
                    $ins = $pdo->prepare("INSERT INTO departments (name, description, manager_id, status, created_at) VALUES (?, ?, ?, ?, NOW())");
                    $ins->execute([$name, $description, $manager_id, $status]);
                    ActivityLogger::log('create_department', 'settings', $pdo->lastInsertId(), "Created department {$name}");
                    $msg = "Department <strong>" . htmlspecialchars($name) . "</strong> created successfully!";
                } else {
                    $upd = $pdo->prepare("UPDATE departments SET name = ?, description = ?, manager_id = ?, status = ? WHERE id = ?");
                    $upd->execute([$name, $description, $manager_id, $status, $dept_id]);
                    ActivityLogger::log('edit_department', 'settings', $dept_id, "Updated department {$name}");
                    $msg = "Department updated successfully!";
                }
            }
        } elseif ($action === 'delete_department') {
            $dept_id = (int)$_POST['dept_id'];
            $del = $pdo->prepare("DELETE FROM departments WHERE id = ?");
            $del->execute([$dept_id]);
            ActivityLogger::log('delete_department', 'settings', $dept_id, "Deleted department #{$dept_id}");
            $msg = "Department deleted successfully.";
        }
    }
}

// Fetch Departments with Staff Counts
$departments = $pdo->query("
    SELECT d.*, u.name AS manager_name,
           (SELECT COUNT(*) FROM users WHERE department_id = d.id AND status = 'active') AS staff_count
    FROM departments d
    LEFT JOIN users u ON d.manager_id = u.id
    ORDER BY d.id ASC
")->fetchAll();

$staff_options = $pdo->query("SELECT id, name FROM users WHERE user_type IN ('admin', 'staff') AND status = 'active' ORDER BY name ASC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-diagram-3-fill text-primary me-2"></i> Enterprise Departments</h4>
        <p class="text-muted small mb-0">Organize staff members into functional operational departments.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/staff.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to Staff Directory
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalCreateDept">
            <i class="bi bi-plus-lg me-1"></i> Add Department
        </button>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<div class="row g-4">
    <?php foreach ($departments as $dept): ?>
        <div class="col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 class="fw-bold mb-1 text-dark"><?php echo htmlspecialchars($dept['name']); ?></h5>
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3 fw-bold">
                            <i class="bi bi-people me-1"></i> <?php echo $dept['staff_count']; ?> Staff Members
                        </span>
                    </div>
                    <?php if ($dept['status'] === 'active'): ?>
                        <span class="badge bg-success rounded-pill px-3">Active</span>
                    <?php else: ?>
                        <span class="badge bg-secondary rounded-pill px-3">Inactive</span>
                    <?php endif; ?>
                </div>

                <p class="text-muted small mb-3"><?php echo htmlspecialchars($dept['description'] ?: 'No description specified.'); ?></p>

                <div class="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                        Manager: <strong><?php echo htmlspecialchars($dept['manager_name'] ?: 'Not Assigned'); ?></strong>
                    </small>
                    <div>
                        <button type="button" class="btn btn-sm btn-light border rounded-circle" onclick='editDept(<?php echo json_encode($dept); ?>)'>
                            <i class="bi bi-pencil"></i>
                        </button>
                        <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete this department?');">
                            <?php render_csrf_field(); ?>
                            <input type="hidden" name="action" value="delete_department">
                            <input type="hidden" name="dept_id" value="<?php echo $dept['id']; ?>">
                            <button type="submit" class="btn btn-sm btn-light border text-danger rounded-circle">
                                <i class="bi bi-trash"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<!-- CREATE DEPT MODAL -->
<div class="modal fade" id="modalCreateDept" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-building-add text-primary me-2"></i> Add Department</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_department">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Department Name <span class="text-danger">*</span></label>
                    <input type="text" name="name" class="form-control" required placeholder="e.g. Sales & Marketing">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Description</label>
                    <textarea name="description" class="form-control" rows="2" placeholder="Functional responsibilities"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Department Manager</label>
                    <select name="manager_id" class="form-select">
                        <option value="0">-- Select Manager --</option>
                        <?php foreach ($staff_options as $s): ?>
                            <option value="<?php echo $s['id']; ?>"><?php echo htmlspecialchars($s['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Department</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- EDIT DEPT MODAL -->
<div class="modal fade" id="modalEditDept" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-pencil-square text-primary me-2"></i> Edit Department</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="edit_department">
                <input type="hidden" name="dept_id" id="edit_dept_id">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Department Name <span class="text-danger">*</span></label>
                    <input type="text" name="name" id="edit_dept_name" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Description</label>
                    <textarea name="description" id="edit_dept_desc" class="form-control" rows="2"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Department Manager</label>
                    <select name="manager_id" id="edit_dept_manager" class="form-select">
                        <option value="0">-- Select Manager --</option>
                        <?php foreach ($staff_options as $s): ?>
                            <option value="<?php echo $s['id']; ?>"><?php echo htmlspecialchars($s['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Status</label>
                    <select name="status" id="edit_dept_status" class="form-select">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Update Department</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function editDept(d) {
    document.getElementById('edit_dept_id').value = d.id;
    document.getElementById('edit_dept_name').value = d.name;
    document.getElementById('edit_dept_desc').value = d.description || '';
    document.getElementById('edit_dept_manager').value = d.manager_id || '0';
    document.getElementById('edit_dept_status').value = d.status || 'active';
    var modal = new bootstrap.Modal(document.getElementById('modalEditDept'));
    modal.show();
}
</script>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
