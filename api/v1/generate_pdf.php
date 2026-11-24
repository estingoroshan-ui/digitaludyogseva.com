<?php
/**
 * REST API Endpoint: Generate & Stream Authentic Enterprise PDFs
 * Handles Invoices, Receipts, Payslips, Scorecards, and Quotations.
 * Direct compliance with PDF-1.4 format; outputs valid application/pdf binary streams.
 */

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../classes/PdfInvoiceGenerator.php';

$type = strtolower($_GET['type'] ?? 'invoice');
$id = $_GET['id'] ?? 1;
$mode = $_GET['mode'] ?? 'inline'; // 'inline' for preview, 'download' for file attachment

try {
    $generator = new PdfInvoiceGenerator();
    $pdfBinary = '';
    $filename = 'document.pdf';

    switch ($type) {
        // =====================================================================
        // INVOICES & PROFORMA
        // =====================================================================
        case 'invoice':
        case 'tax_invoice':
        case 'proforma_invoice':
        case 'quotation':
            $isProforma = ($type === 'proforma_invoice' || $type === 'quotation');
            $invoice = [
                'invoice_no' => is_numeric($id) ? ('INV-2026-' . str_pad($id, 3, '0', STR_PAD_LEFT)) : $id,
                'date' => date('d-m-Y'),
                'due_date' => date('d-m-Y', strtotime('+15 days')),
                'total_amount' => 29500,
                'service_name' => 'PMEGP Subsidy Project Report (DPR) Formulation & Bank CMA Data',
                'items' => [
                    ['desc' => 'DPR Project Formulation & Bank Techno-Economic CMA', 'sac' => '998311', 'amount' => 20000, 'gst_rate' => 18],
                    ['desc' => 'Online Portal Filing & MSME Subsidy Liaisoning', 'sac' => '998312', 'amount' => 5000, 'gst_rate' => 18]
                ]
            ];

            // If ID matches a real DB invoice
            if ($pdo && is_numeric($id)) {
                try {
                    $stmt = $pdo->prepare("SELECT * FROM invoices WHERE id = ? OR invoice_no = ?");
                    $stmt->execute([$id, $id]);
                    $dbInv = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($dbInv) {
                        $invoice['invoice_no'] = $dbInv['invoice_no'];
                        $invoice['total_amount'] = (float)$dbInv['total_amount'];
                        $invoice['date'] = date('d-m-Y', strtotime($dbInv['created_at']));
                    }
                } catch (Throwable $e) {}
            }

            $customer = [
                'name' => 'Sharma Agro Solutions Pvt. Ltd.',
                'company_name' => 'Sharma Agro Solutions Pvt. Ltd.',
                'gstin' => '08AAECS1234F1Z5',
                'city' => 'Jaipur',
                'state' => 'Rajasthan',
                'mobile' => '+91 94120 55890',
                'address' => 'Plot 44, Agro Park Phase 2, Sitapura Industrial Area, Jaipur'
            ];

            $pdfBinary = $generator->generateInvoicePdf($invoice, $customer, $isProforma);
            $filename = ($isProforma ? 'Quotation-' : 'Invoice-') . $invoice['invoice_no'] . '.pdf';
            break;

        // =====================================================================
        // PAYMENT RECEIPTS
        // =====================================================================
        case 'receipt':
        case 'payment_receipt':
            $receipt = [
                'receipt_no' => is_numeric($id) ? ('RCT-2026-' . str_pad($id, 3, '0', STR_PAD_LEFT)) : $id,
                'date' => date('d-m-Y'),
                'amount' => 29500,
                'payment_mode' => 'UPI / Netbanking (HDFC)',
                'reference_no' => 'HDFC/UPI/20261120/987412',
                'invoice_no' => 'INV-2026-904'
            ];

            $customer = [
                'name' => 'Amit Enterprises',
                'company_name' => 'Amit Enterprises',
                'city' => 'Jaipur',
                'state' => 'Rajasthan'
            ];

            $pdfBinary = $generator->generateReceiptPdf($receipt, $customer);
            $filename = 'Receipt-' . $receipt['receipt_no'] . '.pdf';
            break;

        // =====================================================================
        // EMPLOYEE SALARY SLIP (PAYSLIP)
        // =====================================================================
        case 'payslip':
        case 'salary_slip':
            $payslip = [
                'month' => date('F Y'),
                'days_present' => 24,
                'total_days' => 26,
                'basic' => 40000,
                'hra' => 16000,
                'allowances' => 9000,
                'pf' => 1800,
                'pt' => 200,
                'tds' => 2500
            ];

            $employee = [
                'emp_code' => is_numeric($id) ? ('EMP-' . str_pad($id, 3, '0', STR_PAD_LEFT)) : $id,
                'name' => 'CA Rajesh Verma',
                'department' => 'Accounts & Audit',
                'role' => 'Finance & Statutory Manager'
            ];

            $pdfBinary = $generator->generatePayslipPdf($payslip, $employee);
            $filename = 'Payslip-' . $employee['emp_code'] . '-' . date('M-Y') . '.pdf';
            break;

        // =====================================================================
        // SCORECARD & ELIGIBILITY REPORT
        // =====================================================================
        case 'scorecard':
        case 'eligibility':
        case 'scorecard_report':
            $scorecard = [
                'score_no' => 'SC-2026-' . $id,
                'score' => 84,
                'scheme' => 'PMEGP Subsidy Loan Scheme (Manufacturing)',
                'subsidy' => '35%',
                'max_subsidy' => 'Rs. 17.50 Lakhs',
                'loan_amount' => 'Rs. 25.00 Lakhs',
                'dscr' => '1.85x'
            ];

            $applicant = [
                'name' => 'Amit Enterprises',
                'business_name' => 'Amit Enterprises'
            ];

            $pdfBinary = $generator->generateScorecardPdf($scorecard, $applicant);
            $filename = 'Scorecard-' . $id . '.pdf';
            break;

        default:
            throw new Exception("Unknown PDF document type: {$type}");
    }

    // Set proper headers
    header('Content-Type: application/pdf');
    header('Content-Length: ' . strlen($pdfBinary));
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');

    if ($mode === 'download') {
        header('Content-Disposition: attachment; filename="' . $filename . '"');
    } else {
        header('Content-Disposition: inline; filename="' . $filename . '"');
    }

    echo $pdfBinary;
    exit;

} catch (Throwable $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        'status' => false,
        'message' => 'PDF Generation Error: ' . $e->getMessage()
    ]);
    exit;
}
