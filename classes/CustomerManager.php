<?php
// Customer 360-Degree Unified View Engine
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

class CustomerManager {

    // Fetch complete 360 profile data for a single customer
    public static function get_360_profile($customer_id) {
        global $pdo;

        try {
            // 1. Core Profile
            $c_stmt = $pdo->prepare("
                SELECT c.*, u.status AS user_status, l.lead_code, l.source_id, ls.source_name
                FROM customers c
                JOIN users u ON c.user_id = u.id
                LEFT JOIN leads l ON c.lead_id = l.id
                LEFT JOIN lead_sources ls ON l.source_id = ls.id
                WHERE c.id = ?
            ");
            $c_stmt->execute([$customer_id]);
            $customer = $c_stmt->fetch();

            if (!$customer) {
                return ['status' => false, 'message' => 'Customer profile not found.'];
            }

            // 2. Business Profile
            $b_stmt = $pdo->prepare("SELECT * FROM customer_business_profiles WHERE customer_id = ?");
            $b_stmt->execute([$customer_id]);
            $business = $b_stmt->fetchAll();

            // 3. Service Cases
            $case_stmt = $pdo->prepare("
                SELECT cs.*, s.name AS service_name, f.business_name AS franchise_name, e.department
                FROM cases cs
                LEFT JOIN services s ON cs.service_id = s.id
                LEFT JOIN franchises f ON cs.franchise_id = f.id
                LEFT JOIN employees e ON cs.assigned_staff_id = e.id
                WHERE cs.customer_id = ?
                ORDER BY cs.id DESC
            ");
            $case_stmt->execute([$customer_id]);
            $cases = $case_stmt->fetchAll();

            // 4. Loan Applications & Scorecards
            $loan_stmt = $pdo->prepare("
                SELECT la.*, ls.scheme_name, sc.total_score, sc.result_category, sc.payment_status AS scorecard_payment
                FROM loan_applications la
                LEFT JOIN loan_schemes ls ON la.scheme_id = ls.id
                LEFT JOIN scorecards sc ON la.id = sc.loan_application_id
                WHERE la.customer_id = ?
                ORDER BY la.id DESC
            ");
            $loan_stmt->execute([$customer_id]);
            $loans = $loan_stmt->fetchAll();

            // 5. Vault Documents
            $doc_stmt = $pdo->prepare("
                SELECT d.*, dt.name AS doc_type_name
                FROM documents d
                LEFT JOIN document_types dt ON d.document_type_id = dt.id
                WHERE d.customer_id = ?
                ORDER BY d.id DESC
            ");
            $doc_stmt->execute([$customer_id]);
            $documents = $doc_stmt->fetchAll();

            // 6. Payments History
            $pay_stmt = $pdo->prepare("SELECT * FROM payments WHERE customer_id = ? ORDER BY id DESC");
            $pay_stmt->execute([$customer_id]);
            $payments = $pay_stmt->fetchAll();

            // 7. Appointments Schedule
            $app_stmt = $pdo->prepare("
                SELECT a.*, u.name AS staff_name
                FROM appointments a
                LEFT JOIN employees e ON a.staff_id = e.id
                LEFT JOIN users u ON e.user_id = u.id
                WHERE a.customer_id = ?
                ORDER BY a.appointment_date DESC
            ");
            $app_stmt->execute([$customer_id]);
            $appointments = $app_stmt->fetchAll();

            // 8. Support Tickets
            $tkt_stmt = $pdo->prepare("SELECT * FROM support_tickets WHERE customer_id = ? ORDER BY id DESC");
            $tkt_stmt->execute([$customer_id]);
            $tickets = $tkt_stmt->fetchAll();

            return [
                'status' => true,
                'customer' => $customer,
                'business_profiles' => $business,
                'cases' => $cases,
                'loans' => $loans,
                'documents' => $documents,
                'payments' => $payments,
                'appointments' => $appointments,
                'tickets' => $tickets
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Profile fetch error: ' . $e->getMessage()];
        }
    }
}
