<?php
$page_title = "Roles & Permissions Builder";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_permission('roles_manage');

global $pdo;
$msg = '';
$error = '';

// Handle Role & Permission Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        if ($action === 'create_role' || $action === 'edit_role') {
            $role_id = (int)($_POST['role_id'] ?? 0);
            $role_name = trim($_POST['role_name'] ?? '');
            $role_key = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', str_replace(' ', '_', $role_name)));
            $description = trim($_POST['description'] ?? '');
            $permission_ids = $_POST['permissions'] ?? [];

            if (empty($role_name)) {
                $error = "Role Name is required.";
            } else {
                if ($action === 'create_role') {
                    $ins = $pdo->prepare("INSERT INTO roles (role_key, role_name, description, created_at) VALUES (?, ?, ?, NOW())");
                    $ins->execute([$role_key, $role_name, $description]);
                    $role_id = $pdo->lastInsertId();
                    ActivityLogger::log('create_role', 'settings', $role_id, "Created new role {$role_name}");
                    $msg = "Role <strong>" . htmlspecialchars($role_name) . "</strong> created successfully!";
                } else {
                    $upd = $pdo->prepare("UPDATE roles SET role_name = ?, description = ? WHERE id = ?");
                    $upd->execute([$role_name, $description, $role_id]);
                    ActivityLogger::log('edit_role', 'settings', $role_id, "Updated role {$role_name}");
                    $msg = "Role updated successfully!";
                }

                // Sync Permissions
                $del = $pdo->prepare("DELETE FROM role_permissions WHERE role_id = ?");
                $del->execute([$role_id]);

                if (!empty($permission_ids)) {
                    $ins_p = $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
                    foreach ($permission_ids as $pid) {
                        $ins_p->execute([$role_id, (int)$pid]);
                    }
                }
            }
        }
    }
}

// Fetch all Roles and Permissions
$roles = $pdo->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll();
$all_permissions = $pdo->query("SELECT * FROM permissions ORDER BY module ASC, id ASC")->fetchAll();

// Group permissions by module
$grouped_permissions = [];
foreach ($all_permissions as $p) {
    $grouped_permissions[$p['module']][] = $p;
}

$selected_role_id = (int)($_GET['id'] ?? ($roles[0]['id'] ?? 1));
$stmt_r = $pdo->prepare("SELECT * FROM roles WHERE id = ?");
$stmt_r->execute([$selected_role_id]);
$current_role = $stmt_r->fetch();

// Fetch permissions for current role
$stmt_rp = $pdo->prepare("SELECT permission_id FROM role_permissions WHERE role_id = ?");
$stmt_rp->execute([$selected_role_id]);
$active_permission_ids = $stmt_rp->fetchAll(PDO::FETCH_COLUMN);
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-shield-lock-fill text-primary me-2"></i> Roles & Granular Permissions Builder</h4>
        <p class="text-muted small mb-0">Define custom roles and enforce module-level authorization (View, View Own, Create, Edit, Delete).</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/staff.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to Staff Directory
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalCreateRole">
            <i class="bi bi-plus-lg me-1"></i> Create Custom Role
        </button>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<div class="row g-4">
    <!-- ROLES LIST SIDEBAR -->
    <div class="col-md-4 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <h6 class="fw-bold mb-3 px-2">System Roles</h6>
            <div class="list-group list-group-flush rounded-3">
                <?php foreach ($roles as $r): ?>
                    <a href="?id=<?php echo $r['id']; ?>" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-3 mb-1 border-0 <?php echo $selected_role_id == $r['id'] ? 'bg-primary text-white active fw-bold' : 'text-dark'; ?>">
                        <span><?php echo htmlspecialchars($r['role_name']); ?></span>
                        <?php if ($r['id'] == 1): ?>
                            <span class="badge bg-warning text-dark">Full Access</span>
                        <?php endif; ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- PERMISSIONS MATRIX EDITOR -->
    <div class="col-md-8 col-lg-9">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="fw-bold mb-1">Permissions Matrix for: <span class="text-primary"><?php echo htmlspecialchars($current_role['role_name'] ?? ''); ?></span></h5>
                    <p class="text-muted small mb-0"><?php echo htmlspecialchars($current_role['description'] ?? 'No description provided'); ?></p>
                </div>
            </div>

            <?php if ($selected_role_id == 1): ?>
                <div class="alert alert-warning border-0 fw-bold rounded-3">
                    <i class="bi bi-shield-check me-2 fs-5"></i> Super Admin role has unrestricted full bypass system access. Permission checkboxes do not apply.
                </div>
            <?php else: ?>
                <form action="" method="POST">
                    <?php render_csrf_field(); ?>
                    <input type="hidden" name="action" value="edit_role">
                    <input type="hidden" name="role_id" value="<?php echo $current_role['id']; ?>">
                    <input type="hidden" name="role_name" value="<?php echo htmlspecialchars($current_role['role_name']); ?>">
                    <input type="hidden" name="description" value="<?php echo htmlspecialchars($current_role['description']); ?>">

                    <div class="accordion border rounded-4 overflow-hidden mb-4" id="accordionPermissions">
                        <?php foreach ($grouped_permissions as $module_name => $perms): ?>
                            <div class="accordion-item border-0 border-bottom">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed fw-bold text-dark bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#module_<?php echo $module_name; ?>">
                                        <i class="bi bi-folder2-open me-2 text-primary"></i> Module: <?php echo ucfirst($module_name); ?> (<?php echo count($perms); ?> permissions)
                                    </button>
                                </h2>
                                <div id="module_<?php echo $module_name; ?>" class="accordion-collapse collapse show">
                                    <div class="accordion-body p-3">
                                        <div class="row g-2">
                                            <?php foreach ($perms as $p): ?>
                                                <div class="col-md-6 col-lg-4">
                                                    <div class="form-check p-2 border rounded-3 bg-white">
                                                        <input class="form-check-input" type="checkbox" name="permissions[]" value="<?php echo $p['id']; ?>" id="perm_<?php echo $p['id']; ?>" <?php echo in_array($p['id'], $active_permission_ids) ? 'checked' : ''; ?>>
                                                        <label class="form-check-label small fw-semibold text-dark" for="perm_<?php echo $p['id']; ?>">
                                                            <code><?php echo htmlspecialchars($p['permission_key']); ?></code>
                                                            <div class="text-muted fs-7"><?php echo htmlspecialchars($p['description']); ?></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="text-end">
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                            <i class="bi bi-check-lg me-1"></i> Save Permissions Matrix
                        </button>
                    </div>
                </form>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- CREATE ROLE MODAL -->
<div class="modal fade" id="modalCreateRole" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-shield-plus text-primary me-2"></i> Create Custom Role</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_role">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Role Name <span class="text-danger">*</span></label>
                    <input type="text" name="role_name" class="form-control" required placeholder="e.g. Regional Sales Manager">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Role Description</label>
                    <textarea name="description" class="form-control" rows="2" placeholder="Responsibilities and scope of this role"></textarea>
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Role</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
