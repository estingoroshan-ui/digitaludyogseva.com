<?php
// Document Vault & Verification System
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/helpers.php';

class DocumentVault {

    // Upload Document to Vault
    public static function upload_document($customer_id, $file, $doc_type_id = null, $case_id = null, $loan_application_id = null, $uploaded_by_user_id = null) {
        global $pdo;

        $target_dir = UPLOAD_DIR . 'kyc/' . date('Y/m') . '/';
        $res = upload_file($file, $target_dir, ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']);

        if (!$res['status']) {
            return $res;
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO documents (
                    customer_id, case_id, loan_application_id, document_type_id,
                    file_path, file_name, file_size, uploaded_by, verification_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Uploaded')
            ");
            $stmt->execute([
                $customer_id, $case_id, $loan_application_id, $doc_type_id,
                $res['file_path'], $res['file_name'], $res['file_size'], $uploaded_by_user_id
            ]);

            $doc_id = $pdo->lastInsertId();

            return [
                'status' => true,
                'document_id' => $doc_id,
                'file_name' => $res['file_name'],
                'message' => 'Document uploaded to vault successfully.'
            ];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'DB Document save error: ' . $e->getMessage()];
        }
    }

    // Verify / Update Document Status
    public static function update_status($doc_id, $status, $verified_by_user_id, $remarks = '') {
        global $pdo;

        try {
            $stmt = $pdo->prepare("
                UPDATE documents 
                SET verification_status = ?, verified_by = ?, verification_remarks = ?
                WHERE id = ?
            ");
            $stmt->execute([$status, $verified_by_user_id, $remarks, $doc_id]);
            return ['status' => true, 'message' => 'Document verification status updated to ' . $status];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Verification update error: ' . $e->getMessage()];
        }
    }
}
