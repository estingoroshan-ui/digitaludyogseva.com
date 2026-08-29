<?php
$page_title = "Services & Documents Master";
$active_menu = "services_master";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';
$msg_type = 'success';

// Ensure upload directory exists
$upload_dir = __DIR__ . '/../uploads/services/';
if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0777, true);
}

// =========================================================================
// POST REQUEST HANDLERS
// =========================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $msg = "CSRF security token verification failed.";
        $msg_type = "danger";
    } else {
        $action = $_POST['action'];

        // --- 1. SAVE SERVICE (CREATE OR UPDATE) ---
        if ($action === 'save_service') {
            $srv_id = (int)($_POST['service_id'] ?? 0);
            $service_code = sanitize($_POST['service_code'] ?? '');
            $name = sanitize($_POST['name'] ?? '');
            $slug = sanitize($_POST['slug'] ?? '');
            if (empty($slug)) {
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
            }
            $category_id = (int)($_POST['category_id'] ?? 0);
            $subcategory_id = !empty($_POST['subcategory_id']) ? (int)$_POST['subcategory_id'] : null;
            $icon = sanitize($_POST['icon'] ?? 'bi-gear');
            $short_desc = sanitize($_POST['short_description'] ?? '');
            $description = $_POST['description'] ?? '';
            $govt_fee = (float)($_POST['govt_fee'] ?? 0);
            $prof_fee = (float)($_POST['prof_fee'] ?? 0);
            $other_charges = (float)($_POST['other_charges'] ?? 0);
            $is_gst_applicable = isset($_POST['is_gst_applicable']) ? 1 : 0;
            $gst_rate = $is_gst_applicable ? (float)($_POST['gst_rate'] ?? 18.00) : 0.00;
            
            // Taxable calculation
            $taxable = $prof_fee + $other_charges;
            $gst_amount = $is_gst_applicable ? (($taxable * $gst_rate) / 100) : 0;
            $final_price = $govt_fee + $taxable + $gst_amount;

            $is_discount_allowed = isset($_POST['is_discount_allowed']) ? 1 : 0;
            $min_time = (int)($_POST['min_time'] ?? 1);
            $max_time = (int)($_POST['max_time'] ?? 3);
            $time_unit = in_array($_POST['time_unit'] ?? '', ['Hours', 'Days', 'Working Days']) ? $_POST['time_unit'] : 'Working Days';
            $expected_time = sanitize($_POST['expected_completion_time'] ?? "{$min_time}–{$max_time} {$time_unit}");
            $eligibility = sanitize($_POST['eligibility'] ?? '');
            $important_notes = sanitize($_POST['important_notes'] ?? '');
            $status = in_array($_POST['status'] ?? '', ['active', 'inactive']) ? $_POST['status'] : 'active';
            $is_featured = isset($_POST['is_featured']) ? 1 : 0;
            $display_order = (int)($_POST['display_order'] ?? 0);

            // Handle Image Upload from Computer
            $image_path = sanitize($_POST['existing_image'] ?? '');
            if (isset($_FILES['service_image']) && $_FILES['service_image']['error'] === UPLOAD_ERR_OK) {
                $file_tmp = $_FILES['service_image']['tmp_name'];
                $file_name = $_FILES['service_image']['name'];
                $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
                $allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg'];

                if (in_array($file_ext, $allowed)) {
                    $new_filename = 'srv_' . time() . '_' . uniqid() . '.' . $file_ext;
                    $target_file = $upload_dir . $new_filename;
                    if (move_uploaded_file($file_tmp, $target_file)) {
                        $image_path = 'uploads/services/' . $new_filename;
                    }
                }
            }

            if (!empty($name) && $category_id > 0) {
                if ($srv_id > 0) {
                    // Update
                    $stmt = $pdo->prepare("
                        UPDATE services SET
                            service_code = ?,
                            category_id = ?,
                            subcategory_id = ?,
                            name = ?,
                            slug = ?,
                            featured_image = ?,
                            icon = ?,
                            short_description = ?,
                            description = ?,
                            govt_fee = ?,
                            prof_fee = ?,
                            other_charges = ?,
                            is_gst_applicable = ?,
                            gst_rate = ?,
                            final_price = ?,
                            is_discount_allowed = ?,
                            min_time = ?,
                            max_time = ?,
                            time_unit = ?,
                            expected_completion_time = ?,
                            processing_time = ?,
                            eligibility = ?,
                            terms = ?,
                            important_notes = ?,
                            status = ?,
                            is_featured = ?,
                            display_order = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        $service_code, $category_id, $subcategory_id, $name, $slug,
                        $image_path, $icon, $short_desc, $description,
                        $govt_fee, $prof_fee, $other_charges, $is_gst_applicable, $gst_rate,
                        $final_price, $is_discount_allowed, $min_time, $max_time, $time_unit,
                        $expected_time, $expected_time, $eligibility, $important_notes, $important_notes,
                        $status, $is_featured, $display_order, $srv_id
                    ]);
                    $target_service_id = $srv_id;
                    $msg = "Service '{$name}' updated successfully.";
                } else {
                    // Create New
                    if (empty($service_code)) {
                        $service_code = 'SRV-' . strtoupper(substr(uniqid(), -6));
                    }
                    $stmt = $pdo->prepare("
                        INSERT INTO services (
                            service_code, category_id, subcategory_id, name, slug,
                            featured_image, icon, short_description, description,
                            govt_fee, prof_fee, other_charges, is_gst_applicable, gst_rate,
                            final_price, is_discount_allowed, min_time, max_time, time_unit,
                            expected_completion_time, processing_time, eligibility, terms, important_notes,
                            status, is_featured, display_order
                        ) VALUES (
                            ?, ?, ?, ?, ?,
                            ?, ?, ?, ?,
                            ?, ?, ?, ?, ?,
                            ?, ?, ?, ?, ?,
                            ?, ?, ?, ?, ?,
                            ?, ?, ?
                        )
                    ");
                    $stmt->execute([
                        $service_code, $category_id, $subcategory_id, $name, $slug,
                        $image_path, $icon, $short_desc, $description,
                        $govt_fee, $prof_fee, $other_charges, $is_gst_applicable, $gst_rate,
                        $final_price, $is_discount_allowed, $min_time, $max_time, $time_unit,
                        $expected_time, $expected_time, $eligibility, $important_notes, $important_notes,
                        $status, $is_featured, $display_order
                    ]);
                    $target_service_id = (int)$pdo->lastInsertId();
                    $msg = "New service '{$name}' added successfully to catalog.";
                }

                // Handle Required Documents list
                if (isset($_POST['required_docs_list']) && is_array($_POST['required_docs_list'])) {
                    $pdo->prepare("DELETE FROM service_required_documents WHERE service_id = ?")->execute([$target_service_id]);
                    $d_order = 1;
                    $ins_doc = $pdo->prepare("INSERT INTO service_required_documents (service_id, document_name, is_mandatory, sort_order) VALUES (?, ?, ?, ?)");
                    foreach ($_POST['required_docs_list'] as $idx => $doc_item) {
                        $doc_title = trim(sanitize($doc_item));
                        if (!empty($doc_title)) {
                            $is_mand = isset($_POST['doc_mandatory'][$idx]) ? 1 : 0;
                            $ins_doc->execute([$target_service_id, $doc_title, $is_mand, $d_order]);
                            $d_order++;
                        }
                    }
                }
            } else {
                $msg = "Please provide Service Name and select a Category.";
                $msg_type = "danger";
            }
        }

        // --- 2. TOGGLE STATUS ---
        if ($action === 'toggle_status') {
            $srv_id = (int)($_POST['service_id'] ?? 0);
            $new_status = ($_POST['status'] ?? '') === 'active' ? 'active' : 'inactive';
            if ($srv_id > 0) {
                $pdo->prepare("UPDATE services SET status = ? WHERE id = ?")->execute([$new_status, $srv_id]);
                $msg = "Service status changed to {$new_status}.";
            }
        }

        // --- 3. DUPLICATE SERVICE ---
        if ($action === 'duplicate_service') {
            $srv_id = (int)($_POST['service_id'] ?? 0);
            $stmt = $pdo->prepare("SELECT * FROM services WHERE id = ?");
            $stmt->execute([$srv_id]);
            $source = $stmt->fetch();

            if ($source) {
                $new_code = 'CPY-' . strtoupper(substr(uniqid(), -6));
                $new_name = $source['name'] . ' (Copy)';
                $new_slug = $source['slug'] . '-copy-' . time();

                $ins = $pdo->prepare("
                    INSERT INTO services (
                        service_code, category_id, subcategory_id, name, slug,
                        featured_image, icon, short_description, description,
                        govt_fee, prof_fee, other_charges, is_gst_applicable, gst_rate,
                        final_price, is_discount_allowed, min_time, max_time, time_unit,
                        expected_completion_time, processing_time, eligibility, terms, important_notes,
                        status, is_featured, display_order
                    ) VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        'active', ?, ?
                    )
                ");
                $ins->execute([
                    $new_code, $source['category_id'], $source['subcategory_id'], $new_name, $new_slug,
                    $source['featured_image'], $source['icon'], $source['short_description'], $source['description'],
                    $source['govt_fee'], $source['prof_fee'], $source['other_charges'], $source['is_gst_applicable'], $source['gst_rate'],
                    $source['final_price'], $source['is_discount_allowed'], $source['min_time'], $source['max_time'], $source['time_unit'],
                    $source['expected_completion_time'], $source['processing_time'], $source['eligibility'], $source['terms'], $source['important_notes'],
                    $source['is_featured'], (int)$source['display_order'] + 1
                ]);
                $new_srv_id = (int)$pdo->lastInsertId();

                // Clone required docs
                $docs = $pdo->prepare("SELECT * FROM service_required_documents WHERE service_id = ?");
                $docs->execute([$srv_id]);
                $ins_doc = $pdo->prepare("INSERT INTO service_required_documents (service_id, document_name, description, is_mandatory, sort_order) VALUES (?, ?, ?, ?, ?)");
                foreach ($docs->fetchAll() as $d) {
                    $ins_doc->execute([$new_srv_id, $d['document_name'], $d['description'], $d['is_mandatory'], $d['sort_order']]);
                }
                $msg = "Service duplicated as '{$new_name}'.";
            }
        }

        // --- 4. DELETE SERVICE ---
        if ($action === 'delete_service') {
            $srv_id = (int)($_POST['service_id'] ?? 0);
            if ($srv_id > 0) {
                $pdo->prepare("DELETE FROM services WHERE id = ?")->execute([$srv_id]);
                $msg = "Service deleted successfully.";
            }
        }

        // --- 5. BULK ACTIONS ---
        if ($action === 'bulk_action') {
            $bulk_type = $_POST['bulk_type'] ?? '';
            $selected_ids = $_POST['selected_ids'] ?? [];
            if (!empty($selected_ids) && is_array($selected_ids)) {
                $in_placeholders = implode(',', array_fill(0, count($selected_ids), '?'));
                if ($bulk_type === 'activate') {
                    $stmt = $pdo->prepare("UPDATE services SET status = 'active' WHERE id IN ($in_placeholders)");
                    $stmt->execute($selected_ids);
                    $msg = count($selected_ids) . " services activated successfully.";
                } elseif ($bulk_type === 'deactivate') {
                    $stmt = $pdo->prepare("UPDATE services SET status = 'inactive' WHERE id IN ($in_placeholders)");
                    $stmt->execute($selected_ids);
                    $msg = count($selected_ids) . " services deactivated.";
                } elseif ($bulk_type === 'delete') {
                    $stmt = $pdo->prepare("DELETE FROM services WHERE id IN ($in_placeholders)");
                    $stmt->execute($selected_ids);
                    $msg = count($selected_ids) . " services permanently deleted.";
                }
            } else {
                $msg = "No services selected for bulk action.";
                $msg_type = "warning";
            }
        }
    }
}

