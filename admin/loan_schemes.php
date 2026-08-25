<?php
$page_title = "Government Loan Schemes Master";
$active_menu = "loan_schemes";
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_scheme') {
    $name = sanitize($_POST['scheme_name']);
    $type = sanitize($_POST['scheme_type']);
    $state = sanitize($_POST['state']);
    $dept = sanitize($_POST['department']);
    $min_loan = (float)$_POST['min_loan'];
    $max_loan = (float)$_POST['max_loan'];
    $subsidy = sanitize($_POST['subsidy_details']);
    $desc = sanitize($_POST['description']);

    $ins = $pdo->prepare("
        INSERT INTO loan_schemes (scheme_name, scheme_type, state, department, min_loan, max_loan, subsidy_details, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    ");
    $ins->execute([$name, $type, $state, $dept, $min_loan, $max_loan, $subsidy, $desc]);
    $msg = '<div class="alert alert-success fw-bold">New Government Loan Scheme added successfully!</div>';
}

$schemes = $pdo->query("SELECT * FROM loan_schemes ORDER BY id DESC")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Government Scheme Master Configurator</h4>
        <p class="text-muted small mb-0">Manage Central & State loan schemes, subsidy rules and maximum loan limits.</p>
    </div>
    <button class="btn btn-primary rounded-pill fw-bold px-4" data-bs-toggle="modal" data-bs-target="#newSchemeModal">
        <i class="bi bi-plus-lg me-1"></i> Add New Scheme
    </button>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Scheme Name</th>
                    <th>Type / State</th>
                    <th>Department</th>
                    <th>Min Loan</th>
                    <th>Max Loan</th>
                    <th>Subsidy Details</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($schemes as $s): ?>
                    <tr>
                        <td class="fw-bold text-dark"><?php echo htmlspecialchars($s['scheme_name']); ?></td>
                        <td>
                            <span class="badge bg-primary"><?php echo strtoupper(htmlspecialchars($s['scheme_type'])); ?></span>
                            <span class="badge bg-secondary"><?php echo htmlspecialchars($s['state']); ?></span>
                        </td>
                        <td><small><?php echo htmlspecialchars($s['department']); ?></small></td>
                        <td><?php echo format_inr($s['min_loan']); ?></td>
                        <td class="fw-bold text-success"><?php echo format_inr($s['max_loan']); ?></td>
                        <td><small class="fw-bold text-primary"><?php echo htmlspecialchars($s['subsidy_details']); ?></small></td>
                        <td><span class="badge bg-success"><?php echo htmlspecialchars($s['status']); ?></span></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- NEW SCHEME MODAL -->
<div class="modal fade" id="newSchemeModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title font-heading fw-bold">Add Government Loan Scheme</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="action" value="save_scheme">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Scheme Name *</label>
                            <input type="text" name="scheme_name" class="form-control" required placeholder="e.g. Rajasthan Startup Fund">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">Type *</label>
                            <select name="scheme_type" class="form-control">
                                <option value="central">Central Govt</option>
                                <option value="state">State Govt</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">State *</label>
                            <input type="text" name="state" class="form-control" value="Rajasthan">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Department *</label>
                            <input type="text" name="department" class="form-control" placeholder="e.g. MSME / Industries Dept">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">Min Loan (₹)</label>
                            <input type="number" name="min_loan" class="form-control" value="50000">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold">Max Loan (₹)</label>
                            <input type="number" name="max_loan" class="form-control" value="5000000">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Subsidy Details</label>
                            <input type="text" name="subsidy_details" class="form-control" placeholder="e.g. 25% Capital Subsidy for Rural Enterprises">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Full Scheme Description</label>
                            <textarea name="description" class="form-control" rows="3" placeholder="Scheme overview & rules..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Save Scheme</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
