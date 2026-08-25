-- Digital Udyog Seva (DUS) Master Database Schema
-- Compatible with MySQL 5.7+ / 8.0+ & MariaDB 10.2+

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_key` VARCHAR(50) UNIQUE NOT NULL,
  `role_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Permissions Table
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `permission_key` VARCHAR(100) UNIQUE NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

-- 5. Users Table (Core Auth for Admin, Staff, Customer, Franchise)
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

-- 6. Employees / Staff Extension Profile
CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNIQUE NOT NULL,
  `employee_code` VARCHAR(50) UNIQUE NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `reporting_to` INT DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Franchises Profile
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
  `joining_date` DATE DEFAULT NULL,
  `security_amount` DECIMAL(12,2) DEFAULT 0.00,
  `wallet_balance` DECIMAL(12,2) DEFAULT 0.00,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `account_no` VARCHAR(50) DEFAULT NULL,
  `ifsc` VARCHAR(20) DEFAULT NULL,
  `upi_id` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'suspended', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`franchise_type_id`) REFERENCES `franchise_types`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Lead Sources
CREATE TABLE IF NOT EXISTS `lead_sources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source_name` VARCHAR(100) UNIQUE NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Lead Statuses (Pipeline Config)
CREATE TABLE IF NOT EXISTS `lead_statuses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `status_key` VARCHAR(50) UNIQUE NOT NULL,
  `status_name` VARCHAR(100) NOT NULL,
  `color_code` VARCHAR(20) DEFAULT '#6366f1',
  `sort_order` INT DEFAULT 0,
  `is_system` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Service Categories
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) UNIQUE NOT NULL,
  `icon` VARCHAR(100) DEFAULT 'bi-briefcase',
  `description` TEXT,
  `sort_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (`parent_id`) REFERENCES `service_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Dynamic Services CMS
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `subcategory_id` INT DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) UNIQUE NOT NULL,
  `short_description` TEXT,
  `description` LONGTEXT,
  `featured_image` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT 'bi-gear',
  `govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `gst_rate` DECIMAL(5,2) DEFAULT 18.00,
  `final_price` DECIMAL(10,2) DEFAULT 0.00,
  `franchise_price` DECIMAL(10,2) DEFAULT 0.00,
  `franchise_commission_type` ENUM('fixed', 'percentage') DEFAULT 'fixed',
  `franchise_commission_value` DECIMAL(10,2) DEFAULT 0.00,
  `processing_time` VARCHAR(100) DEFAULT '3-5 Business Days',
  `required_docs` TEXT,
  `eligibility` TEXT,
  `faq_json` LONGTEXT,
  `terms` TEXT,
  `is_payment_required` BOOLEAN DEFAULT TRUE,
  `payment_timing` ENUM('upfront', 'post_approval', 'split') DEFAULT 'upfront',
  `assigned_department` VARCHAR(100) DEFAULT 'General',
  `is_featured` BOOLEAN DEFAULT FALSE,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Government Loan Schemes Master