// =========================================================================
// FILTERS & QUERY
// =========================================================================
$filter_cat = isset($_GET['cat']) ? (int)$_GET['cat'] : 0;
$filter_status = sanitize($_GET['status'] ?? '');
$filter_featured = sanitize($_GET['featured'] ?? '');
$search = sanitize($_GET['q'] ?? '');

$where_clauses = ["1=1"];
$params = [];

if ($filter_cat > 0) {
    $where_clauses[] = "(s.category_id = ? OR s.subcategory_id = ?)";
    $params[] = $filter_cat;
    $params[] = $filter_cat;
}
if (!empty($filter_status) && in_array($filter_status, ['active', 'inactive'])) {
    $where_clauses[] = "s.status = ?";
    $params[] = $filter_status;
}
if ($filter_featured === 'yes') {
    $where_clauses[] = "s.is_featured = 1";
} elseif ($filter_featured === 'no') {
    $where_clauses[] = "s.is_featured = 0";
}
if (!empty($search)) {
    $where_clauses[] = "(s.name LIKE ? OR s.service_code LIKE ? OR s.short_description LIKE ? OR sc.name LIKE ?)";
    $term = "%{$search}%";
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
}

$where_sql = implode(" AND ", $where_clauses);

// Fetch All Categories for dropdown & filter
$all_categories = [];
try {
    $all_categories = $pdo->query("
        SELECT id, parent_id, name, slug 
        FROM service_categories 
        ORDER BY COALESCE(parent_id, id) ASC, parent_id ASC, sort_order ASC, name ASC
    ")->fetchAll();
} catch (Throwable $e) {
    try {
        $all_categories = $pdo->query("SELECT id, name, slug FROM service_categories ORDER BY id ASC")->fetchAll();
    } catch (Throwable $e2) {}
}

$parent_categories = array_filter($all_categories, fn($c) => empty($c['parent_id'] ?? null));
$subcategories = array_filter($all_categories, fn($c) => !empty($c['parent_id'] ?? null));

// Fetch Services
$services = [];
try {
    $stmt = $pdo->prepare("
        SELECT s.*, 
               sc.name AS category_name,
               subc.name AS subcategory_name,
               (SELECT COUNT(*) FROM service_required_documents srd WHERE srd.service_id = s.id) AS doc_count
        FROM services s
        LEFT JOIN service_categories sc ON s.category_id = sc.id
        LEFT JOIN service_categories subc ON s.subcategory_id = subc.id
        WHERE {$where_sql}
        ORDER BY s.display_order ASC, s.id DESC
    ");
    $stmt->execute($params);
    $services = $stmt->fetchAll();
} catch (Throwable $e) {
    try {
        $stmt = $pdo->prepare("SELECT s.*, '' AS category_name, '' AS subcategory_name, 0 AS doc_count FROM services s WHERE {$where_sql} ORDER BY s.id DESC");
        $stmt->execute($params);
        $services = $stmt->fetchAll();
    } catch (Throwable $e2) {}
}

// Metrics Summary
$total_count = 0; $active_count = 0; $featured_count = 0;
try {
    $total_count = (int)$pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
    $active_count = (int)$pdo->query("SELECT COUNT(*) FROM services WHERE status = 'active'")->fetchColumn();
    $featured_count = (int)$pdo->query("SELECT COUNT(*) FROM services WHERE is_featured = 1")->fetchColumn();
} catch (Throwable $e) {}
$total_cats = count($parent_categories);
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1 small">
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/index.php">Dashboard</a></li>
                <li class="breadcrumb-item active" aria-current="page">Services & Documents Master</li>
            </ol>
        </nav>
        <h4 class="font-heading fw-bold mb-1">Services & Documents Master Catalog</h4>
        <p class="text-muted small mb-0">Configure services, statutory fees, professional charges, turnaround times & document requirements.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="service_categories.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-tags me-1"></i> Manage Categories
        </a>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#serviceModal" onclick="resetServiceForm()">
            <i class="bi bi-plus-lg me-1"></i> Add New Service
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

<!-- METRIC CARDS -->
<div class="row g-3 mb-4">
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-primary">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small fw-bold text-uppercase">Total Services</span>
                    <h3 class="fw-bold text-dark mb-0 mt-1"><?php echo $total_count; ?></h3>
                </div>
                <div class="bg-primary-subtle text-primary p-3 rounded-circle fs-4">
                    <i class="bi bi-collection-fill"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-success">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small fw-bold text-uppercase">Active Services</span>
                    <h3 class="fw-bold text-success mb-0 mt-1"><?php echo $active_count; ?></h3>
                </div>
                <div class="bg-success-subtle text-success p-3 rounded-circle fs-4">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-warning">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small fw-bold text-uppercase">Featured Services</span>
                    <h3 class="fw-bold text-warning mb-0 mt-1"><?php echo $featured_count; ?></h3>
                </div>
                <div class="bg-warning-subtle text-warning p-3 rounded-circle fs-4">
                    <i class="bi bi-star-fill"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-info">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small fw-bold text-uppercase">Main Categories</span>
                    <h3 class="fw-bold text-info mb-0 mt-1"><?php echo $total_cats; ?></h3>
                </div>
                <div class="bg-info-subtle text-info p-3 rounded-circle fs-4">
                    <i class="bi bi-folder-fill"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- FILTER & SEARCH BAR -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form method="GET" action="" class="row g-2 align-items-center">
        <div class="col-12 col-md-4">
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control bg-light border-start-0" placeholder="Search by name, code, description..." value="<?php echo htmlspecialchars($search); ?>">
            </div>
        </div>
        <div class="col-6 col-md-3">
            <select name="cat" class="form-select bg-light" onchange="this.form.submit()">
                <option value="">All Categories</option>
                <?php foreach ($parent_categories as $pcat): ?>
                    <option value="<?php echo $pcat['id']; ?>" <?php echo $filter_cat == $pcat['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($pcat['name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-6 col-md-2">
            <select name="status" class="form-select bg-light" onchange="this.form.submit()">
                <option value="">All Statuses</option>
                <option value="active" <?php echo $filter_status === 'active' ? 'selected' : ''; ?>>Active</option>
                <option value="inactive" <?php echo $filter_status === 'inactive' ? 'selected' : ''; ?>>Inactive</option>
            </select>
        </div>
        <div class="col-6 col-md-2">
            <select name="featured" class="form-select bg-light" onchange="this.form.submit()">
                <option value="">All Types</option>
                <option value="yes" <?php echo $filter_featured === 'yes' ? 'selected' : ''; ?>>Featured Only</option>
                <option value="no" <?php echo $filter_featured === 'no' ? 'selected' : ''; ?>>Non-Featured</option>
            </select>
        </div>
        <div class="col-6 col-md-1 d-flex gap-1">
            <button type="submit" class="btn btn-dark w-100 rounded-3"><i class="bi bi-funnel"></i></button>
            <?php if (!empty($search) || !empty($filter_cat) || !empty($filter_status) || !empty($filter_featured)): ?>
                <a href="<?php echo BASE_URL; ?>admin/service_master.php" class="btn btn-light rounded-3" title="Reset Filters"><i class="bi bi-x-lg"></i></a>
            <?php endif; ?>
        </div>
    </form>
</div>

<!-- SERVICES DATA TABLE WITH BULK ACTIONS -->
<form action="" method="POST" id="bulkActionForm">
    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
    <input type="hidden" name="action" value="bulk_action">

    <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <!-- Table Header & Bulk Controls -->
        <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="d-flex align-items-center gap-2">
                <div class="form-check me-2">
                    <input class="form-check-input" type="checkbox" id="selectAllCheckbox">
                </div>
                <div class="d-flex align-items-center gap-2">
                    <select name="bulk_type" class="form-select form-select-sm rounded-3" style="width: 170px;">
                        <option value="">Bulk Actions...</option>
                        <option value="activate">Set Active</option>
                        <option value="deactivate">Set Inactive</option>
                        <option value="delete">Delete Selected</option>
                    </select>
                    <button type="submit" class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="return confirm('Apply bulk action to selected items?');">Apply</button>
                </div>
            </div>
            <div class="text-muted small">
                Showing <strong><?php echo count($services); ?></strong> services
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th style="width: 40px;" class="ps-4"></th>
                        <th>Service / Code</th>
                        <th>Category</th>
                        <th class="text-end">Govt Fee</th>
                        <th class="text-end">Prof Fee</th>
                        <th class="text-end">Other</th>
                        <th class="text-end">GST</th>
                        <th class="text-end">Final Price</th>
                        <th>Timeline</th>
                        <th>Docs</th>
                        <th>Status</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($services)): ?>
                        <tr><td colspan="12" class="text-center py-5 text-muted">No services found matching your filters.</td></tr>
                    <?php else: ?>
                        <?php foreach ($services as $srv): ?>
                            <tr>
                                <td class="ps-4">
                                    <input type="checkbox" name="selected_ids[]" value="<?php echo $srv['id']; ?>" class="form-check-input service-check">
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="service-media-thumb rounded-3 bg-light d-flex align-items-center justify-content-center overflow-hidden border" style="width: 42px; height: 42px; flex-shrink: 0;">
                                            <?php if (!empty($srv['featured_image']) && file_exists(__DIR__ . '/../' . $srv['featured_image'])): ?>
                                                <img src="<?php echo BASE_URL . htmlspecialchars($srv['featured_image']); ?>" alt="Icon" class="w-100 h-100 object-fit-cover">
                                            <?php else: ?>
                                                <i class="bi <?php echo htmlspecialchars($srv['icon'] ?: 'bi-briefcase'); ?> text-primary fs-5"></i>
                                            <?php endif; ?>
                                        </div>
                                        <div>
                                            <div class="d-flex align-items-center gap-2">
                                                <strong class="text-dark"><?php echo htmlspecialchars($srv['name']); ?></strong>
                                                <?php if ($srv['is_featured']): ?>
                                                    <span class="badge bg-warning text-dark rounded-pill py-0 px-2 small" title="Featured Service"><i class="bi bi-star-fill"></i></span>
                                                <?php endif; ?>
                                            </div>
                                            <div class="d-flex align-items-center gap-2 small">
                                                <span class="badge bg-light text-secondary border px-1"><?php echo htmlspecialchars($srv['service_code'] ?: 'SRV-' . $srv['id']); ?></span>
                                                <span class="text-muted text-truncate d-inline-block" style="max-width: 250px;"><?php echo htmlspecialchars($srv['short_description']); ?></span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2">
                                        <?php echo htmlspecialchars($srv['category_name'] ?: 'General'); ?>
                                    </span>
                                    <?php if (!empty($srv['subcategory_name'])): ?>
                                        <small class="d-block text-muted"><?php echo htmlspecialchars($srv['subcategory_name']); ?></small>
                                    <?php endif; ?>
                                </td>
                                <td class="text-end fw-semibold text-secondary">
                                    <?php echo format_inr($srv['govt_fee']); ?>
                                </td>
                                <td class="text-end fw-semibold text-primary">
                                    <?php echo format_inr($srv['prof_fee']); ?>
                                </td>
                                <td class="text-end text-muted small">
                                    <?php echo $srv['other_charges'] > 0 ? format_inr($srv['other_charges']) : '-'; ?>
                                </td>
                                <td class="text-end text-muted small">
                                    <?php if ($srv['is_gst_applicable']): ?>
                                        <span class="badge bg-light text-dark border"><?php echo (float)$srv['gst_rate']; ?>%</span>
                                    <?php else: ?>
                                        <span class="text-muted">Exempt</span>
                                    <?php endif; ?>
                                </td>
                                <td class="text-end fw-bold text-success fs-6">
                                    <?php echo format_inr($srv['final_price']); ?>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark border rounded-pill px-2 small">
                                        <i class="bi bi-clock me-1 text-muted"></i><?php echo htmlspecialchars($srv['expected_completion_time'] ?: '3-5 Days'); ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2" title="<?php echo $srv['doc_count']; ?> required documents">
                                        <i class="bi bi-file-earmark-check me-1"></i><?php echo $srv['doc_count']; ?> docs
                                    </span>
                                </td>
                                <td>
                                    <form action="" method="POST" class="d-inline">
                                        <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                        <input type="hidden" name="action" value="toggle_status">
                                        <input type="hidden" name="service_id" value="<?php echo $srv['id']; ?>">
                                        <input type="hidden" name="status" value="<?php echo $srv['status'] === 'active' ? 'inactive' : 'active'; ?>">
                                        <button type="submit" class="btn btn-sm border-0 p-0 badge rounded-pill px-2 <?php echo $srv['status'] === 'active' ? 'bg-success' : 'bg-secondary'; ?>">
                                            <?php echo ucfirst($srv['status']); ?>
                                        </button>
                                    </form>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-light rounded-pill px-2" type="button" data-bs-toggle="dropdown">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                                            <li>
                                                <button type="button" class="dropdown-item py-2" onclick="loadServiceDetails(<?php echo $srv['id']; ?>)">
                                                    <i class="bi bi-pencil-square me-2 text-primary"></i> Edit Service
                                                </button>
                                            </li>
                                            <li>
                                                <form action="" method="POST" onsubmit="return confirm('Duplicate service <?php echo htmlspecialchars(addslashes($srv['name'])); ?>?');">
                                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                    <input type="hidden" name="action" value="duplicate_service">
                                                    <input type="hidden" name="service_id" value="<?php echo $srv['id']; ?>">
                                                    <button type="submit" class="dropdown-item py-2">
                                                        <i class="bi bi-copy me-2 text-info"></i> Duplicate Item
                                                    </button>
                                                </form>
                                            </li>
                                            <li><hr class="dropdown-divider my-1"></li>
                                            <li>
                                                <form action="" method="POST" onsubmit="return confirm('Permanently delete <?php echo htmlspecialchars(addslashes($srv['name'])); ?>?');">
                                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                    <input type="hidden" name="action" value="delete_service">
                                                    <input type="hidden" name="service_id" value="<?php echo $srv['id']; ?>">
                                                    <button type="submit" class="dropdown-item py-2 text-danger">
                                                        <i class="bi bi-trash me-2"></i> Delete
                                                    </button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</form>

<!-- ADD / EDIT SERVICE MODAL -->
<div class="modal fade" id="serviceModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom py-3 px-4 bg-light">
                <h5 class="modal-title font-heading fw-bold" id="serviceModalTitle">Add New Service / Document</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" enctype="multipart/form-data" id="serviceForm">
                <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                <input type="hidden" name="action" value="save_service">
                <input type="hidden" name="service_id" id="form_service_id" value="0">
                <input type="hidden" name="existing_image" id="form_existing_image" value="">

                <div class="modal-body p-4">
                    <ul class="nav nav-pills mb-4 border-bottom pb-2 gap-2" id="serviceModalTabs" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active rounded-pill fw-bold" id="general-tab" data-bs-toggle="pill" data-bs-target="#tab-general" type="button">1. General Information</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link rounded-pill fw-bold" id="pricing-tab" data-bs-toggle="pill" data-bs-target="#tab-pricing" type="button">2. Fee & Pricing Matrix</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link rounded-pill fw-bold" id="timeline-tab" data-bs-toggle="pill" data-bs-target="#tab-timeline" type="button">3. Turnaround & Timeline</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link rounded-pill fw-bold" id="docs-tab" data-bs-toggle="pill" data-bs-target="#tab-docs" type="button">4. Required Documents Checklist</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- TAB 1: GENERAL -->
                        <div class="tab-pane fade show active" id="tab-general">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Service Code / ID *</label>
                                    <input type="text" name="service_code" id="form_service_code" class="form-control rounded-3" placeholder="e.g. PVT-001 or auto">
                                    <small class="text-muted">Unique code for quick identification</small>
                                </div>
                                <div class="col-md-8">
                                    <label class="form-label small fw-bold">Service Name *</label>
                                    <input type="text" name="name" id="form_service_name" class="form-control rounded-3" required placeholder="e.g. Private Limited Company Registration">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Primary Category *</label>
                                    <select name="category_id" id="form_category_id" class="form-select rounded-3" required onchange="filterSubcategories()">
                                        <option value="">-- Select Category --</option>
                                        <?php foreach ($parent_categories as $pcat): ?>
                                            <option value="<?php echo $pcat['id']; ?>"><?php echo htmlspecialchars($pcat['name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Sub Category (Optional)</label>
                                    <select name="subcategory_id" id="form_subcategory_id" class="form-select rounded-3">
                                        <option value="">-- None / Select Sub Category --</option>
                                        <?php foreach ($subcategories as $scat): ?>
                                            <option value="<?php echo $scat['id']; ?>" data-parent="<?php echo $scat['parent_id']; ?>">
                                                <?php echo htmlspecialchars($scat['name']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Upload Service Image (From Computer)</label>
                                    <input type="file" name="service_image" id="form_service_image" class="form-control rounded-3" accept="image/*" onchange="previewUploadImage(this)">
                                    <small class="text-muted">JPG, PNG, WebP or SVG. Optional.</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Bootstrap Icon (Fallback / Alternate)</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light"><i class="bi bi-gear" id="serviceIconPreview"></i></span>
                                        <input type="text" name="icon" id="form_service_icon" class="form-control" value="bi-gear" placeholder="e.g. bi-shield-check">
                                    </div>
                                    <small class="text-muted">Used if no custom image is uploaded.</small>
                                </div>
                                <div class="col-12" id="imagePreviewContainer" style="display: none;">
                                    <label class="form-label small fw-bold">Image Preview</label>
                                    <div class="border p-2 rounded-3 text-center bg-light" style="max-width: 160px;">
                                        <img id="imagePreviewBox" src="" class="img-fluid rounded" style="max-height: 90px;">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Short Description</label>
                                    <input type="text" name="short_description" id="form_short_desc" class="form-control rounded-3" placeholder="Single-line concise description for cards and estimate summaries">
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Full Detailed Description</label>
                                    <textarea name="description" id="form_full_desc" class="form-control rounded-3" rows="3" placeholder="Full service features, scope of work, and process overview"></textarea>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check form-switch mt-4">
                                        <input class="form-check-input" type="checkbox" name="is_featured" id="form_is_featured" value="1">
                                        <label class="form-check-label fw-bold" for="form_is_featured">Featured Service</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Status</label>
                                    <select name="status" id="form_status" class="form-select rounded-3">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Display Order</label>
                                    <input type="number" name="display_order" id="form_display_order" class="form-control rounded-3" value="0">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2: PRICING -->
                        <div class="tab-pane fade" id="tab-pricing">
                            <div class="alert alert-info py-2 px-3 small rounded-3">
                                <i class="bi bi-info-circle-fill me-1"></i> Government/Statutory fees are kept separate from Professional Fees. Final Selling Price updates in real time.
                            </div>
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Government / Statutory Fee (₹)</label>
                                    <input type="number" step="0.01" name="govt_fee" id="price_govt_fee" class="form-control rounded-3" value="0.00" oninput="calcPriceMatrix()">
                                    <small class="text-muted">Statutory fees (e.g. MCA, Trademark, FSSAI)</small>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Our Service / Professional Fee (₹) *</label>
                                    <input type="number" step="0.01" name="prof_fee" id="price_prof_fee" class="form-control rounded-3" value="999.00" required oninput="calcPriceMatrix()">
                                    <small class="text-muted">Our consultation & filing charge</small>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Other Charges (₹)</label>
                                    <input type="number" step="0.01" name="other_charges" id="price_other_charges" class="form-control rounded-3" value="0.00" oninput="calcPriceMatrix()">
                                    <small class="text-muted">Stamp duty, tokens, affidavits, courier</small>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-check form-switch mt-4">
                                        <input class="form-check-input" type="checkbox" name="is_gst_applicable" id="price_gst_applicable" value="1" checked onchange="calcPriceMatrix()">
                                        <label class="form-check-label fw-bold" for="price_gst_applicable">GST Applicable</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">GST % Rate</label>
                                    <input type="number" step="0.01" name="gst_rate" id="price_gst_rate" class="form-control rounded-3" value="18.00" oninput="calcPriceMatrix()">
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check form-switch mt-4">
                                        <input class="form-check-input" type="checkbox" name="is_discount_allowed" id="price_discount_allowed" value="1" checked>
                                        <label class="form-check-label fw-bold" for="price_discount_allowed">Discount Allowed</label>
                                    </div>
                                </div>

                                <!-- PRICE PREVIEW SUMMARY CARD -->
                                <div class="col-12 mt-4">
                                    <div class="card bg-light border p-3 rounded-4">
                                        <h6 class="fw-bold mb-3 text-dark">Real-Time Price Breakdown:</h6>
                                        <div class="row text-center g-2">
                                            <div class="col-md-3 col-6">
                                                <small class="text-muted d-block">Govt Fee</small>
                                                <strong class="fs-6" id="summary_govt_fee">₹0.00</strong>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <small class="text-muted d-block">Professional + Other</small>
                                                <strong class="fs-6" id="summary_taxable">₹999.00</strong>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <small class="text-muted d-block">GST Amount</small>
                                                <strong class="fs-6 text-danger" id="summary_gst_amt">₹179.82</strong>
                                            </div>
                                            <div class="col-md-3 col-6 border-start">
                                                <small class="text-muted d-block fw-bold">Final Selling Price</small>
                                                <strong class="fs-5 text-success" id="summary_final_price">₹1,178.82</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 3: TIMELINE & NOTES -->
                        <div class="tab-pane fade" id="tab-timeline">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Minimum Time</label>
                                    <input type="number" name="min_time" id="form_min_time" class="form-control rounded-3" value="3" oninput="updateExpectedTimeString()">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Maximum Time</label>
                                    <input type="number" name="max_time" id="form_max_time" class="form-control rounded-3" value="5" oninput="updateExpectedTimeString()">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Time Unit</label>
                                    <select name="time_unit" id="form_time_unit" class="form-select rounded-3" onchange="updateExpectedTimeString()">
                                        <option value="Hours">Hours</option>
                                        <option value="Days">Days</option>
                                        <option value="Working Days" selected>Working Days</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Expected Completion Time Label</label>
                                    <input type="text" name="expected_completion_time" id="form_expected_time" class="form-control rounded-3" value="3–5 Working Days">
                                    <small class="text-muted">This label is printed directly on Estimates and client quotations.</small>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Eligibility / Pre-requisites</label>
                                    <textarea name="eligibility" id="form_eligibility" class="form-control rounded-3" rows="2" placeholder="e.g. Minimum 18 years of age, valid PAN and Aadhaar"></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Important Notes & Disclaimers</label>
                                    <textarea name="important_notes" id="form_important_notes" class="form-control rounded-3" rows="2" placeholder="Statutory notes, department verification disclaimers, etc."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 4: REQUIRED DOCUMENTS CHECKLIST -->
                        <div class="tab-pane fade" id="tab-docs">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark">Required Documents Checklist</h6>
                                    <small class="text-muted">These documents automatically load when this service is added to an Estimate.</small>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-primary rounded-pill fw-bold" onclick="addDocumentRow()">
                                    <i class="bi bi-plus-lg me-1"></i> Add Document
                                </button>
                            </div>

                            <div class="border rounded-4 p-3 bg-light" id="documentsListContainer">
                                <!-- Dynamic Document Rows -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top py-3 px-4 bg-light">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm">Save Service Item</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Filter Subcategories by Parent Category
function filterSubcategories() {
    const parentId = document.getElementById('form_category_id').value;
    const subcatSelect = document.getElementById('form_subcategory_id');
    const options = subcatSelect.querySelectorAll('option');

    options.forEach(opt => {
        if (!opt.value) {
            opt.style.display = '';
            return;
        }
        const optParent = opt.getAttribute('data-parent');
        if (!parentId || optParent == parentId) {
            opt.style.display = '';
        } else {
            opt.style.display = 'none';
        }
    });
}

// Real-Time Price Matrix Calculation
function calcPriceMatrix() {
    const govt = parseFloat(document.getElementById('price_govt_fee').value) || 0;
    const prof = parseFloat(document.getElementById('price_prof_fee').value) || 0;
    const other = parseFloat(document.getElementById('price_other_charges').value) || 0;
    const isGst = document.getElementById('price_gst_applicable').checked;
    const gstRate = isGst ? (parseFloat(document.getElementById('price_gst_rate').value) || 0) : 0;

    const taxable = prof + other;
    const gstAmt = (taxable * gstRate) / 100;
    const finalPrice = govt + taxable + gstAmt;

    document.getElementById('summary_govt_fee').innerText = '₹' + govt.toFixed(2);
    document.getElementById('summary_taxable').innerText = '₹' + taxable.toFixed(2);
    document.getElementById('summary_gst_amt').innerText = '₹' + gstAmt.toFixed(2);
    document.getElementById('summary_final_price').innerText = '₹' + finalPrice.toFixed(2);
}

// Turnaround time string auto generator
function updateExpectedTimeString() {
    const min = document.getElementById('form_min_time').value || 1;
    const max = document.getElementById('form_max_time').value || 1;
    const unit = document.getElementById('form_time_unit').value || 'Working Days';
    document.getElementById('form_expected_time').value = `${min}–${max} ${unit}`;
}

// Image upload preview
function previewUploadImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreviewBox').src = e.target.result;
            document.getElementById('imagePreviewContainer').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Dynamic Document Rows
function addDocumentRow(title = '', isMandatory = 1) {
    const container = document.getElementById('documentsListContainer');
    const idx = container.children.length;
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center gap-2 mb-2 p-2 bg-white rounded-3 border';
    div.innerHTML = `
        <span class="text-muted fw-bold small px-2">#${idx + 1}</span>
        <input type="text" name="required_docs_list[]" class="form-control form-control-sm" placeholder="Document Name (e.g. Aadhaar Card, PAN)" value="${escapeHtml(title)}" required>
        <div class="form-check form-switch ms-2 text-nowrap">
            <input class="form-check-input" type="checkbox" name="doc_mandatory[${idx}]" value="1" ${isMandatory ? 'checked' : ''}>
            <label class="form-check-label small">Mandatory</label>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger border-0 rounded-circle" onclick="this.parentElement.remove()">
            <i class="bi bi-x-lg"></i>
        </button>
    `;
    container.appendChild(div);
}

function escapeHtml(text) {
    return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function resetServiceForm() {
    document.getElementById('serviceModalTitle').innerText = 'Add New Service / Document';
    document.getElementById('form_service_id').value = '0';
    document.getElementById('form_existing_image').value = '';
    document.getElementById('form_service_code').value = '';
    document.getElementById('form_service_name').value = '';
    document.getElementById('form_category_id').value = '';
    document.getElementById('form_subcategory_id').value = '';
    document.getElementById('form_service_image').value = '';
    document.getElementById('form_service_icon').value = 'bi-gear';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('form_short_desc').value = '';
    document.getElementById('form_full_desc').value = '';
    document.getElementById('price_govt_fee').value = '0.00';
    document.getElementById('price_prof_fee').value = '999.00';
    document.getElementById('price_other_charges').value = '0.00';
    document.getElementById('price_gst_applicable').checked = true;
    document.getElementById('price_gst_rate').value = '18.00';
    document.getElementById('price_discount_allowed').checked = true;
    document.getElementById('form_min_time').value = '3';
    document.getElementById('form_max_time').value = '5';
    document.getElementById('form_time_unit').value = 'Working Days';
    document.getElementById('form_expected_time').value = '3–5 Working Days';
    document.getElementById('form_eligibility').value = '';
    document.getElementById('form_important_notes').value = '';
    document.getElementById('form_is_featured').checked = false;
    document.getElementById('form_status').value = 'active';
    document.getElementById('form_display_order').value = '0';
    
    // Clear documents and add default rows
    document.getElementById('documentsListContainer').innerHTML = '';
    addDocumentRow('Aadhaar Card', 1);
    addDocumentRow('PAN Card', 1);

    calcPriceMatrix();
    filterSubcategories();
}

// Fetch and load service for editing
function loadServiceDetails(serviceId) {
    fetch('<?php echo BASE_URL; ?>admin/service_master.php?ajax=get_service&id=' + serviceId)
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                const s = data.service;
                document.getElementById('serviceModalTitle').innerText = 'Edit Service: ' + s.name;
                document.getElementById('form_service_id').value = s.id;
                document.getElementById('form_existing_image').value = s.featured_image || '';
                document.getElementById('form_service_code').value = s.service_code || '';
                document.getElementById('form_service_name').value = s.name || '';
                document.getElementById('form_category_id').value = s.category_id || '';
                filterSubcategories();
                document.getElementById('form_subcategory_id').value = s.subcategory_id || '';
                document.getElementById('form_service_icon').value = s.icon || 'bi-gear';
                
                if (s.featured_image) {
                    document.getElementById('imagePreviewBox').src = '<?php echo BASE_URL; ?>' + s.featured_image;
                    document.getElementById('imagePreviewContainer').style.display = 'block';
                } else {
                    document.getElementById('imagePreviewContainer').style.display = 'none';
                }

                document.getElementById('form_short_desc').value = s.short_description || '';
                document.getElementById('form_full_desc').value = s.description || '';
                document.getElementById('price_govt_fee').value = parseFloat(s.govt_fee || 0).toFixed(2);
                document.getElementById('price_prof_fee').value = parseFloat(s.prof_fee || 0).toFixed(2);
                document.getElementById('price_other_charges').value = parseFloat(s.other_charges || 0).toFixed(2);
                document.getElementById('price_gst_applicable').checked = (s.is_gst_applicable == 1);
                document.getElementById('price_gst_rate').value = parseFloat(s.gst_rate || 18).toFixed(2);
                document.getElementById('price_discount_allowed').checked = (s.is_discount_allowed == 1);
                document.getElementById('form_min_time').value = s.min_time || 1;
                document.getElementById('form_max_time').value = s.max_time || 3;
                document.getElementById('form_time_unit').value = s.time_unit || 'Working Days';
                document.getElementById('form_expected_time').value = s.expected_completion_time || '';
                document.getElementById('form_eligibility').value = s.eligibility || '';
                document.getElementById('form_important_notes').value = s.important_notes || '';
                document.getElementById('form_is_featured').checked = (s.is_featured == 1);
                document.getElementById('form_status').value = s.status || 'active';
                document.getElementById('form_display_order').value = s.display_order || 0;

                // Load docs
                const container = document.getElementById('documentsListContainer');
                container.innerHTML = '';
                if (data.docs && data.docs.length > 0) {
                    data.docs.forEach(d => addDocumentRow(d.document_name, d.is_mandatory == 1));
                } else {
                    addDocumentRow('Aadhaar Card', 1);
                }

                calcPriceMatrix();
                const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
                modal.show();
            }
        });
}

// Select All Checkbox Handler
document.getElementById('selectAllCheckbox')?.addEventListener('change', function() {
    const checks = document.querySelectorAll('.service-check');
    checks.forEach(c => c.checked = this.checked);
});
</script>

<?php
// Handle AJAX get_service request
if (isset($_GET['ajax']) && $_GET['ajax'] === 'get_service') {
    ob_clean();
    header('Content-Type: application/json');
    $get_id = (int)($_GET['id'] ?? 0);
    $srv = $pdo->prepare("SELECT * FROM services WHERE id = ?");
    $srv->execute([$get_id]);
    $service_row = $srv->fetch(PDO::FETCH_ASSOC);

    if ($service_row) {
        $docs_stmt = $pdo->prepare("SELECT * FROM service_required_documents WHERE service_id = ? ORDER BY sort_order ASC");
        $docs_stmt->execute([$get_id]);
        $docs_rows = $docs_stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => true, 'service' => $service_row, 'docs' => $docs_rows]);
    } else {
        echo json_encode(['status' => false, 'message' => 'Service not found']);
    }
    exit;
}
?>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
