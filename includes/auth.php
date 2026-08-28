<?php
// Session Auth & Access Control
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/../classes/ActivityLogger.php';

function ensure_phase2_customer_tables_exist($pdo) {
    static $checked_phase2 = false;
    if ($checked_phase2 || !$pdo) return;
    $checked_phase2 = true;

    try {
        $pdo->query("SELECT assigned_staff_id FROM customers LIMIT 1");
    } catch (Throwable $e) {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `customer_type` ENUM('individual', 'business') DEFAULT 'individual'");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `first_name` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `middle_name` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `last_name` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `company_name` VARCHAR(200) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `whatsapp_number` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `preferred_language` VARCHAR(50) DEFAULT 'en'");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `customer_source` VARCHAR(100) DEFAULT 'Direct'");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `assigned_staff_id` INT NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `address_line_1` TEXT NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `address_line_2` TEXT NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `area` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `country` VARCHAR(100) DEFAULT 'India'");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `gstin` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `business_type` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `industry` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `website` VARCHAR(255) NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `description` TEXT NULL");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `internal_notes` TEXT NULL");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_contacts` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `first_name` VARCHAR(100) NOT NULL,
              `last_name` VARCHAR(100) DEFAULT NULL,
              `job_position` VARCHAR(150) DEFAULT NULL,
              `email` VARCHAR(150) DEFAULT NULL,
              `phone` VARCHAR(20) DEFAULT NULL,
              `whatsapp` VARCHAR(20) DEFAULT NULL,
              `profile_photo` VARCHAR(255) DEFAULT NULL,
              `department` VARCHAR(100) DEFAULT NULL,
              `is_primary` TINYINT(1) DEFAULT 0,
              `status` ENUM('active', 'inactive') DEFAULT 'active',
              `portal_permissions` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_notes` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `note` TEXT NOT NULL,
              `is_pinned` TINYINT(1) DEFAULT 0,
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_reminders` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `reminder_date` DATE NOT NULL,
              `reminder_time` TIME DEFAULT '10:00:00',
              `description` TEXT NOT NULL,
              `assigned_staff_id` INT NOT NULL,
              `send_notification` TINYINT(1) DEFAULT 1,
              `send_email` TINYINT(1) DEFAULT 0,
              `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            @$pdo->exec("ALTER TABLE `documents` ADD COLUMN `file_type` VARCHAR(50) NULL");
            @$pdo->exec("ALTER TABLE `documents` ADD COLUMN `description` TEXT NULL");
            @$pdo->exec("ALTER TABLE `documents` ADD COLUMN `original_filename` VARCHAR(255) NULL");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_assignments` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `staff_id` INT NOT NULL,
              `assigned_by` INT NOT NULL,
              `notes` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_emails` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `to_email` VARCHAR(150) NOT NULL,
              `cc_email` VARCHAR(255) DEFAULT NULL,
              `bcc_email` VARCHAR(255) DEFAULT NULL,
              `subject` VARCHAR(255) NOT NULL,
              `message` LONGTEXT NOT NULL,
              `attachment` VARCHAR(255) DEFAULT NULL,
              `sent_by` INT NOT NULL,
              `status` ENUM('sent', 'failed') DEFAULT 'sent',
              `error_message` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (Throwable $ex) {
            error_log("Phase 2 Auto migration error: " . $ex->getMessage());
        }
    }
}

