<?php
$page_title = "Estimate Master & Proposal Generator";
$active_menu = "estimates";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/Mailer.php';

global $pdo;
$msg = '';
$msg_type = 'success';

$action = $_GET['action'] ?? 'list';
$current_year = date('Y');

// Helper to generate next sequential estimate number
if (!function_exists('get_next_estimate_number')) {
    function get_next_estimate_number($pdo) {
        $year = date('Y');
        $prefix = "EST-{$year}-";
        $stmt = $pdo->prepare("SELECT estimate_number FROM estimates WHERE estimate_number LIKE ? ORDER BY id DESC LIMIT 1");
        $stmt->execute(["{$prefix}%"]);
        $last = $stmt->fetchColumn();

        if ($last) {
            $seq = (int)substr($last, strlen($prefix));
            $next_seq = $seq + 1;
        } else {
            $next_seq = 1;
        }
        return $prefix . str_pad($next_seq, 6, '0', STR_PAD_LEFT);
    }
}

if (!function_exists('get_next_order_number')) {
    function get_next_order_number($pdo) {
        $year = date('Y');
        $prefix = "ORD-{$year}-";
        $stmt = $pdo->prepare("SELECT order_number FROM service_orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1");
        $stmt->execute(["{$prefix}%"]);
        $last = $stmt->fetchColumn();

        if ($last) {
            $seq = (int)substr($last, strlen($prefix));
            $next_seq = $seq + 1;
        } else {
            $next_seq = 1;
        }
        return $prefix . str_pad($next_seq, 6, '0', STR_PAD_LEFT);
    }
}

