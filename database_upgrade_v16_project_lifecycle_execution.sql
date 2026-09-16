-- ============================================================================
-- DIGITAL UDYOG SEVA (DUS) CRM DATABASE UPGRADE - V16
-- MODULE: 10-STAGE PROJECT LIFECYCLE, DEPARTMENT OBJECTIONS, BANK LIAISON,
--         SUBSIDY COUNTDOWN, AND IN-HOUSE VS OUTSOURCED VENDOR TRACKING
-- ============================================================================

-- 1. Upgrade Projects Master Table with Lifecycle & Routing Flags
ALTER TABLE `projects`
  ADD COLUMN IF NOT EXISTS `service_stream` ENUM('Govt_Scheme_Loan', 'Fast_Compliance', 'DPR_Financial') DEFAULT 'Govt_Scheme_Loan' AFTER `serviceCategory`,
  ADD COLUMN IF NOT EXISTS `execution_mode` ENUM('In_House', 'Outsourced') DEFAULT 'In_House' AFTER `service_stream`,
  ADD COLUMN IF NOT EXISTS `lifecycle_stage` ENUM(
    'Lead_Consult',
    'Eligibility_Agreement',
    'Support_Collection',
    'Operations_QA',
    'Dept_Portal',
    'Dept_Query',
    'DLFC_Interview',
    'Bank_Branch_Liaison',
    'Bank_Sanctioned',
    'Subsidy_Claim'
  ) DEFAULT 'Support_Collection' AFTER `execution_mode`,
  ADD COLUMN IF NOT EXISTS `legal_agreement_signed` TINYINT(1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `legal_agreement_no` VARCHAR(64) NULL,
  ADD COLUMN IF NOT EXISTS `legal_agreement_date` DATE NULL,
  ADD COLUMN IF NOT EXISTS `consulting_fee` DECIMAL(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS `qa_status` ENUM('In_Support_Collection', 'Bounced_To_Support', 'Approved_For_Submission') DEFAULT 'In_Support_Collection',
  ADD COLUMN IF NOT EXISTS `qa_bounced_reason` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `qa_bounced_at` DATETIME NULL;

-- 2. Table: Department Queries & Objections (DIC, KVIC, KVIB, Collector, AHD)
CREATE TABLE IF NOT EXISTS `project_department_queries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(64) NOT NULL,
  `raised_by_department` VARCHAR(128) NOT NULL COMMENT 'e.g. DIC GM Scrutiny Desk, KVIC, District Collector Committee, AHD',
  `query_notice_date` DATE NOT NULL,
  `objection_text` TEXT NOT NULL,
  `reply_text` TEXT NULL,
  `reply_submitted_date` DATE NULL,
  `reply_document_path` VARCHAR(255) NULL,
  `status` ENUM('Action_Required', 'Drafted', 'Submitted_On_Portal', 'Resolved_Accepted') DEFAULT 'Action_Required',
  `client_notified_whatsapp` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_proj_query` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: Bank Branch Liaison & Document Revisions
CREATE TABLE IF NOT EXISTS `project_bank_liaisons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(64) NOT NULL UNIQUE,
  `bank_name` VARCHAR(128) NOT NULL COMMENT 'e.g. State Bank of India, PNB, Bank of Baroda',
  `branch_name` VARCHAR(128) NOT NULL,
  `branch_manager_name` VARCHAR(128) NULL,
  `branch_manager_phone` VARCHAR(32) NULL,
  `file_received_date` DATE NULL,
  `scrutiny_status` VARCHAR(128) DEFAULT 'Under Appraisal',
  `cma_revision_required` TINYINT(1) DEFAULT 0,
  `cma_revision_notes` TEXT NULL,
  `bank_query_letter` TEXT NULL,
  `sanction_status` ENUM('Under_Appraisal', 'Sanctioned', 'Rejected') DEFAULT 'Under_Appraisal',
  `sanction_amount` DECIMAL(15,2) DEFAULT 0.00,
  `sanction_letter_url` VARCHAR(255) NULL,
  `rejection_reason` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_proj_bank` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table: Subsidy Claim Tracking & Target Countdown
CREATE TABLE IF NOT EXISTS `project_subsidy_claims` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(64) NOT NULL UNIQUE,
  `scheme_name` VARCHAR(128) NOT NULL COMMENT 'e.g. PMEGP 35% Subsidy, MLUPY 8% Subvention',
  `expected_subsidy_amount` DECIMAL(15,2) NOT NULL,
  `target_days_to_claim` INT DEFAULT 30,
  `claim_deadline_date` DATE NULL,
  `claim_portal_name` VARCHAR(128) NOT NULL,
  `claim_portal_app_id` VARCHAR(64) NULL,
  `tdr_account_number` VARCHAR(64) NULL COMMENT 'Term Deposit Receipt / Subsidy Reserve Fund',
  `claim_status` ENUM(
    'Awaiting_1st_Disbursal',
    'Claim_Filed_By_Bank',
    'Inspection_Pending',
    'TDR_Locked_In_Bank',
    'Subsidy_Disbursed'
  ) DEFAULT 'Awaiting_1st_Disbursal',
  `last_followup_note` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_proj_subsidy` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table: External Outsource Vendor Tracking (बाहरी पार्टी / आउटसोर्सिंग)
CREATE TABLE IF NOT EXISTS `project_outsource_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(64) NOT NULL,
  `vendor_firm_name` VARCHAR(150) NOT NULL COMMENT 'e.g. Shree Shyam Legal, Green Enviro Associates',
  `contact_person` VARCHAR(100) NULL,
  `phone` VARCHAR(32) NOT NULL,
  `agreed_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `paid_status` ENUM('Pending', 'Partial', 'Paid') DEFAULT 'Pending',
  `amount_paid` DECIMAL(12,2) DEFAULT 0.00,
  `handover_date` DATE NOT NULL,
  `delivery_due_date` DATE NOT NULL,
  `vendor_current_status` VARCHAR(255) NULL,
  `deliverable_file_url` VARCHAR(255) NULL,
  `deliverable_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_proj_outsource` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
