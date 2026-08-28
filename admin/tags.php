<?php
$page_title = "Tags Master Manager";
$active_menu = "staff";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/TagEngine.php';
require_permission('settings_edit');

global $pdo;
$msg = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF token validation failed.";
    } else {
        $action = $_POST['action'];

        if ($action === 'create_tag') {
            $name = trim($_POST['name']);
            $color = sanitize($_POST['color'] ?? '#3b82f6');
            if (empty($name)) {
                $error = "Tag Name is required.";
            } else {
                $res = TagEngine::create_tag($name, $color);
                if ($res) {
                    ActivityLogger::log('create_tag', 'settings', null, "Created tag {$name}");
                    $msg = "Tag <strong>" . htmlspecialchars($name) . "</strong> created successfully!";
                } else {
                    $error = "Failed to create tag. Tag might already exist.";
                }
            }
        } elseif ($action === 'delete_tag') {
            $tag_id = (int)$_POST['tag_id'];
            $del = $pdo->prepare("DELETE FROM tags WHERE id = ?");
            $del->execute([$tag_id]);
            ActivityLogger::log('delete_tag', 'settings', $tag_id, "Deleted tag #{$tag_id}");
            $msg = "Tag deleted successfully.";
        }
    }
}

$tags = TagEngine::get_all();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-tags-fill text-primary me-2"></i> Central Tags Master Engine</h4>
        <p class="text-muted small mb-0">Create and manage reusable color-coded tags for Customers, Leads, Projects, Tasks, Tickets, and Proposals.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/settings.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to Settings
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalCreateTag">
            <i class="bi bi-plus-lg me-1"></i> Create New Tag
        </button>
    </div>
</div>

<?php if ($msg): ?><div class="alert alert-success border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo $msg; ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-danger border-0 shadow-sm rounded-3 fw-bold mb-4"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>

<div class="row g-4">
    <?php foreach ($tags as $t): ?>
        <div class="col-md-4 col-lg-3">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <span class="rounded-circle d-inline-block" style="width: 16px; height: 16px; background-color: <?php echo htmlspecialchars($t['color']); ?>;"></span>
                        <strong class="text-dark"><?php echo htmlspecialchars($t['name']); ?></strong>
                    </div>
                    <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete this tag?');">
                        <?php render_csrf_field(); ?>
                        <input type="hidden" name="action" value="delete_tag">
                        <input type="hidden" name="tag_id" value="<?php echo $t['id']; ?>">
                        <button type="submit" class="btn btn-sm btn-light border text-danger rounded-circle">
                            <i class="bi bi-trash"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<!-- CREATE TAG MODAL -->
<div class="modal fade" id="modalCreateTag" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="font-heading fw-bold"><i class="bi bi-tag-fill text-primary me-2"></i> Create Tag</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4 pt-2">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="create_tag">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Tag Name <span class="text-danger">*</span></label>
                    <input type="text" name="name" class="form-control" required placeholder="e.g. VIP Client">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Badge Color</label>
                    <input type="color" name="color" class="form-control form-control-color w-100" value="#3b82f6">
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-light rounded-pill me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Create Tag</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
