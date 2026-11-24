<?php
/**
 * Standalone Enterprise PDF Generator for Digital Udyog Seva
 * Generates 100% compliant PDF-1.4 vector documents without external dependencies.
 * Produces crisp, professional A4 invoices, receipts, payslips, scorecards, and reports.
 */

class PdfInvoiceGenerator {

    private $pageWidth = 595.28;  // A4 points (210mm)
    private $pageHeight = 841.89; // A4 points (297mm)

    public function __construct() {}

    // =========================================================================
    // 1. TAX INVOICE & PROFORMA INVOICE
    // =========================================================================
    public function generateInvoicePdf($invoice, $customer, $isProforma = false) {
        $invNo = $invoice['invoice_no'] ?? $invoice['invoiceNo'] ?? ($isProforma ? 'PI-2026-001' : 'INV-2026-001');
        $invDate = $invoice['created_at'] ?? $invoice['date'] ?? date('d-m-Y');
        $dueDate = $invoice['due_date'] ?? date('d-m-Y', strtotime('+15 days'));
        $docTitle = $isProforma ? 'PROFORMA INVOICE' : 'TAX INVOICE';

        $custName = $customer['name'] ?? $customer['company_name'] ?? 'Valued Customer';
        $custGstin = $customer['gstin'] ?? '08AAECS1234F1Z5';
        $custCity = $customer['city'] ?? 'Jaipur';
        $custState = $customer['state'] ?? 'Rajasthan';
        $custMobile = $customer['mobile'] ?? '+91 98290 12345';
        $custAddress = $customer['address'] ?? ($custCity . ', ' . $custState);

        $items = $invoice['items'] ?? [
            [
                'desc' => $invoice['service_name'] ?? 'PMEGP Subsidy Detailed Project Report (DPR) & Advisory',
                'sac' => '998311',
                'amount' => (float)($invoice['total_amount'] ?? $invoice['amount'] ?? 25000),
                'gst_rate' => 18
            ]
        ];

        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += (float)($item['amount'] ?? 0);
        }
        $isInterState = (stripos($custState, 'Rajasthan') === false);
        $cgst = $isInterState ? 0 : round($subtotal * 0.09, 2);
        $sgst = $isInterState ? 0 : round($subtotal * 0.09, 2);
        $igst = $isInterState ? round($subtotal * 0.18, 2) : 0;
        $totalAmount = $subtotal + $cgst + $sgst + $igst;

        $stream = "";
        // Header Banner (Navy #002970)
        $stream .= "q 0 0.16 0.44 rg 0 760 595.28 82 re f Q\n";
        $stream .= "BT /F2 20 Tf 1 1 1 rg 40 805 Td (DIGITAL UDYOG SEVA) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.85 0.92 1 rg 40 790 Td (Business Registration, MSME Advisory & Govt Scheme Consultancy) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.75 0.85 0.95 rg 40 776 Td (Corporate Office: Corporate Tower, Financial District, Jaipur, RJ - 302001) Tj ET\n";
        $stream .= "BT /F2 11 Tf 1 1 1 rg 410 805 Td ({$docTitle}) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.92 1 rg 410 790 Td (GSTIN: 08AABCA9876C1Z9) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.92 1 rg 410 776 Td (CIN: U74140RJ2026PTC012345) Tj ET\n";