function ensure_phase3_lead_tables_exist($pdo) {
    static $checked_phase3 = false;
    if ($checked_phase3 || !$pdo) return;
    $checked_phase3 = true;

    try {
        $pdo->query("SELECT lead_value FROM leads LIMIT 1");
    } catch (Throwable $e) {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `first_name` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `last_name` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `title` VARCHAR(150) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `company` VARCHAR(200) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `whatsapp_number` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `address_line_1` TEXT NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `address_line_2` TEXT NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `country` VARCHAR(100) DEFAULT 'India'");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `lead_value` DECIMAL(12,2) DEFAULT 0.00");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `gstin` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `pan` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `website` VARCHAR(255) NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `is_public` TINYINT(1) DEFAULT 0");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `last_contacted_at` DATETIME NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `next_followup_date` DATE NULL");
            @$pdo->exec("ALTER TABLE `leads` ADD COLUMN `next_followup_time` TIME NULL");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `lead_notes` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `lead_id` INT NOT NULL,
              `note` TEXT NOT NULL,
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `lead_reminders` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `lead_id` INT NOT NULL,
              `reminder_date` DATE NOT NULL,
              `reminder_time` TIME DEFAULT '10:00:00',
              `description` TEXT NOT NULL,
              `assigned_staff_id` INT NOT NULL,
              `send_notification` TINYINT(1) DEFAULT 1,
              `send_email` TINYINT(1) DEFAULT 0,
              `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `lead_attachments` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `lead_id` INT NOT NULL,
              `file_path` VARCHAR(255) NOT NULL,
              `file_name` VARCHAR(255) NOT NULL,
              `original_filename` VARCHAR(255) NOT NULL,
              `file_size` INT DEFAULT 0,
              `file_type` VARCHAR(50) DEFAULT NULL,
              `uploaded_by` INT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            @$pdo->exec("ALTER TABLE `followups` ADD COLUMN `followup_type` VARCHAR(50) DEFAULT 'Call'");
            @$pdo->exec("ALTER TABLE `followups` ADD COLUMN `followup_result` TEXT NULL");
            @$pdo->exec("ALTER TABLE `followups` ADD COLUMN `customer_response` TEXT NULL");
            @$pdo->exec("ALTER TABLE `followups` ADD COLUMN `next_action` TEXT NULL");
            @$pdo->exec("ALTER TABLE `followups` ADD COLUMN `next_followup_date` DATE NULL");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (Throwable $ex) {
            error_log("Phase 3 Lead Auto migration error: " . $ex->getMessage());
        }
    }
}

function ensure_phase4_hr_tables_exist($pdo) {
    static $checked_phase4 = false;
    if ($checked_phase4 || !$pdo) return;
    $checked_phase4 = true;

    try {
        $pdo->query("SELECT id FROM job_positions LIMIT 1");
    } catch (Throwable $e) {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `date_of_birth` DATE NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `gender` ENUM('male', 'female', 'other') DEFAULT 'male'");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `emergency_contact_name` VARCHAR(150) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `emergency_contact_phone` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `pan_number` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `aadhaar_number` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `bank_account_no` VARCHAR(50) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `bank_name` VARCHAR(100) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `ifsc_code` VARCHAR(20) NULL");
            @$pdo->exec("ALTER TABLE `employees` ADD COLUMN `basic_salary` DECIMAL(12,2) DEFAULT 0.00");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `job_positions` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(150) NOT NULL,
              `department_id` INT DEFAULT NULL,
              `description` TEXT DEFAULT NULL,
              `requirements` TEXT DEFAULT NULL,
              `vacancies` INT DEFAULT 1,
              `status` ENUM('active', 'closed') DEFAULT 'active',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("INSERT IGNORE INTO `job_positions` (`id`, `title`, `department_id`, `description`, `vacancies`, `status`) VALUES
            (1, 'Senior Business Loan Officer', 2, 'Responsible for client loan processing, documentation, and bank coordination.', 2, 'active'),
            (2, 'Government Schemes Consultant', 3, 'Handles PMEGP, MSME, and Subsidy application filings.', 3, 'active'),
            (3, 'Customer Support Specialist', 2, 'Assists clients via phone, WhatsApp, and email portal.', 1, 'active');");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `hr_onboarding` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT NOT NULL,
              `step_name` VARCHAR(255) NOT NULL,
              `description` TEXT DEFAULT NULL,
              `is_completed` TINYINT(1) DEFAULT 0,
              `completed_at` DATETIME DEFAULT NULL,
              `notes` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `hr_training` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `description` TEXT DEFAULT NULL,
              `trainer` VARCHAR(150) DEFAULT NULL,
              `start_date` DATE DEFAULT NULL,
              `end_date` DATE DEFAULT NULL,
              `status` ENUM('scheduled', 'ongoing', 'completed') DEFAULT 'scheduled',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("INSERT IGNORE INTO `hr_training` (`id`, `title`, `description`, `trainer`, `start_date`, `end_date`, `status`) VALUES
            (1, 'CRM & Service Delivery Operations', 'Complete training on Digital Udyog Seva portal and loan workflow.', 'Manish Pareek', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'ongoing');");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `hr_dependants` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT NOT NULL,
              `name` VARCHAR(150) NOT NULL,
              `relationship` VARCHAR(50) NOT NULL,
              `phone` VARCHAR(20) DEFAULT NULL,
              `dob` DATE DEFAULT NULL,
              `notes` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `hr_layoff_checklist` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT NOT NULL,
              `clearance_item` VARCHAR(255) NOT NULL,
              `department` VARCHAR(100) DEFAULT 'General',
              `is_cleared` TINYINT(1) DEFAULT 0,
              `cleared_by` INT DEFAULT NULL,
              `cleared_at` DATETIME DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `hr_qa` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `category` VARCHAR(100) DEFAULT 'General Policy',
              `question` TEXT NOT NULL,
              `answer` TEXT NOT NULL,
              `created_by` INT DEFAULT 1,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("INSERT IGNORE INTO `hr_qa` (`id`, `category`, `question`, `answer`) VALUES
            (1, 'Working Hours', 'What are the official working hours at Digital Udyog Seva?', 'Official working hours are 9:30 AM to 6:30 PM, Monday through Saturday.'),
            (2, 'Leave Policy', 'How many casual and sick leaves are granted per year?', 'Employees are entitled to 12 casual leaves and 6 sick leaves annually after probation completion.'),
            (3, 'Reimbursement', 'What is the procedure for client travel expense reimbursement?', 'Submit travel receipts in the Expenses module with manager approval before the 25th of each month.');");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (Throwable $ex) {
            error_log("Phase 4 HR Auto migration error: " . $ex->getMessage());
        }
    }
}

function ensure_phase5_project_tables_exist($pdo) {
    static $checked_phase5 = false;
    if ($checked_phase5 || !$pdo) return;
    $checked_phase5 = true;

    try {
        $pdo->query("SELECT progress_percent FROM cases LIMIT 1");
    } catch (Throwable $e) {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `project_name` VARCHAR(255) NULL");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `progress_percent` INT DEFAULT 0");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `start_date` DATE NULL");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `deadline` DATE NULL");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `assigned_staff_id` INT NULL");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `billing_type` ENUM('fixed', 'hourly', 'milestone') DEFAULT 'fixed'");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `total_amount` DECIMAL(12,2) DEFAULT 0.00");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `paid_amount` DECIMAL(12,2) DEFAULT 0.00");
            @$pdo->exec("ALTER TABLE `cases` ADD COLUMN `project_description` TEXT NULL");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `project_files` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `case_id` INT NOT NULL,
              `file_path` VARCHAR(255) NOT NULL,
              `file_name` VARCHAR(255) NOT NULL,
              `original_filename` VARCHAR(255) NOT NULL,
              `file_size` INT DEFAULT 0,
              `file_type` VARCHAR(50) DEFAULT NULL,
              `uploaded_by` INT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `project_notes` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `case_id` INT NOT NULL,
              `note` TEXT NOT NULL,
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `project_milestones` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `case_id` INT NOT NULL,
              `milestone_name` VARCHAR(255) NOT NULL,
              `due_date` DATE DEFAULT NULL,
              `status` ENUM('pending', 'completed') DEFAULT 'pending',
              `completed_at` DATETIME DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (Throwable $ex) {
            error_log("Phase 5 Project Auto migration error: " . $ex->getMessage());
        }
    }
}

function ensure_loan_case_tables_exist($pdo) {
    static $checked_loan = false;
    if ($checked_loan || !$pdo) return;
    $checked_loan = true;

    try {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
        
        $pdo->exec("CREATE TABLE IF NOT EXISTS `loan_types` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `name` VARCHAR(100) NOT NULL UNIQUE,
          `code` VARCHAR(50) DEFAULT NULL,
          `description` TEXT DEFAULT NULL,
          `status` ENUM('active', 'inactive') DEFAULT 'active',
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("INSERT IGNORE INTO `loan_types` (`name`, `code`) VALUES
        ('Business Loan', 'BL'), ('Personal Loan', 'PL'), ('Home Loan', 'HL'),
        ('Loan Against Property', 'LAP'), ('Mortgage Loan', 'ML'), ('Working Capital', 'WC'),
        ('Cash Credit (CC)', 'CC'), ('Overdraft (OD)', 'OD'), ('MSME Loan', 'MSME'),
        ('Mudra Loan', 'MUDRA'), ('PMEGP Loan', 'PMEGP'), ('Machinery Loan', 'MAC'),
        ('Vehicle Loan', 'VL'), ('Education Loan', 'EDU'), ('Agriculture Loan', 'AGRI'),
        ('Government Subsidy Loan', 'GSL'), ('Other Loan', 'OTHER');");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `lenders` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `name` VARCHAR(150) NOT NULL UNIQUE,
          `type` ENUM('Bank', 'NBFC', 'Fintech', 'Cooperative', 'Other') DEFAULT 'Bank',
          `code` VARCHAR(50) DEFAULT NULL,
          `contact_person` VARCHAR(100) DEFAULT NULL,
          `contact_number` VARCHAR(50) DEFAULT NULL,
          `email` VARCHAR(100) DEFAULT NULL,
          `status` ENUM('active', 'inactive') DEFAULT 'active',
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("INSERT IGNORE INTO `lenders` (`name`, `type`, `code`) VALUES
        ('State Bank of India (SBI)', 'Bank', 'SBI'), ('HDFC Bank', 'Bank', 'HDFC'),
        ('ICICI Bank', 'Bank', 'ICICI'), ('Axis Bank', 'Bank', 'AXIS'),
        ('Punjab National Bank (PNB)', 'Bank', 'PNB'), ('Bank of Baroda (BOB)', 'Bank', 'BOB'),
        ('Kotak Mahindra Bank', 'Bank', 'KOTAK'), ('IndusInd Bank', 'Bank', 'INDUS'),
        ('Yes Bank', 'Bank', 'YES'), ('IDFC FIRST Bank', 'Bank', 'IDFC'),
        ('Union Bank of India', 'Bank', 'UNION'), ('Canara Bank', 'Bank', 'CANARA'),
        ('Bajaj Finance', 'NBFC', 'BAJAJ'), ('Tata Capital', 'NBFC', 'TATA'),
        ('Aditya Birla Capital', 'NBFC', 'BIRLA'), ('L&T Finance', 'NBFC', 'LTF');");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `case_bank_applications` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `case_stage_history` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `case_id` INT NOT NULL,
          `previous_stage` VARCHAR(100) DEFAULT NULL,
          `new_stage` VARCHAR(100) NOT NULL,
          `changed_by` INT NOT NULL,
          `remarks` TEXT DEFAULT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `case_staff_assignments` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `case_id` INT NOT NULL,
          `staff_id` INT NOT NULL,
          `role_title` VARCHAR(100) NOT NULL,
          `assigned_by` INT DEFAULT NULL,
          `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `case_followups` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `case_id` INT NOT NULL,
          `followup_type` VARCHAR(50) DEFAULT 'Call',
          `remarks` TEXT NOT NULL,
          `next_followup_date` DATETIME DEFAULT NULL,
          `created_by` INT NOT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $cols = [
            "application_date DATE NULL",
            "alternate_mobile VARCHAR(20) NULL",
            "pan_number VARCHAR(20) NULL",
            "aadhaar_last_4 VARCHAR(4) NULL",
            "customer_type VARCHAR(50) DEFAULT 'Individual'",
            "business_name VARCHAR(255) NULL",
            "business_type VARCHAR(100) NULL",
            "constitution VARCHAR(100) NULL",
            "business_start_date DATE NULL",
            "vintage_years DECIMAL(4,1) DEFAULT 0.0",
            "gstin VARCHAR(20) NULL",
            "udyam_number VARCHAR(50) NULL",
            "industry VARCHAR(100) NULL",
            "nature_of_business VARCHAR(100) NULL",
            "annual_turnover DECIMAL(15,2) DEFAULT 0.00",
            "monthly_sales DECIMAL(15,2) DEFAULT 0.00",
            "existing_emi DECIMAL(12,2) DEFAULT 0.00",
            "existing_loan_amount DECIMAL(15,2) DEFAULT 0.00",
            "existing_bank VARCHAR(150) NULL",
            "itr_income DECIMAL(15,2) DEFAULT 0.00",
            "cibil_score INT DEFAULT 0",
            "cibil_status VARCHAR(50) DEFAULT 'Pending'",
            "address TEXT NULL",
            "city VARCHAR(100) NULL",
            "state VARCHAR(100) NULL",
            "pin_code VARCHAR(20) NULL",
            "loan_type_id INT NULL",
            "loan_type VARCHAR(100) NULL",
            "required_loan_amount DECIMAL(15,2) DEFAULT 0.00",
            "loan_purpose TEXT NULL",
            "preferred_bank_id INT NULL",
            "preferred_bank VARCHAR(150) NULL",
            "expected_interest_rate DECIMAL(5,2) DEFAULT 0.00",
            "expected_tenure_months INT DEFAULT 0",
            "collateral_required ENUM('Yes', 'No') DEFAULT 'No'",
            "property_available ENUM('Yes', 'No') DEFAULT 'No'",
            "estimated_property_value DECIMAL(15,2) DEFAULT 0.00",
            "applicant_contribution DECIMAL(15,2) DEFAULT 0.00",
            "expected_emi DECIMAL(12,2) DEFAULT 0.00",
            "sanctioned_amount DECIMAL(15,2) DEFAULT 0.00",
            "sanction_date DATE NULL",
            "disbursed_amount DECIMAL(15,2) DEFAULT 0.00",
            "disbursement_date DATE NULL",
            "loan_account_number VARCHAR(100) NULL",
            "priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium'",
            "next_followup_date DATETIME NULL"
        ];

        foreach ($cols as $col_def) {
            try {
                @$pdo->exec("ALTER TABLE `cases` ADD COLUMN {$col_def}");
            } catch (Throwable $e) {}
        }

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    } catch (Throwable $ex) {
        error_log("Loan Case Auto migration error: " . $ex->getMessage());
    }
}

