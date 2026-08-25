<?php
$page_title = "Business Legal Services & Compliance Catalog | Digital Udyog Seva";
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

global $pdo;

$q = trim($_GET['q'] ?? '');
$cat_slug = $_GET['category'] ?? '';

$categories = $pdo->query("SELECT * FROM service_categories WHERE status = 'active' ORDER BY sort_order ASC")->fetchAll();

$where = ["s.status = 'active'"];
$params = [];

if (!empty($q)) {
    $where[] = "(s.name LIKE ? OR s.short_description LIKE ?)";
    $qp = "%{$q}%";
    $params = [$qp, $qp];
}

if (!empty($cat_slug)) {
    $where[] = "sc.slug = ?";
    $params[] = $cat_slug;
}

$where_sql = "WHERE " . implode(" AND ", $where);
$services = $pdo->prepare("
    SELECT s.*, sc.name AS category_name, sc.slug AS category_slug
    FROM services s
    JOIN service_categories sc ON s.category_id = sc.id
    {$where_sql}
    ORDER BY sc.sort_order ASC, s.name ASC
");
$services->execute($params);
$catalog = $services->fetchAll();
?>

<!-- HERO BANNER -->
<div class="hero-wrapper py-5">
    <div class="container text-center max-w-900 mx-auto">
        <div class="hero-badge mb-3">50+ Services Catalog</div>
        <h1 class="hero-title">Business Legal Services & Compliance</h1>
        <p class="hero-subtitle mx-auto mb-4">
            Explore company registration, GST filing, trademark protection, food licensing, and government loan consultancy services. Transparent pricing with statutory & professional fee breakdown.
        </p>

        <!-- SEARCH BAR -->
        <div class="max-w-600 mx-auto">
            <form action="" method="GET" class="d-flex gap-2">
                <input type="text" name="q" class="form-control form-control-lg rounded-pill px-4" placeholder="Search service name (e.g. GST, FSSAI, ITR, Udyam)..." value="<?php echo htmlspecialchars($q); ?>">
                <button type="submit" class="dus-btn dus-btn-accent text-nowrap">Search</button>
            </form>
        </div>
    </div>
</div>

<!-- CATEGORY TABS -->
<div class="bg-white py-3 border-bottom sticky-top" style="top:70px; z-index:1020;">
    <div class="container d-flex align-items-center gap-2 overflow-x-auto pb-1">
        <a href="services.php" class="dus-btn fs-7 py-2 px-3 <?php echo empty($cat_slug) ? 'dus-btn-primary' : 'dus-btn-outline-dark'; ?>">
            All Services
        </a>
        <?php foreach ($categories as $cat): ?>
            <a href="services.php?category=<?php echo $cat['slug']; ?>" class="dus-btn fs-7 py-2 px-3 <?php echo $cat_slug === $cat['slug'] ? 'dus-btn-primary' : 'dus-btn-outline-dark'; ?>">
                <i class="bi <?php echo htmlspecialchars($cat['icon']); ?> me-1"></i> <?php echo htmlspecialchars($cat['name']); ?>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<!-- SERVICES CARDS GRID -->
<div class="dus-section">
    <div class="container">
        <div class="row g-4">
            <?php if (empty($catalog)): ?>
                <div class="col-12"><div class="alert alert-info fw-bold text-center py-4">No services found matching current search.</div></div>
            <?php else: ?>
                <?php foreach ($catalog as $srv): ?>
                    <div class="col-xl-4 col-md-6">
                        <div class="dus-service-card">
                            <div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="badge bg-light text-dark border fs-7"><?php echo htmlspecialchars($srv['category_name']); ?></span>
                                    <small class="text-muted"><i class="bi bi-clock me-1"></i> <?php echo htmlspecialchars($srv['processing_time']); ?></small>
                                </div>

                                <h3 class="dus-service-title"><?php echo htmlspecialchars($srv['name']); ?></h3>
                                <p class="text-muted small mb-4"><?php echo htmlspecialchars($srv['short_description']); ?></p>

                                <div class="bg-light p-3 rounded-3 mb-4 small border">
                                    <div class="d-flex justify-content-between mb-1">
                                        <span class="text-muted">Govt Statutory Fee:</span>
                                        <span class="fw-bold text-dark"><?php echo format_inr($srv['govt_fee']); ?></span>
                                    </div>
                                    <div class="d-flex justify-content-between mb-1">
                                        <span class="text-muted">Professional Fee:</span>
                                        <span class="fw-bold text-dark"><?php echo format_inr($srv['prof_fee']); ?></span>
                                    </div>
                                    <div class="d-flex justify-content-between border-top pt-2 mt-1">
                                        <span class="fw-bold text-dark">Total Selling Fee:</span>
                                        <strong class="text-primary fs-5"><?php echo format_inr($srv['final_price']); ?></strong>
                                    </div>
                                </div>
                            </div>

                            <a href="service.php?slug=<?php echo htmlspecialchars($srv['slug']); ?>" class="dus-btn dus-btn-accent w-100">
                                Apply Now <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
