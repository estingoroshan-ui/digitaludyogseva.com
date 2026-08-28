<?php
$page_title = "Global CRM Search Results";
$active_menu = "dashboard";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/GlobalSearch.php';

$query = trim($_GET['q'] ?? '');
$results = $query ? GlobalSearch::search($query, 30) : [];
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-search text-primary me-2"></i> Global Search Results</h4>
        <p class="text-muted small mb-0">Showing search results across Customers, Leads, Projects, Loan Applications, and Staff.</p>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
    <form action="search.php" method="GET" class="row g-2">
        <div class="col-md-10">
            <div class="input-group input-group-lg">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" name="q" class="form-control bg-light border-start-0 fs-6" value="<?php echo htmlspecialchars($query); ?>" placeholder="Type keyword, name, mobile, email, code...">
            </div>
        </div>
        <div class="col-md-2">
            <button type="submit" class="btn btn-primary btn-lg w-100 rounded-3 fw-bold fs-6">Search CRM</button>
        </div>
    </form>
</div>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <h6 class="fw-bold text-muted text-uppercase mb-3 fs-7">Results Found (<?php echo count($results); ?>)</h6>
    
    <?php if (empty($results)): ?>
        <div class="text-center py-5">
            <i class="bi bi-search-heart fs-1 text-muted d-block mb-3"></i>
            <h5 class="fw-bold text-dark">No records found</h5>
            <p class="text-muted small">Try searching with a different name, lead code, phone number, or email address.</p>
        </div>
    <?php else: ?>
        <div class="list-group list-group-flush">
            <?php foreach ($results as $res): ?>
                <a href="<?php echo htmlspecialchars($res['url']); ?>" class="list-group-item list-group-item-action p-3 rounded-3 mb-2 border">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-primary-subtle text-primary p-3 rounded-circle fs-5 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
                                <i class="bi <?php echo htmlspecialchars($res['icon']); ?>"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold text-dark mb-1"><?php echo htmlspecialchars($res['title']); ?></h6>
                                <p class="text-muted small mb-0"><?php echo htmlspecialchars($res['subtitle']); ?></p>
                            </div>
                        </div>
                        <div>
                            <span class="badge bg-light text-dark border px-3 py-2 fw-bold"><?php echo htmlspecialchars($res['category']); ?></span>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