CREATE TABLE IF NOT EXISTS `loan_schemes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `scheme_name` VARCHAR(200) NOT NULL,
  `scheme_type` ENUM('central', 'state') DEFAULT 'central',
  `state` VARCHAR(100) DEFAULT 'All India',
  `department` VARCHAR(150) NOT NULL,
  `official_url` VARCHAR(255) DEFAULT NULL,
  `description` LONGTEXT,
  `applicant_type` VARCHAR(150) DEFAULT 'Individual / Firm / MSME',
  `business_type` VARCHAR(150) DEFAULT 'Manufacturing / Service / Trading',
  `min_loan` DECIMAL(12,2) DEFAULT 10000.00,
  `max_loan` DECIMAL(12,2) DEFAULT 10000000.00,
  `subsidy_details` TEXT,
  `margin_req` VARCHAR(100) DEFAULT '10% to 25%',
  `min_age` INT DEFAULT 18,
  `max_age` INT DEFAULT 65,
  `min_cibil` INT DEFAULT 650,
  `income_criteria` TEXT,
  `vintage_req` VARCHAR(100) DEFAULT 'New or Existing',
  `required_docs` TEXT,
  `eligibility_rules` TEXT,
  `processing_steps` TEXT,
  `consultancy_charges` DECIMAL(10,2) DEFAULT 0.00,
  `scorecard_charges` DECIMAL(10,2) DEFAULT 499.00,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `start_date` DATE DEFAULT NULL,
  `expiry_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Leads CRM Table
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_code` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `alt_mobile` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `pincode` VARCHAR(10) DEFAULT NULL,
  `address` TEXT,
  `business_name` VARCHAR(200) DEFAULT NULL,
  `business_type` VARCHAR(100) DEFAULT NULL,
  `interested_service_id` INT DEFAULT NULL,
  `interested_loan_scheme_id` INT DEFAULT NULL,
  `required_loan_amount` DECIMAL(12,2) DEFAULT 0.00,
  `source_id` INT DEFAULT NULL,
  `campaign` VARCHAR(100) DEFAULT NULL,
  `franchise_id` INT DEFAULT NULL,
  `assigned_employee_id` INT DEFAULT NULL,
  `status_id` INT NOT NULL,
  `temperature` ENUM('hot', 'warm', 'cold') DEFAULT 'warm',
  `tags` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`interested_service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`interested_loan_scheme_id`) REFERENCES `loan_schemes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`source_id`) REFERENCES `lead_sources`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`status_id`) REFERENCES `lead_statuses`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Lead Timeline Activities
CREATE TABLE IF NOT EXISTS `lead_activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `activity_type` VARCHAR(50) NOT NULL, -- call, note, status_change, email, whatsapp, appointment
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Followups Reminders
CREATE TABLE IF NOT EXISTS `followups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `assigned_employee_id` INT NOT NULL,
  `followup_date` DATE NOT NULL,
  `followup_time` TIME DEFAULT '10:00:00',
  `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  `notes` TEXT,
  `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Customers Master Table (360 Degree View Anchor)
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNIQUE NOT NULL,
  `customer_code` VARCHAR(50) UNIQUE NOT NULL,
  `lead_id` INT DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `alt_mobile` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) NOT NULL,
  `pan` VARCHAR(20) DEFAULT NULL,
  `aadhaar_masked` VARCHAR(20) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `gender` ENUM('male', 'female', 'other') DEFAULT 'male',
  `state` VARCHAR(100) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `pincode` VARCHAR(10) DEFAULT NULL,
  `address` TEXT,
  `profile_completion` INT DEFAULT 60,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Customer Business Profile
CREATE TABLE IF NOT EXISTS `customer_business_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `business_name` VARCHAR(200) NOT NULL,
  `constitution` ENUM('proprietorship', 'partnership', 'llp', 'pvt_ltd', 'opc', 'trust', 'society', 'other') DEFAULT 'proprietorship',
  `industry` VARCHAR(100) DEFAULT NULL,
  `business_category` VARCHAR(100) DEFAULT NULL,
  `vintage_years` INT DEFAULT 0,
  `gstin` VARCHAR(20) DEFAULT NULL,
  `udyam_number` VARCHAR(50) DEFAULT NULL,
  `turnover_annual` DECIMAL(12,2) DEFAULT 0.00,
  `turnover_monthly` DECIMAL(12,2) DEFAULT 0.00,
  `profit_monthly` DECIMAL(12,2) DEFAULT 0.00,
  `employee_count` INT DEFAULT 1,
  `address` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. Appointments Schedule
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT DEFAULT NULL,
  `lead_id` INT DEFAULT NULL,
  `staff_id` INT NOT NULL,
  `appointment_type` VARCHAR(100) DEFAULT 'Phone Consultation',
  `appointment_date` DATE NOT NULL,
  `appointment_time` TIME NOT NULL,
  `duration_minutes` INT DEFAULT 30,
  `mode` ENUM('phone', 'video', 'office', 'document', 'loan', 'legal', 'ca') DEFAULT 'phone',
  `meeting_link` VARCHAR(255) DEFAULT NULL,
  `location` TEXT DEFAULT NULL,
  `notes` TEXT,
  `status` ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show') DEFAULT 'scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`staff_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. Loan Applications
CREATE TABLE IF NOT EXISTS `loan_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `scheme_id` INT NOT NULL,
  `franchise_id` INT DEFAULT NULL,
  `assigned_staff_id` INT DEFAULT NULL,
  `required_amount` DECIMAL(12,2) NOT NULL,
  `loan_purpose` VARCHAR(150) NOT NULL,
  `purpose_details` TEXT,
  `status_stage` VARCHAR(100) DEFAULT 'Application Received',
  `scorecard_id` INT DEFAULT NULL,
  `scorecard_payment_status` ENUM('pending', 'verified', 'waived') DEFAULT 'pending',
  `scorecard_unlocked` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`scheme_id`) REFERENCES `loan_schemes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_staff_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. Loan Financial Details
CREATE TABLE IF NOT EXISTS `loan_financial_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `loan_application_id` INT UNIQUE NOT NULL,
  `monthly_income` DECIMAL(12,2) DEFAULT 0.00,
  `existing_emi` DECIMAL(12,2) DEFAULT 0.00,
  `existing_loans_count` INT DEFAULT 0,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `avg_bank_balance` DECIMAL(12,2) DEFAULT 0.00,
  `turnover_last_yr` DECIMAL(12,2) DEFAULT 0.00,
  `itr_filed` BOOLEAN DEFAULT FALSE,
  `gst_filed` BOOLEAN DEFAULT FALSE,
  `loan_defaults_history` BOOLEAN DEFAULT FALSE,
  `notes` TEXT,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. Credit Consents
