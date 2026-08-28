<?php
$page_title = "Staff Directory & RBAC Manager";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_permission('staff_view');

global $pdo;
$msg = '';
$error = '';

// Handle Staff Actions (Create / Edit / Toggle Status / Password Reset)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        if ($action === 'create_staff' || $action === 'edit_staff') {
            require_permission('staff_edit');
            $staff_id = (int)($_POST['staff_id'] ?? 0);
            $name = trim($_POST['name'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $mobile = trim($_POST['mobile'] ?? '');
            $role_id = (int)($_POST['role_id'] ?? 0);
            $department_id = (int)($_POST['department_id'] ?? 0) ?: null;
            $job_position = trim($_POST['job_position'] ?? '');
            $date_of_joining = $_POST['date_of_joining'] ?: null;
            $status = sanitize($_POST['status'] ?? 'active');
            $language = sanitize($_POST['language'] ?? 'en');
            $email_signature = trim($_POST['email_signature'] ?? '');
            $notes = trim($_POST['notes'] ?? '');

            if (empty($name) || empty($email) || empty($mobile) || empty($role_id)) {
                $error = "Please fill in all mandatory fields (Name, Email, Mobile, Role).";
            } else {
                if ($action === 'create_staff') {
                    $password = $_POST['password'] ?: '123456';
                    $password_hash = password_hash($password, PASSWORD_BCRYPT);

                    // Check duplicate
                    $dup = $pdo->prepare("SELECT id FROM users WHERE email = ? OR mobile = ?");
                    $dup->execute([$email, $mobile]);
                    if ($dup->fetch()) {
                        $error = "A user with this email or mobile already exists.";
                    } else {
                        $ins = $pdo->prepare("
                            INSERT INTO users (user_type, role_id, department_id, name, email, mobile, password_hash, status, job_position, date_of_joining, language, email_signature, notes, created_at)
                            VALUES ('staff', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                        ");
                        $ins->execute([$role_id, $department_id, $name, $email, $mobile, $password_hash, $status, $job_position, $date_of_joining, $language, $email_signature, $notes]);
                        $new_user_id = $pdo->lastInsertId();

                        // Add entry in employees table
                        $emp_code = 'EMP-' . str_pad($new_user_id, 4, '0', STR_PAD_LEFT);
                        $ins_emp = $pdo->prepare("INSERT IGNORE INTO employees (user_id, employee_code, department, designation, status) VALUES (?, ?, ?, ?, 'active')");
                        $ins_emp->execute([$new_user_id, $emp_code, $job_position ?: 'Staff', $job_position ?: 'Staff']);

                        ActivityLogger::log('create_staff', 'staff', $new_user_id, "Created staff account for {$name}");
                        $msg = "Staff account created successfully for <strong>" . htmlspecialchars($name) . "</strong>!";
                    }
                } else {
                    // Edit Staff
                    $upd = $pdo->prepare("
                        UPDATE users SET name = ?, email = ?, mobile = ?, role_id = ?, department_id = ?, 
                                         job_position = ?, date_of_joining = ?, status = ?, language = ?, 
                                         email_signature = ?, notes = ?
                        WHERE id = ? AND user_type IN ('admin', 'staff')
                    ");
                    $upd->execute([$name, $email, $mobile, $role_id, $department_id, $job_position, $date_of_joining, $status, $language, $email_signature, $notes, $staff_id]);
                    
                    if (!empty($_POST['password'])) {
                        $hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
                        $upd_p = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                        $upd_p->execute([$hash, $staff_id]);
                    }

                    ActivityLogger::log('edit_staff', 'staff', $staff_id, "Updated staff profile for {$name}");
                    $msg = "Staff account updated successfully!";
                }
            }
        } elseif ($action === 'toggle_status') {
            require_permission('staff_delete');
            $staff_id = (int)$_POST['staff_id'];
            $new_status = sanitize($_POST['new_status']);
            $upd = $pdo->prepare("UPDATE users SET status = ? WHERE id = ? AND user_type IN ('admin', 'staff')");
            $upd->execute([$new_status, $staff_id]);
            ActivityLogger::log('staff_status_toggle', 'staff', $staff_id, "Changed staff status to {$new_status}");
            $msg = "Staff status changed to " . htmlspecialchars($new_status) . ".";
        }
    }
}

// Search & Filters
$search = sanitize($_GET['q'] ?? '');
$dept_filter = (int)($_GET['dept_id'] ?? 0);
$role_filter = (int)($_GET['role_id'] ?? 0);
$status_filter = sanitize($_GET['status'] ?? 'all');

$where = ["u.user_type IN ('admin', 'staff')"];
$params = [];

if ($search) {
    $where[] = "(u.name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)";
    $q = "%{$search}%";
    $params[] = $q; $params[] = $q; $params[] = $q;
}
if ($dept_filter) {
    $where[] = "u.department_id = ?";
    $params[] = $dept_filter;
}
if ($role_filter) {
    $where[] = "u.role_id = ?";
    $params[] = $role_filter;
}
if ($status_filter !== 'all') {
    $where[] = "u.status = ?";
    $params[] = $status_filter;
}

$where_sql = implode(' AND ', $where);

// Fetch Master Reference Data
$roles = $pdo->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll();
$departments = $pdo->query("SELECT * FROM departments WHERE status = 'active' ORDER BY name ASC")->fetchAll();

// Fetch Staff Directory
$stmt = $pdo->prepare("
    SELECT u.*, r.role_name, r.role_key, d.name AS department_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE {$where_sql}
    ORDER BY u.id DESC
");
$stmt->execute($params);
$staff_members = $stmt->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-people-fill text-primary me-2"></i> Staff Directory & RBAC Management</h4>
        <p class="text-muted small mb-0">Manage staff members, roles, department assignments, and account access permissions.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/roles.php" class="btn btn-outline-dark rounded-pill px-3 fw-bold">
            <i class="bi bi-shield-lock me-1"></i> Manage Roles & Permissions
        </a>
        <a href="<?php echo BASE_URL; ?>admin/departments.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-diagram-3 me-1"></i> Manage Departments
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalCreateStaff">
            <i class="bi bi-plus-lg me-1"></i> Add Staff Member
        </button>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<!-- SEARCH & FILTER BAR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form action="" method="GET" class="row g-2 align-items-center">
        <div class="col-md-4">
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control bg-light border-start-0" value="<?php echo htmlspecialchars($search); ?>" placeholder="Search Name, Email, Mobile...">
            </div>
        </div>
        <div class="col-md-3">
            <select name="dept_id" class="form-select bg-light" onchange="this.form.submit()">
                <option value="0">All Departments</option>
                <?php foreach ($departments as $d): ?>
                    <option value="<?php echo $d['id']; ?>" <?php echo $dept_filter == $d['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($d['name']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-3">
            <select name="role_id" class="form-select bg-light" onchange="this.form.submit()">
                <option value="0">All Roles</option>
                <?php foreach ($roles as $r): ?>
                    <option value="<?php echo $r['id']; ?>" <?php echo $role_filter == $r['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($r['role_name']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-2 d-flex gap-1">
            <select name="status" class="form-select bg-light" onchange="this.form.submit()">
                <option value="all">All Status</option>
                <option value="active" <?php echo $status_filter === 'active' ? 'selected' : ''; ?>>Active</option>
                <option value="inactive" <?php echo $status_filter === 'inactive' ? 'selected' : ''; ?>>Inactive</option>
            </select>
            <a href="staff.php" class="btn btn-light border"><i class="bi bi-arrow-counterclockwise"></i></a>
        </div>
    </form>
</div>

<!-- STAFF TABLE -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Staff Name</th>
                    <th>Contact Info</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Job Position</th>
                    <th>Last Login</th>
                    <th>Status</th>
                    <th class="text-end">Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($staff_members)): ?>
                    <tr>
                        <td colspan="8" class="text-center py-4 text-muted">No staff members found matching criteria.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($staff_members as $st): ?>
                        <tr>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
                                        <?php echo strtoupper(substr($st['name'], 0, 1)); ?>
                                    </div>
                                    <div>
                                        <strong class="text-dark d-block"><?php echo htmlspecialchars($st['name']); ?></strong>
                                        <small class="text-muted fs-7">ID: #<?php echo $st['id']; ?></small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="small">
                                    <i class="bi bi-envelope me-1 text-muted"></i><?php echo htmlspecialchars($st['email']); ?><br>
                                    <i class="bi bi-telephone me-1 text-muted"></i><?php echo htmlspecialchars($st['mobile']); ?>
                                </div>
                            </td>
                            <td>
                                <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold">
                                    <?php echo htmlspecialchars($st['role_name'] ?: 'Staff'); ?>
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-light text-dark border">
                                    <?php echo htmlspecialchars($st['department_name'] ?: 'General'); ?>
                                </span>
                            </td>
                            <td class="small fw-semibold"><?php echo htmlspecialchars($st['job_position'] ?: 'Team Member'); ?></td>
                            <td>
                                <small class="text-muted d-block">
                                    <?php echo $st['last_login_at'] ? date('d M Y, h:i A', strtotime($st['last_login_at'])) : 'Never Logged In'; ?>
                                </small>
                                <small class="text-secondary fs-7"><?php echo htmlspecialchars($st['last_login_ip'] ?: ''); ?></small>
                            </td>
                            <td>
                                <?php if ($st['status'] === 'active'): ?>
                                    <span class="badge bg-success rounded-pill px-3">Active</span>
                                <?php else: ?>
                                    <span class="badge bg-danger rounded-pill px-3">Inactive</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-end">
                                <button type="button" class="btn btn-sm btn-light border rounded-circle me-1" title="Edit Staff" onclick='editStaff(<?php echo json_encode($st); ?>)'>
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <form action="" method="POST" class="d-inline" onsubmit="return confirm('Toggle status for this staff account?');">
                                    <?php render_csrf_field(); ?>
                                    <input type="hidden" name="action" value="toggle_status">
                                    <input type="hidden" name="staff_id" value="<?php echo $st['id']; ?>">
                                    <input type="hidden" name="new_status" value="<?php echo $st['status'] === 'active' ? 'inactive' : 'active'; ?>">
                                    <button type="submit" class="btn btn-sm <?php echo $st['status'] === 'active' ? 'btn-outline-danger' : 'btn-outline-success'; ?> rounded-pill px-3 fs-7">
                                        <?php echo $st['status'] === 'active' ? 'Deactivate' : 'Activate'; ?>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- CREATE STAFF MODAL -->
<div class="modal fade" id="modalCreateStaff" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-person-plus text-primary me-2"></i> Add New Staff Member</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_staff">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Full Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" class="form-control" required placeholder="e.g. Rajesh Kumar">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Email Address <span class="text-danger">*</span></label>
                        <input type="email" name="email" class="form-control" required placeholder="rajesh@company.com">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Mobile Phone <span class="text-danger">*</span></label>
                        <input type="text" name="mobile" class="form-control" required placeholder="9876543210">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Password (Default: 123456)</label>
                        <input type="password" name="password" class="form-control" placeholder="Leave blank for 123456">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">System Role <span class="text-danger">*</span></label>
                        <select name="role_id" class="form-select" required>
                            <option value="">-- Select System Role --</option>
                            <?php foreach ($roles as $r): ?>
                                <option value="<?php echo $r['id']; ?>"><?php echo htmlspecialchars($r['role_name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Department Assignment</label>
                        <select name="department_id" class="form-select">
                            <option value="0">-- Select Department --</option>
                            <?php foreach ($departments as $d): ?>
                                <option value="<?php echo $d['id']; ?>"><?php echo htmlspecialchars($d['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Job Position / Designation</label>
                        <input type="text" name="job_position" class="form-control" placeholder="e.g. Senior Business Consultant">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Date of Joining</label>
                        <input type="date" name="date_of_joining" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                    </div>
                    <div class="col-md-12">
                        <label class="form-label small fw-bold">Email Signature</label>
                        <textarea name="email_signature" class="form-control" rows="2" placeholder="Official signature appended to outgoing emails"></textarea>
                    </div>
                </div>
                <div class="mt-4 text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Account</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- EDIT STAFF MODAL -->
<div class="modal fade" id="modalEditStaff" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-pencil-square text-primary me-2"></i> Edit Staff Account</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="edit_staff">
                <input type="hidden" name="staff_id" id="edit_staff_id">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Full Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" id="edit_name" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Email Address <span class="text-danger">*</span></label>
                        <input type="email" name="email" id="edit_email" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Mobile Phone <span class="text-danger">*</span></label>
                        <input type="text" name="mobile" id="edit_mobile" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">New Password (Optional)</label>
                        <input type="password" name="password" class="form-control" placeholder="Leave blank to keep unchanged">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">System Role <span class="text-danger">*</span></label>
                        <select name="role_id" id="edit_role_id" class="form-select" required>
                            <?php foreach ($roles as $r): ?>
                                <option value="<?php echo $r['id']; ?>"><?php echo htmlspecialchars($r['role_name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Department</label>
                        <select name="department_id" id="edit_department_id" class="form-select">
                            <option value="0">-- Select Department --</option>
                            <?php foreach ($departments as $d): ?>
                                <option value="<?php echo $d['id']; ?>"><?php echo htmlspecialchars($d['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Job Position</label>
                        <input type="text" name="job_position" id="edit_job_position" class="form-control">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Account Status</label>
                        <select name="status" id="edit_status" class="form-select">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label small fw-bold">Email Signature</label>
                        <textarea name="email_signature" id="edit_email_signature" class="form-control" rows="2"></textarea>
                    </div>
                </div>
                <div class="mt-4 text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Update Profile</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function editStaff(st) {
    document.getElementById('edit_staff_id').value = st.id;
    document.getElementById('edit_name').value = st.name;
    document.getElementById('edit_email').value = st.email;
    document.getElementById('edit_mobile').value = st.mobile;
    document.getElementById('edit_role_id').value = st.role_id || '';
    document.getElementById('edit_department_id').value = st.department_id || '0';
    document.getElementById('edit_job_position').value = st.job_position || '';
    document.getElementById('edit_status').value = st.status || 'active';
    document.getElementById('edit_email_signature').value = st.email_signature || '';
    
    var modal = new bootstrap.Modal(document.getElementById('modalEditStaff'));
    modal.show();
}
</script>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
