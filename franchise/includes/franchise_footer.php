</main> <!-- Close franchise-main -->

<!-- MOBILE BOTTOM NAVIGATION BAR -->
<nav class="mobile-bottom-nav">
    <div class="d-flex justify-content-around align-items-center w-100">
        <a href="<?php echo BASE_URL; ?>franchise/index.php" class="mobile-nav-item <?php echo ($active_menu ?? '') === 'dashboard' ? 'active' : ''; ?>">
            <i class="bi bi-grid-1x2-fill"></i> Home
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/customers.php" class="mobile-nav-item <?php echo ($active_menu ?? '') === 'customers' ? 'active' : ''; ?>">
            <i class="bi bi-people-fill"></i> Customers
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/new_application.php" class="mobile-nav-item text-warning fw-bold">
            <i class="bi bi-plus-circle-fill text-warning fs-3"></i> + New
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/commission_ledger.php" class="mobile-nav-item <?php echo ($active_menu ?? '') === 'ledger' ? 'active' : ''; ?>">
            <i class="bi bi-wallet2"></i> Ledger
        </a>
        <a href="<?php echo BASE_URL; ?>franchise/wallet.php" class="mobile-nav-item <?php echo ($active_menu ?? '') === 'wallet' ? 'active' : ''; ?>">
            <i class="bi bi-cash-coin"></i> Wallet
        </a>
    </div>
</nav>

<!-- MANDATED FOOTER CREDIT -->
<footer class="mt-5 py-4 bg-white text-secondary text-center small border-top">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>&copy; <?php echo date('Y'); ?> Digital Udyog Seva. Franchise Partner Network Operating Platform.</div>
        <div>Managed by <a href="https://digitalvyaparseva.com/" target="_blank" rel="noopener" class="text-warning fw-bold text-decoration-none">Digital Vyapar Seva</a></div>
    </div>
</footer>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
