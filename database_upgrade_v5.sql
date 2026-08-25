-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V5 (ENTERPRISE OPERATING SYSTEM)
-- Dynamic Workflows, Multi-Brand, External Professionals & Ecosystem
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Brands Table (Multi-Brand / Multi-Company Support)
CREATE TABLE IF NOT EXISTS `brands` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `brand_name` VARCHAR(150) NOT NULL,
  `domain` VARCHAR(150) UNIQUE NOT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `support_email` VARCHAR(150) DEFAULT NULL,
  `helpline_phone` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `brands` (`id`, `brand_name`, `domain`, `status`) VALUES
(1, 'Digital Udyog Seva', 'digitaludyogseva.com', 'active'),
(2, 'Machinery & Equipment Division', 'machinery.digitaludyogseva.com', 'active'),
(3, 'Raw Material Supply Hub', 'rawmaterial.digitaludyogseva.com', 'active');

-- 2. Service Workflows Table (Dynamic Task Sequence per Service)
CREATE TABLE IF NOT EXISTS `service_workflows` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT NOT NULL,
  `stage_name` ENUM('Internal Office', 'Department', 'Bank', 'Customer', 'Closure') DEFAULT 'Internal Office',
  `task_title` VARCHAR(255) NOT NULL,
  `assigned_role_key` VARCHAR(50) NOT NULL DEFAULT 'case_manager',
  `tat_days` INT DEFAULT 2,
  `is_qc_required` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 1,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default workflow for MSME Udyam (Service ID: 1)
INSERT IGNORE INTO `service_workflows` (`id`, `service_id`, `stage_name`, `task_title`, `assigned_role_key`, `tat_days`, `is_qc_required`, `sort_order`) VALUES
(1, 1, 'Internal Office', 'Document Verification & Eligibility Check', 'case_manager', 1, 0, 1),
(2, 1, 'Internal Office', 'Application Drafting & Data Entry', 'case_manager', 1, 1, 2),
(3, 1, 'Department', 'Udyam Portal Government Filing', 'case_manager', 1, 0, 3),
(4, 1, 'Closure', 'Certificate Generation & Customer Delivery', 'case_manager', 1, 0, 4);

-- 3. Service Document Checklists Table (Dynamic Checklist per Service)
CREATE TABLE IF NOT EXISTS `service_document_checklists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT NOT NULL,
  `document_name` VARCHAR(150) NOT NULL,
  `is_mandatory` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `service_document_checklists` (`id`, `service_id`, `document_name`, `is_mandatory`) VALUES
(1, 1, 'Aadhaar Card (Linked with Mobile)', 1),
(2, 1, 'PAN Card of Applicant', 1),
(3, 1, 'Bank Passbook / Cancelled Cheque', 1),
(4, 2, 'Aadhaar & PAN Card', 1),
(5, 2, 'Electricity Bill / Premises Proof', 1),
(6, 2, 'Rent Agreement / NOC', 1);

-- 4. External Assignments Table (CA / CS / Advocate / Consultant Outsourcing)
CREATE TABLE IF NOT EXISTS `external_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `professional_id` INT NOT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `task_details` TEXT NOT NULL,
  `status` ENUM('assigned', 'in_progress', 'submitted_for_qc', 'approved', 'correction_required') DEFAULT 'assigned',
  `qc_status` ENUM('pending', 'passed', 'failed') DEFAULT 'pending',
  `submitted_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`professional_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Business Ecosystem Requirements Table (Machinery, Raw Materials, Manpower)
CREATE TABLE IF NOT EXISTS `ecosystem_requirements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `franchise_id` INT DEFAULT NULL,
  `category_type` ENUM('machinery', 'raw_material', 'manpower', 'financial') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `requirement_details` TEXT NOT NULL,
  `budget_estimate` DECIMAL(12,2) DEFAULT 0.00,
  `status` ENUM('new', 'routed_to_supplier', 'quotation_sent', 'order_placed', 'closed') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Recurring Cycles Table (GST, ITR, Compliance Auto-Cycle Engine)
CREATE TABLE IF NOT EXISTS `recurring_cycles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `frequency` ENUM('monthly', 'quarterly', 'yearly') DEFAULT 'monthly',
  `last_filed_date` DATE DEFAULT NULL,
  `next_due_date` DATE NOT NULL,
  `auto_case_created` TINYINT(1) DEFAULT 0,
  `status` ENUM('active', 'paused', 'completed') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Communication Logs Table (Official Customer WhatsApp/Email/SMS Audit Log)
CREATE TABLE IF NOT EXISTS `communication_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `case_id` INT DEFAULT NULL,
  `channel` ENUM('whatsapp', 'email', 'sms', 'system_note') DEFAULT 'whatsapp',
  `direction` ENUM('outbound', 'inbound') DEFAULT 'outbound',
  `message_body` TEXT NOT NULL,
  `sent_by_user_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Ensure lead_id column on customers table
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `lead_id` INT NULL AFTER `customer_code`;

-- 9. Ensure lead_statuses table and seed all 22 pipeline stages
CREATE TABLE IF NOT EXISTS `lead_statuses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `status_key` VARCHAR(50) UNIQUE NOT NULL,
  `status_name` VARCHAR(100) NOT NULL,
  `color_code` VARCHAR(20) DEFAULT '#3b82f6',
  `sort_order` INT DEFAULT 1,
  `is_system` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `lead_statuses` (`id`, `status_key`, `status_name`, `color_code`, `sort_order`, `is_system`) VALUES
(1, 'new_lead', 'New Lead', '#6366f1', 1, 1),
(2, 'contact_attempted', 'Contact Attempted', '#3b82f6', 2, 1),
(3, 'no_response', 'No Response', '#94a3b8', 3, 1),
(4, 'connected', 'Connected', '#06b6d4', 4, 1),
(5, 'followup_required', 'Follow-up Required', '#f59e0b', 5, 1),
(6, 'interested', 'Interested', '#8b5cf6', 6, 1),
(7, 'docs_requested', 'Documents Requested', '#10b981', 7, 1),
(8, 'docs_received', 'Documents Received', '#14b8a6', 8, 1),
(9, 'appointment_scheduled', 'Appointment Scheduled', '#ec4899', 9, 1),
(10, 'eligibility_checking', 'Eligibility Checking', '#a855f7', 10, 1),
(11, 'scorecard_pending', 'Scorecard Pending', '#d97706', 11, 1),
(12, 'qualified', 'Qualified', '#059669', 12, 1),
(13, 'proposal_offered', 'Proposal / Service Offered', '#2563eb', 13, 1),
(14, 'payment_pending', 'Payment Pending', '#ef4444', 14, 1),
(15, 'payment_received', 'Payment Received', '#16a34a', 15, 1),
(16, 'application_started', 'Application Started', '#0284c7', 16, 1),
(17, 'converted', 'Converted Customer', '#22c55e', 17, 1),
(18, 'not_interested', 'Not Interested', '#64748b', 18, 1),
(19, 'not_eligible', 'Not Eligible', '#ef4444', 19, 1),
(20, 'lost', 'Lost Lead', '#475569', 20, 1);

SET FOREIGN_KEY_CHECKS = 1;
