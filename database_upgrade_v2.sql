-- Digital Udyog Seva - Enterprise Upgrade Database Migration (v2.0)
-- Safe ALTER TABLE and SEED SQL queries

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Upgrade `leads` table with detailed business, marketing attribution & priority fields
ALTER TABLE `leads` 
  ADD COLUMN IF NOT EXISTS `whatsapp_number` VARCHAR(20) DEFAULT NULL AFTER `alt_mobile`,
  ADD COLUMN IF NOT EXISTS `medium` VARCHAR(100) DEFAULT NULL AFTER `campaign`,
  ADD COLUMN IF NOT EXISTS `ad_name` VARCHAR(100) DEFAULT NULL AFTER `medium`,
  ADD COLUMN IF NOT EXISTS `referral` VARCHAR(100) DEFAULT NULL AFTER `ad_name`,
  ADD COLUMN IF NOT EXISTS `priority` ENUM('urgent', 'high', 'medium', 'low') DEFAULT 'medium' AFTER `temperature`,
  ADD COLUMN IF NOT EXISTS `estimated_value` DECIMAL(12,2) DEFAULT 0.00 AFTER `priority`,
  ADD COLUMN IF NOT EXISTS `probability_pct` INT DEFAULT 50 AFTER `estimated_value`,
  ADD COLUMN IF NOT EXISTS `business_type_constitution` VARCHAR(100) DEFAULT NULL AFTER `business_type`,
  ADD COLUMN IF NOT EXISTS `business_vintage_years` INT DEFAULT 0 AFTER `business_type_constitution`,
  ADD COLUMN IF NOT EXISTS `industry` VARCHAR(100) DEFAULT NULL AFTER `business_vintage_years`,
  ADD COLUMN IF NOT EXISTS `udyam_number` VARCHAR(50) DEFAULT NULL AFTER `industry`,
  ADD COLUMN IF NOT EXISTS `gstin` VARCHAR(20) DEFAULT NULL AFTER `udyam_number`,
  ADD COLUMN IF NOT EXISTS `annual_turnover` DECIMAL(12,2) DEFAULT 0.00 AFTER `gstin`,
  ADD COLUMN IF NOT EXISTS `monthly_sales` DECIMAL(12,2) DEFAULT 0.00 AFTER `annual_turnover`,
  ADD COLUMN IF NOT EXISTS `existing_loans_desc` TEXT DEFAULT NULL AFTER `monthly_sales`,
  ADD COLUMN IF NOT EXISTS `loan_purpose_desc` TEXT DEFAULT NULL AFTER `existing_loans_desc`;

-- 2. Upgrade `followups` table with detailed follow-up results & next actions
ALTER TABLE `followups`
  ADD COLUMN IF NOT EXISTS `followup_type` ENUM('call', 'whatsapp', 'meeting', 'video_call', 'email', 'office_visit', 'customer_visit', 'other') DEFAULT 'call' AFTER `assigned_employee_id`,
  ADD COLUMN IF NOT EXISTS `followup_result` VARCHAR(255) DEFAULT NULL AFTER `notes`,
  ADD COLUMN IF NOT EXISTS `customer_response` TEXT DEFAULT NULL AFTER `followup_result`,
  ADD COLUMN IF NOT EXISTS `next_action` TEXT DEFAULT NULL AFTER `customer_response`,
  ADD COLUMN IF NOT EXISTS `next_followup_date` DATE DEFAULT NULL AFTER `next_action`,
  ADD COLUMN IF NOT EXISTS `next_followup_time` TIME DEFAULT NULL AFTER `next_followup_date`,
  ADD COLUMN IF NOT EXISTS `reminder_sent` TINYINT(1) DEFAULT 0 AFTER `next_followup_time`;

-- 3. Upgrade `activity_logs` table with entity tracking
ALTER TABLE `activity_logs`
  ADD COLUMN IF NOT EXISTS `entity_type` VARCHAR(50) DEFAULT NULL AFTER `module`,
  ADD COLUMN IF NOT EXISTS `old_value` LONGTEXT DEFAULT NULL AFTER `details`,
  ADD COLUMN IF NOT EXISTS `new_value` LONGTEXT DEFAULT NULL AFTER `old_value`;

-- 4. Seed all 22 Default Lead Pipeline Stages in `lead_statuses`
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
(19, 'lost', 'Lost', '#475569', 19, 1),
(20, 'duplicate', 'Duplicate', '#334155', 20, 1),
(21, 'invalid', 'Invalid Lead', '#1e293b', 21, 1);

-- 5. Seed Additional Settings in `website_settings`
INSERT IGNORE INTO `website_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('company_name', 'Digital Udyog Seva', 'general'),
('footer_credit_text', 'Managed by Digital Vyapar Seva', 'general'),
('footer_credit_url', 'https://digitalvyaparseva.com/', 'general'),
('scorecard_discount_price', '299.00', 'finance'),
('scorecard_free_toggle', '0', 'finance'),
('whatsapp_api_enabled', '0', 'integration'),
('smtp_host', 'mail.digitaludyogseva.com', 'email');

SET FOREIGN_KEY_CHECKS = 1;
