<?php
$page_title = "Extensible Custom Fields Engine";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_permission('settings_edit');

global $pdo;
$msg = '';
$error = '';

// Handle Custom Fields Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        if ($action === 'create_field') {
            $belongs_to = sanitize($_POST['belongs_to']);
            $name = trim($_POST['name']);
            $field_type = sanitize($_POST['field_type']);
            $options = trim($_POST['options'] ?? '');
            $is_required = isset($_POST['is_required']) ? 1 : 0;
            $show_on_table = isset($_POST['show_on_table']) ? 1 : 0;

            if (empty($name) || empty($belongs_to) || empty($field_type)) {
                $error = "Field Name, Module, and Field Type are required.";
            } else {
                $ins = $pdo->prepare("
                    INSERT INTO custom_fields (belongs_to, name, field_type, options, is_required, show_on_table, is_active, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
                ");
                $ins->execute([$belongs_to, $name, $field_type, $options, $is_required, $show_on_table]);
                ActivityLogger::log('create_custom_field', 'settings', $pdo->lastInsertId(), "Created custom field {$name} for {$belongs_to}");
                $msg = "Custom Field <strong>" . htmlspecialchars($name) . "</strong> created successfully!";
            }
        } elseif ($action === 'delete_field') {
            $field_id = (int)$_POST['field_id'];
            $del = $pdo->prepare("DELETE FROM custom_fields WHERE id = ?");
            $del->execute([$field_id]);
            ActivityLogger::log('delete_custom_field', 'settings', $field_id, "Deleted custom field #{$field_id}");
            $msg = "Custom field deleted.";
        }
    }
}

// Fetch Custom Fields Grouped by Module
$fields = $pdo->query("SELECT * FROM custom_fields ORDER BY belongs_to ASC, display_order ASC, id ASC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-ui-checks text-primary me-2"></i> Custom Fields Engine</h4>
        <p class="text-muted small mb-0">Create dynamic custom fields for Customers, Leads, Invoices, Proposals, Projects, Tasks, and Tickets.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/settings.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to Settings
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalCreateField">
            <i class="bi bi-plus-lg me-1"></i> Add Custom Field
        </button>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Field Name</th>
                    <th>Belongs To (Module)</th>
                    <th>Field Type</th>
                    <th>Options / Values</th>
                    <th>Required</th>
                    <th>Visible on Table</th>
                    <th class="text-end">Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($fields)): ?>
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">No custom fields created yet. Click 'Add Custom Field' above.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($fields as $f): ?>
                        <tr>
                            <td class="fw-bold text-dark"><?php echo htmlspecialchars($f['name']); ?></td>
                            <td><span class="badge bg-primary-subtle text-primary uppercase fw-bold"><?php echo htmlspecialchars(ucfirst($f['belongs_to'])); ?></span></td>
                            <td><span class="badge bg-light text-dark border"><?php echo htmlspecialchars($f['field_type']); ?></span></td>
                            <td class="small text-muted"><?php echo htmlspecialchars($f['options'] ?: '-'); ?></td>
                            <td><?php echo $f['is_required'] ? '<span class="badge bg-danger">Yes</span>' : '<span class="badge bg-secondary">No</span>'; ?></td>
                            <td><?php echo $f['show_on_table'] ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'; ?></td>
                            <td class="text-end">
                                <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete this custom field?');">
                                    <?php render_csrf_field(); ?>
                                    <input type="hidden" name="action" value="delete_field">
                                    <input type="hidden" name="field_id" value="<?php echo $f['id']; ?>">
                                    <button type="submit" class="btn btn-sm btn-light border text-danger rounded-circle">
                                        <i class="bi bi-trash"></i>
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

<!-- CREATE FIELD MODAL -->
<div class="modal fade" id="modalCreateField" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-ui-checks-grid text-primary me-2"></i> Add Custom Field</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_field">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Belongs To Module <span class="text-danger">*</span></label>
                    <select name="belongs_to" class="form-select" required>
                        <option value="customers">Customers</option>
                        <option value="contacts">Contacts</option>
                        <option value="leads">Leads</option>
                        <option value="invoices">Invoices</option>
                        <option value="estimates">Estimates</option>
                        <option value="proposals">Proposals</option>
                        <option value="projects">Projects</option>
                        <option value="tasks">Tasks</option>
                        <option value="tickets">Tickets</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Field Label / Name <span class="text-danger">*</span></label>
                    <input type="text" name="name" class="form-control" required placeholder="e.g. GST Registration Date">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Field Input Type <span class="text-danger">*</span></label>
                    <select name="field_type" class="form-select" required>
                        <option value="text">Text Input</option>
                        <option value="number">Number Input</option>
                        <option value="textarea">Textarea (Multi-line)</option>
                        <option value="date">Date Picker</option>
                        <option value="datetime">DateTime Picker</option>
                        <option value="select">Dropdown Select</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="url">URL Link</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Options (Comma separated for Dropdown)</label>
                    <input type="text" name="options" class="form-control" placeholder="e.g. Option 1, Option 2, Option 3">
                </div>
                <div class="form-check mb-2">
                    <input type="checkbox" name="is_required" class="form-check-input" id="chkReq">
                    <label class="form-check-label small" for="chkReq">Mandatory Field (Required)</label>
                </div>
                <div class="form-check mb-3">
                    <input type="checkbox" name="show_on_table" class="form-check-input" id="chkTbl" checked>
                    <label class="form-check-label small" for="chkTbl">Show on Admin Table View</label>
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Custom Field</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
