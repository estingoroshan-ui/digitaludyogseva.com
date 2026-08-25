<?php
// Scorecard Calculation Engine for Digital Udyog Seva
require_once __DIR__ . '/../config/app.php';

function calculate_loan_scorecard($loan_application_id) {
    global $pdo;

    try {
        // Fetch loan application and financial details
        $stmt = $pdo->prepare("
            SELECT la.*, c.name, c.pan, c.dob, c.mobile, c.email,
                   fd.monthly_income, fd.existing_emi, fd.bank_name, fd.avg_bank_balance,
                   fd.turnover_last_yr, fd.itr_filed, fd.gst_filed, fd.loan_defaults_history,
                   bp.constitution, bp.vintage_years, bp.turnover_annual,
                   cc.score AS cibil_score, cc.status AS credit_status
            FROM loan_applications la
            JOIN customers c ON la.customer_id = c.id
            LEFT JOIN loan_financial_details fd ON la.id = fd.loan_application_id
            LEFT JOIN customer_business_profiles bp ON c.id = bp.customer_id
            LEFT JOIN credit_checks cc ON la.id = cc.loan_application_id
            WHERE la.id = ?
        ");
        $stmt->execute([$loan_application_id]);
        $app = $stmt->fetch();

        if (!$app) {
            return ['status' => false, 'message' => 'Loan application not found.'];
        }

        $total_score = 0;
        $breakdown = [];

        // Parameter 1: CIBIL Score (Max 25 pts)
        $cibil = (int)($app['cibil_score'] ?? 700);
        $cibil_pts = 0;
        if ($cibil >= 750) $cibil_pts = 25;
        elseif ($cibil >= 700) $cibil_pts = 20;
        elseif ($cibil >= 650) $cibil_pts = 15;
        else $cibil_pts = 5;
        $total_score += $cibil_pts;
        $breakdown['cibil_score'] = ['score' => $cibil_pts, 'max' => 25, 'val' => $cibil];

        // Parameter 2: Business Vintage (Max 15 pts)
        $vintage = (int)($app['vintage_years'] ?? 1);
        $vintage_pts = 0;
        if ($vintage >= 5) $vintage_pts = 15;
        elseif ($vintage >= 3) $vintage_pts = 12;
        elseif ($vintage >= 1) $vintage_pts = 8;
        else $vintage_pts = 5;
        $total_score += $vintage_pts;
        $breakdown['vintage_years'] = ['score' => $vintage_pts, 'max' => 15, 'val' => $vintage . ' Years'];

        // Parameter 3: Turnover & Cash Flow (Max 15 pts)
        $turnover = (float)($app['turnover_last_yr'] ?? $app['turnover_annual'] ?? 0);
        $turnover_pts = 0;
        if ($turnover >= 5000000) $turnover_pts = 15;
        elseif ($turnover >= 2000000) $turnover_pts = 12;
        elseif ($turnover >= 500000) $turnover_pts = 8;
        else $turnover_pts = 4;
        $total_score += $turnover_pts;
        $breakdown['turnover'] = ['score' => $turnover_pts, 'max' => 15, 'val' => '₹' . number_format($turnover)];

        // Parameter 4: GST & ITR Compliance (Max 15 pts)
        $compliance_pts = 0;
        if (!empty($app['itr_filed'])) $compliance_pts += 8;
        if (!empty($app['gst_filed'])) $compliance_pts += 7;
        $total_score += $compliance_pts;
        $breakdown['gst_itr_compliance'] = ['score' => $compliance_pts, 'max' => 15, 'val' => ($app['itr_filed'] ? 'ITR Yes ' : '') . ($app['gst_filed'] ? 'GST Yes' : 'No Tax Docs')];

        // Parameter 5: Repayment History & Defaults (Max 15 pts)
        $defaults = !empty($app['loan_defaults_history']);
        $defaults_pts = $defaults ? 0 : 15;
        $total_score += $defaults_pts;
        $breakdown['existing_defaults'] = ['score' => $defaults_pts, 'max' => 15, 'val' => $defaults ? 'Prior Defaults Found' : 'Clean History'];

        // Parameter 6: Document Readiness (Max 15 pts)
        // Count uploaded documents
        $doc_stmt = $pdo->prepare("SELECT COUNT(*) FROM documents WHERE loan_application_id = ? AND verification_status = 'Approved'");
        $doc_stmt->execute([$loan_application_id]);
        $doc_count = $doc_stmt->fetchColumn();

        $doc_pts = 0;
        if ($doc_count >= 5) $doc_pts = 15;
        elseif ($doc_count >= 3) $doc_pts = 10;
        elseif ($doc_count >= 1) $doc_pts = 5;
        else $doc_pts = 2;
        $total_score += $doc_pts;
        $breakdown['document_readiness'] = ['score' => $doc_pts, 'max' => 15, 'val' => $doc_count . ' Approved Docs'];

        // Determine category result
        $result_category = 'Consultant Review Required';
        if ($total_score >= 80) {
            $result_category = 'Strong Profile';
        } elseif ($total_score >= 65) {
            $result_category = 'Moderate Profile';
        } elseif ($total_score >= 50) {
            $result_category = 'Consultant Review Required';
        } else {
            $result_category = 'Improvement Required';
        }

        // Generate recommendations
        $recommendations = [];
        if ($cibil_pts < 20) $recommendations[] = "Maintain timely payment of all existing credit card bills and EMIs to boost your bureau score.";
        if (empty($app['itr_filed'])) $recommendations[] = "File your latest Income Tax Returns (ITR) to strengthen your financial eligibility proof.";
        if (empty($app['gst_filed'])) $recommendations[] = "Consider registering for GST or MSME Udyam through Digital Udyog Seva for government scheme compliance.";
        if ($doc_count < 3) $recommendations[] = "Upload complete 6-month bank statements and project reports for faster bank submission.";

        $recommendation_str = implode("\n", $recommendations);
        if (empty($recommendation_str)) {
            $recommendation_str = "Your business loan profile is strong. Prepare your project report for bank submission.";
        }

        // Insert or Update Scorecard Record
        $scorecard_code = 'SC-' . date('Y') . '-' . str_pad($loan_application_id, 6, '0', STR_PAD_LEFT);
        $scorecard_fee = (float)get_setting('scorecard_fee', 499.00);

        $check_sc = $pdo->prepare("SELECT id, payment_status, scorecard_unlocked FROM scorecards WHERE loan_application_id = ?");
        $check_sc->execute([$loan_application_id]);
        $existing_sc = $check_sc->fetch();

        if ($existing_sc) {
            $sc_id = $existing_sc['id'];
            $upd = $pdo->prepare("
                UPDATE scorecards 
                SET total_score = ?, result_category = ?, recommendations = ?
                WHERE id = ?
            ");
            $upd->execute([$total_score, $result_category, $recommendation_str, $sc_id]);
        } else {
            $ins = $pdo->prepare("
                INSERT INTO scorecards (scorecard_code, loan_application_id, customer_id, total_score, result_category, recommendations, scorecard_fee, payment_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            ");
            $ins->execute([$scorecard_code, $loan_application_id, $app['customer_id'], $total_score, $result_category, $recommendation_str, $scorecard_fee]);
            $sc_id = $pdo->lastInsertId();

            // Link scorecard_id to loan application
            $upd_app = $pdo->prepare("UPDATE loan_applications SET scorecard_id = ? WHERE id = ?");
            $upd_app->execute([$sc_id, $loan_application_id]);
        }

        return [
            'status' => true,
            'scorecard_id' => $sc_id,
            'scorecard_code' => $scorecard_code,
            'total_score' => $total_score,
            'result_category' => $result_category,
            'breakdown' => $breakdown,
            'recommendations' => $recommendation_str,
            'payment_status' => $existing_sc['payment_status'] ?? 'pending',
            'unlocked' => (bool)($existing_sc['scorecard_unlocked'] ?? false)
        ];

    } catch (Exception $e) {
        return ['status' => false, 'message' => 'Scorecard calculation error: ' . $e->getMessage()];
    }
}
