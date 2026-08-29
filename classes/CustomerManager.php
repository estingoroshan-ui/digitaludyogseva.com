<?php
// Customer 360-Degree Unified View Engine - Phase 2 Extended
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/TagEngine.php';
require_once __DIR__ . '/CustomFieldsEngine.php';
require_once __DIR__ . '/ActivityLogger.php';

class CustomerManager {

    // Fetch complete 360 profile data for a single customer
    public static function get_360_profile($customer_id) {
        global $pdo;
        if (!$pdo) return ['status' => false, 'message' => 'Database connection failed.'];

        try {
            // 1. Core Customer Profile
            $c_stmt = $pdo->prepare("
                SELECT c.*, u.status AS user_status, u.created_at AS user_created_at,
                       l.lead_code, l.source_id, ls.source_name,
                       su.name AS assigned_staff_name, su.email AS assigned_staff_email
                FROM customers c
                JOIN users u ON c.user_id = u.id
                LEFT JOIN leads l ON c.lead_id = l.id
                LEFT JOIN lead_sources ls ON l.source_id = ls.id
                LEFT JOIN employees e ON c.assigned_staff_id = e.id
                LEFT JOIN users su ON e.user_id = su.id
                WHERE c.id = ?
            ");
            $c_stmt->execute([$customer_id]);
            $customer = $c_stmt->fetch();

            if (!$customer) {
                return ['status' => false, 'message' => 'Customer profile not found.'];
            }

            // 2. Business Profile
            $business = [];
            try {
                $b_stmt = $pdo->prepare("SELECT * FROM customer_business_profiles WHERE customer_id = ? ORDER BY id DESC");
                $b_stmt->execute([$customer_id]);
                $business = $b_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 3. Customer Contacts
            $contacts = [];
            try {
                $cnt_stmt = $pdo->prepare("SELECT * FROM customer_contacts WHERE customer_id = ? ORDER BY is_primary DESC, id ASC");
                $cnt_stmt->execute([$customer_id]);
                $contacts = $cnt_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 4. Service Cases
            $cases = [];
            try {
                $case_stmt = $pdo->prepare("
                    SELECT cs.*, s.name AS service_name, f.business_name AS franchise_name, u.name AS staff_name
                    FROM cases cs
                    LEFT JOIN services s ON cs.service_id = s.id
                    LEFT JOIN franchises f ON cs.franchise_id = f.id
                    LEFT JOIN employees e ON cs.assigned_staff_id = e.id
                    LEFT JOIN users u ON e.user_id = u.id
                    WHERE cs.customer_id = ?
                    ORDER BY cs.id DESC
                ");
                $case_stmt->execute([$customer_id]);
                $cases = $case_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 5. Loan Applications & Scorecards
            $loans = [];
            try {
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
            } catch (Throwable $e) {}

            // 6. Invoices
            $invoices = [];
            try {
                $inv_stmt = $pdo->prepare("
                    SELECT inv.*, p.payment_code, p.payment_mode
                    FROM invoices inv
                    LEFT JOIN payments p ON inv.payment_id = p.id
                    WHERE inv.customer_id = ?
                    ORDER BY inv.id DESC
                ");
                $inv_stmt->execute([$customer_id]);
                $invoices = $inv_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 7. Payments History
            $payments = [];
            try {
                $pay_stmt = $pdo->prepare("SELECT * FROM payments WHERE customer_id = ? ORDER BY id DESC");
                $pay_stmt->execute([$customer_id]);
                $payments = $pay_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 8. Vault Documents
            $documents = [];
            try {
                $doc_stmt = $pdo->prepare("
                    SELECT d.*, dt.name AS doc_type_name, u.name AS uploader_name
                    FROM documents d
                    LEFT JOIN document_types dt ON d.document_type_id = dt.id
                    LEFT JOIN users u ON d.uploaded_by = u.id
                    WHERE d.customer_id = ?
                    ORDER BY d.id DESC
                ");
                $doc_stmt->execute([$customer_id]);
                $documents = $doc_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 9. Internal Notes
            $notes = [];
            try {
                $note_stmt = $pdo->prepare("
                    SELECT n.*, u.name AS author_name
                    FROM customer_notes n
                    LEFT JOIN users u ON n.created_by = u.id
                    WHERE n.customer_id = ?
                    ORDER BY n.is_pinned DESC, n.id DESC
                ");
                $note_stmt->execute([$customer_id]);
                $notes = $note_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 10. Reminders
            $reminders = [];
            try {
                $rem_stmt = $pdo->prepare("
                    SELECT r.*, su.name AS staff_name, cu.name AS creator_name
                    FROM customer_reminders r
                    LEFT JOIN employees e ON r.assigned_staff_id = e.id
                    LEFT JOIN users su ON e.user_id = su.id
                    LEFT JOIN users cu ON r.created_by = cu.id
                    WHERE r.customer_id = ?
                    ORDER BY r.reminder_date DESC, r.reminder_time DESC
                ");
                $rem_stmt->execute([$customer_id]);
                $reminders = $rem_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 11. Email History Logs
            $emails = [];
            try {
                $em_stmt = $pdo->prepare("
                    SELECT e.*, u.name AS sender_name
                    FROM customer_emails e
                    LEFT JOIN users u ON e.sent_by = u.id
                    WHERE e.customer_id = ?
                    ORDER BY e.id DESC
                ");
                $em_stmt->execute([$customer_id]);
                $emails = $em_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 12. Appointments
            $appointments = [];
            try {
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
            } catch (Throwable $e) {}

            // 13. Support Tickets
            $tickets = [];
            try {
                $tkt_stmt = $pdo->prepare("SELECT * FROM support_tickets WHERE customer_id = ? ORDER BY id DESC");
                $tkt_stmt->execute([$customer_id]);
                $tickets = $tkt_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 14. Activity Log Timeline
            $activity_logs = [];
            try {
                $act_stmt = $pdo->prepare("
                    SELECT al.*, u.name AS staff_name
                    FROM activity_logs al
                    LEFT JOIN users u ON al.user_id = u.id
                    WHERE (al.module = 'customer' AND al.record_id = ?)
                       OR (al.details LIKE ?)
                    ORDER BY al.id DESC
                    LIMIT 50
                ");
                $act_stmt->execute([$customer_id, "%customer #{$customer_id}%"]);
                $activity_logs = $act_stmt->fetchAll();
            } catch (Throwable $e) {}

            // 15. Tags & Custom Fields
            $tags = [];
            $custom_fields = [];
            try {
                $tags = TagEngine::get_for_entity('customer', $customer_id);
            } catch (Throwable $e) {}
            try {
                $custom_fields = CustomFieldsEngine::get_values_for('customers', $customer_id);
            } catch (Throwable $e) {}

            // Financial & Case Overview Summary Calculation
            $total_cases = count($cases);
            $open_cases = count(array_filter($cases, fn($c) => in_array($c['status'], ['active', 'on_hold'])));
            $total_loans = count($loans);
            $active_loans = count(array_filter($loans, fn($l) => !in_array($l['status_stage'], ['Rejected', 'Cancelled', 'Closed'])));
            
            $total_invoiced = array_reduce($invoices, fn($sum, $i) => $sum + (float)$i['total_amount'], 0.0);
            $total_paid = array_reduce($payments, fn($sum, $p) => $p['status'] === 'paid' ? $sum + (float)$p['amount'] : $sum, 0.0);
            $outstanding_amount = max(0, $total_invoiced - $total_paid);

            $last_payment_date = !empty($payments) ? date('d-m-Y', strtotime($payments[0]['created_at'])) : 'N/A';
            $last_activity_date = !empty($activity_logs) ? date('d-m-Y H:i', strtotime($activity_logs[0]['created_at'])) : date('d-m-Y H:i', strtotime($customer['created_at']));

            return [
                'status' => true,
                'customer' => $customer,
                'business_profiles' => $business,
                'contacts' => $contacts,
                'cases' => $cases,
                'loans' => $loans,
                'invoices' => $invoices,
                'payments' => $payments,
                'documents' => $documents,
                'notes' => $notes,
                'reminders' => $reminders,
                'emails' => $emails,
                'appointments' => $appointments,
                'tickets' => $tickets,
                'activity_logs' => $activity_logs,
                'tags' => $tags,
                'custom_fields' => $custom_fields,
                'summary' => [
                    'total_cases' => $total_cases,
                    'open_cases' => $open_cases,
                    'total_loans' => $total_loans,
                    'active_loans' => $active_loans,
                    'total_invoiced' => $total_invoiced,
                    'total_paid' => $total_paid,
                    'outstanding_amount' => $outstanding_amount,
                    'last_payment_date' => $last_payment_date,
                    'last_activity_date' => $last_activity_date
                ]
            ];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Profile fetch error: ' . $e->getMessage()];
        }
    }

    // Duplicate Detection Helper
    public static function find_duplicates($mobile, $email = '', $gstin = '', $pan = '', $exclude_id = 0) {
        global $pdo;
        if (!$pdo) return [];

        try {
            $sql = "
                SELECT c.id, c.customer_code, c.name, c.mobile, c.email, c.pan, c.gstin, u.status AS user_status
                FROM customers c
                JOIN users u ON c.user_id = u.id
                WHERE (
                    (c.mobile = ? AND ? != '')
                    OR (c.email = ? AND ? != '')
                    OR (c.gstin = ? AND ? != '')
                    OR (c.pan = ? AND ? != '')
                )
            ";
            $params = [$mobile, $mobile, $email, $email, $gstin, $gstin, $pan, $pan];

            if ($exclude_id > 0) {
                $sql .= " AND c.id != ?";
                $params[] = $exclude_id;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }

    // Delete Safety Verification
    public static function can_delete($customer_id) {
        global $pdo;
        if (!$pdo) return ['can_delete' => false, 'reason' => 'Database error'];

        try {
            $cases = (int)$pdo->query("SELECT COUNT(*) FROM cases WHERE customer_id = " . (int)$customer_id)->fetchColumn();
            $loans = (int)$pdo->query("SELECT COUNT(*) FROM loan_applications WHERE customer_id = " . (int)$customer_id)->fetchColumn();
            $payments = (int)$pdo->query("SELECT COUNT(*) FROM payments WHERE customer_id = " . (int)$customer_id)->fetchColumn();
            $invoices = (int)$pdo->query("SELECT COUNT(*) FROM invoices WHERE customer_id = " . (int)$customer_id)->fetchColumn();
            $tickets = (int)$pdo->query("SELECT COUNT(*) FROM support_tickets WHERE customer_id = " . (int)$customer_id)->fetchColumn();

            $total_linked = $cases + $loans + $payments + $invoices + $tickets;

            if ($total_linked > 0) {
                return [
                    'can_delete' => false,
                    'reason' => "Cannot hard delete customer! Linked records found: {$cases} Cases, {$loans} Loans, {$payments} Payments, {$invoices} Invoices, {$tickets} Support Tickets. Deactivate/archive account instead to preserve financial audit history.",
                    'counts' => compact('cases', 'loans', 'payments', 'invoices', 'tickets')
                ];
            }

            return ['can_delete' => true, 'reason' => 'No critical financial history linked. Safe to delete.'];
        } catch (Exception $e) {
            return ['can_delete' => false, 'reason' => $e->getMessage()];
        }
    }

    // Add New Contact for Customer
    public static function add_contact($customer_id, $data) {
        global $pdo;
        if (!$pdo || empty($customer_id) || empty($data['first_name'])) {
            return ['status' => false, 'message' => 'First Name is required.'];
        }

        try {
            $is_primary = !empty($data['is_primary']) ? 1 : 0;
            if ($is_primary) {
                $upd = $pdo->prepare("UPDATE customer_contacts SET is_primary = 0 WHERE customer_id = ?");
                $upd->execute([$customer_id]);
            }

            $permissions = isset($data['portal_permissions']) ? json_encode((array)$data['portal_permissions']) : json_encode([]);

            $stmt = $pdo->prepare("
                INSERT INTO customer_contacts (customer_id, first_name, last_name, job_position, email, phone, whatsapp, department, is_primary, status, portal_permissions, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $customer_id,
                sanitize($data['first_name']),
                sanitize($data['last_name'] ?? ''),
                sanitize($data['job_position'] ?? ''),
                sanitize($data['email'] ?? ''),
                sanitize($data['phone'] ?? ''),
                sanitize($data['whatsapp'] ?? ''),
                sanitize($data['department'] ?? ''),
                $is_primary,
                sanitize($data['status'] ?? 'active'),
                $permissions
            ]);

            $contact_id = $pdo->lastInsertId();
            ActivityLogger::log('add_contact', 'customer', $customer_id, "Added contact {$data['first_name']} {$data['last_name']}");
            return ['status' => true, 'contact_id' => $contact_id];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Add contact error: ' . $e->getMessage()];
        }
    }

    // Set Primary Contact
    public static function set_primary_contact($customer_id, $contact_id) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $pdo->prepare("UPDATE customer_contacts SET is_primary = 0 WHERE customer_id = ?")->execute([$customer_id]);
            $pdo->prepare("UPDATE customer_contacts SET is_primary = 1 WHERE id = ? AND customer_id = ?")->execute([$contact_id, $customer_id]);
            ActivityLogger::log('set_primary_contact', 'customer', $customer_id, "Updated primary contact to #{$contact_id}");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Delete Contact
    public static function delete_contact($contact_id, $customer_id) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $stmt = $pdo->prepare("DELETE FROM customer_contacts WHERE id = ? AND customer_id = ?");
            $stmt->execute([$contact_id, $customer_id]);
            ActivityLogger::log('delete_contact', 'customer', $customer_id, "Deleted contact #{$contact_id}");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Add Internal Note
    public static function add_note($customer_id, $note, $created_by, $is_pinned = 0) {
        global $pdo;
        if (!$pdo || empty($note)) return false;
        try {
            $stmt = $pdo->prepare("INSERT INTO customer_notes (customer_id, note, is_pinned, created_by, created_at) VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([$customer_id, trim($note), $is_pinned ? 1 : 0, $created_by]);
            ActivityLogger::log('add_note', 'customer', $customer_id, "Added internal note");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Delete Note
    public static function delete_note($note_id, $customer_id) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $stmt = $pdo->prepare("DELETE FROM customer_notes WHERE id = ? AND customer_id = ?");
            $stmt->execute([$note_id, $customer_id]);
            ActivityLogger::log('delete_note', 'customer', $customer_id, "Deleted note #{$note_id}");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Toggle Pin Note
    public static function toggle_pin_note($note_id, $customer_id) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $stmt = $pdo->prepare("UPDATE customer_notes SET is_pinned = IF(is_pinned = 1, 0, 1) WHERE id = ? AND customer_id = ?");
            $stmt->execute([$note_id, $customer_id]);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Add Staff Reminder
    public static function add_reminder($customer_id, $data, $created_by) {
        global $pdo;
        if (!$pdo || empty($data['reminder_date']) || empty($data['description'])) return false;
        try {
            $stmt = $pdo->prepare("
                INSERT INTO customer_reminders (customer_id, reminder_date, reminder_time, description, assigned_staff_id, send_notification, send_email, status, created_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
            ");
            $stmt->execute([
                $customer_id,
                sanitize($data['reminder_date']),
                sanitize($data['reminder_time'] ?? '10:00:00'),
                sanitize($data['description']),
                (int)($data['assigned_staff_id'] ?? $created_by),
                !empty($data['send_notification']) ? 1 : 0,
                !empty($data['send_email']) ? 1 : 0,
                $created_by
            ]);
            ActivityLogger::log('add_reminder', 'customer', $customer_id, "Created reminder for " . $data['reminder_date']);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Update Reminder Status
    public static function update_reminder_status($reminder_id, $customer_id, $status) {
        global $pdo;
        if (!$pdo) return false;
        try {
            $stmt = $pdo->prepare("UPDATE customer_reminders SET status = ? WHERE id = ? AND customer_id = ?");
            $stmt->execute([sanitize($status), $reminder_id, $customer_id]);
            ActivityLogger::log('update_reminder', 'customer', $customer_id, "Updated reminder #{$reminder_id} status to {$status}");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    // Assign Customer to Staff
    public static function assign_staff($customer_id, $staff_id, $assigned_by, $notes = '') {
        global $pdo;
        if (!$pdo || empty($customer_id)) return false;
        try {
            $upd = $pdo->prepare("UPDATE customers SET assigned_staff_id = ? WHERE id = ?");
            $upd->execute([$staff_id ?: null, $customer_id]);

            if ($staff_id) {
                $ins = $pdo->prepare("INSERT INTO customer_assignments (customer_id, staff_id, assigned_by, notes, created_at) VALUES (?, ?, ?, ?, NOW())");
                $ins->execute([$customer_id, $staff_id, $assigned_by, sanitize($notes)]);
            }

            ActivityLogger::log('assign_staff', 'customer', $customer_id, "Assigned staff #{$staff_id} to customer");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