CREATE TABLE IF NOT EXISTS `credit_consents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `loan_application_id` INT DEFAULT NULL,
  `consent_given` BOOLEAN NOT NULL DEFAULT TRUE,
  `consent_text_version` VARCHAR(50) DEFAULT 'v1.0',
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. Credit Checks (API Ready / Manual Verification Fallback)
CREATE TABLE IF NOT EXISTS `credit_checks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `loan_application_id` INT DEFAULT NULL,
  `consent_id` INT DEFAULT NULL,
  `provider` VARCHAR(50) DEFAULT 'Manual Verification',
  `request_reference_id` VARCHAR(100) DEFAULT NULL,
  `score` INT DEFAULT NULL,
  `bureau_report_json` LONGTEXT,
  `check_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Not Checked', 'Consent Pending', 'Verification Requested', 'Under Review', 'Verified', 'Failed') DEFAULT 'Verification Requested',
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`consent_id`) REFERENCES `credit_consents`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 23. Scorecard Config Parameters
CREATE TABLE IF NOT EXISTS `scorecard_parameters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parameter_key` VARCHAR(50) UNIQUE NOT NULL,
  `parameter_name` VARCHAR(100) NOT NULL,
  `weightage` DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  `max_score` INT DEFAULT 10,
  `rule_condition_json` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 24. Scorecards Results
CREATE TABLE IF NOT EXISTS `scorecards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `scorecard_code` VARCHAR(50) UNIQUE NOT NULL,
  `loan_application_id` INT UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `total_score` INT NOT NULL DEFAULT 0,
  `result_category` ENUM('Strong Profile', 'Moderate Profile', 'Consultant Review Required', 'Improvement Required') DEFAULT 'Consultant Review Required',
  `recommendations` TEXT,
  `consultant_remarks` TEXT,
  `scorecard_fee` DECIMAL(10,2) DEFAULT 499.00,
  `payment_status` ENUM('pending', 'paid', 'verified') DEFAULT 'pending',
  `unlocked_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 25. Service Cases (Central Workflow Unit)
CREATE TABLE IF NOT EXISTS `cases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `service_id` INT DEFAULT NULL,
  `loan_application_id` INT DEFAULT NULL,
  `franchise_id` INT DEFAULT NULL,
  `assigned_staff_id` INT DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT 'Operations',
  `current_stage` VARCHAR(100) DEFAULT 'Application Received',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `sla_due_date` DATE DEFAULT NULL,
  `total_amount` DECIMAL(12,2) DEFAULT 0.00,
  `payment_status` ENUM('unpaid', 'partially_paid', 'paid', 'verified') DEFAULT 'unpaid',
  `status` ENUM('active', 'on_hold', 'completed', 'cancelled') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_staff_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 26. Case Stage Timeline History
CREATE TABLE IF NOT EXISTS `case_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `stage` VARCHAR(100) NOT NULL,
  `remarks` TEXT,
  `updated_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 27. Document Types Master
CREATE TABLE IF NOT EXISTS `document_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) UNIQUE NOT NULL,
  `is_required` BOOLEAN DEFAULT TRUE,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 28. Central Document Vault
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `case_id` INT DEFAULT NULL,
  `loan_application_id` INT DEFAULT NULL,
  `document_type_id` INT DEFAULT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_size` INT DEFAULT 0,
  `uploaded_by` INT DEFAULT NULL,
  `verification_status` ENUM('Requested', 'Uploaded', 'Under Verification', 'Approved', 'Rejected', 'Re-upload Required') DEFAULT 'Uploaded',
  `verified_by` INT DEFAULT NULL,
  `verification_remarks` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`document_type_id`) REFERENCES `document_types`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 29. Franchise Commission Rates per Service
