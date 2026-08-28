<?php
$page_title = "In-App Notifications Center";
$active_menu = "dashboard";
require_once __DIR__ . '/includes/admin_header.php';
require_once __DIR__ . '/../classes/NotificationService.php';

global $pdo;
$user_id = (int)$_SESSION['user']['id'];

if (isset($_GET['action']) && $_GET['action'] === 'mark_all') {
    NotificationService::mark_all_read($user_id);
    header('Location: ' . BASE_URL . 'admin/notifications.php');
    exit;
}

$notifications = NotificationService::get_latest($user_id, 50);
?>

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div>
        <h4 class="font-heading fw-bold mb-1"><i class="bi bi-bell-fill text-warning me-2"></i> In-App Notifications Center</h4>
        <p class="text-muted small mb-0">View all system alerts, reminders, assignment updates, and notifications.</p>
    </div>
    <div>
        <a href="?action=mark_all" class="btn btn-outline-primary rounded-pill px-4 fw-bold shadow-sm">
            <i class="bi bi-check2-all me-1"></i> Mark All as Read
        </a>
    </div>
</div>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
    <?php if (empty($notifications)): ?>
        <div class="text-center py-5">
            <i class="bi bi-bell-slash fs-1 text-muted d-block mb-3"></i>
            <h5 class="fw-bold text-dark">No notifications</h5>
            <p class="text-muted small">You are all caught up! No unread system notifications.</p>
        </div>
    <?php else: ?>
        <div class="list-group list-group-flush">
            <?php foreach ($notifications as $n): ?>
                <div class="list-group-item p-3 rounded-3 mb-2 border <?php echo !$n['is_read'] ? 'bg-primary-subtle border-primary' : 'bg-white'; ?>">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="fw-bold text-dark mb-1">
                                <?php if (!$n['is_read']): ?><span class="badge bg-danger me-1">NEW</span><?php endif; ?>
                                <?php echo htmlspecialchars($n['title']); ?>
                            </h6>
                            <p class="text-secondary small mb-2"><?php echo htmlspecialchars($n['message']); ?></p>
                            <small class="text-muted fs-7"><i class="bi bi-clock me-1"></i><?php echo date('d M Y, h:i A', strtotime($n['created_at'])); ?></small>
                        </div>
                        <?php if ($n['link']): ?>
                            <a href="<?php echo htmlspecialchars($n['link']); ?>" class="btn btn-sm btn-primary rounded-pill px-3 fw-bold">
                                View Action <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
