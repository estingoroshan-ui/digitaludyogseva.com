<?php
// Extensible Custom Fields Engine
require_once __DIR__ . '/../config/app.php';

class CustomFieldsEngine {
    public static function get_fields_for($belongs_to) {
        global $pdo;
        if (!$pdo) return [];
        try {
            $stmt = $pdo->prepare("
                SELECT * FROM custom_fields 
                WHERE belongs_to = ? AND is_active = 1 
                ORDER BY display_order ASC, id ASC
            ");
            $stmt->execute([sanitize($belongs_to)]);
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }

    public static function get_values_for($belongs_to, $rel_id) {
        global $pdo;
        if (!$pdo || empty($rel_id)) return [];
        try {
            $stmt = $pdo->prepare("
                SELECT cf.id AS field_id, cf.name, cf.field_type, cf.belongs_to, cfv.value
                FROM custom_fields cf
                LEFT JOIN custom_field_values cfv ON cf.id = cfv.custom_field_id AND cfv.rel_id = ?
                WHERE cf.belongs_to = ? AND cf.is_active = 1
                ORDER BY cf.display_order ASC
            ");
            $stmt->execute([(int)$rel_id, sanitize($belongs_to)]);
            $rows = $stmt->fetchAll();
            $result = [];
            foreach ($rows as $r) {
                $result[$r['field_id']] = [
                    'name' => $r['name'],
                    'field_type' => $r['field_type'],
                    'value' => $r['value']
                ];
            }
            return $result;
        } catch (Exception $e) {
            return [];
        }
    }

    public static function save_values($belongs_to, $rel_id, $custom_values = []) {
        global $pdo;
        if (!$pdo || empty($rel_id) || empty($custom_values)) return false;

        try {
            $fields = self::get_fields_for($belongs_to);
            $stmt = $pdo->prepare("
                INSERT INTO custom_field_values (custom_field_id, rel_id, value, created_at)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()
            ");

            foreach ($fields as $f) {
                $field_id = $f['id'];
                if (isset($custom_values[$field_id])) {
                    $val = is_array($custom_values[$field_id]) ? json_encode($custom_values[$field_id]) : trim($custom_values[$field_id]);
                    $stmt->execute([$field_id, (int)$rel_id, $val]);
                }
            }
            return true;
        } catch (Exception $e) {
            error_log("CustomFieldsEngine save_values error: " . $e->getMessage());
            return false;
        }
    }

    public static function render_form_fields($belongs_to, $rel_id = 0) {
        $fields = self::get_fields_for($belongs_to);
        if (empty($fields)) return '';

        $existing_values = $rel_id ? self::get_values_for($belongs_to, $rel_id) : [];
        $html = '<div class="row g-3 my-2 border-top pt-3"><div class="col-12"><h6 class="fw-bold text-dark mb-2"><i class="bi bi-ui-checks me-1"></i> Custom Additional Fields</h6></div>';

        foreach ($fields as $f) {
            $val = $existing_values[$f['id']]['value'] ?? '';
            $req = $f['is_required'] ? 'required' : '';
            $req_mark = $f['is_required'] ? ' <span class="text-danger">*</span>' : '';
            $field_name = "custom_fields[{$f['id']}]";

            $html .= '<div class="col-md-6 mb-2">';
            $html .= '<label class="form-label small fw-bold">' . htmlspecialchars($f['name']) . $req_mark . '</label>';

            switch ($f['field_type']) {
                case 'textarea':
                    $html .= '<textarea name="' . $field_name . '" class="form-control form-control-sm" rows="3" ' . $req . '>' . htmlspecialchars($val) . '</textarea>';
                    break;
                case 'select':
                    $opts = array_map('trim', explode(',', $f['options']));
                    $html .= '<select name="' . $field_name . '" class="form-select form-select-sm" ' . $req . '>';
                    $html .= '<option value="">-- Select Option --</option>';
                    foreach ($opts as $opt) {
                        $sel = ($val === $opt) ? 'selected' : '';
                        $html .= '<option value="' . htmlspecialchars($opt) . '" ' . $sel . '>' . htmlspecialchars($opt) . '</option>';
                    }
                    $html .= '</select>';
                    break;
                case 'date':
                    $html .= '<input type="date" name="' . $field_name . '" class="form-control form-control-sm" value="' . htmlspecialchars($val) . '" ' . $req . '>';
                    break;
                case 'datetime':
                    $html .= '<input type="datetime-local" name="' . $field_name . '" class="form-control form-control-sm" value="' . htmlspecialchars($val) . '" ' . $req . '>';
                    break;
                case 'number':
                    $html .= '<input type="number" step="any" name="' . $field_name . '" class="form-control form-control-sm" value="' . htmlspecialchars($val) . '" ' . $req . '>';
                    break;
                default:
                    $html .= '<input type="text" name="' . $field_name . '" class="form-control form-control-sm" value="' . htmlspecialchars($val) . '" ' . $req . '>';
                    break;
            }
            $html .= '</div>';
        }
        $html .= '</div>';
        return $html;
    }
}
