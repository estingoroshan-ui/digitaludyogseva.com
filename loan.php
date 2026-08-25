<?php
$page_title = "Government Business Loan Consultancy Portal | Digital Udyog Seva";
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
require_once __DIR__ . '/classes/LeadManager.php';
require_once __DIR__ . '/classes/LoanWizard.php';
require_once __DIR__ . '/classes/DocumentVault.php';

$schemes = [];
try {
    $stmt = $pdo->query("SELECT * FROM loan_schemes WHERE status = 'active' ORDER BY id ASC");
    $schemes = $stmt->fetchAll();
} catch (Exception $e) {}

$selected_scheme_id = (int)($_GET['scheme_id'] ?? 0);
$success_app = null;
$error_msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error_msg = "Invalid security token. Please try again.";
    } else {
        // Step 1: Ensure customer profile exists or create via LeadManager
        $lead_res = LeadManager::create_lead([
            'name' => $_POST['name'] ?? '',
            'mobile' => $_POST['mobile'] ?? '',
            'email' => $_POST['email'] ?? '',
            'state' => $_POST['state'] ?? 'Rajasthan',
            'district' => $_POST['district'] ?? 'Jaipur',
            'business_name' => $_POST['business_name'] ?? '',
            'interested_loan_scheme_id' => $_POST['scheme_id'] ?? null,
            'required_loan_amount' => $_POST['required_amount'] ?? 0,
            'source_id' => 1
        ]);

        if ($lead_res['status']) {
            $conv = LeadManager::convert_lead_to_customer($lead_res['lead_id']);
            if ($conv['status']) {
                $customer_id = $conv['customer_id'];

                // Step 2: Submit Loan Application via LoanWizard
                $app_res = LoanWizard::submit_application([
                    'customer_id' => $customer_id,
                    'scheme_id' => $_POST['scheme_id'] ?? 1,
                    'required_amount' => $_POST['required_amount'] ?? 500000,
                    'loan_purpose' => $_POST['loan_purpose'] ?? 'Working Capital',
                    'purpose_details' => $_POST['purpose_details'] ?? '',
                    'monthly_income' => $_POST['monthly_income'] ?? 0,
                    'existing_emi' => $_POST['existing_emi'] ?? 0,
                    'bank_name' => $_POST['bank_name'] ?? '',
                    'avg_bank_balance' => $_POST['avg_bank_balance'] ?? 0,
                    'turnover_last_yr' => $_POST['turnover_last_yr'] ?? 0,
                    'itr_filed' => !empty($_POST['itr_filed']),
                    'gst_filed' => !empty($_POST['gst_filed']),
                    'loan_defaults_history' => !empty($_POST['loan_defaults_history'])
                ]);

                if ($app_res['status']) {
                    // Upload KYC file if provided
                    if (isset($_FILES['pan_file']) && $_FILES['pan_file']['error'] === UPLOAD_ERR_OK) {
                        DocumentVault::upload_document($customer_id, $_FILES['pan_file'], 1, null, $app_res['loan_application_id']);
                    }
                    $success_app = $app_res;
                } else {
                    $error_msg = $app_res['message'];
                }
            } else {
                $error_msg = $conv['message'];
            }
        } else {
            $error_msg = $lead_res['message'];
        }
    }
}
?>