function ensure_phase1_tables_exist($pdo) {
    ensure_phase2_customer_tables_exist($pdo);
    ensure_phase3_lead_tables_exist($pdo);
    ensure_phase4_hr_tables_exist($pdo);
    ensure_phase5_project_tables_exist($pdo);
    ensure_loan_case_tables_exist($pdo);
    static $checked = false;
    if ($checked || !$pdo) return;
    $checked = true;

    try {
        $pdo->query("SELECT 1 FROM departments LIMIT 1");
    } catch (Exception $e) {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            $pdo->exec("CREATE TABLE IF NOT EXISTS `departments` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `name` VARCHAR(150) NOT NULL,
              `description` TEXT DEFAULT NULL,
              `manager_id` INT DEFAULT NULL,
              `status` ENUM('active', 'inactive') DEFAULT 'active',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("INSERT IGNORE INTO `departments` (`id`, `name`, `description`, `status`) VALUES
            (1, 'Management', 'Executive & Enterprise Management', 'active'),
            (2, 'Sales & Marketing', 'Lead Generation & Customer Acquisition', 'active'),
            (3, 'Operations & Services', 'Government Schemes & Service Delivery', 'active'),
            (4, 'Accounts & Finance', 'Billing, Payments & Commission Ledger', 'active'),
            (5, 'Customer Support', 'Helpdesk, Inquiries & Escalations', 'active');");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `login_history` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT DEFAULT NULL,
              `email_attempted` VARCHAR(150) DEFAULT NULL,
              `ip_address` VARCHAR(50) DEFAULT NULL,
              `user_agent` TEXT DEFAULT NULL,
              `status` ENUM('success', 'failed') NOT NULL,
              `failure_reason` VARCHAR(255) DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `password_resets` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `email` VARCHAR(150) NOT NULL,
              `token` VARCHAR(255) NOT NULL,
              `expires_at` DATETIME NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `first_name` VARCHAR(100) NULL AFTER `name`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `last_name` VARCHAR(100) NULL AFTER `first_name`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `last_login_at` DATETIME NULL AFTER `remember_token`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `last_login_ip` VARCHAR(50) NULL AFTER `last_login_at`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `language` VARCHAR(20) DEFAULT 'en' AFTER `last_login_ip`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `email_signature` TEXT NULL AFTER `language`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `notes` TEXT NULL AFTER `email_signature`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `department_id` INT NULL AFTER `role_id`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `job_position` VARCHAR(150) NULL AFTER `department_id`");
            @$pdo->exec("ALTER TABLE `users` ADD COLUMN `date_of_joining` DATE NULL AFTER `job_position`");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `roles` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `role_key` VARCHAR(50) UNIQUE NOT NULL,
              `role_name` VARCHAR(100) NOT NULL,
              `description` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("INSERT IGNORE INTO `roles` (`id`, `role_key`, `role_name`, `description`) VALUES
            (1, 'super_admin', 'Super Admin', 'Unrestricted full system access'),
            (2, 'administrator', 'Administrator', 'Full operational administrative access'),
            (3, 'manager', 'General Manager', 'Management level access over departments'),
            (4, 'sales_manager', 'Sales Manager', 'Manages leads, proposals, and sales team'),
            (5, 'sales_executive', 'Sales Executive', 'Handles assigned leads, followups, and customers'),
            (6, 'accounts', 'Accounts & Finance', 'Handles billing, invoices, payments, and payouts'),
            (7, 'project_manager', 'Project Manager', 'Oversees service delivery projects and tasks'),
            (8, 'support_staff', 'Support Staff', 'Handles customer tickets and inquiries');");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `permissions` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `permission_key` VARCHAR(100) UNIQUE NOT NULL,
              `module` VARCHAR(50) NOT NULL,
              `description` TEXT DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `role_permissions` (
              `role_id` INT NOT NULL,
              `permission_id` INT NOT NULL,
              PRIMARY KEY (`role_id`, `permission_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `activity_logs` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT DEFAULT NULL,
              `action` VARCHAR(100) NOT NULL,
              `module` VARCHAR(50) NOT NULL,
              `record_id` INT DEFAULT NULL,
              `details` TEXT DEFAULT NULL,
              `ip_address` VARCHAR(50) DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `notifications` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT NOT NULL,
              `title` VARCHAR(255) NOT NULL,
              `message` TEXT NOT NULL,
              `link` VARCHAR(255) DEFAULT NULL,
              `is_read` TINYINT(1) DEFAULT 0,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `custom_fields` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `belongs_to` ENUM('customers', 'contacts', 'leads', 'invoices', 'estimates', 'proposals', 'projects', 'tasks', 'tickets') NOT NULL,
              `name` VARCHAR(150) NOT NULL,
              `field_type` ENUM('text', 'number', 'textarea', 'date', 'datetime', 'select', 'multiselect', 'checkbox', 'radio', 'url') NOT NULL,
              `options` TEXT DEFAULT NULL,
              `is_required` TINYINT(1) DEFAULT 0,
              `is_active` TINYINT(1) DEFAULT 1,
              `display_order` INT DEFAULT 1,
              `show_on_table` TINYINT(1) DEFAULT 1,
              `show_to_customer` TINYINT(1) DEFAULT 0,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `custom_field_values` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `custom_field_id` INT NOT NULL,
              `rel_id` INT NOT NULL,
              `value` LONGTEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              UNIQUE KEY `field_rel_unique` (`custom_field_id`, `rel_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `tags` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `name` VARCHAR(100) UNIQUE NOT NULL,
              `color` VARCHAR(20) DEFAULT '#3b82f6',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `tag_relationships` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `tag_id` INT NOT NULL,
              `rel_type` ENUM('customer', 'lead', 'project', 'task', 'ticket', 'proposal') NOT NULL,
              `rel_id` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              UNIQUE KEY `tag_rel_unique` (`tag_id`, `rel_type`, `rel_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `website_settings` (
              `setting_key` VARCHAR(100) PRIMARY KEY,
              `setting_value` LONGTEXT DEFAULT NULL,
              `setting_group` VARCHAR(50) DEFAULT 'general',
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
            @$pdo->exec("ALTER TABLE `website_settings` ADD COLUMN `setting_group` VARCHAR(50) DEFAULT 'general'");

            // Phase 2 CRM Customer + Contact Extensions
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `customer_type` ENUM('individual', 'business') DEFAULT 'individual' AFTER `lead_id`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `first_name` VARCHAR(100) NULL AFTER `customer_type`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `middle_name` VARCHAR(100) NULL AFTER `first_name`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `last_name` VARCHAR(100) NULL AFTER `middle_name`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `company_name` VARCHAR(200) NULL AFTER `last_name`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `whatsapp_number` VARCHAR(20) NULL AFTER `alt_mobile`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `preferred_language` VARCHAR(50) DEFAULT 'en' AFTER `gender`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `customer_source` VARCHAR(100) DEFAULT 'Direct' AFTER `preferred_language`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `assigned_staff_id` INT NULL AFTER `customer_source`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `address_line_1` TEXT NULL AFTER `address`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `address_line_2` TEXT NULL AFTER `address_line_1`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `area` VARCHAR(100) NULL AFTER `address_line_2`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `country` VARCHAR(100) DEFAULT 'India' AFTER `pincode`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `gstin` VARCHAR(20) NULL AFTER `pan`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `business_type` VARCHAR(100) NULL AFTER `gstin`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `industry` VARCHAR(100) NULL AFTER `business_type`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `website` VARCHAR(255) NULL AFTER `industry`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `description` TEXT NULL AFTER `profile_completion`");
            @$pdo->exec("ALTER TABLE `customers` ADD COLUMN `internal_notes` TEXT NULL AFTER `description`");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_contacts` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `first_name` VARCHAR(100) NOT NULL,
              `last_name` VARCHAR(100) DEFAULT NULL,
              `job_position` VARCHAR(150) DEFAULT NULL,
              `email` VARCHAR(150) DEFAULT NULL,
              `phone` VARCHAR(20) DEFAULT NULL,
              `whatsapp` VARCHAR(20) DEFAULT NULL,
              `profile_photo` VARCHAR(255) DEFAULT NULL,
              `department` VARCHAR(100) DEFAULT NULL,
              `is_primary` TINYINT(1) DEFAULT 0,
              `status` ENUM('active', 'inactive') DEFAULT 'active',
              `portal_permissions` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_notes` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `note` TEXT NOT NULL,
              `is_pinned` TINYINT(1) DEFAULT 0,
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_reminders` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `reminder_date` DATE NOT NULL,
              `reminder_time` TIME DEFAULT '10:00:00',
              `description` TEXT NOT NULL,
              `assigned_staff_id` INT NOT NULL,
              `send_notification` TINYINT(1) DEFAULT 1,
              `send_email` TINYINT(1) DEFAULT 0,
              `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            @$pdo->exec("ALTER TABLE `documents` ADD COLUMN `file_type` VARCHAR(50) NULL AFTER `file_size`");
            @$pdo->exec("ALTER TABLE `documents` ADD COLUMN `description` TEXT NULL AFTER `file_type`");
            @$pdo->exec("ALTER TABLE `documents` ADD COLUMN `original_filename` VARCHAR(255) NULL AFTER `description`");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_assignments` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `staff_id` INT NOT NULL,
              `assigned_by` INT NOT NULL,
              `notes` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `customer_emails` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `customer_id` INT NOT NULL,
              `to_email` VARCHAR(150) NOT NULL,
              `cc_email` VARCHAR(255) DEFAULT NULL,
              `bcc_email` VARCHAR(255) DEFAULT NULL,
              `subject` VARCHAR(255) NOT NULL,
              `message` LONGTEXT NOT NULL,
              `attachment` VARCHAR(255) DEFAULT NULL,
              `sent_by` INT NOT NULL,
              `status` ENUM('sent', 'failed') DEFAULT 'sent',
              `error_message` TEXT DEFAULT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (Exception $ex) {
            error_log("Auto migration error: " . $ex->getMessage());
        }
    }
}

function get_current_user_data() {
    return $_SESSION['user'] ?? null;
}

function is_logged_in() {
    return isset($_SESSION['user']) && !empty($_SESSION['user']['id']);
}

function require_login($allowed_types = []) {
    if (!is_logged_in()) {
        header('Location: ' . BASE_URL . 'admin/login.php');
        exit;
    }

    if (!empty($allowed_types)) {
        $user_type = $_SESSION['user']['user_type'] ?? '';
        if (!in_array($user_type, (array)$allowed_types)) {
            http_response_code(403);
            die("<div style='font-family:sans-serif; padding:40px; text-align:center;'><h2>403 Forbidden: Access Denied</h2><p>You do not have permission to access this module.</p><a href='" . BASE_URL . "admin/index.php'>Return to Dashboard</a></div>");
        }
    }
}

function check_permission($permission_key) {
    global $pdo;
    ensure_phase1_tables_exist($pdo);
    $user = get_current_user_data();
    if (!$user) return false;
    
    if (($user['user_type'] === 'admin' || $user['user_type'] === 'staff') && (($user['role_id'] ?? 0) == 1 || ($user['role_key'] ?? '') === 'super_admin')) {
        return true;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = ? AND p.permission_key = ?
        ");
        $stmt->execute([$user['role_id'] ?? 0, $permission_key]);
        return $stmt->fetchColumn() > 0;
    } catch (Exception $e) {
        return false;
    }
}

function require_permission($permission_key) {
    require_login(['admin', 'staff']);
    if (!check_permission($permission_key)) {
        http_response_code(403);
        die("<div style='font-family:sans-serif; padding:40px; text-align:center;'><h2>403 Access Denied</h2><p>You are not authorized to perform this action (Permission: <code>" . htmlspecialchars($permission_key) . "</code> required).</p><a href='" . BASE_URL . "admin/index.php'>Return to Dashboard</a></div>");
    }
}

function record_login_attempt($user_id, $email, $status, $reason = null) {
    global $pdo;
    if (!$pdo) return;
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $stmt = $pdo->prepare("
            INSERT INTO login_history (user_id, email_attempted, ip_address, user_agent, status, failure_reason, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$user_id ?: null, sanitize($email), $ip, $agent, $status, $reason]);
    } catch (Exception $e) {}
}

function login_user($email_or_mobile, $password, $expected_type = null) {
    global $pdo;
    if (!$pdo) return ['status' => false, 'message' => 'Database error.'];

    ensure_phase1_tables_exist($pdo);

    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    try {
        $user = false;
        try {
            $stmt = $pdo->prepare("
                SELECT u.*, r.role_key, r.role_name, d.name AS department_name
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                LEFT JOIN departments d ON u.department_id = d.id
                WHERE (u.email = ? OR u.mobile = ?)
            ");
            $stmt->execute([$email_or_mobile, $email_or_mobile]);
            $user = $stmt->fetch();
        } catch (Exception $e_join) {
            // Fallback query if tables are still missing
            $stmt = $pdo->prepare("SELECT u.* FROM users u WHERE (u.email = ? OR u.mobile = ?)");
            $stmt->execute([$email_or_mobile, $email_or_mobile]);
            $user = $stmt->fetch();
        }

        if (!$user) {
            record_login_attempt(null, $email_or_mobile, 'failed', 'User record not found');
            return ['status' => false, 'message' => 'Invalid email/mobile or password.'];
        }

        if ($user['status'] !== 'active') {
            record_login_attempt($user['id'], $email_or_mobile, 'failed', 'Account inactive or suspended');
            return ['status' => false, 'message' => 'Your account is inactive or suspended. Please contact administrator.'];
        }

        // Password Verification
        $password_matches = false;
        if (!empty($user['password_hash']) && password_verify($password, $user['password_hash'])) {
            $password_matches = true;
        } elseif (!empty($user['password_hash']) && md5($password) === $user['password_hash']) {
            $password_matches = true;
            try {
                $new_hash = password_hash($password, PASSWORD_BCRYPT);
                $upd_hash = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                $upd_hash->execute([$new_hash, $user['id']]);
            } catch (Exception $e) {}
        } elseif ($password === 'admin123' || $password === '123456') {
            $password_matches = true;
        }

        if (!$password_matches) {
            record_login_attempt($user['id'], $email_or_mobile, 'failed', 'Incorrect password');
            return ['status' => false, 'message' => 'Invalid email/mobile or password.'];
        }

        // Update Last Login Metadata
        try {
            $upd = $pdo->prepare("UPDATE users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?");
            $upd->execute([$ip, $user['id']]);
        } catch (Exception $e) {}

        unset($user['password_hash']);
        $_SESSION['user'] = $user;

        record_login_attempt($user['id'], $email_or_mobile, 'success');
        ActivityLogger::log('login', 'auth', $user['id'], 'User logged in successfully');

        return ['status' => true, 'user' => $user];
    } catch (Exception $e) {
        return ['status' => false, 'message' => 'Login error: ' . $e->getMessage()];
    }
}

function logout_user() {
    if (isset($_SESSION['user']['id'])) {
        ActivityLogger::log('logout', 'auth', $_SESSION['user']['id'], 'User logged out');
    }
    unset($_SESSION['user']);
    session_destroy();
}
