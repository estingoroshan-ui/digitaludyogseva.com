<?php
// scripts/seed_services_and_documents.php
// Preload 50+ Real-World Categories, Sub-Categories, Services and Required Document Checklists

require_once __DIR__ . '/../config/app.php';

function seed_services_master($pdo) {
    if (!$pdo) return;

    // 1. Seed Main Categories
    $categories_data = [
        [
            'name' => 'Personal Document Services',
            'slug' => 'personal-document-services',
            'icon' => 'bi-person-vcard',
            'description' => 'Aadhaar, PAN, Voter ID, Passport and Citizen Certificate assistance services.',
            'sort_order' => 1,
            'subcategories' => [
                ['name' => 'Aadhaar Services', 'slug' => 'aadhaar-services', 'icon' => 'bi-fingerprint'],
                ['name' => 'PAN Services', 'slug' => 'pan-services', 'icon' => 'bi-credit-card-2-front'],
                ['name' => 'Voter Services', 'slug' => 'voter-services', 'icon' => 'bi-check2-square'],
                ['name' => 'Other Personal Documents', 'slug' => 'other-personal-documents', 'icon' => 'bi-folder-check'],
            ]
        ],
        [
            'name' => 'Business Registration Services',
            'slug' => 'business-registration-services',
            'icon' => 'bi-shop',
            'description' => 'Proprietorship, MSME Udyam, GST, Shop & Establishment, FSSAI & Licences.',
            'sort_order' => 2,
            'subcategories' => [
                ['name' => 'MSME & Taxation Registration', 'slug' => 'msme-taxation-registration', 'icon' => 'bi-receipt'],
                ['name' => 'Food & Trade Licences', 'slug' => 'food-trade-licences', 'icon' => 'bi-cup-hot'],
                ['name' => 'Import Export & Digital Signatures', 'slug' => 'iec-dsc-services', 'icon' => 'bi-key'],
            ]
        ],
        [
            'name' => 'Company / Entity Registration',
            'slug' => 'company-registration',
            'icon' => 'bi-building',
            'description' => 'Private Limited, OPC, LLP, Partnership, Section 8, Nidhi, Trust and NGO.',
            'sort_order' => 3,
            'subcategories' => [
                ['name' => 'Corporate Entities (MCA)', 'slug' => 'corporate-entities-mca', 'icon' => 'bi-building-check'],
                ['name' => 'Partnership & LLPs', 'slug' => 'partnership-llp', 'icon' => 'bi-people'],
                ['name' => 'Non-Profit & Trust Registration', 'slug' => 'non-profit-trust', 'icon' => 'bi-heart'],
            ]
        ],
        [
            'name' => 'Trademark & Business Compliance',
            'slug' => 'trademark-business-compliance',
            'icon' => 'bi-shield-check',
            'description' => 'Brand Protection, Trademark, Copyright, ISO Certification & Startup India.',
            'sort_order' => 4,
            'subcategories' => [
                ['name' => 'Intellectual Property (IP)', 'slug' => 'intellectual-property', 'icon' => 'bi-c-circle'],
                ['name' => 'Startup & Quality Certifications', 'slug' => 'startup-certifications', 'icon' => 'bi-patch-check'],
            ]
        ],
        [
            'name' => 'Tax & Compliance Services',
            'slug' => 'tax-compliance-services',
            'icon' => 'bi-calculator',
            'description' => 'GST Returns, Income Tax Returns (ITR), TDS, ROC Filings & Annual Accounts.',
            'sort_order' => 5,
            'subcategories' => [
                ['name' => 'Direct & Indirect Tax Returns', 'slug' => 'tax-returns', 'icon' => 'bi-file-earmark-spreadsheet'],
                ['name' => 'ROC Annual Compliance & Filings', 'slug' => 'roc-compliance-filings', 'icon' => 'bi-archive'],
                ['name' => 'Bookkeeping & Accounts', 'slug' => 'bookkeeping-accounts', 'icon' => 'bi-journal-check'],
            ]
        ]
    ];

    $cat_map = []; // slug => id
    $subcat_map = []; // slug => id

    foreach ($categories_data as $cat) {
        $stmt = $pdo->prepare("SELECT id FROM service_categories WHERE slug = ?");
        $stmt->execute([$cat['slug']]);
        $existing = $stmt->fetch();

        if ($existing) {
            $cat_id = $existing['id'];
            $pdo->prepare("UPDATE service_categories SET name = ?, icon = ?, description = ?, sort_order = ? WHERE id = ?")
                ->execute([$cat['name'], $cat['icon'], $cat['description'], $cat['sort_order'], $cat_id]);
        } else {
            $ins = $pdo->prepare("INSERT INTO service_categories (parent_id, name, slug, icon, description, sort_order, status) VALUES (NULL, ?, ?, ?, ?, ?, 'active')");
            $ins->execute([$cat['name'], $cat['slug'], $cat['icon'], $cat['description'], $cat['sort_order']]);
            $cat_id = $pdo->lastInsertId();
        }
        $cat_map[$cat['slug']] = $cat_id;

        if (!empty($cat['subcategories'])) {
            $sub_sort = 1;
            foreach ($cat['subcategories'] as $sub) {
                $stmt_sub = $pdo->prepare("SELECT id FROM service_categories WHERE slug = ?");
                $stmt_sub->execute([$sub['slug']]);
                $existing_sub = $stmt_sub->fetch();

                if ($existing_sub) {
                    $sub_id = $existing_sub['id'];
                    $pdo->prepare("UPDATE service_categories SET parent_id = ?, name = ?, icon = ?, sort_order = ? WHERE id = ?")
                        ->execute([$cat_id, $sub['name'], $sub['icon'], $sub_sort, $sub_id]);
                } else {
                    $ins_sub = $pdo->prepare("INSERT INTO service_categories (parent_id, name, slug, icon, description, sort_order, status) VALUES (?, ?, ?, ?, '', ?, 'active')");
                    $ins_sub->execute([$cat_id, $sub['name'], $sub['slug'], $sub['icon'], $sub_sort]);
                    $sub_id = $pdo->lastInsertId();
                }
                $subcat_map[$sub['slug']] = $sub_id;
                $sub_sort++;
            }
        }
    }

    // 2. Comprehensive 50+ Services Matrix
    $services_catalog = [
        // ==========================================
        // 1. PERSONAL DOCUMENT SERVICES
        // ==========================================
        // Aadhaar Services
        [
            'code' => 'ADH-001',
            'name' => 'Aadhaar Update Assistance',
            'slug' => 'aadhaar-update-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'aadhaar-services',
            'icon' => 'bi-fingerprint',
            'short_desc' => 'End-to-end support for updating demographic or biometric details in Aadhaar card.',
            'govt_fee' => 50.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => ['Current Aadhaar Card Copy', 'Proof of Identity (POI - PAN/Voter/Passport)', 'Proof of Address (POA)'],
            'notes' => 'UIDAI portal processing fee is ₹50 included. OTP on registered mobile number is required.'
        ],
        [
            'code' => 'ADH-002',
            'name' => 'Aadhaar Address Update Assistance',
            'slug' => 'aadhaar-address-update-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'aadhaar-services',
            'icon' => 'bi-geo-alt-fill',
            'short_desc' => 'Online assistance to change/update residential address on Aadhaar card.',
            'govt_fee' => 50.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => ['Current Aadhaar Card', 'Valid Address Proof (Electricity Bill / Rent Agreement / Bank Passbook / Passport)'],
            'notes' => 'Address proof document must show candidate name and matching address.'
        ],
        [
            'code' => 'ADH-003',
            'name' => 'Aadhaar Mobile/Email Update Assistance',
            'slug' => 'aadhaar-mobile-email-update-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'aadhaar-services',
            'icon' => 'bi-telephone-fill',
            'short_desc' => 'Assistance with booking appointment & document verification for mobile/email update.',
            'govt_fee' => 50.00,
            'prof_fee' => 150.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 2,
            'time_unit' => 'Working Days',
            'time_str' => '1–2 Working Days',
            'docs' => ['Current Aadhaar Card', 'Active Mobile Number to be Linked', 'Active Email Address'],
            'notes' => 'Requires biometric authentication at the designated Aadhaar Seva Kendra.'
        ],
        [
            'code' => 'ADH-004',
            'name' => 'Aadhaar Document Update Assistance',
            'slug' => 'aadhaar-document-update-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'aadhaar-services',
            'icon' => 'bi-file-earmark-arrow-up',
            'short_desc' => 'Mandatory 10-year UIDAI document re-validation assistance (POI & POA upload).',
            'govt_fee' => 50.00,
            'prof_fee' => 150.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => ['Aadhaar Card Copy', 'Proof of Identity (POI - Voter/PAN/Driving Licence)', 'Proof of Address (POA - Electricity Bill/Water Bill/Ration Card)'],
            'notes' => 'UIDAI recommends document revalidation every 10 years to maintain active status.'
        ],
        [
            'code' => 'ADH-005',
            'name' => 'Aadhaar Download / Print Assistance',
            'slug' => 'aadhaar-download-print-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'aadhaar-services',
            'icon' => 'bi-printer-fill',
            'short_desc' => 'Instant e-Aadhaar digital download and verification with password unlock.',
            'govt_fee' => 0.00,
            'prof_fee' => 100.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 2,
            'time_unit' => 'Hours',
            'time_str' => '1–2 Hours',
            'docs' => ['Aadhaar Number or 28-digit Enrolment ID (EID)', 'OTP from Mobile Linked to Aadhaar'],
            'notes' => 'Instant delivery of digitally signed official e-Aadhaar PDF.'
        ],

        // PAN Services
        [
            'code' => 'PAN-001',
            'name' => 'New PAN Application Assistance',
            'slug' => 'new-pan-application-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'pan-services',
            'icon' => 'bi-credit-card-2-front',
            'short_desc' => 'Assistance with Form 49A filing for fresh Permanent Account Number (PAN Card).',
            'govt_fee' => 107.00,
            'prof_fee' => 250.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => ['Aadhaar Card', '2 Passport Size Photographs', 'Specimen Signature on White Paper'],
            'notes' => 'Physical PAN card is dispatched directly by NSDL/UTIITSL to your address.'
        ],
        [
            'code' => 'PAN-002',
            'name' => 'PAN Correction',
            'slug' => 'pan-correction-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'pan-services',
            'icon' => 'bi-pencil-square',
            'short_desc' => 'Correction in Name, Father Name, Date of Birth or Photo/Signature in PAN record.',
            'govt_fee' => 107.00,
            'prof_fee' => 350.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => ['Existing PAN Card Copy', 'Aadhaar Card', 'Supporting Gazette / Certificate for Correction', '2 Passport Size Photos'],
            'notes' => 'Name/DOB change must match supporting identity proofs submitted.'
        ],
        [
            'code' => 'PAN-003',
            'name' => 'PAN Reprint',
            'slug' => 'pan-reprint-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'pan-services',
            'icon' => 'bi-arrow-clockwise',
            'short_desc' => 'Assistance in ordering duplicate physical PVC/plastic PAN card from NSDL/UTI.',
            'govt_fee' => 50.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => ['Existing PAN Number', 'Aadhaar Card Copy', 'Delivery Address Confirmation'],
            'notes' => 'Delivered to communication address registered in Income Tax department records.'
        ],
        [
            'code' => 'PAN-004',
            'name' => 'PAN-Aadhaar Related Assistance',
            'slug' => 'pan-aadhaar-related-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'pan-services',
            'icon' => 'bi-link-45deg',
            'short_desc' => 'Linking inoperative PAN with Aadhaar & ITD challan payment verification.',
            'govt_fee' => 1000.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => ['PAN Card Copy', 'Aadhaar Card Copy', 'Mobile Number for OTP Verification'],
            'notes' => 'Government late fee of ₹1,000 is statutory under section 234H.'
        ],

        // Voter Services
        [
            'code' => 'VOT-001',
            'name' => 'New Voter ID Assistance',
            'slug' => 'new-voter-id-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'voter-services',
            'icon' => 'bi-person-badge',
            'short_desc' => 'Form 6 application for new voter registration on National Election Portal (ECI).',
            'govt_fee' => 0.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => ['Passport Size Photograph', 'Age Proof (Aadhaar / 10th Marksheet / Birth Certificate)', 'Address Proof (Electricity Bill / Water Bill / Ration Card)'],
            'notes' => 'Applicant must have completed 18 years of age.'
        ],
        [
            'code' => 'VOT-002',
            'name' => 'Voter ID Correction',
            'slug' => 'voter-id-correction-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'voter-services',
            'icon' => 'bi-pencil-fill',
            'short_desc' => 'Form 8 filing for corrections in name, age, gender, photograph or relation in Voter ID.',
            'govt_fee' => 0.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => ['Existing Voter ID (EPIC) Number', 'Documentary Proof for Correction (Aadhaar / 10th Certificate)', 'Passport Photograph'],
            'notes' => 'Field verification may be conducted by the Booth Level Officer (BLO).'
        ],
        [
            'code' => 'VOT-003',
            'name' => 'Address Change',
            'slug' => 'voter-id-address-change-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'voter-services',
            'icon' => 'bi-house-gear',
            'short_desc' => 'Form 8 filing for shifting of residence within or outside assembly constituency.',
            'govt_fee' => 0.00,
            'prof_fee' => 200.00,
            'other_charges' => 0.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => ['Existing Voter ID Card', 'New Residence Address Proof', 'Recent Passport Photo'],
            'notes' => 'Transfers voting eligibility to the new constituency polling booth.'
        ],
        [
            'code' => 'VOT-004',
            'name' => 'Voter ID Download Assistance',
            'slug' => 'voter-id-download-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'voter-services',
            'icon' => 'bi-download',
            'short_desc' => 'Instant official digital e-EPIC card download from NVSP portal.',
            'govt_fee' => 0.00,
            'prof_fee' => 100.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 2,
            'time_unit' => 'Hours',
            'time_str' => '1–2 Hours',
            'docs' => ['Voter ID (EPIC) Number or Form Reference Number', 'Mobile Number linked to ECI record for OTP'],
            'notes' => 'Official e-EPIC PDF is accepted as valid photo identity across India.'
        ],

        // Other Personal Documents
        [
            'code' => 'DOC-001',
            'name' => 'Passport Application Assistance',
            'slug' => 'passport-application-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-globe-central-south-asia',
            'short_desc' => 'Complete assistance with Passport Seva portal application, slot booking & document prep.',
            'govt_fee' => 1500.00,
            'prof_fee' => 800.00,
            'other_charges' => 0.00,
            'min_time' => 15,
            'max_time' => 25,
            'time_unit' => 'Working Days',
            'time_str' => '15–25 Working Days',
            'docs' => ['Aadhaar Card', 'PAN Card', '10th Class Marksheet / Passing Certificate', 'Bank Passbook / Utility Bill (Proof of Residence)'],
            'notes' => 'Govt fee of ₹1,500 is for normal 36-page passport. Tatkaal has higher statutory fee.'
        ],
        [
            'code' => 'DOC-002',
            'name' => 'Driving Licence Assistance',
            'slug' => 'driving-licence-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-car-front-fill',
            'short_desc' => 'Sarathi Parivahan online application assistance for Learner and Permanent Licence.',
            'govt_fee' => 350.00,
            'prof_fee' => 650.00,
            'other_charges' => 0.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => ['Aadhaar Card', 'Age Proof (10th Marksheet / Birth Certificate)', 'Medical Certificate (Form 1A)', 'Blood Group Report', 'Passport Photos'],
            'notes' => 'RTO slot booking and online test scheduling included.'
        ],
        [
            'code' => 'DOC-003',
            'name' => 'Birth Certificate Assistance',
            'slug' => 'birth-certificate-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-file-earmark-medical',
            'short_desc' => 'Application assistance for municipal / Nagar Nigam birth certificate issuance.',
            'govt_fee' => 50.00,
            'prof_fee' => 500.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => ['Hospital Discharge Certificate / Birth Slip', 'Parents Aadhaar Cards', 'Parents Marriage Certificate', 'Address Proof'],
            'notes' => 'For births older than 1 year, SDM delayed registration order may be required.'
        ],
        [
            'code' => 'DOC-004',
            'name' => 'Death Certificate Assistance',
            'slug' => 'death-certificate-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-file-earmark-x',
            'short_desc' => 'Online filing assistance for official death certificate from local registrar.',
            'govt_fee' => 50.00,
            'prof_fee' => 500.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => ['Hospital Death Summary / Doctor Slip', 'Cremation / Burial Ground Receipt', 'Deceased Aadhaar Card', 'Applicant / Informant ID Proof'],
            'notes' => 'Timely application within 21 days avoids delayed registration penalties.'
        ],
        [
            'code' => 'DOC-005',
            'name' => 'Income Certificate Assistance',
            'slug' => 'income-certificate-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-currency-rupee',
            'short_desc' => 'State revenue department portal assistance for family annual income certificate.',
            'govt_fee' => 50.00,
            'prof_fee' => 450.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => ['Salary Slips / Form 16 / ITR or Self Declaration', 'Ration Card / Family Register', 'Aadhaar Card of Applicant & Head of Family', 'Electricity Bill / Land Proof'],
            'notes' => 'Tehsildar / Lekhpal verification is carried out as per state norms.'
        ],
        [
            'code' => 'DOC-006',
            'name' => 'Domicile Certificate Assistance',
            'slug' => 'domicile-certificate-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-house-check-fill',
            'short_desc' => 'Permanent Residence / Mool Niwas certificate assistance from state authorities.',
            'govt_fee' => 50.00,
            'prof_fee' => 450.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => ['10–15 Years Continuous Residence Proof', 'Aadhaar Card', 'School Leaving / Education Certificates', 'Property Tax Receipt or Rent Records'],
            'notes' => 'Required for state government quotas, jobs, and admissions.'
        ],
        [
            'code' => 'DOC-007',
            'name' => 'Caste Certificate Assistance',
            'slug' => 'caste-certificate-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-shield-shaded',
            'short_desc' => 'SC / ST / OBC caste certificate application assistance through revenue portal.',
            'govt_fee' => 50.00,
            'prof_fee' => 500.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => ['Father / Paternal Relative Caste Certificate', 'Ration Card / Parivar Register', 'Aadhaar Card', 'Self Declaration / Affidavit'],
            'notes' => 'OBC certificate also requires non-creamy layer income proof.'
        ],
        [
            'code' => 'DOC-008',
            'name' => 'EWS Certificate Assistance',
            'slug' => 'ews-certificate-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-card-checklist',
            'short_desc' => 'Economically Weaker Section (10% reservation) eligibility certificate support.',
            'govt_fee' => 50.00,
            'prof_fee' => 600.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => ['Family Income Proof (< ₹8 Lakh p.a.)', 'Agricultural Land / Residential Plot Documents', 'Aadhaar Cards of All Family Members', 'Income Affidavit'],
            'notes' => 'Valid for one financial year for central and state quotas.'
        ],
        [
            'code' => 'DOC-009',
            'name' => 'Police Verification Assistance',
            'slug' => 'police-verification-assistance',
            'cat_slug' => 'personal-document-services',
            'subcat_slug' => 'other-personal-documents',
            'icon' => 'bi-shield-lock',
            'short_desc' => 'Police Clearance Certificate (PCC) online application and appointment booking.',
            'govt_fee' => 100.00,
            'prof_fee' => 400.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => ['Aadhaar Card', 'Current Address Proof', 'Passport Copy (if for overseas travel)', '2 Passport Photos'],
            'notes' => 'Includes online application and verification slip generation.'
        ],

        // ==========================================
        // 2. BUSINESS REGISTRATION SERVICES
        // ==========================================
        [
            'code' => 'BIZ-001',
            'name' => 'Proprietorship Registration Assistance',
            'slug' => 'proprietorship-registration-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'msme-taxation-registration',
            'icon' => 'bi-briefcase-fill',
            'short_desc' => 'Complete legal setup for Sole Proprietorship including MSME, GST & Bank Resolution.',
            'govt_fee' => 0.00,
            'prof_fee' => 999.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => ['Proprietor PAN & Aadhaar Card', 'Electricity Bill / Rent Agreement of Office + NOC', 'Passport Size Photo', 'Cancelled Cheque for Bank Account'],
            'notes' => 'Includes MSME Udyam certificate and legal declaration of proprietorship.'
        ],
        [
            'code' => 'BIZ-002',
            'name' => 'Udyam/MSME Registration Assistance',
            'slug' => 'udyam-msme-registration-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'msme-taxation-registration',
            'icon' => 'bi-award-fill',
            'short_desc' => 'Government MSME Udyam Registration with lifetime validity and collateral-free loan benefits.',
            'govt_fee' => 0.00,
            'prof_fee' => 499.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 2,
            'time_unit' => 'Working Days',
            'time_str' => '1–2 Working Days',
            'docs' => ['Aadhaar Card of Applicant (linked with mobile)', 'PAN Card of Business / Proprietor', 'Bank Account Number & IFSC', 'NIC Codes & Business Activity Details'],
            'notes' => 'Zero government fee. Government certificate generated with QR code.'
        ],
        [
            'code' => 'BIZ-003',
            'name' => 'GST Registration Assistance',
            'slug' => 'gst-registration-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'msme-taxation-registration',
            'icon' => 'bi-receipt-cutoff',
            'short_desc' => 'Goods & Services Tax (GST) fresh registration with ARN tracking & certificate issuance.',
            'govt_fee' => 0.00,
            'prof_fee' => 1499.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '3–7 Working Days',
            'docs' => ['PAN Card of Business / Applicant', 'Aadhaar Card of Authorized Signatory', 'Electricity Bill of Business Premises + NOC / Rent Agreement', 'Bank Account Proof (Cancelled Cheque / Bank Statement)', 'Passport Size Photo'],
            'notes' => 'Aadhaar biometric authentication facilitates approval within 3 working days.'
        ],
        [
            'code' => 'BIZ-004',
            'name' => 'GST Modification Assistance',
            'slug' => 'gst-modification-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'msme-taxation-registration',
            'icon' => 'bi-tools',
            'short_desc' => 'Core and Non-Core field amendment in existing GST certificate (address, partners, bank, trade name).',
            'govt_fee' => 0.00,
            'prof_fee' => 999.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => ['GST Portal Login Credentials', 'Proof of Modification (New Rent Agreement / Bank Cheque / Board Resolution)', 'Authorized Signatory Verification'],
            'notes' => 'Core amendments require tax officer approval; non-core updates are auto-approved.'
        ],
        [
            'code' => 'BIZ-005',
            'name' => 'GST Cancellation Assistance',
            'slug' => 'gst-cancellation-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'msme-taxation-registration',
            'icon' => 'bi-x-octagon',
            'short_desc' => 'Application for GST surrender / cancellation and final return filing consultation.',
            'govt_fee' => 0.00,
            'prof_fee' => 1199.00,
            'other_charges' => 0.00,
            'min_time' => 5,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '5–7 Working Days',
            'docs' => ['GST Portal Credentials', 'Reason for Cancellation Writeup', 'Closing Stock & Input Tax Credit (ITC) Summary', 'Authorized Signatory Aadhaar OTP'],
            'notes' => 'All pending GST returns must be filed before cancellation order is issued.'
        ],
        [
            'code' => 'BIZ-006',
            'name' => 'Shop & Establishment Registration Assistance',
            'slug' => 'shop-establishment-registration-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'food-trade-licences',
            'icon' => 'bi-shop-window',
            'short_desc' => 'Gumasta / Shop & Establishment Act licence from state labour department.',
            'govt_fee' => 250.00,
            'prof_fee' => 1200.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => ['Front Photo of Shop/Office with Signboard', 'Owner PAN & Aadhaar Card', 'Rent Agreement / Property Tax Receipt', 'Employee List & Working Hours'],
            'notes' => 'Statutory government fee varies slightly by state and number of employees.'
        ],
        [
            'code' => 'BIZ-007',
            'name' => 'Trade Licence Assistance',
            'slug' => 'trade-licence-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'food-trade-licences',
            'icon' => 'bi-buildings',
            'short_desc' => 'Municipal Corporation / Local Body Trade Licence application and documentation.',
            'govt_fee' => 500.00,
            'prof_fee' => 1500.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => ['Municipal Property Tax Paid Receipt', 'Electricity Bill & Rent Agreement', 'Fire NOC / Health NOC (if required for trade)', 'ID & Address Proof of Owner'],
            'notes' => 'Municipal council charges are collected as per local trade bylaws.'
        ],
        [
            'code' => 'BIZ-008',
            'name' => 'FSSAI Basic Registration Assistance',
            'slug' => 'fssai-basic-registration-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'food-trade-licences',
            'icon' => 'bi-cup-straw',
            'short_desc' => 'Food safety registration (Form A) for petty food manufacturers, retailers, and cloud kitchens.',
            'govt_fee' => 100.00,
            'prof_fee' => 1199.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => ['Passport Photo of Food Business Operator', 'Aadhaar Card / Voter ID', 'Business Address Proof (Electricity Bill / Rent Agreement)', 'List of Food Product Categories'],
            'notes' => 'For food businesses with annual turnover up to ₹12 Lakhs. 1-year govt fee ₹100.'
        ],
        [
            'code' => 'BIZ-009',
            'name' => 'FSSAI State Licence Assistance',
            'slug' => 'fssai-state-licence-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'food-trade-licences',
            'icon' => 'bi-patch-check-fill',
            'short_desc' => 'FSSAI State Food License (Form B) for mid-scale restaurants, caterers, and food units.',
            'govt_fee' => 2000.00,
            'prof_fee' => 2999.00,
            'other_charges' => 0.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => ['Kitchen / Plant Layout Blueprint', 'List of Directors / Partners / Proprietor', 'Food Safety Management System (FSMS) Plan', 'Water Quality Test Report from NABL Lab', 'NOC from Municipal Authority'],
            'notes' => 'Applicable for turnover between ₹12 Lakh to ₹20 Crore.'
        ],
        [
            'code' => 'BIZ-010',
            'name' => 'FSSAI Central Licence Assistance',
            'slug' => 'fssai-central-licence-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'food-trade-licences',
            'icon' => 'bi-star-fill',
            'short_desc' => 'FSSAI Central License for large manufacturers, importers, exporters & pan-India chains.',
            'govt_fee' => 7500.00,
            'prof_fee' => 5999.00,
            'other_charges' => 0.00,
            'min_time' => 20,
            'max_time' => 30,
            'time_unit' => 'Working Days',
            'time_str' => '20–30 Working Days',
            'docs' => ['Import Export Code (IEC)', 'Form IX Nomination of Technical Incharge', 'Production Unit Blueprints & Machinery List', 'NABL Accredited Water & Product Lab Reports', 'Turnover Proof / CA Certificate'],
            'notes' => 'Mandatory for food business turnover exceeding ₹20 Crore or import/export.'
        ],
        [
            'code' => 'BIZ-011',
            'name' => 'Import Export Code (IEC) Assistance',
            'slug' => 'import-export-code-iec-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'iec-dsc-services',
            'icon' => 'bi-airplane-engines',
            'short_desc' => 'DGFT 10-digit Import Export Code registration with lifetime validity for foreign trade.',
            'govt_fee' => 500.00,
            'prof_fee' => 1499.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 2,
            'time_unit' => 'Working Days',
            'time_str' => '1–2 Working Days',
            'docs' => ['PAN Card of Entity / Individual', 'Bank Certificate or Cancelled Cheque with preprinted entity name', 'Address Proof of Business Premises', 'Aadhaar / DSC of Authorized Signatory'],
            'notes' => 'Statutory DGFT application fee of ₹500 paid online. Lifetime validity.'
        ],
        [
            'code' => 'BIZ-012',
            'name' => 'Digital Signature Certificate (DSC) Assistance',
            'slug' => 'digital-signature-certificate-dsc-assistance',
            'cat_slug' => 'business-registration-services',
            'subcat_slug' => 'iec-dsc-services',
            'icon' => 'bi-key-fill',
            'short_desc' => 'Class 3 Digital Signature (Signing + Encryption) with 2-year validity and USB Crypto Token.',
            'govt_fee' => 0.00,
            'prof_fee' => 1299.00,
            'other_charges' => 400.00,
            'min_time' => 1,
            'max_time' => 1,
            'time_unit' => 'Working Days',
            'time_str' => '1 Working Day',
            'docs' => ['Applicant PAN Card', 'Aadhaar Card', 'Passport Size Photo', 'Mobile Number & Email for Video Verification'],
            'notes' => 'Includes FIPS-certified USB ePass Auto Crypto Token and courier.'
        ],

        // ==========================================
        // 3. COMPANY / ENTITY REGISTRATION
        // ==========================================
        [
            'code' => 'CMP-001',
            'name' => 'Private Limited Company Registration',
            'slug' => 'private-limited-company-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'corporate-entities-mca',
            'icon' => 'bi-building-fill-check',
            'short_desc' => 'End-to-end MCA incorporation: RUN Name Approval, SPICe+ Part A & B, MOA, AOA, PAN, TAN, EPFO & ESIC.',
            'govt_fee' => 1000.00,
            'prof_fee' => 4999.00,
            'other_charges' => 1000.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => [
                'PAN Card of all Proposed Directors & Shareholders',
                'Aadhaar Card / Passport / Voter ID of all Promoters',
                'Bank Statement / Electricity Bill (< 2 months old) for Director Address Proof',
                'Registered Office Proof (Electricity Bill + NOC + Rent Agreement)',
                'Passport Size Photographs & Specimen Signatures',
                'Digital Signature Certificates (DSC) of Directors'
            ],
            'notes' => 'Zero ROC fee for capital up to ₹15 Lakhs under SPICe+; stamp duty charged as per state.'
        ],
        [
            'code' => 'CMP-002',
            'name' => 'One Person Company Registration',
            'slug' => 'one-person-company-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'corporate-entities-mca',
            'icon' => 'bi-person-workspace',
            'short_desc' => 'Single-founder corporate entity registration with limited liability and corporate legal status.',
            'govt_fee' => 1000.00,
            'prof_fee' => 3999.00,
            'other_charges' => 800.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => [
                'PAN & Aadhaar of Sole Director',
                'PAN & Aadhaar of Nominee Director',
                'Written Consent of Nominee (Form INC-3)',
                'Registered Office Electricity Bill & NOC',
                'Bank Statement of Director & Nominee',
                'Passport Photos & Signatures'
            ],
            'notes' => 'Requires appointment of one nominee director in case of death/incapacity of sole member.'
        ],
        [
            'code' => 'CMP-003',
            'name' => 'LLP Registration',
            'slug' => 'llp-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'partnership-llp',
            'icon' => 'bi-people-fill',
            'short_desc' => 'Limited Liability Partnership incorporation under LLP Act 2008 with customized deed drafting.',
            'govt_fee' => 500.00,
            'prof_fee' => 3499.00,
            'other_charges' => 700.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => [
                'PAN Card of all Designated Partners',
                'Aadhaar Card / Voter ID / Passport of Partners',
                'Bank Statement / Utility Bill of Partners',
                'Office Address Proof (Electricity Bill + NOC + Rent Agreement)',
                'Designated Partners DSC',
                'LLP Agreement Terms & Profit-Sharing Details'
            ],
            'notes' => 'Includes FiLLiP MCA filing, Form 3 LLP Agreement drafting and stamp duty registration.'
        ],
        [
            'code' => 'CMP-004',
            'name' => 'Partnership Firm Registration',
            'slug' => 'partnership-firm-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'partnership-llp',
            'icon' => 'bi-handshake',
            'short_desc' => 'Partnership deed drafting, notary, stamp paper execution and Registrar of Firms (ROF) filing.',
            'govt_fee' => 300.00,
            'prof_fee' => 2499.00,
            'other_charges' => 500.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => [
                'PAN Card of all Partners',
                'Aadhaar Card of all Partners',
                'Business Premises Electricity Bill & Rent Agreement',
                'Partnership Deed Details (Capital, Sharing Ratio, Bank Operations)',
                'Passport Photos of all Partners'
            ],
            'notes' => 'Includes stamp paper advisory as per state stamp duty schedule.'
        ],
        [
            'code' => 'CMP-005',
            'name' => 'Section 8 Company Registration',
            'slug' => 'section-8-company-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'non-profit-trust',
            'icon' => 'bi-heart-pulse-fill',
            'short_desc' => 'Non-Profit Organization (NPO/NGO) incorporation under MCA with Section 8 government licence.',
            'govt_fee' => 2000.00,
            'prof_fee' => 7999.00,
            'other_charges' => 1500.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => [
                'KYC of all Directors & Promoters (PAN, Aadhaar, Bank Statement)',
                'Detailed Objects of the Non-Profit Company',
                '3-Year Projected Financial Statements & Budget Plan',
                'Registered Office Proof (NOC + Electricity Bill)',
                'DSC of Proposed Directors'
            ],
            'notes' => 'Eligible for CSR funding, international grants, and 80G/12A tax exemptions.'
        ],
        [
            'code' => 'CMP-006',
            'name' => 'Nidhi Company Registration',
            'slug' => 'nidhi-company-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'corporate-entities-mca',
            'icon' => 'bi-bank2',
            'short_desc' => 'Mutual benefit non-banking finance company registration under Nidhi Rules 2014.',
            'govt_fee' => 3000.00,
            'prof_fee' => 9999.00,
            'other_charges' => 2000.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => [
                'KYC of Minimum 7 Members & 3 Directors (PAN, Aadhaar, Bank Statement)',
                'Proof of Net Owned Funds (Minimum ₹10 Lakhs paid up capital)',
                'Registered Office Electricity Bill & NOC',
                'Specimen Signatures and DSCs'
            ],
            'notes' => 'Permits accepting deposits and lending only amongst enrolled members.'
        ],
        [
            'code' => 'CMP-007',
            'name' => 'Producer Company Registration',
            'slug' => 'producer-company-registration',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'corporate-entities-mca',
            'icon' => 'bi-tree-fill',
            'short_desc' => 'Farmers / Agricultural Producer Company registration under Part IXA of Companies Act.',
            'govt_fee' => 2000.00,
            'prof_fee' => 8999.00,
            'other_charges' => 1500.00,
            'min_time' => 15,
            'max_time' => 25,
            'time_unit' => 'Working Days',
            'time_str' => '15–25 Working Days',
            'docs' => [
                'Minimum 10 Primary Producers Proof (Kisan Card / Patta / Revenue Record)',
                'KYC of all Directors & Promoters',
                'Registered Office Address Proof',
                'Activities Writeup for Agricultural Value Chain'
            ],
            'notes' => 'Combines goodness of a cooperative society with clarity of a private company.'
        ],
        [
            'code' => 'CMP-008',
            'name' => 'Society Registration Assistance',
            'slug' => 'society-registration-assistance',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'non-profit-trust',
            'icon' => 'bi-people',
            'short_desc' => 'Societies Registration Act 1860 filing with Memorandum of Association (MOA) and bylaws.',
            'govt_fee' => 500.00,
            'prof_fee' => 5999.00,
            'other_charges' => 1000.00,
            'min_time' => 15,
            'max_time' => 20,
            'time_unit' => 'Working Days',
            'time_str' => '15–20 Working Days',
            'docs' => [
                'Memorandum of Association & Rules and Regulations',
                'KYC Documents of Minimum 7 Governing Body Members',
                'Affidavit & NOC from Landlord for Office',
                'Proceedings of First Organizational Meeting'
            ],
            'notes' => 'Filed with District Registrar of Societies as per state jurisdiction.'
        ],
        [
            'code' => 'CMP-009',
            'name' => 'Trust Registration Assistance',
            'slug' => 'trust-registration-assistance',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'non-profit-trust',
            'icon' => 'bi-shield-shaded',
            'short_desc' => 'Public Charitable Trust creation, deed drafting, stamp execution and Sub-Registrar registration.',
            'govt_fee' => 1000.00,
            'prof_fee' => 5999.00,
            'other_charges' => 1500.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => [
                'Trust Deed on Stamp Paper (Drafted by legal experts)',
                'KYC of Settlor, Managing Trustee and Trustees',
                'KYC of 2 Witnesses with Aadhaar',
                'Electricity Bill & NOC of Trust Registered Office',
                'Passport Photos of all Trustees'
            ],
            'notes' => 'Physical presence of Settlor and 2 witnesses required before Sub-Registrar.'
        ],
        [
            'code' => 'CMP-010',
            'name' => 'NGO Registration Assistance',
            'slug' => 'ngo-registration-assistance',
            'cat_slug' => 'company-registration',
            'subcat_slug' => 'non-profit-trust',
            'icon' => 'bi-globe',
            'short_desc' => 'Niti Aayog NGO Darpan portal registration, CSR-1 filing, and 12A/80G preparation.',
            'govt_fee' => 500.00,
            'prof_fee' => 4999.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => [
                'Trust Deed / Society / Section 8 Certificate',
                'PAN Card of NGO Entity',
                'All Board Members PAN & Aadhaar',
                'Activity Report and Bank Account Details'
            ],
            'notes' => 'NGO Darpan ID is mandatory for receiving government grants and central tenders.'
        ],

        // ==========================================
        // 4. TRADEMARK & BUSINESS COMPLIANCE
        // ==========================================
        [
            'code' => 'TM-001',
            'name' => 'Trademark Search',
            'slug' => 'trademark-search',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'intellectual-property',
            'icon' => 'bi-search',
            'short_desc' => 'Comprehensive phonetical & visual IP search across 45 classes on Indian Trademark Registry.',
            'govt_fee' => 0.00,
            'prof_fee' => 499.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 1,
            'time_unit' => 'Working Days',
            'time_str' => '1 Working Day',
            'docs' => ['Proposed Brand Name / Wordmark / Logo', 'Description of Goods and Services sold under the mark'],
            'notes' => 'Includes expert availability report and probability score against conflicting marks.'
        ],
        [
            'code' => 'TM-002',
            'name' => 'Trademark Application',
            'slug' => 'trademark-application',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'intellectual-property',
            'icon' => 'bi-trademark',
            'short_desc' => 'Filing Form TM-A with IP India, class selection, priority claim & instant TM application number.',
            'govt_fee' => 4500.00,
            'prof_fee' => 1999.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 2,
            'time_unit' => 'Working Days',
            'time_str' => '1–2 Working Days',
            'docs' => [
                'Logo / Artwork Image in High Resolution',
                'Udyam / MSME Certificate (for 50% govt fee rebate)',
                'Applicant PAN & Aadhaar Card',
                'User Affidavit & Invoices (if prior use is claimed)',
                'Signed Power of Attorney (Form TM-48)'
            ],
            'notes' => 'Govt fee: ₹4,500 for Individual/MSME; ₹9,000 for Non-MSME Companies.'
        ],
        [
            'code' => 'TM-003',
            'name' => 'Trademark Objection Reply Assistance',
            'slug' => 'trademark-objection-reply-assistance',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'intellectual-property',
            'icon' => 'bi-file-earmark-diff',
            'short_desc' => 'Professional legal drafting of reply to Examination Report for Section 9 & 11 objections.',
            'govt_fee' => 0.00,
            'prof_fee' => 3499.00,
            'other_charges' => 0.00,
            'min_time' => 5,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '5–7 Working Days',
            'docs' => [
                'Copy of Trademark Examination Report',
                'Supporting Invoices / Evidence of Brand Use',
                'Social Media / Website Screenshots proving market distinctiveness',
                'Legal Submissions & Case Laws'
            ],
            'notes' => 'Must be drafted and uploaded within 30 days of examination report issuance.'
        ],
        [
            'code' => 'TM-004',
            'name' => 'Trademark Renewal Assistance',
            'slug' => 'trademark-renewal-assistance',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'intellectual-property',
            'icon' => 'bi-arrow-repeat',
            'short_desc' => 'Form TM-R filing for 10-year renewal of registered trademark on IP India.',
            'govt_fee' => 9000.00,
            'prof_fee' => 1999.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => ['Copy of Trademark Registration Certificate', 'Power of Attorney (Form TM-48)', 'Applicant Identity Proof'],
            'notes' => 'Statutory renewal fee of ₹9,000 per class set by Trade Marks Registry.'
        ],
        [
            'code' => 'TM-005',
            'name' => 'Copyright Registration Assistance',
            'slug' => 'copyright-registration-assistance',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'intellectual-property',
            'icon' => 'bi-c-circle-fill',
            'short_desc' => 'Filing Form XIV for protection of literary, artistic, software code, music, and dramatic works.',
            'govt_fee' => 500.00,
            'prof_fee' => 3999.00,
            'other_charges' => 0.00,
            'min_time' => 20,
            'max_time' => 30,
            'time_unit' => 'Working Days',
            'time_str' => '20–30 Working Days',
            'docs' => [
                '4 Copies of Original Work / Manuscript / Source Code',
                'NOC from Author / Artist / Publisher',
                'Search Certificate (TM-60) from Trademark Registry (for artistic works)',
                'Applicant KYC'
            ],
            'notes' => 'Provides lifetime copyright protection + 60 years after creator death.'
        ],
        [
            'code' => 'TM-006',
            'name' => 'Startup India Registration Assistance',
            'slug' => 'startup-india-registration-assistance',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'startup-certifications',
            'icon' => 'bi-rocket-takeoff-fill',
            'short_desc' => 'DPIIT Recognition under Startup India Scheme for income tax exemption (80-IAC) and funding.',
            'govt_fee' => 0.00,
            'prof_fee' => 2499.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => [
                'Certificate of Incorporation / Registration',
                'Director / Partner Identity Proofs',
                'Pitch Deck / Brief Note on Innovation, Scalability and Job Creation',
                'Website / Mobile App URL or Product Demo Video'
            ],
            'notes' => 'Zero government fee. Includes self-certification under 9 labour & environmental laws.'
        ],
        [
            'code' => 'TM-007',
            'name' => 'ISO Certification Assistance',
            'slug' => 'iso-certification-assistance',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'startup-certifications',
            'icon' => 'bi-award',
            'short_desc' => 'ISO 9001:2015 Quality Management System certification with IAF/non-IAF accredited audit.',
            'govt_fee' => 0.00,
            'prof_fee' => 3999.00,
            'other_charges' => 0.00,
            'min_time' => 5,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '5–7 Working Days',
            'docs' => [
                'Business Registration Proof (MSME / GST / Incorporation)',
                'Electricity Bill of Premises',
                'Scope of Business / Quality Manual Outline',
                'Copy of Sample Purchase / Sale Invoices'
            ],
            'notes' => 'Valid for 3 years with annual surveillance audit support.'
        ],
        [
            'code' => 'TM-008',
            'name' => 'GEM Registration Assistance',
            'slug' => 'gem-registration-assistance',
            'cat_slug' => 'trademark-business-compliance',
            'subcat_slug' => 'startup-certifications',
            'icon' => 'bi-cart-check-fill',
            'short_desc' => 'Government e-Marketplace (GeM) seller / service provider onboarding and catalog upload.',
            'govt_fee' => 0.00,
            'prof_fee' => 1999.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => [
                'Aadhaar Number linked to authorized person',
                'PAN Card of Business Entity',
                'Udyam Registration Certificate',
                'Bank Account Details & Cancelled Cheque',
                'Class 3 Digital Signature (DSC)'
            ],
            'notes' => 'Enables direct participation in central and state government procurement tenders.'
        ],

        // ==========================================
        // 5. TAX & COMPLIANCE SERVICES
        // ==========================================
        [
            'code' => 'TAX-001',
            'name' => 'GST Return Filing',
            'slug' => 'gst-return-filing',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'tax-returns',
            'icon' => 'bi-file-earmark-ruled',
            'short_desc' => 'Monthly / Quarterly GSTR-1, GSTR-3B reconciliation, input tax credit match with GSTR-2B.',
            'govt_fee' => 0.00,
            'prof_fee' => 999.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => [
                'Sales Invoices / Summary for the Period',
                'Purchase Invoices & Debit/Credit Notes',
                'Bank Statement showing tax payments',
                'GST Portal Login Credentials'
            ],
            'notes' => 'Late filing attracts ₹50/day penalty under GST law.'
        ],
        [
            'code' => 'TAX-002',
            'name' => 'Income Tax Return Filing',
            'slug' => 'income-tax-return-filing',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'tax-returns',
            'icon' => 'bi-cash-coin',
            'short_desc' => 'ITR-1 (Sahaj), ITR-2, ITR-3 or ITR-4 (Sugam) computation and e-filing with AIS/TIS match.',
            'govt_fee' => 0.00,
            'prof_fee' => 1199.00,
            'other_charges' => 0.00,
            'min_time' => 2,
            'max_time' => 3,
            'time_unit' => 'Working Days',
            'time_str' => '2–3 Working Days',
            'docs' => [
                'Form 16 / 16A from Employers / Banks',
                'Bank Statements for entire financial year',
                'PAN & Aadhaar Card',
                'Investment Proofs (LIC, PPF, Mutual Funds, Mediclaim under 80C/80D)',
                'Capital Gains Statements (if any stock/crypto/property sold)'
            ],
            'notes' => 'Includes tax optimization consultation and e-verification through Aadhaar OTP.'
        ],
        [
            'code' => 'TAX-003',
            'name' => 'TDS Return Filing',
            'slug' => 'tds-return-filing',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'tax-returns',
            'icon' => 'bi-receipt',
            'short_desc' => 'Quarterly TDS return preparation (Form 24Q for salary, 26Q for vendor payments) and Form 16 generation.',
            'govt_fee' => 0.00,
            'prof_fee' => 1499.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => [
                'Tax Deduction and Collection Account Number (TAN)',
                'BSR Code, Challan Serial Numbers and Tax Deposit Proofs',
                'Deductee Wise Breakup with PAN and Payment Section (194C, 194J, 194I, etc.)',
                'TRACES Portal Credentials'
            ],
            'notes' => 'Late filing fee is ₹200/day under section 234E.'
        ],
        [
            'code' => 'TAX-004',
            'name' => 'Company Annual Filing',
            'slug' => 'company-annual-filing',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-clipboard-data-fill',
            'short_desc' => 'Annual ROC compliance filing of Financial Statements (AOC-4) and Annual Return (MGT-7/7A).',
            'govt_fee' => 600.00,
            'prof_fee' => 4999.00,
            'other_charges' => 0.00,
            'min_time' => 7,
            'max_time' => 10,
            'time_unit' => 'Working Days',
            'time_str' => '7–10 Working Days',
            'docs' => [
                'Audited Balance Sheet & Profit & Loss Account with Notes',
                'Auditor Report & Directors Report',
                'Notice of Annual General Meeting (AGM)',
                'List of Shareholders & Share Transfers during the year',
                'Class 3 DSC of Director and Practicing Professional'
            ],
            'notes' => 'Statutory late filing fee is ₹100 per day per form under MCA rules.'
        ],
        [
            'code' => 'TAX-005',
            'name' => 'ROC Filing Assistance',
            'slug' => 'roc-filing-assistance',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-file-earmark-check',
            'short_desc' => 'Event-based MCA e-form filings (DPT-3 deposits, MSME-1, INC-20A Commencement of Business).',
            'govt_fee' => 400.00,
            'prof_fee' => 2499.00,
            'other_charges' => 0.00,
            'min_time' => 3,
            'max_time' => 5,
            'time_unit' => 'Working Days',
            'time_str' => '3–5 Working Days',
            'docs' => [
                'Board Resolution approving the specific filing',
                'Supporting Auditor Certificate / Ledger Statement',
                'DSC of Authorized Director'
            ],
            'notes' => 'Statutory MCA filing fee calculated as per company authorized capital.'
        ],
        [
            'code' => 'TAX-006',
            'name' => 'DIN KYC Assistance',
            'slug' => 'din-kyc-assistance',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-person-check-fill',
            'short_desc' => 'Annual Director Identification Number e-KYC (DIR-3 KYC Web / e-Form) compliance.',
            'govt_fee' => 0.00,
            'prof_fee' => 499.00,
            'other_charges' => 0.00,
            'min_time' => 1,
            'max_time' => 1,
            'time_unit' => 'Working Days',
            'time_str' => '1 Working Day',
            'docs' => [
                'Director Identification Number (DIN)',
                'PAN Card Copy',
                'Aadhaar Card Copy',
                'Personal Mobile Number & Email for OTP Verification',
                'Passport (mandatory for foreign nationals/NRIs)'
            ],
            'notes' => 'Zero government fee before 30th September; ₹5,000 late fee thereafter.'
        ],
        [
            'code' => 'TAX-007',
            'name' => 'Director Addition/Removal Assistance',
            'slug' => 'director-addition-removal-assistance',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-person-plus-fill',
            'short_desc' => 'Appointment of new director or resignation/removal of existing director via Form DIR-12.',
            'govt_fee' => 300.00,
            'prof_fee' => 2499.00,
            'other_charges' => 0.00,
            'min_time' => 5,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '5–7 Working Days',
            'docs' => [
                'Consent Letter to act as Director (DIR-2)',
                'Declaration of Non-Disqualification (DIR-8)',
                'Resignation Letter (DIR-11) if removing director',
                'Board Resolution & EGM Resolution',
                'KYC Documents of Appointee with DSC'
            ],
            'notes' => 'Form DIR-12 must be filed within 30 days of the appointment/resignation date.'
        ],
        [
            'code' => 'TAX-008',
            'name' => 'Company Address Change Assistance',
            'slug' => 'company-address-change-assistance',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-geo-alt',
            'short_desc' => 'Shifting of registered office within city or across ROC/State via Form INC-22 / INC-23.',
            'govt_fee' => 300.00,
            'prof_fee' => 2999.00,
            'other_charges' => 0.00,
            'min_time' => 5,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '5–7 Working Days',
            'docs' => [
                'Proof of New Registered Office (Rent Agreement + Electricity Bill + NOC)',
                'Board Resolution authorizing registered office shifting',
                'Photographs of Office premises showing outside nameboard',
                'DSC of Director'
            ],
            'notes' => 'Inter-state shifting also requires Regional Director (RD) approval.'
        ],
        [
            'code' => 'TAX-009',
            'name' => 'Company Name Change Assistance',
            'slug' => 'company-name-change-assistance',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-tag-fill',
            'short_desc' => 'MCA RUN name reservation, altered MOA/AOA, Special Resolution & Form INC-24 filing.',
            'govt_fee' => 1000.00,
            'prof_fee' => 5999.00,
            'other_charges' => 0.00,
            'min_time' => 10,
            'max_time' => 15,
            'time_unit' => 'Working Days',
            'time_str' => '10–15 Working Days',
            'docs' => [
                'List of 2 Proposed New Names with meaning and justification',
                'Extraordinary General Meeting (EGM) Special Resolution',
                'Altered Memorandum & Articles of Association (MOA & AOA)',
                'Central Government Approval Form INC-24'
            ],
            'notes' => 'New Certificate of Incorporation is issued by the Registrar of Companies.'
        ],
        [
            'code' => 'TAX-010',
            'name' => 'LLP Annual Filing',
            'slug' => 'llp-annual-filing',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'roc-compliance-filings',
            'icon' => 'bi-file-earmark-zip',
            'short_desc' => 'Mandatory annual filing of Form 11 (Annual Return) and Form 8 (Statement of Accounts & Solvency).',
            'govt_fee' => 100.00,
            'prof_fee' => 2999.00,
            'other_charges' => 0.00,
            'min_time' => 5,
            'max_time' => 7,
            'time_unit' => 'Working Days',
            'time_str' => '5–7 Working Days',
            'docs' => [
                'Statement of Assets and Liabilities (Form 8)',
                'Summary of Partners and Capital Contributions (Form 11)',
                'Class 3 DSC of Designated Partners',
                'LLP Portal Credentials'
            ],
            'notes' => 'Late filing penalty is ₹100 per day under Section 69 of the LLP Act.'
        ],
        [
            'code' => 'TAX-011',
            'name' => 'Accounting & Bookkeeping Service',
            'slug' => 'accounting-bookkeeping-service',
            'cat_slug' => 'tax-compliance-services',
            'subcat_slug' => 'bookkeeping-accounts',
            'icon' => 'bi-journal-text',
            'short_desc' => 'Cloud accounting in Tally / Zoho Books: bank reconciliation, ledger posting & P&L statements.',
            'govt_fee' => 0.00,
            'prof_fee' => 3499.00,
            'other_charges' => 0.00,
            'min_time' => 30,
            'max_time' => 30,
            'time_unit' => 'Days',
            'time_str' => 'Monthly Ongoing',
            'docs' => [
                'Bank Statements of all business accounts in Excel/PDF',
                'Sales & Purchase Invoices for the month',
                'Expense bills, petty cash vouchers and loan statements',
                'Access to accounting software or remote ledger'
            ],
            'notes' => 'Pricing depends on transaction volume and monthly invoice count.'
        ]
    ];

    $order = 1;
    foreach ($services_catalog as $srv) {
        $cat_id = $cat_map[$srv['cat_slug']] ?? 1;
        $subcat_id = $subcat_map[$srv['subcat_slug']] ?? null;

        $gst_rate = 18.00;
        $taxable = $srv['prof_fee'] + $srv['other_charges'];
        $gst_amt = ($taxable * $gst_rate) / 100;
        $final_price = $srv['govt_fee'] + $taxable + $gst_amt;

        $stmt = $pdo->prepare("SELECT id FROM services WHERE slug = ? OR service_code = ?");
        $stmt->execute([$srv['slug'], $srv['code']]);
        $existing = $stmt->fetch();

        if ($existing) {
            $srv_id = $existing['id'];
            $upd = $pdo->prepare("
                UPDATE services SET
                    category_id = ?,
                    subcategory_id = ?,
                    service_code = ?,
                    name = ?,
                    short_description = ?,
                    icon = ?,
                    govt_fee = ?,
                    prof_fee = ?,
                    other_charges = ?,
                    gst_rate = ?,
                    is_gst_applicable = 1,
                    final_price = ?,
                    is_discount_allowed = 1,
                    processing_time = ?,
                    expected_completion_time = ?,
                    min_time = ?,
                    max_time = ?,
                    time_unit = ?,
                    terms = ?,
                    display_order = ?,
                    status = 'active'
                WHERE id = ?
            ");
            $upd->execute([
                $cat_id, $subcat_id, $srv['code'], $srv['name'], $srv['short_desc'], $srv['icon'],
                $srv['govt_fee'], $srv['prof_fee'], $srv['other_charges'], $gst_rate,
                $final_price, $srv['time_str'], $srv['time_str'], $srv['min_time'], $srv['max_time'], $srv['time_unit'],
                $srv['notes'], $order, $srv_id
            ]);
        } else {
            $ins = $pdo->prepare("
                INSERT INTO services (
                    category_id, subcategory_id, service_code, name, slug, short_description, description,
                    icon, govt_fee, prof_fee, other_charges, gst_rate, is_gst_applicable, final_price,
                    is_discount_allowed, processing_time, expected_completion_time, min_time, max_time, time_unit,
                    terms, display_order, status
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, 1, ?,
                    1, ?, ?, ?, ?, ?,
                    ?, ?, 'active'
                )
            ");
            $ins->execute([
                $cat_id, $subcat_id, $srv['code'], $srv['name'], $srv['slug'], $srv['short_desc'], $srv['short_desc'],
                $srv['icon'], $srv['govt_fee'], $srv['prof_fee'], $srv['other_charges'], $gst_rate, $final_price,
                $srv['time_str'], $srv['time_str'], $srv['min_time'], $srv['max_time'], $srv['time_unit'],
                $srv['notes'], $order
            ]);
            $srv_id = $pdo->lastInsertId();
        }

        // Sync Required Documents into service_required_documents
        $pdo->prepare("DELETE FROM service_required_documents WHERE service_id = ?")->execute([$srv_id]);
        $doc_order = 1;
        foreach ($srv['docs'] as $doc_name) {
            $pdo->prepare("
                INSERT INTO service_required_documents (service_id, document_name, is_mandatory, sort_order)
                VALUES (?, ?, 1, ?)
            ")->execute([$srv_id, $doc_name, $doc_order]);
            $doc_order++;
        }

        $order++;
    }

    return true;
}
