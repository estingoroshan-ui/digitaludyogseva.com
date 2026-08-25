<?php
// Franchise Network & Commission Engine
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

class FranchiseEngine {

    // Calculate & Record Commission for a Service Case
    public static function process_service_commission($case_id) {
        global $pdo;

        try {
            $stmt = $pdo->prepare("
                SELECT c.*, s.govt_fee, s.prof_fee, s.final_price, s.franchise_commission_type, s.franchise_commission_value,
                       f.id AS franchise_id, f.franchise_type_id, f.wallet_balance
                FROM cases c
                JOIN services s ON c.service_id = s.id
                JOIN franchises f ON c.franchise_id = f.id
                WHERE c.id = ?
            ");
            $stmt->execute([$case_id]);
            $case = $stmt->fetch();

            if (!$case || empty($case['franchise_id'])) {
                return ['status' => false, 'message' => 'No franchise linked to this case.'];
            }

            // Check if commission already logged for this case
            $chk = $pdo->prepare("SELECT id FROM commission_transactions WHERE case_id = ?");
            $chk->execute([$case_id]);
            if ($chk->fetch()) {
                return ['status' => false, 'message' => 'Commission already processed for this case.'];
            }

            $gross_amount = (float)$case['total_amount'];
            $govt_fee = (float)$case['govt_fee'];
            $prof_fee = (float)$case['prof_fee'];

            $comm_type = $case['franchise_commission_type'] ?? 'fixed';
            $comm_val = (float)($case['franchise_commission_value'] ?? 0);
            $commission_amount = 0.00;

            if ($comm_type === 'percentage') {
                $commission_amount = ($gross_amount * $comm_val) / 100;
            } else {
                $commission_amount = $comm_val;
            }

            $tds = ($commission_amount * 5.0) / 100; // 5% TDS
            $net_commission = $commission_amount - $tds;

            $tx_code = generate_code('COMM', 6);

            $ins = $pdo->prepare("
                INSERT INTO commission_transactions (
                    transaction_code, franchise_id, customer_id, service_id, case_id,
                    gross_amount, govt_fee, prof_fee, commission_type, commission_rate,
                    commission_amount, tds_amount, net_commission, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
            ");
            $ins->execute([
                $tx_code, $case['franchise_id'], $case['customer_id'], $case['service_id'], $case['id'],
                $gross_amount, $govt_fee, $prof_fee, $comm_type, $comm_val,
                $commission_amount, $tds, $net_commission
            ]);

            // Update Franchise Wallet Balance
            $upd_wallet = $pdo->prepare("UPDATE franchises SET wallet_balance = wallet_balance + ? WHERE id = ?");
            $upd_wallet->execute([$net_commission, $case['franchise_id']]);

            return [
                'status' => true,
                'transaction_code' => $tx_code,
                'commission_amount' => $commission_amount,
                'net_commission' => $net_commission
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Commission processing failed: ' . $e->getMessage()];
        }
    }

    // Submit Withdrawal Request
    public static function request_withdrawal($franchise_id, $amount) {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT wallet_balance, bank_name, account_no, ifsc, upi_id FROM franchises WHERE id = ?");
            $stmt->execute([$franchise_id]);
            $fr = $stmt->fetch();

            if (!$fr) {
                return ['status' => false, 'message' => 'Franchise not found.'];
            }

            if ((float)$amount > (float)$fr['wallet_balance'] || (float)$amount <= 0) {
                return ['status' => false, 'message' => 'Insufficient wallet balance or invalid amount.'];
            }

            $bank_snapshot = json_encode([
                'bank_name' => $fr['bank_name'],
                'account_no' => $fr['account_no'],
                'ifsc' => $fr['ifsc'],
                'upi_id' => $fr['upi_id']
            ]);

            $w_code = generate_code('WTH', 6);

            $ins = $pdo->prepare("
                INSERT INTO commission_withdrawals (withdrawal_code, franchise_id, requested_amount, bank_details_snapshot, status)
                VALUES (?, ?, ?, ?, 'pending')
            ");
            $ins->execute([$w_code, $franchise_id, $amount, $bank_snapshot]);

            // Deduct balance temporarily or place hold
            $upd = $pdo->prepare("UPDATE franchises SET wallet_balance = wallet_balance - ? WHERE id = ?");
            $upd->execute([$amount, $franchise_id]);

            return ['status' => true, 'message' => 'Withdrawal request submitted successfully.', 'withdrawal_code' => $w_code];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Withdrawal error: ' . $e->getMessage()];
        }
    }
}
