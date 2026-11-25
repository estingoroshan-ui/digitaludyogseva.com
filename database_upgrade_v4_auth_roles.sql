-- DIGITAL UDYOG SEVA - V4 AUTH, ROLES, ATTENDANCE & PAYROLL DATABASE UPGRADE
-- Safe, backward-compatible DDL

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ROLES TABLE & TEMPLATES
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_key` VARCHAR(50) NOT NULL UNIQUE,
  `role_name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed all 18 Default Role Templates
INSERT INTO `roles` (`id`, `role_key`, `role_name`, `description`) VALUES
(1, 'super_admin', 'Super Admin', 'Full system access and master configuration'),
(2, 'admin', 'Admin', 'Enterprise ERP administration and user management'),
(3, 'branch_manager', 'Branch Manager', 'Branch office operations, approvals, and team management'),
(4, 'sales_manager', 'Sales Manager', 'Lead conversion pipeline and sales team leadership'),
(5, 'telecaller', 'Telecaller', 'Outbound client calling, lead qualification, and scheduling'),
(6, 'relationship_manager', 'Relationship Manager', 'Direct client consultancy and case coordination'),
(7, 'govt_scheme_consultant', 'Government Scheme Consultant', 'PMEGP, Mudra, and Subsidy application assistance'),
(8, 'eligibility_officer', 'Eligibility Assessment Officer', 'Client eligibility assessment and 100-pt scorecard verification'),
(9, 'documentation_executive', 'Documentation Executive', 'KYC and statutory document collection and verification'),
(10, 'dpr_executive', 'DPR & Project Report Executive', 'Detailed Project Report preparation and CMA financial projections'),
(11, 'credit_officer', 'Credit Officer', 'Financial appraisal, DSCR calculation, and bank eligibility'),
(12, 'bank_liaison_officer', 'Bank Liaison Officer', 'Bank coordination, query resolution, and sanction follow-up'),
(13, 'project_manager', 'Project Manager', 'Filing milestone tracking and end-to-end execution'),
(14, 'accounts_executive', 'Accounts Executive', 'Invoicing, receipts, client billing, and payments'),
(15, 'hr_manager', 'HR Manager', 'Employee onboarding, attendance, and payroll management'),
(16, 'auditor', 'Auditor', 'Read-only compliance and financial audit review'),
(17, 'customer', 'Customer', 'Client self-service portal, tracking, and document vault'),
(18, 'employee', 'General Employee', 'General staff workspace and personal attendance')
ON DUPLICATE KEY UPDATE `role_name` = VALUES(`role_name`), `description` = VALUES(`description`);

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `permission_key` VARCHAR(100) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed core module permissions
INSERT IGNORE INTO `permissions` (`permission_key`, `module`, `description`) VALUES
('leads.view', 'leads', 'Can view lead records and lists'),
('leads.create', 'leads', 'Can add new leads'),
('leads.edit', 'leads', 'Can update lead status and details'),
('leads.assign', 'leads', 'Can assign leads to staff'),
('leads.delete', 'leads', 'Can archive/delete leads'),
('schemes.view', 'schemes', 'Can browse scheme registry'),
('schemes.manage', 'schemes', 'Can create and edit government schemes'),
('eligibility.assess', 'eligibility', 'Can perform 100-pt eligibility check'),
('customers.view', 'customers', 'Can view customer directory'),
('customers.manage', 'customers', 'Can create, edit, or convert customers'),
('projects.view', 'projects', 'Can view active consultancy projects'),
('projects.manage', 'projects', 'Can create and update milestones and status'),
('documents.view', 'documents', 'Can access document vault'),
('documents.upload', 'documents', 'Can upload files'),
('documents.verify', 'documents', 'Can verify or reject KYC documents'),
('billing.view', 'billing', 'Can view invoices and receipts'),
('billing.create', 'billing', 'Can generate invoices and quotations'),
('billing.record_payment', 'billing', 'Can enter client payment transactions'),
('staff.view', 'staff', 'Can view employee directory'),
('staff.manage', 'staff', 'Can onboard, edit, and configure employees'),
('attendance.punch', 'attendance', 'Can mark daily attendance'),
('attendance.manage', 'attendance', 'Can review and adjust staff attendance'),
('payroll.view', 'payroll', 'Can view salary structures and payslips'),
('payroll.process', 'payroll', 'Can review, approve, and disburse salaries'),
('reports.view', 'reports', 'Can view executive and financial analytics'),
('settings.manage', 'settings', 'Can change company settings and permissions');

-- 3. ROLE PERMISSIONS MAPPING TABLE
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_role_perm` (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Give Super Admin & Admin all permissions
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, id FROM `permissions`;

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, id FROM `permissions`;

-- 4. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `employee_id` INT DEFAULT NULL,
  `date` DATE NOT NULL,
  `punch_in` TIME DEFAULT NULL,
  `punch_out` TIME DEFAULT NULL,
  `punch_in_ip` VARCHAR(50) DEFAULT NULL,
  `punch_out_ip` VARCHAR(50) DEFAULT NULL,
  `working_hours` DECIMAL(5,2) DEFAULT 0.00,
  `status` ENUM('present', 'absent', 'half_day', 'paid_leave', 'unpaid_leave', 'holiday', 'weekly_off', 'late_arrival') DEFAULT 'present',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_date` (`user_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. LEAVES TABLE
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `employee_id` INT DEFAULT NULL,
  `leave_type` ENUM('casual', 'sick', 'earned', 'unpaid', 'maternity', 'other') DEFAULT 'casual',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `days` DECIMAL(4,1) NOT NULL DEFAULT 1.0,
  `reason` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  `approved_by` INT DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. PAYROLL TABLE
CREATE TABLE IF NOT EXISTS `payroll` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `employee_id` INT DEFAULT NULL,
  `payroll_month` VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  `basic_salary` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `hra` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `allowances` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `incentives` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `bonus` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `gross_salary` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `pf_deduction` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `esi_deduction` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `tds_deduction` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `other_deductions` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_deductions` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `net_salary` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('draft', 'reviewed', 'approved', 'paid') DEFAULT 'draft',
  `payment_date` DATE DEFAULT NULL,
  `payment_mode` VARCHAR(50) DEFAULT 'Bank Transfer',
  `transaction_ref` VARCHAR(100) DEFAULT NULL,
  `reviewed_by` INT DEFAULT NULL,
  `approved_by` INT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_emp_month` (`user_id`, `payroll_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. PASSWORD RESETS TABLE
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `token` VARCHAR(100) NOT NULL,
  `portal` ENUM('admin', 'employee', 'customer') DEFAULT 'customer',
  `expires_at` DATETIME NOT NULL,
  `used` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_token` (`token`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. LOGIN SESSIONS TABLE
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(128) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `portal` ENUM('admin', 'employee', 'customer') NOT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `payload` LONGTEXT DEFAULT NULL,
  `last_activity` INT NOT NULL,
  INDEX `idx_user_portal` (`user_id`, `portal`),
  INDEX `idx_last_activity` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. LOGIN HISTORY TABLE
CREATE TABLE IF NOT EXISTS `login_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `portal` VARCHAR(50) DEFAULT 'admin',
  `email_attempted` VARCHAR(150) NOT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `status` ENUM('success', 'failed', 'blocked') DEFAULT 'failed',
  `failure_reason` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
