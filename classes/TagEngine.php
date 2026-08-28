<?php
// Centralized Tagging Engine
require_once __DIR__ . '/../config/app.php';

class TagEngine {
    public static function get_all() {
        global $pdo;
        if (!$pdo) return [];
        try {
            return $pdo->query("SELECT * FROM tags ORDER BY name ASC")->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }

    public static function get_for_entity($rel_type, $rel_id) {
        global $pdo;
        if (!$pdo || empty($rel_id)) return [];
        try {
            $stmt = $pdo->prepare("
                SELECT t.* FROM tags t
                JOIN tag_relationships tr ON t.id = tr.tag_id
                WHERE tr.rel_type = ? AND tr.rel_id = ?
                ORDER BY t.name ASC
            ");
            $stmt->execute([sanitize($rel_type), (int)$rel_id]);
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }

    public static function sync_tags($rel_type, $rel_id, $tag_ids = []) {
        global $pdo;
        if (!$pdo || empty($rel_id)) return false;

        try {
            $stmt = $pdo->prepare("DELETE FROM tag_relationships WHERE rel_type = ? AND rel_id = ?");
            $stmt->execute([sanitize($rel_type), (int)$rel_id]);

            if (!empty($tag_ids)) {
                $ins = $pdo->prepare("INSERT IGNORE INTO tag_relationships (tag_id, rel_type, rel_id, created_at) VALUES (?, ?, ?, NOW())");
                foreach ($tag_ids as $tid) {
                    $ins->execute([(int)$tid, sanitize($rel_type), (int)$rel_id]);
                }
            }
            return true;
        } catch (Exception $e) {
            error_log("TagEngine sync_tags Error: " . $e->getMessage());
            return false;
        }
    }

    public static function create_tag($name, $color = '#3b82f6') {
        global $pdo;
        if (!$pdo || empty($name)) return false;

        try {
            $stmt = $pdo->prepare("INSERT IGNORE INTO tags (name, color, created_at) VALUES (?, ?, NOW())");
            $stmt->execute([sanitize($name), sanitize($color)]);
            return $pdo->lastInsertId() ?: true;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function render_badges($tags = []) {
        if (empty($tags)) return '<span class="text-muted small">No Tags</span>';
        $html = '';
        foreach ($tags as $t) {
            $color = htmlspecialchars($t['color'] ?: '#3b82f6');
            $name = htmlspecialchars($t['name']);
            $html .= "<span class='badge me-1' style='background-color: {$color}; color: #ffffff;'>{$name}</span>";
        }
        return $html;
    }
}
