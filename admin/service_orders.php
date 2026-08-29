<?php
$page_title = "Service Orders";
$active_menu = "payments"; // Sales group
require_once __DIR__ . '/includes/admin_header.php';

global $pdo;
$msg = '';
$msg_type = 'success';

// Handle Status Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $msg = "CSRF verification failed.";
        $msg_type = "danger";
    } else {
        $action = $_POST['action'];

        if ($action === 'update_order_status') {
            $order_id = (int)($_POST['order_id'] ?? 0);
            $status = in_array($_POST['status'] ?? '', ['pending', 'in_progress', 'under_review', 'completed', 'cancelled']) ? $_POST['status'] : 'pending';
            $pay_status = in_array($_POST['payment_status'] ?? '', ['unpaid', 'partially_paid', 'paid']) ? $_POST['payment_status'] : 'unpaid';
            $notes = sanitize($_POST['notes'] ?? '');

            if ($order_id > 0) {
                $stmt = $pdo->prepare("UPDATE service_orders SET status = ?, payment_status = ?, notes = ? WHERE id = ?");
                $stmt->execute([$status, $pay_status, $notes, $order_id]);
                $msg = "Service order status updated successfully.";
            }
        }
    }
}

// Filters & Query
$filter_status = sanitize($_GET['status'] ?? '');
$filter_payment = sanitize($_GET['payment'] ?? '');
$search = sanitize($_GET['q'] ?? '');

$where_clauses = ["1=1"];
$params = [];

if (!empty($filter_status)) {
    $where_clauses[] = "o.status = ?";
    $params[] = $filter_status;
}
if (!empty($filter_payment)) {
    $where_clauses[] = "o.payment_status = ?";
    $params[] = $filter_payment;
}
if (!empty($search)) {
    $where_clauses[] = "(o.order_number LIKE ? OR c.name LIKE ? OR c.mobile LIKE ? OR e.estimate_number LIKE ?)";
    $term = "%{$search}%";
    $params[] = $term; $params[] = $term; $params[] = $term; $params[] = $term;
}

$where_sql = implode(" AND ", $where_clauses);

