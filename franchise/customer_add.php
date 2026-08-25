<?php
$page_title = "Add New Customer | Franchise Portal";
$active_menu = "add_customer";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;
$msg = '';
$existing_cust = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mobile = sanitize($_POST['mobile'] ?? '');
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $state = sanitize($_POST['state'] ?? 'Rajasthan');
    $district = sanitize($_POST['district'] ?? 'Jaipur');
    $city = sanitize($_POST['city'] ?? 'Jaipur');
    $address = sanitize($_POST['address'] ?? '');
    $business_name = sanitize($_POST['business_name'] ?? '');

    if (!empty($mobile)) {
        // Check if customer already exists
        $chk = $pdo->prepare("SELECT c.*, u.name AS user_name FROM customers c JOIN users u ON c.user_id = u.id WHERE c.mobile = ? OR u.mobile = ?");
        $chk->execute([$mobile, $mobile]);
        $existing_cust = $chk->fetch();

        if ($existing_cust) {
            $msg = '<div class="alert alert-warning border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 class="fw-bold text-dark mb-1"><i class="bi bi-exclamation-circle-fill text-warning me-2"></i> Customer Already Exists!</h5>
                <p class="text-secondary small mb-3">A customer record with mobile number <strong>' . htmlspecialchars($mobile) . '</strong> is already registered under <strong>' . htmlspecialchars($existing_cust['name']) . '</strong>.</p>
                <div class="d-flex gap-2">
                    <a href="customer_detail.php?id=' . $existing_cust['id'] . '" class="btn btn-primary btn-sm rounded-pill fw-bold px-3">Open Existing Customer Profile 360°</a>
                    <a href="new_application.php?customer_id=' . $existing_cust['id'] . '" class="btn btn-warning btn-sm rounded-pill fw-bold text-dark px-3">+ Add New Service Application</a>
                </div>
            </div>';
        } else {
            // Create user and customer record
            $pass_hash = password_hash('Customer@123', PASSWORD_BCRYPT);
            $u_ins = $pdo->prepare("INSERT INTO users (user_type, name, email, mobile, password_hash, status) VALUES ('customer', ?, ?, ?, ?, 'active')");
            $u_ins->execute([$name, $email ?: $mobile . '@digitaludyogseva.com', $mobile, $pass_hash]);
            $user_id = $pdo->lastInsertId();

            $cust_code = generate_code('CUST', 6);
            $c_ins = $pdo->prepare("INSERT INTO customers (user_id, customer_code, name, mobile, email, state, district, city, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $c_ins->execute([$user_id, $cust_code, $name, $mobile, $email, $state, $district, $city, $address]);
            $customer_id = $pdo->lastInsertId();

            if (!empty($business_name)) {
                $bp_ins = $pdo->prepare("INSERT INTO customer_business_profiles (customer_id, business_name) VALUES (?, ?)");
                $bp_ins->execute([$customer_id, $business_name]);
            }

            header("Location: customer_detail.php?id=" . $customer_id . "&msg=created");
            exit;
        }
    }
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Add New Customer</h4>
        <p class="text-muted small mb-0">Register client profile first. Add services, loans, and documents under their 360° profile.</p>
    </div>
    <a href="customers.php" class="btn btn-outline-secondary rounded-pill px-4">
        <i class="bi bi-people me-1"></i> Customer Directory
    </a>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white max-w-800 mx-auto">
    <form action="" method="POST">
        <?php render_csrf_field(); ?>

        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">1. Personal Contact Details</h5>
        <div class="row g-3 mb-4">
            <div class="col-md-6">
                <label class="form-label small fw-bold">Customer Full Name *</label>
                <input type="text" name="name" class="form-control" required placeholder="Enter full name">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Mobile Number *</label>
                <input type="tel" name="mobile" class="form-control" required placeholder="10-digit mobile number">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="name@example.com">
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">Business Name (If applicable)</label>
                <input type="text" name="business_name" class="form-control" placeholder="Company / Firm Name">
            </div>
        </div>

        <h5 class="font-heading fw-bold text-primary border-bottom pb-2 mb-3">2. Address & Location</h5>
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <label class="form-label small fw-bold">State</label>
                <input type="text" name="state" class="form-control" value="Rajasthan">
            </div>
            <div class="col-md-4">
                <label class="form-label small fw-bold">District</label>
                <input type="text" name="district" class="form-control" value="Jaipur">
            </div>
            <div class="col-md-4">
                <label class="form-label small fw-bold">City</label>
                <input type="text" name="city" class="form-control" value="Jaipur">
            </div>
            <div class="col-md-12">
                <label class="form-label small fw-bold">Full Address</label>
                <textarea name="address" class="form-control" rows="2" placeholder="Full street address..."></textarea>
            </div>
        </div>

        <button type="submit" class="btn btn-warning btn-lg w-100 fw-bold rounded-pill text-dark shadow">
            Save Customer Profile & Open 360° View <i class="bi bi-arrow-right ms-1"></i>
        </button>
    </form>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
