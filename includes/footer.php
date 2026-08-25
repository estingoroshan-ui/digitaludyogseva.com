<?php
// Premium Deep Navy 5-Column Footer Component
?>
<footer>
    <div class="container">
        <div class="row g-4 mb-5">
            <!-- Column 1: Branding & Intro -->
            <div class="col-lg-3 col-md-6">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="brand-badge-dus">DUS</span>
                    <h4 class="text-white mb-0 font-heading">Digital Udyog Seva</h4>
                </div>
                <p class="small text-secondary mb-4 leading-relaxed">
                    India's premier digital business platform providing fast-track Business Registration, GST & Tax Compliance, Trademark Protection, FSSAI Licensing, and Government Business Loan Consultancy.
                </p>
                <div class="d-flex gap-3 text-white">
                    <a href="#" class="btn btn-sm btn-outline-light rounded-circle" style="width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center;"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="btn btn-sm btn-outline-light rounded-circle" style="width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center;"><i class="bi bi-twitter-x"></i></a>
                    <a href="#" class="btn btn-sm btn-outline-light rounded-circle" style="width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center;"><i class="bi bi-linkedin"></i></a>
                    <a href="https://wa.me/919876543210" target="_blank" class="btn btn-sm btn-outline-success rounded-circle" style="width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center;"><i class="bi bi-whatsapp"></i></a>
                </div>
            </div>

            <!-- Column 2: Quick Navigation Links -->
            <div class="col-lg-2 col-md-6">
                <h5>Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="<?php echo BASE_URL; ?>">Home</a></li>
                    <li><a href="<?php echo BASE_URL; ?>services.php">All 50+ Services</a></li>
                    <li><a href="<?php echo BASE_URL; ?>loan.php">Govt Loan Portal</a></li>
                    <li><a href="<?php echo BASE_URL; ?>track.php">Track Application</a></li>
                    <li><a href="<?php echo BASE_URL; ?>customer/login.php">Customer Login</a></li>
                    <li><a href="<?php echo BASE_URL; ?>franchise/login.php">Franchise Login</a></li>
                </ul>
            </div>

            <!-- Column 3: Business Loan Schemes -->
            <div class="col-lg-2 col-md-6">
                <h5>Loan Schemes</h5>
                <ul class="list-unstyled">
                    <li><a href="<?php echo BASE_URL; ?>loan.php?scheme_id=1">PMEGP Subsidy Loan</a></li>
                    <li><a href="<?php echo BASE_URL; ?>loan.php?scheme_id=2">PM MUDRA Loan</a></li>
                    <li><a href="<?php echo BASE_URL; ?>loan.php?scheme_id=3">Rajasthan MLUPY Loan</a></li>
                    <li><a href="<?php echo BASE_URL; ?>loan.php?scheme_id=4">PM Vishwakarma Scheme</a></li>
                    <li><a href="<?php echo BASE_URL; ?>loan.php?scheme_id=5">Stand-Up India Loan</a></li>
                </ul>
            </div>

            <!-- Column 4: Popular Services -->
            <div class="col-lg-2 col-md-6">
                <h5>Top Services</h5>
                <ul class="list-unstyled">
                    <li><a href="<?php echo BASE_URL; ?>service.php?slug=gst-registration">GST Registration</a></li>
                    <li><a href="<?php echo BASE_URL; ?>service.php?slug=private-limited-company-registration">Pvt Ltd Registration</a></li>
                    <li><a href="<?php echo BASE_URL; ?>service.php?slug=trademark-registration">Trademark Filing</a></li>
                    <li><a href="<?php echo BASE_URL; ?>service.php?slug=fssai-food-licence">FSSAI Licence</a></li>
                    <li><a href="<?php echo BASE_URL; ?>service.php?slug=udyam-registration">Udyam Registration</a></li>
                </ul>
            </div>

            <!-- Column 5: Contact & Office Support -->
            <div class="col-lg-3 col-md-6">
                <h5>Contact & Support</h5>
                <p class="small text-secondary mb-2">
                    <i class="bi bi-geo-alt-fill text-saffron me-2"></i>
                    <?php echo htmlspecialchars(get_setting('office_address', 'Digital Udyog Seva Complex, Jaipur, Rajasthan')); ?>
                </p>
                <p class="small text-secondary mb-2">
                    <i class="bi bi-telephone-fill text-saffron me-2"></i>
                    Helpline: <strong><?php echo htmlspecialchars(get_setting('helpline_phone', '+91 98765 43210')); ?></strong>
                </p>
                <p class="small text-secondary mb-2">
                    <i class="bi bi-envelope-fill text-saffron me-2"></i>
                    <?php echo htmlspecialchars(get_setting('support_email', 'info@digitaludyogseva.com')); ?>
                </p>
                <p class="small text-secondary">
                    <i class="bi bi-clock-fill text-saffron me-2"></i>
                    Mon - Sat: 9:30 AM - 7:00 PM
                </p>
            </div>
        </div>

        <hr class="border-secondary opacity-25 my-4">

        <div class="row align-items-center small text-secondary py-2">
            <div class="col-md-6 text-center text-md-start">
                &copy; <?php echo date('Y'); ?> Digital Udyog Seva. All Rights Reserved.
            </div>
            <div class="col-md-6 text-center text-md-end mt-2 mt-md-0">
                <span class="me-3">
                    Managed by <a href="https://digitalvyaparseva.com/" target="_blank" rel="noopener" class="text-saffron fw-bold text-decoration-none">Digital Vyapar Seva</a>
                </span>
                <span class="me-3">|</span>
                <span class="me-3"><a href="#" class="text-secondary">Privacy Policy</a></span>
                <span><a href="#" class="text-secondary">Terms of Service</a></span>
            </div>
        </div>
    </div>
</footer>

<!-- FLOATING CONTACT BUTTON (DESKTOP) -->
<a href="https://wa.me/919876543210?text=Hi%20Digital%20Udyog%20Seva,%20I%20need%20assistance" target="_blank" class="floating-contact-btn d-none d-md-flex" title="Chat on WhatsApp">
    <i class="bi bi-whatsapp"></i>
</a>

<!-- STICKY MOBILE BOTTOM CTA BAR -->
<div class="mobile-sticky-cta d-flex d-md-none">
    <a href="tel:+919876543210" class="btn btn-outline-light flex-fill fw-bold rounded-pill text-nowrap fs-7 py-2">
        <i class="bi bi-telephone-fill text-saffron me-1"></i> Call Us
    </a>
    <a href="https://wa.me/919876543210" target="_blank" class="btn btn-success flex-fill fw-bold rounded-pill text-nowrap fs-7 py-2">
        <i class="bi bi-whatsapp me-1"></i> WhatsApp
    </a>
    <a href="<?php echo BASE_URL; ?>loan.php" class="btn btn-warning flex-fill fw-bold rounded-pill text-nowrap fs-7 py-2 text-dark">
        <i class="bi bi-rocket-takeoff me-1"></i> Apply
    </a>
</div>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<!-- Custom JS -->
<script src="<?php echo BASE_URL; ?>assets/js/main.js"></script>
</body>
</html>
