-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V9 (CRM PHASE 4: HR RECORDS ENGINE)
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Extend Employees Table
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `date_of_birth` DATE NULL AFTER `status`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `gender` ENUM('male', 'female', 'other') DEFAULT 'male' AFTER `date_of_birth`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `emergency_contact_name` VARCHAR(150) NULL AFTER `gender`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `emergency_contact_phone` VARCHAR(20) NULL AFTER `emergency_contact_name`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `pan_number` VARCHAR(20) NULL AFTER `emergency_contact_phone`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `aadhaar_number` VARCHAR(20) NULL AFTER `pan_number`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `bank_account_no` VARCHAR(50) NULL AFTER `aadhaar_number`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `bank_name` VARCHAR(100) NULL AFTER `bank_account_no`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `ifsc_code` VARCHAR(20) NULL AFTER `bank_name`;
ALTER TABLE `employees` ADD COLUMN IF NOT EXISTS `basic_salary` DECIMAL(12,2) DEFAULT 0.00 AFTER `ifsc_code`;

-- 2. Job Positions / Descriptions
CREATE TABLE IF NOT EXISTS `job_positions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `department_id` INT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `requirements` TEXT DEFAULT NULL,
  `vacancies` INT DEFAULT 1,
  `status` ENUM('active', 'closed') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default jobs if empty
INSERT IGNORE INTO `job_positions` (`id`, `title`, `department_id`, `description`, `vacancies`, `status`) VALUES
(1, 'Senior Business Loan Officer', 2, 'Responsible for client loan processing, documentation, and bank coordination.', 2, 'active'),
(2, 'Government Schemes Consultant', 3, 'Handles PMEGP, MSME, and Subsidy application filings.', 3, 'active'),
(3, 'Customer Support Specialist', 2, 'Assists clients via phone, WhatsApp, and email portal.', 1, 'active');

-- 3. HR Onboarding Checklist
CREATE TABLE IF NOT EXISTS `hr_onboarding` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `step_name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `is_completed` TINYINT(1) DEFAULT 0,
  `completed_at` DATETIME DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. HR Training Programs
CREATE TABLE IF NOT EXISTS `hr_training` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `trainer` VARCHAR(150) DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `status` ENUM('scheduled', 'ongoing', 'completed') DEFAULT 'scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default training
INSERT IGNORE INTO `hr_training` (`id`, `title`, `description`, `trainer`, `start_date`, `end_date`, `status`) VALUES
(1, 'CRM & Service Delivery Operations', 'Complete training on Digital Udyog Seva portal and loan workflow.', 'Manish Pareek', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'ongoing');

-- 5. HR Dependants & Emergency Contacts
CREATE TABLE IF NOT EXISTS `hr_dependants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `relationship` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. HR Layoff / Exit Clearance Checklist
CREATE TABLE IF NOT EXISTS `hr_layoff_checklist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `clearance_item` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) DEFAULT 'General',
  `is_cleared` TINYINT(1) DEFAULT 0,
  `cleared_by` INT DEFAULT NULL,
  `cleared_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. HR Q&A / Policy Knowledge Base
CREATE TABLE IF NOT EXISTS `hr_qa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) DEFAULT 'General Policy',
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `created_by` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default HR Q&A
INSERT IGNORE INTO `hr_qa` (`id`, `category`, `question`, `answer`) VALUES
(1, 'Working Hours', 'What are the official working hours at Digital Udyog Seva?', 'Official working hours are 9:30 AM to 6:30 PM, Monday through Saturday.'),
(2, 'Leave Policy', 'How many casual and sick leaves are granted per year?', 'Employees are entitled to 12 casual leaves and 6 sick leaves annually after probation completion.'),
(3, 'Reimbursement', 'What is the procedure for client travel expense reimbursement?', 'Submit travel receipts in the Expenses module with manager approval before the 25th of each month.');

SET FOREIGN_KEY_CHECKS = 1;