CREATE TABLE IF NOT EXISTS `franchise_service_commissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `franchise_type_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `commission_type` ENUM('fixed', 'percentage') DEFAULT 'fixed',
  `commission_value` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`franchise_type_id`) REFERENCES `franchise_types`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 30. Franchise Commission Ledger
CREATE TABLE IF NOT EXISTS `commission_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_code` VARCHAR(50) UNIQUE NOT NULL,
  `franchise_id` INT NOT NULL,
  `customer_id` INT DEFAULT NULL,
  `service_id` INT DEFAULT NULL,
  `case_id` INT DEFAULT NULL,
  `gross_amount` DECIMAL(12,2) NOT NULL,
  `govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `commission_type` ENUM('fixed', 'percentage') DEFAULT 'fixed',
  `commission_rate` DECIMAL(10,2) DEFAULT 0.00,
  `commission_amount` DECIMAL(10,2) NOT NULL,
  `tds_amount` DECIMAL(10,2) DEFAULT 0.00,
  `net_commission` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'approved', 'available', 'paid', 'reversed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 31. Franchise Commission Withdrawals
CREATE TABLE IF NOT EXISTS `commission_withdrawals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `withdrawal_code` VARCHAR(50) UNIQUE NOT NULL,
  `franchise_id` INT NOT NULL,
  `requested_amount` DECIMAL(12,2) NOT NULL,
  `bank_details_snapshot` TEXT,
  `status` ENUM('pending', 'approved', 'paid', 'rejected') DEFAULT 'pending',
  `payment_reference` VARCHAR(100) DEFAULT NULL,
  `processed_by` INT DEFAULT NULL,
  `processed_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 32. Central Payments Master
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `case_id` INT DEFAULT NULL,
  `loan_application_id` INT DEFAULT NULL,
  `scorecard_id` INT DEFAULT NULL,
  `service_id` INT DEFAULT NULL,
  `franchise_id` INT DEFAULT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_mode` ENUM('online_razorpay', 'cash', 'bank_transfer', 'upi', 'cheque', 'wallet') DEFAULT 'online_razorpay',
  `gateway_name` VARCHAR(50) DEFAULT 'Razorpay',
  `transaction_reference` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('initiated', 'pending', 'paid', 'failed', 'offline_pending', 'verified', 'refunded') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`loan_application_id`) REFERENCES `loan_applications`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`scorecard_id`) REFERENCES `scorecards`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 33. Offline Payment Verifications Queue
CREATE TABLE IF NOT EXISTS `offline_payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_id` INT UNIQUE NOT NULL,
  `proof_file_path` VARCHAR(255) NOT NULL,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `payment_date` DATE NOT NULL,
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `verified_by` INT DEFAULT NULL,
  `verified_at` DATETIME DEFAULT NULL,
  `admin_remarks` TEXT,
  FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 34. Invoices & Receipts
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_no` VARCHAR(50) UNIQUE NOT NULL,
  `customer_id` INT NOT NULL,
  `payment_id` INT UNIQUE NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `tax_amount` DECIMAL(12,2) DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `pdf_path` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('issued', 'paid', 'cancelled') DEFAULT 'issued',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 35. Tasks Management
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT DEFAULT NULL,
  `customer_id` INT DEFAULT NULL,
  `case_id` INT DEFAULT NULL,
  `assigned_employee_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `due_date` DATE NOT NULL,
  `status` ENUM('to_do', 'in_progress', 'waiting', 'completed', 'cancelled') DEFAULT 'to_do',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 36. Support Tickets
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_no` VARCHAR(50) UNIQUE NOT NULL,
  `user_id` INT NOT NULL,
  `customer_id` INT DEFAULT NULL,
  `franchise_id` INT DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `subject` VARCHAR(200) NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `status` ENUM('open', 'assigned', 'in_progress', 'waiting_customer', 'resolved', 'closed') DEFAULT 'open',
  `assigned_staff_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`franchise_id`) REFERENCES `franchises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_staff_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 37. Ticket Messages Thread
CREATE TABLE IF NOT EXISTS `ticket_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `message` LONGTEXT NOT NULL,
  `file_attachment` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 38. Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 39. Audit Activity Logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `record_id` INT DEFAULT NULL,
  `details` TEXT,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 40. Global Website Settings
CREATE TABLE IF NOT EXISTS `website_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` LONGTEXT,
  `setting_group` VARCHAR(50) DEFAULT 'general'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- SEED INITIAL DATA
