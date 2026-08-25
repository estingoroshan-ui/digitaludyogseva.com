<?php
$page_title = "Dynamic Service Management CMS";
$active_menu = "services";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

// Handle Create / Edit Service
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'save_service') {
        $cat_id = (int)$_POST['category_id'];
        $name = sanitize($_POST['name']);
        $slug = sanitize($_POST['slug']);
        $short_desc = sanitize($_POST['short_description']);
        $desc = sanitize($_POST['description']);
        $govt_fee = (float)$_POST['govt_fee'];
        $prof_fee = (float)$_POST['prof_fee'];
        $gst_rate = (float)$_POST['gst_rate'];
        $franchise_comm = (float)$_POST['franchise_commission_value'];
        $proc_time = sanitize($_POST['processing_time']);
        $required_docs = sanitize($_POST['required_docs']);
        
        $gst_amount = ($prof_fee * $gst_rate) / 100;
        $final_price = $govt_fee + $prof_fee + $gst_amount;

        $ins = $pdo->prepare("
            INSERT INTO services (
                category_id, name, slug, short_description, description,
                govt_fee, prof_fee, gst_rate, final_price, franchise_commission_value,
                processing_time, required_docs, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ");
        $ins->execute([
            $cat_id, $name, $slug, $short_desc, $desc,
            $govt_fee, $prof_fee, $gst_rate, $final_price, $franchise_comm,
            $proc_time, $required_docs
        ]);

        $msg = '<div class="alert alert-success fw-bold">New Service added to dynamic catalog successfully!</div>';
    }
}

// Fetch categories & services
$categories = $pdo->query("SELECT * FROM service_categories ORDER BY id ASC")->fetchAll();
$services = $pdo->query("
    SELECT s.*, sc.name AS category_name
    FROM services s
    JOIN service_categories sc ON s.category_id = sc.id
    ORDER BY s.id DESC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Dynamic Service Management CMS</h4>
        <p class="text-muted small mb-0">Manage services, categories, fees, franchise commissions & required documents.</p>
    </div>
    <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#newServiceModal">
        <i class="bi bi-plus-lg me-1"></i> Add New Service
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Icon</th>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Govt Fee</th>
                    <th>Prof Fee</th>
                    <th>Final Price</th>
                    <th>Franchise Comm</th>
                    <th>Processing Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($services as $srv): ?>
                    <tr>
                        <td class="fs-4 text-primary"><i class="bi <?php echo htmlspecialchars($srv['icon']); ?>"></i></td>
                        <td>
                            <strong class="d-block text-dark"><?php echo htmlspecialchars($srv['name']); ?></strong>
                            <small class="text-muted"><?php echo htmlspecialchars($srv['slug']); ?></small>
                        </td>
                        <td><span class="badge bg-secondary"><?php echo htmlspecialchars($srv['category_name']); ?></span></td>
                        <td><?php echo format_inr($srv['govt_fee']); ?></td>
                        <td><?php echo format_inr($srv['prof_fee']); ?></td>
                        <td class="fw-bold text-primary fs-6"><?php echo format_inr($srv['final_price']); ?></td>
                        <td class="fw-bold text-success"><?php echo format_inr($srv['franchise_commission_value']); ?></td>
                        <td><small><?php echo htmlspecialchars($srv['processing_time']); ?></small></td>
                        <td><span class="badge bg-success"><?php echo htmlspecialchars($srv['status']); ?></span></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW SERVICE MODAL -->
<div class="modal fade" id="newServiceModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Add New Service</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="save_service">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Category *</label>
                            <select name="category_id" class="form-control" required>
                                <?php foreach ($categories as $cat): ?>
                                    <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Service Name *</label>
                            <input type="text" name="name" class="form-control" required placeholder="e.g. ISO 9001 Certification">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">URL Slug *</label>
                            <input type="text" name="slug" class="form-control" required placeholder="e.g. iso-9001-certification">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Processing Time</label>
                            <input type="text" name="processing_time" class="form-control" value="3-5 Business Days">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">Govt Fee (₹)</label>
                            <input type="number" name="govt_fee" class="form-control" value="0.00">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">Prof Fee (₹)</label>
                            <input type="number" name="prof_fee" class="form-control" value="1499.00">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold">GST Rate (%)</label>
                            <input type="number" name="gst_rate" class="form-control" value="18.00">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Franchise Commission (₹)</label>
                            <input type="number" name="franchise_commission_value" class="form-control" value="400.00">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Short Description</label>
                            <input type="text" name="short_description" class="form-control" placeholder="Short line summary">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Required Documents List</label>
                            <textarea name="required_docs" class="form-control" rows="2" placeholder="e.g. Aadhaar Card, PAN, Passport Photo, Rent Agreement"></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Full Service Description</label>
                            <textarea name="description" class="form-control" rows="3" placeholder="Full service details..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Service</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
