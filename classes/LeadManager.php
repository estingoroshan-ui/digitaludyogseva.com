<?php
// CRM Lead Management Engine
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

class LeadManager {

    // Create a new Lead
    public static function create_lead($data) {
        global $pdo;

        try {
            $name = sanitize($data['name'] ?? '');
            $mobile = sanitize($data['mobile'] ?? '');
            $email = sanitize($data['email'] ?? '');
            $state = sanitize($data['state'] ?? 'Rajasthan');
            $district = sanitize($data['district'] ?? 'Jaipur');
            $business_name = sanitize($data['business_name'] ?? '');
            $service_id = !empty($data['interested_service_id']) ? (int)$data['interested_service_id'] : null;
            $scheme_id = !empty($data['interested_loan_scheme_id']) ? (int)$data['interested_loan_scheme_id'] : null;
            $loan_amount = (float)($data['required_loan_amount'] ?? 0);
            $source_id = !empty($data['source_id']) ? (int)$data['source_id'] : 1;
            $source_detail = sanitize($data['source_detail'] ?? '');
            $franchise_id = !empty($data['franchise_id']) ? (int)$data['franchise_id'] : null;
            $priority = sanitize($data['priority'] ?? 'medium');
            $temperature = sanitize($data['temperature'] ?? 'warm');

            if (empty($name) || empty($mobile)) {
                return ['status' => false, 'message' => 'Name and Mobile number are required.'];
            }

            // Check for existing lead with same mobile
            $chk = $pdo->prepare("SELECT id, lead_code FROM leads WHERE mobile = ?");
            $chk->execute([$mobile]);
            $existing = $chk->fetch();

            if ($existing) {
                return [
                    'status' => true,
                    'is_duplicate' => true,
                    'lead_id' => $existing['id'],
                    'lead_code' => $existing['lead_code'],
                    'message' => 'Lead already exists with this mobile number.'
                ];
            }

            $lead_code = generate_code('LEAD', 6);
            $default_status_id = 1; // New Lead

            $stmt = $pdo->prepare("
                INSERT INTO leads (
                    lead_code, name, mobile, email, state, district, business_name,
                    interested_service_id, interested_loan_scheme_id, required_loan_amount,
                    source_id, source_detail, franchise_id, status_id, priority, temperature
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $lead_code, $name, $mobile, $email, $state, $district, $business_name,
                $service_id, $scheme_id, $loan_amount, $source_id, $source_detail, $franchise_id, $default_status_id,
                $priority, $temperature
            ]);

            $lead_id = $pdo->lastInsertId();

            // Log activity
            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, activity_type, title, description) VALUES (?, 'created', 'New Lead Created', ?)");
            $act->execute([$lead_id, 'Lead registered via portal/form submission. Detail: ' . ($source_detail ?: 'Direct')]);

            return [
                'status' => true,
                'lead_id' => $lead_id,
                'lead_code' => $lead_code,
                'message' => 'Lead created successfully.'
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Lead creation failed: ' . $e->getMessage()];
        }
    }

    // Capture website public forms automatically
    public static function capture_website_lead($name, $mobile, $email = '', $business = '', $form_name = 'Website Inquiry', $loan_amount = 0) {
        // Source 4 = Website in lead_sources table
        return self::create_lead([
            'name' => $name,
            'mobile' => $mobile,
            'email' => $email,
            'business_name' => $business,
            'source_id' => 4,
            'source_detail' => $form_name,
            'required_loan_amount' => $loan_amount,
            'temperature' => 'hot',
            'priority' => 'high'
        ]);
    }

    // Convert Lead to Customer (360 Degree View Anchor)
    public static function convert_lead_to_customer($lead_id, $password = 'Customer@123') {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = ?");
            $stmt->execute([$lead_id]);
            $lead = $stmt->fetch();

            if (!$lead) {
                return ['status' => false, 'message' => 'Lead not found.'];
            }

            // Check if user already exists
            $u_chk = $pdo->prepare("SELECT id FROM users WHERE email = ? OR mobile = ?");
            $u_chk->execute([$lead['email'] ?: $lead['mobile'] . '@digitaludyogseva.com', $lead['mobile']]);
            $existing_user = $u_chk->fetch();

            if ($existing_user) {
                $user_id = $existing_user['id'];
            } else {
                $pass_hash = password_hash($password, PASSWORD_BCRYPT);
                $u_ins = $pdo->prepare("
                    INSERT INTO users (user_type, name, email, mobile, password_hash, status)
                    VALUES ('customer', ?, ?, ?, ?, 'active')
                ");
                $u_ins->execute([$lead['name'], $lead['email'] ?: $lead['mobile'] . '@digitaludyogseva.com', $lead['mobile'], $pass_hash]);
                $user_id = $pdo->lastInsertId();
            }

            // Check if customer profile exists
            $c_chk = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
            $c_chk->execute([$user_id]);
            $existing_cust = $c_chk->fetch();

            if ($existing_cust) {
                $customer_id = $existing_cust['id'];
            } else {
                $cust_code = generate_code('CUST', 6);
                $c_ins = $pdo->prepare("
                    INSERT INTO customers (user_id, customer_code, lead_id, name, mobile, email, state, district, city, pincode, address)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $c_ins->execute([
                    $user_id, $cust_code, $lead_id, $lead['name'], $lead['mobile'], $lead['email'],
                    $lead['state'], $lead['district'], $lead['city'], $lead['pincode'], $lead['address']
                ]);
                $customer_id = $pdo->lastInsertId();

                // Create default business profile if business name exists
                if (!empty($lead['business_name'])) {
                    $bp_ins = $pdo->prepare("INSERT INTO customer_business_profiles (customer_id, business_name) VALUES (?, ?)");
                    $bp_ins->execute([$customer_id, $lead['business_name']]);
                }
            }

            // Update Lead Status to Converted (Status ID 17 = Converted Customer)
            $upd_lead = $pdo->prepare("UPDATE leads SET status_id = 17 WHERE id = ?");
            $upd_lead->execute([$lead_id]);

            // Log activity
            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, activity_type, title, description) VALUES (?, 'converted', 'Lead Converted to Customer', ?)");
            $act->execute([$lead_id, 'Customer ID: ' . $customer_id]);

            return [
                'status' => true,
                'customer_id' => $customer_id,
                'user_id' => $user_id,
                'message' => 'Lead converted to Customer successfully.'
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Lead conversion failed: ' . $e->getMessage()];
        }
    }
}
