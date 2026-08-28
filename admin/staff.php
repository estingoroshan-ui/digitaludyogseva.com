<?php
$page_title = "HR Records & Enterprise Workforce Workspace";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_permission('staff_view');

global $pdo;
$msg = '';
$error = '';

$current_tab = $_GET['tab'] ?? 'records'; // 'dashboard', 'records', 'jobs', 'org', 'onboarding', 'training', 'dependants', 'layoff', 'qa'

// Handle Post Actions across HR Modules
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        // --- 1. CREATE / EDIT STAFF ---
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
            $notes = trim($_POST['notes'] ?? '');

            if (empty($name) || empty($email) || empty($mobile) || empty($role_id)) {
                $error = "Please fill in all mandatory fields (Name, Email, Mobile, Role).";
            } else {
                if ($action === 'create_staff') {
                    $password = $_POST['password'] ?: '123456';
                    $password_hash = password_hash($password, PASSWORD_BCRYPT);

                    $dup = $pdo->prepare("SELECT id FROM users WHERE email = ? OR mobile = ?");
                    $dup->execute([$email, $mobile]);
                    if ($dup->fetch()) {
                        $error = "A user with this email or mobile already exists.";
                    } else {
                        $ins = $pdo->prepare("
                            INSERT INTO users (user_type, role_id, department_id, name, email, mobile, password_hash, status, job_position, date_of_joining, language, notes, created_at)
                            VALUES ('staff', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                        ");
                        $ins->execute([$role_id, $department_id, $name, $email, $mobile, $password_hash, $status, $job_position, $date_of_joining, $language, $notes]);
                        $new_user_id = $pdo->lastInsertId();

                        $emp_code = 'EMP-' . str_pad($new_user_id, 4, '0', STR_PAD_LEFT);
                        $ins_emp = $pdo->prepare("INSERT IGNORE INTO employees (user_id, employee_code, department, designation, status) VALUES (?, ?, ?, ?, 'active')");
                        $ins_emp->execute([$new_user_id, $emp_code, $job_position ?: 'Staff', $job_position ?: 'Staff']);

                        ActivityLogger::log('create_staff', 'staff', $new_user_id, "Created staff account for {$name}");
                        $msg = "Staff account created successfully for <strong>" . htmlspecialchars($name) . "</strong>!";
                    }
                } else {
                    $upd = $pdo->prepare("
                        UPDATE users SET name = ?, email = ?, mobile = ?, role_id = ?, department_id = ?, 
                                         job_position = ?, date_of_joining = ?, status = ?, language = ?, notes = ?
                        WHERE id = ? AND user_type IN ('admin', 'staff')
                    ");
                    $upd->execute([$name, $email, $mobile, $role_id, $department_id, $job_position, $date_of_joining, $status, $language, $notes, $staff_id]);
                    
                    if (!empty($_POST['password'])) {
                        $hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
                        $upd_p = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                        $upd_p->execute([$hash, $staff_id]);
                    }

                    ActivityLogger::log('edit_staff', 'staff', $staff_id, "Updated staff profile for {$name}");
                    $msg = "Staff account updated successfully!";
                }
            }
        }
        // --- 2. TOGGLE STAFF STATUS ---
        elseif ($action === 'toggle_status') {
            require_permission('staff_delete');
            $staff_id = (int)$_POST['staff_id'];
            $new_status = sanitize($_POST['new_status']);
            $upd = $pdo->prepare("UPDATE users SET status = ? WHERE id = ? AND user_type IN ('admin', 'staff')");
            $upd->execute([$new_status, $staff_id]);
            ActivityLogger::log('staff_status_toggle', 'staff', $staff_id, "Changed staff status to {$new_status}");
            $msg = "Staff status changed to " . htmlspecialchars($new_status) . ".";
        }
        // --- 3. CREATE JOB POSITION ---
        elseif ($action === 'create_job') {
            $title = sanitize($_POST['title']);
            $dept_id = (int)$_POST['department_id'];
            $desc = sanitize($_POST['description']);
            $vacancies = (int)$_POST['vacancies'];

            $ins = $pdo->prepare("INSERT INTO job_positions (title, department_id, description, vacancies, status) VALUES (?, ?, ?, ?, 'active')");
            $ins->execute([$title, $dept_id, $desc, $vacancies]);
            $msg = "Job Position created successfully.";
        }
        // --- 4. CREATE TRAINING PROGRAM ---
        elseif ($action === 'create_training') {
            $title = sanitize($_POST['title']);
            $trainer = sanitize($_POST['trainer']);
            $desc = sanitize($_POST['description']);
            $s_date = $_POST['start_date'] ?: date('Y-m-d');
            $e_date = $_POST['end_date'] ?: date('Y-m-d', strtotime('+7 days'));

            $ins = $pdo->prepare("INSERT INTO hr_training (title, trainer, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, 'scheduled')");
            $ins->execute([$title, $trainer, $desc, $s_date, $e_date]);
            $msg = "Training Program scheduled successfully.";
        }
        // --- 5. ADD DEPENDANT ---
        elseif ($action === 'add_dependant') {
            $user_id = (int)$_POST['user_id'];
            $name = sanitize($_POST['name']);
            $rel = sanitize($_POST['relationship']);
            $phone = sanitize($_POST['phone']);

            $ins = $pdo->prepare("INSERT INTO hr_dependants (user_id, name, relationship, phone) VALUES (?, ?, ?, ?)");
            $ins->execute([$user_id, $name, $rel, $phone]);
            $msg = "Dependant record added.";
        }
        // --- 6. ADD POLICY Q&A ---
        elseif ($action === 'add_qa') {
            $cat = sanitize($_POST['category']);
            $q = sanitize($_POST['question']);
            $a = sanitize($_POST['answer']);

            $ins = $pdo->prepare("INSERT INTO hr_qa (category, question, answer, created_by) VALUES (?, ?, ?, ?)");
            $ins->execute([$cat, $q, $a, $current_user['id'] ?? 1]);
            $msg = "HR Policy Q&A added to Knowledge Base.";
        }
    }
}

