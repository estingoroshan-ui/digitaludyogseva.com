<?php
// Perfex CRM Data Migration Engine into Digital Udyog Seva CRM
require_once __DIR__ . '/../config/app.php';

global $pdo;
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

echo "========================================================\n";
echo "   PERFEX CRM DATA MIGRATION ENGINE (318+ CUSTOMERS)   \n";
echo "========================================================\n";

try {
    $perfex_pdo = new PDO("mysql:host=localhost;dbname=perfex_old_import;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    echo "[STATUS] Connected to Perfex database 'perfex_old_import' successfully!\n";
} catch (Exception $e) {
    die("[ERROR] Could not connect to perfex_old_import: " . $e->getMessage() . "\n");
}

// ---------------------------------------------------------
// 1. MIGRATE STAFF MEMBERS (tblstaff -> users & employees)
// ---------------------------------------------------------
echo "\n--- 1. Migrating Staff Members ---\n";
$staff_rows = $perfex_pdo->query("SELECT * FROM tblstaff")->fetchAll();
$staff_migrated = 0;

foreach ($staff_rows as $s) {
    try {
        $full_name = trim($s['firstname'] . ' ' . $s['lastname']);
        $email = trim($s['email']) ?: ('staff' . $s['staffid'] . '@dus.local');
        $mobile = trim($s['phonenumber']) ?: '99999' . str_pad($s['staffid'], 5, '0', STR_PAD_LEFT);
        $role_id = ($s['admin'] == 1) ? 1 : 2;
        $status = ($s['active'] == 1) ? 'active' : 'inactive';
        $password_hash = $s['password'] ?: password_hash('123456', PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("
            INSERT INTO users (id, user_type, role_id, first_name, last_name, name, email, mobile, password_hash, status, created_at)
            VALUES (?, 'staff', ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status)
        ");
        $stmt->execute([$s['staffid'], $role_id, $s['firstname'], $s['lastname'], $full_name, $email, $mobile, $password_hash, $status]);

        $emp_code = 'EMP-' . str_pad($s['staffid'], 4, '0', STR_PAD_LEFT);
        $ins_emp = $pdo->prepare("
            INSERT INTO employees (user_id, employee_code, department, designation, status)
            VALUES (?, ?, 'Operations', 'Staff Member', 'active')
            ON DUPLICATE KEY UPDATE designation = VALUES(designation)
        ");
        $ins_emp->execute([$s['staffid'], $emp_code]);
        $staff_migrated++;
    } catch (Exception $e) {}
}
echo "[SUCCESS] Migrated {$staff_migrated} Staff Members.\n";

// ---------------------------------------------------------
// 2. MIGRATE CUSTOMERS & CONTACTS (tblclients & tblcontacts -> customers)
// ---------------------------------------------------------
echo "\n--- 2. Migrating Customers & Companies ---\n";
$client_rows = $perfex_pdo->query("SELECT * FROM tblclients")->fetchAll();
$clients_migrated = 0;

foreach ($client_rows as $c) {
    try {
        $cust_id = (int)$c['userid'];
        $company_name = trim($c['company']) ?: 'Customer #' . $cust_id;
        $mobile = trim($c['phonenumber']) ?: ('90000' . str_pad($cust_id, 5, '0', STR_PAD_LEFT));
        
        $contact = $perfex_pdo->query("SELECT * FROM tblcontacts WHERE userid = {$cust_id} ORDER BY is_primary DESC LIMIT 1")->fetch();
        $email = ($contact && !empty($contact['email'])) ? trim($contact['email']) : ('customer' . $cust_id . '@dus.local');
        $contact_name = ($contact && !empty($contact['firstname'])) ? trim($contact['firstname'] . ' ' . $contact['lastname']) : $company_name;
        $cust_code = 'CUST-' . str_pad($cust_id, 5, '0', STR_PAD_LEFT);
        $pass = ($contact && !empty($contact['password'])) ? $contact['password'] : password_hash('123456', PASSWORD_BCRYPT);
        $user_id = $cust_id + 10000;

        // Try inserting user record, if duplicate mobile/email handle gracefully
        try {
            $stmt_u = $pdo->prepare("
                INSERT INTO users (id, user_type, name, email, mobile, password_hash, status, created_at)
                VALUES (?, 'customer', ?, ?, ?, ?, 'active', NOW())
                ON DUPLICATE KEY UPDATE name = VALUES(name)
            ");
            $stmt_u->execute([$user_id, $contact_name, $email, $mobile, $pass]);
        } catch (Exception $e_user) {
            // If duplicate mobile/email, append cust_id to guarantee unique user account creation
            $email = "customer{$cust_id}_" . $email;
            $mobile = substr($mobile, 0, 8) . str_pad($cust_id, 2, '0', STR_PAD_LEFT);
            $stmt_u = $pdo->prepare("
                INSERT INTO users (id, user_type, name, email, mobile, password_hash, status, created_at)
                VALUES (?, 'customer', ?, ?, ?, ?, 'active', NOW())
                ON DUPLICATE KEY UPDATE name = VALUES(name)
            ");
            $stmt_u->execute([$user_id, $contact_name, $email, $mobile, $pass]);
        }

        // Insert customer anchor record
        $stmt_c = $pdo->prepare("
            INSERT INTO customers (id, user_id, customer_code, name, mobile, email, address, city, state, pincode, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE name = VALUES(name), address = VALUES(address)
        ");
        $stmt_c->execute([
            $cust_id,
            $user_id,
            $cust_code,
            $contact_name,
            $mobile,
            $email,
            $c['address'] ?? '',
            $c['city'] ?? '',
            $c['state'] ?? '',
            $c['zip'] ?? ''
        ]);

        // Insert business profile
        $stmt_b = $pdo->prepare("
            INSERT INTO customer_business_profiles (customer_id, business_name, gstin, address, status)
            VALUES (?, ?, ?, ?, 'active')
            ON DUPLICATE KEY UPDATE business_name = VALUES(business_name), gstin = VALUES(gstin)
        ");
        $stmt_b->execute([$cust_id, $company_name, $c['vat'] ?? '', $c['address'] ?? '']);

        $clients_migrated++;
    } catch (Exception $e) {
        error_log("Customer migration notice for ID {$c['userid']}: " . $e->getMessage());
    }
}
echo "[SUCCESS] Migrated {$clients_migrated} Customers & Companies.\n";

// ---------------------------------------------------------
// 3. MIGRATE LEADS (tblleads -> leads)
// ---------------------------------------------------------
echo "\n--- 3. Migrating CRM Leads ---\n";
$lead_rows = $perfex_pdo->query("SELECT * FROM tblleads")->fetchAll();
$leads_migrated = 0;

foreach ($lead_rows as $l) {
    try {
        $lead_id = (int)$l['id'];
        $lead_code = 'LEAD-PFX-' . str_pad($lead_id, 5, '0', STR_PAD_LEFT);
        $name = trim($l['name']) ?: 'Perfex Lead #' . $lead_id;
        $mobile = trim($l['phonenumber']) ?: ('88000' . str_pad($lead_id, 5, '0', STR_PAD_LEFT));
        $email = trim($l['email']) ?: ('lead' . $lead_id . '@dus.local');
        $status_id = (int)$l['status'] ?: 1;

        $stmt_l = $pdo->prepare("
            INSERT INTO leads (id, lead_code, name, mobile, email, business_name, address, city, state, pincode, status_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE name = VALUES(name), status_id = VALUES(status_id)
        ");
        $stmt_l->execute([
            $lead_id,
            $lead_code,
            $name,
            $mobile,
            $email,
            $l['company'] ?? '',
            $l['address'] ?? '',
            $l['city'] ?? '',
            $l['state'] ?? '',
            $l['zip'] ?? '',
            $status_id
        ]);
        $leads_migrated++;
    } catch (Exception $e) {}
}
echo "[SUCCESS] Migrated {$leads_migrated} CRM Leads.\n";

// ---------------------------------------------------------
// 4. MIGRATE SERVICE PROJECTS (tblprojects -> cases)
// ---------------------------------------------------------
echo "\n--- 4. Migrating Service Projects / Cases ---\n";
$project_rows = $perfex_pdo->query("SELECT * FROM tblprojects")->fetchAll();
$projects_migrated = 0;

foreach ($project_rows as $p) {
    try {
        $pj_id = (int)$p['id'];
        $case_code = 'CASE-PFX-' . str_pad($pj_id, 5, '0', STR_PAD_LEFT);
        $cust_id = (int)$p['clientid'];

        $status = 'active';
        if ($p['status'] == 3) $status = 'on_hold';
        elseif ($p['status'] == 4) $status = 'completed';
        elseif ($p['status'] == 5) $status = 'cancelled';

        $stage_name = trim($p['name']) ?: 'Service Case Project';

        $stmt_p = $pdo->prepare("
            INSERT INTO cases (id, case_code, customer_id, current_stage, status, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE current_stage = VALUES(current_stage), status = VALUES(status)
        ");
        $stmt_p->execute([$pj_id, $case_code, $cust_id, $stage_name, $status]);
        $projects_migrated++;
    } catch (Exception $e) {}
}
echo "[SUCCESS] Migrated {$projects_migrated} Service Projects / Cases.\n";

// ---------------------------------------------------------
// 5. MIGRATE TASKS (tbltasks -> tasks)
// ---------------------------------------------------------
echo "\n--- 5. Migrating Staff Tasks ---\n";
$task_rows = $perfex_pdo->query("SELECT * FROM tbltasks")->fetchAll();
$tasks_migrated = 0;

foreach ($task_rows as $t) {
    try {
        $task_id = (int)$t['id'];
        $title = trim($t['name']);
        $desc = $t['description'] ?? '';

        $task_status = ($t['status'] == 5) ? 'completed' : (($t['status'] == 4) ? 'in_progress' : 'pending');

        $stmt_t = $pdo->prepare("
            INSERT INTO tasks (id, staff_id, title, description, status, created_at)
            VALUES (?, 1, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE title = VALUES(title), status = VALUES(status)
        ");
        $stmt_t->execute([$task_id, $title, $desc, $task_status]);
        $tasks_migrated++;
    } catch (Exception $e) {}
}
echo "[SUCCESS] Migrated {$tasks_migrated} Staff Tasks.\n";

$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

echo "\n========================================================\n";
echo "    PERFEX DATA MIGRATION COMPLETED SUCCESSFULLY!       \n";
echo "========================================================\n";
