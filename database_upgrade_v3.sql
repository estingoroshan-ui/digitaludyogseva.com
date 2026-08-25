-- Digital Udyog Seva - Advanced List-Based Lead CRM Migration (v3.0)
-- Adding database indexes & social lead campaign attribution fields

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Add social campaign & UTM fields to `leads` table if missing
ALTER TABLE `leads`
  ADD COLUMN IF NOT EXISTS `source_detail` VARCHAR(150) DEFAULT NULL AFTER `source_id`,
  ADD COLUMN IF NOT EXISTS `utm_source` VARCHAR(100) DEFAULT NULL AFTER `referral`,
  ADD COLUMN IF NOT EXISTS `utm_medium` VARCHAR(100) DEFAULT NULL AFTER `utm_source`,
  ADD COLUMN IF NOT EXISTS `utm_campaign` VARCHAR(100) DEFAULT NULL AFTER `utm_medium`,
  ADD COLUMN IF NOT EXISTS `lost_reason` TEXT DEFAULT NULL AFTER `notes`;

-- 2. Add performance indexes for high-volume lead queries
ALTER TABLE `leads`
  ADD INDEX IF NOT EXISTS `idx_leads_mobile` (`mobile`),
  ADD INDEX IF NOT EXISTS `idx_leads_code` (`lead_code`),
  ADD INDEX IF NOT EXISTS `idx_leads_status` (`status_id`),
  ADD INDEX IF NOT EXISTS `idx_leads_source` (`source_id`),
  ADD INDEX IF NOT EXISTS `idx_leads_assigned` (`assigned_employee_id`),
  ADD INDEX IF NOT EXISTS `idx_leads_created` (`created_at`);

-- 3. Add performance indexes for followups & appointments
ALTER TABLE `followups`
  ADD INDEX IF NOT EXISTS `idx_followups_date` (`followup_date`),
  ADD INDEX IF NOT EXISTS `idx_followups_status` (`status`),
  ADD INDEX IF NOT EXISTS `idx_followups_lead` (`lead_id`);

ALTER TABLE `appointments`
  ADD INDEX IF NOT EXISTS `idx_appts_date` (`appointment_date`),
  ADD INDEX IF NOT EXISTS `idx_appts_lead` (`lead_id`);

SET FOREIGN_KEY_CHECKS = 1;
