-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V11 (LOAN CASE MANAGEMENT SYSTEM)
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create Loan Types Master Table
CREATE TABLE IF NOT EXISTS `loan_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Loan Types
INSERT IGNORE INTO `loan_types` (`name`, `code`) VALUES
('Business Loan', 'BL'),
('Personal Loan', 'PL'),
('Home Loan', 'HL'),
('Loan Against Property', 'LAP'),
('Mortgage Loan', 'ML'),
('Working Capital', 'WC'),
('Cash Credit (CC)', 'CC'),
('Overdraft (OD)', 'OD'),
('MSME Loan', 'MSME'),
('Mudra Loan', 'MUDRA'),
('PMEGP Loan', 'PMEGP'),
('Machinery Loan', 'MAC'),
('Vehicle Loan', 'VL'),
('Education Loan', 'EDU'),
('Agriculture Loan', 'AGRI'),
('Government Subsidy Loan', 'GSL'),
('Other Loan', 'OTHER');

-- 2. Create Bank / NBFC Master Table (Lenders)
CREATE TABLE IF NOT EXISTS `lenders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `type` ENUM('Bank', 'NBFC', 'Fintech', 'Cooperative', 'Other') DEFAULT 'Bank',
  `code` VARCHAR(50) DEFAULT NULL,
  `contact_person` VARCHAR(100) DEFAULT NULL,
  `contact_number` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Lenders Master
INSERT IGNORE INTO `lenders` (`name`, `type`, `code`) VALUES
('State Bank of India (SBI)', 'Bank', 'SBI'),
('HDFC Bank', 'Bank', 'HDFC'),
('ICICI Bank', 'Bank', 'ICICI'),
('Axis Bank', 'Bank', 'AXIS'),
('Punjab National Bank (PNB)', 'Bank', 'PNB'),
('Bank of Baroda (BOB)', 'Bank', 'BOB'),
('Kotak Mahindra Bank', 'Bank', 'KOTAK'),
('IndusInd Bank', 'Bank', 'INDUS'),
('Yes Bank', 'Bank', 'YES'),
('IDFC FIRST Bank', 'Bank', 'IDFC'),
('Union Bank of India', 'Bank', 'UNION'),
('Canara Bank', 'Bank', 'CANARA'),
('Bajaj Finance', 'NBFC', 'BAJAJ'),
('Tata Capital', 'NBFC', 'TATA'),
('Aditya Birla Capital', 'NBFC', 'BIRLA'),
('L&T Finance', 'NBFC', 'LTF');

-- 3. Extend Cases Table for Detailed Loan Case Management
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `application_date` DATE NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `alternate_mobile` VARCHAR(20) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `pan_number` VARCHAR(20) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `aadhaar_last_4` VARCHAR(4) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `customer_type` VARCHAR(50) DEFAULT 'Individual';
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `business_name` VARCHAR(255) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `business_type` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `constitution` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `business_start_date` DATE NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `vintage_years` DECIMAL(4,1) DEFAULT 0.0;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `gstin` VARCHAR(20) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `udyam_number` VARCHAR(50) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `industry` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `nature_of_business` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `annual_turnover` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `monthly_sales` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `existing_emi` DECIMAL(12,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `existing_loan_amount` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `existing_bank` VARCHAR(150) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `itr_income` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `cibil_score` INT DEFAULT 0;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `cibil_status` VARCHAR(50) DEFAULT 'Pending';
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `address` TEXT NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `city` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `state` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `pin_code` VARCHAR(20) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `loan_type_id` INT NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `loan_type` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `required_loan_amount` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `loan_purpose` TEXT NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `preferred_bank_id` INT NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `preferred_bank` VARCHAR(150) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `expected_interest_rate` DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `expected_tenure_months` INT DEFAULT 0;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `collateral_required` ENUM('Yes', 'No') DEFAULT 'No';
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `property_available` ENUM('Yes', 'No') DEFAULT 'No';
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `estimated_property_value` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `applicant_contribution` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `expected_emi` DECIMAL(12,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `sanctioned_amount` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `sanction_date` DATE NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `disbursed_amount` DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `disbursement_date` DATE NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `loan_account_number` VARCHAR(100) NULL;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `priority` ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium';
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `next_followup_date` DATETIME NULL;

-- 4. Case Bank Applications Table
CREATE TABLE IF NOT EXISTS `case_bank_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `lender_id` INT NULL,
  `bank_name` VARCHAR(150) NOT NULL,
  `branch` VARCHAR(150) DEFAULT NULL,
  `contact_person` VARCHAR(100) DEFAULT NULL,
  `contact_number` VARCHAR(50) DEFAULT NULL,
  `loan_product` VARCHAR(100) DEFAULT NULL,
  `applied_amount` DECIMAL(15,2) DEFAULT 0.00,
  `application_date` DATE DEFAULT NULL,
  `bank_app_number` VARCHAR(100) DEFAULT NULL,
  `login_id_lan` VARCHAR(100) DEFAULT NULL,
  `current_bank_status` VARCHAR(100) DEFAULT 'Submitted',
  `interest_rate_offered` DECIMAL(5,2) DEFAULT 0.00,
  `tenure_offered` INT DEFAULT 0,
  `processing_fee` DECIMAL(12,2) DEFAULT 0.00,
  `approved_amount` DECIMAL(15,2) DEFAULT 0.00,
  `sanction_date` DATE DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Case Stage Transition History Table (Audit Trail)
CREATE TABLE IF NOT EXISTS `case_stage_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `previous_stage` VARCHAR(100) DEFAULT NULL,
  `new_stage` VARCHAR(100) NOT NULL,
  `changed_by` INT NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Case Multi-Role Staff Assignments Table
CREATE TABLE IF NOT EXISTS `case_staff_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `role_title` VARCHAR(100) NOT NULL,
  `assigned_by` INT DEFAULT NULL,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Case Follow-ups Log Table
CREATE TABLE IF NOT EXISTS `case_followups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `followup_type` VARCHAR(50) DEFAULT 'Call',
  `remarks` TEXT NOT NULL,
  `next_followup_date` DATETIME DEFAULT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