// Master Data
$roles = $pdo->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll();
$departments = $pdo->query("SELECT * FROM departments WHERE status = 'active' ORDER BY name ASC")->fetchAll();

// Fetch HR Metrics
$total_staff = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE user_type IN ('admin', 'staff')")->fetchColumn();
$active_staff = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE user_type IN ('admin', 'staff') AND status = 'active'")->fetchColumn();
$total_depts = (int)$pdo->query("SELECT COUNT(*) FROM departments WHERE status = 'active'")->fetchColumn();
$total_jobs = (int)$pdo->query("SELECT COUNT(*) FROM job_positions WHERE status = 'active'")->fetchColumn();
$total_trainings = (int)$pdo->query("SELECT COUNT(*) FROM hr_training")->fetchColumn();

// Search & Filter for Staff Directory
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
$staff_stmt = $pdo->prepare("
    SELECT u.*, r.role_name, d.name AS department_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE {$where_sql}
    ORDER BY u.id DESC
");
$staff_stmt->execute($params);
$staff_members = $staff_stmt->fetchAll();
?>

<!-- TOP HEADER -->
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h3 class="font-heading fw-bold mb-1 text-dark"><i class="bi bi-people-fill text-primary me-2"></i> HR Records & Workforce Management</h3>
        <p class="text-muted small mb-0">Enterprise HR Module. Manage staff, job descriptions, org hierarchy, onboarding, training, and HR policies.</p>
    </div>
    <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#createStaffModal">
            <i class="bi bi-person-plus-fill me-1"></i> + Add New Staff Member
        </button>
        <a href="<?php echo BASE_URL; ?>admin/roles.php" class="btn btn-outline-dark rounded-pill px-3 fw-bold">
            <i class="bi bi-shield-lock me-1"></i> Roles & Permissions
        </a>
        <a href="<?php echo BASE_URL; ?>admin/departments.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-diagram-3 me-1"></i> Departments
        </a>
    </div>
</div>

<?php if ($msg): ?>
    <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4 p-3"><i class="bi bi-check-circle-fill me-2"></i> <?php echo $msg; ?> <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
<?php endif; ?>
<?php if ($error): ?>
    <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4 p-3"><i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $error; ?> <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
<?php endif; ?>

<!-- HR SUBMENU TABS BAR -->
<div class="card border-0 shadow-sm rounded-4 bg-white mb-4">
    <div class="card-header bg-white border-bottom p-3">
        <ul class="nav nav-pills card-header-pills gap-2 flex-wrap" role="tablist">
            <li class="nav-item">
                <a href="?tab=records" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'records' ? 'active' : ''; ?>"><i class="bi bi-people me-1"></i> HR records <span class="badge bg-secondary ms-1"><?php echo $total_staff; ?></span></a>
            </li>
            <li class="nav-item">
                <a href="?tab=dashboard" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'dashboard' ? 'active' : ''; ?>"><i class="bi bi-speedometer2 me-1"></i> Dashboard</a>
            </li>
            <li class="nav-item">
                <a href="?tab=jobs" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'jobs' ? 'active' : ''; ?>"><i class="bi bi-card-checklist me-1"></i> Job descriptions <span class="badge bg-info text-dark ms-1"><?php echo $total_jobs; ?></span></a>
            </li>
            <li class="nav-item">
                <a href="?tab=org" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'org' ? 'active' : ''; ?>"><i class="bi bi-diagram-3 me-1"></i> Org chart</a>
            </li>
            <li class="nav-item">
                <a href="?tab=onboarding" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'onboarding' ? 'active' : ''; ?>"><i class="bi bi-person-check me-1"></i> Onboarding</a>
            </li>
            <li class="nav-item">
                <a href="?tab=training" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'training' ? 'active' : ''; ?>"><i class="bi bi-mortarboard me-1"></i> Training <span class="badge bg-primary ms-1"><?php echo $total_trainings; ?></span></a>
            </li>
            <li class="nav-item">
                <a href="?tab=dependants" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'dependants' ? 'active' : ''; ?>"><i class="bi bi-person-heart me-1"></i> Dependants</a>
            </li>
            <li class="nav-item">
                <a href="?tab=layoff" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'layoff' ? 'active' : ''; ?>"><i class="bi bi-x-circle me-1"></i> Layoff checklist</a>
            </li>
            <li class="nav-item">
                <a href="?tab=qa" class="nav-link rounded-pill fw-bold <?php echo $current_tab === 'qa' ? 'active' : ''; ?>"><i class="bi bi-question-circle me-1"></i> Q&A</a>
            </li>
        </ul>
    </div>

    <div class="card-body p-4">
        <?php if ($current_tab === 'dashboard'): ?>
            <!-- ========================================================================= -->
            <!-- HR DASHBOARD TAB -->
            <!-- ========================================================================= -->
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="card border-0 bg-primary-subtle text-primary rounded-4 p-4">
                        <div class="text-uppercase small fw-bold">Total Workforce</div>
                        <div class="fs-2 fw-bold mt-1"><?php echo $total_staff; ?></div>
                        <small class="text-muted">Registered Employees</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 bg-success-subtle text-success rounded-4 p-4">
                        <div class="text-uppercase small fw-bold">Active Staff</div>
                        <div class="fs-2 fw-bold mt-1"><?php echo $active_staff; ?></div>
                        <small class="text-muted">Active Portal Access</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 bg-warning-subtle text-dark rounded-4 p-4">
                        <div class="text-uppercase small fw-bold">Departments</div>
                        <div class="fs-2 fw-bold mt-1"><?php echo $total_depts; ?></div>
                        <small class="text-muted">Active Teams</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 bg-info-subtle text-dark rounded-4 p-4">
                        <div class="text-uppercase small fw-bold">Open Positions</div>
                        <div class="fs-2 fw-bold mt-1"><?php echo $total_jobs; ?></div>
                        <small class="text-muted">Active Job Vacancies</small>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card border rounded-4 p-4 bg-white">
                        <h6 class="fw-bold mb-3"><i class="bi bi-diagram-3 text-primary me-2"></i> Department Breakdown</h6>
                        <div class="d-flex flex-column gap-3">
                            <?php foreach ($departments as $d): ?>
                                <?php
                                $d_count = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE department_id = {$d['id']} AND user_type IN ('admin', 'staff')")->fetchColumn();
                                ?>
                                <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
                                    <span class="fw-bold text-dark"><?php echo htmlspecialchars($d['name']); ?></span>
                                    <span class="badge bg-primary rounded-pill px-3 py-1"><?php echo $d_count; ?> Staff</span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border rounded-4 p-4 bg-white">
                        <h6 class="fw-bold mb-3"><i class="bi bi-mortarboard text-primary me-2"></i> Active Training Programs</h6>
                        <?php
                        $trainings = $pdo->query("SELECT * FROM hr_training ORDER BY id DESC LIMIT 5")->fetchAll();
                        ?>
                        <?php if (empty($trainings)): ?>
                            <div class="text-muted small">No training programs scheduled.</div>
                        <?php else: ?>
                            <div class="d-flex flex-column gap-2">
                                <?php foreach ($trainings as $tr): ?>
                                    <div class="border-start border-3 border-info ps-3 py-1">
                                        <div class="fw-bold text-dark"><?php echo htmlspecialchars($tr['title']); ?></div>
                                        <small class="text-muted">Trainer: <?php echo htmlspecialchars($tr['trainer'] ?: 'HR Team'); ?> | Status: <span class="badge bg-info text-dark rounded-pill"><?php echo ucfirst($tr['status']); ?></span></small>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

        <?php elseif ($current_tab === 'jobs'): ?>
            <!-- ========================================================================= -->
            <!-- JOB DESCRIPTIONS TAB -->
            <!-- ========================================================================= -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Job Positions & Descriptions Directory</h6>
                <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#jobModal"><i class="bi bi-plus-lg me-1"></i> Add Job Position</button>
            </div>
            <?php
            $jobs = $pdo->query("SELECT j.*, d.name AS dept_name FROM job_positions j LEFT JOIN departments d ON j.department_id = d.id ORDER BY j.id DESC")->fetchAll();
            ?>
            <div class="table-responsive">
                <table class="table table-bordered align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Job Title</th>
                            <th>Department</th>
                            <th>Description</th>
                            <th>Vacancies</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($jobs as $jb): ?>
                            <tr>
                                <td class="fw-bold text-primary"><?php echo htmlspecialchars($jb['title']); ?></td>
                                <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($jb['dept_name'] ?: 'General'); ?></span></td>
                                <td class="small text-secondary"><?php echo htmlspecialchars($jb['description']); ?></td>
                                <td class="fw-bold text-center"><?php echo $jb['vacancies']; ?></td>
                                <td><span class="badge bg-success rounded-pill"><?php echo ucfirst($jb['status']); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

        <?php elseif ($current_tab === 'org'): ?>
            <!-- ========================================================================= -->
            <!-- ORG CHART TAB -->
            <!-- ========================================================================= -->
            <h6 class="fw-bold mb-4"><i class="bi bi-diagram-3 text-primary me-2"></i> Company Organizational Structure Tree</h6>
            <div class="row g-4">
                <?php foreach ($departments as $dept): ?>
                    <?php
                    $d_staff = $pdo->query("SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.department_id = {$dept['id']} AND u.user_type IN ('admin', 'staff')")->fetchAll();
                    ?>
                    <div class="col-md-6 col-xl-4">
                        <div class="card border shadow-sm rounded-4 bg-white h-100 p-3">
                            <div class="card-header bg-primary text-white fw-bold rounded-3 mb-3">
                                <i class="bi bi-building me-1"></i> <?php echo htmlspecialchars($dept['name']); ?>
                            </div>
                            <div class="d-flex flex-column gap-2">
                                <?php if (empty($d_staff)): ?>
                                    <small class="text-muted">No staff assigned to department.</small>
                                <?php else: ?>
                                    <?php foreach ($d_staff as $stf): ?>
                                        <div class="d-flex align-items-center gap-2 p-2 rounded-3 bg-light">
                                            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 36px; height: 36px;">
                                                <?php echo strtoupper(substr($stf['name'], 0, 1)); ?>
                                            </div>
                                            <div>
                                                <div class="fw-bold text-dark small"><?php echo htmlspecialchars($stf['name']); ?></div>
                                                <small class="text-muted" style="font-size: 11px;"><?php echo htmlspecialchars($stf['job_position'] ?: $stf['role_name']); ?></small>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

        <?php elseif ($current_tab === 'onboarding'): ?>
            <!-- ========================================================================= -->
            <!-- ONBOARDING TAB -->
            <!-- ========================================================================= -->
            <h6 class="fw-bold mb-3"><i class="bi bi-person-check text-primary me-2"></i> Employee Onboarding & Exit Progress</h6>
            <div class="table-responsive">
                <table class="table table-bordered align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Staff Member</th>
                            <th>Role & Department</th>
                            <th>Onboarding Checklist</th>
                            <th>KYC Verification</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($staff_members as $stf): ?>
                            <tr>
                                <td class="fw-bold text-dark"><?php echo htmlspecialchars($stf['name']); ?></td>
                                <td><?php echo htmlspecialchars($stf['role_name']); ?> (<?php echo htmlspecialchars($stf['department_name'] ?: 'General'); ?>)</td>
                                <td>
                                    <span class="badge bg-success-subtle text-success border me-1"><i class="bi bi-check-circle me-1"></i> Offer Letter</span>
                                    <span class="badge bg-success-subtle text-success border me-1"><i class="bi bi-check-circle me-1"></i> Portal Access</span>
                                    <span class="badge bg-success-subtle text-success border"><i class="bi bi-check-circle me-1"></i> Bank Details</span>
                                </td>
                                <td><span class="badge bg-success rounded-pill">Verified</span></td>
                                <td><span class="badge bg-primary rounded-pill">Active Onboarded</span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

        <?php elseif ($current_tab === 'training'): ?>
            <!-- ========================================================================= -->
            <!-- TRAINING TAB -->
            <!-- ========================================================================= -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Training & Skills Development Programs</h6>
                <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#trainingModal"><i class="bi bi-plus-lg me-1"></i> Schedule Training</button>
            </div>
            <?php
            $trainings_list = $pdo->query("SELECT * FROM hr_training ORDER BY id DESC")->fetchAll();
            ?>
            <div class="table-responsive">
                <table class="table table-bordered align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Program Title</th>
                            <th>Trainer</th>
                            <th>Description</th>
                            <th>Schedule Dates</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($trainings_list as $tr): ?>
                            <tr>
                                <td class="fw-bold text-primary"><?php echo htmlspecialchars($tr['title']); ?></td>
                                <td><?php echo htmlspecialchars($tr['trainer'] ?: 'HR Team'); ?></td>
                                <td class="small text-secondary"><?php echo htmlspecialchars($tr['description']); ?></td>
                                <td class="small fw-bold"><?php echo date('d-m-Y', strtotime($tr['start_date'])); ?> to <?php echo date('d-m-Y', strtotime($tr['end_date'])); ?></td>
                                <td><span class="badge bg-info text-dark rounded-pill"><?php echo ucfirst($tr['status']); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

        <?php elseif ($current_tab === 'dependants'): ?>
            <!-- ========================================================================= -->
            <!-- DEPENDANTS TAB -->
            <!-- ========================================================================= -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Employee Dependants & Emergency Contacts</h6>
                <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#dependantModal"><i class="bi bi-plus-lg me-1"></i> Add Dependant</button>
            </div>
            <?php
            $dependants = $pdo->query("SELECT d.*, u.name AS employee_name FROM hr_dependants d JOIN users u ON d.user_id = u.id ORDER BY d.id DESC")->fetchAll();
            ?>
            <div class="table-responsive">
                <table class="table table-bordered align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Employee Name</th>
                            <th>Dependant Name</th>
                            <th>Relationship</th>
                            <th>Emergency Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($dependants)): ?>
                            <tr><td colspan="4" class="text-center py-4 text-muted">No dependant records created yet.</td></tr>
                        <?php else: ?>
                            <?php foreach ($dependants as $dp): ?>
                                <tr>
                                    <td class="fw-bold text-dark"><?php echo htmlspecialchars($dp['employee_name']); ?></td>
                                    <td class="fw-bold text-primary"><?php echo htmlspecialchars($dp['name']); ?></td>
                                    <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($dp['relationship']); ?></span></td>
                                    <td class="fw-bold"><i class="bi bi-telephone text-success me-1"></i> <?php echo htmlspecialchars($dp['phone']); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

        <?php elseif ($current_tab === 'qa'): ?>
            <!-- ========================================================================= -->
            <!-- Q&A & HR POLICY TAB -->
            <!-- ========================================================================= -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">HR Policy Knowledge Base & FAQs</h6>
                <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#qaModal"><i class="bi bi-plus-lg me-1"></i> Add Policy Q&A</button>
            </div>
            <?php
            $qas = $pdo->query("SELECT * FROM hr_qa ORDER BY id DESC")->fetchAll();
            ?>
            <div class="accordion" id="qaAccordion">
                <?php foreach ($qas as $idx => $qa): ?>
                    <div class="accordion-item border rounded-3 mb-2 overflow-hidden">
                        <h2 class="accordion-header" id="heading<?php echo $qa['id']; ?>">
                            <button class="accordion-button collapsed fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapse<?php echo $qa['id']; ?>">
                                <span class="badge bg-primary-subtle text-primary border me-2"><?php echo htmlspecialchars($qa['category']); ?></span>
                                <?php echo htmlspecialchars($qa['question']); ?>
                            </button>
                        </h2>
                        <div id="collapse<?php echo $qa['id']; ?>" class="accordion-collapse collapse" data-bs-parent="#qaAccordion">
                            <div class="accordion-body text-secondary">
                                <?php echo nl2br(htmlspecialchars($qa['answer'])); ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

        <?php else: ?>
            <!-- ========================================================================= -->
            <!-- DEFAULT: STAFF DIRECTORY / HR RECORDS TAB -->
            <!-- ========================================================================= -->
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <form action="" method="GET" class="d-flex gap-2 align-items-center flex-wrap">
                    <input type="hidden" name="tab" value="records">
                    <input type="text" name="q" class="form-control form-control-sm rounded-pill px-3" placeholder="Search staff name, email..." value="<?php echo htmlspecialchars($search); ?>">
                    
                    <select name="dept_id" class="form-select form-select-sm rounded-pill">
                        <option value="0">All Departments</option>
                        <?php foreach ($departments as $d): ?>
                            <option value="<?php echo $d['id']; ?>" <?php echo $dept_filter == $d['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($d['name']); ?></option>
                        <?php endforeach; ?>
                    </select>

                    <select name="role_id" class="form-select form-select-sm rounded-pill">
                        <option value="0">All Roles</option>
                        <?php foreach ($roles as $r): ?>
                            <option value="<?php echo $r['id']; ?>" <?php echo $role_filter == $r['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($r['role_name']); ?></option>
                        <?php endforeach; ?>
                    </select>

                    <button type="submit" class="btn btn-sm btn-primary rounded-pill px-3">Filter</button>
                    <a href="staff.php" class="btn btn-sm btn-outline-secondary rounded-pill px-3">Reset</a>
                </form>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 text-nowrap">
                    <thead class="table-light fs-7 text-uppercase text-muted">
                        <tr>
                            <th>#</th>
                            <th>Staff Member</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($staff_members)): ?>
                            <tr><td colspan="8" class="text-center py-5 text-muted">No staff members found matching criteria.</td></tr>
                        <?php else: ?>
                            <?php $idx = 1; foreach ($staff_members as $stf): ?>
                                <tr>
                                    <td class="small text-muted fw-bold"><?php echo $idx++; ?></td>
                                    <td>
                                        <div class="fw-bold text-dark"><?php echo htmlspecialchars($stf['name']); ?></div>
                                        <small class="text-muted"><?php echo htmlspecialchars($stf['email']); ?></small>
                                    </td>
                                    <td><span class="badge bg-primary-subtle text-primary border rounded-pill px-3 py-1"><?php echo htmlspecialchars($stf['role_name']); ?></span></td>
                                    <td><span class="badge bg-light text-dark border rounded-pill px-3 py-1"><?php echo htmlspecialchars($stf['department_name'] ?: 'General'); ?></span></td>
                                    <td class="small"><?php echo htmlspecialchars($stf['job_position'] ?: 'Staff'); ?></td>
                                    <td class="small fw-semibold"><i class="bi bi-telephone text-muted me-1"></i><?php echo htmlspecialchars($stf['mobile']); ?></td>
                                    <td>
                                        <span class="badge bg-<?php echo $stf['status'] === 'active' ? 'success' : 'danger'; ?> rounded-pill px-3 py-1"><?php echo ucfirst($stf['status']); ?></span>
                                    </td>
                                    <td class="text-end">
                                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" onclick="openEditStaffModal(<?php echo htmlspecialchars(json_encode($stf)); ?>);">
                                            <i class="bi bi-pencil me-1"></i> Edit
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- ========================================================================= -->
<!-- MODALS FOR HR MODULES -->
<!-- ========================================================================= -->
<!-- MODAL: ADD / EDIT STAFF -->
<div class="modal fade" id="createStaffModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold" id="staffModalTitle"><i class="bi bi-person-plus-fill text-primary me-2"></i> Add New Staff Member</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" id="staffForm">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" id="staffAction" value="create_staff">
                <input type="hidden" name="staff_id" id="staffId" value="0">
                <div class="modal-body p-4">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Full Name *</label>
                            <input type="text" name="name" id="staffName" class="form-control" required placeholder="Staff Full Name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Email Address *</label>
                            <input type="email" name="email" id="staffEmail" class="form-control" required placeholder="staff@digitaludyogseva.com">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Mobile Number *</label>
                            <input type="tel" name="mobile" id="staffMobile" class="form-control" required placeholder="10-digit Mobile">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Role & Permissions *</label>
                            <select name="role_id" id="staffRole" class="form-select" required>
                                <option value="">Select Role...</option>
                                <?php foreach ($roles as $r): ?>
                                    <option value="<?php echo $r['id']; ?>"><?php echo htmlspecialchars($r['role_name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Department</label>
                            <select name="department_id" id="staffDept" class="form-select">
                                <option value="">Select Department...</option>
                                <?php foreach ($departments as $d): ?>
                                    <option value="<?php echo $d['id']; ?>"><?php echo htmlspecialchars($d['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Job Designation</label>
                            <input type="text" name="job_position" id="staffPosition" class="form-control" placeholder="e.g. Loan Officer">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Date of Joining</label>
                            <input type="date" name="date_of_joining" id="staffDOJ" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Password (Leave blank to keep current)</label>
                            <input type="password" name="password" class="form-control" placeholder="Password">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Staff Account</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: ADD JOB POSITION -->
<div class="modal fade" id="jobModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-card-checklist text-primary me-2"></i> Add Job Position</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_job">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Job Title *</label>
                        <input type="text" name="title" class="form-control" required placeholder="e.g. Loan Processing Executive">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Department</label>
                        <select name="department_id" class="form-select">
                            <?php foreach ($departments as $d): ?>
                                <option value="<?php echo $d['id']; ?>"><?php echo htmlspecialchars($d['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Number of Vacancies</label>
                        <input type="number" name="vacancies" class="form-control" value="1">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Job Description</label>
                        <textarea name="description" class="form-control" rows="3" placeholder="Key responsibilities..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Job Position</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: SCHEDULE TRAINING -->
<div class="modal fade" id="trainingModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-mortarboard text-primary me-2"></i> Schedule Training Program</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_training">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Program Title *</label>
                        <input type="text" name="title" class="form-control" required placeholder="e.g. Government Scheme Application Filing">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Trainer Name</label>
                        <input type="text" name="trainer" class="form-control" placeholder="Trainer Name">
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Start Date</label>
                            <input type="date" name="start_date" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">End Date</label>
                            <input type="date" name="end_date" class="form-control" value="<?php echo date('Y-m-d', strtotime('+7 days')); ?>">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Description</label>
                        <textarea name="description" class="form-control" rows="3" placeholder="Training agenda and goals..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Schedule Program</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: ADD DEPENDANT -->
<div class="modal fade" id="dependantModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-person-heart text-primary me-2"></i> Add Dependant / Emergency Contact</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_dependant">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Select Employee *</label>
                        <select name="user_id" class="form-select" required>
                            <?php foreach ($staff_members as $stf): ?>
                                <option value="<?php echo $stf['id']; ?>"><?php echo htmlspecialchars($stf['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Dependant Name *</label>
                        <input type="text" name="name" class="form-control" required placeholder="Dependant Full Name">
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Relationship</label>
                            <input type="text" name="relationship" class="form-control" placeholder="Spouse / Parent / Child">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Emergency Phone</label>
                            <input type="tel" name="phone" class="form-control" placeholder="10-digit Mobile">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Dependant</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL: ADD Q&A POLICY -->
<div class="modal fade" id="qaModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-question-circle text-primary me-2"></i> Add HR Policy Q&A</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_qa">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Category</label>
                        <input type="text" name="category" class="form-control" value="General Policy" placeholder="Category Name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Question *</label>
                        <input type="text" name="question" class="form-control" required placeholder="Question text...">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Answer *</label>
                        <textarea name="answer" class="form-control" rows="4" required placeholder="Official answer or policy explanation..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-top">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Policy Q&A</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function openEditStaffModal(staff) {
    document.getElementById('staffModalTitle').innerHTML = '<i class="bi bi-pencil-square text-primary me-2"></i> Edit Staff Account';
    document.getElementById('staffAction').value = 'edit_staff';
    document.getElementById('staffId').value = staff.id;
    document.getElementById('staffName').value = staff.name;
    document.getElementById('staffEmail').value = staff.email;
    document.getElementById('staffMobile').value = staff.mobile;
    document.getElementById('staffRole').value = staff.role_id;
    document.getElementById('staffDept').value = staff.department_id || '';
    document.getElementById('staffPosition').value = staff.job_position || '';
    document.getElementById('staffDOJ').value = staff.date_of_joining || '';
    
    var modal = new bootstrap.Modal(document.getElementById('createStaffModal'));
    modal.show();
}
</script>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
