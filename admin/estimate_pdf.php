<?php
// admin/estimate_pdf.php
// Professional Branded Estimate PDF & Printable Document
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/auth.php';

global $pdo;
require_login(['admin', 'staff', 'super_admin']);

$estimate_id = (int)($_GET['id'] ?? 0);
if ($estimate_id <= 0) {
    die("Invalid Estimate ID specified.");
}

// Fetch Estimate Details
$stmt = $pdo->prepare("
    SELECT e.*, 
           c.name AS customer_name, c.company_name, c.mobile, c.email, c.gstin AS customer_gstin,
           c.address, c.city, c.state, c.pincode, c.customer_code,
           u.name AS creator_name
    FROM estimates e
    JOIN customers c ON e.customer_id = c.id
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.id = ?
");
$stmt->execute([$estimate_id]);
$estimate = $stmt->fetch();

if (!$estimate) {
    die("Estimate record not found.");
}

// Fetch Estimate Items
$item_stmt = $pdo->prepare("
    SELECT ei.*, s.icon AS service_icon, s.featured_image
    FROM estimate_items ei
    LEFT JOIN services s ON ei.service_id = s.id
    WHERE ei.estimate_id = ?
    ORDER BY ei.sort_order ASC, ei.id ASC
");
$item_stmt->execute([$estimate_id]);
$items = $item_stmt->fetchAll();

// Company Settings from website_settings
$comp_name = get_setting('company_name', APP_NAME);
$comp_tagline = get_setting('company_tagline', APP_TAGLINE);
$comp_address = get_setting('company_address', 'Corporate Tower, Financial District');
$comp_city = get_setting('company_city', 'New Delhi');
$comp_state = get_setting('company_state', 'Delhi');
$comp_pincode = get_setting('company_pincode', '110001');
$comp_phone = get_setting('company_phone', get_setting('helpline_phone', '+91 9876543210'));
$comp_email = get_setting('company_email', get_setting('support_email', 'care@digitaludyogseva.com'));
$comp_gstin = get_setting('company_gstin', '07AAAAA0000A1Z5');

// Calculate GST Breakdown (CGST+SGST or IGST based on customer state)
$is_interstate = (!empty($estimate['state']) && strtolower(trim($estimate['state'])) !== strtolower(trim($comp_state)));
$tax_amount = (float)$estimate['tax_amount'];
$cgst_amount = $is_interstate ? 0.00 : ($tax_amount / 2);
$sgst_amount = $is_interstate ? 0.00 : ($tax_amount / 2);
$igst_amount = $is_interstate ? $tax_amount : 0.00;

// Collect All Required Documents across all items
$all_required_docs = [];
foreach ($items as $it) {
    if (!empty($it['required_docs_snapshot'])) {
        $docs_arr = json_decode($it['required_docs_snapshot'], true);
        if (is_array($docs_arr)) {
            foreach ($docs_arr as $d) {
                $doc_title = is_array($d) ? ($d['document_name'] ?? '') : (string)$d;
                if (!empty($doc_title) && !in_array($doc_title, $all_required_docs)) {
                    $all_required_docs[] = $doc_title;
                }
            }
        } else {
            // fallback plain text
            $lines = explode("\n", str_replace(',', "\n", $it['required_docs_snapshot']));
            foreach ($lines as $line) {
                $trimmed = trim($line);
                if (!empty($trimmed) && !in_array($trimmed, $all_required_docs)) {
                    $all_required_docs[] = $trimmed;
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estimate <?php echo htmlspecialchars($estimate['estimate_number']); ?> - <?php echo htmlspecialchars($comp_name); ?></title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <style>
        :root {
            --primary: #1e3a8a;
            --primary-light: #eff6ff;
            --accent: #2563eb;
            --dark: #0f172a;
            --slate: #475569;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background-color: #f1f5f9;
            color: var(--dark);
            margin: 0;
            padding: 24px;
        }

        .pdf-page {
            max-width: 920px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            padding: 42px 48px;
            border: 1px solid var(--border);
        }

        .estimate-badge {
            font-size: 1.1rem;
            letter-spacing: 0.5px;
        }

        .header-brand-title {
            font-size: 1.65rem;
            font-weight: 800;
            color: var(--primary);
            letter-spacing: -0.5px;
        }

        .table-custom {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
        }

        .table-custom thead th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 700;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 12px 14px;
            border-bottom: 2px solid var(--border);
        }

        .table-custom tbody td {
            padding: 14px 14px;
            border-bottom: 1px solid var(--border);
            font-size: 0.88rem;
            vertical-align: middle;
        }

        .calculation-card {
            background-color: #f8fafc;
            border-radius: 12px;
            border: 1px solid var(--border);
            padding: 18px 24px;
        }

        .calc-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            font-size: 0.9rem;
            color: var(--slate);
        }

        .calc-row.total-row {
            border-top: 2px dashed #cbd5e1;
            margin-top: 8px;
            padding-top: 12px;
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--primary);
        }

        .doc-pill {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 0.84rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .action-bar {
            max-width: 920px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: gap-2;
        }

        @media print {
            body {
                background: #ffffff !important;
                padding: 0 !important;
            }
            .action-bar, .no-print {
                display: none !important;
            }
            .pdf-page {
                box-shadow: none !important;
                border: none !important;
                padding: 20px !important;
                max-width: 100% !important;
            }
        }
    </style>
</head>
<body>

<!-- TOP ACTION CONTROLS (NO PRINT) -->
<div class="action-bar no-print">
    <a href="<?php echo BASE_URL; ?>admin/estimates.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
        <i class="bi bi-arrow-left me-1"></i> Back to Estimates
    </a>
    <div class="d-flex gap-2">
        <?php 
        $wa_msg = "Hello *" . urlencode($estimate['customer_name']) . "*,\n\nHere is your official service estimate *" . urlencode($estimate['estimate_number']) . "* from *" . urlencode($comp_name) . "*.\n\n*Grand Total:* ₹" . number_format($estimate['grand_total'], 2) . "\n*Valid Until:* " . date('d M Y', strtotime($estimate['valid_until'])) . "\n\nYou can view and download your estimate here:\n" . urlencode(BASE_URL . "admin/estimate_pdf.php?id=" . $estimate['id']) . "\n\nPlease let us know to proceed.\n\nThank you,\n" . urlencode($comp_name);
        $wa_phone = preg_replace('/[^0-9]/', '', $estimate['mobile']);
        if (strlen($wa_phone) === 10) $wa_phone = '91' . $wa_phone;
        ?>
        <a href="https://api.whatsapp.com/send?phone=<?php echo $wa_phone; ?>&text=<?php echo $wa_msg; ?>" target="_blank" class="btn btn-success rounded-pill px-3 fw-bold">
            <i class="bi bi-whatsapp me-1"></i> Share WhatsApp
        </a>
        <button onclick="window.print();" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
            <i class="bi bi-printer-fill me-1"></i> Print / Download PDF
        </button>
    </div>
</div>

<!-- PRINTABLE ESTIMATE PAGE -->
<div class="pdf-page">
    <!-- Header Block -->
    <div class="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
        <div>
            <div class="header-brand-title d-flex align-items-center gap-2">
                <i class="bi bi-patch-check-fill text-primary"></i> <?php echo htmlspecialchars($comp_name); ?>
            </div>
            <div class="text-muted small mb-2"><?php echo htmlspecialchars($comp_tagline); ?></div>
            <div class="small text-secondary lh-sm">
                <div><?php echo htmlspecialchars($comp_address); ?>, <?php echo htmlspecialchars($comp_city); ?>, <?php echo htmlspecialchars($comp_state); ?> - <?php echo htmlspecialchars($comp_pincode); ?></div>
                <div><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($comp_phone); ?> | <i class="bi bi-envelope me-1"></i> <?php echo htmlspecialchars($comp_email); ?></div>
                <?php if (!empty($comp_gstin)): ?>
                    <div class="fw-semibold mt-1">GSTIN: <span class="text-dark"><?php echo htmlspecialchars($comp_gstin); ?></span></div>
                <?php endif; ?>
            </div>
        </div>
        <div class="text-end">
            <div class="badge bg-primary rounded-pill px-3 py-2 fw-bold estimate-badge mb-2">
                ESTIMATE / QUOTATION
            </div>
            <h4 class="fw-bold text-dark mb-0"><?php echo htmlspecialchars($estimate['estimate_number']); ?></h4>
            <div class="small text-muted mt-1">
                <div><strong>Date:</strong> <?php echo date('d M Y', strtotime($estimate['estimate_date'])); ?></div>
                <div><strong>Valid Until:</strong> <?php echo date('d M Y', strtotime($estimate['valid_until'])); ?></div>
                <div>
                    <strong>Status:</strong> 
                    <span class="badge <?php 
                        echo $estimate['status'] === 'accepted' ? 'bg-success' : 
                            ($estimate['status'] === 'converted' ? 'bg-primary' : 
                            ($estimate['status'] === 'rejected' ? 'bg-danger' : 'bg-secondary')); 
                    ?> text-uppercase px-2">
                        <?php echo htmlspecialchars($estimate['status']); ?>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Customer "Bill To" Section -->
    <div class="card bg-light border-0 rounded-4 p-3 mb-4">
        <div class="row">
            <div class="col-md-7">
                <small class="text-uppercase text-muted fw-bold d-block mb-1">Quotation Prepared For:</small>
                <h5 class="fw-bold text-dark mb-1">
                    <?php echo htmlspecialchars($estimate['customer_name']); ?>
                    <?php if (!empty($estimate['company_name'])): ?>
                        <small class="text-muted fw-normal d-block fs-6"><?php echo htmlspecialchars($estimate['company_name']); ?></small>
                    <?php endif; ?>
                </h5>
                <div class="small text-secondary lh-sm">
                    <?php if (!empty($estimate['address'])): ?>
                        <div><?php echo htmlspecialchars($estimate['address']); ?>, <?php echo htmlspecialchars($estimate['city'] ?? ''); ?> <?php echo htmlspecialchars($estimate['state'] ?? ''); ?> <?php echo htmlspecialchars($estimate['pincode'] ?? ''); ?></div>
                    <?php endif; ?>
                    <div><i class="bi bi-telephone me-1"></i> <?php echo htmlspecialchars($estimate['mobile']); ?> | <i class="bi bi-envelope me-1"></i> <?php echo htmlspecialchars($estimate['email']); ?></div>
                    <?php if (!empty($estimate['customer_gstin'])): ?>
                        <div class="fw-bold text-dark mt-1">Customer GSTIN: <?php echo htmlspecialchars($estimate['customer_gstin']); ?></div>
                    <?php endif; ?>
                </div>
            </div>
            <div class="col-md-5 text-md-end mt-2 mt-md-0 border-start ps-md-4">
                <small class="text-uppercase text-muted fw-bold d-block mb-1">Account Summary:</small>
                <div class="small">
                    <div>Customer Code: <strong><?php echo htmlspecialchars($estimate['customer_code']); ?></strong></div>
                    <div>Prepared By: <strong><?php echo htmlspecialchars($estimate['creator_name'] ?: 'Admin Desk'); ?></strong></div>
                    <div>Currency: <strong><?php echo htmlspecialchars($estimate['currency']); ?> (₹)</strong></div>
                    <div>Total Services: <strong><?php echo count($items); ?> items</strong></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Services Table -->
    <div class="table-responsive mb-4">
        <table class="table-custom">
            <thead>
                <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 35%;">Service Description</th>
                    <th style="width: 12%;" class="text-end">Govt Fee</th>
                    <th style="width: 12%;" class="text-end">Prof Fee</th>
                    <th style="width: 8%;" class="text-end">Other</th>
                    <th style="width: 8%;" class="text-end">GST</th>
                    <th style="width: 5%;" class="text-center">Qty</th>
                    <th style="width: 15%;" class="text-end">Total</th>
                </tr>
            </thead>
            <tbody>
                <?php $i = 1; foreach ($items as $item): ?>
                    <tr>
                        <td class="text-muted fw-bold"><?php echo $i++; ?></td>
                        <td>
                            <strong class="d-block text-dark"><?php echo htmlspecialchars($item['service_name']); ?></strong>
                            <?php if (!empty($item['description'])): ?>
                                <small class="text-muted d-block"><?php echo htmlspecialchars($item['description']); ?></small>
                            <?php endif; ?>
                            <?php if (!empty($item['expected_time'])): ?>
                                <span class="badge bg-light text-secondary border px-2 py-0 mt-1 small">
                                    <i class="bi bi-clock me-1"></i> TAT: <?php echo htmlspecialchars($item['expected_time']); ?>
                                </span>
                            <?php endif; ?>
                        </td>
                        <td class="text-end text-secondary"><?php echo format_inr($item['govt_fee']); ?></td>
                        <td class="text-end text-primary fw-semibold"><?php echo format_inr($item['prof_fee']); ?></td>
                        <td class="text-end text-muted"><?php echo $item['other_charges'] > 0 ? format_inr($item['other_charges']) : '-'; ?></td>
                        <td class="text-end text-muted small"><?php echo (float)$item['gst_rate']; ?>%</td>
                        <td class="text-center fw-semibold"><?php echo (int)$item['quantity']; ?></td>
                        <td class="text-end fw-bold text-dark fs-6"><?php echo format_inr($item['total_price']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Mandatory Processing Disclaimer Note -->
    <div class="alert alert-secondary py-2 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2">
        <i class="bi bi-info-circle-fill text-primary"></i>
        <span><strong>Timeline Disclaimer:</strong> Processing time is estimated and may vary depending on government department approval, verification, document availability or third-party processing.</span>
    </div>

    <!-- Required Documents Checklist Box -->
    <?php if (!empty($all_required_docs)): ?>
        <div class="card border border-light-subtle rounded-4 p-3 bg-light mb-4">
            <h6 class="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                <i class="bi bi-card-checklist text-primary"></i> Documents Required from Customer:
            </h6>
            <div class="row g-2">
                <?php foreach ($all_required_docs as $doc): ?>
                    <div class="col-md-6">
                        <div class="doc-pill shadow-xs">
                            <i class="bi bi-check-circle-fill text-success"></i>
                            <span class="fw-semibold text-dark"><?php echo htmlspecialchars($doc); ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>

    <!-- Calculation & Payment Matrix -->
    <div class="row g-4 align-items-start mb-4">
        <div class="col-md-6">
            <!-- Payment Instructions & Banking -->
            <div class="card border rounded-4 p-3 h-100 bg-white">
                <h6 class="fw-bold mb-2 text-dark"><i class="bi bi-bank2 text-primary me-1"></i> Payment & Banking Details</h6>
                <div class="small text-secondary lh-sm">
                    <div>Bank Name: <strong>HDFC Bank / ICICI Bank</strong></div>
                    <div>Account Name: <strong><?php echo htmlspecialchars($comp_name); ?></strong></div>
                    <div>Account Number: <strong>50200012345678</strong></div>
                    <div>IFSC Code: <strong>HDFC0001234</strong></div>
                    <div>UPI ID: <strong>care@icici</strong></div>
                </div>
                <?php if (!empty($estimate['client_notes'])): ?>
                    <div class="mt-3 pt-3 border-top">
                        <small class="fw-bold text-dark d-block">Client Notes:</small>
                        <small class="text-muted"><?php echo nl2br(htmlspecialchars($estimate['client_notes'])); ?></small>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <div class="col-md-6">
            <div class="calculation-card">
                <div class="calc-row">
                    <span>Total Government Fees:</span>
                    <strong class="text-dark"><?php echo format_inr($estimate['total_govt_fee']); ?></strong>
                </div>
                <div class="calc-row">
                    <span>Professional / Service Fees:</span>
                    <strong class="text-dark"><?php echo format_inr($estimate['total_prof_fee']); ?></strong>
                </div>
                <?php if ($estimate['total_other_charges'] > 0): ?>
                    <div class="calc-row">
                        <span>Other Charges (Stamp/Token/Admin):</span>
                        <strong class="text-dark"><?php echo format_inr($estimate['total_other_charges']); ?></strong>
                    </div>
                <?php endif; ?>
                <div class="calc-row border-top pt-2 mt-1">
                    <span>Subtotal:</span>
                    <strong class="text-dark"><?php echo format_inr($estimate['subtotal']); ?></strong>
                </div>
                <?php if ($estimate['discount_amount'] > 0): ?>
                    <div class="calc-row text-danger">
                        <span>Discount Applied:</span>
                        <strong>- <?php echo format_inr($estimate['discount_amount']); ?></strong>
                    </div>
                <?php endif; ?>
                <?php if ($is_interstate): ?>
                    <div class="calc-row">
                        <span>IGST (18%):</span>
                        <strong><?php echo format_inr($igst_amount); ?></strong>
                    </div>
                <?php else: ?>
                    <div class="calc-row">
                        <span>CGST (9%):</span>
                        <strong><?php echo format_inr($cgst_amount); ?></strong>
                    </div>
                    <div class="calc-row">
                        <span>SGST (9%):</span>
                        <strong><?php echo format_inr($sgst_amount); ?></strong>
                    </div>
                <?php endif; ?>

                <div class="calc-row total-row">
                    <span>Grand Total:</span>
                    <span><?php echo format_inr($estimate['grand_total']); ?></span>
                </div>

                <div class="d-flex justify-content-between mt-3 pt-2 border-top small">
                    <div>Advance Required: <strong class="text-success"><?php echo format_inr($estimate['advance_required']); ?></strong></div>
                    <div>Balance Due: <strong class="text-danger"><?php echo format_inr($estimate['balance_due']); ?></strong></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Terms & Authorized Signature -->
    <div class="row pt-3 border-top align-items-end">
        <div class="col-8">
            <small class="fw-bold text-dark d-block mb-1">Standard Terms & Conditions:</small>
            <ol class="small text-muted ps-3 mb-0" style="font-size: 0.78rem;">
                <li>This quotation is valid until <?php echo date('d M Y', strtotime($estimate['valid_until'])); ?>.</li>
                <li>Government fees are statutory payments disbursed directly to official government portals.</li>
                <li>Turnaround time commences upon successful receipt of all verified required documents and advance fee.</li>
                <li>Any subsequent modifications or additional state taxes requested by department will be billed at actuals.</li>
            </ol>
        </div>
        <div class="col-4 text-end">
            <div class="d-inline-block text-center">
                <div class="mb-4" style="height: 48px;">
                    <!-- Digital Seal Stamp -->
                    <span class="badge bg-light text-primary border px-3 py-2 fw-normal small">
                        <i class="bi bi-shield-check"></i> Digitally Signed
                    </span>
                </div>
                <div class="border-top border-dark pt-1">
                    <strong class="small d-block text-dark">Authorized Signatory</strong>
                    <small class="text-muted" style="font-size: 0.72rem;"><?php echo htmlspecialchars($comp_name); ?></small>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
