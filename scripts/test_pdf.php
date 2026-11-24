<?php
require_once __DIR__ . '/../classes/PdfInvoiceGenerator.php';

$gen = new PdfInvoiceGenerator();
$invoice = [
    'invoice_no' => 'INV-2026-904',
    'date' => '24-11-2026',
    'due_date' => '09-12-2026',
    'total_amount' => 45000,
    'service_name' => 'PMEGP Subsidy Project Report & Bank Loan Advisory',
    'items' => [
        ['desc' => 'DPR Project Report Preparation & Feasibility Study', 'sac' => '998311', 'amount' => 25000, 'gst_rate' => 18],
        ['desc' => 'PMEGP Scheme Online Portal Filing & Liaisoning', 'sac' => '998312', 'amount' => 15000, 'gst_rate' => 18],
        ['desc' => 'Statutory Compliance & CMA Data Formulation', 'sac' => '998313', 'amount' => 5000, 'gst_rate' => 18]
    ]
];
$customer = [
    'name' => 'Sharma Agro Solutions Pvt. Ltd.',
    'company_name' => 'Sharma Agro Solutions Pvt. Ltd.',
    'gstin' => '08AAECS1234F1Z5',
    'city' => 'Jaipur',
    'state' => 'Rajasthan',
    'mobile' => '+91 94120 55890',
    'address' => 'Plot 44, Agro Park Phase 2, Sitapura Industrial Area, Jaipur'
];

$pdf = $gen->generateInvoicePdf($invoice, $customer);
file_put_contents(__DIR__ . '/../test_invoice.pdf', $pdf);

echo "PDF generated successfully!\n";
echo "File size: " . strlen($pdf) . " bytes\n";
echo "PDF Header: " . substr($pdf, 0, 10) . "\n";
echo "PDF EOF: " . substr($pdf, -10) . "\n";
