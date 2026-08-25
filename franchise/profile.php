<?php
$page_title = "Profile & KYC Details | Franchise Portal";
$active_menu = "profile";
require_once __DIR__ . '/includes/franchise_header.php';

global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bank_name = sanitize($_POST['bank_name'] ?? '');
    $account_no = sanitize($_POST['account_no'] ?? '');
    $ifsc = sanitize($_POST['ifsc'] ?? '');
    $upi_id = sanitize($_POST['upi_id'] ?? '');

    $upd = $pdo->prepare("UPDATE franchises SET bank_name = ?, account_no = ?, ifsc = ?, upi_id = ? WHERE id = ?");
    $upd->execute([$bank_name, $account_no, $ifsc, $upi_id, $franchise_id]);
    $msg = '<div class="alert alert-success fw-bold">Bank details updated successfully!</div>';

    // Refresh profile
    $stmt->execute([$current_user['id']]);
    $franchise_profile = $stmt->fetch();
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Franchise Partner Profile & KYC</h4>
        <p class="text-muted small mb-0">View registered business details, agreement status & payout bank account.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="row g-4 mb-4">
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold border-bottom pb-2 mb-3"><i class="bi bi-building text-primary me-2"></i> Business Information</h5>
            <table class="table table-borderless small mb-0">
                <tr>
                    <td class="text-muted">Franchise Code:</td>
                    <td class="fw-bold font-monospace text-primary"><?php echo htmlspecialchars($franchise_profile['franchise_code']); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">Owner Name:</td>
                    <td class="fw-bold text-dark"><?php echo htmlspecialchars($franchise_profile['owner_name']); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">Business Name:</td>
                    <td class="fw-bold text-dark"><?php echo htmlspecialchars($franchise_profile['business_name']); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">Mobile Number:</td>
                    <td class="fw-bold text-dark"><?php echo htmlspecialchars($franchise_profile['mobile']); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">Email Address:</td>
                    <td class="fw-bold text-dark"><?php echo htmlspecialchars($franchise_profile['email']); ?></td>
                </tr>
                <tr>
                    <td class="text-muted">City / District:</td>
                    <td class="fw-bold text-dark"><?php echo htmlspecialchars($franchise_profile['city'] . ', ' . $franchise_profile['district']); ?></td>
                </tr>
            </table>
        </div>
    </div>

    <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 class="font-heading fw-bold border-bottom pb-2 mb-3"><i class="bi bi-bank text-primary me-2"></i> Payout Bank Account</h5>
            <form action="" method="POST">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Bank Name</label>
                    <input type="text" name="bank_name" class="form-control" value="<?php echo htmlspecialchars($franchise_profile['bank_name'] ?: 'State Bank of India'); ?>">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Account Number</label>
                    <input type="text" name="account_no" class="form-control" value="<?php echo htmlspecialchars($franchise_profile['account_no'] ?: '38495029481'); ?>">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">IFSC Code</label>
                    <input type="text" name="ifsc" class="form-control" value="<?php echo htmlspecialchars($franchise_profile['ifsc'] ?: 'SBIN0001234'); ?>">
                </div>
                <div class="mb-4">
                    <label class="form-label small fw-bold">UPI ID</label>
                    <input type="text" name="upi_id" class="form-control" value="<?php echo htmlspecialchars($franchise_profile['upi_id'] ?: 'franchise@upi'); ?>">
                </div>
                <button type="submit" class="btn btn-primary rounded-pill fw-bold w-100">Update Payout Bank Info</button>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/franchise_footer.php'; ?>
