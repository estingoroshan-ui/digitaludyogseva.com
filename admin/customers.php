<?php
$page_title = "Customer Master Directory";
$active_menu = "customers";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/CustomerManager.php';
require_once __DIR__ . '/../classes/TagEngine.php';
require_once __DIR__ . '/../classes/CustomFieldsEngine.php';

global $pdo;

require_login(['admin', 'staff']);

$current_user = get_current_user_data();
$current_user_id = $current_user['id'] ?? 0;
$is_admin = (($current_user['role_id'] ?? 0) == 1 || ($current_user['role_key'] ?? '') === 'super_admin' || ($current_user['user_type'] ?? '') === 'admin');

// Staff Role Scoping: View Own Customers check
$view_all = check_permission('customers_view') || $is_admin;
$view_own = check_permission('customers_view_own');

if (!$view_all && !$view_own) {
    require_permission('customers_view');
}

// Fetch Staff Employees List for Dropdowns
$staff_members = $pdo->query("
    SELECT e.id AS employee_id, u.name AS staff_name, u.email
    FROM employees e
    JOIN users u ON e.user_id = u.id
    WHERE u.status = 'active'
    ORDER BY u.name ASC
")->fetchAll();

// Fetch All Tags
$all_tags = TagEngine::get_all();

$msg = '';
$msg_type = 'success';
$duplicate_warning = null;

// =========================================================================
// POST REQUEST HANDLERS
// =========================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $msg = "CSRF verification failed.";
        $msg_type = "danger";
    } else {
        $action = $_POST['action'];

        // --- 1. TOGGLE STATUS ---
        if ($action === 'toggle_status') {
            $cust_id = (int)($_POST['customer_id'] ?? 0);
            $new_status = ($_POST['status'] ?? '') === 'active' ? 'active' : 'inactive';
            
            if ($cust_id > 0) {
                $stmt = $pdo->prepare("UPDATE users u JOIN customers c ON c.user_id = u.id SET u.status = ? WHERE c.id = ?");
                $stmt->execute([$new_status, $cust_id]);
                ActivityLogger::log('update_status', 'customer', $cust_id, "Changed status to {$new_status}");
                
                if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'status' => $new_status]);
                    exit;
                }
                $msg = "Customer status updated to " . ucfirst($new_status) . ".";
            }
        }

        // --- 2. ADD / EDIT CUSTOMER ---
        elseif ($action === 'save_customer') {
            $cust_id = (int)($_POST['customer_id'] ?? 0);
            $customer_type = sanitize($_POST['customer_type'] ?? 'individual');
            $first_name = sanitize($_POST['first_name'] ?? '');
            $middle_name = sanitize($_POST['middle_name'] ?? '');
            $last_name = sanitize($_POST['last_name'] ?? '');
            $company_name = sanitize($_POST['company_name'] ?? '');
            
            // Build full name
            $name_parts = array_filter([$first_name, $middle_name, $last_name]);
            $name = !empty($name_parts) ? implode(' ', $name_parts) : ($company_name ?: 'Valued Customer');
            if ($customer_type === 'business' && !empty($company_name)) {
                $name = $company_name;
            }

            $mobile = sanitize($_POST['mobile'] ?? '');
            $alt_mobile = sanitize($_POST['alt_mobile'] ?? '');
            $whatsapp_number = sanitize($_POST['whatsapp_number'] ?? $mobile);
            $email = sanitize($_POST['email'] ?? '');
            $pan = strtoupper(sanitize($_POST['pan'] ?? ''));
            $gstin = strtoupper(sanitize($_POST['gstin'] ?? ''));
            $dob = sanitize($_POST['dob'] ?? '') ?: null;
            $gender = sanitize($_POST['gender'] ?? 'male');
            $preferred_language = sanitize($_POST['preferred_language'] ?? 'en');
            $customer_source = sanitize($_POST['customer_source'] ?? 'Direct');
            $assigned_staff_id = (int)($_POST['assigned_staff_id'] ?? 0) ?: null;

            $address_line_1 = sanitize($_POST['address_line_1'] ?? '');
            $address_line_2 = sanitize($_POST['address_line_2'] ?? '');
            $area = sanitize($_POST['area'] ?? '');
            $city = sanitize($_POST['city'] ?? 'Jaipur');
            $district = sanitize($_POST['district'] ?? 'Jaipur');
            $state = sanitize($_POST['state'] ?? 'Rajasthan');
            $country = sanitize($_POST['country'] ?? 'India');
            $pincode = sanitize($_POST['pincode'] ?? '');
            $address = implode(', ', array_filter([$address_line_1, $address_line_2, $area, $city, $district, $state, $pincode]));

            $business_type = sanitize($_POST['business_type'] ?? '');
            $industry = sanitize($_POST['industry'] ?? '');
            $website = sanitize($_POST['website'] ?? '');
            $description = sanitize($_POST['description'] ?? '');
            $internal_notes = sanitize($_POST['internal_notes'] ?? '');
            $override_duplicate = !empty($_POST['override_duplicate']);

            // Duplicate Detection
            if (!$override_duplicate && $cust_id === 0) {
                $dups = CustomerManager::find_duplicates($mobile, $email, $gstin, $pan, $cust_id);
                if (!empty($dups)) {
                    $duplicate_warning = $dups;
                }
            }

            if (empty($duplicate_warning)) {
                if ($cust_id > 0) {
                    // Update Customer
                    $upd_c = $pdo->prepare("
                        UPDATE customers SET 
                            customer_type = ?, first_name = ?, middle_name = ?, last_name = ?, company_name = ?,
                            name = ?, mobile = ?, alt_mobile = ?, whatsapp_number = ?, email = ?, pan = ?, gstin = ?,
                            dob = ?, gender = ?, preferred_language = ?, customer_source = ?, assigned_staff_id = ?,
                            address_line_1 = ?, address_line_2 = ?, area = ?, city = ?, district = ?, state = ?, country = ?, pincode = ?, address = ?,
                            business_type = ?, industry = ?, website = ?, description = ?, internal_notes = ?
                        WHERE id = ?
                    ");
                    $upd_c->execute([
                        $customer_type, $first_name, $middle_name, $last_name, $company_name,
                        $name, $mobile, $alt_mobile, $whatsapp_number, $email, $pan, $gstin,
                        $dob, $gender, $preferred_language, $customer_source, $assigned_staff_id,
                        $address_line_1, $address_line_2, $area, $city, $district, $state, $country, $pincode, $address,
                        $business_type, $industry, $website, $description, $internal_notes,
                        $cust_id
                    ]);

                    // Update corresponding user record
                    $cust_rec = $pdo->query("SELECT user_id FROM customers WHERE id = {$cust_id}")->fetch();
                    if ($cust_rec) {
                        $upd_u = $pdo->prepare("UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?");
                        $upd_u->execute([$name, $email ?: ($mobile . '@digitaludyogseva.com'), $mobile, $cust_rec['user_id']]);
                    }

                    // Save Business Profile
                    if (!empty($company_name)) {
                        $bp_stmt = $pdo->prepare("
                            INSERT INTO customer_business_profiles (customer_id, business_name, gstin, industry)
                            VALUES (?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE business_name = VALUES(business_name), gstin = VALUES(gstin), industry = VALUES(industry)
                        ");
                        $bp_stmt->execute([$cust_id, $company_name, $gstin, $industry]);
                    }

                    CustomFieldsEngine::save_values('customers', $cust_id, $_POST['custom_fields'] ?? []);
                    TagEngine::sync_tags('customer', $cust_id, $_POST['tags'] ?? []);

                    ActivityLogger::log('update_customer', 'customer', $cust_id, "Updated customer profile for {$name}");
                    $msg = "Customer profile for <strong>" . htmlspecialchars($name) . "</strong> updated successfully!";
                } else {
                    // Create New Customer
                    $pass_hash = password_hash('Customer@123', PASSWORD_BCRYPT);
                    $u_ins = $pdo->prepare("INSERT INTO users (user_type, name, email, mobile, password_hash, status) VALUES ('customer', ?, ?, ?, ?, 'active')");
                    $u_ins->execute([$name, $email ?: ($mobile . '@digitaludyogseva.com'), $mobile, $pass_hash]);
                    $user_id = $pdo->lastInsertId();

                    $cust_code = generate_code('CUST', 6);
                    $c_ins = $pdo->prepare("
                        INSERT INTO customers (
                            user_id, customer_code, customer_type, first_name, middle_name, last_name, company_name,
                            name, mobile, alt_mobile, whatsapp_number, email, pan, gstin, dob, gender, preferred_language, customer_source, assigned_staff_id,
                            address_line_1, address_line_2, area, city, district, state, country, pincode, address,
                            business_type, industry, website, description, internal_notes
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $c_ins->execute([
                        $user_id, $cust_code, $customer_type, $first_name, $middle_name, $last_name, $company_name,
                        $name, $mobile, $alt_mobile, $whatsapp_number, $email, $pan, $gstin, $dob, $gender, $preferred_language, $customer_source, $assigned_staff_id,
                        $address_line_1, $address_line_2, $area, $city, $district, $state, $country, $pincode, $address,
                        $business_type, $industry, $website, $description, $internal_notes
                    ]);
                    $new_cust_id = $pdo->lastInsertId();

                    if (!empty($company_name)) {
                        $bp_ins = $pdo->prepare("INSERT INTO customer_business_profiles (customer_id, business_name, gstin, industry) VALUES (?, ?, ?, ?)");
                        $bp_ins->execute([$new_cust_id, $company_name, $gstin, $industry]);
                    }

                    CustomFieldsEngine::save_values('customers', $new_cust_id, $_POST['custom_fields'] ?? []);
                    TagEngine::sync_tags('customer', $new_cust_id, $_POST['tags'] ?? []);

                    ActivityLogger::log('create_customer', 'customer', $new_cust_id, "Created new customer {$name} ({$cust_code})");
                    $msg = "New Customer <strong>" . htmlspecialchars($name) . "</strong> (" . $cust_code . ") registered successfully!";
                }
            }
        }

        // --- 3. ADD CONTACT ---
        elseif ($action === 'add_contact') {
            $cust_id = (int)$_POST['customer_id'];
            $res = CustomerManager::add_contact($cust_id, $_POST);
            if ($res['status']) {
                $msg = "New contact added successfully!";
            } else {
                $msg = $res['message'];
                $msg_type = 'danger';
            }
        }

        // --- 4. DELETE CONTACT ---
        elseif ($action === 'delete_contact') {
            $contact_id = (int)$_POST['contact_id'];
            $cust_id = (int)$_POST['customer_id'];
            CustomerManager::delete_contact($contact_id, $cust_id);
            $msg = "Contact deleted successfully.";
        }

        // --- 5. SET PRIMARY CONTACT ---
        elseif ($action === 'set_primary_contact') {
            $contact_id = (int)$_POST['contact_id'];
            $cust_id = (int)$_POST['customer_id'];
            CustomerManager::set_primary_contact($cust_id, $contact_id);
            $msg = "Primary contact updated.";
        }

        // --- 6. ADD NOTE ---
        elseif ($action === 'add_note') {
            $cust_id = (int)$_POST['customer_id'];
            $note = trim($_POST['note'] ?? '');
            $is_pinned = !empty($_POST['is_pinned']) ? 1 : 0;
            if (CustomerManager::add_note($cust_id, $note, $current_user_id, $is_pinned)) {
                $msg = "Internal note added.";
            } else {
                $msg = "Note content cannot be empty.";
                $msg_type = "danger";
            }
        }

        // --- 7. DELETE NOTE ---
        elseif ($action === 'delete_note') {
            $note_id = (int)$_POST['note_id'];
            $cust_id = (int)$_POST['customer_id'];
            CustomerManager::delete_note($note_id, $cust_id);
            $msg = "Internal note deleted.";
        }

        // --- 8. TOGGLE PIN NOTE ---
        elseif ($action === 'toggle_pin_note') {
            $note_id = (int)$_POST['note_id'];
            $cust_id = (int)$_POST['customer_id'];
            CustomerManager::toggle_pin_note($note_id, $cust_id);
            $msg = "Note pin status updated.";
        }

        // --- 9. ADD REMINDER ---
        elseif ($action === 'add_reminder') {
            $cust_id = (int)$_POST['customer_id'];
            if (CustomerManager::add_reminder($cust_id, $_POST, $current_user_id)) {
                $msg = "Reminder created successfully.";
            } else {
                $msg = "Failed to create reminder. Date and description required.";
                $msg_type = "danger";
            }
        }

        // --- 10. UPDATE REMINDER STATUS ---
        elseif ($action === 'update_reminder_status') {
            $reminder_id = (int)$_POST['reminder_id'];
            $cust_id = (int)$_POST['customer_id'];
            $status = sanitize($_POST['status']);
            CustomerManager::update_reminder_status($reminder_id, $cust_id, $status);
            $msg = "Reminder status updated to {$status}.";
        }

        // --- 11. ASSIGN STAFF ---
        elseif ($action === 'assign_staff') {
            $cust_id = (int)$_POST['customer_id'];
            $staff_id = (int)$_POST['assigned_staff_id'];
            $notes = sanitize($_POST['assignment_notes'] ?? '');
            CustomerManager::assign_staff($cust_id, $staff_id, $current_user_id, $notes);
            $msg = "Assigned staff updated.";
        }

        // --- 12. UPLOAD DOCUMENT ---
        elseif ($action === 'upload_document') {
            $cust_id = (int)$_POST['customer_id'];
            $description = sanitize($_POST['description'] ?? '');
            
            if (isset($_FILES['document_file']) && $_FILES['document_file']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['document_file'];
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
                
                if (!in_array($ext, $allowed)) {
                    $msg = "Invalid file type. Executable or script files are strictly blocked. Allowed: PDF, JPG, PNG, DOCX, XLSX.";
                    $msg_type = "danger";
                } else {
                    $upload_dir = __DIR__ . '/../uploads/documents/';
                    if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

                    $stored_name = 'doc_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    $target_path = $upload_dir . $stored_name;

                    if (move_uploaded_file($file['tmp_name'], $target_path)) {
                        $rel_path = 'uploads/documents/' . $stored_name;
                        $ins = $pdo->prepare("
                            INSERT INTO documents (customer_id, file_path, file_name, file_size, file_type, description, original_filename, uploaded_by, verification_status, created_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Uploaded', NOW())
                        ");
                        $ins->execute([$cust_id, $rel_path, $stored_name, $file['size'], $ext, $description, sanitize($file['name']), $current_user_id]);
                        ActivityLogger::log('upload_document', 'customer', $cust_id, "Uploaded document {$file['name']}");
                        $msg = "Document uploaded successfully!";
                    } else {
                        $msg = "Failed to save uploaded file.";
                        $msg_type = "danger";
                    }
                }
            } else {
                $msg = "Please select a valid document file.";
                $msg_type = "danger";
            }
        }

        // --- 13. DELETE DOCUMENT ---
        elseif ($action === 'delete_document') {
            $doc_id = (int)$_POST['doc_id'];
            $cust_id = (int)$_POST['customer_id'];
            $doc = $pdo->query("SELECT * FROM documents WHERE id = {$doc_id} AND customer_id = {$cust_id}")->fetch();
            if ($doc) {
                if (file_exists(__DIR__ . '/../' . $doc['file_path'])) {
                    @unlink(__DIR__ . '/../' . $doc['file_path']);
                }
                $pdo->prepare("DELETE FROM documents WHERE id = ?")->execute([$doc_id]);
                ActivityLogger::log('delete_document', 'customer', $cust_id, "Deleted document #{$doc_id}");
                $msg = "Document deleted.";
            }
        }

        // --- 14. DELETE CUSTOMER ---
        elseif ($action === 'delete_customer') {
            if (!$is_admin && !check_permission('customers_delete')) {
                $msg = "Permission denied. You do not have permission to delete customer records.";
                $msg_type = "danger";
            } else {
                $cust_id = (int)$_POST['customer_id'];
                $check = CustomerManager::can_delete($cust_id);
                if (!$check['can_delete']) {
                    $msg = $check['reason'];
                    $msg_type = "danger";
                } else {
                    $c_user = $pdo->query("SELECT user_id, name FROM customers WHERE id = {$cust_id}")->fetch();
                    if ($c_user) {
                        $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$c_user['user_id']]);
                        $pdo->prepare("DELETE FROM customers WHERE id = ?")->execute([$cust_id]);
                        ActivityLogger::log('delete_customer', 'customer', $cust_id, "Deleted customer {$c_user['name']}");
                        $msg = "Customer record deleted cleanly.";
                    }
                }
            }
        }
    }
}

// =========================================================================
// FETCH DIRECTORY & METRICS DATA
// =========================================================================
$selected_customer_id = (int)($_GET['id'] ?? 0);
$profile_data = null;

if ($selected_customer_id) {
    $profile_data = CustomerManager::get_360_profile($selected_customer_id);
}

// Base SQL query for directory list
$where_clauses = ["1=1"];
$params = [];

if (!$view_all && $view_own) {
    // Find staff employee id for current user
    $emp_id = $pdo->query("SELECT id FROM employees WHERE user_id = {$current_user_id}")->fetchColumn() ?: 0;
    $where_clauses[] = "c.assigned_staff_id = ?";
    $params[] = $emp_id;
}

$where_sql = implode(' AND ', $where_clauses);

// Fetch Metrics Counters
try {
    $total_customers = (int)$pdo->query("SELECT COUNT(*) FROM customers c WHERE {$where_sql}")->fetchColumn();
    $active_customers = (int)$pdo->query("SELECT COUNT(*) FROM customers c JOIN users u ON c.user_id = u.id WHERE u.status = 'active' AND {$where_sql}")->fetchColumn();
    $inactive_customers = (int)$pdo->query("SELECT COUNT(*) FROM customers c JOIN users u ON c.user_id = u.id WHERE u.status = 'inactive' AND {$where_sql}")->fetchColumn();
    $new_this_month = (int)$pdo->query("SELECT COUNT(*) FROM customers c WHERE MONTH(c.created_at) = MONTH(CURRENT_DATE()) AND YEAR(c.created_at) = YEAR(CURRENT_DATE()) AND {$where_sql}")->fetchColumn();
    $open_cases_cust = (int)$pdo->query("SELECT COUNT(DISTINCT customer_id) FROM cases WHERE status IN ('active', 'on_hold')")->fetchColumn();
    $outstanding_pay_cust = (int)$pdo->query("SELECT COUNT(DISTINCT customer_id) FROM cases WHERE payment_status IN ('unpaid', 'partially_paid')")->fetchColumn();
} catch (Throwable $e_stats) {
    ensure_phase2_customer_tables_exist($pdo);
    $total_customers = 0; $active_customers = 0; $inactive_customers = 0;
    $new_this_month = 0; $open_cases_cust = 0; $outstanding_pay_cust = 0;
}

// Fetch Directory List
try {
    $customers_query = $pdo->prepare("
        SELECT c.*, u.status AS user_status, u.created_at AS user_created_at,
               su.name AS assigned_staff_name,
               (SELECT business_name FROM customer_business_profiles WHERE customer_id = c.id ORDER BY id ASC LIMIT 1) AS business_name_record,
               (SELECT COUNT(*) FROM cases WHERE customer_id = c.id) AS case_count,
               (SELECT COUNT(*) FROM loan_applications WHERE customer_id = c.id) AS loan_count,
               (SELECT COALESCE(SUM(total_amount), 0) FROM cases WHERE customer_id = c.id AND payment_status != 'paid') AS outstanding_amount
        FROM customers c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN employees e ON c.assigned_staff_id = e.id
        LEFT JOIN users su ON e.user_id = su.id
        WHERE {$where_sql}
        ORDER BY c.id DESC
    ");
    $customers_query->execute($params);
    $customers = $customers_query->fetchAll();
} catch (Throwable $e_query) {
    ensure_phase2_customer_tables_exist($pdo);
    try {
        $customers_query = $pdo->prepare("
            SELECT c.*, u.status AS user_status, u.created_at AS user_created_at,
                   '' AS assigned_staff_name,
                   '' AS business_name_record,
                   (SELECT COUNT(*) FROM cases WHERE customer_id = c.id) AS case_count,
                   (SELECT COUNT(*) FROM loan_applications WHERE customer_id = c.id) AS loan_count,
                   0.00 AS outstanding_amount
            FROM customers c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.id DESC
        ");
        $customers_query->execute();
        $customers = $customers_query->fetchAll();
    } catch (Throwable $e_fallback) {
        $customers = [];
    }
}
?>

<!-- ALERT MESSAGE DISPLAY -->
<?php if (!empty($msg)): ?>
    <div class="alert alert-<?php echo $msg_type; ?> alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4 p-3" role="alert">
        <i class="bi bi-info-circle-fill me-2"></i> <?php echo $msg; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<!-- DUPLICATE WARNING MODAL IF TRIGGERED -->
<?php if (!empty($duplicate_warning)): ?>
    <div class="card border-danger border-2 shadow-lg rounded-4 p-4 mb-4 bg-white">
        <h5 class="fw-bold text-danger mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i> Possible Duplicate Customer Found!</h5>
        <p class="text-muted small mb-3">Matching customer records detected in the system. Please inspect existing profiles before creating a new duplicate record.</p>
        <div class="table-responsive mb-3">
            <table class="table table-bordered align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>GSTIN / PAN</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($duplicate_warning as $dup): ?>
                        <tr>
                            <td class="fw-bold text-primary"><?php echo htmlspecialchars($dup['customer_code']); ?></td>
                            <td class="fw-bold"><?php echo htmlspecialchars($dup['name']); ?></td>
                            <td><?php echo htmlspecialchars($dup['mobile']); ?></td>
                            <td><?php echo htmlspecialchars($dup['email']); ?></td>
                            <td><?php echo htmlspecialchars($dup['gstin'] ?: ($dup['pan'] ?: 'N/A')); ?></td>
                            <td>
                                <a href="customers.php?id=<?php echo $dup['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-3">Open Profile 360°</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <form action="" method="POST" class="d-inline">
            <?php render_csrf_field(); ?>
            <?php foreach ($_POST as $k => $v): ?>
                <?php if (is_array($v)): ?>
                    <?php foreach ($v as $subk => $subv): ?>
                        <input type="hidden" name="<?php echo htmlspecialchars($k); ?>[<?php echo htmlspecialchars($subk); ?>]" value="<?php echo htmlspecialchars($subv); ?>">
                    <?php endforeach; ?>
                <?php else: ?>
                    <input type="hidden" name="<?php echo htmlspecialchars($k); ?>" value="<?php echo htmlspecialchars($v); ?>">
                <?php endif; ?>
            <?php endforeach; ?>
            <input type="hidden" name="override_duplicate" value="1">
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold text-dark"><i class="bi bi-check-circle me-1"></i> Proceed & Create Anyway (Authorized Staff)</button>
                <a href="customers.php" class="btn btn-light rounded-pill px-4">Cancel</a>
            </div>
        </form>
    </div>
<?php endif; ?>

<!-- PAGE TOP BAR -->
<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1">Customers & Contacts Directory</h4>
        <p class="text-muted small mb-0">
            <span class="text-primary fw-bold">Contacts</span> <i class="bi bi-chevron-right mx-1 small"></i> Unified Customer Master & 360° Account Management
        </p>
    </div>
    <div class="d-flex flex-wrap align-items-center gap-2">
        <?php if (check_permission('customers_create') || $is_admin): ?>
            <button class="btn btn-dark rounded-pill fw-bold px-3 py-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#saveCustomerModal" onclick="prepareAddModal();">
                <i class="bi bi-plus-lg me-1"></i> + Add New Customer
            </button>
        <?php endif; ?>
        <button class="btn btn-outline-secondary rounded-pill fw-bold px-3 py-2 bg-white shadow-sm" data-bs-toggle="modal" data-bs-target="#importCustomerModal">
            <i class="bi bi-box-arrow-in-down me-1"></i> Import Customers
        </button>
        <button class="btn btn-outline-secondary rounded-pill fw-bold px-3 py-2 bg-white shadow-sm" type="button" data-bs-toggle="collapse" data-bs-target="#filterPanel">
            <i class="bi bi-funnel me-1"></i> Advanced Filters
        </button>
    </div>
</div>

<!-- 6 KPI SUMMARY METRIC CARDS -->
<div class="row g-3 mb-4">
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 text-center h-100">
            <h4 class="fw-bold text-dark mb-1"><?php echo number_format($total_customers); ?></h4>
            <small class="text-muted fw-semibold">Total Customers</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 text-center h-100 border-start border-4 border-success">
            <h4 class="fw-bold text-success mb-1"><?php echo number_format($active_customers); ?></h4>
            <small class="text-success fw-semibold">Active Customers</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 text-center h-100 border-start border-4 border-danger">
            <h4 class="fw-bold text-danger mb-1"><?php echo number_format($inactive_customers); ?></h4>
            <small class="text-danger fw-semibold">Inactive Customers</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 text-center h-100 border-start border-4 border-info">
            <h4 class="fw-bold text-info mb-1"><?php echo number_format($new_this_month); ?></h4>
            <small class="text-info fw-semibold">New This Month</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 text-center h-100 border-start border-4 border-primary">
            <h4 class="fw-bold text-primary mb-1"><?php echo number_format($open_cases_cust); ?></h4>
            <small class="text-primary fw-semibold">With Open Cases</small>
        </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 text-center h-100 border-start border-4 border-warning">
            <h4 class="fw-bold text-warning mb-1"><?php echo number_format($outstanding_pay_cust); ?></h4>
            <small class="text-warning text-dark fw-semibold">With Outstanding</small>
        </div>
    </div>
</div>

<!-- ADVANCED FILTERS COLLAPSIBLE -->
<div class="collapse mb-4" id="filterPanel">
    <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
        <h6 class="fw-bold text-dark mb-3"><i class="bi bi-funnel-fill text-primary me-2"></i> Advanced Customer Filters</h6>
        <div class="row g-3">
            <div class="col-md-3">
                <label class="form-label small fw-bold">Customer Status</label>
                <select id="filterStatus" class="form-select rounded-3">
                    <option value="">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label small fw-bold">Customer Type</label>
                <select id="filterType" class="form-select rounded-3">
                    <option value="">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="business">Business / Corporate</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label small fw-bold">Assigned Staff</label>
                <select id="filterStaff" class="form-select rounded-3">
                    <option value="">All Staff Members</option>
                    <?php foreach ($staff_members as $st): ?>
                        <option value="<?php echo htmlspecialchars($st['staff_name']); ?>"><?php echo htmlspecialchars($st['staff_name']); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label small fw-bold">Has Service Cases</label>
                <select id="filterCases" class="form-select rounded-3">
                    <option value="">All</option>
                    <option value="has_cases">Has Open Cases (> 0)</option>
                    <option value="no_cases">No Cases (0)</option>
                </select>
            </div>
        </div>
    </div>
</div>

<!-- 360° DEGREE PROFILE DRAWER / CARD IF SELECTED -->
<?php if ($profile_data && $profile_data['status']): ?>
    <?php 
    $cust = $profile_data['customer'];
    $summary = $profile_data['summary'];
    ?>
    <div class="card border-0 shadow-lg rounded-4 p-4 bg-white mb-5 border-top border-4 border-primary">
        <!-- 360 HEADER -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
            <div>
                <a href="<?php echo BASE_URL; ?>admin/customers.php" class="text-muted small text-decoration-none fw-bold"><i class="bi bi-arrow-left me-1"></i> Back to All Customers</a>
                <div class="d-flex align-items-center gap-2 mt-1">
                    <h3 class="font-heading fw-bold mb-0"><?php echo htmlspecialchars($cust['company_name'] ?: $cust['name']); ?></h3>
                    <span class="badge bg-<?php echo $cust['user_status'] === 'active' ? 'success' : 'danger'; ?> rounded-pill px-3"><?php echo ucfirst($cust['user_status']); ?></span>
                </div>
                <small class="text-muted">
                    Code: <strong><?php echo htmlspecialchars($cust['customer_code']); ?></strong> | 
                    Mobile: <strong><?php echo htmlspecialchars($cust['mobile']); ?></strong> | 
                    Email: <strong><?php echo htmlspecialchars($cust['email']); ?></strong> | 
                    Staff: <strong><?php echo htmlspecialchars($cust['assigned_staff_name'] ?: 'Unassigned'); ?></strong>
                </small>
            </div>
            <!-- QUICK ACTION BUTTONS -->
            <div class="d-flex flex-wrap gap-2">
                <a href="tel:<?php echo htmlspecialchars($cust['mobile']); ?>" class="btn btn-sm btn-outline-success rounded-pill fw-bold px-3"><i class="bi bi-telephone me-1"></i> Call</a>
                <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', $cust['whatsapp_number'] ?: $cust['mobile']); ?>" target="_blank" class="btn btn-sm btn-success rounded-pill fw-bold px-3"><i class="bi bi-whatsapp me-1"></i> WhatsApp</a>
                <button class="btn btn-sm btn-outline-primary rounded-pill fw-bold px-3" data-bs-toggle="modal" data-bs-target="#emailModal"><i class="bi bi-envelope me-1"></i> Email</button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill fw-bold px-3" data-bs-toggle="modal" data-bs-target="#noteModal"><i class="bi bi-journal-plus me-1"></i> Add Note</button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill fw-bold px-3" data-bs-toggle="modal" data-bs-target="#reminderModal"><i class="bi bi-alarm me-1"></i> Add Reminder</button>
                <button class="btn btn-sm btn-outline-dark rounded-pill fw-bold px-3" data-bs-toggle="modal" data-bs-target="#uploadDocModal"><i class="bi bi-upload me-1"></i> Upload File</button>
            </div>
        </div>

        <!-- 360 TABS NAVIGATION -->
        <ul class="nav nav-pills mb-4 gap-2 border-bottom pb-3 flex-nowrap overflow-auto" id="profileTabs" role="tablist">
            <li class="nav-item"><button class="nav-link active rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-overview">Overview</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-contacts">Contacts (<?php echo count($profile_data['contacts']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-cases">Cases (<?php echo count($profile_data['cases']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-loans">Loans (<?php echo count($profile_data['loans']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-invoices">Invoices (<?php echo count($profile_data['invoices']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-payments">Payments (<?php echo count($profile_data['payments']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-documents">Documents (<?php echo count($profile_data['documents']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-notes">Notes (<?php echo count($profile_data['notes']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-reminders">Reminders (<?php echo count($profile_data['reminders']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-emails">Emails (<?php echo count($profile_data['emails']); ?>)</button></li>
            <li class="nav-item"><button class="nav-link rounded-pill fw-bold" data-bs-toggle="tab" data-bs-target="#tab-activity">Activity Log</button></li>
        </ul>

        <!-- 360 TABS CONTENT -->
        <div class="tab-content" id="profileTabsContent">
            <!-- TAB 1: OVERVIEW -->
            <div class="tab-pane fade show active" id="tab-overview">
                <!-- METRICS METERS ROW -->
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="bg-light p-3 rounded-4 text-center">
                            <small class="text-muted fw-bold">Total Invoiced</small>
                            <h5 class="fw-bold text-dark mb-0"><?php echo format_inr($summary['total_invoiced']); ?></h5>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="bg-light p-3 rounded-4 text-center border-start border-4 border-success">
                            <small class="text-success fw-bold">Total Paid</small>
                            <h5 class="fw-bold text-success mb-0"><?php echo format_inr($summary['total_paid']); ?></h5>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="bg-light p-3 rounded-4 text-center border-start border-4 border-danger">
                            <small class="text-danger fw-bold">Outstanding</small>
                            <h5 class="fw-bold text-danger mb-0"><?php echo format_inr($summary['outstanding_amount']); ?></h5>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="bg-light p-3 rounded-4 text-center border-start border-4 border-primary">
                            <small class="text-primary fw-bold">Open Cases / Loans</small>
                            <h5 class="fw-bold text-primary mb-0"><?php echo $summary['open_cases']; ?> Cases / <?php echo $summary['active_loans']; ?> Loans</h5>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="bg-light p-4 rounded-4 h-100">
                            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3"><i class="bi bi-person-badge-fill text-primary me-2"></i> Personal & Location Details</h6>
                            <p class="mb-2"><strong>Full Name:</strong> <?php echo htmlspecialchars($cust['name']); ?></p>
                            <p class="mb-2"><strong>Mobile:</strong> <?php echo htmlspecialchars($cust['mobile']); ?></p>
                            <p class="mb-2"><strong>WhatsApp:</strong> <?php echo htmlspecialchars($cust['whatsapp_number'] ?: 'N/A'); ?></p>
                            <p class="mb-2"><strong>Email:</strong> <?php echo htmlspecialchars($cust['email']); ?></p>
                            <p class="mb-2"><strong>PAN / Aadhaar:</strong> <?php echo htmlspecialchars($cust['pan'] ?: 'N/A'); ?></p>
                            <p class="mb-2"><strong>State / District:</strong> <?php echo htmlspecialchars($cust['state'] . ', ' . $cust['district']); ?></p>
                            <p class="mb-0"><strong>Full Address:</strong> <?php echo htmlspecialchars($cust['address'] ?: 'N/A'); ?></p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="bg-light p-4 rounded-4 h-100">
                            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3"><i class="bi bi-building-fill text-primary me-2"></i> Business & Assignment</h6>
                            <p class="mb-2"><strong>Company Name:</strong> <?php echo htmlspecialchars($cust['company_name'] ?: ($profile_data['business_profiles'][0]['business_name'] ?? 'N/A')); ?></p>
                            <p class="mb-2"><strong>GSTIN:</strong> <?php echo htmlspecialchars($cust['gstin'] ?: 'N/A'); ?></p>
                            <p class="mb-2"><strong>Industry / Type:</strong> <?php echo htmlspecialchars($cust['industry'] ?: 'N/A'); ?></p>
                            <p class="mb-2"><strong>Assigned Staff:</strong> <span class="badge bg-info text-dark rounded-pill px-3"><?php echo htmlspecialchars($cust['assigned_staff_name'] ?: 'Unassigned'); ?></span></p>
                            <p class="mb-2"><strong>Customer Tags:</strong> <?php echo TagEngine::render_badges($profile_data['tags']); ?></p>
                            <p class="mb-0"><strong>Internal Notes:</strong> <?php echo htmlspecialchars($cust['internal_notes'] ?: 'No notes attached.'); ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 2: CONTACTS -->
            <div class="tab-pane fade" id="tab-contacts">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Customer Contact Persons</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#addContactModal"><i class="bi bi-person-plus me-1"></i> Add Contact</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Job Position</th>
                                <th>Email</th>
                                <th>Phone / WhatsApp</th>
                                <th>Primary</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['contacts'])): ?>
                                <tr><td colspan="6" class="text-center py-4 text-muted">No additional contacts registered.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['contacts'] as $cnt): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo htmlspecialchars($cnt['first_name'] . ' ' . $cnt['last_name']); ?></td>
                                        <td><?php echo htmlspecialchars($cnt['job_position'] ?: 'N/A'); ?></td>
                                        <td><?php echo htmlspecialchars($cnt['email'] ?: 'N/A'); ?></td>
                                        <td><?php echo htmlspecialchars($cnt['phone'] ?: 'N/A'); ?></td>
                                        <td>
                                            <?php if ($cnt['is_primary']): ?>
                                                <span class="badge bg-success rounded-pill px-3">Primary Contact</span>
                                            <?php else: ?>
                                                <form action="" method="POST" class="d-inline">
                                                    <?php render_csrf_field(); ?>
                                                    <input type="hidden" name="action" value="set_primary_contact">
                                                    <input type="hidden" name="contact_id" value="<?php echo $cnt['id']; ?>">
                                                    <input type="hidden" name="customer_id" value="<?php echo $cust['id']; ?>">
                                                    <button type="submit" class="btn btn-sm btn-link p-0 text-decoration-none small">Set Primary</button>
                                                </form>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete contact?');">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="delete_contact">
                                                <input type="hidden" name="contact_id" value="<?php echo $cnt['id']; ?>">
                                                <input type="hidden" name="customer_id" value="<?php echo $cust['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-light border text-danger rounded-circle"><i class="bi bi-trash"></i></button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: CASES -->
            <div class="tab-pane fade" id="tab-cases">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Case ID</th>
                                <th>Service Name</th>
                                <th>Stage</th>
                                <th>Amount</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['cases'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No service cases found for this customer.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['cases'] as $cs): ?>
                                    <tr>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($cs['case_code']); ?></td>
                                        <td><?php echo htmlspecialchars($cs['service_name'] ?: 'General Service'); ?></td>
                                        <td><span class="badge bg-primary rounded-pill"><?php echo htmlspecialchars($cs['current_stage']); ?></span></td>
                                        <td class="fw-bold"><?php echo format_inr($cs['total_amount']); ?></td>
                                        <td><span class="badge bg-<?php echo $cs['payment_status'] === 'paid' ? 'success' : 'warning'; ?> rounded-pill"><?php echo htmlspecialchars($cs['payment_status']); ?></span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 4: LOANS -->
            <div class="tab-pane fade" id="tab-loans">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>App Code</th>
                                <th>Scheme Name</th>
                                <th>Required Amount</th>
                                <th>Scorecard Status</th>
                                <th>Stage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['loans'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No loan applications recorded.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['loans'] as $ln): ?>
                                    <tr>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($ln['application_code']); ?></td>
                                        <td><?php echo htmlspecialchars($ln['scheme_name']); ?></td>
                                        <td class="fw-bold"><?php echo format_inr($ln['required_amount']); ?></td>
                                        <td><span class="badge bg-info text-dark rounded-pill">Score: <?php echo $ln['total_score'] ?: 'N/A'; ?></span></td>
                                        <td><span class="badge bg-warning text-dark rounded-pill"><?php echo htmlspecialchars($ln['status_stage']); ?></span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 5: INVOICES -->
            <div class="tab-pane fade" id="tab-invoices">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Invoice No</th>
                                <th>Payment Ref</th>
                                <th>Subtotal</th>
                                <th>Tax</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['invoices'])): ?>
                                <tr><td colspan="6" class="text-center py-4 text-muted">No invoices generated yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['invoices'] as $inv): ?>
                                    <tr>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($inv['invoice_no']); ?></td>
                                        <td><?php echo htmlspecialchars($inv['payment_code']); ?></td>
                                        <td><?php echo format_inr($inv['subtotal']); ?></td>
                                        <td><?php echo format_inr($inv['tax_amount']); ?></td>
                                        <td class="fw-bold"><?php echo format_inr($inv['total_amount']); ?></td>
                                        <td><span class="badge bg-success rounded-pill"><?php echo ucfirst($inv['status']); ?></span></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 6: PAYMENTS -->
            <div class="tab-pane fade" id="tab-payments">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Payment Code</th>
                                <th>Mode</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['payments'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No payments recorded.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['payments'] as $py): ?>
                                    <tr>
                                        <td class="fw-bold text-primary"><?php echo htmlspecialchars($py['payment_code']); ?></td>
                                        <td><?php echo htmlspecialchars($py['payment_mode']); ?></td>
                                        <td class="fw-bold text-success"><?php echo format_inr($py['amount']); ?></td>
                                        <td><span class="badge bg-success rounded-pill"><?php echo htmlspecialchars($py['status']); ?></span></td>
                                        <td class="small text-muted"><?php echo date('d-m-Y H:i', strtotime($py['created_at'])); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 7: DOCUMENTS -->
            <div class="tab-pane fade" id="tab-documents">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Document Vault</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#uploadDocModal"><i class="bi bi-upload me-1"></i> Upload Document</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Uploader</th>
                                <th>Uploaded Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['documents'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No documents uploaded yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['documents'] as $dc): ?>
                                    <tr>
                                        <td><i class="bi bi-file-earmark-pdf text-danger me-2"></i> <?php echo htmlspecialchars($dc['original_filename'] ?: $dc['file_name']); ?></td>
                                        <td><?php echo round($dc['file_size'] / 1024, 1); ?> KB</td>
                                        <td><?php echo htmlspecialchars($dc['uploader_name'] ?: 'Staff'); ?></td>
                                        <td class="small text-muted"><?php echo date('d-m-Y H:i', strtotime($dc['created_at'])); ?></td>
                                        <td>
                                            <a href="<?php echo BASE_URL . $dc['file_path']; ?>" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">Download</a>
                                            <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete file?');">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="delete_document">
                                                <input type="hidden" name="doc_id" value="<?php echo $dc['id']; ?>">
                                                <input type="hidden" name="customer_id" value="<?php echo $cust['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-light border text-danger rounded-circle"><i class="bi bi-trash"></i></button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 8: NOTES -->
            <div class="tab-pane fade" id="tab-notes">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Internal Staff Notes</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#noteModal"><i class="bi bi-plus-lg me-1"></i> Add Note</button>
                </div>
                <?php if (empty($profile_data['notes'])): ?>
                    <p class="text-muted text-center py-4">No internal notes added.</p>
                <?php else: ?>
                    <div class="row g-3">
                        <?php foreach ($profile_data['notes'] as $nt): ?>
                            <div class="col-md-6">
                                <div class="card border-0 shadow-sm rounded-4 p-3 bg-light <?php echo $nt['is_pinned'] ? 'border-start border-4 border-warning' : ''; ?>">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <small class="fw-bold text-dark"><i class="bi bi-person me-1"></i> <?php echo htmlspecialchars($nt['author_name']); ?></small>
                                        <div class="d-flex gap-1">
                                            <form action="" method="POST" class="d-inline">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="toggle_pin_note">
                                                <input type="hidden" name="note_id" value="<?php echo $nt['id']; ?>">
                                                <input type="hidden" name="customer_id" value="<?php echo $cust['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-light border rounded-circle"><i class="bi bi-pin-angle<?php echo $nt['is_pinned'] ? '-fill text-warning' : ''; ?>"></i></button>
                                            </form>
                                            <form action="" method="POST" class="d-inline" onsubmit="return confirm('Delete note?');">
                                                <?php render_csrf_field(); ?>
                                                <input type="hidden" name="action" value="delete_note">
                                                <input type="hidden" name="note_id" value="<?php echo $nt['id']; ?>">
                                                <input type="hidden" name="customer_id" value="<?php echo $cust['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-light border text-danger rounded-circle"><i class="bi bi-trash"></i></button>
                                            </form>
                                        </div>
                                    </div>
                                    <p class="mb-2 text-secondary small"><?php echo nl2br(htmlspecialchars($nt['note'])); ?></p>
                                    <small class="text-muted" style="font-size: 11px;"><?php echo date('d-m-Y H:i', strtotime($nt['created_at'])); ?></small>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- TAB 9: REMINDERS -->
            <div class="tab-pane fade" id="tab-reminders">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Follow-up Reminders</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#reminderModal"><i class="bi bi-alarm me-1"></i> Add Reminder</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Date & Time</th>
                                <th>Description</th>
                                <th>Assigned Staff</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['reminders'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No reminders set.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['reminders'] as $rm): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo date('d-m-Y', strtotime($rm['reminder_date'])); ?> <?php echo date('h:i A', strtotime($rm['reminder_time'])); ?></td>
                                        <td><?php echo htmlspecialchars($rm['description']); ?></td>
                                        <td><?php echo htmlspecialchars($rm['staff_name'] ?: 'Staff'); ?></td>
                                        <td><span class="badge bg-<?php echo $rm['status'] === 'completed' ? 'success' : 'warning'; ?> rounded-pill"><?php echo ucfirst($rm['status']); ?></span></td>
                                        <td>
                                            <?php if ($rm['status'] === 'pending'): ?>
                                                <form action="" method="POST" class="d-inline">
                                                    <?php render_csrf_field(); ?>
                                                    <input type="hidden" name="action" value="update_reminder_status">
                                                    <input type="hidden" name="reminder_id" value="<?php echo $rm['id']; ?>">
                                                    <input type="hidden" name="customer_id" value="<?php echo $cust['id']; ?>">
                                                    <input type="hidden" name="status" value="completed">
                                                    <button type="submit" class="btn btn-sm btn-success rounded-pill px-3">Mark Complete</button>
                                                </form>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 10: EMAILS -->
            <div class="tab-pane fade" id="tab-emails">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">Email Communication History</h6>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#emailModal"><i class="bi bi-envelope me-1"></i> Send Email</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Subject</th>
                                <th>To</th>
                                <th>Sender</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($profile_data['emails'])): ?>
                                <tr><td colspan="5" class="text-center py-4 text-muted">No emails sent yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($profile_data['emails'] as $em): ?>
                                    <tr>
                                        <td class="fw-bold"><?php echo htmlspecialchars($em['subject']); ?></td>
                                        <td><?php echo htmlspecialchars($em['to_email']); ?></td>
                                        <td><?php echo htmlspecialchars($em['sender_name'] ?: 'System'); ?></td>
                                        <td><span class="badge bg-<?php echo $em['status'] === 'sent' ? 'success' : 'danger'; ?> rounded-pill"><?php echo ucfirst($em['status']); ?></span></td>
                                        <td class="small text-muted"><?php echo date('d-m-Y H:i', strtotime($em['created_at'])); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 11: ACTIVITY LOG -->
            <div class="tab-pane fade" id="tab-activity">
                <h6 class="fw-bold mb-3">Chronological Activity Timeline</h6>
                <?php if (empty($profile_data['activity_logs'])): ?>
                    <p class="text-muted text-center py-4">No activity history logged.</p>
                <?php else: ?>
                    <div class="timeline ps-3 border-start border-2 border-primary ms-2">
                        <?php foreach ($profile_data['activity_logs'] as $act): ?>
                            <div class="mb-3 position-relative ps-3">
                                <span class="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-primary" style="width: 10px; height: 10px; margin-top: 6px;"></span>
                                <div class="fw-bold text-dark small"><?php echo htmlspecialchars($act['action']); ?></div>
                                <div class="text-secondary small"><?php echo htmlspecialchars($act['details']); ?></div>
                                <small class="text-muted" style="font-size: 11px;">By <?php echo htmlspecialchars($act['staff_name'] ?: 'System'); ?> on <?php echo date('d-m-Y H:i:s', strtotime($act['created_at'])); ?></small>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php endif; ?>

<!-- CUSTOMERS MAIN DIRECTORY CARD -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <!-- TABLE UTILITIES BAR -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 border-bottom pb-3">
        <div class="d-flex flex-wrap align-items-center gap-2">
            <select id="pageSizeSelect" class="form-select form-select-sm rounded-pill w-auto">
                <option value="10">10</option>
                <option value="25" selected>25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            
            <button id="exportCsvBtn" class="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold bg-white">
                <i class="bi bi-download me-1"></i> Export CSV
            </button>
            
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold dropdown-toggle bg-white" type="button" data-bs-toggle="dropdown">
                    Bulk Actions
                </button>
                <ul class="dropdown-menu shadow border-0 rounded-3">
                    <li><a class="dropdown-item py-2" href="#" id="bulkActivateBtn"><i class="bi bi-check-circle text-success me-2"></i> Mark Selected Active</a></li>
                    <li><a class="dropdown-item py-2" href="#" id="bulkDeactivateBtn"><i class="bi bi-x-circle text-danger me-2"></i> Mark Selected Inactive</a></li>
                </ul>
            </div>
            
            <button class="btn btn-sm btn-light rounded-circle" onclick="window.location.reload();" title="Refresh Table">
                <i class="bi bi-arrow-clockwise"></i>
            </button>
        </div>

        <div class="position-relative min-w-250">
            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input type="text" id="custTableSearch" class="form-control form-control-sm rounded-pill ps-5 pe-3 py-2" placeholder="Search customer name, email, mobile, ID...">
        </div>
    </div>

    <!-- DIRECTORY TABLE -->
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" id="customersTable">
            <thead class="table-light">
                <tr>
                    <th style="width: 40px;"><input type="checkbox" id="selectAllCust" class="form-check-input"></th>
                    <th>#</th>
                    <th>Customer Code</th>
                    <th>Company / Name</th>
                    <th>Primary Mobile</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Assigned Staff</th>
                    <th class="text-center">Cases</th>
                    <th class="text-center">Loans</th>
                    <th class="text-center">Active</th>
                    <th>Date Created</th>
                    <th class="text-end">Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($customers)): ?>
                    <tr>
                        <td colspan="13" class="text-center py-5 text-muted">
                            <i class="bi bi-people fs-1 d-block mb-2 text-secondary"></i>
                            No customer records found. Click <strong>+ Add New Customer</strong> to register one.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php $idx = 1; foreach ($customers as $c): ?>
                        <tr data-status="<?php echo htmlspecialchars($c['user_status']); ?>" data-type="<?php echo htmlspecialchars($c['customer_type']); ?>" data-staff="<?php echo htmlspecialchars($c['assigned_staff_name'] ?: ''); ?>" data-cases="<?php echo $c['case_count']; ?>">
                            <td><input type="checkbox" class="form-check-input cust-checkbox" value="<?php echo $c['id']; ?>"></td>
                            <td class="small text-muted fw-bold"><?php echo $idx++; ?></td>
                            <td class="fw-bold">
                                <a href="customers.php?id=<?php echo $c['id']; ?>" class="text-primary text-decoration-none fw-bold">
                                    <?php echo htmlspecialchars($c['customer_code']); ?>
                                </a>
                            </td>
                            <td>
                                <a href="customers.php?id=<?php echo $c['id']; ?>" class="text-dark text-decoration-none fw-bold">
                                    <?php echo htmlspecialchars($c['company_name'] ?: $c['name']); ?>
                                </a>
                                <?php if (!empty($c['company_name']) && $c['company_name'] !== $c['name']): ?>
                                    <small class="text-muted d-block"><?php echo htmlspecialchars($c['name']); ?></small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a href="tel:<?php echo htmlspecialchars($c['mobile']); ?>" class="text-decoration-none text-dark fw-semibold small">
                                    <i class="bi bi-telephone text-muted me-1"></i><?php echo htmlspecialchars($c['mobile']); ?>
                                </a>
                            </td>
                            <td class="small"><?php echo htmlspecialchars($c['email']); ?></td>
                            <td class="small"><?php echo htmlspecialchars($c['state'] . ', ' . $c['district']); ?></td>
                            <td><span class="badge bg-info-subtle text-dark border rounded-pill px-2 py-1 small"><?php echo htmlspecialchars($c['assigned_staff_name'] ?: 'Unassigned'); ?></span></td>
                            <td class="text-center"><span class="badge bg-secondary-subtle text-secondary border px-2 py-1 rounded-pill fw-bold"><?php echo $c['case_count']; ?></span></td>
                            <td class="text-center"><span class="badge bg-warning-subtle text-dark border px-2 py-1 rounded-pill fw-bold"><?php echo $c['loan_count']; ?></span></td>
                            <td class="text-center">
                                <div class="form-check form-switch d-inline-block">
                                    <input class="form-check-input status-toggle-switch" type="checkbox" role="switch" data-cust-id="<?php echo $c['id']; ?>" <?php echo $c['user_status'] === 'active' ? 'checked' : ''; ?>>
                                </div>
                            </td>
                            <td class="small text-muted"><?php echo date('d-m-Y', strtotime($c['user_created_at'] ?: $c['created_at'])); ?></td>
                            <td class="text-end text-nowrap">
                                <a href="customers.php?id=<?php echo $c['id']; ?>" class="btn btn-sm btn-primary rounded-pill px-3 shadow-sm me-1 fw-bold">
                                    <i class="bi bi-eye me-1"></i> View 360°
                                </a>
                                <div class="dropdown d-inline">
                                    <button class="btn btn-sm btn-outline-secondary rounded-circle" type="button" data-bs-toggle="dropdown" title="More Options">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu shadow border-0 rounded-3 dropdown-menu-end">
                                        <li><a class="dropdown-item py-2" href="customers.php?id=<?php echo $c['id']; ?>"><i class="bi bi-eye text-primary me-2"></i> View 360° Portfolio</a></li>
                                        <li><a class="dropdown-item py-2" href="#" onclick="openEditModal(<?php echo htmlspecialchars(json_encode($c)); ?>);"><i class="bi bi-pencil text-warning me-2"></i> Edit Profile</a></li>
                                        <?php if ($is_admin || check_permission('customers_delete')): ?>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <form action="" method="POST" onsubmit="return confirm('Are you sure you want to delete this customer?');">
                                                    <?php render_csrf_field(); ?>
                                                    <input type="hidden" name="action" value="delete_customer">
                                                    <input type="hidden" name="customer_id" value="<?php echo $c['id']; ?>">
                                                    <button type="submit" class="dropdown-item py-2 text-danger"><i class="bi bi-trash me-2"></i> Delete Customer</button>
                                                </form>
                                            </li>
                                        <?php endif; ?>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- MODAL: ADD / EDIT CUSTOMER -->
<div class="modal fade" id="saveCustomerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom pb-3">
                <h5 class="modal-title font-heading fw-bold text-dark" id="modalCustomerTitle"><i class="bi bi-person-plus-fill text-primary me-2"></i> Add New Customer</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="" method="POST" id="customerSaveForm">
                <input type="hidden" name="action" value="save_customer">
                <input type="hidden" name="customer_id" id="formCustId" value="0">
                <?php render_csrf_field(); ?>
                
                <div class="modal-body p-4">
                    <ul class="nav nav-pills mb-4 gap-2 border-bottom pb-3" role="tablist">
                        <li class="nav-item"><button class="nav-link active rounded-pill fw-bold" type="button" data-bs-toggle="tab" data-bs-target="#formTabBasic">1. Basic Info</button></li>
                        <li class="nav-item"><button class="nav-link rounded-pill fw-bold" type="button" data-bs-toggle="tab" data-bs-target="#formTabAddress">2. Address Details</button></li>
                        <li class="nav-item"><button class="nav-link rounded-pill fw-bold" type="button" data-bs-toggle="tab" data-bs-target="#formTabBusiness">3. Business & Financials</button></li>
                        <li class="nav-item"><button class="nav-link rounded-pill fw-bold" type="button" data-bs-toggle="tab" data-bs-target="#formTabCustom">4. Custom Fields & Tags</button></li>
                    </ul>

                    <div class="tab-content">
                        <!-- TAB 1: BASIC INFO -->
                        <div class="tab-pane fade show active" id="formTabBasic">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Customer Type *</label>
                                    <select name="customer_type" id="formType" class="form-select rounded-3">
                                        <option value="individual">Individual / Sole Proprietor</option>
                                        <option value="business">Business / Corporate / Firm</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">First Name *</label>
                                    <input type="text" name="first_name" id="formFirstName" class="form-control rounded-3" required placeholder="First Name">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Last Name</label>
                                    <input type="text" name="last_name" id="formLastName" class="form-control rounded-3" placeholder="Last Name">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Primary Mobile *</label>
                                    <input type="tel" name="mobile" id="formMobile" class="form-control rounded-3" required placeholder="10-digit mobile number">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Email Address</label>
                                    <input type="email" name="email" id="formEmail" class="form-control rounded-3" placeholder="name@domain.com">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">WhatsApp Number</label>
                                    <input type="tel" name="whatsapp_number" id="formWhatsapp" class="form-control rounded-3" placeholder="WhatsApp Number">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Customer Source</label>
                                    <select name="customer_source" id="formSource" class="form-select rounded-3">
                                        <option value="Direct">Direct Walk-in</option>
                                        <option value="Website">Website Registration</option>
                                        <option value="Franchise">Franchise Referral</option>
                                        <option value="Social Media">Social Media</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Assigned Staff</label>
                                    <select name="assigned_staff_id" id="formStaff" class="form-select rounded-3">
                                        <option value="">-- Unassigned --</option>
                                        <?php foreach ($staff_members as $st): ?>
                                            <option value="<?php echo $st['employee_id']; ?>"><?php echo htmlspecialchars($st['staff_name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2: ADDRESS -->
                        <div class="tab-pane fade" id="formTabAddress">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Address Line 1</label>
                                    <input type="text" name="address_line_1" id="formAddr1" class="form-control rounded-3" placeholder="House/Flat No, Street">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Address Line 2</label>
                                    <input type="text" name="address_line_2" id="formAddr2" class="form-control rounded-3" placeholder="Landmark, Area">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">State</label>
                                    <input type="text" name="state" id="formState" class="form-control rounded-3" value="Rajasthan">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">District</label>
                                    <input type="text" name="district" id="formDistrict" class="form-control rounded-3" value="Jaipur">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Pincode</label>
                                    <input type="text" name="pincode" id="formPincode" class="form-control rounded-3" placeholder="6-digit Pincode">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 3: BUSINESS -->
                        <div class="tab-pane fade" id="formTabBusiness">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Company / Business Name</label>
                                    <input type="text" name="company_name" id="formCompanyName" class="form-control rounded-3" placeholder="Firm / Organization Name">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">GSTIN Number</label>
                                    <input type="text" name="gstin" id="formGstin" class="form-control rounded-3 text-uppercase" placeholder="15-digit GSTIN">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">PAN Card Number</label>
                                    <input type="text" name="pan" id="formPan" class="form-control rounded-3 text-uppercase" placeholder="10-digit PAN">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Industry Category</label>
                                    <input type="text" name="industry" id="formIndustry" class="form-control rounded-3" placeholder="e.g. Manufacturing, Retail, IT">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 4: CUSTOM FIELDS & TAGS -->
                        <div class="tab-pane fade" id="formTabCustom">
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Customer Tags</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <?php foreach ($all_tags as $tg): ?>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name="tags[]" value="<?php echo $tg['id']; ?>" id="tag_cb_<?php echo $tg['id']; ?>">
                                            <label class="form-check-label small fw-bold" for="tag_cb_<?php echo $tg['id']; ?>">
                                                <span class="badge" style="background-color: <?php echo $tg['color']; ?>;"><?php echo htmlspecialchars($tg['name']); ?></span>
                                            </label>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <?php echo CustomFieldsEngine::render_form_fields('customers', 0); ?>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-top pt-3">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold"><i class="bi bi-check-lg me-1"></i> Save Customer Profile</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODALS: CONTACT, NOTE, REMINDER, DOCUMENT, EMAIL -->
<!-- 1. ADD CONTACT MODAL -->
<div class="modal fade" id="addContactModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom pb-3">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-person-plus-fill text-primary me-2"></i> Add Contact Person</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_contact">
                <input type="hidden" name="customer_id" value="<?php echo $selected_customer_id; ?>">
                <div class="mb-3"><label class="form-label small fw-bold">First Name *</label><input type="text" name="first_name" class="form-control rounded-3" required></div>
                <div class="mb-3"><label class="form-label small fw-bold">Last Name</label><input type="text" name="last_name" class="form-control rounded-3"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Job Position / Designation</label><input type="text" name="job_position" class="form-control rounded-3" placeholder="e.g. Director, Accountant"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Email Address</label><input type="email" name="email" class="form-control rounded-3"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Phone Number</label><input type="tel" name="phone" class="form-control rounded-3"></div>
                <div class="mb-3 form-check"><input type="checkbox" name="is_primary" value="1" class="form-check-input" id="is_primary_cb"><label class="form-check-label small fw-bold" for="is_primary_cb">Set as Primary Contact</label></div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold">Save Contact</button>
            </form>
        </div>
    </div>
</div>

<!-- 2. ADD NOTE MODAL -->
<div class="modal fade" id="noteModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom pb-3">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-journal-plus text-primary me-2"></i> Add Internal Staff Note</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_note">
                <input type="hidden" name="customer_id" value="<?php echo $selected_customer_id; ?>">
                <div class="mb-3"><label class="form-label small fw-bold">Internal Note *</label><textarea name="note" class="form-control rounded-3" rows="4" required placeholder="Internal staff notes..."></textarea></div>
                <div class="mb-3 form-check"><input type="checkbox" name="is_pinned" value="1" class="form-check-input" id="pin_cb"><label class="form-check-label small fw-bold" for="pin_cb">Pin Note to Top</label></div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold">Save Internal Note</button>
            </form>
        </div>
    </div>
</div>

<!-- 3. ADD REMINDER MODAL -->
<div class="modal fade" id="reminderModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom pb-3">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-alarm-fill text-primary me-2"></i> Add Follow-up Reminder</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" class="p-4">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="add_reminder">
                <input type="hidden" name="customer_id" value="<?php echo $selected_customer_id; ?>">
                <div class="mb-3"><label class="form-label small fw-bold">Reminder Date *</label><input type="date" name="reminder_date" class="form-control rounded-3" required value="<?php echo date('Y-m-d'); ?>"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Reminder Time</label><input type="time" name="reminder_time" class="form-control rounded-3" value="10:00"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Description *</label><textarea name="description" class="form-control rounded-3" rows="3" required placeholder="Reminder notes..."></textarea></div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold">Create Reminder</button>
            </form>
        </div>
    </div>
</div>

<!-- 4. UPLOAD DOCUMENT MODAL -->
<div class="modal fade" id="uploadDocModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-bottom pb-3">
                <h5 class="modal-title font-heading fw-bold"><i class="bi bi-cloud-upload-fill text-primary me-2"></i> Upload Customer Document</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST" enctype="multipart/form-data" class="p-4">
                <?php render_csrf_field(); ?>
                <input type="hidden" name="action" value="upload_document">
                <input type="hidden" name="customer_id" value="<?php echo $selected_customer_id; ?>">
                <div class="mb-3"><label class="form-label small fw-bold">Select File (PDF, JPG, PNG, DOCX, XLSX) *</label><input type="file" name="document_file" class="form-control rounded-3" required accept=".pdf, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Description</label><input type="text" name="description" class="form-control rounded-3" placeholder="Document details..."></div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold">Upload Document</button>
            </form>
        </div>
    </div>
</div>

<!-- JAVASCRIPT LOGIC FOR MODALS & TABLE SEARCH -->
<script>
function prepareAddModal() {
    document.getElementById('modalCustomerTitle').innerHTML = '<i class="bi bi-person-plus-fill text-primary me-2"></i> Add New Customer';
    document.getElementById('formCustId').value = 0;
    document.getElementById('customerSaveForm').reset();
}

function openEditModal(c) {
    document.getElementById('modalCustomerTitle').innerHTML = '<i class="bi bi-pencil-square text-warning me-2"></i> Edit Customer Profile';
    document.getElementById('formCustId').value = c.id;
    document.getElementById('formType').value = c.customer_type || 'individual';
    document.getElementById('formFirstName').value = c.first_name || c.name || '';
    document.getElementById('formLastName').value = c.last_name || '';
    document.getElementById('formMobile').value = c.mobile || '';
    document.getElementById('formEmail').value = c.email || '';
    document.getElementById('formWhatsapp').value = c.whatsapp_number || c.mobile || '';
    document.getElementById('formSource').value = c.customer_source || 'Direct';
    document.getElementById('formStaff').value = c.assigned_staff_id || '';
    document.getElementById('formAddr1').value = c.address_line_1 || c.address || '';
    document.getElementById('formAddr2').value = c.address_line_2 || '';
    document.getElementById('formState').value = c.state || 'Rajasthan';
    document.getElementById('formDistrict').value = c.district || 'Jaipur';
    document.getElementById('formPincode').value = c.pincode || '';
    document.getElementById('formCompanyName').value = c.company_name || c.business_name_record || '';
    document.getElementById('formGstin').value = c.gstin || '';
    document.getElementById('formPan').value = c.pan || '';
    document.getElementById('formIndustry').value = c.industry || '';
    
    var modal = new bootstrap.Modal(document.getElementById('saveCustomerModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('custTableSearch');
    const table = document.getElementById('customersTable');
    const rows = table.querySelectorAll('tbody tr');

    if (searchInput) searchInput.addEventListener('keyup', filterTable);

    const filterStatus = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');
    const filterStaff = document.getElementById('filterStaff');
    const filterCases = document.getElementById('filterCases');

    [filterStatus, filterType, filterStaff, filterCases].forEach(el => {
        if (el) el.addEventListener('change', filterTable);
    });

    function filterTable() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const statusVal = filterStatus ? filterStatus.value : '';
        const typeVal = filterType ? filterType.value : '';
        const staffVal = filterStaff ? filterStaff.value : '';
        const casesVal = filterCases ? filterCases.value : '';

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const status = row.getAttribute('data-status') || '';
            const type = row.getAttribute('data-type') || '';
            const staff = row.getAttribute('data-staff') || '';
            const cases = parseInt(row.getAttribute('data-cases') || '0');

            let matchText = text.includes(query);
            let matchStatus = !statusVal || status === statusVal;
            let matchType = !typeVal || type === typeVal;
            let matchStaff = !staffVal || staff === staffVal;
            let matchCases = !casesVal || (casesVal === 'has_cases' ? cases > 0 : cases === 0);

            row.style.display = (matchText && matchStatus && matchType && matchStaff && matchCases) ? '' : 'none';
        });
    }

    // Export CSV
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            let csv = [];
            csv.push(['#', 'Customer Code', 'Company/Name', 'Mobile', 'Email', 'State/District', 'Assigned Staff', 'Status', 'Date Created'].join(','));
            rows.forEach((row, i) => {
                if (row.style.display !== 'none') {
                    let cols = row.querySelectorAll('td');
                    if (cols.length >= 10) {
                        csv.push([
                            i + 1,
                            `"${cols[2].innerText.trim()}"`,
                            `"${cols[3].innerText.replace(/\n/g, ' ').trim()}"`,
                            `"${cols[4].innerText.trim()}"`,
                            `"${cols[5].innerText.trim()}"`,
                            `"${cols[6].innerText.trim()}"`,
                            `"${cols[7].innerText.trim()}"`,
                            `"${cols[10].innerText.trim()}"`,
                            `"${cols[11].innerText.trim()}"`
                        ].join(','));
                    }
                }
            });
            let csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
            let downloadLink = document.createElement('a');
            downloadLink.download = 'Customers_Export_' + new Date().toISOString().slice(0, 10) + '.csv';
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.click();
        });
    }
});
</script>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
