-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V6 (CRM CORE FOUNDATION PHASE 1)
-- Departments, Login History, Password Resets, RBAC Extensions, Custom Fields, Tags & SMTP Settings
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create Departments Table
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `manager_id` INT DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Departments
INSERT IGNORE INTO `departments` (`id`, `name`, `description`, `status`) VALUES
(1, 'Management', 'Executive & Enterprise Management', 'active'),
(2, 'Sales & Marketing', 'Lead Generation & Customer Acquisition', 'active'),
(3, 'Operations & Services', 'Government Schemes & Service Delivery', 'active'),
(4, 'Accounts & Finance', 'Billing, Payments & Commission Ledger', 'active'),
(5, 'Customer Support', 'Helpdesk, Inquiries & Escalations', 'active');

-- 2. Create Login History Table
CREATE TABLE IF NOT EXISTS `login_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `email_attempted` VARCHAR(150) DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `status` ENUM('success', 'failed') NOT NULL,
  `failure_reason` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Create Password Resets Table
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`email`),
  INDEX (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Extend Users Table for Staff Details & Metadata
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `first_name` VARCHAR(100) NULL AFTER `name`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `last_name` VARCHAR(100) NULL AFTER `first_name`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `last_login_at` DATETIME NULL AFTER `remember_token`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `last_login_ip` VARCHAR(50) NULL AFTER `last_login_at`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `language` VARCHAR(20) DEFAULT 'en' AFTER `last_login_ip`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `email_signature` TEXT NULL AFTER `language`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `notes` TEXT NULL AFTER `email_signature`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `department_id` INT NULL AFTER `role_id`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `job_position` VARCHAR(150) NULL AFTER `department_id`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `date_of_joining` DATE NULL AFTER `job_position`;

-- 5. Seed Additional Master Roles
INSERT IGNORE INTO `roles` (`id`, `role_key`, `role_name`, `description`) VALUES
(1, 'super_admin', 'Super Admin', 'Unrestricted full system access'),
(2, 'administrator', 'Administrator', 'Full operational administrative access'),
(3, 'manager', 'General Manager', 'Management level access over departments'),
(4, 'sales_manager', 'Sales Manager', 'Manages leads, proposals, and sales team'),
(5, 'sales_executive', 'Sales Executive', 'Handles assigned leads, followups, and customers'),
(6, 'accounts', 'Accounts & Finance', 'Handles billing, invoices, payments, and payouts'),
(7, 'project_manager', 'Project Manager', 'Oversees service delivery projects and tasks'),
(8, 'support_staff', 'Support Staff', 'Handles customer tickets and inquiries');

-- 6. Seed Granular Module Permissions
INSERT IGNORE INTO `permissions` (`permission_key`, `module`, `description`) VALUES
('customers_view', 'customers', 'View all customers'),
('customers_view_own', 'customers', 'View own assigned customers'),
('customers_create', 'customers', 'Create new customer'),
('customers_edit', 'customers', 'Edit customer profiles'),
('customers_delete', 'customers', 'Delete customer records'),
('contacts_view', 'contacts', 'View customer contacts'),
('contacts_create', 'contacts', 'Create new contacts'),
('contacts_edit', 'contacts', 'Edit contacts'),
('contacts_delete', 'contacts', 'Delete contacts'),
('leads_view', 'leads', 'View all leads'),
('leads_view_own', 'leads', 'View own assigned leads'),
('leads_create', 'leads', 'Create new lead'),
('leads_edit', 'leads', 'Edit lead records'),
('leads_delete', 'leads', 'Delete lead records'),
('proposals_view', 'proposals', 'View proposals'),
('proposals_create', 'proposals', 'Create proposals'),
('proposals_edit', 'proposals', 'Edit proposals'),
('proposals_delete', 'proposals', 'Delete proposals'),
('estimates_view', 'estimates', 'View estimates'),
('estimates_create', 'estimates', 'Create estimates'),
('estimates_edit', 'estimates', 'Edit estimates'),
('estimates_delete', 'estimates', 'Delete estimates'),
('invoices_view', 'invoices', 'View invoices'),
('invoices_create', 'invoices', 'Create invoices'),
('invoices_edit', 'invoices', 'Edit invoices'),
('invoices_delete', 'invoices', 'Delete invoices'),
('payments_view', 'payments', 'View payments'),
('payments_create', 'payments', 'Record payments'),
('projects_view', 'projects', 'View projects'),
('projects_create', 'projects', 'Create projects'),
('projects_edit', 'projects', 'Edit projects'),
('projects_delete', 'projects', 'Delete projects'),
('tasks_view', 'tasks', 'View all tasks'),
('tasks_view_own', 'tasks', 'View own assigned tasks'),
('tasks_create', 'tasks', 'Create tasks'),
('tasks_edit', 'tasks', 'Edit tasks'),
('tasks_delete', 'tasks', 'Delete tasks'),
('staff_view', 'staff', 'View staff directory'),
('staff_create', 'staff', 'Create staff accounts'),
('staff_edit', 'staff', 'Edit staff accounts'),
('staff_delete', 'staff', 'Delete or deactivate staff'),
('settings_view', 'settings', 'View enterprise settings'),
('settings_edit', 'settings', 'Modify enterprise settings'),
('roles_manage', 'settings', 'Manage roles and permissions'),
('departments_manage', 'settings', 'Manage departments');

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, id FROM `permissions`;

-- 7. Custom Fields Engine Table
CREATE TABLE IF NOT EXISTS `custom_fields` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Custom Field Values Table
CREATE TABLE IF NOT EXISTS `custom_field_values` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `custom_field_id` INT NOT NULL,
  `rel_id` INT NOT NULL,
  `value` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`custom_field_id`) REFERENCES `custom_fields`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `field_rel_unique` (`custom_field_id`, `rel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Tags Master Table
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `color` VARCHAR(20) DEFAULT '#3b82f6',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `tags` (`id`, `name`, `color`) VALUES
(1, 'VIP Client', '#ef4444'),
(2, 'High Priority', '#f59e0b'),
(3, 'Follow Up', '#06b6d4'),
(4, 'Government Scheme', '#10b981'),
(5, 'MSME Certificate', '#8b5cf6');

