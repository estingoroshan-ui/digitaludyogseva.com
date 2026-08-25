<?php
$page_title = "Business Ecosystem & Product Hub | Franchise ERP";
$active_menu = "ecosystem";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$msg = '';
$error = '';

// Handle New Ecosystem Request Submission by Franchise
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_eco_request') {
    verify_csrf_token($_POST['csrf_token'] ?? '');
    
    $customer_id = intval($_POST['customer_id'] ?? 0);
    $category_type = $_POST['category_type'] ?? 'machinery';
    $title = trim($_POST['title'] ?? '');
    $requirement_details = trim($_POST['requirement_details'] ?? '');
    $budget_estimate = floatval($_POST['budget_estimate'] ?? 0);
    
    if ($customer_id > 0 && $title !== '') {
        try {
            $stmt = $pdo->prepare("INSERT INTO ecosystem_requirements (customer_id, franchise_id, category_type, title, requirement_details, budget_estimate, status) VALUES (?, ?, ?, ?, ?, ?, 'new')");
            $stmt->execute([$customer_id, $franchise_id, $category_type, $title, $requirement_details, $budget_estimate]);
            $msg = "Client requirement logged successfully in Ecosystem Hub!";
        } catch (Exception $e) {
            $error = "Error submitting requirement: " . $e->getMessage();
        }
    } else {
        $error = "Please select a client and enter requirement details.";
    }
}

// Fetch franchise customers
$customers = [];
try {
    $c_stmt = $pdo->prepare("SELECT id, name, customer_code, mobile FROM customers ORDER BY name ASC");
    $c_stmt->execute();
    $customers = $c_stmt->fetchAll();
} catch (Exception $e) {}
?>

<div class="content-wrapper p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-1"><i class="bi bi-shop text-primary me-2"></i>Business Ecosystem & Product Center</h4>
            <p class="text-muted fs-7 mb-0">Expand your Kendra revenue beyond consultancy — supply Machinery, Raw Materials & Manpower to local clients.</p>
        </div>
        <button class="btn btn-primary fw-bold" data-bs-toggle="modal" data-bs-target="#newEcoModal">
            <i class="bi bi-plus-lg me-1"></i>Log Client Requirement
        </button>
    </div>

    <?php if ($msg): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i><?php echo htmlspecialchars($msg); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i><?php echo htmlspecialchars($error); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- Category Feature Cards -->
    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <div class="d-flex align-items-center">
                    <div class="bg-soft-primary p-3 rounded-3 text-primary fs-2 me-3"><i class="bi bi-gear-wide-connected"></i></div>
                    <div>
                        <h6 class="fw-bold mb-1">Industrial Machinery</h6>
                        <small class="text-muted d-block mb-2">Food Processing, Flour Mill, Packaging & Oil Mill Equipment</small>
                        <span class="badge bg-success">Up to 5% Margin</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <div class="d-flex align-items-center">
                    <div class="bg-soft-warning p-3 rounded-3 text-warning fs-2 me-3"><i class="bi bi-box-seam"></i></div>
                    <div>
                        <h6 class="fw-bold mb-1">Food Raw Materials</h6>
                        <small class="text-muted d-block mb-2">Besan, Grains, Flour & Commercial Agro Commodities</small>
                        <span class="badge bg-primary">Bulk Recurring Supply</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <div class="d-flex align-items-center">
                    <div class="bg-soft-info p-3 rounded-3 text-info fs-2 me-3"><i class="bi bi-people"></i></div>
                    <div>
                        <h6 class="fw-bold mb-1">Manpower Recruitment</h6>
                        <small class="text-muted d-block mb-2">Factory Operators, Accountants, Machine Technicians</small>
                        <span class="badge bg-secondary">Placement Referral</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal: Log Ecosystem Request -->
<div class="modal fade" id="newEcoModal" tabindex="-1">
    <div class="modal-dialog">
        <form method="POST" class="modal-content">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            <input type="hidden" name="action" value="create_eco_request">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Log Client Requirement</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Select Client</label>
                    <select name="customer_id" class="form-select" required>
                        <option value="">-- Choose Client --</option>
                        <?php foreach ($customers as $c): ?>
                            <option value="<?php echo $c['id']; ?>"><?php echo htmlspecialchars($c['name']); ?> (<?php echo htmlspecialchars($c['mobile']); ?>)</option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Product Category</label>
                    <select name="category_type" class="form-select">
                        <option value="machinery">Machinery & Plant Setup</option>
                        <option value="raw_material">Food / Industrial Raw Material</option>
                        <option value="manpower">Staff & Manpower Hiring</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Requirement Title</label>
                    <input type="text" name="title" class="form-control" placeholder="e.g. 5HP Automated Atta Mill Machine" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Estimated Budget (₹)</label>
                    <input type="number" name="budget_estimate" class="form-control" placeholder="350000" min="0" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Detailed Specification</label>
                    <textarea name="requirement_details" class="form-control" rows="3" placeholder="Specify brand preference, capacity, timeline, and delivery address."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary fw-bold">Submit to HO Hub</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