-- ========================================================

-- Roles
INSERT IGNORE INTO `roles` (`id`, `role_key`, `role_name`, `description`) VALUES
(1, 'super_admin', 'Super Admin', 'Full unrestricted system access'),
(2, 'admin', 'Admin', 'Administrative management permissions'),
(3, 'crm_manager', 'CRM Manager', 'Manages sales leads & followups'),
(4, 'loan_manager', 'Loan Manager', 'Manages government loan consultancy'),
(5, 'legal_executive', 'Legal Executive', 'Handles legal contracts & notices'),
(6, 'tax_executive', 'GST & Tax Executive', 'Handles GST & Tax filings'),
(7, 'franchise_manager', 'Franchise Manager', 'Manages franchise network & commissions'),
(8, 'accounts', 'Accounts & Finance', 'Verifies payments & payouts');

-- Seed Lead Sources
INSERT IGNORE INTO `lead_sources` (`id`, `source_name`) VALUES
(1, 'Website Form'), (2, 'Phone Call'), (3, 'WhatsApp'), (4, 'Franchise Referral'), (5, 'Google Ads'), (6, 'Walk-in Client');

-- Seed Lead Statuses
INSERT IGNORE INTO `lead_statuses` (`id`, `status_key`, `status_name`, `color_code`, `sort_order`, `is_system`) VALUES
(1, 'new_lead', 'New Lead', '#6366f1', 1, 1),
(2, 'contacted', 'Contact Attempted', '#3b82f6', 2, 1),
(3, 'connected', 'Connected', '#06b6d4', 3, 1),
(4, 'interested', 'Interested', '#8b5cf6', 4, 1),
(5, 'followup', 'Follow-Up', '#f59e0b', 5, 1),
(6, 'appointment', 'Appointment Scheduled', '#ec4899', 6, 1),
(7, 'docs_requested', 'Documents Requested', '#10b981', 7, 1),
(8, 'docs_received', 'Documents Received', '#14b8a6', 8, 1),
(9, 'payment_pending', 'Payment Pending', '#ef4444', 9, 1),
(10, 'converted', 'Converted', '#22c55e', 10, 1),
(11, 'lost', 'Lost', '#64748b', 11, 1);

