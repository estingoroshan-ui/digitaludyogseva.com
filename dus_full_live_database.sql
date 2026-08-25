-- ==========================================================================
-- DIGITAL UDYOG SEVA (digitaludyogseva.com) - MASTER LIVE DATABASE SCHEMA & SEED
-- COMPATIBLE WITH MYSQL 5.7+ / 8.0+ & MARIADB 10.2+ (phpMyAdmin 1-Click Import)
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET TIME_ZONE = "+05:30";

-- Drop existing tables to ensure clean schema rebuild
DROP TABLE IF EXISTS `ticket_messages`, `support_tickets`, `training_materials`, `loan_financial_details`, `loan_applications`, `loan_schemes`, `case_checklist_status`, `case_status_history`, `cases`, `services`, `service_categories`, `website_settings`, `commission_transactions`, `commission_withdrawals`, `franchise_service_commissions`, `franchises`, `customer_business_profiles`, `customers`, `users`, `franchise_types`, `role_permissions`, `permissions`, `roles`;


-- 1. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_key` VARCHAR(50) UNIQUE NOT NULL,
  `role_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `roles` (`id`, `role_key`, `role_name`, `description`) VALUES
(1, 'super_admin', 'Super Administrator', 'Full system access and settings control'),
(2, 'case_manager', 'Case Processing Officer', 'Manages document verification and filing'),
(3, 'loan_consultant', 'Government Loan Consultant', 'Evaluates scorecards and prepares project reports'),
(4, 'franchise_partner', 'Franchise Network Partner', 'Local district representative and sales agent'),
(5, 'customer', 'End Customer User', 'Public client user account');

-- 2. Permissions Table
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `permission_key` VARCHAR(100) UNIQUE NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `permissions` (`id`, `permission_key`, `module`, `description`) VALUES
(1, 'manage_users', 'Users', 'Create and modify system users'),
(2, 'manage_cases', 'Services', 'Update service case status and stage'),
(3, 'manage_loans', 'Loans', 'Review loan scorecards and applications'),
(4, 'manage_franchise', 'Franchise', 'Approve franchise applications and wallets');

-- 3. Role Permissions Mapping
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Franchise Types
CREATE TABLE IF NOT EXISTS `franchise_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type_name` VARCHAR(100) NOT NULL,
  `tier_level` INT DEFAULT 1,
  `default_commission_rate` DECIMAL(5,2) DEFAULT 10.00,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `franchise_types` (`id`, `type_name`, `tier_level`, `default_commission_rate`) VALUES
(1, 'District Master Franchise', 1, 25.00),
(2, 'Tehsil / Block Partner', 2, 15.00),
(3, 'Digital Kendra / Village Agent', 3, 10.00);

-- 5. Users Table (Core Auth)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_type` ENUM('admin', 'staff', 'customer', 'franchise') NOT NULL DEFAULT 'customer',
  `role_id` INT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `mobile` VARCHAR(20) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'active',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Accounts (Passwords: Admin@123, Franchise@123, Customer@123)
INSERT IGNORE INTO `users` (`id`, `user_type`, `role_id`, `name`, `email`, `mobile`, `password_hash`, `status`) VALUES
(1, 'admin', 1, 'DUS System Admin', 'admin@digitaludyogseva.com', '9876500000', '$2y$10$eE8h5oKjV6B5eT6.Qe6K3eJ1pY8.R7sO0wY2pA1qX3yZ5wB7c9e12', 'active'),
(2, 'customer', 5, 'Rajesh Sharma', 'customer@digitaludyogseva.com', '9876500001', '$2y$10$eE8h5oKjV6B5eT6.Qe6K3eJ1pY8.R7sO0wY2pA1qX3yZ5wB7c9e12', 'active'),
(3, 'franchise', 4, 'Jaipur Digital Seva Kendra', 'franchise@digitaludyogseva.com', '9876500002', '$2y$10$eE8h5oKjV6B5eT6.Qe6K3eJ1pY8.R7sO0wY2pA1qX3yZ5wB7c9e12', 'active');

-- 6. Customers Profile Extension
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNIQUE NOT NULL,
  `customer_code` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT 'Rajasthan',
  `district` VARCHAR(100) DEFAULT 'Jaipur',
  `business_name` VARCHAR(200) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `customers` (`id`, `user_id`, `customer_code`, `name`, `mobile`, `email`, `state`, `district`, `business_name`) VALUES
(1, 2, 'CUST-2026-1001', 'Rajesh Sharma', '9876500001', 'customer@digitaludyogseva.com', 'Rajasthan', 'Jaipur', 'Sharma Trading Enterprise');

-- 7. Franchises Profile Extension
CREATE TABLE IF NOT EXISTS `franchises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `franchise_code` VARCHAR(50) UNIQUE NOT NULL,
  `user_id` INT UNIQUE NOT NULL,
  `franchise_type_id` INT NULL,
  `owner_name` VARCHAR(150) NOT NULL,
  `business_name` VARCHAR(200) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `pan` VARCHAR(20) DEFAULT NULL,
  `aadhaar_masked` VARCHAR(20) DEFAULT NULL,
  `gstin` VARCHAR(20) DEFAULT NULL,
  `address` TEXT,
  `state` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `security_amount` DECIMAL(12,2) DEFAULT 0.00,
  `wallet_balance` DECIMAL(12,2) DEFAULT 25000.00,
  `status` ENUM('pending', 'approved', 'suspended', 'rejected') DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`franchise_type_id`) REFERENCES `franchise_types`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `franchises` (`id`, `franchise_code`, `user_id`, `franchise_type_id`, `owner_name`, `business_name`, `mobile`, `email`, `state`, `district`, `city`, `pincode`, `wallet_balance`, `status`) VALUES