// Fetch Orders
$stmt = $pdo->prepare("
    SELECT o.*, 
           c.name AS customer_name, c.mobile, c.email, c.company_name, c.customer_code,
           e.estimate_number,
           (SELECT COUNT(*) FROM service_order_items oi WHERE oi.order_id = o.id) AS items_count
    FROM service_orders o
    JOIN customers c ON o.customer_id = c.id
    LEFT JOIN estimates e ON o.estimate_id = e.id
    WHERE {$where_sql}
    ORDER BY o.id DESC
");
$stmt->execute($params);
$orders = $stmt->fetchAll();

// KPI counts
$count_all = (int)$pdo->query("SELECT COUNT(*) FROM service_orders")->fetchColumn();
$count_pending = (int)$pdo->query("SELECT COUNT(*) FROM service_orders WHERE status = 'pending'")->fetchColumn();
$count_progress = (int)$pdo->query("SELECT COUNT(*) FROM service_orders WHERE status = 'in_progress'")->fetchColumn();
$count_completed = (int)$pdo->query("SELECT COUNT(*) FROM service_orders WHERE status = 'completed'")->fetchColumn();
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1 small">
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/index.php">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="<?php echo BASE_URL; ?>admin/estimates.php">Sales</a></li>
                <li class="breadcrumb-item active" aria-current="page">Service Orders</li>
            </ol>
        </nav>
        <h4 class="font-heading fw-bold mb-1">Customer Service Orders</h4>
        <p class="text-muted small mb-0">Track accepted estimates converted into active service delivery orders.</p>
    </div>
    <div class="d-flex gap-2">
        <a href="<?php echo BASE_URL; ?>admin/estimates.php" class="btn btn-outline-secondary rounded-pill px-3 fw-bold">
            <i class="bi bi-file-earmark-text me-1"></i> View Estimates
        </a>
    </div>
</div>

<?php if (!empty($msg)): ?>
    <div class="alert alert-<?php echo $msg_type; ?> alert-dismissible fade show rounded-3 shadow-sm" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i> <?php echo htmlspecialchars($msg); ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
<?php endif; ?>

<!-- KPI METRICS -->
<div class="row g-3 mb-4">
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary">
            <span class="text-muted small fw-bold text-uppercase">Total Orders</span>
            <h3 class="fw-bold text-dark mb-0 mt-1"><?php echo $count_all; ?></h3>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning">
            <span class="text-muted small fw-bold text-uppercase">Pending Processing</span>
            <h3 class="fw-bold text-warning mb-0 mt-1"><?php echo $count_pending; ?></h3>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-info">
            <span class="text-muted small fw-bold text-uppercase">In Progress</span>
            <h3 class="fw-bold text-info mb-0 mt-1"><?php echo $count_progress; ?></h3>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
            <span class="text-muted small fw-bold text-uppercase">Completed Orders</span>
            <h3 class="fw-bold text-success mb-0 mt-1"><?php echo $count_completed; ?></h3>
        </div>
    </div>
</div>

<!-- ORDERS LIST -->
<div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
    <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 class="fw-bold mb-0 text-dark">
            <i class="bi bi-box-seam-fill me-2 text-primary"></i> All Service Orders (<?php echo count($orders); ?>)
        </h6>
        <form method="GET" action="" class="d-flex gap-2">
            <input type="text" name="q" class="form-control form-control-sm rounded-pill px-3" placeholder="Search orders..." value="<?php echo htmlspecialchars($search); ?>">
            <select name="status" class="form-select form-select-sm rounded-pill" onchange="this.form.submit()">
                <option value="">All Statuses</option>
                <option value="pending" <?php echo $filter_status === 'pending' ? 'selected' : ''; ?>>Pending</option>
                <option value="in_progress" <?php echo $filter_status === 'in_progress' ? 'selected' : ''; ?>>In Progress</option>
                <option value="completed" <?php echo $filter_status === 'completed' ? 'selected' : ''; ?>>Completed</option>
                <option value="cancelled" <?php echo $filter_status === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
            </select>
        </form>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th class="ps-4">Order #</th>
                    <th>Customer Details</th>
                    <th>Source Estimate</th>
                    <th>Items</th>
                    <th class="text-end">Govt Fee</th>
                    <th class="text-end">Grand Total</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th class="text-end pe-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($orders)): ?>
                    <tr><td colspan="9" class="text-center py-5 text-muted">No converted service orders found.</td></tr>
                <?php else: ?>
                    <?php foreach ($orders as $ord): ?>
                        <tr>
                            <td class="ps-4">
                                <strong class="text-primary d-block"><?php echo htmlspecialchars($ord['order_number']); ?></strong>
                                <small class="text-muted"><?php echo date('d M Y', strtotime($ord['order_date'])); ?></small>
                            </td>
                            <td>
                                <strong class="d-block text-dark"><?php echo htmlspecialchars($ord['customer_name']); ?></strong>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i><?php echo htmlspecialchars($ord['mobile']); ?></small>
                            </td>
                            <td>
                                <?php if (!empty($ord['estimate_number'])): ?>
                                    <a href="<?php echo BASE_URL; ?>admin/estimate_pdf.php?id=<?php echo $ord['estimate_id']; ?>" target="_blank" class="badge bg-light text-secondary border text-decoration-none">
                                        <i class="bi bi-file-earmark-text me-1"></i><?php echo htmlspecialchars($ord['estimate_number']); ?>
                                    </a>
                                <?php else: ?>
                                    <span class="text-muted small">Direct Order</span>
                                <?php endif; ?>
                            </td>
                            <td><span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2"><?php echo $ord['items_count']; ?> services</span></td>
                            <td class="text-end text-secondary"><?php echo format_inr($ord['total_govt_fee']); ?></td>
                            <td class="text-end fw-bold text-success fs-6"><?php echo format_inr($ord['grand_total']); ?></td>
                            <td>
                                <span class="badge <?php 
                                    echo $ord['payment_status'] === 'paid' ? 'bg-success' : 
                                        ($ord['payment_status'] === 'partially_paid' ? 'bg-warning text-dark' : 'bg-danger'); 
                                ?> rounded-pill px-2">
                                    <?php echo ucfirst(str_replace('_', ' ', $ord['payment_status'])); ?>
                                </span>
                            </td>
                            <td>
                                <span class="badge <?php 
                                    echo $ord['status'] === 'completed' ? 'bg-success' : 
                                        ($ord['status'] === 'in_progress' ? 'bg-info' : 
                                        ($ord['status'] === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark')); 
                                ?> rounded-pill px-2">
                                    <?php echo ucfirst(str_replace('_', ' ', $ord['status'])); ?>
                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1" onclick="viewOrderDetails(<?php echo $ord['id']; ?>)">
                                    <i class="bi bi-eye"></i> View
                                </button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- ORDER DETAIL MODAL -->
<div class="modal fade" id="orderDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom py-3 px-4 bg-light">
                <h5 class="modal-title font-heading fw-bold" id="orderModalTitle">Service Order Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" id="orderModalBody">
                <div class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span> Loading order data...</div>
            </div>
        </div>
    </div>
</div>

<script>
function viewOrderDetails(orderId) {
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    modal.show();

    fetch('<?php echo BASE_URL; ?>admin/service_orders.php?ajax=get_order&id=' + orderId)
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                const o = data.order;
                const items = data.items;
                let itemsHtml = '';

                items.forEach((item, idx) => {
                    let docsHtml = '';
                    if (item.required_docs_snapshot) {
                        try {
                            const docs = JSON.parse(item.required_docs_snapshot);
                            if (Array.isArray(docs)) {
                                docsHtml = '<div class="mt-2"><small class="fw-bold text-muted">Required Documents:</small><div class="d-flex flex-wrap gap-1 mt-1">' +
                                    docs.map(d => `<span class="badge bg-white text-dark border"><i class="bi bi-file-earmark-check text-success me-1"></i>${escapeHtml(d.document_name || d)}</span>`).join('') +
                                    '</div></div>';
                            }
                        } catch(e) {}
                    }

                    itemsHtml += `
                        <div class="card bg-light border p-3 rounded-3 mb-2">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong class="d-block text-dark">${idx+1}. ${escapeHtml(item.service_name)}</strong>
                                    <small class="text-muted">${escapeHtml(item.description || '')}</small>
                                    ${item.expected_time ? `<span class="badge bg-white text-secondary border px-2 py-0 ms-1"><i class="bi bi-clock me-1"></i>TAT: ${escapeHtml(item.expected_time)}</span>` : ''}
                                </div>
                                <div class="text-end">
                                    <strong class="text-success fs-6">₹${parseFloat(item.total_price).toFixed(2)}</strong>
                                    <small class="d-block text-muted">Govt: ₹${parseFloat(item.govt_fee).toFixed(2)} | Prof: ₹${parseFloat(item.prof_fee).toFixed(2)}</small>
                                </div>
                            </div>
                            ${docsHtml}
                        </div>
                    `;
                });

                document.getElementById('orderModalTitle').innerText = 'Service Order: ' + o.order_number;
                document.getElementById('orderModalBody').innerHTML = `
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <div class="card p-3 bg-light border-0 rounded-3">
                                <small class="text-muted fw-bold text-uppercase">Customer</small>
                                <h6 class="fw-bold mb-1 text-dark">${escapeHtml(o.customer_name)}</h6>
                                <small class="text-muted"><i class="bi bi-telephone me-1"></i>${escapeHtml(o.mobile)} | <i class="bi bi-envelope me-1"></i>${escapeHtml(o.email)}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card p-3 bg-light border-0 rounded-3">
                                <small class="text-muted fw-bold text-uppercase">Financial Snapshot</small>
                                <div class="d-flex justify-content-between small">
                                    <span>Grand Total:</span><strong class="text-success fs-6">₹${parseFloat(o.grand_total).toFixed(2)}</strong>
                                </div>
                                <div class="d-flex justify-content-between small">
                                    <span>Advance Paid:</span><strong>₹${parseFloat(o.advance_paid).toFixed(2)}</strong>
                                </div>
                                <div class="d-flex justify-content-between small">
                                    <span>Balance Due:</span><strong class="text-danger">₹${parseFloat(o.balance_due).toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h6 class="fw-bold mb-2 text-dark">Ordered Services (${items.length}):</h6>
                    ${itemsHtml}

                    <div class="card p-3 border rounded-3 mt-3 bg-white">
                        <h6 class="fw-bold mb-3 text-dark">Update Order Progress & Status</h6>
                        <form action="" method="POST">
                            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                            <input type="hidden" name="action" value="update_order_status">
                            <input type="hidden" name="order_id" value="${o.id}">
                            <div class="row g-2">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Order Status</label>
                                    <select name="status" class="form-select form-select-sm">
                                        <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="in_progress" ${o.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="under_review" ${o.status === 'under_review' ? 'selected' : ''}>Under Review</option>
                                        <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Completed</option>
                                        <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Payment Status</label>
                                    <select name="payment_status" class="form-select form-select-sm">
                                        <option value="unpaid" ${o.payment_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                                        <option value="partially_paid" ${o.payment_status === 'partially_paid' ? 'selected' : ''}>Partially Paid</option>
                                        <option value="paid" ${o.payment_status === 'paid' ? 'selected' : ''}>Paid</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Internal Processing Notes</label>
                                    <textarea name="notes" class="form-control form-control-sm" rows="2" placeholder="Notes on department approval, application numbers, etc.">${escapeHtml(o.notes || '')}</textarea>
                                </div>
                                <div class="col-12 text-end mt-2">
                                    <button type="submit" class="btn btn-primary btn-sm rounded-pill px-4 fw-bold">Save Status</button>
                                </div>
                            </div>
                        </form>
                    </div>
                `;
            }
        });
}

function escapeHtml(text) {
    return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
</script>

<?php
// Handle AJAX get_order
if (isset($_GET['ajax']) && $_GET['ajax'] === 'get_order') {
    ob_clean();
    header('Content-Type: application/json');
    $ord_id = (int)($_GET['id'] ?? 0);
    $stmt = $pdo->prepare("
        SELECT o.*, c.name AS customer_name, c.mobile, c.email, c.company_name
        FROM service_orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
    ");
    $stmt->execute([$ord_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($order) {
        $items_stmt = $pdo->prepare("SELECT * FROM service_order_items WHERE order_id = ? ORDER BY sort_order ASC");
        $items_stmt->execute([$ord_id]);
        $items = $items_stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => true, 'order' => $order, 'items' => $items]);
    } else {
        echo json_encode(['status' => false, 'message' => 'Order not found']);
    }
    exit;
}
?>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
