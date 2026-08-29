<?php
$page_title = "Service Categories Master";
$active_menu = "services_master";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';
$msg_type = 'success';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $msg = "CSRF verification failed.";
        $msg_type = "danger";
    } else {
        $action = $_POST['action'];

        // Save (Create or Edit)
        if ($action === 'save_category') {
            $cat_id = (int)($_POST['category_id'] ?? 0);
            $parent_id = !empty($_POST['parent_id']) ? (int)$_POST['parent_id'] : null;
            $name = sanitize($_POST['name'] ?? '');
            $slug = sanitize($_POST['slug'] ?? '');
            if (empty($slug)) {
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
            }
            $icon = sanitize($_POST['icon'] ?? 'bi-folder');
            $description = sanitize($_POST['description'] ?? '');
            $sort_order = (int)($_POST['sort_order'] ?? 0);
            $status = in_array($_POST['status'] ?? '', ['active', 'inactive']) ? $_POST['status'] : 'active';

            if (!empty($name)) {
                if ($cat_id > 0) {
                    $stmt = $pdo->prepare("
                        UPDATE service_categories 
                        SET parent_id = ?, name = ?, slug = ?, icon = ?, description = ?, sort_order = ?, status = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([$parent_id, $name, $slug, $icon, $description, $sort_order, $status, $cat_id]);
                    $msg = "Category '{$name}' updated successfully.";
                } else {
                    $stmt = $pdo->prepare("
                        INSERT INTO service_categories (parent_id, name, slug, icon, description, sort_order, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([$parent_id, $name, $slug, $icon, $description, $sort_order, $status]);
                    $msg = "New category '{$name}' created successfully.";
                }
            } else {
                $msg = "Category name cannot be empty.";
                $msg_type = "danger";
            }
        }

        // Toggle Status
        if ($action === 'toggle_status') {
            $cat_id = (int)($_POST['category_id'] ?? 0);
            $new_status = ($_POST['status'] ?? '') === 'active' ? 'active' : 'inactive';
            if ($cat_id > 0) {
                $pdo->prepare("UPDATE service_categories SET status = ? WHERE id = ?")->execute([$new_status, $cat_id]);
                $msg = "Category status updated to {$new_status}.";
            }
        }

        // Delete
        if ($action === 'delete_category') {
            $cat_id = (int)($_POST['category_id'] ?? 0);
            if ($cat_id > 0) {
                // Check if any services are assigned
                $srv_count = (int)$pdo->prepare("SELECT COUNT(*) FROM services WHERE category_id = ? OR subcategory_id = ?")->execute([$cat_id, $cat_id]) ? $pdo->query("SELECT COUNT(*) FROM services WHERE category_id = {$cat_id} OR subcategory_id = {$cat_id}")->fetchColumn() : 0;
                if ($srv_count > 0) {
                    $msg = "Cannot delete: {$srv_count} services are currently linked to this category.";
                    $msg_type = "danger";
                } else {
                    $pdo->prepare("DELETE FROM service_categories WHERE id = ?")->execute([$cat_id]);
                    $msg = "Category deleted successfully.";
                }
            }
        }
    }
}

// Fetch Parent Categories for dropdown
$parent_categories = $pdo->query("SELECT * FROM service_categories WHERE parent_id IS NULL ORDER BY sort_order ASC, name ASC")->fetchAll();

// Fetch all with counts
$categories = $pdo->query("
    SELECT c.*, p.name AS parent_name,
           (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id OR s.subcategory_id = c.id) AS service_count
    FROM service_categories c
    LEFT JOIN service_categories p ON c.parent_id = p.id
    ORDER BY COALESCE(p.sort_order, c.sort_order) ASC, c.parent_id ASC, c.sort_order ASC, c.name ASC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1 small">
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/index.php">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/service_master.php">Services & Documents</a></li>
                <li class="breadcrumb-item active" aria-current="page">Categories Master</li>
            </ol>
        </nav>
        <h4 class="font-heading fw-bold mb-1">Service Categories & Subcategories Master</h4>
        <p class="text-muted small mb-0">Organize service offerings, document types, and workflow classifications.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/service_master.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to Services
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#categoryModal" onclick="resetCategoryForm()">
            <i class="bi bi-plus-lg me-1"></i> Add Category / Subcategory
        </button>
    </div>
</div>

<?php if (!empty($msg)): ?>
    <div class="alert alert-<?php echo $msg_type; ?> alert-dismissible fade show rounded-3 shadow-sm" role="alert">
        <i class="bi <?php echo $msg_type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'; ?> me-2"></i>
        <?php echo htmlspecialchars($msg); ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
<?php endif; ?>

<!-- CATEGORIES DIRECTORY TABLE -->
<div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
    <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
        <h6 class="fw-bold mb-0 text-dark">
            <i class="bi bi-tags-fill me-2 text-primary"></i> All Categories & Classifications (<?php echo count($categories); ?>)
        </h6>
        <input type="text" id="catSearchInput" class="form-control form-control-sm rounded-pill px-3" style="max-width: 260px;" placeholder="Search categories...">
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" id="categoriesTable">
            <thead class="table-light">
                <tr>
                    <th class="ps-4">Icon & Name</th>
                    <th>Slug</th>
                    <th>Type / Parent</th>
                    <th>Order</th>
                    <th>Services Linked</th>
                    <th>Status</th>
                    <th class="text-end pe-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($categories)): ?>
                    <tr><td colspan="7" class="text-center py-5 text-muted">No categories configured yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($categories as $cat): ?>
                        <tr class="cat-row">
                            <td class="ps-4">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="category-icon-box rounded-3 bg-light text-primary d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; font-size: 1.25rem;">
                                        <i class="bi <?php echo htmlspecialchars($cat['icon'] ?: 'bi-folder'); ?>"></i>
                                    </div>
                                    <div>
                                        <strong class="d-block text-dark <?php echo empty($cat['parent_id']) ? 'fs-6' : 'small'; ?>">
                                            <?php if (!empty($cat['parent_id'])): ?><span class="text-muted me-1">↳</span><?php endif; ?>
                                            <?php echo htmlspecialchars($cat['name']); ?>
                                        </strong>
                                        <?php if (!empty($cat['description'])): ?>
                                            <small class="text-muted text-truncate d-inline-block" style="max-width: 320px;"><?php echo htmlspecialchars($cat['description']); ?></small>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </td>
                            <td><code class="text-muted"><?php echo htmlspecialchars($cat['slug']); ?></code></td>
                            <td>
                                <?php if (empty($cat['parent_id'])): ?>
                                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2">Primary Category</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2">Sub: <?php echo htmlspecialchars($cat['parent_name']); ?></span>
                                <?php endif; ?>
                            </td>
                            <td><span class="text-muted fw-bold"><?php echo $cat['sort_order']; ?></span></td>
                            <td>
                                <a href="<?php echo BASE_URL; ?>admin/service_master.php?cat=<?php echo $cat['id']; ?>" class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2 text-decoration-none">
                                    <?php echo $cat['service_count']; ?> services
                                </a>
                            </td>
                            <td>
                                <form action="" method="POST" class="d-inline">
                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                    <input type="hidden" name="action" value="toggle_status">
                                    <input type="hidden" name="category_id" value="<?php echo $cat['id']; ?>">
                                    <input type="hidden" name="status" value="<?php echo $cat['status'] === 'active' ? 'inactive' : 'active'; ?>">
                                    <button type="submit" class="btn btn-sm border-0 p-0 badge rounded-pill px-2 <?php echo $cat['status'] === 'active' ? 'bg-success' : 'bg-secondary'; ?>">
                                        <?php echo ucfirst($cat['status']); ?>
                                    </button>
                                </form>
                            </td>
                            <td class="text-end pe-4">
                                <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-2 py-1 me-1" onclick='editCategory(<?php echo json_encode($cat); ?>)'>
                                    <i class="bi bi-pencil-square"></i> Edit
                                </button>
                                <form action="" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to delete category: <?php echo htmlspecialchars(addslashes($cat['name'])); ?>?');">
                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                    <input type="hidden" name="action" value="delete_category">
                                    <input type="hidden" name="category_id" value="<?php echo $cat['id']; ?>">
                                    <button type="submit" class="btn btn-sm btn-outline-danger rounded-pill px-2 py-1">
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

<!-- CATEGORY ADD/EDIT MODAL -->
<div class="modal fade" id="categoryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold" id="catModalTitle">Add Service Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" id="categoryForm">
                <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                <input type="hidden" name="action" value="save_category">
                <input type="hidden" name="category_id" id="modal_cat_id" value="0">
                
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small fw-bold">Parent Category (Optional)</label>
                            <select name="parent_id" id="modal_parent_id" class="form-select rounded-3">
                                <option value="">-- None (Make this a Top-Level Category) --</option>
                                <?php foreach ($parent_categories as $p): ?>
                                    <option value="<?php echo $p['id']; ?>"><?php echo htmlspecialchars($p['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <small class="text-muted">Leave empty if this is a primary master category.</small>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Category Name *</label>
                            <input type="text" name="name" id="modal_cat_name" class="form-control rounded-3" required placeholder="e.g. Company Registration">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">URL Slug (Auto-generated if blank)</label>
                            <input type="text" name="slug" id="modal_cat_slug" class="form-control rounded-3" placeholder="e.g. company-registration">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Bootstrap Icon</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="bi bi-star" id="iconPreview"></i></span>
                                <input type="text" name="icon" id="modal_cat_icon" class="form-control" value="bi-folder" placeholder="bi-building">
                            </div>
                            <small class="text-muted">e.g. bi-shield-check, bi-person-vcard</small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Sort Order</label>
                            <input type="number" name="sort_order" id="modal_cat_order" class="form-control rounded-3" value="0">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Description</label>
                            <textarea name="description" id="modal_cat_desc" class="form-control rounded-3" rows="2" placeholder="Brief summary of services in this category"></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Status</label>
                            <select name="status" id="modal_cat_status" class="form-select rounded-3">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Category</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function resetCategoryForm() {
    document.getElementById('catModalTitle').innerText = 'Add Service Category';
    document.getElementById('modal_cat_id').value = '0';
    document.getElementById('modal_parent_id').value = '';
    document.getElementById('modal_cat_name').value = '';
    document.getElementById('modal_cat_slug').value = '';
    document.getElementById('modal_cat_icon').value = 'bi-folder';
    document.getElementById('modal_cat_order').value = '0';
    document.getElementById('modal_cat_desc').value = '';
    document.getElementById('modal_cat_status').value = 'active';
    updateIconPreview();
}

function editCategory(cat) {
    document.getElementById('catModalTitle').innerText = 'Edit Category: ' + cat.name;
    document.getElementById('modal_cat_id').value = cat.id;
    document.getElementById('modal_parent_id').value = cat.parent_id || '';
    document.getElementById('modal_cat_name').value = cat.name;
    document.getElementById('modal_cat_slug').value = cat.slug;
    document.getElementById('modal_cat_icon').value = cat.icon || 'bi-folder';
    document.getElementById('modal_cat_order').value = cat.sort_order || '0';
    document.getElementById('modal_cat_desc').value = cat.description || '';
    document.getElementById('modal_cat_status').value = cat.status || 'active';
    updateIconPreview();
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function updateIconPreview() {
    const iconVal = document.getElementById('modal_cat_icon').value || 'bi-folder';
    const preview = document.getElementById('iconPreview');
    preview.className = 'bi ' + iconVal;
}
document.getElementById('modal_cat_icon')?.addEventListener('input', updateIconPreview);

// Live search for table
document.getElementById('catSearchInput')?.addEventListener('keyup', function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#categoriesTable tbody tr.cat-row');
    rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(filter) ? '' : 'none';
    });
});
</script>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