(1, 'F-JPR-101', 3, 1, 'Suresh Verma', 'Jaipur Digital Seva Kendra', '9876500002', 'franchise@digitaludyogseva.com', 'Rajasthan', 'Jaipur', 'Jaipur', '302001', 25000.00, 'approved');

-- 8. Website Settings Table
CREATE TABLE IF NOT EXISTS `website_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `website_settings` (`setting_key`, `setting_value`) VALUES
('site_title', 'Digital Udyog Seva | Business Registration, Tax & Government Loan Portal'),
('helpline_phone', '+91 98765 43210'),
('support_email', 'info@digitaludyogseva.com'),
('office_address', 'Digital Udyog Seva Complex, Main Tonk Road, Jaipur, Rajasthan - 302001'),
('managed_by_name', 'Digital Vyapar Seva'),
('managed_by_url', 'https://digitalvyaparseva.com/');

-- 9. Service Categories Table (14 Categories)
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) UNIQUE NOT NULL,
  `icon` VARCHAR(100) DEFAULT 'bi-box',
  `description` TEXT,
  `sort_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `sort_order`, `status`) VALUES
(1, 'GST & Tax Services', 'gst-tax-services', 'bi-file-earmark-text', 'GST Registration, Returns, LUT, Notice Reply & Tax Filings', 1, 'active'),
(2, 'Business Registration', 'business-registration', 'bi-building', 'Proprietorship, Partnership, Private Limited, OPC & LLP Setup', 2, 'active'),
(3, 'MSME & Licenses', 'msme-licenses', 'bi-patch-check', 'Udyam Registration, Update, Verification & MSME Support', 3, 'active'),
(4, 'Food Licenses (FSSAI)', 'food-licenses-fssai', 'bi-cup-hot', 'FSSAI Basic, State & Central Licenses, Renewals & Modifications', 4, 'active'),
(5, 'Income Tax (ITR)', 'income-tax-itr', 'bi-calculator', 'Individual, Salaried, Business, Partnership, Capital Gain & TDS Filings', 5, 'active'),
(6, 'Company Compliance', 'company-compliance', 'bi-shield-check', 'ROC Annual Filing, Director KYC, DIN, DSC & Office Changes', 6, 'active'),
(7, 'Trademark & IP', 'trademark-ip', 'bi-award', 'Trademark Search, Application, Objection Reply & Copyright', 7, 'active'),
(8, 'Digital Certificates', 'digital-certificates', 'bi-fingerprint', 'Digital Signature (DSC), PAN, TAN & Import Export Code (IEC)', 8, 'active'),
(9, 'Labour & Employment', 'labour-employment', 'bi-people', 'EPFO, ESIC, Labour License & Professional Tax Setup', 9, 'active'),
(10, 'Local Licenses', 'local-licenses', 'bi-geo-alt', 'Shop & Establishment, Trade License, Local Municipal Licenses', 10, 'active'),
(11, 'Loan & Finance', 'loan-finance', 'bi-bank', 'Government Loan Consultation, Mudra, PMEGP & Bank File Setup', 11, 'active'),
(12, 'Project Reports', 'project-reports', 'bi-journal-richtext', 'Bank Project Reports, Detailed Project Reports (DPR) & CMA Data', 12, 'active'),
(13, 'Document Services', 'document-services', 'bi-file-earmark-code', 'Rent Agreements, Deeds, Affidavits & Resolutions Drafting', 13, 'active'),
(14, 'Other Business Services', 'other-business-services', 'bi-gear-wide-connected', 'Custom Business Services & Special Consultancy', 14, 'active');

