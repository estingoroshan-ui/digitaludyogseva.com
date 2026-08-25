<?php
$page_title = "Staff Task Management";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_task') {
    $title = sanitize($_POST['title']);
    $desc = sanitize($_POST['description']);
    $priority = sanitize($_POST['priority']);
    $due = $_POST['due_date'];
    $staff_id = (int)$_POST['assigned_employee_id'];

    $ins = $pdo->prepare("
        INSERT INTO tasks (title, description, priority, due_date, assigned_employee_id, status)
        VALUES (?, ?, ?, ?, ?, 'to_do')
    ");
    $ins->execute([$title, $desc, $priority, $due, $staff_id]);
    $msg = '<div class="alert alert-success fw-bold">New Task created and assigned successfully!</div>';
}

$employees = $pdo->query("SELECT e.id, u.name FROM employees e JOIN users u ON e.user_id = u.id")->fetchAll();
$tasks = $pdo->query("
    SELECT t.*, u.name AS staff_name
    FROM tasks t
    JOIN employees e ON t.assigned_employee_id = e.id
    JOIN users u ON e.user_id = u.id
    ORDER BY t.due_date ASC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Staff Task & Action Items</h4>
        <p class="text-muted small mb-0">Assign operational tasks, legal drafting actions & loan verification tasks to staff.</p>
    </div>
    <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#newTaskModal">
        <i class="bi bi-check2-square me-1"></i> Create Task
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Task Title</th>
                    <th>Assigned Staff</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($tasks)): ?>
                    <tr><td colspan="5" class="text-center text-muted py-4">No tasks assigned yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($tasks as $tk): ?>
                        <tr>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($tk['title']); ?></strong>
                                <small class="text-muted"><?php echo htmlspecialchars($tk['description'] ?: 'No description'); ?></small>
                            </td>
                            <td><span class="badge bg-secondary"><?php echo htmlspecialchars($tk['staff_name']); ?></span></td>
                            <td class="fw-bold text-dark"><?php echo date('d M Y', strtotime($tk['due_date'])); ?></td>
                            <td>
                                <?php if ($tk['priority'] === 'urgent' || $tk['priority'] === 'high'): ?>
                                    <span class="badge bg-danger"><?php echo strtoupper($tk['priority']); ?></span>
                                <?php else: ?>
                                    <span class="badge bg-info text-dark"><?php echo strtoupper($tk['priority']); ?></span>
                                <?php endif; ?>
                            </td>
                            <td><span class="badge bg-success"><?php echo htmlspecialchars($tk['status']); ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW TASK MODAL -->
<div class="modal fade" id="newTaskModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Assign Staff Task</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="create_task">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Task Title *</label>
                        <input type="text" name="title" class="form-control" required placeholder="e.g. Prepare PMEGP Project Report for Client">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Assign to Staff Member *</label>
                        <select name="assigned_employee_id" class="form-select" required>
                            <?php foreach ($employees as $emp): ?>
                                <option value="<?php echo $emp['id']; ?>"><?php echo htmlspecialchars($emp['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-bold">Priority *</label>
                            <select name="priority" class="form-select">
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                                <option value="medium" selected>Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-bold">Due Date *</label>
                            <input type="date" name="due_date" class="form-control" required value="<?php echo date('Y-m-d', strtotime('+1 day')); ?>">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Task Description</label>
                        <textarea name="description" class="form-control" rows="2" placeholder="Task details..."></textarea>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Assign Task</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
