<?php
// Printable Scorecard Generator
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/scorecard_engine.php';

$app_id = (int)($_GET['app_id'] ?? 0);
global $pdo;

$stmt = $pdo->prepare("
    SELECT la.*, c.name AS customer_name, c.mobile, c.email, c.pan, c.aadhaar_masked,
           ls.scheme_name, sc.total_score, sc.result_category, sc.recommendations, sc.scorecard_code, sc.created_at AS sc_date
    FROM loan_applications la
    JOIN customers c ON la.customer_id = c.id
    JOIN loan_schemes ls ON la.scheme_id = ls.id
    LEFT JOIN scorecards sc ON la.id = sc.loan_application_id
    WHERE la.id = ?
");
$stmt->execute([$app_id]);
$data = $stmt->fetch();

if (!$data) {
    die("Scorecard record not found.");
}

$engine_data = calculate_loan_scorecard($app_id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Scorecard - <?php echo htmlspecialchars($data['scorecard_code']); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #0f172a; }
        .scorecard-box { border: 2px solid #1e40af; border-radius: 16px; padding: 2rem; }
        .header-logo { font-size: 2rem; font-weight: 800; color: #1e40af; }
        .score-circle { width: 120px; height: 120px; border-radius: 50%; background: #1e40af; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body class="p-4">

<div class="container max-w-800">
    <div class="text-end mb-3 no-print">
        <button onclick="window.print();" class="btn btn-primary fw-bold"><i class="bi bi-printer"></i> Print / Download PDF</button>
    </div>

    <div class="scorecard-box shadow-sm">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
                <div class="header-logo">Digital Udyog Seva</div>
                <small class="text-muted">Business Legal Services & Government Business Loan Consultancy Portal</small>
            </div>
            <div class="text-end">
                <span class="badge bg-primary fs-6 mb-1"><?php echo htmlspecialchars($data['scorecard_code']); ?></span>
                <small class="d-block text-muted">Date: <?php echo date('d M Y', strtotime($data['sc_date'] ?: 'now')); ?></small>
            </div>
        </div>

        <!-- Applicant Info -->
        <div class="row bg-light p-3 rounded-3 mb-4">
            <div class="col-6">
                <strong class="d-block text-secondary small">Applicant Name:</strong>
                <span class="fw-bold text-dark fs-5"><?php echo htmlspecialchars($data['customer_name']); ?></span>
            </div>
            <div class="col-6 text-end">
                <strong class="d-block text-secondary small">Target Loan Scheme:</strong>
                <span class="fw-bold text-primary fs-5"><?php echo htmlspecialchars($data['scheme_name']); ?></span>
            </div>
        </div>

        <!-- Score & Rating Banner -->
        <div class="row align-items-center mb-4">
            <div class="col-md-4 text-center">
                <div class="score-circle shadow">
                    <span class="fs-1 fw-bold"><?php echo $engine_data['total_score']; ?></span>
                    <small style="font-size:0.75rem;">OUT OF 100</small>
                </div>
            </div>
            <div class="col-md-8">
                <small class="text-muted text-uppercase fw-bold">Evaluation Rating</small>
                <h2 class="fw-bold text-success mb-1"><?php echo htmlspecialchars($engine_data['result_category']); ?></h2>
                <p class="text-secondary small mb-0">Advisory evaluation based on CIBIL score tier, business vintage, annual turnover, GST/ITR compliance status, and document readiness.</p>
            </div>
        </div>

        <!-- Parameter Breakdown Table -->
        <h5 class="fw-bold border-bottom pb-2 mb-3">Parameter Evaluation Breakdown</h5>
        <table class="table table-bordered mb-4">
            <thead class="table-light">
                <tr>
                    <th>Parameter Name</th>
                    <th>Applicant Data</th>
                    <th>Earned Score</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($engine_data['breakdown'] as $param_key => $p): ?>
                    <tr>
                        <td class="fw-bold"><?php echo str_replace('_', ' ', strtoupper($param_key)); ?></td>
                        <td><?php echo htmlspecialchars($p['val']); ?></td>
                        <td class="fw-bold text-primary"><?php echo $p['score']; ?> / <?php echo $p['max']; ?> Pts</td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- Consultant Recommendations -->
        <div class="bg-light p-3 rounded-3 mb-4">
            <h6 class="fw-bold text-primary mb-2">Advisory Consultant Recommendations</h6>
            <p class="small text-secondary mb-0"><?php echo nl2br(htmlspecialchars($engine_data['recommendations'])); ?></p>
        </div>

        <!-- Legal Disclaimer -->
        <div class="alert alert-secondary small mb-0">
            <strong>Mandatory Legal Disclaimer:</strong> This scorecard is an advisory eligibility evaluation generated by Digital Udyog Seva for consultancy & application preparation purposes only. This document does not constitute a loan sanction or guarantee of approval by any bank, NBFC, or government authority. Final sanction is subject to formal bank appraisal and scheme rules.
        </div>
    </div>
</div>

</body>
</html>
