<?php
$page_title = "Import Leads from CSV / Excel";
$active_menu = "leads";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/LeadManager.php';

$msg = '';
$imported_count = 0;
$skipped_count = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['csv_file'])) {
    $file = $_FILES['csv_file'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        $source_id = (int)($_POST['source_id'] ?? 1);
        $handle = fopen($file['tmp_name'], 'r');
        if ($handle !== false) {
            $header = fgetcsv($handle); // Read CSV header
            while (($row = fgetcsv($handle)) !== false) {
                $name = sanitize($row[0] ?? '');
                $mobile = sanitize($row[1] ?? '');
                $email = sanitize($row[2] ?? '');
                $business = sanitize($row[3] ?? '');
                $state = sanitize($row[4] ?? 'Rajasthan');

                if (!empty($name) && !empty($mobile)) {
                    $res = LeadManager::create_lead([
                        'name' => $name,
                        'mobile' => $mobile,
                        'email' => $email,
                        'business_name' => $business,
                        'state' => $state,
                        'source_id' => $source_id
                    ]);
                    if ($res['status'] && empty($res['is_duplicate'])) {
                        $imported_count++;
                    } else {
                        $skipped_count++;
                    }
                }
            }
            fclose($handle);
            $msg = "<div class='alert alert-success fw-bold'>CSV Import Completed! Successfully imported {$imported_count} leads. (Skipped {$skipped_count} duplicate or invalid rows).</div>";
        }
    } else {
        $msg = "<div class='alert alert-danger fw-bold'>Failed to upload CSV file.</div>";
    }
}

$sources = $pdo->query("SELECT * FROM lead_sources WHERE status = 'active'")->fetchAll();
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="font-heading fw-bold mb-1">Bulk Lead Import Engine</h4>
        <p class="text-muted small mb-0">Import leads from Facebook, Instagram, Google Ads, IndiaMART, Justdial or CSV files.</p>
    </div>
    <a href="<?php echo BASE_URL; ?>admin/crm_leads.php" class="btn btn-outline-primary rounded-pill px-4 fw-bold">
        <i class="bi bi-kanban me-1"></i> View Lead Pipeline
    </a>
</div>

<?php echo $msg; ?>

<div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white max-w-700 mx-auto mb-4">
    <h5 class="font-heading fw-bold mb-3"><i class="bi bi-file-earmark-spreadsheet text-success me-2"></i> Upload CSV File</h5>
    <p class="text-muted small mb-4">CSV format must have columns in order: <code>Name, Mobile, Email, Business Name, State</code></p>

    <form action="" method="POST" enctype="multipart/form-data">
        <?php render_csrf_field(); ?>
        <div class="mb-3">
            <label class="form-label small fw-bold">Select Lead Source Acquisition Channel *</label>
            <select name="source_id" class="form-select" required>
                <?php foreach ($sources as $src): ?>
                    <option value="<?php echo $src['id']; ?>"><?php echo htmlspecialchars($src['source_name']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="mb-4">
            <label class="form-label small fw-bold">Select CSV File (.csv) *</label>
            <input type="file" name="csv_file" class="form-control" accept=".csv" required>
        </div>
        <button type="submit" class="btn btn-success btn-lg w-100 fw-bold rounded-pill text-white shadow">
            Import Leads & De-duplicate <i class="bi bi-cloud-arrow-up ms-1"></i>
        </button>
    </form>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
