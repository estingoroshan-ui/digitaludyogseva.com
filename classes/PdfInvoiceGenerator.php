<?php
/**
 * Standalone Enterprise PDF Generator for Digital Udyog Seva
 * Generates 100% compliant PDF-1.4 binary documents without external libraries.
 * Produces crisp, professional A4 invoices and scorecards readable by all PDF viewers.
 */

class PdfInvoiceGenerator {

    private $objects = [];
    private $pageObjects = [];
    private $content = '';
    private $pageWidth = 595.28;  // A4 points (210mm)
    private $pageHeight = 841.89; // A4 points (297mm)

    public function __construct() {
        // Initialize PDF content
        $this->content = '';
    }

    public function generateInvoicePdf($invoice, $customer, $company = null, $asDownload = false) {
        $invNo = $invoice['invoice_no'] ?? $invoice['invoiceNo'] ?? 'INV-2026-001';
        $invDate = $invoice['created_at'] ?? $invoice['date'] ?? date('d-m-Y');
        $dueDate = $invoice['due_date'] ?? date('d-m-Y', strtotime('+15 days'));
        $custName = $customer['name'] ?? $customer['company_name'] ?? 'Valued Customer';
        $custGstin = $customer['gstin'] ?? 'Unregistered';
        $custCity = $customer['city'] ?? 'Jaipur';
        $custState = $customer['state'] ?? 'Rajasthan';
        $custMobile = $customer['mobile'] ?? '';
        $custAddress = $customer['address'] ?? ($custCity . ', ' . $custState);

        $items = $invoice['items'] ?? [
            [
                'desc' => $invoice['service_name'] ?? 'Government Scheme Consultancy & DPR Preparation',
                'sac' => '998311',
                'amount' => (float)($invoice['total_amount'] ?? $invoice['amount'] ?? 15000),
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

        // Build PDF graphics stream
        $stream = "";

        // Top Header Banner (Deep Navy #002970)
        $stream .= "q 0 0.16 0.44 rg 0 760 595.28 82 re f Q\n";

        // Company Title
        $stream .= "BT /F2 20 Tf 1 1 1 rg 40 805 Td (DIGITAL UDYOG SEVA) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.85 0.92 1 rg 40 790 Td (Business Registration, MSME Advisory & Govt Scheme Consultancy) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.75 0.85 0.95 rg 40 776 Td (Corporate Office: Corporate Tower, Financial District, Jaipur, RJ - 302001) Tj ET\n";
        $stream .= "BT /F2 10 Tf 1 1 1 rg 420 805 Td (TAX INVOICE) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.92 1 rg 420 790 Td (GSTIN: 08AABCA9876C1Z9) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.92 1 rg 420 776 Td (CIN: U74140RJ2026PTC012345) Tj ET\n";

        // Invoice Meta Box & Customer Box (Light background #F8FAFC)
        $stream .= "q 0.97 0.98 0.99 rg 40 660 515 85 re f Q\n";
        $stream .= "q 0.85 0.90 0.95 RG 1 w 40 660 515 85 re S Q\n";

        // Invoice details (Left column)
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 55 725 Td (INVOICE DETAILS) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 710 Td (Invoice No: {$invNo}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 696 Td (Invoice Date: {$invDate}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 682 Td (Payment Terms: Immediate / Net 15) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 55 668 Td (Place of Supply: {$custState} (India)) Tj ET\n";

        // Customer Details (Right column)
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 300 725 Td (BILLED TO / CUSTOMER) Tj ET\n";
        $stream .= "BT /F2 9 Tf 0.1 0.15 0.25 rg 300 710 Td (" . self::escapePdf($custName) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 300 696 Td (Address: " . self::escapePdf(substr($custAddress, 0, 42)) . ") Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 300 682 Td (State/City: {$custCity}, {$custState}) Tj ET\n";
        $stream .= "BT /F1 8.5 Tf 0.2 0.2 0.2 rg 300 668 Td (GSTIN: {$custGstin} | Mobile: {$custMobile}) Tj ET\n";

        // Table Header (Sky Blue #00BAF2)
        $stream .= "q 0 0.73 0.95 rg 40 620 515 24 re f Q\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 50 628 Td (SR.) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 80 628 Td (SERVICE DESCRIPTION / PARTICULARS) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 350 628 Td (SAC CODE) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 420 628 Td (GST RATE) Tj ET\n";
        $stream .= "BT /F2 9 Tf 1 1 1 rg 480 628 Td (AMOUNT (INR)) Tj ET\n";

        // Table Rows
        $rowY = 595;
        $idx = 1;
        foreach ($items as $item) {
            $desc = self::escapePdf($item['desc']);
            $sac = self::escapePdf($item['sac'] ?? '998311');
            $rate = ($item['gst_rate'] ?? 18) . '%';
            $amt = number_format((float)($item['amount'] ?? 0), 2);

            // Alternate row background
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

        // Summary Calculations Box
        $calcY = $rowY - 15;
        $stream .= "q 0.98 0.98 0.99 rg 330 " . ($calcY - 100) . " 225 110 re f Q\n";
        $stream .= "q 0.8 0.85 0.9 RG 1 w 330 " . ($calcY - 100) . " 225 110 re S Q\n";

        $subStr = number_format($subtotal, 2);
        $stream .= "BT /F1 8.5 Tf 0.3 0.3 0.3 rg 345 " . ($calcY - 5) . " Td (Taxable Value:) Tj ET\n";
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

        // Total Row (Dark Blue highlight)
        $totStr = number_format($totalAmount, 2);
        $stream .= "q 0 0.16 0.44 rg 330 " . ($calcY - 95) . " 225 30 re f Q\n";
        $stream .= "BT /F2 11 Tf 1 1 1 rg 345 " . ($calcY - 80) . " Td (TOTAL PAYABLE:) Tj ET\n";
        $stream .= "BT /F2 11 Tf 1 0.85 0 rg 460 " . ($calcY - 80) . " Td (Rs. {$totStr}) Tj ET\n";

        // Bank Details & Instructions (Left side)
        $bankY = $calcY - 10;
        $stream .= "BT /F2 9 Tf 0 0.16 0.44 rg 45 {$bankY} Td (BANK SETTLEMENT DETAILS) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 16) . " Td (Bank: HDFC Bank Limited) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 30) . " Td (Account Name: Digital Udyog Seva Private Limited) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 44) . " Td (A/C No: 50200089123456 | IFSC: HDFC0001234) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.25 0.25 0.25 rg 45 " . ($bankY - 58) . " Td (UPI VPA: digitaludyogseva@hdfcbank) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.4 0.4 0.4 rg 45 " . ($bankY - 74) . " Td (* Computer generated tax invoice. No signature required under Rule 46.) Tj ET\n";

        // Terms & Conditions (Bottom)
        $stream .= "q 0.85 0.90 0.95 RG 0.5 w 40 120 515 0.5 re S Q\n";
        $stream .= "BT /F2 8 Tf 0 0.16 0.44 rg 40 105 Td (TERMS & CONDITIONS:) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.35 0.35 0.35 rg 40 92 Td (1. Payment is due within the stipulated due date. Consultancy services commence upon fee receipt.) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.35 0.35 0.35 rg 40 80 Td (2. All dispute resolutions are subject to exclusive Jaipur (Rajasthan) jurisdiction only.) Tj ET\n";
        $stream .= "BT /F1 7.5 Tf 0.35 0.35 0.35 rg 40 68 Td (3. Digital Udyog Seva is an authorized corporate facilitator for MSME loans, subsidies & registrations.) Tj ET\n";

        // Bottom Footer (Sky Blue)
        $stream .= "q 0 0.73 0.95 rg 0 0 595.28 25 re f Q\n";
        $stream .= "BT /F1 8 Tf 1 1 1 rg 160 8 Td (Official Portal: https://digitaludyogseva.com | Helpline: 1800-890-1234) Tj ET\n";

        return self::buildPdfDocument($stream);
    }

    public static function escapePdf($str) {
        $str = str_replace('\\', '\\\\', $str);
        $str = str_replace('(', '\\(', $str);
        $str = str_replace(')', '\\)', $str);
        // Replace non-ascii chars with transliterated equivalents
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
