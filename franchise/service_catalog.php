<?php
$page_title = "Searchable Service Catalog (14 Categories)";
$active_menu = "catalog";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;

$q = trim($_GET['q'] ?? '');
$cat_id = $_GET['category_id'] ?? '';

$categories = $pdo->query("SELECT * FROM service_categories WHERE status = 'active' ORDER BY sort_order ASC")->fetchAll();

$where = ["s.status = 'active'"];
$params = [];

if (!empty($q)) {
    $where[] = "(s.name LIKE ? OR s.short_description LIKE ?)";
    $qp = "%{$q}%";
    $params = [$qp, $qp];
}

if (!empty($cat_id)) {
    $where[] = "s.category_id = ?";
    $params[] = (int)$cat_id;
}

$where_sql = "WHERE " . implode(" AND ", $where);
$services = $pdo->prepare("SELECT s.*, sc.name AS category_name FROM services s JOIN service_categories sc ON s.category_id = sc.id {$where_sql} ORDER BY sc.sort_order ASC, s.name ASC");
$services->execute($params);
$catalog = $services->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Service Catalog (14 Categories)</h4>
        <p class="text-muted small mb-0">Browse legal, tax, compliance, and government loan consultancy services. Check statutory vs professional fees & franchise commissions.</p>
    </div>
    <a href="new_application.php" class="btn btn-warning btn-sm rounded-pill fw-bold text-dark px-4 shadow">
        <i class="bi bi-lightning-charge-fill me-1"></i> 5-Step Application Wizard
    </a>
</div>

<!-- SEARCH BAR & CATEGORY TABS -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
    <form action="" method="GET" class="row g-2 align-items-center">
        <div class="col-md-6">
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control border-start-0" placeholder="Search service name (e.g. GST, FSSAI, ITR, Udyam)..." value="<?php echo htmlspecialchars($q); ?>">
            </div>
        </div>
        <div class="col-md-4">
            <select name="category_id" class="form-select">
                <option value="">All 14 Service Categories</option>
                <?php foreach ($categories as $cat): ?>
                    <option value="<?php echo $cat['id']; ?>" <?php echo $cat_id == $cat['id'] ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($cat['name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-2 d-flex gap-2">
            <button type="submit" class="btn btn-primary rounded-pill w-100 fw-bold">Search</button>
            <a href="service_catalog.php" class="btn btn-outline-secondary rounded-pill w-100">Reset</a>
        </div>
    </form>
</div>

<!-- SERVICE CATALOG CARDS GRID -->
<div class="row g-4 mb-4">
    <?php if (empty($catalog)): ?>
        <div class="col-12"><div class="alert alert-info fw-bold text-center">No services found matching current search.</div></div>
    <?php else: ?>
        <?php foreach ($catalog as $srv): ?>
            <div class="col-xl-4 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-light text-dark border fs-7"><?php echo htmlspecialchars($srv['category_name']); ?></span>
                            <span class="badge bg-success-subtle text-success font-monospace fw-bold fs-7">
                                Earn Commission: ₹<?php echo format_inr($srv['franchise_commission_value']); ?>
                            </span>
                        </div>
                        <h5 class="font-heading fw-bold text-dark mb-2"><?php echo htmlspecialchars($srv['name']); ?></h5>
                        <p class="text-secondary small mb-3"><?php echo htmlspecialchars($srv['short_description']); ?></p>

                        <!-- Fee Structure Breakdown -->
                        <div class="bg-light p-3 rounded-3 mb-3 small">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="text-muted">Govt / Statutory Fee:</span>
                                <span class="fw-bold text-dark"><?php echo format_inr($srv['govt_fee']); ?></span>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span class="text-muted">Professional Service Fee:</span>
                                <span class="fw-bold text-dark"><?php echo format_inr($srv['prof_fee']); ?></span>
                            </div>
                            <div class="d-flex justify-content-between border-top pt-1 mt-1">
                                <span class="fw-bold text-dark">Total Selling Price:</span>
                                <strong class="text-primary fs-6"><?php echo format_inr($srv['final_price']); ?></strong>
                            </div>
                        </div>

                        <div class="small text-muted mb-3">
                            <i class="bi bi-clock me-1 text-primary"></i> SLA: <strong><?php echo htmlspecialchars($srv['processing_time']); ?></strong>
                        </div>
                    </div>

                    <a href="new_application.php?service_id=<?php echo $srv['id']; ?>" class="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm">
                        Start Application <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
