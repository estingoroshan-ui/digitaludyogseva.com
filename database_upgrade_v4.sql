-- Digital Udyog Seva - Franchise Business Portal 10X Migration (v4.0)
-- 14-Category Service Master Seed & Table Enhancements

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Seed 14 Service Categories in `service_categories`
INSERT IGNORE INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `sort_order`, `status`) VALUES
(1, 'GST & Tax Services', 'gst-tax-services', 'bi-file-earmark-text', 'GST Registration, Returns, LUT, Notice Reply & Tax Filings', 1, 'active'),
(2, 'Business Registration', 'business-registration', 'bi-building', 'Proprietorship, Partnership, Private Limited, OPC & LLP Setup', 2, 'active'),
(3, 'MSME & Licenses', 'msme-licenses', 'bi-patch-check', 'Udyam Registration, Update, Verification & MSME Support', 3, 'active'),
(4, 'Food Licenses (FSSAI)', 'food-licenses-fssai', 'bi-cup-hot', 'FSSAI Basic, State & Central Licenses, Renewals & Modifications', 4, 'active'),
(5, 'Income Tax (ITR)', 'income-tax-itr', 'bi-calculator', 'Individual, Salaried, Business, Partnership, Capital Gain & TDS Filings', 5, 'active'),
(6, 'Company Compliance', 'company-compliance', 'bi-shield-check', 'ROC Annual Filing, Director KYC, DIN, DSC & Office Changes', 6, 'active'),
(7, 'Trademark & IP', 'trademark-ip', 'bi-award', 'Trademark Search, Application, Objection Reply & Copyright', 7, 'active'),
(8, 'Digital Certificates', 'digital-certificates', 'bi-fingerprint', 'Digital Signature (DSC), PAN, TAN & Import Export Code (IEC)', 8, 'active'),
(9, 'Labour & Employment', 'labour-employment', 'bi-people', 'EPFO, ESIC, Labour License & Professional Tax Setup', 9, 'active'),
(10, 'Local Licenses', 'local-licenses', 'bi-geo-alt', 'Shop & Establishment, Trade License, Local Municipal Licenses', 10, 'active'),
(11, 'Loan & Finance', 'loan-finance', 'bi-bank', 'Government Loan Consultation, Mudra, PMEGP & Bank File Setup', 11, 'active'),
(12, 'Project Reports', 'project-reports', 'bi-journal-richtext', 'Bank Project Reports, Detailed Project Reports (DPR) & CMA Data', 12, 'active'),
(13, 'Document Services', 'document-services', 'bi-file-earmark-code', 'Rent Agreements, Deeds, Affidavits & Resolutions Drafting', 13, 'active'),
(14, 'Other Business Services', 'other-business-services', 'bi-gear-wide-connected', 'Custom Business Services & Special Consultancy', 14, 'active');

-- 2. Seed 25+ Representative Services across 14 Categories in `services`
INSERT IGNORE INTO `services` 
  (`id`, `category_id`, `name`, `slug`, `short_description`, `govt_fee`, `prof_fee`, `gst_rate`, `final_price`, `franchise_price`, `franchise_commission_type`, `franchise_commission_value`, `processing_time`, `required_docs`, `status`) 
