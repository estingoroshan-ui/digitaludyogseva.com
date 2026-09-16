-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V15
-- CUSTOMER 360° MASTER ECOSYSTEM & ENTERPRISE LEDGER ENGINE
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Customer Detailed Profile & RM Allocation
CREATE TABLE IF NOT EXISTS `customer_master_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) UNIQUE NOT NULL,
  `company_name` VARCHAR(200) NOT NULL,
  `trade_name` VARCHAR(150) DEFAULT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `contact_mobile` VARCHAR(20) NOT NULL,
  `contact_email` VARCHAR(150) DEFAULT NULL,
  `personal_resident_address` TEXT NOT NULL,
  `business_registered_address` TEXT NOT NULL,
  `gstin` VARCHAR(30) DEFAULT NULL,
  `pan_number` VARCHAR(20) DEFAULT NULL,
  `cin_llpin` VARCHAR(50) DEFAULT NULL,
  `assigned_rm_name` VARCHAR(150) NOT NULL DEFAULT 'CA Rajesh Verma',
  `assigned_rm_cabin` VARCHAR(100) DEFAULT 'Cabin #02 (Legal & CA/CS Desk)',
  `assigned_rm_phone` VARCHAR(20) DEFAULT '+91 98290 12345',
  `assigned_date` DATE DEFAULT NULL,
  `assigned_by_user` VARCHAR(100) DEFAULT 'Admin Superuser',
  `account_health_score` INT DEFAULT 95,
  `client_tier` ENUM('Standard', 'Gold', 'Platinum_Corporate', 'Diamond_Tech') DEFAULT 'Platinum_Corporate',
  `lifetime_billed_value` DECIMAL(12,2) DEFAULT 0.00,
  `current_outstanding_balance` DECIMAL(12,2) DEFAULT 0.00,
  `kyc_status` ENUM('Verified', 'Pending', 'Rejected') DEFAULT 'Verified',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Customer Internal Notes & Voice-to-CRM Memos
CREATE TABLE IF NOT EXISTS `customer_internal_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_role` VARCHAR(100) DEFAULT 'Relationship Manager',
  `note_text` TEXT NOT NULL,
  `has_audio_memo` TINYINT(1) DEFAULT 0,
  `audio_url` VARCHAR(255) DEFAULT NULL,
  `audio_duration` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Customer Folder-Wise Document Vault
CREATE TABLE IF NOT EXISTS `customer_document_vault` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `folder_category` ENUM('KYC_Registrations', 'Financials_Tax', 'Project_DPR', 'Banking_Sanctions', 'Invoices_Receipts') NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(50) DEFAULT '2.4 MB',
  `is_verified` TINYINT(1) DEFAULT 1,
  `verified_by` VARCHAR(150) DEFAULT 'CA Rajesh Verma',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Customer Statement of Account (Ledger)
CREATE TABLE IF NOT EXISTS `customer_statement_ledger` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `txn_date` DATE NOT NULL,
  `particulars` VARCHAR(255) NOT NULL,
  `reference_code` VARCHAR(50) DEFAULT NULL,
  `debit_amount` DECIMAL(12,2) DEFAULT 0.00,
  `credit_amount` DECIMAL(12,2) DEFAULT 0.00,
  `running_balance` DECIMAL(12,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Customer Credit & Debit Notes
CREATE TABLE IF NOT EXISTS `customer_credit_debit_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `note_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` VARCHAR(50) NOT NULL,
  `note_type` ENUM('Credit_Note', 'Debit_Note') NOT NULL,
  `invoice_ref` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('Adjusted', 'Billed', 'Cancelled') DEFAULT 'Adjusted',
  `approved_by` VARCHAR(100) DEFAULT 'Admin Superuser',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Customer Advance Payment Receipts
CREATE TABLE IF NOT EXISTS `customer_advance_receipts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `receipt_no` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` VARCHAR(50) NOT NULL,
  `receipt_date` DATE NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_mode` VARCHAR(50) DEFAULT 'HDFC Netbanking',
  `utr_ref` VARCHAR(100) DEFAULT NULL,
  `for_invoice_code` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Customer Out-of-Pocket Expenses
CREATE TABLE IF NOT EXISTS `customer_expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `expense_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` VARCHAR(50) NOT NULL,
  `expense_date` DATE NOT NULL,
  `category` ENUM('Govt_Challan', 'Stamp_Duty', 'Notary', 'Travel', 'Other') DEFAULT 'Govt_Challan',
  `description` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `reimbursable_status` ENUM('Billed_to_Client', 'Paid_by_DUS', 'Pending_Approval') DEFAULT 'Billed_to_Client',
  `logged_by` VARCHAR(100) DEFAULT 'Executive Staff',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Customer Recurring Subscriptions & Retainer Plans
CREATE TABLE IF NOT EXISTS `customer_subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `subscription_name` VARCHAR(200) NOT NULL,
  `billing_cycle` ENUM('Monthly', 'Quarterly', 'Annually') DEFAULT 'Monthly',
  `fee_amount` DECIMAL(10,2) NOT NULL,
  `next_billing_date` DATE NOT NULL,
  `auto_reminder_active` TINYINT(1) DEFAULT 1,
  `status` ENUM('Active', 'Paused', 'Cancelled') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Customer Compliance Reminders
CREATE TABLE IF NOT EXISTS `customer_compliance_reminders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `reminder_title` VARCHAR(255) NOT NULL,
  `due_date` DATE NOT NULL,
  `alert_channels` VARCHAR(100) DEFAULT 'WhatsApp,SMS,Portal',
  `is_resolved` TINYINT(1) DEFAULT 0,
  `created_by` VARCHAR(100) DEFAULT 'System Autopilot',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Security & Access Audit Log ("किसने कब लॉगिन करके क्या देखा")
CREATE TABLE IF NOT EXISTS `customer_security_access_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_role` VARCHAR(100) NOT NULL,
  `action_performed` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
