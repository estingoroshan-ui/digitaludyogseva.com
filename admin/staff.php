<?php
$page_title = "Staff Management & Role Access Control (RBAC)";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_staff') {
    $name = sanitize($_POST['name']);
    $email = sanitize($_POST['email']);
    $mobile = sanitize($_POST['mobile']);
    $role_id = (int)$_POST['role_id'];
    $department = sanitize($_POST['department']);
    $designation = sanitize($_POST['designation']);
    $pass = $_POST['password'] ?? 'Staff@123';

    $pass_hash = password_hash($pass, PASSWORD_BCRYPT);
    $ins_u = $pdo->prepare("INSERT INTO users (user_type, role_id, name, email, mobile, password_hash, status) VALUES ('staff', ?, ?, ?, ?, ?, 'active')");
    $ins_u->execute([$role_id, $name, $email, $mobile, $pass_hash]);
    $user_id = $pdo->lastInsertId();

    $code = generate_code('EMP', 4);
    $ins_e = $pdo->prepare("INSERT INTO employees (user_id, employee_code, department, designation) VALUES (?, ?, ?, ?)");
    $ins_e->execute([$user_id, $code, $department, $designation]);

    $msg = '<div class="alert alert-success fw-bold">New Staff member added with code: ' . $code . '</div>';
}

$roles = $pdo->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll();
$staff_members = $pdo->query("
    SELECT u.*, r.role_name, e.employee_code, e.department, e.designation
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN employees e ON u.id = e.user_id
    WHERE u.user_type IN ('admin', 'staff')
    ORDER BY u.id ASC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Staff & RBAC Permission Matrix</h4>
        <p class="text-muted small mb-0">Manage internal employees, assign departmental roles & control access permissions.</p>
    </div>
    <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#newStaffModal">
        <i class="bi bi-person-plus me-1"></i> Add Staff Member
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Emp Code</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($staff_members as $st): ?>
                    <tr>
                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($st['employee_code'] ?: 'ADM-001'); ?></td>
                        <td class="fw-bold"><?php echo htmlspecialchars($st['name']); ?></td>
                        <td><?php echo htmlspecialchars($st['mobile']); ?></td>
                        <td><?php echo htmlspecialchars($st['email']); ?></td>
                        <td><span class="badge bg-primary"><?php echo htmlspecialchars($st['role_name']); ?></span></td>
                        <td><small><?php echo htmlspecialchars($st['department'] ?: 'Super Admin'); ?></small></td>
                        <td><span class="badge bg-success"><?php echo htmlspecialchars($st['status']); ?></span></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW STAFF MODAL -->
<div class="modal fade" id="newStaffModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Add Staff Member</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="add_staff">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Full Name *</label>
                        <input type="text" name="name" class="form-control" required placeholder="Staff member name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Email Address *</label>
                        <input type="email" name="email" class="form-control" required placeholder="name@digitaludyogseva.com">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Mobile Number *</label>
                        <input type="tel" name="mobile" class="form-control" required placeholder="10-digit mobile">
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-bold">Role *</label>
                            <select name="role_id" class="form-control" required>
                                <?php foreach ($roles as $r): ?>
                                    <option value="<?php echo $r['id']; ?>"><?php echo htmlspecialchars($r['role_name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-bold">Department</label>
                            <input type="text" name="department" class="form-control" value="Operations">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Designation</label>
                        <input type="text" name="designation" class="form-control" value="Senior Executive">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Initial Password</label>
                        <input type="password" name="password" class="form-control" value="Staff@123">
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Staff</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