// =========================================================================
// POST REQUEST HANDLERS
// =========================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $msg = "CSRF verification failed.";
        $msg_type = "danger";
    } else {
        $post_action = $_POST['action'];

        // --- 1. SAVE ESTIMATE (CREATE OR EDIT) ---
        if ($post_action === 'save_estimate') {
            $estimate_id = (int)($_POST['estimate_id'] ?? 0);
            $customer_id = (int)($_POST['customer_id'] ?? 0);
            $estimate_number = sanitize($_POST['estimate_number'] ?? '');
            if (empty($estimate_number)) {
                $estimate_number = get_next_estimate_number($pdo);
            }
            $estimate_date = sanitize($_POST['estimate_date'] ?? date('Y-m-d'));
            $valid_until = sanitize($_POST['valid_until'] ?? date('Y-m-d', strtotime('+15 days')));
            $status = in_array($_POST['status'] ?? '', ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted']) ? $_POST['status'] : 'draft';
            $client_notes = sanitize($_POST['client_notes'] ?? '');
            $terms = sanitize($_POST['terms_conditions'] ?? '');

            // Financial Fields
            $total_govt = (float)($_POST['calc_total_govt'] ?? 0);
            $total_prof = (float)($_POST['calc_total_prof'] ?? 0);
            $total_other = (float)($_POST['calc_total_other'] ?? 0);
            $subtotal = (float)($_POST['calc_subtotal'] ?? 0);
            $discount_type = ($_POST['discount_type'] ?? 'fixed') === 'percentage' ? 'percentage' : 'fixed';
            $discount_rate = (float)($_POST['discount_rate'] ?? 0);
            $discount_amount = (float)($_POST['calc_discount_amount'] ?? 0);
            $tax_amount = (float)($_POST['calc_tax_amount'] ?? 0);
            $grand_total = (float)($_POST['calc_grand_total'] ?? 0);
            $advance_required = (float)($_POST['advance_required'] ?? 0);
            $balance_due = max(0, $grand_total - $advance_required);

            if ($customer_id > 0 && !empty($_POST['items'])) {
                if ($estimate_id > 0) {
                    // Update
                    $stmt = $pdo->prepare("
                        UPDATE estimates SET
                            customer_id = ?, estimate_number = ?, estimate_date = ?, valid_until = ?, status = ?,
                            total_govt_fee = ?, total_prof_fee = ?, total_other_charges = ?, subtotal = ?,
                            discount_type = ?, discount_rate = ?, discount_amount = ?, tax_amount = ?, grand_total = ?,
                            advance_required = ?, balance_due = ?, client_notes = ?, terms_conditions = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        $customer_id, $estimate_number, $estimate_date, $valid_until, $status,
                        $total_govt, $total_prof, $total_other, $subtotal,
                        $discount_type, $discount_rate, $discount_amount, $tax_amount, $grand_total,
                        $advance_required, $balance_due, $client_notes, $terms, $estimate_id
                    ]);
                    $target_est_id = $estimate_id;
                    $msg = "Estimate {$estimate_number} updated successfully.";
                } else {
                    // Insert
                    $stmt = $pdo->prepare("
                        INSERT INTO estimates (
                            estimate_number, customer_id, estimate_date, valid_until, status,
                            total_govt_fee, total_prof_fee, total_other_charges, subtotal,
                            discount_type, discount_rate, discount_amount, tax_amount, grand_total,
                            advance_required, balance_due, client_notes, terms_conditions, created_by
                        ) VALUES (
                            ?, ?, ?, ?, ?,
                            ?, ?, ?, ?,
                            ?, ?, ?, ?, ?,
                            ?, ?, ?, ?, ?
                        )
                    ");
                    $stmt->execute([
                        $estimate_number, $customer_id, $estimate_date, $valid_until, $status,
                        $total_govt, $total_prof, $total_other, $subtotal,
                        $discount_type, $discount_rate, $discount_amount, $tax_amount, $grand_total,
                        $advance_required, $balance_due, $client_notes, $terms, $current_user['id'] ?? 1
                    ]);
                    $target_est_id = (int)$pdo->lastInsertId();
                    $msg = "Estimate {$estimate_number} created successfully.";
                }

                // Delete old items and insert fresh snapshot items
                $pdo->prepare("DELETE FROM estimate_items WHERE estimate_id = ?")->execute([$target_est_id]);
                $ins_item = $pdo->prepare("
                    INSERT INTO estimate_items (
                        estimate_id, service_id, service_name, service_code, description,
                        govt_fee, prof_fee, other_charges, gst_rate, gst_amount, quantity, total_price,
                        expected_time, required_docs_snapshot, sort_order
                    ) VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?
                    )
                ");

                $sort = 1;
                foreach ($_POST['items'] as $item) {
                    $s_id = !empty($item['service_id']) ? (int)$item['service_id'] : null;
                    $s_name = sanitize($item['service_name'] ?? 'Custom Service');
                    $s_code = sanitize($item['service_code'] ?? '');
                    $s_desc = sanitize($item['description'] ?? '');
                    $g_fee = (float)($item['govt_fee'] ?? 0);
                    $p_fee = (float)($item['prof_fee'] ?? 0);
                    $o_fee = (float)($item['other_charges'] ?? 0);
                    $g_rate = (float)($item['gst_rate'] ?? 18.00);
                    $qty = max(1, (int)($item['quantity'] ?? 1));

                    $taxable = ($p_fee + $o_fee) * $qty;
                    $gst_amt = ($taxable * $g_rate) / 100;
                    $t_price = ($g_fee * $qty) + $taxable + $gst_amt;
                    $e_time = sanitize($item['expected_time'] ?? '3-5 Working Days');

                    // If required docs snapshot was passed as json/array, or fetch from service_required_documents
                    $docs_snapshot = null;
                    if (!empty($item['docs_snapshot'])) {
                        $docs_snapshot = is_array($item['docs_snapshot']) ? json_encode($item['docs_snapshot']) : $item['docs_snapshot'];
                    } elseif ($s_id > 0) {
                        $docs_q = $pdo->prepare("SELECT document_name, is_mandatory FROM service_required_documents WHERE service_id = ? ORDER BY sort_order ASC");
                        $docs_q->execute([$s_id]);
                        $docs_snapshot = json_encode($docs_q->fetchAll(PDO::FETCH_ASSOC));
                    }

                    $ins_item->execute([
                        $target_est_id, $s_id, $s_name, $s_code, $s_desc,
                        $g_fee, $p_fee, $o_fee, $g_rate, $gst_amt, $qty, $t_price,
                        $e_time, $docs_snapshot, $sort
                    ]);
                    $sort++;
                }

                header("Location: " . BASE_URL . "admin/estimates.php?msg=" . urlencode($msg));
                exit;
            } else {
                $msg = "Please select a customer and add at least one service item.";
                $msg_type = "danger";
            }
        }

        // --- 2. DUPLICATE ESTIMATE ---
        if ($post_action === 'duplicate_estimate') {
            $est_id = (int)($_POST['estimate_id'] ?? 0);
            $stmt = $pdo->prepare("SELECT * FROM estimates WHERE id = ?");
            $stmt->execute([$est_id]);
            $source = $stmt->fetch();

            if ($source) {
                $new_num = get_next_estimate_number($pdo);
                $ins = $pdo->prepare("
                    INSERT INTO estimates (
                        estimate_number, customer_id, lead_id, estimate_date, valid_until, status,
                        currency, total_govt_fee, total_prof_fee, total_other_charges, subtotal,
                        discount_type, discount_rate, discount_amount, tax_amount, grand_total,
                        advance_required, balance_due, client_notes, terms_conditions, created_by
                    ) VALUES (
                        ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'draft',
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?
                    )
                ");
                $ins->execute([
                    $new_num, $source['customer_id'], $source['lead_id'],
                    $source['currency'], $source['total_govt_fee'], $source['total_prof_fee'], $source['total_other_charges'], $source['subtotal'],
                    $source['discount_type'], $source['discount_rate'], $source['discount_amount'], $source['tax_amount'], $source['grand_total'],
                    $source['advance_required'], $source['balance_due'], $source['client_notes'], $source['terms_conditions'], $current_user['id'] ?? 1
                ]);
                $new_est_id = (int)$pdo->lastInsertId();

                // Duplicate items
                $items = $pdo->prepare("SELECT * FROM estimate_items WHERE estimate_id = ?");
                $items->execute([$est_id]);
                $ins_item = $pdo->prepare("
                    INSERT INTO estimate_items (
                        estimate_id, service_id, service_name, service_code, description,
                        govt_fee, prof_fee, other_charges, gst_rate, gst_amount, quantity, total_price,
                        expected_time, required_docs_snapshot, sort_order
                    ) VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?
                    )
                ");
                foreach ($items->fetchAll() as $it) {
                    $ins_item->execute([
                        $new_est_id, $it['service_id'], $it['service_name'], $it['service_code'], $it['description'],
                        $it['govt_fee'], $it['prof_fee'], $it['other_charges'], $it['gst_rate'], $it['gst_amount'], $it['quantity'], $it['total_price'],
                        $it['expected_time'], $it['required_docs_snapshot'], $it['sort_order']
                    ]);
                }
                $msg = "Estimate duplicated successfully as {$new_num}.";
            }
        }

        // --- 3. CONVERT ESTIMATE TO SERVICE ORDER ---
        if ($post_action === 'convert_to_order') {
            $est_id = (int)($_POST['estimate_id'] ?? 0);
            $stmt = $pdo->prepare("SELECT * FROM estimates WHERE id = ?");
            $stmt->execute([$est_id]);
            $est = $stmt->fetch();

            if ($est) {
                $order_num = get_next_order_number($pdo);
                $ins_ord = $pdo->prepare("
                    INSERT INTO service_orders (
                        order_number, estimate_id, customer_id, order_date, status, payment_status,
                        total_govt_fee, total_prof_fee, total_other_charges, subtotal,
                        discount_amount, tax_amount, grand_total, advance_paid, balance_due, notes, created_by
                    ) VALUES (
                        ?, ?, ?, CURDATE(), 'pending', 'unpaid',
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?
                    )
                ");
                $ins_ord->execute([
                    $order_num, $est['id'], $est['customer_id'],
                    $est['total_govt_fee'], $est['total_prof_fee'], $est['total_other_charges'], $est['subtotal'],
                    $est['discount_amount'], $est['tax_amount'], $est['grand_total'],
                    $est['advance_required'], $est['balance_due'], $est['client_notes'], $current_user['id'] ?? 1
                ]);
                $new_ord_id = (int)$pdo->lastInsertId();

                // Transfer items with historical price snapshots preserved
                $e_items = $pdo->prepare("SELECT * FROM estimate_items WHERE estimate_id = ?");
                $e_items->execute([$est_id]);
                $ins_o_item = $pdo->prepare("
                    INSERT INTO service_order_items (
                        order_id, service_id, service_name, service_code, description,
                        govt_fee, prof_fee, other_charges, gst_rate, gst_amount, quantity, total_price,
                        expected_time, required_docs_snapshot, status, sort_order
                    ) VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, 'pending', ?
                    )
                ");
                foreach ($e_items->fetchAll() as $it) {
                    $ins_o_item->execute([
                        $new_ord_id, $it['service_id'], $it['service_name'], $it['service_code'], $it['description'],
                        $it['govt_fee'], $it['prof_fee'], $it['other_charges'], $it['gst_rate'], $it['gst_amount'], $it['quantity'], $it['total_price'],
                        $it['expected_time'], $it['required_docs_snapshot'], $it['sort_order']
                    ]);
                }

                // Update Estimate Status to converted
                $pdo->prepare("UPDATE estimates SET status = 'converted', converted_order_id = ? WHERE id = ?")
                    ->execute([$new_ord_id, $est_id]);

                header("Location: " . BASE_URL . "admin/service_orders.php?msg=" . urlencode("Estimate {$est['estimate_number']} successfully converted to Service Order {$order_num}!"));
                exit;
            }
        }

        // --- 4. UPDATE STATUS (ACCEPTED / REJECTED / EXPIRED) ---
        if ($post_action === 'update_status') {
            $est_id = (int)($_POST['estimate_id'] ?? 0);
            $new_status = in_array($_POST['status'] ?? '', ['draft', 'sent', 'accepted', 'rejected', 'expired']) ? $_POST['status'] : 'draft';
            if ($est_id > 0) {
                $pdo->prepare("UPDATE estimates SET status = ? WHERE id = ?")->execute([$new_status, $est_id]);
                $msg = "Estimate status updated to " . ucfirst($new_status) . ".";
            }
        }

        // --- 5. SEND EMAIL ---
        if ($post_action === 'send_email') {
            $est_id = (int)($_POST['estimate_id'] ?? 0);
            $to_email = sanitize($_POST['recipient_email'] ?? '');
            $subject = sanitize($_POST['email_subject'] ?? 'Quotation from Digital Udyog Seva');
            $body = $_POST['email_body'] ?? '';

            if (!empty($to_email) && $est_id > 0) {
                $sent = Mailer::send($to_email, $subject, nl2br($body));
                if ($sent) {
                    $pdo->prepare("UPDATE estimates SET status = 'sent' WHERE id = ? AND status = 'draft'")->execute([$est_id]);
                    $msg = "Estimate email successfully sent to {$to_email}.";
                } else {
                    $msg = "Failed to send email. Please check SMTP configuration in Settings.";
                    $msg_type = "danger";
                }
            }
        }

        // --- 6. DELETE ESTIMATE ---
        if ($post_action === 'delete_estimate') {
            $est_id = (int)($_POST['estimate_id'] ?? 0);
            if ($est_id > 0) {
                $pdo->prepare("DELETE FROM estimates WHERE id = ?")->execute([$est_id]);
                $msg = "Estimate deleted successfully.";
            }
        }
    }
}

if (isset($_GET['msg'])) {
    $msg = sanitize($_GET['msg']);
}

// =========================================================================
// VIEW ROUTING: CREATE / EDIT / LIST
// =========================================================================
if ($action === 'create' || $action === 'edit') {
    // FORM VIEW
    $edit_id = (int)($_GET['id'] ?? 0);
    $est_data = null;
    $est_items = [];

    if ($action === 'edit' && $edit_id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM estimates WHERE id = ?");
        $stmt->execute([$edit_id]);
        $est_data = $stmt->fetch();

        if ($est_data) {
            $i_stmt = $pdo->prepare("SELECT * FROM estimate_items WHERE estimate_id = ? ORDER BY sort_order ASC");
            $i_stmt->execute([$edit_id]);
            $est_items = $i_stmt->fetchAll();
        }
    }

    // Default Values
    try {
        $form_est_number = $est_data ? $est_data['estimate_number'] : get_next_estimate_number($pdo);
    } catch (Throwable $e) {
        $form_est_number = 'EST-' . date('Y') . '-000001';
    }
    $form_est_date = $est_data ? $est_data['estimate_date'] : date('Y-m-d');
    $form_valid_until = $est_data ? $est_data['valid_until'] : date('Y-m-d', strtotime('+15 days'));
    $form_cust_id = $est_data ? $est_data['customer_id'] : 0;
    $form_status = $est_data ? $est_data['status'] : 'draft';
    $form_disc_type = $est_data ? $est_data['discount_type'] : 'fixed';
    $form_disc_rate = $est_data ? (float)$est_data['discount_rate'] : 0;
    $form_adv = $est_data ? (float)$est_data['advance_required'] : 0;
    $form_notes = $est_data ? $est_data['client_notes'] : '';
    $form_terms = $est_data ? $est_data['terms_conditions'] : "1. Government fees are statutory portal deposits.\n2. Turnaround time starts upon submission of verified required documents.\n3. Quotation valid for 15 days from date of issue.";

    // Customers List
    $customers = [];
    try {
        $customers = $pdo->query("SELECT id, name, company_name, mobile, email, gstin, city, state FROM customers ORDER BY name ASC")->fetchAll();
    } catch (Throwable $e) {
        try {
            $customers = $pdo->query("SELECT id, name, mobile, email FROM customers ORDER BY name ASC")->fetchAll();
        } catch (Throwable $e2) {}
    }

    // Services Catalog for Selector
    $services_list = [];
    try {
        $services_list = $pdo->query("
            SELECT s.*, sc.name AS category_name
            FROM services s
            LEFT JOIN service_categories sc ON s.category_id = sc.id
            WHERE s.status = 'active'
            ORDER BY s.display_order ASC, s.name ASC
        ")->fetchAll();
    } catch (Throwable $e) {
        try {
            $services_list = $pdo->query("
                SELECT s.*, '' AS category_name
                FROM services s
                WHERE s.status = 'active'
                ORDER BY s.name ASC
            ")->fetchAll();
        } catch (Throwable $e2) {
            try {
                $services_list = $pdo->query("SELECT * FROM services ORDER BY id DESC")->fetchAll();
            } catch (Throwable $e3) {}
        }
    }

    // Categories List for Selector Filter
    $categories_list = [];
    try {
        $categories_list = $pdo->query("SELECT id, name FROM service_categories WHERE parent_id IS NULL ORDER BY sort_order ASC")->fetchAll();
    } catch (Throwable $e) {
        try {
            $categories_list = $pdo->query("SELECT id, name FROM service_categories ORDER BY id ASC")->fetchAll();
        } catch (Throwable $e2) {}
    }

    // Pre-map required documents by service_id for instant local addition
    $service_docs_map = [];
    try {
        $docs_rows = $pdo->query("SELECT service_id, document_name FROM service_required_documents ORDER BY sort_order ASC")->fetchAll();
        foreach ($docs_rows as $dr) {
            $service_docs_map[$dr['service_id']][] = $dr['document_name'];
        }
    } catch (Throwable $e) {}
    ?>

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1 small">
                    <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/index.php">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/estimates.php">Estimates</a></li>
                    <li class="breadcrumb-item active"><?php echo $action === 'edit' ? 'Edit Estimate' : 'Create New Estimate'; ?></li>
                </ol>
            </nav>
            <h4 class="font-heading fw-bold mb-1"><?php echo $action === 'edit' ? 'Edit Estimate: ' . htmlspecialchars($form_est_number) : 'Generate Professional Estimate'; ?></h4>
            <p class="text-muted small mb-0">Add services, configure fees, load required documents & calculate real-time totals.</p>
        </div>
        <a href="estimates.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </a>
    </div>

    <?php if (!empty($msg)): ?>
        <div class="alert alert-<?php echo $msg_type; ?> alert-dismissible fade show rounded-3 shadow-sm" role="alert">
            <i class="bi bi-info-circle-fill me-2"></i> <?php echo htmlspecialchars($msg); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <form action="" method="POST" id="estimateForm">
        <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
        <input type="hidden" name="action" value="save_estimate">
        <input type="hidden" name="estimate_id" value="<?php echo $edit_id; ?>">

        <!-- HIDDEN CALCULATION ACCUMULATORS -->
        <input type="hidden" name="calc_total_govt" id="calc_total_govt" value="0">
        <input type="hidden" name="calc_total_prof" id="calc_total_prof" value="0">
        <input type="hidden" name="calc_total_other" id="calc_total_other" value="0">
        <input type="hidden" name="calc_subtotal" id="calc_subtotal" value="0">
        <input type="hidden" name="calc_discount_amount" id="calc_discount_amount" value="0">
        <input type="hidden" name="calc_tax_amount" id="calc_tax_amount" value="0">
        <input type="hidden" name="calc_grand_total" id="calc_grand_total" value="0">

        <!-- 1. CUSTOMER & METADATA CARD -->
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h6 class="fw-bold mb-3 text-dark border-bottom pb-2">
                <i class="bi bi-person-bounding-box text-primary me-2"></i> 1. Customer & Quotation Details
            </h6>
            <div class="row g-3">
                <div class="col-md-5">
                    <label class="form-label small fw-bold">Select Customer *</label>
                    <select name="customer_id" id="estimate_customer_id" class="form-select rounded-3" required onchange="onCustomerSelect(this)">
                        <option value="">-- Choose Existing Customer --</option>
                        <?php foreach ($customers as $c): ?>
                            <option value="<?php echo $c['id']; ?>" 
                                    data-mobile="<?php echo htmlspecialchars($c['mobile'] ?? ''); ?>"
                                    data-email="<?php echo htmlspecialchars($c['email'] ?? ''); ?>"
                                    data-gstin="<?php echo htmlspecialchars($c['gstin'] ?? ''); ?>"
                                    data-state="<?php echo htmlspecialchars($c['state'] ?? ''); ?>"
                                    data-company="<?php echo htmlspecialchars($c['company_name'] ?? ''); ?>"
                                    <?php echo $form_cust_id == $c['id'] ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($c['name'] ?? ''); ?> <?php echo !empty($c['company_name']) ? '(' . htmlspecialchars($c['company_name']) . ')' : ''; ?> - <?php echo htmlspecialchars($c['mobile'] ?? ''); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <!-- Customer Details Preview Banner -->
                    <div id="customerPreviewBox" class="card bg-light border-0 p-2 mt-2 rounded-3 small" style="display: none;">
                        <div><strong>Phone:</strong> <span id="preview_cust_mobile">-</span> | <strong>Email:</strong> <span id="preview_cust_email">-</span></div>
                        <div><strong>GSTIN:</strong> <span id="preview_cust_gstin">N/A</span> | <strong>State:</strong> <span id="preview_cust_state">Delhi</span></div>
                    </div>
                </div>
                <div class="col-md-2">
                    <label class="form-label small fw-bold">Estimate Number *</label>
                    <input type="text" name="estimate_number" class="form-control rounded-3 fw-bold text-primary" value="<?php echo htmlspecialchars($form_est_number); ?>" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label small fw-bold">Estimate Date *</label>
                    <input type="date" name="estimate_date" class="form-control rounded-3" value="<?php echo htmlspecialchars($form_est_date); ?>" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label small fw-bold">Valid Until Date *</label>
                    <input type="date" name="valid_until" class="form-control rounded-3" value="<?php echo htmlspecialchars($form_valid_until); ?>" required>
                </div>
                <div class="col-md-1">
                    <label class="form-label small fw-bold">Status</label>
                    <select name="status" class="form-select rounded-3">
                        <option value="draft" <?php echo $form_status === 'draft' ? 'selected' : ''; ?>>Draft</option>
                        <option value="sent" <?php echo $form_status === 'sent' ? 'selected' : ''; ?>>Sent</option>
                        <option value="accepted" <?php echo $form_status === 'accepted' ? 'selected' : ''; ?>>Accepted</option>
                        <option value="rejected" <?php echo $form_status === 'rejected' ? 'selected' : ''; ?>>Rejected</option>
                        <option value="expired" <?php echo $form_status === 'expired' ? 'selected' : ''; ?>>Expired</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 2. SERVICE & DOCUMENT ITEMS CARD -->
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 flex-wrap gap-2">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">
                        <i class="bi bi-cart-plus-fill text-primary me-2"></i> 2. Selected Services & Fee Matrix
                    </h6>
                    <small class="text-muted">Add multiple services to this estimate. Fees and statutory components are editable inline.</small>
                </div>
                <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#serviceSelectorModal">
                    <i class="bi bi-plus-circle me-1"></i> Add Service / Document
                </button>
            </div>

            <!-- Table layout requested: Service | Govt Fee | Service Fee | Other | Tax | Qty | Total | Time | Action -->
            <div class="table-responsive">
                <table class="table table-bordered align-middle" id="estimateItemsTable">
                    <thead class="table-light small text-uppercase">
                        <tr>
                            <th style="min-width: 260px;">Service</th>
                            <th style="width: 110px;" class="text-end">Govt Fee (₹)</th>
                            <th style="width: 120px;" class="text-end">Service Fee (₹)</th>
                            <th style="width: 100px;" class="text-end">Other (₹)</th>
                            <th style="width: 85px;" class="text-end">GST %</th>
                            <th style="width: 70px;" class="text-center">Qty</th>
                            <th style="width: 130px;" class="text-end">Total (₹)</th>
                            <th style="width: 140px;">Expected Time</th>
                            <th style="width: 50px;" class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="estimateItemsBody">
                        <!-- Dynamic Rows Injected Here via JavaScript -->
                    </tbody>
                </table>
            </div>

            <!-- Turnaround Time Mandatory Disclaimer -->
            <div class="alert alert-light border small rounded-3 mt-3 d-flex align-items-center gap-2">
                <i class="bi bi-shield-exclamation text-warning fs-5"></i>
                <span class="text-muted">
                    <strong>Processing Disclaimer:</strong> Processing time is estimated and may vary depending on government department approval, verification, document availability or third-party processing.
                </span>
            </div>
        </div>

        <!-- 3. DYNAMIC REQUIRED DOCUMENTS CHECKLIST -->
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">
                        <i class="bi bi-card-checklist text-primary me-2"></i> 3. Required Documents Checklist
                    </h6>
                    <small class="text-muted">Automatically assembled from database for selected services. Printed on the final Estimate PDF.</small>
                </div>
                <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2" id="docsCountBadge">0 Documents Required</span>
            </div>

            <div id="estimateDocsContainer" class="row g-2">
                <div class="col-12 text-muted small py-2" id="noDocsNotice">
                    <em>No services selected yet. Add services above to automatically load required documents.</em>
                </div>
            </div>
        </div>

        <!-- 4. BOTTOM AUTOMATIC CALCULATION & TOTALS -->
        <div class="row g-4 mb-4">
            <div class="col-lg-6">
                <!-- Notes & Terms -->
                <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                    <h6 class="fw-bold mb-3 text-dark border-bottom pb-2">
                        <i class="bi bi-journal-text text-primary me-2"></i> 4. Notes & Client Terms
                    </h6>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Client Notes / Special Instructions</label>
                        <textarea name="client_notes" class="form-control rounded-3" rows="3" placeholder="Notes visible to client on the quotation..."><?php echo htmlspecialchars($form_notes); ?></textarea>
                    </div>
                    <div>
                        <label class="form-label small fw-bold">Terms & Conditions</label>
                        <textarea name="terms_conditions" class="form-control rounded-3 small" rows="4"><?php echo htmlspecialchars($form_terms); ?></textarea>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <!-- Financial Calculation Card -->
                <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <h6 class="fw-bold mb-3 text-dark border-bottom pb-2">
                        <i class="bi bi-calculator-fill text-primary me-2"></i> 5. Automatic Calculation Summary
                    </h6>

                    <div class="d-flex justify-content-between py-1 small">
                        <span class="text-muted">Government Fees:</span>
                        <strong class="text-dark" id="display_govt_fee">₹0.00</strong>
                    </div>
                    <div class="d-flex justify-content-between py-1 small">
                        <span class="text-muted">Professional Fees:</span>
                        <strong class="text-dark" id="display_prof_fee">₹0.00</strong>
                    </div>
                    <div class="d-flex justify-content-between py-1 small">
                        <span class="text-muted">Other Charges:</span>
                        <strong class="text-dark" id="display_other_charges">₹0.00</strong>
                    </div>
                    <div class="d-flex justify-content-between py-2 border-top fw-bold">
                        <span class="text-dark">Subtotal:</span>
                        <span class="text-dark fs-6" id="display_subtotal">₹0.00</span>
                    </div>

                    <!-- Discount Section -->
                    <div class="row g-2 align-items-center my-2 p-2 bg-light rounded-3">
                        <div class="col-4">
                            <span class="small fw-bold text-dark">Discount:</span>
                        </div>
                        <div class="col-4">
                            <select name="discount_type" id="est_discount_type" class="form-select form-select-sm rounded-2" onchange="recalculateTotals()">
                                <option value="fixed" <?php echo $form_disc_type === 'fixed' ? 'selected' : ''; ?>>Fixed (₹)</option>
                                <option value="percentage" <?php echo $form_disc_type === 'percentage' ? 'selected' : ''; ?>>Percentage (%)</option>
                            </select>
                        </div>
                        <div class="col-4">
                            <input type="number" step="0.01" name="discount_rate" id="est_discount_rate" class="form-control form-control-sm rounded-2 text-end" value="<?php echo $form_disc_rate; ?>" oninput="recalculateTotals()">
                        </div>
                        <div class="col-12 text-end text-danger small">
                            Discount Amount: <strong id="display_discount_amt">- ₹0.00</strong>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between py-1 small">
                        <span class="text-muted">GST / Tax (18% on Taxable):</span>
                        <strong class="text-dark" id="display_tax_amt">₹0.00</strong>
                    </div>

                    <div class="d-flex justify-content-between py-3 border-top border-2 my-2 align-items-center">
                        <span class="fs-5 fw-bold text-dark">Grand Total:</span>
                        <span class="fs-4 fw-bold text-success" id="display_grand_total">₹0.00</span>
                    </div>

                    <!-- Advance & Balance -->
                    <div class="p-3 bg-light rounded-4 border">
                        <div class="row g-2 align-items-center mb-2">
                            <div class="col-6">
                                <label class="form-label small fw-bold mb-0">Advance Required (₹):</label>
                            </div>
                            <div class="col-6">
                                <input type="number" step="0.01" name="advance_required" id="est_advance_required" class="form-control form-control-sm text-end fw-bold text-primary" value="<?php echo $form_adv; ?>" oninput="recalculateTotals()">
                            </div>
                        </div>
                        <div class="d-flex gap-2 justify-content-end mb-2">
                            <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0" onclick="setAdvancePercent(25)">25%</button>
                            <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0" onclick="setAdvancePercent(50)">50%</button>
                            <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0" onclick="setAdvancePercent(100)">100%</button>
                        </div>
                        <div class="d-flex justify-content-between border-top pt-2 fw-bold text-danger">
                            <span>Balance Due:</span>
                            <span id="display_balance_due">₹0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SAVE / CANCEL BUTTONS -->
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-row justify-content-between align-items-center">
            <a href="estimates.php" class="btn btn-light rounded-pill px-4">Cancel</a>
            <button type="submit" class="btn btn-primary rounded-pill px-5 fw-bold shadow">
                <i class="bi bi-check2-circle me-1"></i> Save Estimate & Generate Quotation
            </button>
        </div>
    </form>

    <!-- SEARCHABLE SERVICE SELECTOR MODAL -->
    <div class="modal fade" id="serviceSelectorModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-bottom py-3 px-4 bg-light">
                    <h5 class="modal-title font-heading fw-bold">Select Service / Document to Add</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="p-3 border-bottom bg-white">
                    <div class="row g-2">
                        <div class="col-md-7">
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="bi bi-search text-muted"></i></span>
                                <input type="text" id="modalServiceSearch" class="form-control" placeholder="Search services (e.g. Private Limited, GST, PAN)...">
                            </div>
                        </div>
                        <div class="col-md-5">
                            <select id="modalCategoryFilter" class="form-select">
                                <option value="">All Categories</option>
                                <?php foreach ($categories_list as $cl): ?>
                                    <option value="<?php echo $cl['id']; ?>"><?php echo htmlspecialchars($cl['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-body p-3" style="max-height: 480px;">
                    <div class="list-group list-group-flush" id="servicesModalList">
                        <?php foreach ($services_list as $srv): ?>
                            <div class="list-group-item list-group-item-action p-3 rounded-3 mb-2 border service-pick-item"
                                 data-id="<?php echo $srv['id']; ?>"
                                 data-name="<?php echo htmlspecialchars($srv['name']); ?>"
                                 data-code="<?php echo htmlspecialchars($srv['service_code'] ?: 'SRV-' . $srv['id']); ?>"
                                 data-desc="<?php echo htmlspecialchars($srv['short_description']); ?>"
                                 data-govt="<?php echo $srv['govt_fee']; ?>"
                                 data-prof="<?php echo $srv['prof_fee']; ?>"
                                 data-other="<?php echo $srv['other_charges']; ?>"
                                 data-gst="<?php echo $srv['is_gst_applicable'] ? $srv['gst_rate'] : 0; ?>"
                                 data-time="<?php echo htmlspecialchars($srv['expected_completion_time'] ?: '3-5 Working Days'); ?>"
                                 data-icon="<?php echo htmlspecialchars($srv['icon'] ?: 'bi-briefcase'); ?>"
                                 data-cat-id="<?php echo $srv['category_id']; ?>"
                                 data-docs="<?php echo htmlspecialchars(json_encode($service_docs_map[$srv['id']] ?? [])); ?>">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="bg-primary-subtle text-primary rounded-3 p-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.3rem;">
                                            <i class="bi <?php echo htmlspecialchars($srv['icon'] ?: 'bi-briefcase'); ?>"></i>
                                        </div>
                                        <div>
                                            <div class="d-flex align-items-center gap-2">
                                                <strong class="text-dark"><?php echo htmlspecialchars($srv['name'] ?? ''); ?></strong>
                                                <span class="badge bg-light text-secondary border"><?php echo htmlspecialchars($srv['service_code'] ?? ''); ?></span>
                                            </div>
                                            <small class="text-muted d-block"><?php echo htmlspecialchars($srv['category_name'] ?? ''); ?> | TAT: <?php echo htmlspecialchars($srv['expected_completion_time'] ?? ''); ?></small>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <div class="fw-bold text-success fs-6"><?php echo format_inr($srv['final_price']); ?></div>
                                        <small class="text-muted">Govt: <?php echo format_inr($srv['govt_fee']); ?> | Prof: <?php echo format_inr($srv['prof_fee']); ?></small>
                                        <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 mt-1" onclick="addServiceToEstimate(this.closest('.service-pick-item'))">
                                            <i class="bi bi-plus-lg"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    // Existing Items if in Edit mode
    const preloadedItems = <?php echo json_encode($est_items); ?>;

    // Active items array in memory
    let estimateItems = [];

    document.addEventListener('DOMContentLoaded', function() {
        if (preloadedItems && preloadedItems.length > 0) {
            preloadedItems.forEach(it => {
                let docs = [];
                try {
                    docs = JSON.parse(it.required_docs_snapshot || '[]');
                } catch(e) {}
                renderItemRow({
                    service_id: it.service_id,
                    service_code: it.service_code,
                    service_name: it.service_name,
                    description: it.description,
                    govt_fee: parseFloat(it.govt_fee || 0),
                    prof_fee: parseFloat(it.prof_fee || 0),
                    other_charges: parseFloat(it.other_charges || 0),
                    gst_rate: parseFloat(it.gst_rate || 18),
                    quantity: parseInt(it.quantity || 1),
                    expected_time: it.expected_time,
                    docs: docs
                });
            });
        }
        onCustomerSelect(document.getElementById('estimate_customer_id'));
    });

    function onCustomerSelect(selectElem) {
        const opt = selectElem.options[selectElem.selectedIndex];
        const previewBox = document.getElementById('customerPreviewBox');
        if (opt && opt.value) {
            document.getElementById('preview_cust_mobile').innerText = opt.getAttribute('data-mobile') || '-';
            document.getElementById('preview_cust_email').innerText = opt.getAttribute('data-email') || '-';
            document.getElementById('preview_cust_gstin').innerText = opt.getAttribute('data-gstin') || 'N/A';
            document.getElementById('preview_cust_state').innerText = opt.getAttribute('data-state') || 'Delhi';
            previewBox.style.display = 'block';
        } else {
            previewBox.style.display = 'none';
        }
    }

    // Modal Live Search & Category Filter
    document.getElementById('modalServiceSearch')?.addEventListener('input', filterModalServices);
    document.getElementById('modalCategoryFilter')?.addEventListener('change', filterModalServices);

    function filterModalServices() {
        const term = (document.getElementById('modalServiceSearch').value || '').toLowerCase();
        const catId = document.getElementById('modalCategoryFilter').value;
        const items = document.querySelectorAll('.service-pick-item');

        items.forEach(it => {
            const name = (it.getAttribute('data-name') || '').toLowerCase();
            const code = (it.getAttribute('data-code') || '').toLowerCase();
            const itCat = it.getAttribute('data-cat-id');

            const matchesText = name.includes(term) || code.includes(term);
            const matchesCat = !catId || itCat === catId;

            it.style.display = (matchesText && matchesCat) ? '' : 'none';
        });
    }

    // Add service from modal into estimate
    function addServiceToEstimate(elem) {
        const srvId = elem.getAttribute('data-id');
        const srvName = elem.getAttribute('data-name');
        const srvCode = elem.getAttribute('data-code');
        const srvDesc = elem.getAttribute('data-desc');
        const govt = parseFloat(elem.getAttribute('data-govt')) || 0;
        const prof = parseFloat(elem.getAttribute('data-prof')) || 0;
        const other = parseFloat(elem.getAttribute('data-other')) || 0;
        const gst = parseFloat(elem.getAttribute('data-gst')) || 18;
        const timeStr = elem.getAttribute('data-time') || '3-5 Working Days';

        let docs = [];
        try {
            docs = JSON.parse(elem.getAttribute('data-docs') || '[]');
        } catch(e) {
            docs = [];
        }

        renderItemRow({
            service_id: srvId,
            service_code: srvCode,
            service_name: srvName,
            description: srvDesc,
            govt_fee: govt,
            prof_fee: prof,
            other_charges: other,
            gst_rate: gst,
            quantity: 1,
            expected_time: timeStr,
            docs: docs
        });

        // Close modal cleanly
        const modalElem = document.getElementById('serviceSelectorModal');
        if (modalElem) {
            const modal = bootstrap.Modal.getInstance(modalElem) || bootstrap.Modal.getOrCreateInstance(modalElem);
            if (modal) modal.hide();
        }
    }

    // Render single row in items table
    function renderItemRow(item) {
        const tbody = document.getElementById('estimateItemsBody');
        const rowIdx = tbody.children.length;

        const tr = document.createElement('tr');
        tr.className = 'estimate-row';
        tr.id = 'row_' + rowIdx;

        const docsJson = JSON.stringify(item.docs || []);

        tr.innerHTML = `
            <td>
                <input type="hidden" name="items[${rowIdx}][service_id]" value="${item.service_id || ''}">
                <input type="hidden" name="items[${rowIdx}][service_code]" value="${escapeHtml(item.service_code || '')}">
                <input type="hidden" name="items[${rowIdx}][docs_snapshot]" value="${escapeHtml(docsJson)}" class="row-docs-snapshot">
                <input type="text" name="items[${rowIdx}][service_name]" class="form-control form-control-sm fw-bold mb-1" value="${escapeHtml(item.service_name)}" required>
                <input type="text" name="items[${rowIdx}][description]" class="form-control form-control-sm text-muted" placeholder="Optional short note..." value="${escapeHtml(item.description || '')}">
            </td>
            <td>
                <input type="number" step="0.01" name="items[${rowIdx}][govt_fee]" class="form-control form-control-sm text-end row-govt" value="${item.govt_fee.toFixed(2)}" oninput="recalculateTotals()">
            </td>
            <td>
                <input type="number" step="0.01" name="items[${rowIdx}][prof_fee]" class="form-control form-control-sm text-end row-prof" value="${item.prof_fee.toFixed(2)}" oninput="recalculateTotals()">
            </td>
            <td>
                <input type="number" step="0.01" name="items[${rowIdx}][other_charges]" class="form-control form-control-sm text-end row-other" value="${item.other_charges.toFixed(2)}" oninput="recalculateTotals()">
            </td>
            <td>
                <input type="number" step="0.01" name="items[${rowIdx}][gst_rate]" class="form-control form-control-sm text-end row-gst" value="${item.gst_rate.toFixed(2)}" oninput="recalculateTotals()">
            </td>
            <td>
                <input type="number" name="items[${rowIdx}][quantity]" class="form-control form-control-sm text-center row-qty" value="${item.quantity}" min="1" oninput="recalculateTotals()">
            </td>
            <td class="text-end fw-bold text-dark fs-6 row-total">
                ₹0.00
            </td>
            <td>
                <input type="text" name="items[${rowIdx}][expected_time]" class="form-control form-control-sm" value="${escapeHtml(item.expected_time || '3-5 Working Days')}">
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-danger border-0 rounded-circle" onclick="this.closest('tr').remove(); recalculateTotals();">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
        recalculateTotals();
    }

    // Master Recalculation Engine
    function recalculateTotals() {
        const rows = document.querySelectorAll('#estimateItemsBody tr.estimate-row');
        let totalGovt = 0;
        let totalProf = 0;
        let totalOther = 0;
        let totalTax = 0;
        let grandSubtotal = 0;
        let allDocs = [];

        rows.forEach(r => {
            const g = parseFloat(r.querySelector('.row-govt').value) || 0;
            const p = parseFloat(r.querySelector('.row-prof').value) || 0;
            const o = parseFloat(r.querySelector('.row-other').value) || 0;
            const gstRate = parseFloat(r.querySelector('.row-gst').value) || 0;
            const qty = parseInt(r.querySelector('.row-qty').value) || 1;

            const rowTaxable = (p + o) * qty;
            const rowGst = (rowTaxable * gstRate) / 100;
            const rowGovt = g * qty;
            const rowTotal = rowGovt + rowTaxable + rowGst;

            r.querySelector('.row-total').innerText = '₹' + rowTotal.toFixed(2);

            totalGovt += rowGovt;
            totalProf += (p * qty);
            totalOther += (o * qty);
            totalTax += rowGst;

            // Collect Docs
            const docsSnap = r.querySelector('.row-docs-snapshot').value;
            if (docsSnap) {
                try {
                    const parsed = JSON.parse(docsSnap);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(d => {
                            const name = d.document_name || d;
                            if (name && !allDocs.includes(name)) allDocs.push(name);
                        });
                    }
                } catch(e) {}
            }
        });

        grandSubtotal = totalGovt + totalProf + totalOther;

        // Discount Calculation
        const discType = document.getElementById('est_discount_type').value;
        const discRate = parseFloat(document.getElementById('est_discount_rate').value) || 0;
        let discAmount = 0;

        if (discType === 'percentage') {
            discAmount = (grandSubtotal * discRate) / 100;
        } else {
            discAmount = discRate;
        }
        discAmount = Math.min(discAmount, grandSubtotal);

        const grandTotal = Math.max(0, grandSubtotal - discAmount + totalTax);

        // Advance Required
        let advance = parseFloat(document.getElementById('est_advance_required').value) || 0;
        if (advance > grandTotal) advance = grandTotal;
        const balance = Math.max(0, grandTotal - advance);

        // Update hidden accumulators
        document.getElementById('calc_total_govt').value = totalGovt.toFixed(2);
        document.getElementById('calc_total_prof').value = totalProf.toFixed(2);
        document.getElementById('calc_total_other').value = totalOther.toFixed(2);
        document.getElementById('calc_subtotal').value = grandSubtotal.toFixed(2);
        document.getElementById('calc_discount_amount').value = discAmount.toFixed(2);
        document.getElementById('calc_tax_amount').value = totalTax.toFixed(2);
        document.getElementById('calc_grand_total').value = grandTotal.toFixed(2);

        // Update visual display
        document.getElementById('display_govt_fee').innerText = '₹' + totalGovt.toFixed(2);
        document.getElementById('display_prof_fee').innerText = '₹' + totalProf.toFixed(2);
        document.getElementById('display_other_charges').innerText = '₹' + totalOther.toFixed(2);
        document.getElementById('display_subtotal').innerText = '₹' + grandSubtotal.toFixed(2);
        document.getElementById('display_discount_amt').innerText = '- ₹' + discAmount.toFixed(2);
        document.getElementById('display_tax_amt').innerText = '₹' + totalTax.toFixed(2);
        document.getElementById('display_grand_total').innerText = '₹' + grandTotal.toFixed(2);
        document.getElementById('display_balance_due').innerText = '₹' + balance.toFixed(2);

        // Render Required Docs Checklist
        renderRequiredDocsChecklist(allDocs);
    }

    function setAdvancePercent(pct) {
        const grand = parseFloat(document.getElementById('calc_grand_total').value) || 0;
        const adv = (grand * pct) / 100;
        document.getElementById('est_advance_required').value = adv.toFixed(2);
        recalculateTotals();
    }

    function renderRequiredDocsChecklist(docsList) {
        const container = document.getElementById('estimateDocsContainer');
        const badge = document.getElementById('docsCountBadge');
        badge.innerText = docsList.length + ' Documents Required';

        if (docsList.length === 0) {
            container.innerHTML = '<div class="col-12 text-muted small py-2"><em>No services selected yet. Add services above to automatically load required documents.</em></div>';
            return;
        }

        let html = '';
        docsList.forEach((d, idx) => {
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="d-flex align-items-center gap-2 p-2 bg-light rounded-3 border">
                        <i class="bi bi-check-circle-fill text-success fs-6"></i>
                        <span class="small fw-semibold text-dark">${escapeHtml(d)}</span>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function escapeHtml(text) {
        return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    </script>

<?php } else {
    // =========================================================================
    // LIST VIEW
    // =========================================================================
    $filter_status = sanitize($_GET['status'] ?? '');
    $search = sanitize($_GET['q'] ?? '');

    $where_clauses = ["1=1"];
    $params = [];

    if (!empty($filter_status)) {
        $where_clauses[] = "e.status = ?";
        $params[] = $filter_status;
    }
    if (!empty($search)) {
        $where_clauses[] = "(e.estimate_number LIKE ? OR c.name LIKE ? OR c.mobile LIKE ? OR c.company_name LIKE ?)";
        $term = "%{$search}%";
        $params[] = $term; $params[] = $term; $params[] = $term; $params[] = $term;
    }

    $where_sql = implode(" AND ", $where_clauses);

    $estimates = [];
    try {
        $stmt = $pdo->prepare("
            SELECT e.*, 
                   c.name AS customer_name, c.company_name, c.mobile, c.email,
                   (SELECT COUNT(*) FROM estimate_items ei WHERE ei.estimate_id = e.id) AS items_count
            FROM estimates e
            JOIN customers c ON e.customer_id = c.id
            WHERE {$where_sql}
            ORDER BY e.id DESC
        ");
        $stmt->execute($params);
        $estimates = $stmt->fetchAll();
    } catch (Throwable $e) {}

    // Stats
    $stat_total = 0; $stat_draft = 0; $stat_sent = 0; $stat_accepted = 0; $stat_converted = 0;
    try {
        $stat_total = (int)$pdo->query("SELECT COUNT(*) FROM estimates")->fetchColumn();
        $stat_draft = (int)$pdo->query("SELECT COUNT(*) FROM estimates WHERE status = 'draft'")->fetchColumn();
        $stat_sent = (int)$pdo->query("SELECT COUNT(*) FROM estimates WHERE status = 'sent'")->fetchColumn();
        $stat_accepted = (int)$pdo->query("SELECT COUNT(*) FROM estimates WHERE status = 'accepted'")->fetchColumn();
        $stat_converted = (int)$pdo->query("SELECT COUNT(*) FROM estimates WHERE status = 'converted'")->fetchColumn();
    } catch (Throwable $e) {}
    ?>

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1 small">
                    <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/index.php">Dashboard</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Estimates</li>
                </ol>
            </nav>
            <h4 class="font-heading fw-bold mb-1">Estimates & Quotations Master</h4>
            <p class="text-muted small mb-0">Create multi-service estimates, share on WhatsApp, print branded PDFs & convert to Service Orders.</p>
        </div>
        <div class="d-flex gap-2">
            <a href="service_orders.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
                <i class="bi bi-box-seam me-1"></i> Service Orders
            </a>
            <a href="estimates.php?action=create" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                <i class="bi bi-plus-lg me-1"></i> Create Estimate
            </a>
        </div>
    </div>

    <?php if (!empty($msg)): ?>
        <div class="alert alert-<?php echo $msg_type; ?> alert-dismissible fade show rounded-3 shadow-sm" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> <?php echo htmlspecialchars($msg); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- STATUS KPI CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-6 col-lg-2">
            <a href="<?php echo BASE_URL; ?>admin/estimates.php" class="text-decoration-none">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-dark h-100">
                    <span class="text-muted small fw-bold text-uppercase">All Estimates</span>
                    <h3 class="fw-bold text-dark mb-0 mt-1"><?php echo $stat_total; ?></h3>
                </div>
            </a>
        </div>
        <div class="col-6 col-lg-2">
            <a href="<?php echo BASE_URL; ?>admin/estimates.php?status=draft" class="text-decoration-none">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-secondary h-100">
                    <span class="text-muted small fw-bold text-uppercase">Draft</span>
                    <h3 class="fw-bold text-secondary mb-0 mt-1"><?php echo $stat_draft; ?></h3>
                </div>
            </a>
        </div>
        <div class="col-6 col-lg-2">
            <a href="<?php echo BASE_URL; ?>admin/estimates.php?status=sent" class="text-decoration-none">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-info h-100">
                    <span class="text-muted small fw-bold text-uppercase">Sent to Client</span>
                    <h3 class="fw-bold text-info mb-0 mt-1"><?php echo $stat_sent; ?></h3>
                </div>
            </a>
        </div>
        <div class="col-6 col-lg-3">
            <a href="<?php echo BASE_URL; ?>admin/estimates.php?status=accepted" class="text-decoration-none">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success h-100">
                    <span class="text-muted small fw-bold text-uppercase">Accepted</span>
                    <h3 class="fw-bold text-success mb-0 mt-1"><?php echo $stat_accepted; ?></h3>
                </div>
            </a>
        </div>
        <div class="col-6 col-lg-3">
            <a href="<?php echo BASE_URL; ?>admin/estimates.php?status=converted" class="text-decoration-none">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary h-100">
                    <span class="text-muted small fw-bold text-uppercase">Converted to Orders</span>
                    <h3 class="fw-bold text-primary mb-0 mt-1"><?php echo $stat_converted; ?></h3>
                </div>
            </a>
        </div>
    </div>

    <!-- ESTIMATES LIST TABLE -->
    <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h6 class="fw-bold mb-0 text-dark">
                <i class="bi bi-file-earmark-text-fill me-2 text-primary"></i> All Estimates (<?php echo count($estimates); ?>)
            </h6>
            <form method="GET" action="" class="d-flex gap-2">
                <input type="text" name="q" class="form-control form-control-sm rounded-pill px-3" placeholder="Search estimates..." value="<?php echo htmlspecialchars($search); ?>">
                <select name="status" class="form-select form-select-sm rounded-pill" onchange="this.form.submit()">
                    <option value="">All Statuses</option>
                    <option value="draft" <?php echo $filter_status === 'draft' ? 'selected' : ''; ?>>Draft</option>
                    <option value="sent" <?php echo $filter_status === 'sent' ? 'selected' : ''; ?>>Sent</option>
                    <option value="accepted" <?php echo $filter_status === 'accepted' ? 'selected' : ''; ?>>Accepted</option>
                    <option value="converted" <?php echo $filter_status === 'converted' ? 'selected' : ''; ?>>Converted</option>
                    <option value="rejected" <?php echo $filter_status === 'rejected' ? 'selected' : ''; ?>>Rejected</option>
                    <option value="expired" <?php echo $filter_status === 'expired' ? 'selected' : ''; ?>>Expired</option>
                </select>
            </form>
        </div>
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light small text-uppercase">
                    <tr>
                        <th class="ps-4">Estimate #</th>
                        <th>Customer</th>
                        <th>Date & Validity</th>
                        <th>Services</th>
                        <th class="text-end">Govt Fee</th>
                        <th class="text-end">Prof Fee</th>
                        <th class="text-end">Grand Total</th>
                        <th>Status</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($estimates)): ?>
                        <tr><td colspan="9" class="text-center py-5 text-muted">No estimates found. Click "Create Estimate" to generate your first quotation.</td></tr>
                    <?php else: ?>
                        <?php foreach ($estimates as $est): ?>
                            <tr>
                                <td class="ps-4">
                                    <a href="<?php echo BASE_URL; ?>admin/estimate_pdf.php?id=<?php echo $est['id']; ?>" target="_blank" class="fw-bold text-primary text-decoration-none d-block">
                                        <?php echo htmlspecialchars($est['estimate_number']); ?>
                                    </a>
                                    <?php if ($est['converted_order_id']): ?>
                                        <span class="badge bg-light text-success border small"><i class="bi bi-box-seam me-1"></i>Order Created</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <strong class="d-block text-dark"><?php echo htmlspecialchars($est['customer_name']); ?></strong>
                                    <small class="text-muted"><i class="bi bi-telephone me-1"></i><?php echo htmlspecialchars($est['mobile']); ?></small>
                                </td>
                                <td>
                                    <div class="small">Date: <?php echo date('d M Y', strtotime($est['estimate_date'])); ?></div>
                                    <small class="text-muted">Valid: <?php echo date('d M Y', strtotime($est['valid_until'])); ?></small>
                                </td>
                                <td>
                                    <span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2">
                                        <?php echo $est['items_count']; ?> services
                                    </span>
                                </td>
                                <td class="text-end text-secondary fw-semibold">
                                    <?php echo format_inr($est['total_govt_fee']); ?>
                                </td>
                                <td class="text-end text-primary fw-semibold">
                                    <?php echo format_inr($est['total_prof_fee']); ?>
                                </td>
                                <td class="text-end fw-bold text-success fs-6">
                                    <?php echo format_inr($est['grand_total']); ?>
                                </td>
                                <td>
                                    <span class="badge <?php 
                                        echo $est['status'] === 'accepted' ? 'bg-success' : 
                                            ($est['status'] === 'converted' ? 'bg-primary' : 
                                            ($est['status'] === 'sent' ? 'bg-info' : 
                                            ($est['status'] === 'rejected' ? 'bg-danger' : 
                                            ($est['status'] === 'expired' ? 'bg-dark' : 'bg-secondary')))); 
                                    ?> rounded-pill px-2">
                                        <?php echo ucfirst($est['status']); ?>
                                    </span>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-light rounded-pill px-2" type="button" data-bs-toggle="dropdown">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3" style="min-width: 200px;">
                                            <li>
                                                <a href="<?php echo BASE_URL; ?>admin/estimate_pdf.php?id=<?php echo $est['id']; ?>" target="_blank" class="dropdown-item py-2">
                                                    <i class="bi bi-printer me-2 text-primary"></i> View & Print PDF
                                                </a>
                                            </li>
                                            <li>
                                                <a href="<?php echo BASE_URL; ?>admin/estimates.php?action=edit&id=<?php echo $est['id']; ?>" class="dropdown-item py-2">
                                                    <i class="bi bi-pencil me-2 text-info"></i> Edit Estimate
                                                </a>
                                            </li>
                                            <?php 
                                            $wa_msg = "Hello *" . urlencode($est['customer_name']) . "*,\n\nHere is your official service quotation *" . urlencode($est['estimate_number']) . "*.\n*Grand Total:* ₹" . number_format($est['grand_total'], 2) . "\n*Valid Until:* " . date('d M Y', strtotime($est['valid_until'])) . "\n\nView PDF:\n" . urlencode(BASE_URL . "admin/estimate_pdf.php?id=" . $est['id']);
                                            $wa_phone = preg_replace('/[^0-9]/', '', $est['mobile']);
                                            if (strlen($wa_phone) === 10) $wa_phone = '91' . $wa_phone;
                                            ?>
                                            <li>
                                                <a href="https://api.whatsapp.com/send?phone=<?php echo $wa_phone; ?>&text=<?php echo $wa_msg; ?>" target="_blank" class="dropdown-item py-2 text-success">
                                                    <i class="bi bi-whatsapp me-2"></i> Share on WhatsApp
                                                </a>
                                            </li>
                                            <li>
                                                <button type="button" class="dropdown-item py-2" onclick="openEmailModal(<?php echo $est['id']; ?>, '<?php echo htmlspecialchars(addslashes($est['email'])); ?>', '<?php echo htmlspecialchars(addslashes($est['estimate_number'])); ?>')">
                                                    <i class="bi bi-envelope me-2 text-secondary"></i> Send via Email
                                                </button>
                                            </li>
                                            <li><hr class="dropdown-divider my-1"></li>
                                            <?php if ($est['status'] !== 'converted'): ?>
                                                <li>
                                                    <form action="" method="POST" onsubmit="return confirm('Convert estimate <?php echo htmlspecialchars(addslashes($est['estimate_number'])); ?> into an active Service Order? All quoted prices and documents will be permanently frozen.');">
                                                        <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                        <input type="hidden" name="action" value="convert_to_order">
                                                        <input type="hidden" name="estimate_id" value="<?php echo $est['id']; ?>">
                                                        <button type="submit" class="dropdown-item py-2 text-primary fw-bold">
                                                            <i class="bi bi-box-arrow-up-right me-2"></i> Convert to Service Order
                                                        </button>
                                                    </form>
                                                </li>
                                            <?php endif; ?>
                                            <li>
                                                <form action="" method="POST">
                                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                    <input type="hidden" name="action" value="duplicate_estimate">
                                                    <input type="hidden" name="estimate_id" value="<?php echo $est['id']; ?>">
                                                    <button type="submit" class="dropdown-item py-2">
                                                        <i class="bi bi-copy me-2 text-muted"></i> Duplicate Estimate
                                                    </button>
                                                </form>
                                            </li>
                                            <li>
                                                <div class="dropdown-header small text-uppercase">Status Transitions</div>
                                                <div class="d-flex gap-1 px-3 py-1">
                                                    <form action="" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                        <input type="hidden" name="action" value="update_status">
                                                        <input type="hidden" name="estimate_id" value="<?php echo $est['id']; ?>">
                                                        <input type="hidden" name="status" value="accepted">
                                                        <button type="submit" class="btn btn-xs btn-outline-success rounded-pill px-2 py-0">Accept</button>
                                                    </form>
                                                    <form action="" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                        <input type="hidden" name="action" value="update_status">
                                                        <input type="hidden" name="estimate_id" value="<?php echo $est['id']; ?>">
                                                        <input type="hidden" name="status" value="rejected">
                                                        <button type="submit" class="btn btn-xs btn-outline-danger rounded-pill px-2 py-0">Reject</button>
                                                    </form>
                                                    <form action="" method="POST" class="d-inline">
                                                        <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                        <input type="hidden" name="action" value="update_status">
                                                        <input type="hidden" name="estimate_id" value="<?php echo $est['id']; ?>">
                                                        <input type="hidden" name="status" value="expired">
                                                        <button type="submit" class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0">Expire</button>
                                                    </form>
                                                </div>
                                            </li>
                                            <li><hr class="dropdown-divider my-1"></li>
                                            <li>
                                                <form action="" method="POST" onsubmit="return confirm('Permanently delete estimate <?php echo htmlspecialchars(addslashes($est['estimate_number'])); ?>?');">
                                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                                    <input type="hidden" name="action" value="delete_estimate">
                                                    <input type="hidden" name="estimate_id" value="<?php echo $est['id']; ?>">
                                                    <button type="submit" class="dropdown-item py-2 text-danger">
                                                        <i class="bi bi-trash me-2"></i> Delete
                                                    </button>
                                                </form>
                                            </li>
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

    <!-- SEND EMAIL MODAL -->
    <div class="modal fade" id="emailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-bottom py-3 px-4 bg-light">
                    <h5 class="modal-title font-heading fw-bold">Send Estimate via Email</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form action="" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    <input type="hidden" name="action" value="send_email">
                    <input type="hidden" name="estimate_id" id="email_est_id" value="">

                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Recipient Email *</label>
                            <input type="email" name="recipient_email" id="email_recipient" class="form-control rounded-3" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Subject *</label>
                            <input type="text" name="email_subject" id="email_subject" class="form-control rounded-3" value="Quotation from Digital Udyog Seva" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Email Message</label>
                            <textarea name="email_body" id="email_body" class="form-control rounded-3" rows="5">Dear Customer,

Thank you for contacting Digital Udyog Seva. Please find attached your requested service quotation.

You may view and download your estimate online anytime at:
[Estimate Link]

Best regards,
Digital Udyog Seva Support Team</textarea>
                        </div>
                    </div>
                    <div class="modal-footer border-top py-3 px-4 bg-light">
                        <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Send Email</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
    function openEmailModal(estId, email, estNum) {
        document.getElementById('email_est_id').value = estId;
        document.getElementById('email_recipient').value = email || '';
        document.getElementById('email_subject').value = 'Official Quotation: ' + estNum + ' from Digital Udyog Seva';
        const modal = new bootstrap.Modal(document.getElementById('emailModal'));
        modal.show();
    }
    </script>
<?php } ?>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