-- Seed Service Categories
INSERT IGNORE INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`) VALUES
(1, 'Business Registration', 'business-registration', 'bi-building', 'Pvt Ltd, LLP, OPC, Partnership, MSME Udyam & Startup Registration'),
(2, 'GST & Tax Compliance', 'gst-tax-compliance', 'bi-receipt', 'GST Registration, Monthly/Annual GST Filing, ITR & TDS Returns'),
(3, 'Trademark & IP', 'trademark-intellectual-property', 'bi-award', 'Trademark Registration, Objection, Renewal & Copyright Protection'),
(4, 'Licences & Registrations', 'licences-registrations', 'bi-file-earmark-check', 'FSSAI Food License, ISO Certification, Import Export Code'),
(5, 'Legal Services', 'legal-services', 'bi-shield-check', 'Business Agreements, Legal Notices, Contracts & Consultation');

-- Seed Popular Services
INSERT IGNORE INTO `services` (`id`, `category_id`, `name`, `slug`, `short_description`, `govt_fee`, `prof_fee`, `final_price`, `franchise_commission_value`, `processing_time`, `assigned_department`) VALUES
(1, 1, 'Private Limited Company Registration', 'pvt-ltd-company-registration', 'Complete registration including DSC, DIN, Name Approval, MOA, AOA & PAN/TAN.', 1000.00, 3999.00, 5898.00, 1000.00, '7-10 Days', 'Company Law'),
(2, 1, 'MSME Udyam Registration', 'msme-udyam-registration', 'Get instant MSME registration to unlock government loan subsidies & benefits.', 0.00, 499.00, 588.00, 200.00, '1 Business Day', 'Registration'),
(3, 2, 'GST Registration Service', 'gst-registration-service', 'Hassle-free GST registration for companies, firms, and sole proprietors.', 0.00, 999.00, 1178.00, 300.00, '2-3 Days', 'Taxation'),
(4, 2, 'ITR Filing (Salaried & Business)', 'itr-filing-service', 'Expert CA filing of Income Tax Returns with maximum deduction optimization.', 0.00, 1499.00, 1768.00, 400.00, '1-2 Days', 'Taxation'),
(5, 3, 'Trademark Registration', 'trademark-registration', 'Protect your brand name, logo, or tagline under the Indian Trade Marks Act.', 4500.00, 1999.00, 7668.00, 1200.00, '1-2 Days (Application)', 'IPR'),
(6, 4, 'FSSAI Food License (Basic/State)', 'fssai-food-license', 'Food business registration and licensing for restaurants, manufacturers & shops.', 100.00, 1199.00, 1532.00, 350.00, '3-5 Days', 'Licensing');

-- Seed Government Loan Schemes
INSERT IGNORE INTO `loan_schemes` (`id`, `scheme_name`, `scheme_type`, `state`, `department`, `min_loan`, `max_loan`, `subsidy_details`, `description`) VALUES
(1, 'PMEGP (Prime Minister Employment Generation Programme)', 'central', 'All India', 'KVIC / MSME', 100000.00, 5000000.00, '15% to 35% Capital Subsidy', 'Govt credit-linked subsidy scheme for setting up new micro-enterprises in manufacturing & service sectors.'),
(2, 'PM MUDRA Yojana (Shishu, Kishore, Tarun)', 'central', 'All India', 'Ministry of Finance / Banks', 50000.00, 1000000.00, 'Collateral Free Business Loan', 'Provides collateral-free loans up to Rs 10 Lakhs to non-corporate, non-farm small/micro enterprises.'),
(3, 'Mukhyamantri Laghu Udyog Protsahan Yojana (MLUPY Rajasthan)', 'state', 'Rajasthan', 'Industries Department, Govt of Rajasthan', 100000.00, 100000000.00, '5% to 8% Interest Subsidy', 'Premier Rajasthan state scheme offering interest subvention for establishing new manufacturing & service units.'),
(4, 'PM Vishwakarma Scheme', 'central', 'All India', 'Ministry of MSME', 10000.00, 300000.00, '5% Concessional Interest + Skill Training', 'Special scheme providing financial & skill support for traditional artisans and craftspeople.'),
(5, 'Stand-Up India Scheme', 'central', 'All India', 'SIDBI / Banks', 1000000.00, 10000000.00, 'Bank Credit for SC/ST and Women Entrepreneurs', 'Facilitates bank loans between 10 Lakhs and 1 Crore for SC/ST or woman borrowers for greenfield enterprises.');

-- Seed Franchise Types
INSERT IGNORE INTO `franchise_types` (`id`, `type_name`, `tier_level`, `default_commission_rate`) VALUES
(1, 'State Franchise Partner', 1, 25.00),
(2, 'District Franchise Partner', 2, 20.00),
(3, 'City / Tehsil Partner', 3, 15.00);

-- Seed Scorecard Parameters
INSERT IGNORE INTO `scorecard_parameters` (`id`, `parameter_key`, `parameter_name`, `weightage`, `max_score`) VALUES
(1, 'cibil_score', 'Credit / CIBIL Score', 25.00, 25),
(2, 'vintage_years', 'Business Vintage & Track Record', 15.00, 15),
(3, 'turnover', 'Annual Turnover & Cash Flow', 15.00, 15),
(4, 'gst_itr_compliance', 'GST & ITR Compliance Status', 15.00, 15),
(5, 'existing_defaults', 'Loan Repayment History & Defaults', 15.00, 15),
(6, 'document_readiness', 'Project Report & KYC Document Readiness', 15.00, 15);

-- Seed Super Admin User (Password: admin123)
INSERT IGNORE INTO `users` (`id`, `user_type`, `role_id`, `name`, `email`, `mobile`, `password_hash`, `status`) VALUES
(1, 'admin', 1, 'Super Admin', 'admin@digitaludyogseva.com', '9999999999', '$2y$10$eE0m9S5xJk/mF32qVbH33eK1D1/4zVz2z2z2z2z2z2z2z2z2z2z2', 'active');

-- Seed Website Settings
INSERT IGNORE INTO `website_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('site_title', 'Digital Udyog Seva - Legal, Tax & Government Business Loan Portal', 'general'),
('helpline_phone', '+91 98765 43210', 'contact'),
('support_email', 'info@digitaludyogseva.com', 'contact'),
('office_address', 'Digital Udyog Seva Complex, Jaipur, Rajasthan - 302001', 'contact'),
('scorecard_fee', '499.00', 'finance'),
('razorpay_key_id', 'rzp_test_DUS123456', 'payment'),
('razorpay_key_secret', 'secret_key_dus_987654321', 'payment');