-- 10. Services Master Catalog
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) UNIQUE NOT NULL,
  `short_description` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `gst_rate` DECIMAL(5,2) DEFAULT 18.00,
  `final_price` DECIMAL(10,2) NOT NULL,
  `franchise_price` DECIMAL(10,2) DEFAULT 0.00,
  `franchise_commission_type` ENUM('fixed', 'percent') DEFAULT 'fixed',
  `franchise_commission_value` DECIMAL(10,2) DEFAULT 0.00,
  `processing_time` VARCHAR(100) DEFAULT '3-5 Business Days',
  `required_docs` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `services` 
  (`id`, `category_id`, `name`, `slug`, `short_description`, `govt_fee`, `prof_fee`, `gst_rate`, `final_price`, `franchise_price`, `franchise_commission_type`, `franchise_commission_value`, `processing_time`, `required_docs`, `status`) 
VALUES
(1, 3, 'MSME Udyam Registration', 'udyam-registration', 'Official Udyam MSME Registration Assistance Service', 0.00, 677.12, 18.00, 799.00, 599.00, 'fixed', 200.00, '1-2 Days', 'PAN Card, Aadhaar Card, Bank Details', 'active'),
(2, 1, 'GST Registration', 'gst-registration', 'New GST Registration for Proprietorship, Partnership & Companies', 0.00, 1270.34, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Days', 'PAN Card, Aadhaar, Photo, Address Proof', 'active'),
(3, 2, 'Private Limited Company Registration', 'private-limited-company-registration', 'Pvt Ltd Company Incorporation Assistance (RUN + SPICe+)', 2000.00, 4236.44, 18.00, 6999.00, 5799.00, 'fixed', 1200.00, '7-12 Days', 'Directors PAN, Aadhaar, Photo, Office NOC', 'active'),
(4, 7, 'Trademark Registration', 'trademark-registration', 'Trademark Application Filing (Form TM-A)', 4500.00, 2117.80, 18.00, 6999.00, 6399.00, 'fixed', 600.00, '3-5 Days', 'Brand Logo, ID Proof, User Affidavit', 'active'),
(5, 4, 'FSSAI Food Licence', 'fssai-food-licence', 'FSSAI Food License Registration Assistance', 100.00, 1185.59, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Days', 'Passport Photo, Photo ID, Address Proof', 'active'),
(6, 5, 'ITR Filing (Salaried & Business)', 'itr-filing-service', 'ITR-1 to ITR-4 Income Tax Return Filing', 0.00, 677.12, 18.00, 799.00, 599.00, 'fixed', 200.00, '1-2 Days', 'Form 16, PAN Card, Bank Statement', 'active'),
(7, 2, 'Proprietorship Setup Assistance', 'proprietorship-setup-assistance', 'Firm Setup (Udyam + GST + Shop Act Setup)', 0.00, 1270.34, 18.00, 1499.00, 1149.00, 'fixed', 350.00, '3-5 Days', 'PAN, Aadhaar, Photo, Utility Bill', 'active'),
(8, 2, 'Partnership Firm Documentation', 'partnership-firm-documentation', 'Partnership Deed Drafting & Registration', 500.00, 2117.80, 18.00, 2999.00, 2399.00, 'fixed', 600.00, '5-7 Days', 'Partners PAN & Aadhaar, Address Proof', 'active');

-- 11. Government Loan Schemes Catalog
CREATE TABLE IF NOT EXISTS `loan_schemes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `scheme_name` VARCHAR(200) NOT NULL,
  `scheme_type` VARCHAR(50) NOT NULL,
  `state` VARCHAR(100) DEFAULT 'Central Government',
  `department` VARCHAR(200) NOT NULL,
  `max_loan` DECIMAL(15,2) NOT NULL,
  `subsidy_details` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `loan_schemes` (`id`, `scheme_name`, `scheme_type`, `state`, `department`, `max_loan`, `subsidy_details`, `description`, `status`) VALUES
(1, 'PMEGP Capital Subsidy Loan Scheme', 'Central Scheme', 'All India', 'KVIC / Ministry of MSME', 5000000.00, 'Up to 35% Capital Subsidy', 'Prime Minister Employment Generation Programme for new manufacturing & service units.', 'active'),
(2, 'PM MUDRA Yojana (Shishu/Kishore/Tarun)', 'Central Scheme', 'All India', 'Ministry of Finance / Micro Units', 1000000.00, 'Collateral Free Collateral Credit', 'Collateral free loan for small vendors, traders, micro enterprises and shopkeepers.', 'active'),
(3, 'Mukhyamantri Laghu Udyog Protsahan Yojana (MLUPY)', 'State Scheme', 'Rajasthan', 'Industries Dept, Govt of Rajasthan', 10000000.00, 'Up to 8% Interest Subsidy', 'Interest subsidy scheme for new micro & small business setup in Rajasthan.', 'active'),
(4, 'PM Vishwakarma Scheme', 'Central Scheme', 'All India', 'Ministry of MSME', 300000.00, '5% Concessional Interest + Toolkit Grant', 'Financial & skill assistance for traditional artisans and craftspeople.', 'active'),
(5, 'Stand-Up India Scheme', 'Central Scheme', 'All India', 'SIDBI / Ministry of Finance', 10000000.00, 'Bank Credit Guarantee', 'Bank loans between 10 Lakhs to 1 Crore for SC/ST and Women entrepreneurs.', 'active');

-- 12. Cases Table (Service Applications Tracking)
CREATE TABLE IF NOT EXISTS `cases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `assigned_to` INT DEFAULT NULL,
  `current_stage` VARCHAR(100) DEFAULT 'Application Submitted',
  `department` VARCHAR(100) DEFAULT 'Document Verification Desk',
  `status` ENUM('submitted', 'in_review', 'processing', 'completed', 'rejected') DEFAULT 'submitted',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `cases` (`id`, `case_code`, `customer_id`, `service_id`, `current_stage`, `department`, `status`) VALUES
(1, 'DUS-2026-1001', 1, 2, 'Government Filing Desk', 'GST Verification Department', 'processing');

-- 13. Loan Applications Table
CREATE TABLE IF NOT EXISTS `loan_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `scheme_id` INT NOT NULL,
  `required_amount` DECIMAL(12,2) NOT NULL,
  `initial_score` INT DEFAULT 78,
  `result_category` VARCHAR(100) DEFAULT 'STRONG ELIGIBILITY',
  `status_stage` VARCHAR(100) DEFAULT 'Advisory Evaluation Completed',
  `scorecard_unlocked` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`scheme_id`) REFERENCES `loan_schemes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `loan_applications` (`id`, `application_code`, `customer_id`, `scheme_id`, `required_amount`, `initial_score`, `result_category`, `status_stage`, `scorecard_unlocked`) VALUES
(1, 'LOAN-2026-4001', 1, 1, 500000.00, 78, 'STRONG ELIGIBILITY', 'Advisory Evaluation Completed', 1);

-- 14. Support Tickets Table
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_code` VARCHAR(50) NOT NULL,
  `franchise_id` INT NULL,
  `customer_id` INT NULL,
  `user_id` INT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `status` ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Training Materials Table
CREATE TABLE IF NOT EXISTS `training_materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `video_url` VARCHAR(255) NULL,
  `pdf_file` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `training_materials` (`id`, `title`, `category`, `description`, `video_url`) VALUES
(1, 'How to Add Customers & 360 Profile', 'Customer Management', 'Step-by-step video guide on adding new customers and managing customer 360 profiles.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
(2, 'Submitting 5-Step Service Applications', 'Service Wizard', 'Learn how to select services, upload document checklists, and record payments.', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
(3, 'Understanding Franchise Commission & Ledger', 'Finance & Wallet', 'Detailed guide on commission approval, 5% TDS deduction, and payout withdrawals.', 'https://www.youtube.com/embed/dQw4w9WgXcQ');

SET FOREIGN_KEY_CHECKS = 1;
