<?php
// CRM Lead Management Engine - Phase 3 (Perfex-Style Architecture)
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

class LeadManager {

    // Fetch complete 360° Lead Profile
    public static function get_lead_360($lead_id) {
        global $pdo;

        try {
            $stmt = $pdo->prepare("
                SELECT l.*, 
                       ls.status_name, ls.color_code, 
                       lsrc.source_name, 
                       s.name AS service_name, 
                       lo.scheme_name,
                       u.name AS staff_name, u.email AS staff_email,
                       e.id AS employee_id
                FROM leads l
                LEFT JOIN lead_statuses ls ON l.status_id = ls.id
                LEFT JOIN lead_sources lsrc ON l.source_id = lsrc.id
                LEFT JOIN services s ON l.interested_service_id = s.id
                LEFT JOIN loan_schemes lo ON l.interested_loan_scheme_id = lo.id
                LEFT JOIN employees e ON l.assigned_employee_id = e.id
                LEFT JOIN users u ON e.user_id = u.id
                WHERE l.id = ?
            ");
            $stmt->execute([(int)$lead_id]);
            $lead = $stmt->fetch();

            if (!$lead) {
                return ['status' => false, 'message' => 'Lead record not found.'];
            }

            // Fetch Internal Notes
            $notes_stmt = $pdo->prepare("
                SELECT n.*, u.name AS author_name
                FROM lead_notes n
                LEFT JOIN users u ON n.created_by = u.id
                WHERE n.lead_id = ?
                ORDER BY n.id DESC
            ");
            $notes_stmt->execute([(int)$lead_id]);
            $notes = $notes_stmt->fetchAll();

            // Fetch Reminders
            $rem_stmt = $pdo->prepare("
                SELECT r.*, u.name AS staff_name, c.name AS creator_name
                FROM lead_reminders r
                LEFT JOIN employees e ON r.assigned_staff_id = e.id
                LEFT JOIN users u ON e.user_id = u.id
                LEFT JOIN users c ON r.created_by = c.id
                WHERE r.lead_id = ?
                ORDER BY r.reminder_date ASC, r.reminder_time ASC
            ");
            $rem_stmt->execute([(int)$lead_id]);
            $reminders = $rem_stmt->fetchAll();

            // Fetch Followups History
            $fol_stmt = $pdo->prepare("
                SELECT f.*, u.name AS staff_name
                FROM followups f
                LEFT JOIN employees e ON f.assigned_employee_id = e.id
                LEFT JOIN users u ON e.user_id = u.id
                WHERE f.lead_id = ?
                ORDER BY f.id DESC
            ");
            $fol_stmt->execute([(int)$lead_id]);
            $followups = $fol_stmt->fetchAll();

            // Fetch File Attachments
            $att_stmt = $pdo->prepare("
                SELECT a.*, u.name AS uploader_name
                FROM lead_attachments a
                LEFT JOIN users u ON a.uploaded_by = u.id
                WHERE a.lead_id = ?
                ORDER BY a.id DESC
            ");
            $att_stmt->execute([(int)$lead_id]);
            $attachments = $att_stmt->fetchAll();

            // Fetch Activity Timeline
            $act_stmt = $pdo->prepare("
                SELECT a.*, u.name AS staff_name
                FROM lead_activities a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE a.lead_id = ?
                ORDER BY a.id DESC
            ");
            $act_stmt->execute([(int)$lead_id]);
            $activities = $act_stmt->fetchAll();

            // Fetch Linked Tasks
            $task_stmt = $pdo->prepare("SELECT * FROM tasks WHERE lead_id = ? ORDER BY due_date ASC");
            $task_stmt->execute([(int)$lead_id]);
            $tasks = $task_stmt->fetchAll();

            // Fetch Tags & Custom Fields
            $tags = class_exists('TagEngine') ? TagEngine::get_tags('lead', $lead_id) : [];
            $custom_fields = class_exists('CustomFieldsEngine') ? CustomFieldsEngine::get_values('leads', $lead_id) : [];

            return [
                'status' => true,
                'lead' => $lead,
                'notes' => $notes,
                'reminders' => $reminders,
                'followups' => $followups,
                'attachments' => $attachments,
                'activities' => $activities,
                'tasks' => $tasks,
                'tags' => $tags,
                'custom_fields' => $custom_fields
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Failed to fetch lead profile: ' . $e->getMessage()];
        }
    }

    // Create a new Lead
    public static function create_lead($data, $created_by = 0) {
        global $pdo;

        try {
            $name = sanitize($data['name'] ?? '');
            $first_name = sanitize($data['first_name'] ?? '');
            $last_name = sanitize($data['last_name'] ?? '');
            if (empty($name)) {
                $name = trim($first_name . ' ' . $last_name);
            }
            $mobile = sanitize($data['mobile'] ?? '');
            $email = sanitize($data['email'] ?? '');
            $title = sanitize($data['title'] ?? '');
            $company = sanitize($data['company'] ?? ($data['business_name'] ?? ''));
            $whatsapp_number = sanitize($data['whatsapp_number'] ?? '');
            $state = sanitize($data['state'] ?? 'Rajasthan');
            $district = sanitize($data['district'] ?? 'Jaipur');
            $address = sanitize($data['address'] ?? '');
            $lead_value = (float)($data['lead_value'] ?? 0);
            $service_id = !empty($data['interested_service_id']) ? (int)$data['interested_service_id'] : null;
            $scheme_id = !empty($data['interested_loan_scheme_id']) ? (int)$data['interested_loan_scheme_id'] : null;
            $loan_amount = (float)($data['required_loan_amount'] ?? 0);
            $source_id = !empty($data['source_id']) ? (int)$data['source_id'] : 1;
            $source_detail = sanitize($data['source_detail'] ?? 'Direct');
            $assigned_employee_id = !empty($data['assigned_employee_id']) ? (int)$data['assigned_employee_id'] : null;
            $status_id = !empty($data['status_id']) ? (int)$data['status_id'] : 1;
            $priority = sanitize($data['priority'] ?? 'medium');
            $temperature = sanitize($data['temperature'] ?? 'warm');
            $gstin = sanitize($data['gstin'] ?? '');
            $pan = sanitize($data['pan'] ?? '');
            $website = sanitize($data['website'] ?? '');

            if (empty($name) || empty($mobile)) {
                return ['status' => false, 'message' => 'Lead Name and Mobile Number are required.'];
            }

            // Check duplicate mobile
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

            $stmt = $pdo->prepare("
                INSERT INTO leads (
                    lead_code, name, first_name, last_name, title, mobile, whatsapp_number, email, 
                    business_name, company, state, district, address, lead_value,
                    interested_service_id, interested_loan_scheme_id, required_loan_amount,
                    source_id, source_detail, assigned_employee_id, status_id, priority, temperature,
                    gstin, pan, website
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $lead_code, $name, $first_name, $last_name, $title, $mobile, $whatsapp_number, $email,
                $company, $company, $state, $district, $address, $lead_value,
                $service_id, $scheme_id, $loan_amount,
                $source_id, $source_detail, $assigned_employee_id, $status_id, $priority, $temperature,
                $gstin, $pan, $website
            ]);

            $lead_id = $pdo->lastInsertId();

            // Sync Tags if passed
            if (!empty($data['tags']) && class_exists('TagEngine')) {
                TagEngine::sync_tags('lead', $lead_id, $data['tags']);
            }

            // Save Custom Fields if passed
            if (!empty($data['custom_fields']) && class_exists('CustomFieldsEngine')) {
                CustomFieldsEngine::save_values('leads', $lead_id, $data['custom_fields']);
            }

            // Log activity
            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'created', 'New Lead Registered', ?)");
            $act->execute([$lead_id, $created_by, "Registered lead {$lead_code} - {$name} (Value: ₹" . number_format($lead_value, 2) . ")"]);

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

    // Update Lead Details
    public static function update_lead($lead_id, $data, $updated_by = 0) {
        global $pdo;

        try {
            $lead_id = (int)$lead_id;
            $name = sanitize($data['name'] ?? '');
            $title = sanitize($data['title'] ?? '');
            $company = sanitize($data['company'] ?? '');
            $mobile = sanitize($data['mobile'] ?? '');
            $whatsapp_number = sanitize($data['whatsapp_number'] ?? '');
            $email = sanitize($data['email'] ?? '');
            $lead_value = (float)($data['lead_value'] ?? 0);
            $state = sanitize($data['state'] ?? '');
            $district = sanitize($data['district'] ?? '');
            $address = sanitize($data['address'] ?? '');
            $source_id = !empty($data['source_id']) ? (int)$data['source_id'] : 1;
            $status_id = !empty($data['status_id']) ? (int)$data['status_id'] : 1;
            $assigned_employee_id = !empty($data['assigned_employee_id']) ? (int)$data['assigned_employee_id'] : null;
            $priority = sanitize($data['priority'] ?? 'medium');
            $temperature = sanitize($data['temperature'] ?? 'warm');
            $gstin = sanitize($data['gstin'] ?? '');
            $pan = sanitize($data['pan'] ?? '');
            $website = sanitize($data['website'] ?? '');

            $stmt = $pdo->prepare("
                UPDATE leads SET
                    name = ?, title = ?, company = ?, business_name = ?, mobile = ?, whatsapp_number = ?, email = ?,
                    lead_value = ?, state = ?, district = ?, address = ?, source_id = ?, status_id = ?,
                    assigned_employee_id = ?, priority = ?, temperature = ?, gstin = ?, pan = ?, website = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([
                $name, $title, $company, $company, $mobile, $whatsapp_number, $email,
                $lead_value, $state, $district, $address, $source_id, $status_id,
                $assigned_employee_id, $priority, $temperature, $gstin, $pan, $website,
                $lead_id
            ]);

            // Sync Tags & Custom Fields
            if (isset($data['tags']) && class_exists('TagEngine')) {
                TagEngine::sync_tags('lead', $lead_id, $data['tags']);
            }
            if (isset($data['custom_fields']) && class_exists('CustomFieldsEngine')) {
                CustomFieldsEngine::save_values('leads', $lead_id, $data['custom_fields']);
            }

            // Log activity
            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'updated', 'Lead Information Updated', 'Profile details updated.')");
            $act->execute([$lead_id, $updated_by]);

            return ['status' => true, 'message' => 'Lead details updated successfully.'];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Lead update failed: ' . $e->getMessage()];
        }
    }

    // Update Status Pipeline
    public static function update_status($lead_id, $status_id, $user_id = 0) {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE leads SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([(int)$status_id, (int)$lead_id]);

            $s = $pdo->query("SELECT status_name FROM lead_statuses WHERE id = " . (int)$status_id)->fetchColumn();
            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'status_change', 'Status Changed', ?)");
            $act->execute([(int)$lead_id, $user_id, "Lead status changed to {$s}."]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Update Source
    public static function update_source($lead_id, $source_id, $user_id = 0) {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE leads SET source_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([(int)$source_id, (int)$lead_id]);

            $src = $pdo->query("SELECT source_name FROM lead_sources WHERE id = " . (int)$source_id)->fetchColumn();
            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'source_change', 'Source Changed', ?)");
            $act->execute([(int)$lead_id, $user_id, "Lead source changed to {$src}."]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Assign Staff Officer
    public static function assign_staff($lead_id, $staff_id, $assigned_by = 0) {
        global $pdo;
        try {
            $staff_id = $staff_id ? (int)$staff_id : null;
            $stmt = $pdo->prepare("UPDATE leads SET assigned_employee_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$staff_id, (int)$lead_id]);

            $staff_name = 'Unassigned';
            if ($staff_id) {
                $staff_name = $pdo->query("SELECT u.name FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = {$staff_id}")->fetchColumn() ?: 'Staff Officer';
            }

            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'assignment', 'Staff Assigned', ?)");
            $act->execute([(int)$lead_id, $assigned_by, "Assigned officer updated to {$staff_name}."]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Add Internal Note
    public static function add_note($lead_id, $note, $created_by = 0) {
        global $pdo;
        try {
            $note = sanitize($note);
            if (empty($note)) return false;

            $stmt = $pdo->prepare("INSERT INTO lead_notes (lead_id, note, created_by) VALUES (?, ?, ?)");
            $stmt->execute([(int)$lead_id, $note, $created_by]);

            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'note', 'Internal Staff Note', ?)");
            $act->execute([(int)$lead_id, $created_by, $note]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Delete Internal Note
    public static function delete_note($note_id, $lead_id) {
        global $pdo;
        try {
            $stmt = $pdo->prepare("DELETE FROM lead_notes WHERE id = ? AND lead_id = ?");
            $stmt->execute([(int)$note_id, (int)$lead_id]);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Add Scheduled Reminder
    public static function add_reminder($lead_id, $data, $created_by = 0) {
        global $pdo;
        try {
            $r_date = sanitize($data['reminder_date'] ?? '');
            $r_time = sanitize($data['reminder_time'] ?? '10:00:00');
            $desc = sanitize($data['description'] ?? '');
            $staff_id = !empty($data['assigned_staff_id']) ? (int)$data['assigned_staff_id'] : $created_by;

            if (empty($r_date) || empty($desc)) return false;

            $stmt = $pdo->prepare("
                INSERT INTO lead_reminders (lead_id, reminder_date, reminder_time, description, assigned_staff_id, created_by)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([(int)$lead_id, $r_date, $r_time, $desc, $staff_id, $created_by]);

            // Update next followup date on lead
            $pdo->prepare("UPDATE leads SET next_followup_date = ?, next_followup_time = ? WHERE id = ?")
                ->execute([$r_date, $r_time, (int)$lead_id]);

            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'reminder', 'Reminder Scheduled', ?)");
            $act->execute([(int)$lead_id, $created_by, "Scheduled for {$r_date} {$r_time}: {$desc}"]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Log Interaction / Call / Meeting
    public static function log_followup($lead_id, $data, $user_id = 0) {
        global $pdo;
        try {
            $type = sanitize($data['followup_type'] ?? 'Call');
            $result = sanitize($data['followup_result'] ?? '');
            $response = sanitize($data['customer_response'] ?? '');
            $next_action = sanitize($data['next_action'] ?? '');
            $next_date = !empty($data['next_followup_date']) ? sanitize($data['next_followup_date']) : null;

            $stmt = $pdo->prepare("
                INSERT INTO followups (
                    lead_id, assigned_employee_id, followup_type, followup_date, followup_time,
                    notes, followup_result, customer_response, next_action, next_followup_date, status
                ) VALUES (?, ?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?, ?, 'completed')
            ");
            $stmt->execute([(int)$lead_id, $user_id, $type, $result, $result, $response, $next_action, $next_date]);

            // Update last_contacted_at on lead
            $pdo->prepare("UPDATE leads SET last_contacted_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([(int)$lead_id]);

            if ($next_date) {
                self::add_reminder((int)$lead_id, [
                    'reminder_date' => $next_date,
                    'reminder_time' => '11:00:00',
                    'description' => "Next Action: {$next_action}",
                    'assigned_staff_id' => $user_id
                ], $user_id);
            }

            $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'followup', ?, ?)");
            $act->execute([(int)$lead_id, $user_id, "{$type} Interaction Logged", "Outcome: {$result} | Next Step: {$next_action}"]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Convert Lead to Customer (360 Degree View Anchor)
    public static function convert_lead_to_customer($lead_id, $password = 'Customer@123') {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = ?");
            $stmt->execute([(int)$lead_id]);
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
                    INSERT INTO customers (
                        user_id, customer_code, lead_id, customer_type, first_name, last_name, company_name,
                        name, mobile, whatsapp_number, email, state, district, address, country,
                        gstin, pan, website, assigned_staff_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $c_ins->execute([
                    $user_id, $cust_code, $lead_id, 
                    !empty($lead['company']) ? 'business' : 'individual',
                    $lead['first_name'] ?: '', $lead['last_name'] ?: '', $lead['company'] ?: '',
                    $lead['name'], $lead['mobile'], $lead['whatsapp_number'] ?: '', $lead['email'],
                    $lead['state'] ?? 'Rajasthan', $lead['district'] ?? 'Jaipur', $lead['address'] ?: '', 'India',
                    $lead['gstin'] ?: '', $lead['pan'] ?: '', $lead['website'] ?: '', $lead['assigned_employee_id']
                ]);
                $customer_id = $pdo->lastInsertId();

                // Create default business profile if company exists
                if (!empty($lead['company']) || !empty($lead['business_name'])) {
                    $b_name = $lead['company'] ?: $lead['business_name'];
                    $bp_ins = $pdo->prepare("INSERT INTO customer_business_profiles (customer_id, business_name, gstin) VALUES (?, ?, ?)");
                    $bp_ins->execute([$customer_id, $b_name, $lead['gstin'] ?: '']);
                }
            }

            // Update Lead Status to Converted (Status ID 17 or Status Key 'converted')
            try {
                $s_stmt = $pdo->query("SELECT id FROM lead_statuses WHERE status_key = 'converted' OR id = 17 OR status_name LIKE '%Converted%' LIMIT 1");
                $conv_status_id = $s_stmt ? $s_stmt->fetchColumn() : 17;
                
                if ($conv_status_id) {
                    $upd_lead = $pdo->prepare("UPDATE leads SET status_id = ? WHERE id = ?");
                    $upd_lead->execute([$conv_status_id, $lead_id]);
                }
            } catch (Exception $status_ex) {}

            // Log activity
            try {
                $act = $pdo->prepare("INSERT INTO lead_activities (lead_id, user_id, activity_type, title, description) VALUES (?, ?, 'converted', 'Lead Converted to Customer', ?)");
                $act->execute([$lead_id, 1, 'Converted to Customer Profile ID: ' . $customer_id]);
            } catch (Exception $act_ex) {}

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
