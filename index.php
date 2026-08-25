<?php
$page_title = "Digital Udyog Seva | India's Premier Business Registration, Tax & Loan Platform";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

// Fetch Popular Services
$popular_services = [];
try {
    $stmt = $pdo->query("
        SELECT s.*, sc.name AS category_name
        FROM services s
        JOIN service_categories sc ON s.category_id = sc.id
        WHERE s.status = 'active'
        ORDER BY s.id ASC LIMIT 8
    ");
    $popular_services = $stmt->fetchAll();
} catch (Exception $e) {}

// Fetch Loan Schemes
$loan_schemes = [];
try {
    $l_stmt = $pdo->query("SELECT * FROM loan_schemes WHERE status = 'active' ORDER BY id ASC");
    $loan_schemes = $l_stmt->fetchAll();
} catch (Exception $e) {}

// Fetch All Categories for SEO Grid
$all_categories = [];
try {
    $c_stmt = $pdo->query("SELECT * FROM service_categories WHERE status = 'active' ORDER BY sort_order ASC");
    $all_categories = $c_stmt->fetchAll();
} catch (Exception $e) {}
?>

<!-- SECTION 1 & 2: HERO SECTION + BUSINESS COMMAND CARD -->
<section class="hero-wrapper">
    <div class="container">
        <div class="row align-items-center g-5">
            <!-- Left 55%: Messaging, Search & CTAs -->
            <div class="col-lg-7 text-center text-lg-start">
                <div class="hero-badge mb-3">
                    <i class="bi bi-star-fill"></i> Trusted Business Services Platform
                </div>

                <h1 class="hero-title">
                    Start, Manage & <span class="highlight-saffron">Grow Your Business</span> — All in One Place.
                </h1>

                <p class="hero-subtitle">
                    Company registration, GST filing, ITR, licences, compliance and government business loan assistance — managed seamlessly through one unified digital platform.
                </p>

                <!-- Trust Badges Strip -->
                <div class="hero-trust-strip justify-content-center justify-content-lg-start">
                    <div class="hero-trust-item"><i class="bi bi-check-circle-fill"></i> Transparent Pricing</div>
                    <div class="hero-trust-item"><i class="bi bi-shield-check"></i> Expert Assistance</div>
                    <div class="hero-trust-item"><i class="bi bi-search"></i> Online Case Tracking</div>
                    <div class="hero-trust-item"><i class="bi bi-lock-fill"></i> Secure Vault</div>
                </div>

                <!-- Global Auto-Suggest Search Box -->
                <div class="hero-search-box mx-auto mx-lg-0">
                    <i class="bi bi-search ms-3 fs-5 text-muted"></i>
                    <input type="text" id="publicSearchInput" class="hero-search-input" placeholder="Search service or loan scheme (e.g. GST, PMEGP, Pvt Ltd, Trademark)..." autocomplete="off">
                    <button type="button" class="hero-search-btn">
                        Find Service <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                    <div id="searchDropdown" class="search-results-dropdown"></div>
                </div>

                <!-- Action CTAs -->
                <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start align-items-center">
                    <a href="#popular-services" class="dus-btn dus-btn-accent">
                        Explore Services <i class="bi bi-arrow-right"></i>
                    </a>
                    <a href="<?php echo BASE_URL; ?>loan.php" class="dus-btn dus-btn-outline-white">
                        <i class="bi bi-bank"></i> Check Loan Schemes
                    </a>
                    <a href="#how-it-works" class="text-white text-decoration-none small fw-bold ms-lg-2">
                        <i class="bi bi-play-circle-fill text-saffron me-1 fs-5 align-middle"></i> How It Works
                    </a>
                </div>
            </div>

            <!-- Right 45%: Business Command Card Panel -->
            <div class="col-lg-5 position-relative">
                <!-- Floating Status Chips -->
                <div class="floating-chip floating-chip-1">
                    <i class="bi bi-check-circle-fill text-success fs-5"></i>
                    <div>
                        <div class="fw-bold">GST Registration</div>
                        <small class="text-muted">Processing Time: 3-5 Days</small>
                    </div>
                </div>

                <div class="floating-chip floating-chip-2">
                    <i class="bi bi-bank2 text-primary fs-5"></i>
                    <div>
                        <div class="fw-bold">PMEGP Govt Loan</div>
                        <small class="text-muted">Up to 35% Capital Subsidy</small>
                    </div>
                </div>

                <!-- Command Card -->
                <div class="command-card text-start">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill">
                            <i class="bi bi-sliders me-1"></i> Business Command Center
                        </span>
                        <small class="text-muted">Instant Recommendation</small>
                    </div>

                    <!-- Nav Tabs -->
                    <div class="command-card-nav">
                        <button type="button" class="command-nav-btn active" id="cmdBtnServices" onclick="switchCommandTab('services')">
                            <i class="bi bi-briefcase me-1"></i> Business Services
                        </button>
                        <button type="button" class="command-nav-btn" id="cmdBtnLoans" onclick="switchCommandTab('loans')">
                            <i class="bi bi-currency-rupee me-1"></i> Business Loan
                        </button>
                    </div>

                    <!-- Tab 1 Pane: Business Services Selector -->
                    <div class="command-tab-pane active" id="cmdPaneServices">
                        <form action="<?php echo BASE_URL; ?>services.php" method="GET">
                            <div class="mb-3">
                                <label class="form-label small text-light fw-semibold">What do you want to accomplish?</label>
                                <select class="form-select bg-dark text-white border-secondary rounded-3" name="category">
                                    <option value="">-- Choose Business Requirement --</option>
                                    <option value="business-registration">Register New Company / Firm</option>
                                    <option value="gst-taxation">GST Registration & Tax Filing</option>
                                    <option value="licences-permits">FSSAI / Udyam / Govt Licence</option>
                                    <option value="trademark-legal">Trademark Protection & IP</option>
                                    <option value="compliance-bookkeeping">Annual Business Compliance</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small text-light fw-semibold">Select Business Entity Type</label>
                                <select class="form-select bg-dark text-white border-secondary rounded-3">
                                    <option value="Proprietorship">Proprietorship Firm</option>
                                    <option value="Partnership">Partnership Firm</option>
                                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                                    <option value="Pvt Ltd">Private Limited Company</option>
                                </select>
                            </div>
                            <button type="submit" class="dus-btn dus-btn-primary w-100 mt-2">
                                Get Recommended Services <i class="bi bi-arrow-right"></i>
                            </button>
                        </form>
                    </div>

                    <!-- Tab 2 Pane: Business Loan Advisor -->
                    <div class="command-tab-pane" id="cmdPaneLoans">
                        <form action="<?php echo BASE_URL; ?>loan.php" method="GET">
                            <div class="mb-3">
                                <label class="form-label small text-light fw-semibold">Required Loan Capital</label>
                                <select name="required_amount" class="form-select bg-dark text-white border-secondary rounded-3">
                                    <option value="500000">Up to ₹5 Lakhs (MUDRA Kishore)</option>
                                    <option value="1000000">Up to ₹10 Lakhs (MUDRA Tarun)</option>
                                    <option value="2500000">₹10 Lakhs - ₹25 Lakhs (PMEGP / MLUPY)</option>
                                    <option value="10000000">₹25 Lakhs - ₹1 Crore+ (MLUPY / Stand-Up)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small text-light fw-semibold">State of Business</label>
                                <select name="state" class="form-select bg-dark text-white border-secondary rounded-3">
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Delhi">Delhi / NCR</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Other">Other Indian State</option>
                                </select>
                            </div>
                            <button type="submit" class="dus-btn dus-btn-accent w-100 mt-2">
                                Check Loan Eligibility <i class="bi bi-arrow-right"></i>
                            </button>
                            <small class="text-muted d-block text-center mt-2" style="font-size: 0.75rem;">
                                * Consultancy & Documentation Assistance
                            </small>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 3: HERO BOTTOM TRUST BAR -->
<div class="hero-trust-bar">
    <div class="container">
        <div class="row g-3 text-center text-md-start">
            <div class="col-lg-3 col-6">
                <div class="hero-trust-bar-item justify-content-center justify-content-md-start">
                    <div class="hero-trust-bar-icon"><i class="bi bi-briefcase-fill"></i></div>
                    <div>
                        <div class="fw-bold text-white">50+ Services</div>
                        <small class="text-muted">Registration & Compliance</small>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="hero-trust-bar-item justify-content-center justify-content-md-start">
                    <div class="hero-trust-bar-icon"><i class="bi bi-search"></i></div>
                    <div>
                        <div class="fw-bold text-white">Digital Tracking</div>
                        <small class="text-muted">Real-Time Case Timeline</small>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="hero-trust-bar-item justify-content-center justify-content-md-start">
                    <div class="hero-trust-bar-icon"><i class="bi bi-building-check"></i></div>
                    <div>
                        <div class="fw-bold text-white">Franchise Network</div>
                        <small class="text-muted">PAN India Partners</small>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="hero-trust-bar-item justify-content-center justify-content-md-start">
                    <div class="hero-trust-bar-icon"><i class="bi bi-shield-lock-fill"></i></div>
                    <div>
                        <div class="fw-bold text-white">Secure Vault</div>
                        <small class="text-muted">Encrypted Document Upload</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- SECTION 4: EVERYTHING YOUR BUSINESS NEEDS (POPULAR SERVICES) -->
<section id="popular-services" class="dus-section">
    <div class="container">
        <div class="dus-section-header">
            <span class="dus-section-badge">Fast & Hassle-Free</span>
            <h2 class="dus-section-title">Popular Legal & Compliance Services</h2>
            <p class="dus-section-desc">Transparent pricing with explicit breakdown of government and professional fees.</p>
        </div>

        <div class="row g-4">
            <?php foreach ($popular_services as $srv): ?>
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div class="dus-service-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="dus-service-icon">
                                <i class="bi <?php echo htmlspecialchars($srv['icon'] ?: 'bi-award'); ?>"></i>
                            </div>
                            <span class="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold fs-7">
                                <i class="bi bi-clock me-1"></i> <?php echo htmlspecialchars($srv['processing_time']); ?>
                            </span>
                        </div>

                        <h3 class="dus-service-title"><?php echo htmlspecialchars($srv['name']); ?></h3>
                        <p class="text-muted small mb-4 flex-grow-1"><?php echo htmlspecialchars($srv['short_description']); ?></p>

                        <div class="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted d-block" style="font-size:0.75rem;">Total Fee (All Incl.)</small>
                                <span class="dus-service-price"><?php echo format_inr($srv['final_price']); ?></span>
                            </div>
                            <a href="<?php echo BASE_URL; ?>service.php?slug=<?php echo urlencode($srv['slug']); ?>" class="dus-btn dus-btn-outline-dark fs-7 py-2 px-3">
                                Apply <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="text-center mt-5">
            <a href="<?php echo BASE_URL; ?>services.php" class="dus-btn dus-btn-primary">
                View All 50+ Services Catalog <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>
</section>

<!-- SECTION 5: BROWSE BY BUSINESS NEED -->
<section class="dus-section bg-white border-top border-bottom">
    <div class="container">
        <div class="dus-section-header">
            <span class="dus-section-badge">Tailored Categorization</span>
            <h2 class="dus-section-title">Browse Services by Business Need</h2>
            <p class="dus-section-desc">Find exactly what your enterprise requires at every stage of growth.</p>
        </div>

        <div class="row g-3">
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>services.php?category=business-registration" class="need-card">
                    <div class="need-card-icon">🚀</div>
                    <div class="need-card-title">Start a Business</div>
                    <small class="text-muted">Pvt Ltd, LLP, Firm</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>services.php?category=gst-taxation" class="need-card">
                    <div class="need-card-icon">🧾</div>
                    <div class="need-card-title">File Tax & GST</div>
                    <small class="text-muted">GST Reg & Returns</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>services.php?category=licences-permits" class="need-card">
                    <div class="need-card-icon">📄</div>
                    <div class="need-card-title">Get Licences</div>
                    <small class="text-muted">FSSAI, Udyam, IEC</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>services.php?category=trademark-legal" class="need-card">
                    <div class="need-card-icon">⚖</div>
                    <div class="need-card-title">Protect Brand</div>
                    <small class="text-muted">Trademark & IP</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>loan.php" class="need-card">
                    <div class="need-card-icon">🏦</div>
                    <div class="need-card-title">Business Funding</div>
                    <small class="text-muted">Govt Schemes Assistance</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>services.php?category=compliance-bookkeeping" class="need-card">
                    <div class="need-card-icon">📊</div>
                    <div class="need-card-title">Manage Compliance</div>
                    <small class="text-muted">ROC & Audit Support</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>services.php" class="need-card">
                    <div class="need-card-icon">📑</div>
                    <div class="need-card-title">Business Contracts</div>
                    <small class="text-muted">Agreements & DSC</small>
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-6">
                <a href="<?php echo BASE_URL; ?>franchise/login.php" class="need-card">
                    <div class="need-card-icon">🤝</div>
                    <div class="need-card-title">Franchise Network</div>
                    <small class="text-muted">Partner & Earn</small>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 6: GOVERNMENT BUSINESS LOAN CONSULTANCY PORTAL (DARK THEME) -->
<section class="dus-section dark-loan-section">
    <div class="container">
        <div class="row align-items-center mb-5">
            <div class="col-lg-8">
                <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">
                    <i class="bi bi-bank me-1"></i> Government Business Loan Portal
                </span>
                <h2 class="dus-section-title text-white">Central & State Government Business Loan Schemes</h2>
                <p class="text-secondary mb-0">Full consultancy, DPR project report preparation, and eligibility evaluation for business loans.</p>
            </div>
            <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <a href="<?php echo BASE_URL; ?>loan.php" class="dus-btn dus-btn-accent">
                    View All Loan Schemes <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        </div>

        <div class="row g-4">
            <?php foreach ($loan_schemes as $scheme): ?>
                <div class="col-lg-6">
                    <div class="loan-scheme-card">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="badge bg-primary text-white rounded-pill px-3 py-1">
                                <?php echo htmlspecialchars($scheme['state']); ?>
                            </span>
                            <span class="badge bg-success-subtle text-success fw-bold rounded-pill px-3 py-1">
                                <i class="bi bi-check-circle-fill me-1"></i> Subsidy Available
                            </span>
                        </div>
                        <h3 class="h4 font-heading fw-bold text-white mb-2"><?php echo htmlspecialchars($scheme['scheme_name']); ?></h3>
                        <p class="text-secondary small mb-4 flex-grow-1"><?php echo htmlspecialchars($scheme['description']); ?></p>

                        <div class="bg-dark p-3 rounded-3 mb-4 small border border-secondary border-opacity-25">
                            <div class="row">
                                <div class="col-6">
                                    <span class="text-muted d-block">Max Loan Limit:</span>
                                    <strong class="text-white fs-6"><?php echo format_inr($scheme['max_loan']); ?></strong>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted d-block">Subsidy Benefit:</span>
                                    <strong class="text-saffron fs-6"><?php echo htmlspecialchars($scheme['subsidy_details']); ?></strong>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <small class="text-secondary"><i class="bi bi-building me-1"></i> <?php echo htmlspecialchars($scheme['department']); ?></small>
                            <a href="<?php echo BASE_URL; ?>loan.php?scheme_id=<?php echo $scheme['id']; ?>" class="dus-btn dus-btn-accent py-2 px-4 fs-7">
                                Apply Assistance
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- SECTION 7: HOW IT WORKS (4-STEP VISUAL TIMELINE) -->
<section id="how-it-works" class="dus-section">
    <div class="container">
        <div class="dus-section-header">
            <span class="dus-section-badge">Simplified Process</span>
            <h2 class="dus-section-title">How Digital Udyog Seva Works</h2>
            <p class="dus-section-desc">4 transparent steps from selection to official document delivery.</p>
        </div>

        <div class="row g-4 text-center">
            <div class="col-lg-3 col-md-6">
                <div class="step-card">
                    <div class="step-number-badge">01</div>
                    <h4 class="font-heading fw-bold mb-2">Choose Service</h4>
                    <p class="text-muted small mb-0">Select your required business registration, GST filing, or government loan scheme.</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="step-card">
                    <div class="step-number-badge">02</div>
                    <h4 class="font-heading fw-bold mb-2">Submit Details</h4>
                    <p class="text-muted small mb-0">Fill our simplified form and upload KYC documents to our secure Vault.</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="step-card">
                    <div class="step-number-badge">03</div>
                    <h4 class="font-heading fw-bold mb-2">Expert Processing</h4>
                    <p class="text-muted small mb-0">Assigned case officer reviews application, prepares DPR, and files with govt department.</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="step-card">
                    <div class="step-number-badge">04</div>
                    <h4 class="font-heading fw-bold mb-2">Track & Complete</h4>
                    <p class="text-muted small mb-0">Track real-time status online and download final certificates or scorecard PDF.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 8: BUSINESS ADVISORY SCORECARD WIDGET -->
<section class="dus-section bg-white border-top border-bottom">
    <div class="container">
        <div class="scorecard-banner">
            <div class="row align-items-center g-4">
                <div class="col-lg-7">
                    <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-3">
                        <i class="bi bi-shield-check me-1"></i> Exclusive Advisory Feature
                    </span>
                    <h2 class="display-6 fw-bold font-heading text-white mb-3">Check Your Business Readiness Scorecard</h2>
                    <p class="text-secondary leading-relaxed mb-4">
                        Evaluate your business eligibility for Bank Loans, Government Capital Subsidies, GST Compliance, and Legal Documentation in seconds.
                    </p>
                    <div class="row g-3 mb-4">
                        <div class="col-sm-6">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-saffron fs-5"></i>
                                <span class="small fw-semibold text-white">Turnover & Cashflow Readiness</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-saffron fs-5"></i>
                                <span class="small fw-semibold text-white">KYC & Document Verification</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-saffron fs-5"></i>
                                <span class="small fw-semibold text-white">Loan Scheme Match Indicator</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-saffron fs-5"></i>
                                <span class="small fw-semibold text-white">Official Consultant Review PDF</span>
                            </div>
                        </div>
                    </div>
                    <a href="<?php echo BASE_URL; ?>loan.php" class="dus-btn dus-btn-accent">
                        Check My Scorecard Now <i class="bi bi-arrow-right"></i>
                    </a>
                </div>

                <div class="col-lg-5">
                    <div class="bg-dark p-4 rounded-4 border border-secondary border-opacity-25 shadow-lg">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-white fw-bold">Business Advisory Gauge</span>
                            <span class="badge bg-success text-white px-3 py-1 rounded-pill">STRONG ELIGIBILITY</span>
                        </div>
                        <div class="display-3 fw-bold text-saffron font-heading mb-1 text-center">78<span class="fs-4 text-muted">/100</span></div>
                        <p class="text-center text-muted small mb-4">Eligible for MUDRA, PMEGP & MLUPY Schemes</p>
                        
                        <div class="mb-3">
                            <div class="d-flex justify-content-between small text-white mb-1">
                                <span>Financial Profile Strength</span>
                                <span>82%</span>
                            </div>
                            <div class="score-progress-bar"><div class="score-progress-fill" style="width:82%;"></div></div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between small text-white mb-1">
                                <span>Document Readiness</span>
                                <span>75%</span>
                            </div>
                            <div class="score-progress-bar"><div class="score-progress-fill" style="width:75%;"></div></div>
                        </div>
                        <div>
                            <div class="d-flex justify-content-between small text-white mb-1">
                                <span>Govt Subsidy Match</span>
                                <span>90%</span>
                            </div>
                            <div class="score-progress-bar"><div class="score-progress-fill" style="width:90%;"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 9: WHY DIGITAL UDYOG SEVA (ASYMMETRIC FEATURE GRID) -->
<section class="dus-section">
    <div class="container">
        <div class="dus-section-header">
            <span class="dus-section-badge">Why Choose Us</span>
            <h2 class="dus-section-title">Built for Trust, Speed & Transparency</h2>
            <p class="dus-section-desc">Why thousands of business owners across India rely on Digital Udyog Seva.</p>
        </div>

        <div class="row g-4">
            <div class="col-lg-4 col-md-6">
                <div class="why-feature-card">
                    <div class="dus-service-icon"><i class="bi bi-receipt-cutoff"></i></div>
                    <h4 class="font-heading fw-bold mb-2">Transparent Pricing</h4>
                    <p class="text-muted small mb-0">No hidden fees. Every service clearly details Government statutory fees, professional charges, and GST taxes upfront.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="why-feature-card">
                    <div class="dus-service-icon"><i class="bi bi-shield-lock-fill"></i></div>
                    <h4 class="font-heading fw-bold mb-2">Secure Document Vault</h4>
                    <p class="text-muted small mb-0">Upload PAN, Aadhaar, and financials directly to our encrypted storage vault accessible only by verified case officers.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="why-feature-card">
                    <div class="dus-service-icon"><i class="bi bi-headset"></i></div>
                    <h4 class="font-heading fw-bold mb-2">Dedicated Case Officer</h4>
                    <p class="text-muted small mb-0">Get assigned a specialized CA/CS or loan advisor who handles your application from filing to sanction.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="why-feature-card">
                    <div class="dus-service-icon"><i class="bi bi-search"></i></div>
                    <h4 class="font-heading fw-bold mb-2">Real-Time Case Tracking</h4>
                    <p class="text-muted small mb-0">Track your case status step-by-step using your unique Case Reference ID anytime on web or mobile.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="why-feature-card">
                    <div class="dus-service-icon"><i class="bi bi-building-check"></i></div>
                    <h4 class="font-heading fw-bold mb-2">Franchise Assistance Network</h4>
                    <p class="text-muted small mb-0">Physical franchise centers in major districts ensuring local guidance and face-to-face service assistance.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="why-feature-card">
                    <div class="dus-service-icon"><i class="bi bi-patch-check-fill"></i></div>
                    <h4 class="font-heading fw-bold mb-2">End-to-End Compliance</h4>
                    <p class="text-muted small mb-0">From business inception to ROC filings, GST returns, and annual tax audits — complete lifecycle management.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 10: APPLICATION TRACKING TIMELINE PREVIEW -->
<section class="dus-section bg-white border-top border-bottom">
    <div class="container">
        <div class="tracking-card">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">
                        <i class="bi bi-activity me-1"></i> Live Tracking Engine
                    </span>
                    <h2 class="display-6 fw-bold font-heading text-white mb-3">Track Your Application Live</h2>
                    <p class="text-secondary mb-4">
                        Enter your Case Reference Code or registered mobile number to view immediate updates on document verification and government filing.
                    </p>

                    <!-- Real Form -->
                    <form action="<?php echo BASE_URL; ?>track.php" method="GET" class="d-flex gap-2 max-w-500">
                        <input type="text" name="code" class="form-control form-control-lg rounded-pill px-4" placeholder="Enter Case ID (e.g. DUS-2026-1001)" required>
                        <button type="submit" class="dus-btn dus-btn-accent text-nowrap">
                            Track Status
                        </button>
                    </form>
                </div>

                <div class="col-lg-6 mt-5 mt-lg-0">
                    <div class="bg-dark p-4 rounded-4 border border-secondary border-opacity-25">
                        <div class="d-flex justify-content-between text-white mb-3">
                            <span class="fw-bold">Sample Case: #DUS-2026-1001</span>
                            <span class="badge bg-primary">In Processing</span>
                        </div>

                        <!-- Progress Steps Timeline -->
                        <div class="tracking-timeline">
                            <div class="tracking-step done">
                                <div class="tracking-icon"><i class="bi bi-check-lg"></i></div>
                                <div class="small fw-bold text-white">Submitted</div>
                            </div>
                            <div class="tracking-step done">
                                <div class="tracking-icon"><i class="bi bi-check-lg"></i></div>
                                <div class="small fw-bold text-white">Verified</div>
                            </div>
                            <div class="tracking-step active">
                                <div class="tracking-icon"><i class="bi bi-gear-wide-connected"></i></div>
                                <div class="small fw-bold text-saffron">Govt Filing</div>
                            </div>
                            <div class="tracking-step">
                                <div class="tracking-icon"><i class="bi bi-award"></i></div>
                                <div class="small text-muted">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 11: CUSTOMER PORTAL PROMOTION -->
<section class="dus-section">
    <div class="container">
        <div class="row align-items-center g-5">
            <div class="col-lg-6">
                <span class="dus-section-badge">Client Dashboard</span>
                <h2 class="dus-section-title">Manage Everything via Customer Portal</h2>
                <p class="dus-section-desc mb-4">
                    Access your personalized customer portal to view case histories, download issued GST & firm certificates, view loan scorecards, and pay advisory fees seamlessly.
                </p>

                <div class="d-flex flex-column gap-3 mb-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="dus-service-icon mb-0" style="width:40px; height:40px; font-size:1.2rem;"><i class="bi bi-folder-check"></i></div>
                        <div>
                            <div class="fw-bold text-dark">Document Vault Access</div>
                            <small class="text-muted">Download approved government licences anytime</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div class="dus-service-icon mb-0" style="width:40px; height:40px; font-size:1.2rem;"><i class="bi bi-file-earmark-pdf"></i></div>
                        <div>
                            <div class="fw-bold text-dark">Loan Eligibility Reports</div>
                            <small class="text-muted">Generate & download official advisory PDF scorecards</small>
                        </div>
                    </div>
                </div>

                <a href="<?php echo BASE_URL; ?>customer/login.php" class="dus-btn dus-btn-primary">
                    <i class="bi bi-person-circle"></i> Login to Customer Portal
                </a>
            </div>

            <div class="col-lg-6">
                <div class="bg-white p-4 rounded-4 shadow-lg border">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <span class="brand-badge-dus" style="font-size:0.9rem; padding:3px 8px;">DUS</span>
                            <span class="fw-bold text-dark">Customer Dashboard Preview</span>
                        </div>
                        <span class="badge bg-success-subtle text-success fw-bold">Active Session</span>
                    </div>
                    <div class="row g-3 text-center mb-3">
                        <div class="col-4">
                            <div class="bg-light p-3 rounded-3">
                                <div class="h3 fw-bold text-primary mb-0">02</div>
                                <small class="text-muted">Active Cases</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="bg-light p-3 rounded-3">
                                <div class="h3 fw-bold text-success mb-0">01</div>
                                <small class="text-muted">Loan App</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="bg-light p-3 rounded-3">
                                <div class="h3 fw-bold text-warning mb-0">78</div>
                                <small class="text-muted">Scorecard</small>
                            </div>
                        </div>
                    </div>
                    <div class="bg-primary-subtle p-3 rounded-3 text-start mb-2 small fw-semibold text-primary">
                        <i class="bi bi-check-circle-fill me-1"></i> GST Registration Case #DUS-882: Certificate Issued.
                    </div>
                    <div class="bg-light p-3 rounded-3 text-start small text-muted">
                        <i class="bi bi-clock me-1"></i> PMEGP Loan Case #LNW-401: Document Review Completed.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 12: FRANCHISE OPPORTUNITY SECTION -->
<section class="dus-section bg-white border-top border-bottom">
    <div class="container">
        <div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5" style="background: linear-gradient(135deg, #07152F 0%, #0D1E3D 100%); color:#ffffff;">
            <div class="row align-items-center g-4">
                <div class="col-lg-7">
                    <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-3">
                        <i class="bi bi-building-check me-1"></i> PAN India Partner Network
                    </span>
                    <h2 class="display-6 fw-bold font-heading text-white mb-3">Become a Digital Udyog Seva Franchise Partner</h2>
                    <p class="text-secondary leading-relaxed mb-4">
                        Expand your local business center or start a new franchise. Offer 50+ business registration, GST filing, and loan consultancy services in your city while earning attractive commissions.
                    </p>
                    <div class="d-flex flex-wrap gap-3">
                        <a href="<?php echo BASE_URL; ?>franchise/login.php" class="dus-btn dus-btn-accent">
                            <i class="bi bi-building"></i> Franchise Partner Login
                        </a>
                        <a href="tel:+919876543210" class="dus-btn dus-btn-outline-white">
                            <i class="bi bi-telephone"></i> Call Partner Desk
                        </a>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="bg-dark p-4 rounded-4 border border-secondary border-opacity-25 text-center">
                        <div class="display-5 fw-bold text-saffron font-heading mb-1">₹50,000+</div>
                        <p class="text-white fw-semibold mb-3">Monthly Earning Potential</p>
                        <ul class="list-unstyled text-start small text-secondary mb-0">
                            <li class="mb-2"><i class="bi bi-check-circle-fill text-saffron me-2"></i> Real-time Commission Wallet</li>
                            <li class="mb-2"><i class="bi bi-check-circle-fill text-saffron me-2"></i> Complete Backend Expert Assistance</li>
                            <li><i class="bi bi-check-circle-fill text-saffron me-2"></i> Marketing Branding & Marketing Support</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 13: BUSINESS CATEGORIES SEO GRID -->
<section class="dus-section">
    <div class="container">
        <div class="dus-section-header">
            <span class="dus-section-badge">Complete Directory</span>
            <h2 class="dus-section-title">Business Legal & Tax Categories</h2>
            <p class="dus-section-desc">Quick links to our specialized business legal services catalog.</p>
        </div>

        <div class="row g-4">
            <?php foreach ($all_categories as $cat): ?>
                <div class="col-lg-4 col-md-6">
                    <div class="bg-white p-4 rounded-4 border h-100">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <div class="dus-service-icon mb-0" style="width:36px; height:36px; font-size:1.1rem;">
                                <i class="bi <?php echo htmlspecialchars($cat['icon']); ?>"></i>
                            </div>
                            <h4 class="font-heading fw-bold mb-0 text-dark"><?php echo htmlspecialchars($cat['name']); ?></h4>
                        </div>
                        <p class="text-muted small mb-3"><?php echo htmlspecialchars($cat['description']); ?></p>
                        <a href="<?php echo BASE_URL; ?>services.php?category=<?php echo urlencode($cat['slug']); ?>" class="text-primary fw-bold small text-decoration-none">
                            View Category Services <i class="bi bi-chevron-right ms-1"></i>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- SECTION 14: FAQ ACCORDION -->
<section class="dus-section bg-white border-top border-bottom">
    <div class="container max-w-900">
        <div class="dus-section-header">
            <span class="dus-section-badge">Got Questions?</span>
            <h2 class="dus-section-title">Frequently Asked Questions</h2>
            <p class="dus-section-desc">Clear answers to your business registration, GST filing and loan consultancy queries.</p>
        </div>

        <div class="dus-accordion">
            <div class="dus-accordion-item">
                <button type="button" class="dus-accordion-button" onclick="toggleDusAccordion(1)">
                    <span>What documents are required for GST Registration?</span>
                    <i class="bi bi-chevron-down" id="faqIcon1"></i>
                </button>
                <div class="dus-accordion-body" id="faqBody1" style="display:none;">
                    Primary documents include PAN Card, Aadhaar Card, Passport Photo of Proprietor/Partners/Directors, Electricity Bill/Rent Agreement of Business Premise, and Cancelled Cheque / Bank Statement.
                </div>
            </div>

            <div class="dus-accordion-item">
                <button type="button" class="dus-accordion-button" onclick="toggleDusAccordion(2)">
                    <span>How does Government Business Loan assistance work?</span>
                    <i class="bi bi-chevron-down" id="faqIcon2"></i>
                </button>
                <div class="dus-accordion-body" id="faqBody2" style="display:none;">
                    We analyze your business profile, evaluate eligibility under schemes like PMEGP, MUDRA, or MLUPY, prepare Detailed Project Reports (DPR), and assist in documentation for bank submission.
                </div>
            </div>

            <div class="dus-accordion-item">
                <button type="button" class="dus-accordion-button" onclick="toggleDusAccordion(3)">
                    <span>What is the processing time for Udyam (MSME) Registration?</span>
                    <i class="bi bi-chevron-down" id="faqIcon3"></i>
                </button>
                <div class="dus-accordion-body" id="faqBody3" style="display:none;">
                    Udyam registration is processed within 1 to 2 working days once Aadhaar-linked OTP and business details are verified.
                </div>
            </div>

            <div class="dus-accordion-item">
                <button type="button" class="dus-accordion-button" onclick="toggleDusAccordion(4)">
                    <span>Can I track my application status online?</span>
                    <i class="bi bi-chevron-down" id="faqIcon4"></i>
                </button>
                <div class="dus-accordion-body" id="faqBody4" style="display:none;">
                    Yes! Use our "Track Status" page and enter your unique Case Reference ID (e.g. DUS-2026-1001) to check real-time progress.
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 15: FINAL CTA BANNER -->
<section class="dus-section">
    <div class="container">
        <div class="final-cta-banner">
            <h2 class="display-5 fw-bold font-heading text-white mb-3">Ready to Take Your Business Forward?</h2>
            <p class="lead text-secondary max-w-600 mx-auto mb-4">
                Consult with our business setup experts or check your government business loan eligibility today.
            </p>
            <div class="d-flex flex-wrap gap-3 justify-content-center">
                <a href="<?php echo BASE_URL; ?>services.php" class="dus-btn dus-btn-accent">
                    Explore Services <i class="bi bi-arrow-right"></i>
                </a>
                <a href="<?php echo BASE_URL; ?>loan.php" class="dus-btn dus-btn-outline-white">
                    <i class="bi bi-bank"></i> Apply Business Loan
                </a>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
