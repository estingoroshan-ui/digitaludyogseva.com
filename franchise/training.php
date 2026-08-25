<?php
$page_title = "Training Center & Help Guides | Franchise Portal";
$active_menu = "training";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;
$materials = $pdo->query("SELECT * FROM training_materials WHERE status = 'active' ORDER BY id ASC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Franchise Training Center & Learning Guides</h4>
        <p class="text-muted small mb-0">Watch step-by-step video tutorials and learn how to manage clients, submit applications, and earn commissions.</p>
    </div>
</div>

<div class="row g-4 mb-4">
    <?php foreach ($materials as $m): ?>
        <div class="col-md-6 col-xl-4">
            <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100">
                <div class="ratio ratio-16x9">
                    <iframe src="<?php echo htmlspecialchars($m['video_url']); ?>" title="<?php echo htmlspecialchars($m['title']); ?>" allowfullscreen></iframe>
                </div>
                <div class="card-body p-4">
                    <span class="badge bg-light text-dark border fs-7 mb-2"><?php echo htmlspecialchars($m['category']); ?></span>
                    <h5 class="font-heading fw-bold text-dark mb-2"><?php echo htmlspecialchars($m['title']); ?></h5>
                    <p class="text-secondary small mb-0"><?php echo htmlspecialchars($m['description']); ?></p>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
