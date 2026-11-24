<?php
require_once __DIR__ . '/../classes/PdfInvoiceGenerator.php';

$gen = new PdfInvoiceGenerator();

// 1. Invoice
$invPdf = $gen->generateInvoicePdf([], []);
echo "Invoice PDF: " . strlen($invPdf) . " bytes, Valid: " . (substr($invPdf, 0, 4) === '%PDF' ? 'YES' : 'NO') . "\n";

// 2. Receipt
$rctPdf = $gen->generateReceiptPdf([], []);
echo "Receipt PDF: " . strlen($rctPdf) . " bytes, Valid: " . (substr($rctPdf, 0, 4) === '%PDF' ? 'YES' : 'NO') . "\n";

// 3. Payslip
$payPdf = $gen->generatePayslipPdf([], []);
echo "Payslip PDF: " . strlen($payPdf) . " bytes, Valid: " . (substr($payPdf, 0, 4) === '%PDF' ? 'YES' : 'NO') . "\n";

// 4. Scorecard
$scPdf = $gen->generateScorecardPdf([], []);
echo "Scorecard PDF: " . strlen($scPdf) . " bytes, Valid: " . (substr($scPdf, 0, 4) === '%PDF' ? 'YES' : 'NO') . "\n";