VALUES
(1, 3, 'Udyam Registration Assistance', 'udyam-registration-assistance', 'Official Udyam MSME Registration Professional Assistance Service', 0.00, 677.12, 18.00, 799.00, 599.00, 'fixed', 200.00, '1-2 Business Days', 'PAN Card, Aadhaar Card, Bank Account Details', 'active'),
(2, 1, 'GST Registration Assistance', 'gst-registration-assistance', 'New GST Registration for Proprietorship, Partnership & Companies', 0.00, 1270.34, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Business Days', 'PAN Card, Aadhaar Card, Passport Photo, Electricity Bill / Rent Agreement', 'active'),
(3, 1, 'GST Amendment', 'gst-amendment', 'Amendment in Core or Non-Core GST Details', 0.00, 846.61, 18.00, 999.00, 749.00, 'fixed', 250.00, '2-3 Business Days', 'GST Portal Login, Supporting Proofs', 'active'),
(4, 1, 'GST Cancellation', 'gst-cancellation', 'Official Cancellation of GSTIN Registration', 0.00, 1270.34, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Business Days', 'GST Portal Credentials, Reason Proof', 'active'),
(5, 5, 'Individual Basic ITR Filing', 'individual-basic-itr-filing', 'ITR-1 / ITR-2 Filing for Salaried and Individual Taxpayers', 0.00, 677.12, 18.00, 799.00, 599.00, 'fixed', 200.00, '1-2 Business Days', 'Form 16, PAN Card, Aadhaar Card, Bank Statement', 'active'),
(6, 5, 'Business ITR Filing', 'business-itr-filing', 'ITR-3 / ITR-4 Filing for Small Businesses & Professionals', 0.00, 1694.07, 18.00, 1999.00, 1599.00, 'fixed', 400.00, '2-4 Business Days', 'Profit & Loss Statement, Balance Sheet, PAN, Bank Statement', 'active'),
(7, 5, 'TDS Return Filing', 'tds-return-filing', 'Quarterly TDS Return Filing Assistance', 0.00, 1270.34, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '2-3 Business Days', 'TDS Deductor Credentials, Payment Challans', 'active'),
(8, 4, 'FSSAI Basic Registration', 'fssai-basic-registration', 'FSSAI Food Registration for Petty Food Businesses', 100.00, 1185.59, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Business Days', 'Passport Photo, Photo ID Proof, Address Proof', 'active'),
(9, 4, 'FSSAI State License Professional Fee', 'fssai-state-license-professional-fee', 'FSSAI State Food License Processing Assistance', 2000.00, 2117.80, 18.00, 4499.00, 3999.00, 'fixed', 500.00, '7-10 Business Days', 'Premises Proof, Layout Plan, Water Report, Photo ID', 'active'),
(10, 10, 'Shop & Establishment Assistance', 'shop-establishment-assistance', 'Shop Act / Gumasta Registration Professional Assistance', 100.00, 1185.59, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Business Days', 'Photo, Aadhaar, PAN, Utility Bill', 'active'),
(11, 2, 'Proprietorship Setup Assistance', 'proprietorship-setup-assistance', 'Proprietorship Firm Setup (Udyam + GST + Shop Act Setup)', 0.00, 1270.34, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Business Days', 'PAN, Aadhaar, Photo, Utility Bill', 'active'),
(12, 2, 'Partnership Firm Documentation', 'partnership-firm-documentation', 'Partnership Deed Drafting & Firm Registration Assistance', 500.00, 2117.80, 18.00, 2999.00, 2399.00, 'fixed', 600.00, '5-7 Business Days', 'Partners PAN & Aadhaar, Address Proof, Stamp Paper Details', 'active'),
(13, 2, 'Private Limited Company Professional Fee', 'private-limited-company-professional-fee', 'Pvt Ltd Incorporation Professional Assistance (RUN + SPICe+)', 2000.00, 4236.44, 18.00, 6999.00, 5799.00, 'fixed', 1200.00, '7-12 Business Days', 'Directors PAN, Aadhaar, DSC, Utility Bill, Office Premises NOC', 'active'),
(14, 8, 'Digital Signature (DSC Class 3)', 'digital-signature-dsc-class-3', 'Class 3 Digital Signature Certificate with USB Token (2 Years)', 0.00, 1270.34, 18.00, 1499.00, 1249.00, 'fixed', 250.00, '1 Business Day', 'PAN Card, Aadhaar Card, Passport Photo, Mobile & Video Verification', 'active'),
(15, 8, 'Import Export Code (IEC) Assistance', 'iec-assistance', 'DGFT Import Export Code Application Professional Assistance', 500.00, 846.61, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '2-4 Business Days', 'PAN Card, Cancelled Cheque, Address Proof', 'active'),
(16, 7, 'Trademark Application Professional Fee', 'trademark-application-professional-fee', 'Trademark Filing (Form TM-A) Professional Assistance', 4500.00, 2117.80, 18.00, 6999.00, 6399.00, 'fixed', 600.00, '3-5 Business Days', 'Logo / Brand Name, Applicant ID, User Affidavit', 'active'),
(17, 12, 'Basic Project Report', 'basic-project-report', 'Project Report for Bank Loan (PMEGP / MUDRA / MLUPY)', 0.00, 1694.07, 18.00, 1999.00, 1499.00, 'fixed', 500.00, '2-3 Business Days', 'Business Concept Details, Project Cost Estimate', 'active'),
(18, 12, 'Detailed Project Report (DPR) & CMA', 'detailed-project-report-dpr-cma', 'Detailed Bank Project Report with 5-Year CMA Financial Data', 0.00, 4236.44, 18.00, 4999.00, 3999.00, 'fixed', 1000.00, '3-5 Business Days', 'Financial Statements, Quotations, Bank Requirement Format', 'active'),
(19, 11, 'Business Loan Eligibility Consultation', 'business-loan-eligibility-consultation', 'Advisory Loan Eligibility & Scorecard Assessment', 0.00, 422.88, 18.00, 499.00, 349.00, 'fixed', 150.00, 'Instant / 1 Day', 'Applicant Financial Details, CIBIL Tier, Business Vintage', 'active'),
(20, 11, 'Business Loan Bank File Preparation', 'business-loan-bank-file-preparation', 'Complete Business Loan Application File Preparation & Sanction Consultancy', 0.00, 4236.44, 18.00, 4999.00, 3999.00, 'fixed', 1000.00, '5-7 Business Days', 'KYC, Financials, ITR, Bank Statements, Project Report', 'active');

-- 3. Create Support Tickets table
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `ticket_code` VARCHAR(50) NOT NULL,
  `franchise_id` INT(11) NULL,
  `customer_id` INT(11) NULL,
  `user_id` INT(11) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `status` ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Create Training Center table
CREATE TABLE IF NOT EXISTS `training_materials` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `video_url` VARCHAR(255) NULL,
  `pdf_file` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial training videos
INSERT IGNORE INTO `training_materials` (`id`, `title`, `category`, `description`, `video_url`) VALUES
(1, 'How to Add Customers & 360 Profile', 'Customer Management', 'Step-by-step video guide on adding new customers and managing customer 360 profiles.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
(2, 'Submitting 5-Step Service Applications', 'Service Wizard', 'Learn how to select services, upload document checklists, and record payments.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
(3, 'Understanding Franchise Commission & Ledger', 'Finance & Wallet', 'Detailed guide on commission approval, 5% TDS deduction, and payout withdrawals.', 'https://www.youtube.com/embed/dQw4w9WgXcQ');

SET FOREIGN_KEY_CHECKS = 1;
