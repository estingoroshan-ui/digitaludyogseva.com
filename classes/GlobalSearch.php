<?php
// Extensible Unified Global CRM Search Engine
require_once __DIR__ . '/../config/app.php';

class GlobalSearch {
    public static function search($query, $limit = 10) {
        global $pdo;
        if (!$pdo || strlen(trim($query)) < 2) return [];

        $q = '%' . trim($query) . '%';
        $results = [];

        // 1. Search Customers
        try {
            $stmt = $pdo->prepare("
                SELECT id, customer_code AS code, name, mobile, email, 'customer' AS type
                FROM customers 
                WHERE customer_code LIKE ? OR name LIKE ? OR mobile LIKE ? OR email LIKE ?
                LIMIT ?
            ");
            $stmt->bindValue(1, $q);
            $stmt->bindValue(2, $q);
            $stmt->bindValue(3, $q);
            $stmt->bindValue(4, $q);
            $stmt->bindValue(5, $limit, PDO::PARAM_INT);
            $stmt->execute();
            foreach ($stmt->fetchAll() as $row) {
                $results[] = [
                    'category' => 'Customers',
                    'title'    => $row['name'] . ' (' . $row['code'] . ')',
                    'subtitle' => 'Mobile: ' . $row['mobile'] . ' | Email: ' . $row['email'],
                    'url'      => BASE_URL . 'admin/customers.php?id=' . $row['id'],
                    'icon'     => 'bi-person-badge'
                ];
            }
        } catch (Exception $e) {}

        // 2. Search CRM Leads
        try {
            $stmt = $pdo->prepare("
                SELECT id, lead_code AS code, name, mobile, email, 'lead' AS type
                FROM leads 
                WHERE lead_code LIKE ? OR name LIKE ? OR mobile LIKE ? OR email LIKE ?
                LIMIT ?
            ");
            $stmt->bindValue(1, $q);
            $stmt->bindValue(2, $q);
            $stmt->bindValue(3, $q);
            $stmt->bindValue(4, $q);
            $stmt->bindValue(5, $limit, PDO::PARAM_INT);
            $stmt->execute();
            foreach ($stmt->fetchAll() as $row) {
                $results[] = [
                    'category' => 'Leads',
                    'title'    => $row['name'] . ' (' . $row['code'] . ')',
                    'subtitle' => 'Mobile: ' . $row['mobile'] . ' | Lead Code: ' . $row['code'],
                    'url'      => BASE_URL . 'admin/crm_lead_detail.php?id=' . $row['id'],
                    'icon'     => 'bi-funnel'
                ];
            }
        } catch (Exception $e) {}

        // 3. Search Service Projects / Cases
        try {
            $stmt = $pdo->prepare("
                SELECT c.id, c.case_code AS code, cust.name AS customer_name, c.current_stage
                FROM cases c
                JOIN customers cust ON c.customer_id = cust.id
                WHERE c.case_code LIKE ? OR cust.name LIKE ? OR c.current_stage LIKE ?
                LIMIT ?
            ");
            $stmt->bindValue(1, $q);
            $stmt->bindValue(2, $q);
            $stmt->bindValue(3, $q);
            $stmt->bindValue(4, $limit, PDO::PARAM_INT);
            $stmt->execute();
            foreach ($stmt->fetchAll() as $row) {
                $results[] = [
                    'category' => 'Service Projects',
                    'title'    => 'Project ' . $row['code'] . ' - ' . $row['customer_name'],
                    'subtitle' => 'Stage: ' . ($row['current_stage'] ?: 'Application Received'),
                    'url'      => BASE_URL . 'admin/projects.php?id=' . $row['id'],
                    'icon'     => 'bi-briefcase'
                ];
            }
        } catch (Exception $e) {}

        // 4. Search Government Loan Applications
        try {
            $stmt = $pdo->prepare("
                SELECT la.id, la.application_code AS code, cust.name AS customer_name, la.status_stage
                FROM loan_applications la
                JOIN customers cust ON la.customer_id = cust.id
                WHERE la.application_code LIKE ? OR cust.name LIKE ? OR la.status_stage LIKE ?
                LIMIT ?
            ");
            $stmt->bindValue(1, $q);
            $stmt->bindValue(2, $q);
            $stmt->bindValue(3, $q);
            $stmt->bindValue(4, $limit, PDO::PARAM_INT);
            $stmt->execute();
            foreach ($stmt->fetchAll() as $row) {
                $results[] = [
                    'category' => 'Loan Applications',
                    'title'    => 'Loan ' . $row['code'] . ' - ' . $row['customer_name'],
                    'subtitle' => 'Stage: ' . $row['status_stage'],
                    'url'      => BASE_URL . 'admin/loan_applications.php?id=' . $row['id'],
                    'icon'     => 'bi-bank'
                ];
            }
        } catch (Exception $e) {}

        // 5. Search Staff Members
        try {
            $stmt = $pdo->prepare("
                SELECT u.id, u.name, u.email, u.mobile, r.role_name
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE (u.name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?) AND u.user_type IN ('admin', 'staff')
                LIMIT ?
            ");
            $stmt->bindValue(1, $q);
            $stmt->bindValue(2, $q);
            $stmt->bindValue(3, $q);
            $stmt->bindValue(4, $limit, PDO::PARAM_INT);
            $stmt->execute();
            foreach ($stmt->fetchAll() as $row) {
                $results[] = [
                    'category' => 'Staff Directory',
                    'title'    => $row['name'] . ' (' . ($row['role_name'] ?: 'Staff') . ')',
                    'subtitle' => 'Email: ' . $row['email'] . ' | Mobile: ' . $row['mobile'],
                    'url'      => BASE_URL . 'admin/staff.php?id=' . $row['id'],
                    'icon'     => 'bi-shield-lock'
                ];
            }
        } catch (Exception $e) {}

        return $results;
    }
}
