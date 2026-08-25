<?php
// Central Payment Gateway & Accounts Verification Engine
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/FranchiseEngine.php';

class PaymentGateway {

    // Initiate Payment
    public static function create_payment($customer_id, $amount, $payment_mode = 'online_razorpay', $case_id = null, $loan_application_id = null, $scorecard_id = null, $service_id = null, $franchise_id = null) {
        global $pdo;

        try {
            $code = generate_code('PAY', 6);
            $status = ($payment_mode === 'online_razorpay') ? 'initiated' : 'offline_pending';

            $stmt = $pdo->prepare("
                INSERT INTO payments (
                    payment_code, customer_id, case_id, loan_application_id, scorecard_id,
                    service_id, franchise_id, amount, payment_mode, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $code, $customer_id, $case_id, $loan_application_id, $scorecard_id,
                $service_id, $franchise_id, $amount, $payment_mode, $status
            ]);

            $payment_id = $pdo->lastInsertId();

            return [
                'status' => true,
                'payment_id' => $payment_id,
                'payment_code' => $code,
                'amount' => $amount,
                'payment_mode' => $payment_mode,
                'status_state' => $status
            ];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Payment creation failed: ' . $e->getMessage()];
        }
    }

    // Submit Offline Payment Proof
    public static function submit_offline_proof($payment_id, $proof_file, $bank_name, $transaction_id, $payment_date) {
        global $pdo;

        $target_dir = UPLOAD_DIR . 'payments/' . date('Y/m') . '/';
        $res = upload_file($proof_file, $target_dir, ['jpg', 'jpeg', 'png', 'pdf']);

        if (!$res['status']) {
            return $res;
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO offline_payments (payment_id, proof_file_path, bank_name, transaction_id, payment_date, verification_status)
                VALUES (?, ?, ?, ?, ?, 'pending')
            ");
            $stmt->execute([$payment_id, $res['file_path'], $bank_name, $transaction_id, $payment_date]);

            // Update main payment status
            $upd = $pdo->prepare("UPDATE payments SET status = 'offline_pending', transaction_reference = ? WHERE id = ?");
            $upd->execute([$transaction_id, $payment_id]);

            return ['status' => true, 'message' => 'Offline payment proof submitted for accounts verification.'];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Offline proof submission error: ' . $e->getMessage()];
        }
    }

    // Verify Payment (Online or Offline Approval by Admin/Accounts)
    public static function verify_payment($payment_id, $verified_by_user_id, $txn_ref = '') {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT * FROM payments WHERE id = ?");
            $stmt->execute([$payment_id]);
            $pay = $stmt->fetch();

            if (!$pay) {
                return ['status' => false, 'message' => 'Payment record not found.'];
            }

            $tx_reference = $txn_ref ?: ($pay['transaction_reference'] ?: 'VERIFIED-' . time());

            // Mark payment as verified
            $upd = $pdo->prepare("UPDATE payments SET status = 'verified', transaction_reference = ? WHERE id = ?");
            $upd->execute([$tx_reference, $payment_id]);

            // Update offline_payments table if applicable
            $upd_off = $pdo->prepare("UPDATE offline_payments SET verification_status = 'verified', verified_by = ?, verified_at = NOW() WHERE payment_id = ?");
            $upd_off->execute([$verified_by_user_id, $payment_id]);

            // If this payment is for a Scorecard, unlock the scorecard!
            if (!empty($pay['scorecard_id'])) {
                $sc_upd = $pdo->prepare("UPDATE scorecards SET payment_status = 'verified', unlocked_at = NOW() WHERE id = ?");
                $sc_upd->execute([$pay['scorecard_id']]);

                if (!empty($pay['loan_application_id'])) {
                    $la_upd = $pdo->prepare("UPDATE loan_applications SET scorecard_payment_status = 'verified', scorecard_unlocked = TRUE WHERE id = ?");
                    $la_upd->execute([$pay['loan_application_id']]);
                }
            }

            // If this payment is for a Service Case, update case status & trigger franchise commission!
            if (!empty($pay['case_id'])) {
                $case_upd = $pdo->prepare("UPDATE cases SET payment_status = 'verified', current_stage = 'Payment Verified' WHERE id = ?");
                $case_upd->execute([$pay['case_id']]);

                // Calculate franchise commission if linked
                if (!empty($pay['franchise_id'])) {
                    FranchiseEngine::process_service_commission($pay['case_id']);
                }
            }

            return ['status' => true, 'message' => 'Payment verified successfully and relevant services/scorecards unlocked.'];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Payment verification error: ' . $e->getMessage()];
        }
    }
}
