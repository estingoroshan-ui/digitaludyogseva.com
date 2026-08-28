-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V8 (CRM PHASE 3: PERFEX-STYLE LEAD ENGINE)
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Extend Leads Table
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `first_name` VARCHAR(100) NULL AFTER `name`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `last_name` VARCHAR(100) NULL AFTER `first_name`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `title` VARCHAR(150) NULL AFTER `last_name`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `company` VARCHAR(200) NULL AFTER `business_name`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `whatsapp_number` VARCHAR(20) NULL AFTER `alt_mobile`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `address_line_1` TEXT NULL AFTER `address`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `address_line_2` TEXT NULL AFTER `address_line_1`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `country` VARCHAR(100) DEFAULT 'India' AFTER `pincode`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `lead_value` DECIMAL(12,2) DEFAULT 0.00 AFTER `required_loan_amount`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `gstin` VARCHAR(20) NULL AFTER `lead_value`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `pan` VARCHAR(20) NULL AFTER `gstin`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `website` VARCHAR(255) NULL AFTER `pan`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `is_public` TINYINT(1) DEFAULT 0 AFTER `tags`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `last_contacted_at` DATETIME NULL AFTER `is_public`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `next_followup_date` DATE NULL AFTER `last_contacted_at`;
ALTER TABLE `leads` ADD COLUMN IF NOT EXISTS `next_followup_time` TIME NULL AFTER `next_followup_date`;

-- 2. Lead Internal Notes Table
CREATE TABLE IF NOT EXISTS `lead_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `note` TEXT NOT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Lead Scheduled Reminders Table
CREATE TABLE IF NOT EXISTS `lead_reminders` (
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Lead File Attachments Vault
CREATE TABLE IF NOT EXISTS `lead_attachments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `original_filename` VARCHAR(255) NOT NULL,
  `file_size` INT DEFAULT 0,
  `file_type` VARCHAR(50) DEFAULT NULL,
  `uploaded_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Extend Followups Table
ALTER TABLE `followups` ADD COLUMN IF NOT EXISTS `followup_type` VARCHAR(50) DEFAULT 'Call' AFTER `assigned_employee_id`;
ALTER TABLE `followups` ADD COLUMN IF NOT EXISTS `followup_result` TEXT NULL AFTER `notes`;
ALTER TABLE `followups` ADD COLUMN IF NOT EXISTS `customer_response` TEXT NULL AFTER `followup_result`;
ALTER TABLE `followups` ADD COLUMN IF NOT EXISTS `next_action` TEXT NULL AFTER `customer_response`;
ALTER TABLE `followups` ADD COLUMN IF NOT EXISTS `next_followup_date` DATE NULL AFTER `next_action`;

SET FOREIGN_KEY_CHECKS = 1;
