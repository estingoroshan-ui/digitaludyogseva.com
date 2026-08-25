<?php
$slug = $_GET['slug'] ?? '';
require_once __DIR__ . '/config/app.php';

global $pdo;
$stmt = $pdo->prepare("
    SELECT s.*, sc.name AS category_name
    FROM services s
    JOIN service_categories sc ON s.category_id = sc.id
    WHERE s.slug = ? AND s.status = 'active'
");
$stmt->execute([$slug]);
$service = $stmt->fetch();

if (!$service) {
    header('Location: ' . BASE_URL);
    exit;
}

$page_title = $service['name'] . " | Digital Udyog Seva";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/classes/LeadManager.php';
    $res = LeadManager::create_lead([
        'name' => $_POST['name'] ?? '',
        'mobile' => $_POST['mobile'] ?? '',
        'email' => $_POST['email'] ?? '',
        'state' => $_POST['state'] ?? '',
        'district' => $_POST['district'] ?? '',
        'interested_service_id' => $service['id'],
        'source_id' => 1
    ]);
    if ($res['status']) {
        $msg = '<div class="alert alert-success fw-bold p-3 rounded-3 mb-4"><i class="bi bi-check-circle-fill me-2"></i> Thank you! Your request for ' . htmlspecialchars($service['name']) . ' has been received. Our executive will contact you shortly.</div>';
    } else {
        $msg = '<div class="alert alert-danger fw-bold p-3 rounded-3 mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> ' . htmlspecialchars($res['message']) . '</div>';
    }
}
?>

<!-- SERVICE DETAIL HERO -->
<div class="hero-wrapper py-5">
    <div class="container">
        <nav aria-label="breadcrumb" class="mb-3">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>" class="text-white-50">Home</a></li>
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>services.php" class="text-white-50"><?php echo htmlspecialchars($service['category_name']); ?></a></li>
                <li class="breadcrumb-item active text-saffron" aria-current="page"><?php echo htmlspecialchars($service['name']); ?></li>
            </ol>
        </nav>
        <div class="row align-items-center g-4">
            <div class="col-lg-8">
                <span class="hero-badge mb-2">
                    <i class="bi bi-clock me-1"></i> Processing Time: <?php echo htmlspecialchars($service['processing_time']); ?>
                </span>
                <h1 class="display-5 fw-bold font-heading text-white mb-3"><?php echo htmlspecialchars($service['name']); ?></h1>
                <p class="lead text-secondary mb-0"><?php echo htmlspecialchars($service['short_description']); ?></p>
            </div>
            <div class="col-lg-4 text-lg-end">
                <div class="command-card p-4 text-center">
                    <small class="text-muted text-uppercase fw-bold d-block">Total Service Fee</small>
                    <h2 class="display-6 fw-bold text-saffron font-heading my-1"><?php echo format_inr($service['final_price']); ?></h2>
                    <small class="text-secondary">(Incl. Govt Fee + Professional Fee + GST)</small>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="dus-section">
    <div class="container">
        <div class="row g-5">
            <div class="col-lg-8">
                <?php echo $msg; ?>
                
                <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
                    <h3 class="font-heading fw-bold mb-3">Service Description</h3>
                    <div class="text-secondary leading-relaxed">
                        <?php echo nl2br(htmlspecialchars($service['description'] ?: $service['short_description'])); ?>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
                    <h3 class="font-heading fw-bold mb-3"><i class="bi bi-file-earmark-check text-primary me-2"></i> Required Documents Checklist</h3>
                    <div class="text-secondary leading-relaxed">
                        <?php echo nl2br(htmlspecialchars($service['required_docs'] ?: 'Aadhaar Card, PAN Card, Passport Photo, Address Proof, Business Address Proof')); ?>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-4 shadow-sm border">
                    <h3 class="font-heading fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i> Transparent Fee Breakup</h3>
                    <table class="table table-bordered align-middle">
                        <tr>
                            <td class="bg-light">Government Fee</td>
                            <td class="fw-bold"><?php echo format_inr($service['govt_fee']); ?></td>
                        </tr>
                        <tr>
                            <td class="bg-light">Professional Fee</td>
                            <td class="fw-bold"><?php echo format_inr($service['prof_fee']); ?></td>
                        </tr>
                        <tr>
                            <td class="bg-light">GST (<?php echo (float)$service['gst_rate']; ?>%)</td>
                            <td class="fw-bold"><?php echo format_inr(($service['prof_fee'] * $service['gst_rate']) / 100); ?></td>
                        </tr>
                        <tr class="table-primary">
                            <td class="fw-bold">Total Final Price</td>
                            <td class="fw-bold text-primary fs-5"><?php echo format_inr($service['final_price']); ?></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="bg-white p-4 rounded-4 shadow-lg border sticky-top" style="top:100px;">
                    <h4 class="font-heading fw-bold mb-2">Apply Now for Service</h4>
                    <p class="small text-muted mb-4">Fill details to initiate application with Digital Udyog Seva.</p>
                    <form action="" method="POST">
                        <?php render_csrf_field(); ?>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Full Name *</label>
                            <input type="text" name="name" class="form-control rounded-3" required placeholder="Enter full name">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Mobile Number *</label>
                            <input type="tel" name="mobile" class="form-control rounded-3" required placeholder="10-digit mobile number">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Email Address</label>
                            <input type="email" name="email" class="form-control rounded-3" placeholder="name@example.com">
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label small fw-bold">State</label>
                                <input type="text" name="state" class="form-control rounded-3" value="Rajasthan">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label small fw-bold">District</label>
                                <input type="text" name="district" class="form-control rounded-3" value="Jaipur">
                            </div>
                        </div>
                        <button type="submit" class="dus-btn dus-btn-accent w-100 mt-2">
                            Submit Application <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
