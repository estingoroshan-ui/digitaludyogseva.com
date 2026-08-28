-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V7 (CRM PHASE 2: CUSTOMER + CONTACT MANAGEMENT)
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Extend Customers Table
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `customer_type` ENUM('individual', 'business') DEFAULT 'individual' AFTER `lead_id`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `first_name` VARCHAR(100) NULL AFTER `customer_type`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `middle_name` VARCHAR(100) NULL AFTER `first_name`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `last_name` VARCHAR(100) NULL AFTER `middle_name`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `company_name` VARCHAR(200) NULL AFTER `last_name`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `whatsapp_number` VARCHAR(20) NULL AFTER `alt_mobile`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `preferred_language` VARCHAR(50) DEFAULT 'en' AFTER `gender`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `customer_source` VARCHAR(100) DEFAULT 'Direct' AFTER `preferred_language`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `assigned_staff_id` INT NULL AFTER `customer_source`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `address_line_1` TEXT NULL AFTER `address`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `address_line_2` TEXT NULL AFTER `address_line_1`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `area` VARCHAR(100) NULL AFTER `address_line_2`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `country` VARCHAR(100) DEFAULT 'India' AFTER `pincode`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `gstin` VARCHAR(20) NULL AFTER `pan`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `business_type` VARCHAR(100) NULL AFTER `gstin`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `industry` VARCHAR(100) NULL AFTER `business_type`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `website` VARCHAR(255) NULL AFTER `industry`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `description` TEXT NULL AFTER `profile_completion`;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `internal_notes` TEXT NULL AFTER `description`;

-- 2. Customer Contacts Table
CREATE TABLE IF NOT EXISTS `customer_contacts` (
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
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Customer Internal Notes Table
CREATE TABLE IF NOT EXISTS `customer_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `note` TEXT NOT NULL,
  `is_pinned` TINYINT(1) DEFAULT 0,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Customer Reminders Table
CREATE TABLE IF NOT EXISTS `customer_reminders` (
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Extend Documents Table
ALTER TABLE `documents` ADD COLUMN IF NOT EXISTS `file_type` VARCHAR(50) NULL AFTER `file_size`;
ALTER TABLE `documents` ADD COLUMN IF NOT EXISTS `description` TEXT NULL AFTER `file_type`;
ALTER TABLE `documents` ADD COLUMN IF NOT EXISTS `original_filename` VARCHAR(255) NULL AFTER `description`;

-- 6. Customer Staff Assignments History
CREATE TABLE IF NOT EXISTS `customer_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `assigned_by` INT NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Customer Email Communication Logs
CREATE TABLE IF NOT EXISTS `customer_emails` (
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