-- 10. Tag Relationships Table
CREATE TABLE IF NOT EXISTS `tag_relationships` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tag_id` INT NOT NULL,
  `rel_type` ENUM('customer', 'lead', 'project', 'task', 'ticket', 'proposal') NOT NULL,
  `rel_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `tag_rel_unique` (`tag_id`, `rel_type`, `rel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Extend Website Settings Table and Seed Config
ALTER TABLE `website_settings` ADD COLUMN IF NOT EXISTS `setting_group` VARCHAR(50) DEFAULT 'general';

INSERT IGNORE INTO `website_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('company_name', 'Digital Udyog Seva', 'company'),
('company_tagline', 'Business Legal Services, Tax & Government Loan Consultancy', 'company'),
('company_email', 'care@digitaludyogseva.com', 'company'),
('company_phone', '+91 9876543210', 'company'),
('company_address', 'Corporate Tower, Financial District', 'company'),
('company_city', 'New Delhi', 'company'),
('company_state', 'Delhi', 'company'),
('company_country', 'India', 'company'),
('company_pincode', '110001', 'company'),
('company_gstin', '07AAAAA0000A1Z5', 'company'),
('default_timezone', 'Asia/Kolkata', 'general'),
('date_format', 'd-m-Y', 'general'),
('default_currency', 'INR', 'general'),
('currency_symbol', '₹', 'general'),
('smtp_host', 'smtp.gmail.com', 'email'),
('smtp_port', '587', 'email'),
('smtp_encryption', 'tls', 'email'),
('smtp_username', '', 'email'),
('smtp_password', '', 'email'),
('smtp_from_email', 'care@digitaludyogseva.com', 'email'),
('smtp_from_name', 'Digital Udyog Seva CRM', 'email');

SET FOREIGN_KEY_CHECKS = 1;
