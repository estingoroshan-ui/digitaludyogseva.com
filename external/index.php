<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

require_login();
$current_user = get_current_user_data();

global $pdo;

$msg = '';
$error = '';

// Handle External Professional Task Submission for Internal QC Review
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit_external_work') {
    verify_csrf_token($_POST['csrf_token'] ?? '');
    
    $assignment_id = intval($_POST['assignment_id']);
    $remarks = trim($_POST['remarks'] ?? '');
    
    try {
        $stmt = $pdo->prepare("UPDATE external_assignments SET status = 'submitted_for_qc', qc_status = 'pending', submitted_at = NOW() WHERE id = ? AND professional_id = ?");
        $stmt->execute([$assignment_id, $current_user['id']]);
        $msg = "Work submitted successfully for Internal QC Review!";
    } catch (Exception $e) {
        $error = "Error submitting work: " . $e->getMessage();
    }
}

// Fetch only assigned cases for this external professional
$assignments = [];
try {
    $stmt = $pdo->prepare("
        SELECT ea.*, c.case_code, c.current_stage, s.name as service_name, cust.name as customer_name, cust.district as customer_district 
        FROM external_assignments ea 
        JOIN cases c ON ea.case_id = c.id 
        JOIN services s ON c.service_id = s.id 
        JOIN customers cust ON c.customer_id = cust.id 
        WHERE ea.professional_id = ? 
        ORDER BY ea.created_at DESC
    ");
    $stmt->execute([$current_user['id']]);
    $assignments = $stmt->fetchAll();
} catch (Exception $e) {
    // If no assignments exist yet, show demo empty list
}

$assigned_count = count($assignments);
$submitted_count = count(array_filter($assignments, fn($a) => $a['status'] === 'submitted_for_qc'));
$approved_count = count(array_filter($assignments, fn($a) => $a['status'] === 'approved'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>External Professional Desk | Digital Udyog Seva</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { background: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .top-bar { background: #1e293b; color: #fff; padding: 12px 24px; }
        .card-stat { border-radius: 10px; border: none; }
    </style>
</head>
<body>

<header class="top-bar d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center">
        <span class="badge bg-primary fs-6 me-2">DUS</span>
        <h5 class="mb-0 fw-bold">External Professional Workspace (CA / CS / Advocate)</h5>
    </div>
    <div class="d-flex align-items-center">
        <span class="me-3 text-light-50"><i class="bi bi-person-circle me-1"></i><?php echo htmlspecialchars($current_user['name']); ?></span>
        <a href="<?php echo BASE_URL; ?>logout.php" class="btn btn-outline-light btn-sm"><i class="bi bi-box-arrow-right me-1"></i>Logout</a>
    </div>
</header>

<div class="container-fluid p-4">
    <!-- Security Notice Banner -->
    <div class="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-4">
        <i class="bi bi-shield-lock-fill fs-3 text-warning me-3"></i>
        <div>
            <h6 class="fw-bold mb-0">Strict District Data Isolation Active</h6>
            <small class="text-muted">You are only granted access to cases assigned specifically to your professional account across authorized districts. Copying or unauthorized export of client data is monitored.</small>
        </div>
    </div>

    <?php if ($msg): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i><?php echo htmlspecialchars($msg); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- KPI Summary Row -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="card card-stat bg-white shadow-sm p-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <span class="text-muted fs-7 text-uppercase fw-semibold">Assigned Cases</span>
                        <h3 class="fw-bold text-dark mb-0"><?php echo $assigned_count; ?></h3>
                    </div>
                    <div class="bg-soft-primary p-3 rounded-3 text-primary fs-3"><i class="bi bi-briefcase"></i></div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card card-stat bg-white shadow-sm p-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <span class="text-muted fs-7 text-uppercase fw-semibold">Submitted for QC</span>
                        <h3 class="fw-bold text-warning mb-0"><?php echo $submitted_count; ?></h3>
                    </div>
                    <div class="bg-soft-warning p-3 rounded-3 text-warning fs-3"><i class="bi bi-hourglass-split"></i></div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card card-stat bg-white shadow-sm p-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <span class="text-muted fs-7 text-uppercase fw-semibold">Approved & Closed</span>
                        <h3 class="fw-bold text-success mb-0"><?php echo $approved_count; ?></h3>
                    </div>
                    <div class="bg-soft-success p-3 rounded-3 text-success fs-3"><i class="bi bi-check-circle"></i></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Assigned Cases Table -->
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0"><i class="bi bi-list-task text-primary me-2"></i>My District Assigned Work (CA/Advocate Desk)</h6>
        </div>
        <div class="card-body p-0">
            <?php if (empty($assignments)): ?>
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-folder-x fs-1 text-secondary d-block mb-2"></i>
                    <p class="mb-0">No active cases assigned to your account yet. Operations team will notify you when new district tasks are allocated.</p>
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Case Code</th>
                                <th>Client Name</th>
                                <th>District</th>
                                <th>Service Category</th>
                                <th>Task Details</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($assignments as $a): ?>
                                <tr>
                                    <td class="fw-bold text-primary"><?php echo htmlspecialchars($a['case_code']); ?></td>
                                    <td><?php echo htmlspecialchars($a['customer_name']); ?></td>
                                    <td><span class="badge bg-secondary"><?php echo htmlspecialchars($a['customer_district'] ?? $a['district']); ?></span></td>
                                    <td><?php echo htmlspecialchars($a['service_name']); ?></td>
                                    <td class="fs-7"><?php echo htmlspecialchars($a['task_details']); ?></td>
                                    <td>
                                        <?php if ($a['status'] === 'submitted_for_qc'): ?>
                                            <span class="badge bg-warning text-dark">Under QC Review</span>
                                        <?php elseif ($a['status'] === 'approved'): ?>
                                            <span class="badge bg-success">QC Approved</span>
                                        <?php else: ?>
                                            <span class="badge bg-primary">In Progress</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($a['status'] !== 'submitted_for_qc' && $a['status'] !== 'approved'): ?>
                                            <form method="POST" class="d-inline">
                                                <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                <input type="hidden" name="action" value="submit_external_work">
                                                <input type="hidden" name="assignment_id" value="<?php echo $a['id']; ?>">
                                                <button type="submit" class="btn btn-success btn-sm fw-bold">
                                                    <i class="bi bi-send me-1"></i>Submit for QC
                                                </button>
                                            </form>
                                        <?php else: ?>
                                            <span class="text-muted fs-7">Locked</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