        // Details Box
        $stream .= "q 0.97 0.98 0.99 rg 40 660 515 85 re f Q\n";
        $stream .= "q 0.85 0.90 0.95 RG 1 w 40 660 515 85 re S Q\n";
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 55 725 Td (DOCUMENT PARTICULARS) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 710 Td (Invoice No: {$invNo}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 696 Td (Invoice Date: {$invDate}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 682 Td (Due Date: {$dueDate}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 668 Td (Place of Supply: {$custState}) Tj ET\n";

        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 300 725 Td (BILLED TO / BORROWER) Tj ET\n";
        $stream .= "BT /F2 9 Tf 0.1 0.15 0.25 rg 300 710 Td (" . self::escapePdf($custName) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 300 696 Td (Address: " . self::escapePdf(substr($custAddress, 0, 42)) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 300 682 Td (State/City: {$custCity}, {$custState}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 300 668 Td (GSTIN: {$custGstin} | Mob: {$custMobile}) Tj ET\n";

        // Table Header
        $stream .= "q 0 0.73 0.95 rg 40 620 515 24 re f Q\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 50 628 Td (SR.) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 80 628 Td (CONSULTANCY SERVICE / PARTICULARS) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 350 628 Td (SAC CODE) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 420 628 Td (TAX RATE) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 480 628 Td (AMOUNT (INR)) Tj ET\n";

        $rowY = 595;
        $idx = 1;
        foreach ($items as $item) {
            $desc = self::escapePdf($item['desc']);
            $sac = self::escapePdf($item['sac'] ?? '998311');
            $rate = ($item['gst_rate'] ?? 18) . '%';
            $amt = number_format((float)($item['amount'] ?? 0), 2);

            if ($idx % 2 === 0) {
                $stream .= "q 0.96 0.98 1 rg 40 " . ($rowY - 8) . " 515 22 re f Q\n";
            }
            $stream .= "q 0.88 0.91 0.95 RG 0.5 w 40 " . ($rowY - 8) . " 515 22 re S Q\n";
            $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 52 {$rowY} Td ({$idx}) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.1 0.1 0.1 rg 80 {$rowY} Td ({$desc}) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 355 {$rowY} Td ({$sac}) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 430 {$rowY} Td ({$rate}) Tj ET\n";
            $stream .= "BT /F2 8.5 Tf 0 0.16 0.44 rg 485 {$rowY} Td ({$amt}) Tj ET\n";
            $rowY -= 24;
            $idx++;
        }

        // Summary Calculations
        $calcY = $rowY - 15;
        $stream .= "q 0.98 0.98 0.99 rg 330 " . ($calcY - 100) . " 225 110 re f Q\n";
        $stream .= "q 0.8 0.85 0.9 RG 1 w 330 " . ($calcY - 100) . " 225 110 re S Q\n";
        $subStr = number_format($subtotal, 2);
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 345 " . ($calcY - 5) . " Td (Taxable Subtotal:) Tj ET\n";
        $stream .= "BT /F2 8.5 Tf 0.1 0.1 0.1 rg 480 " . ($calcY - 5) . " Td (Rs. {$subStr}) Tj ET\n";

        if (!$isInterState) {
            $cgstStr = number_format($cgst, 2);
            $sgstStr = number_format($sgst, 2);
            $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 345 " . ($calcY - 25) . " Td (Central GST (9%):) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.1 0.1 0.1 rg 480 " . ($calcY - 25) . " Td (Rs. {$cgstStr}) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 345 " . ($calcY - 45) . " Td (State GST (9%):) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.1 0.1 0.1 rg 480 " . ($calcY - 45) . " Td (Rs. {$sgstStr}) Tj ET\n";
        } else {
            $igstStr = number_format($igst, 2);
            $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 345 " . ($calcY - 35) . " Td (Integrated GST (18%):) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.1 0.1 0.1 rg 480 " . ($calcY - 35) . " Td (Rs. {$igstStr}) Tj ET\n";
        }

        $totStr = number_format($totalAmount, 2);
        $stream .= "q 0 0.16 0.44 rg 330 " . ($calcY - 95) . " 225 30 re f Q\n";
        $stream .= "BT /F2 11 Tf 1 1 1 rg 345 " . ($calcY - 80) . " Td (TOTAL PAYABLE:) Tj ET\n";
        $stream .= "BT /F2 11 Tf 1 0.85 0 rg 460 " . ($calcY - 80) . " Td (Rs. {$totStr}) Tj ET\n";

        // Bank settlement & Terms
        $bankY = $calcY - 10;
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 45 {$bankY} Td (BANK SETTLEMENT DETAILS) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 16) . " Td (Bank: HDFC Bank Limited | Branch: Financial District Jaipur) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 30) . " Td (A/C Name: Digital Udyog Seva Private Limited) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 44) . " Td (A/C No: 50200089123456 | IFSC: HDFC0001234) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 58) . " Td (UPI ID: digitaludyogseva@hdfcbank) Tj ET\n";

        $stream .= "q 0.85 0.90 0.95 RG 0.5 w 40 120 515 0.5 re S Q\n";
        $stream .= "BT /F2 8 Tf 0 0.16 0.44 rg 40 105 Td (TERMS & CONDITIONS:) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.35 0.35 0.35 rg 40 92 Td (1. Payment is due within stipulated due date. Consultancy commences upon milestone fee receipt.) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.35 0.35 0.35 rg 40 80 Td (2. All dispute resolutions are subject to exclusive Jaipur (Rajasthan) jurisdiction only.) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.35 0.35 0.35 rg 40 68 Td (3. Official facilitator for MSME loans, subsidies and corporate statutory registrations.) Tj ET\n";

        $stream .= "q 0 0.73 0.95 rg 0 0 595.28 25 re f Q\n";
        $stream .= "BT /F1 8 Tf 1 1 1 rg 160 8 Td (Official Portal: https://digitaludyogseva.com | Helpline: 1800-890-1234) Tj ET\n";

        return self::buildPdfDocument($stream);
    }

    // =========================================================================
    // 2. OFFICIAL PAYMENT RECEIPT
    // =========================================================================
    public function generateReceiptPdf($receipt, $customer) {
        $rctNo = $receipt['receipt_no'] ?? $receipt['receiptNo'] ?? 'RCT-2026-901';
        $rctDate = $receipt['date'] ?? date('d-m-Y');
        $amount = (float)($receipt['amount'] ?? 29500);
        $mode = $receipt['payment_mode'] ?? $receipt['mode'] ?? 'UPI Transfer';
        $refNo = $receipt['reference_no'] ?? $receipt['ref'] ?? 'UPI/20261120/987123';
        $invoiceRef = $receipt['invoice_no'] ?? 'INV-2026-904';

        $custName = $customer['name'] ?? $customer['company_name'] ?? 'Amit Enterprises';
        $custCity = $customer['city'] ?? 'Jaipur';
        $custState = $customer['state'] ?? 'Rajasthan';

        $stream = "";
        $stream .= "q 0 0.16 0.44 rg 0 760 595.28 82 re f Q\n";
        $stream .= "BT /F2 20 Tf 1 1 1 rg 40 805 Td (DIGITAL UDYOG SEVA) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.85 0.92 1 rg 40 790 Td (Official Consultancy Payment Receipt & Acknowledgment) Tj ET\n";
        $stream .= "BT /F2 12 Tf 1 1 1 rg 420 805 Td (PAYMENT RECEIPT) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.92 1 rg 420 790 Td (Receipt No: {$rctNo}) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.92 1 rg 420 776 Td (Date: {$rctDate}) Tj ET\n";

        // Green PAID Stamp
        $stream .= "q 0.08 0.64 0.29 rg 420 710 135 34 re f Q\n";
        $stream .= "BT /F2 14 Tf 1 1 1 rg 450 722 Td (PAID IN FULL) Tj ET\n";

        // Receipt Content Box
        $stream .= "q 0.97 0.98 0.99 rg 40 500 515 240 re f Q\n";
        $stream .= "q 0.85 0.90 0.95 RG 1 w 40 500 515 240 re S Q\n";

        $stream .= "BT /F2 10 Tf 0 0.16 0.44 rg 60 715 Td (RECEIVED WITH THANKS FROM:) Tj ET\n";
        $stream .= "BT /F2 13 Tf 0.1 0.1 0.2 rg 60 695 Td (" . self::escapePdf($custName) . ") Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.3 0.3 0.3 rg 60 680 Td (Location: {$custCity}, {$custState}) Tj ET\n";

        $amtStr = number_format($amount, 2);
        $stream .= "BT /F2 10 Tf 0 0.16 0.44 rg 60 645 Td (SUM OF RUPEES:) Tj ET\n";
        $stream .= "BT /F2 14 Tf 0.08 0.64 0.29 rg 60 625 Td (INR {$amtStr} /- Only) Tj ET\n";

        $stream .= "BT /F2 10 Tf 0 0.16 0.44 rg 60 590 Td (PAYMENT PARTICULARS:) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 60 572 Td (Payment Mode: {$mode}) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 60 556 Td (Transaction / UTR Reference: {$refNo}) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 60 540 Td (Settlement Bank: HDFC Bank Ltd - Corporate Collection Account) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 60 524 Td (Adjusted Against Invoice: {$invoiceRef}) Tj ET\n";

        // Signature Box
        $stream .= "q 0.85 0.90 0.95 RG 1 w 360 400 180 0.5 re S Q\n";
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 380 385 Td (Authorized Signatory) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.4 0.4 0.4 rg 380 372 Td (Digital Udyog Seva Accounts) Tj ET\n";

        $stream .= "q 0 0.73 0.95 rg 0 0 595.28 25 re f Q\n";
        $stream .= "BT /F1 8 Tf 1 1 1 rg 160 8 Td (Receipt verified digitally | https://digitaludyogseva.com) Tj ET\n";

        return self::buildPdfDocument($stream);
    }

    // =========================================================================
    // 3. EMPLOYEE SALARY SLIP (MONTHLY PAYSLIP)
    // =========================================================================
    public function generatePayslipPdf($payslip, $employee) {
        $empCode = $employee['emp_code'] ?? $employee['code'] ?? 'EMP-001';
        $empName = $employee['name'] ?? 'CA Rajesh Verma';
        $dept = $employee['department'] ?? 'Accounts & Audit';
        $role = $employee['role'] ?? $employee['designation'] ?? 'Finance Manager';
        $payPeriod = $payslip['month'] ?? date('F Y');
        $daysPresent = $payslip['days_present'] ?? 24;
        $totalDays = $payslip['total_days'] ?? 26;

        $basic = (float)($payslip['basic'] ?? 40000);
        $hra = (float)($payslip['hra'] ?? 16000);
        $allowances = (float)($payslip['allowances'] ?? 9000);
        $gross = $basic + $hra + $allowances; // 65,000

        $pf = (float)($payslip['pf'] ?? 1800);
        $pt = (float)($payslip['pt'] ?? 200);
        $tds = (float)($payslip['tds'] ?? 2500);
        $totalDeductions = $pf + $pt + $tds;
        $netSalary = $gross - $totalDeductions;

        $stream = "";
        $stream .= "q 0 0.16 0.44 rg 0 760 595.28 82 re f Q\n";
        $stream .= "BT /F2 18 Tf 1 1 1 rg 40 805 Td (DIGITAL UDYOG SEVA) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.85 0.92 1 rg 40 790 Td (Confidential Employee Monthly Salary Slip) Tj ET\n";
        $stream .= "BT /F2 11 Tf 1 1 1 rg 420 805 Td (SALARY SLIP) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.85 0.92 1 rg 420 790 Td (Pay Period: {$payPeriod}) Tj ET\n";

        // Employee Meta Box
        $stream .= "q 0.97 0.98 0.99 rg 40 670 515 75 re f Q\n";
        $stream .= "q 0.85 0.90 0.95 RG 1 w 40 670 515 75 re S Q\n";
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 55 725 Td (Employee Code: {$empCode}) Tj ET\n";
        $stream .= "BT /F2 10 Tf 0.1 0.1 0.2 rg 55 710 Td (" . self::escapePdf($empName) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 55 696 Td (Department: {$dept}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 55 682 Td (Designation: {$role}) Tj ET\n";

        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 320 725 Td (ATTENDANCE & BANK) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 320 710 Td (Days Worked: {$daysPresent} / {$totalDays} Days) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 320 696 Td (Bank: HDFC Bank | A/C: XXXXXX4412) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 320 682 Td (Disbursement: Online Direct NEFT) Tj ET\n";

        // Two Column Table: Earnings (Left) & Deductions (Right)
        $stream .= "q 0 0.73 0.95 rg 40 635 250 20 re f Q\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 50 641 Td (EARNINGS (INR)) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 230 641 Td (AMOUNT) Tj ET\n";

        $stream .= "q 0.86 0.15 0.15 rg 305 635 250 20 re f Q\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 315 641 Td (DEDUCTIONS (INR)) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 495 641 Td (AMOUNT) Tj ET\n";

        // Rows
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 50 615 Td (Basic Salary) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 230 615 Td (" . number_format($basic, 2) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 315 615 Td (Provident Fund (PF)) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 495 615 Td (" . number_format($pf, 2) . ") Tj ET\n";

        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 50 595 Td (House Rent Allowance (HRA)) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 230 595 Td (" . number_format($hra, 2) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 315 595 Td (Professional Tax (PT)) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 495 595 Td (" . number_format($pt, 2) . ") Tj ET\n";

        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 50 575 Td (Special & Travel Allowances) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 230 575 Td (" . number_format($allowances, 2) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 315 575 Td (TDS / Income Tax) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 495 575 Td (" . number_format($tds, 2) . ") Tj ET\n";

        // Subtotals
        $stream .= "q 0.9 0.94 0.98 rg 40 545 250 20 re f Q\n";
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 50 551 Td (GROSS EARNINGS:) Tj ET\n";
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 215 551 Td (Rs. " . number_format($gross, 2) . ") Tj ET\n";

        $stream .= "q 0.98 0.92 0.92 rg 305 545 250 20 re f Q\n";
        $stream .= "BT /F2 9 Tf 0.7 0.1 0.1 rg 315 551 Td (TOTAL DEDUCTIONS:) Tj ET\n";
        $stream .= "BT /F2 9 Tf 0.7 0.1 0.1 rg 480 551 Td (Rs. " . number_format($totalDeductions, 2) . ") Tj ET\n";

        // Net Salary Box (Navy Blue Banner)
        $stream .= "q 0 0.16 0.44 rg 40 480 515 45 re f Q\n";
        $stream .= "BT /F2 13 Tf 1 1 1 rg 60 500 Td (NET TAKE HOME SALARY:) Tj ET\n";
        $stream .= "BT /F2 16 Tf 0.08 0.85 0.35 rg 380 498 Td (Rs. " . number_format($netSalary, 2) . " /-) Tj ET\n";

        $stream .= "q 0 0.73 0.95 rg 0 0 595.28 25 re f Q\n";
        $stream .= "BT /F1 8 Tf 1 1 1 rg 140 8 Td (System Generated Confidential Payslip | Digital Udyog Seva HRMS) Tj ET\n";

        return self::buildPdfDocument($stream);
    }

    // =========================================================================
    // 4. SCHEME ELIGIBILITY & 100-POINT SCORECARD REPORT
    // =========================================================================
    public function generateScorecardPdf($scorecard, $applicant) {
        $scoreNo = $scorecard['score_no'] ?? 'SC-2026-101';
        $appName = $applicant['name'] ?? $applicant['business_name'] ?? 'Amit Enterprises';
        $scheme = $scorecard['scheme'] ?? 'PMEGP Subsidy Loan Scheme';
        $score = (int)($scorecard['score'] ?? 84);
        $subsidyPercent = $scorecard['subsidy'] ?? '35%';
        $maxSubsidy = $scorecard['max_subsidy'] ?? 'Rs. 17.50 Lakhs';
        $loanRequired = $scorecard['loan_amount'] ?? 'Rs. 25.00 Lakhs';
        $dscr = $scorecard['dscr'] ?? '1.85x';

        $stream = "";
        $stream .= "q 0 0.16 0.44 rg 0 760 595.28 82 re f Q\n";
        $stream .= "BT /F2 18 Tf 1 1 1 rg 40 805 Td (DIGITAL UDYOG SEVA) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.85 0.92 1 rg 40 790 Td (Government Scheme Credit Appraisal & 100-Point Feasibility Scorecard) Tj ET\n";
        $stream .= "BT /F2 11 Tf 1 1 1 rg 400 805 Td (CREDIT SCORECARD) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.85 0.92 1 rg 400 790 Td (Appraisal ID: {$scoreNo}) Tj ET\n";

        // Score Highlight Circle / Box
        $stream .= "q 0.92 0.98 0.94 rg 40 640 515 105 re f Q\n";
        $stream .= "q 0.1 0.65 0.3 RG 1.5 w 40 640 515 105 re S Q\n";
        $stream .= "BT /F2 12 Tf 0 0.16 0.44 rg 60 720 Td (OVERALL FEASIBILITY SCORE) Tj ET\n";
        $stream .= "BT /F2 36 Tf 0.08 0.64 0.29 rg 60 675 Td ({$score} / 100) Tj ET\n";
        $stream .= "BT /F2 10 Tf 0.08 0.64 0.29 rg 60 655 Td (GRADE A: PRIME BANKABLE TIER - HIGH APPROVAL PROBABILITY) Tj ET\n";

        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 320 720 Td (SCHEME ELIGIBILITY BENCHMARKS) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 320 702 Td (Scheme: {$scheme}) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 320 686 Td (Govt Subsidy: {$subsidyPercent} (Max Cap: {$maxSubsidy})) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 320 670 Td (Loan Requirement: {$loanRequired}) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.2 0.2 0.2 rg 320 654 Td (Debt Service Coverage Ratio: {$dscr}) Tj ET\n";

        // 6 Underwriting Pillars
        $stream .= "BT /F2 10 Tf 0 0.16 0.44 rg 40 615 Td (UNDERWRITING PILLARS BREAKDOWN:) Tj ET\n";
        $pillars = [
            ['Pillar' => '1. Promoter Business Experience & Technical Knowhow', 'Weight' => '20 Pts', 'Scored' => '18 / 20', 'Status' => 'Verified'],
            ['Pillar' => '2. Project Financial Viability & Working Capital Cycle', 'Weight' => '20 Pts', 'Scored' => '17 / 20', 'Status' => 'Compliant'],
            ['Pillar' => '3. Debt Repayment Capacity (Projected DSCR > 1.75)', 'Weight' => '20 Pts', 'Scored' => '18 / 20', 'Status' => 'Sound'],
            ['Pillar' => '4. Document Completeness (Udyam, ITR, GST, Quotations)', 'Weight' => '15 Pts', 'Scored' => '14 / 15', 'Status' => 'Collected'],
            ['Pillar' => '5. Government Subsidy & Policy Guideline Adherence', 'Weight' => '15 Pts', 'Scored' => '10 / 10', 'Status' => 'Eligible'],
            ['Pillar' => '6. Banking History & Collateral Feasibility Ratio', 'Weight' => '10 Pts', 'Scored' => '7 / 10', 'Status' => 'Acceptable']
        ];

        $pY = 590;
        foreach ($pillars as $p) {
            $stream .= "q 0.98 0.98 0.99 rg 40 " . ($pY - 5) . " 515 20 re f Q\n";
            $stream .= "q 0.88 0.91 0.95 RG 0.5 w 40 " . ($pY - 5) . " 515 20 re S Q\n";
            $stream .= "BT /F1 8.5 Tf 0.1 0.1 0.1 rg 50 {$pY} Td (" . self::escapePdf($p['Pillar']) . ") Tj ET\n";
            $stream .= "BT /F2 8.5 Tf 0 0.16 0.44 rg 420 {$pY} Td ({$p['Scored']}) Tj ET\n";
            $stream .= "BT /F2 8.5 Tf 0.08 0.64 0.29 rg 490 {$pY} Td ({$p['Status']}) Tj ET\n";
            $pY -= 24;
        }

        // Disclaimer
        $stream .= "BT /F1 7.5 Tf 0.4 0.4 0.4 rg 40 400 Td (* This report is an internal consultancy feasibility scorecard formulated by Digital Udyog Seva.) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.4 0.4 0.4 rg 40 388 Td (* Not a substitute for statutory Credit Information Bureau (CIBIL) underwriting report.) Tj ET\n";

        $stream .= "q 0 0.73 0.95 rg 0 0 595.28 25 re f Q\n";
        $stream .= "BT /F1 8 Tf 1 1 1 rg 160 8 Td (Digital Udyog Seva Underwriting Desk | https://digitaludyogseva.com) Tj ET\n";

        return self::buildPdfDocument($stream);
    }

    public static function escapePdf($str) {
        $str = str_replace('\\', '\\\\', $str);
        $str = str_replace('(', '\\(', $str);
        $str = str_replace(')', '\\)', $str);
        $str = preg_replace('/[^\x20-\x7E]/', ' ', $str);
        return $str;
    }

    private static function buildPdfDocument($contentStream) {
        $streamLength = strlen($contentStream);

        $out = "%PDF-1.4\n";
        $out .= "%\xE2\xE3\xCF\xD3\n";

        $offsets = [];

        // Obj 1: Catalog
        $offsets[1] = strlen($out);
        $out .= "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";

        // Obj 2: Pages
        $offsets[2] = strlen($out);
        $out .= "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";

        // Obj 3: Page
        $offsets[3] = strlen($out);
        $out .= "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n";

        // Obj 4: Content Stream
        $offsets[4] = strlen($out);
        $out .= "4 0 obj\n<< /Length {$streamLength} >>\nstream\n";
        $out .= $contentStream;
        $out .= "\nendstream\nendobj\n";

        // Obj 5: Font F1 (Helvetica Regular)
        $offsets[5] = strlen($out);
        $out .= "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n";

        // Obj 6: Font F2 (Helvetica Bold)
        $offsets[6] = strlen($out);
        $out .= "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n";

        // Cross-reference table
        $xrefOffset = strlen($out);
        $out .= "xref\n";
        $out .= "0 7\n";
        $out .= "0000000000 65535 f \n";
        for ($i = 1; $i <= 6; $i++) {
            $out .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }

        // Trailer
        $out .= "trailer\n<< /Size 7 /Root 1 0 R >>\n";
        $out .= "startxref\n{$xrefOffset}\n%%EOF\n";

        return $out;
    }
}
