<?php
/**
 * Automated Verification Script for DIGITAL UDYOG SEVA V4 Release
 */

putenv('DB_HOST=127.0.0.1');
require_once __DIR__ . '/../db.php';

echo "====================================================\n";
echo " DIGITAL UDYOG SEVA - V4 RELEASE COMPREHENSIVE QA   \n";
echo "====================================================\n\n";

$testsPassed = 0;
$testsFailed = 0;

function assert_test($description, $condition) {
    global $testsPassed, $testsFailed;
    if ($condition) {
        echo "[PASS] " . $description . "\n";
        $testsPassed++;
    } else {
        echo "[FAIL] " . $description . "\n";
        $testsFailed++;
    }
}

// 1. Verify Database Tables
$requiredTables = ['roles', 'permissions', 'role_permissions', 'attendance', 'leaves', 'payroll', 'password_resets', 'sessions', 'login_history', 'users', 'customers', 'employees', 'leads'];
foreach ($requiredTables as $tbl) {
    $stmt = $pdo->query("SHOW TABLES LIKE '$tbl'");
    assert_test("Database table '$tbl' exists", $stmt->rowCount() > 0);
}

// 2. Verify Roles Count
$stmt = $pdo->query("SELECT COUNT(*) as cnt FROM roles");
$rolesCount = (int)$stmt->fetch()['cnt'];
assert_test("All 18 enterprise role templates seeded (Found: $rolesCount)", $rolesCount >= 18);

// 3. Verify Permissions Count
$stmt = $pdo->query("SELECT COUNT(*) as cnt FROM permissions");
$permCount = (int)$stmt->fetch()['cnt'];
assert_test("Module permissions registered (Found: $permCount)", $permCount >= 20);

// 4. Verify Super Admin User
$stmt = $pdo->query("SELECT id, email, user_type, status FROM users WHERE id = 1");
$admin = $stmt->fetch();
assert_test("Super Admin account #1 exists and active ({$admin['email']})", $admin && $admin['status'] === 'active');

// 5. Test Auth API Login (Super Admin)
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_USER_AGENT'] = 'PHPUnit-Automated-QA';
$_GET['action'] = 'login';
$GLOBALS['testInputData'] = [
    'username' => 'manish872@gmail.com',
    'password' => 'admin123',
    'portal' => 'admin'
];

ob_start();
require __DIR__ . '/../api/v1/auth.php';
$loginJson = ob_get_clean();
$loginRes = json_decode($loginJson, true);

assert_test("Auth API Admin Login returns success=true", isset($loginRes['success']) && $loginRes['success'] === true);
assert_test("Auth API returns session token", !empty($loginRes['token']));
assert_test("Auth API returns permissions list (Count: " . count($loginRes['permissions'] ?? []) . ")", !empty($loginRes['permissions']));

// 6. Test Auth API Session Validation (action=me)
if (!empty($loginRes['token'])) {
    $_GET['action'] = 'me';
    $_SESSION['dus_token'] = $loginRes['token'];
    $GLOBALS['testInputData'] = [];
    ob_start();
    require __DIR__ . '/../api/v1/auth.php';
    $meJson = ob_get_clean();
    $meRes = json_decode($meJson, true);
    assert_test("Auth API Session validation (action=me) returns authenticated=true", isset($meRes['authenticated']) && $meRes['authenticated'] === true);
}

// 7. Verify Built Assets
assert_test("Production dist/index.html exists", file_exists(__DIR__ . '/../dist/index.html'));
assert_test("Production dist/assets/ index JS exists", count(glob(__DIR__ . '/../dist/assets/*.js')) > 0);
assert_test("Production dist/assets/ index CSS exists", count(glob(__DIR__ . '/../dist/assets/*.css')) > 0);
assert_test("Root assets directory has synchronized bundle", count(glob(__DIR__ . '/../assets/*.js')) > 0);

// Summary
echo "\n====================================================\n";
echo " QA AUDIT RESULTS: $testsPassed Passed, $testsFailed Failed\n";
echo "====================================================\n";

if ($testsFailed > 0) {
    exit(1);
}
