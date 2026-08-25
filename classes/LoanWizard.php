<?php
// Multi-step Loan Application & Eligibility Wizard Engine
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/scorecard_engine.php';

class LoanWizard {

    // Process Complete Loan Application Submission
    public static function submit_application($data) {
        global $pdo;

        try {
            // Extract & sanitize data
            $customer_id = (int)$data['customer_id'];
            $scheme_id = (int)$data['scheme_id'];
            $franchise_id = !empty($data['franchise_id']) ? (int)$data['franchise_id'] : null;
            $req_amount = (float)$data['required_amount'];
            $loan_purpose = sanitize($data['loan_purpose'] ?? 'Business Expansion');
            $purpose_details = sanitize($data['purpose_details'] ?? '');

            if (!$customer_id || !$scheme_id || $req_amount <= 0) {
                return ['status' => false, 'message' => 'Invalid customer, scheme or loan amount.'];
            }

            $app_code = generate_code('LOAN', 6);

            // 1. Insert Loan Application
            $ins = $pdo->prepare("
                INSERT INTO loan_applications (
                    application_code, customer_id, scheme_id, franchise_id,
                    required_amount, loan_purpose, purpose_details, status_stage
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Application Received')
            ");
            $ins->execute([
                $app_code, $customer_id, $scheme_id, $franchise_id,
                $req_amount, $loan_purpose, $purpose_details
            ]);

            $loan_app_id = $pdo->lastInsertId();

            // 2. Insert Financial Details
            $monthly_inc = (float)($data['monthly_income'] ?? 0);
            $existing_emi = (float)($data['existing_emi'] ?? 0);
            $bank_name = sanitize($data['bank_name'] ?? '');
            $avg_balance = (float)($data['avg_bank_balance'] ?? 0);
            $turnover = (float)($data['turnover_last_yr'] ?? 0);
            $itr_filed = !empty($data['itr_filed']) ? 1 : 0;
            $gst_filed = !empty($data['gst_filed']) ? 1 : 0;
            $defaults = !empty($data['loan_defaults_history']) ? 1 : 0;

            $fin_ins = $pdo->prepare("
                INSERT INTO loan_financial_details (
                    loan_application_id, monthly_income, existing_emi, bank_name,
                    avg_bank_balance, turnover_last_yr, itr_filed, gst_filed, loan_defaults_history
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $fin_ins->execute([
                $loan_app_id, $monthly_inc, $existing_emi, $bank_name,
                $avg_balance, $turnover, $itr_filed, $gst_filed, $defaults
            ]);

            // 3. Trigger Initial Scorecard Calculation
            $sc_res = calculate_loan_scorecard($loan_app_id);

            // 4. Create Linked Service Case for Consultant Tracking
            $case_code = generate_code('CASE', 6);
            $c_ins = $pdo->prepare("
                INSERT INTO cases (case_code, customer_id, loan_application_id, franchise_id, department, current_stage, total_amount)
                VALUES (?, ?, ?, ?, 'Government Loan Team', 'KYC Verification', 499.00)
            ");
            $c_ins->execute([$case_code, $customer_id, $loan_app_id, $franchise_id]);

            return [
                'status' => true,
                'loan_application_id' => $loan_app_id,
                'application_code' => $app_code,
                'scorecard_id' => $sc_res['scorecard_id'] ?? null,
                'initial_score' => $sc_res['total_score'] ?? 0,
                'result_category' => $sc_res['result_category'] ?? 'Consultant Review',
                'message' => 'Government Business Loan Application submitted successfully.'
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Loan submission error: ' . $e->getMessage()];
        }
    }
}
