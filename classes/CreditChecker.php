<?php
// CIBIL & Credit Bureau Integration Interface & Fallback Engine
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

interface CreditProviderInterface {
    public function fetch_credit_score($pan, $mobile, $name, $consent_id);
}

class ManualCreditVerificationProvider implements CreditProviderInterface {
    public function fetch_credit_score($pan, $mobile, $name, $consent_id) {
        // Fallback provider for manual credit check verification
        return [
            'status' => 'Verification Requested',
            'score' => null,
            'provider' => 'Manual Bureau Assessment',
            'remarks' => 'Consent logged. Credit document review requested by DUS advisory team.'
        ];
    }
}

class CreditChecker {
    
    // Log explicit customer consent
    public static function log_consent($customer_id, $loan_application_id = null) {
        global $pdo;

        try {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $stmt = $pdo->prepare("
                INSERT INTO credit_consents (customer_id, loan_application_id, consent_given, consent_text_version, ip_address)
                VALUES (?, ?, TRUE, 'v1.0', ?)
            ");
            $stmt->execute([$customer_id, $loan_application_id, $ip]);
            return $pdo->lastInsertId();
        } catch (Exception $e) {
            return false;
        }
    }

    // Initiate or update Credit Check record
    public static function initiate_check($customer_id, $loan_application_id = null) {
        global $pdo;

        try {
            $consent_id = self::log_consent($customer_id, $loan_application_id);
            if (!$consent_id) {
                return ['status' => false, 'message' => 'Failed to record user consent.'];
            }

            // Check if customer PAN exists
            $c_stmt = $pdo->prepare("SELECT name, pan, mobile FROM customers WHERE id = ?");
            $c_stmt->execute([$customer_id]);
            $cust = $c_stmt->fetch();

            $provider = new ManualCreditVerificationProvider();
            $result = $provider->fetch_credit_score($cust['pan'] ?? '', $cust['mobile'] ?? '', $cust['name'] ?? '', $consent_id);

            $ref_id = generate_code('CRE', 6);
            $ins = $pdo->prepare("
                INSERT INTO credit_checks (customer_id, loan_application_id, consent_id, provider, request_reference_id, score, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $ins->execute([$customer_id, $loan_application_id, $consent_id, $result['provider'], $ref_id, $result['score'], $result['status']]);

            return [
                'status' => true,
                'check_id' => $pdo->lastInsertId(),
                'reference_id' => $ref_id,
                'verification_status' => $result['status']
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Credit check error: ' . $e->getMessage()];
        }
    }
}
