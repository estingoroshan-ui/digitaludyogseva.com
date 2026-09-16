-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V14
-- LEAD 360° CREDIT UNDERWRITING, 7-PILLAR ELIGIBILITY & BANK BRIEF DOSSIER
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table for 7-Pillar Credit & Loan Eligibility Evaluations
CREATE TABLE IF NOT EXISTS `lead_eligibility_evaluations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  
  -- Pillar 1: Demographic & Personal
  `applicant_name` VARCHAR(150) NOT NULL,
  `applicant_mobile` VARCHAR(20) NOT NULL,
  `social_category` ENUM('General', 'Special') DEFAULT 'Special',
  `location_type` ENUM('Rural', 'Urban') DEFAULT 'Rural',
  `education_level` VARCHAR(50) DEFAULT 'Graduate',
  `dependents_count` INT DEFAULT 3,
  
  -- Pillar 2: Business Viability & Market
  `business_name` VARCHAR(150) NOT NULL,
  `business_sector` ENUM('Manufacturing', 'Service', 'Agro_Processing', 'Trading') DEFAULT 'Manufacturing',
  `experience_years` INT DEFAULT 3,
  `location_advantage` TINYINT(1) DEFAULT 1,
  `marketing_type` ENUM('B2B_Wholesale', 'Retail_Local', 'ECommerce_Online', 'Govt_Tender') DEFAULT 'B2B_Wholesale',
  
  -- Pillar 3: Financial Assets & Net Worth
  `monthly_income` DECIMAL(12,2) DEFAULT 45000.00,
  `family_annual_income` DECIMAL(12,2) DEFAULT 750000.00,
  `property_assets_val` DECIMAL(12,2) DEFAULT 3500000.00,
  `liquid_securities_val` DECIMAL(12,2) DEFAULT 600000.00,
  `total_liabilities_val` DECIMAL(12,2) DEFAULT 400000.00,
  `calculated_net_worth` DECIMAL(12,2) DEFAULT 3700000.00,
  `active_monthly_emi` DECIMAL(12,2) DEFAULT 12000.00,
  `foir_percent` INT DEFAULT 27,
  
  -- Pillar 4: CIBIL & Bureau Health
  `cibil_score` INT DEFAULT 740,
  `dpd_history` VARCHAR(20) DEFAULT '0',
  `has_loan_settlement` TINYINT(1) DEFAULT 0,
  `cibil_report_attached` TINYINT(1) DEFAULT 1,
  
  -- Pillar 5: Loan Approval Chances & Risk Tier
  `requested_project_cost` DECIMAL(12,2) NOT NULL DEFAULT 2500000.00,
  `promoter_margin_ready` DECIMAL(12,2) NOT NULL DEFAULT 250000.00,
  `sanction_probability_score` INT NOT NULL DEFAULT 85,
  `risk_tier` ENUM('Prime', 'Moderate', 'High_Risk') DEFAULT 'Prime',
  
  -- Pillar 6: Scheme Matching & Financial Structuring
  `best_matched_scheme` VARCHAR(150) NOT NULL DEFAULT 'PMEGP (35% Subsidy) + MLUPY (8% Interest)',
  `eligible_subsidy_percent` DECIMAL(5,2) DEFAULT 35.00,
  `estimated_grant_amount` DECIMAL(12,2) DEFAULT 875000.00,
  `bank_term_loan_amount` DECIMAL(12,2) DEFAULT 1625000.00,
  `bank_wc_limit_amount` DECIMAL(12,2) DEFAULT 625000.00,
  `interest_subvention_percent` DECIMAL(5,2) DEFAULT 8.00,
  
  -- Pillar 7: Bank Brief & Paid Audit Model
  `audit_fee_status` ENUM('Paid', 'Unpaid', 'Waived') DEFAULT 'Paid',
  `audit_fee_amount` DECIMAL(10,2) DEFAULT 999.00,
  `bank_brief_reference_no` VARCHAR(50) DEFAULT NULL,
  `ai_actionable_suggestions` TEXT DEFAULT NULL,
  `scheduled_cabin_id` VARCHAR(50) DEFAULT 'cabin-01',
  `appointment_datetime` DATETIME DEFAULT NULL,
  `evaluated_by_officer` VARCHAR(100) DEFAULT 'Senior Credit Underwriter',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Enhance Leads Table with Direct Score & Audit Columns
ALTER TABLE `leads` 
  ADD COLUMN IF NOT EXISTS `eligibility_score` INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `cibil_score` INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `net_worth` DECIMAL(12,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `best_scheme` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `subsidy_amount` DECIMAL(12,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `audit_fee_status` VARCHAR(20) DEFAULT 'Unpaid';

-- 3. Inbound Omnichannel Webhook Logs
CREATE TABLE IF NOT EXISTS `lead_omnichannel_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source_type` ENUM('Website', 'Meta_Ads', 'Google_Ads', 'Kendra_Franchise', 'App_Bot', 'WalkIn') NOT NULL,
  `prospect_name` VARCHAR(150) NOT NULL,
  `prospect_phone` VARCHAR(20) NOT NULL,
  `district` VARCHAR(100) DEFAULT 'Jaipur',
  `loan_requirement` VARCHAR(150) DEFAULT 'PMEGP Loan',
  `auto_whatsapp_dispatched` TINYINT(1) DEFAULT 1,
  `auto_sms_dispatched` TINYINT(1) DEFAULT 1,
  `app_link_sent` VARCHAR(255) DEFAULT 'https://digitaludyogseva.com/app',
  `audio_alert_played` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
