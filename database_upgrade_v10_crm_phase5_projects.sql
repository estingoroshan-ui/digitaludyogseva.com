-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V10 (CRM PHASE 5: PROJECT MANAGEMENT ENGINE)
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Extend Cases (Projects) Table
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `project_name` VARCHAR(255) NULL AFTER `case_code`;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `progress_percent` INT DEFAULT 0 AFTER `status`;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `start_date` DATE NULL AFTER `progress_percent`;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `deadline` DATE NULL AFTER `start_date`;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `assigned_staff_id` INT NULL AFTER `deadline`;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `billing_type` ENUM('fixed', 'hourly', 'milestone') DEFAULT 'fixed';
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `total_amount` DECIMAL(12,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `paid_amount` DECIMAL(12,2) DEFAULT 0.00;
ALTER TABLE `cases` ADD COLUMN IF NOT EXISTS `project_description` TEXT NULL;

-- 2. Project File Attachments Vault
CREATE TABLE IF NOT EXISTS `project_files` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `original_filename` VARCHAR(255) NOT NULL,
  `file_size` INT DEFAULT 0,
  `file_type` VARCHAR(50) DEFAULT NULL,
  `uploaded_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Project Notes & Discussions
CREATE TABLE IF NOT EXISTS `project_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `note` TEXT NOT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Project Milestones
CREATE TABLE IF NOT EXISTS `project_milestones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `milestone_name` VARCHAR(255) NOT NULL,
  `due_date` DATE DEFAULT NULL,
  `status` ENUM('pending', 'completed') DEFAULT 'pending',
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
