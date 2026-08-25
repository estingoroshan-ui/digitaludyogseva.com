<?php
$page_title = "Document Vault & Upload Center | Customer Portal";
$active_menu = "documents";
require_once __DIR__ . '/includes/customer_header.php';
require_once __DIR__ . '/../classes/DocumentVault.php';

$cust_id = $customer_profile['id'] ?? 0;
global $pdo;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['doc_file'])) {
    $doc_type_id = (int)($_POST['doc_type_id'] ?? 1);
    $res = DocumentVault::upload_document($cust_id, $_FILES['doc_file'], $doc_type_id, null, null, $current_user['id']);
    if ($res['status']) {
        $msg = '<div class="alert alert-success fw-bold">Document uploaded to vault successfully!</div>';
    } else {
        $msg = '<div class="alert alert-danger fw-bold">' . htmlspecialchars($res['message']) . '</div>';
    }
}

// Fetch Document Types
$doc_types = $pdo->query("SELECT * FROM document_types WHERE status = 'active'")->fetchAll();

// Fetch Uploaded Documents
$docs = $pdo->query("
    SELECT d.*, dt.name AS doc_type_name
    FROM documents d
    LEFT JOIN document_types dt ON d.document_type_id = dt.id
    WHERE d.customer_id = {$cust_id}
    ORDER BY d.id DESC
")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Customer Document Vault</h4>
        <p class="text-muted small mb-0">Upload PAN, Aadhaar, 6-Month Bank Statements & Project Reports securely.</p>
    </div>
</div>

<?php echo $msg; ?>

<div class="row g-4">
    <!-- Upload Column -->
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="font-heading fw-bold mb-3"><i class="bi bi-cloud-arrow-up text-primary me-2"></i> Upload Document</h5>
            <form action="" method="POST" enctype="multipart/form-data">
                <?php render_csrf_field(); ?>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Select Document Type *</label>
                    <select name="doc_type_id" class="form-control" required>
                        <option value="1">Aadhaar Card / Address Proof</option>
                        <option value="2">PAN Card</option>
                        <option value="3">6-Month Bank Statement</option>
                        <option value="4">ITR / Tax Filing Copy</option>
                        <option value="5">Project Report / Machinery Quotation</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="form-label small fw-bold">Select File (PDF, JPG, PNG, DOC) *</label>
                    <input type="file" name="doc_file" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold">
                    Upload to Vault
                </button>
            </form>
        </div>
    </div>

    <!-- Vault Files List -->
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="font-heading fw-bold mb-3">Uploaded Document Vault</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Document Name</th>
                            <th>Upload Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($docs)): ?>
                            <tr><td colspan="3" class="text-center text-muted py-4">No documents uploaded yet.</td></tr>
                        <?php else: ?>
                            <?php foreach ($docs as $dc): ?>
                                <tr>
                                    <td>
                                        <i class="bi bi-file-earmark-pdf text-danger me-2 fs-5"></i>
                                        <strong class="text-dark"><?php echo htmlspecialchars($dc['file_name']); ?></strong>
                                    </td>
                                    <td><small><?php echo date('d M Y, h:i A', strtotime($dc['created_at'])); ?></small></td>
                                    <td>
                                        <?php if ($dc['verification_status'] === 'Approved'): ?>
                                            <span class="badge bg-success">Approved</span>
                                        <?php elseif ($dc['verification_status'] === 'Rejected'): ?>
                                            <span class="badge bg-danger">Rejected</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning text-dark"><?php echo htmlspecialchars($dc['verification_status']); ?></span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/customer_footer.php'; ?>