<!-- HERO BANNER -->
<div class="hero-wrapper py-5">
    <div class="container text-center text-lg-start">
        <div class="row align-items-center g-4">
            <div class="col-lg-8">
                <div class="hero-badge mb-2">Consultancy & Documentation Portal</div>
                <h1 class="display-4 fw-bold font-heading text-white mb-3">Government Business Loan Schemes</h1>
                <p class="lead text-secondary mb-0">Assistance for PMEGP, PM MUDRA, Rajasthan MLUPY, Stand-Up India & PM Vishwakarma Loans.</p>
            </div>
            <div class="col-lg-4 text-lg-end">
                <div class="command-card p-3">
                    <h5 class="fw-bold text-white mb-1"><i class="bi bi-shield-check me-1 text-saffron"></i> Advisory Notice</h5>
                    <p class="small text-secondary mb-0">Digital Udyog Seva provides consultancy, documentation and project report assistance. Final sanction is determined by relevant bank/financial institution.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="dus-section">
    <div class="container">

        <?php if ($success_app): ?>
            <div class="bg-white p-5 rounded-4 shadow-lg text-center mb-5 max-w-700 mx-auto border">
                <div class="badge bg-success-subtle text-success p-3 rounded-circle mx-auto mb-3" style="width:80px; height:80px; display:inline-flex; align-items:center; justify-content:center;">
                    <i class="bi bi-check-circle-fill fs-1"></i>
                </div>
                <h2 class="font-heading fw-bold">Application Submitted Successfully!</h2>
                <p class="text-muted fs-5">Application Code: <strong class="text-primary"><?php echo htmlspecialchars($success_app['application_code']); ?></strong></p>
                
                <div class="bg-light p-4 rounded-3 text-start my-4 border">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold">Advisory Score:</span>
                        <span class="badge bg-primary fs-6"><?php echo $success_app['initial_score']; ?> / 100</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">Profile Evaluation:</span>
                        <span class="badge bg-info text-dark fw-bold"><?php echo htmlspecialchars($success_app['result_category']); ?></span>
                    </div>
                </div>

                <div class="alert alert-warning fw-bold text-start mb-4 rounded-3">
                    <i class="bi bi-lock-fill me-2"></i> Your detailed Loan Eligibility Scorecard PDF is locked. Pay nominal advisory fee to generate & download full PDF.
                </div>

                <a href="<?php echo BASE_URL; ?>customer/scorecard.php?app_id=<?php echo $success_app['loan_application_id']; ?>" class="dus-btn dus-btn-accent">
                    Unlock Advisory Scorecard PDF <i class="bi bi-arrow-right ms-1"></i>
                </a>
            </div>
        <?php else: ?>

            <?php if ($error_msg): ?>
                <div class="alert alert-danger fw-bold mb-4 rounded-3"><?php echo htmlspecialchars($error_msg); ?></div>
            <?php endif; ?>

            <div class="row g-5">
                <!-- Loan Schemes Cards Column -->
                <div class="col-lg-5">
                    <h3 class="font-heading fw-bold mb-4">Select Government Scheme</h3>
                    <div class="d-flex flex-column gap-3">
                        <?php foreach ($schemes as $s): ?>
                            <div class="bg-white border rounded-4 p-4 shadow-sm hover-shadow transition <?php echo ($selected_scheme_id == $s['id']) ? 'border-primary border-2' : ''; ?>">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <span class="badge bg-primary text-white"><?php echo htmlspecialchars($s['state']); ?></span>
                                    <span class="badge bg-success-subtle text-success fw-bold"><?php echo htmlspecialchars($s['subsidy_details']); ?></span>
                                </div>
                                <h4 class="font-heading fw-bold h5 mb-1"><?php echo htmlspecialchars($s['scheme_name']); ?></h4>
                                <small class="text-muted d-block mb-3"><?php echo htmlspecialchars($s['department']); ?></small>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="small fw-bold text-secondary">Limit: Up to <?php echo format_inr($s['max_loan']); ?></span>
                                    <button type="button" class="dus-btn dus-btn-outline-dark fs-7 py-1 px-3" onclick="selectScheme(<?php echo $s['id']; ?>, '<?php echo addslashes($s['scheme_name']); ?>')">
                                        Select Scheme
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- 6-Step Loan Wizard Form Column -->
                <div class="col-lg-7">
                    <div class="bg-white border rounded-4 p-4 p-lg-5 shadow-lg">
                        <h3 class="font-heading fw-bold mb-2">Loan Application Wizard</h3>
                        <p class="text-muted small mb-4">Complete quick steps for government scheme eligibility evaluation.</p>

                        <form action="" method="POST" enctype="multipart/form-data">
                            <?php render_csrf_field(); ?>
                            <input type="hidden" name="scheme_id" id="selected_scheme_input" value="<?php echo $selected_scheme_id ?: 1; ?>">

                            <!-- Step 1: Personal Details -->
                            <h5 class="fw-bold text-primary border-bottom pb-2 mb-3">1. Personal & KYC Details</h5>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Full Applicant Name *</label>
                                    <input type="text" name="name" class="form-control rounded-3" required placeholder="Full Name as per PAN">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Mobile Number *</label>
                                    <input type="tel" name="mobile" class="form-control rounded-3" required placeholder="10-digit mobile">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Email Address</label>
                                    <input type="email" name="email" class="form-control rounded-3" placeholder="Email address">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">State *</label>
                                    <input type="text" name="state" class="form-control rounded-3" value="Rajasthan" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">District *</label>
                                    <input type="text" name="district" class="form-control rounded-3" value="Jaipur" required>
                                </div>
                            </div>

                            <!-- Step 2: Business Profile -->
                            <h5 class="fw-bold text-primary border-bottom pb-2 mb-3">2. Business Profile</h5>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Business Name</label>
                                    <input type="text" name="business_name" class="form-control rounded-3" placeholder="Enterprise Name">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Required Loan Amount (₹) *</label>
                                    <input type="number" name="required_amount" class="form-control rounded-3" required value="500000">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Loan Purpose *</label>
                                    <select name="loan_purpose" class="form-select rounded-3">
                                        <option value="Plant & Machinery">Plant & Machinery / Equipment</option>
                                        <option value="Working Capital">Working Capital / Inventory</option>
                                        <option value="Business Expansion">New Business / Startup Setup</option>
                                        <option value="Shop Expansion">Shop / Commercial Office Expansion</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Purpose Details</label>
                                    <input type="text" name="purpose_details" class="form-control rounded-3" placeholder="e.g. Purchase CNC Lathe Machine">
                                </div>
                            </div>

                            <!-- Step 3: Financial & Banking History -->
                            <h5 class="fw-bold text-primary border-bottom pb-2 mb-3">3. Financial & Banking History</h5>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Monthly Household Income (₹)</label>
                                    <input type="number" name="monthly_income" class="form-control rounded-3" value="50000">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Existing Monthly EMI (₹)</label>
                                    <input type="number" name="existing_emi" class="form-control rounded-3" value="0">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Primary Bank Name</label>
                                    <input type="text" name="bank_name" class="form-control rounded-3" placeholder="e.g. State Bank of India / HDFC">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Last Year Annual Turnover (₹)</label>
                                    <input type="number" name="turnover_last_yr" class="form-control rounded-3" value="1200000">
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check mt-3">
                                        <input class="form-check-input" type="checkbox" name="itr_filed" id="itr_filed" value="1" checked>
                                        <label class="form-check-label small fw-bold" for="itr_filed">ITR Filed?</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check mt-3">
                                        <input class="form-check-input" type="checkbox" name="gst_filed" id="gst_filed" value="1" checked>
                                        <label class="form-check-label small fw-bold" for="gst_filed">GST Registered?</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check mt-3">
                                        <input class="form-check-input" type="checkbox" name="loan_defaults_history" id="defaults" value="1">
                                        <label class="form-check-label small text-danger fw-bold" for="defaults">Any Prior Default?</label>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 4: KYC Upload -->
                            <h5 class="fw-bold text-primary border-bottom pb-2 mb-3">4. Document Upload (Optional)</h5>
                            <div class="mb-4">
                                <label class="form-label small fw-bold">Upload PAN / Aadhaar / Project Report File (PDF/JPG)</label>
                                <input type="file" name="pan_file" class="form-control rounded-3">
                            </div>

                            <!-- Consent Checkbox -->
                            <div class="alert alert-light border small mb-4 rounded-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" required id="credit_consent" checked>
                                    <label class="form-check-label" for="credit_consent">
                                        I hereby provide explicit consent to Digital Udyog Seva to analyze my profile, review KYC documents, and generate advisory business loan scorecard.
                                    </label>
                                </div>
                            </div>

                            <button type="submit" class="dus-btn dus-btn-accent w-100">
                                Submit & Evaluate Loan Eligibility <i class="bi bi-arrow-right ms-1"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        <?php endif; ?>

    </div>
</div>

<script>
function selectScheme(id, name) {
    document.getElementById('selected_scheme_input').value = id;
    alert('Selected Scheme: ' + name + '\nPlease complete the application wizard on the right.');
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
