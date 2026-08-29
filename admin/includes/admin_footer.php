        </div>
    </div>
</div>

<!-- Bootstrap 5 Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<!-- CRM Script -->
<script src="<?php echo BASE_URL; ?>assets/js/crm.js"></script>
<script>
// Prevent Bootstrap modal backdrop stacking context issues by moving modals to <body>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(function(m) {
        if (m.parentElement !== document.body) {
            document.body.appendChild(m);
        }
    });
});
</script>
</body>
</html>
