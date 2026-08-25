<?php
// Dynamic Navigation Bar & Mega Menu
global $pdo;
$categories = [];
try {
    $stmt = $pdo->query("SELECT * FROM service_categories WHERE status = 'active' ORDER BY sort_order ASC");
    $categories = $stmt->fetchAll();
} catch (Exception $e) {}
?>
<nav class="navbar navbar-expand-lg navbar-dus" id="mainNavbar">
    <div class="container">
        <!-- Brand Logo -->
        <a class="navbar-brand d-flex align-items-center gap-2" href="<?php echo BASE_URL; ?>">
            <span class="brand-badge-dus">DUS</span>
            <div>
                <span class="brand-title-dus d-block">Digital Udyog Seva</span>
                <span class="brand-subtitle-dus">Business Services • Compliance • Finance</span>
            </div>
        </a>

        <!-- Mobile Toggler -->
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                <li class="nav-item">
                    <a class="nav-link nav-link-dus" href="<?php echo BASE_URL; ?>">Home</a>
                </li>

                <!-- Services Mega Menu Dropdown -->
                <li class="nav-item dropdown position-static">
                    <a class="nav-link nav-link-dus dropdown-toggle" href="<?php echo BASE_URL; ?>services.php" id="servicesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        Services & Registrations
                    </a>
                    <div class="dropdown-menu mega-dropdown-menu" aria-labelledby="servicesDropdown">
                        <div class="row g-4">
                            <?php 
                            $count = 0;
                            foreach ($categories as $cat): 
                                $count++;
                                if ($count > 4) break; // Display top 4 columns in mega menu
                            ?>
                                <div class="col-lg-3 col-md-6">
                                    <div class="mega-menu-column-title">
                                        <i class="bi <?php echo htmlspecialchars($cat['icon']); ?> text-primary me-1"></i>
                                        <?php echo htmlspecialchars($cat['name']); ?>
                                    </div>
                                    <div class="d-flex flex-column gap-1">
                                        <?php
                                        $s_stmt = $pdo->prepare("SELECT name, slug FROM services WHERE category_id = ? AND status = 'active' LIMIT 5");
                                        $s_stmt->execute([$cat['id']]);
                                        $cat_services = $s_stmt->fetchAll();
                                        foreach ($cat_services as $cs):
                                        ?>
                                            <a href="<?php echo BASE_URL; ?>service.php?slug=<?php echo urlencode($cs['slug']); ?>" class="mega-menu-link">
                                                <i class="bi bi-chevron-right me-1 text-muted small"></i>
                                                <?php echo htmlspecialchars($cs['name']); ?>
                                            </a>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <div class="border-top pt-3 mt-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <span class="small text-muted fw-semibold">
                                <i class="bi bi-patch-check-fill text-primary me-1"></i> Government Approved Consultancy & Fast-Track Application Processing
                            </span>
                            <a href="<?php echo BASE_URL; ?>services.php" class="dus-btn dus-btn-primary py-2 px-4 fs-7">
                                Explore All 50+ Business Services <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </li>

                <li class="nav-item">
                    <a class="nav-link nav-link-dus fw-bold" href="<?php echo BASE_URL; ?>loan.php">
                        <i class="bi bi-bank text-danger me-1"></i> Govt Business Loans
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-dus" href="<?php echo BASE_URL; ?>franchise/login.php">Franchise Network</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-dus" href="<?php echo BASE_URL; ?>track.php">Track Status</a>
                </li>

                <!-- Header CTA Button -->
                <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
                    <a href="<?php echo BASE_URL; ?>loan.php" class="dus-btn dus-btn-accent">
                        <i class="bi bi-rocket-takeoff"></i> Apply Loan
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
