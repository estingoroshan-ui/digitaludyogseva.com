<?php
$page_title = "Reports & Analytics Center";
$active_menu = "reports";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;

// Aggregations for Reports
$lead_sources_report = $pdo->query("
    SELECT ls.source_name, COUNT(l.id) AS total_count
    FROM lead_sources ls
    LEFT JOIN leads l ON l.source_id = ls.id
    GROUP BY ls.id
")->fetchAll();

$service_revenue_report = $pdo->query("
    SELECT s.name AS service_name, COUNT(c.id) AS total_cases, SUM(c.total_amount) AS gross_revenue
    FROM services s
    LEFT JOIN cases c ON c.service_id = s.id
    GROUP BY s.id
")->fetchAll();

$loan_schemes_report = $pdo->query("
    SELECT ls.scheme_name, COUNT(la.id) AS total_apps, SUM(la.required_amount) AS total_requested
    FROM loan_schemes ls
    LEFT JOIN loan_applications la ON la.scheme_id = ls.id
    GROUP BY ls.id
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Reports & Analytics Center</h4>
        <p class="text-muted small mb-0">Business performance metrics, lead conversion funnels & revenue reports.</p>
    </div>
</div>

<div class="row g-4">
    <!-- Lead Source Report -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold mb-3">Leads by Acquisition Source</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Source</th>
                            <th>Total Leads</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($lead_sources_report as $lsr): ?>
                            <tr>
                                <td class="fw-bold"><?php echo htmlspecialchars($lsr['source_name']); ?></td>
                                <td><span class="badge bg-primary fs-6"><?php echo $lsr['total_count']; ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Service Revenue Report -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold mb-3">Service-wise Revenue</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Service Name</th>
                            <th>Cases</th>
                            <th>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($service_revenue_report as $srr): ?>
                            <tr>
                                <td class="fw-bold small"><?php echo htmlspecialchars($srr['service_name']); ?></td>
                                <td><span class="badge bg-secondary"><?php echo $srr['total_cases']; ?></span></td>
                                <td class="fw-bold text-success"><?php echo format_inr($srr['gross_revenue'] ?: 0); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Loan Scheme Performance Report -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold mb-3">Government Loan Schemes Demand</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Scheme</th>
                            <th>Apps</th>
                            <th>Requested Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($loan_schemes_report as $lsr): ?>
                            <tr>
                                <td class="fw-bold small"><?php echo htmlspecialchars($lsr['scheme_name']); ?></td>
                                <td><span class="badge bg-warning text-dark"><?php echo $lsr['total_apps']; ?></span></td>
                                <td class="fw-bold text-primary"><?php echo format_inr($lsr['total_requested'] ?: 0); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
