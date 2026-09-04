-- ==========================================================================
-- DIGITAL UDYOG SEVA - DATABASE UPGRADE V13
-- LEAD MODULE 360° AUTOPILOT & ENTERPRISE WORKFLOW ENGINE
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Master Lead Sources Table (17+ Comprehensive Inbound & Partner Sources)
CREATE TABLE IF NOT EXISTS `lead_sources_master` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source_code` VARCHAR(50) UNIQUE NOT NULL,
  `source_name` VARCHAR(100) NOT NULL,
  `category` ENUM('Digital', 'Direct', 'Partner', 'Field', 'API', 'Other') DEFAULT 'Digital',
  `icon` VARCHAR(50) DEFAULT 'Globe',
  `is_active` TINYINT(1) DEFAULT 1,
  `auto_assign_enabled` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Sources
INSERT INTO `lead_sources_master` (`source_code`, `source_name`, `category`, `icon`) VALUES
('WEBSITE', 'Website Inbound Form', 'Digital', 'Globe'),
('GOOGLE_ADS', 'Google Search & PPC Ads', 'Digital', 'Search'),
('FB_INSTA_ADS', 'Facebook / Instagram Ads', 'Digital', 'Share2'),
('WHATSAPP_INBOUND', 'WhatsApp Direct Inbound', 'Digital', 'MessageSquare'),
('YOUTUBE', 'YouTube Channel Lead', 'Digital', 'Video'),
('INDIAMART', 'IndiaMART Verified Inbound', 'Partner', 'ShoppingBag'),
('JUSTDIAL', 'Justdial Direct Leads', 'Partner', 'PhoneCall'),
('REFERRAL', 'Client / Peer Referral', 'Direct', 'Users'),
('FRANCHISE', 'Franchise Partner Kendra', 'Partner', 'Store'),
('AGENT_BROKER', 'Registered Agent / DSA', 'Partner', 'Briefcase'),
('CA_CS_NETWORK', 'CA / CS Partner Network', 'Partner', 'Award'),
('BANK_PARTNER', 'Bank Loan Officer Referral', 'Partner', 'Landmark'),
('MACHINERY_PARTNER', 'Machinery & Equipment Supplier', 'Partner', 'Wrench'),
('MARKET_VISIT', 'Field & Market Visit', 'Field', 'MapPin'),
('CAMPAIGN_EVENT', 'Govt Expo / MSME Camp', 'Field', 'Calendar'),
('MANUAL_ENTRY', 'Backoffice Manual Entry', 'Direct', 'Edit3'),
('API_WEBHOOK', 'Third-Party API / Webhook', 'API', 'Code'),
('OTHER', 'Other Inbound Source', 'Other', 'HelpCircle')
ON DUPLICATE KEY UPDATE `source_name` = VALUES(`source_name`);

-- 2. Master Lead Statuses & Pipeline Stages (17-Stage Journey + Terminals)
CREATE TABLE IF NOT EXISTS `lead_statuses_master` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stage_code` VARCHAR(50) UNIQUE NOT NULL,
  `stage_name` VARCHAR(100) NOT NULL,
  `stage_type` ENUM('Active', 'Positive', 'Negative', 'Terminal') DEFAULT 'Active',
  `order_index` INT DEFAULT 1,
  `color_code` VARCHAR(20) DEFAULT '#2563eb',
  `badge_class` VARCHAR(50) DEFAULT 'badge-blue',
  `auto_task_trigger` VARCHAR(100) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Pipeline Stages
INSERT INTO `lead_statuses_master` (`stage_code`, `stage_name`, `stage_type`, `order_index`, `color_code`, `badge_class`, `auto_task_trigger`) VALUES
('NEW_LEAD', 'New Lead', 'Active', 1, '#3b82f6', 'badge-blue', 'TASK_AUTO_CALL_ATTEMPT'),
('CONTACT_ATTEMPTED', 'Contact Attempted', 'Active', 2, '#f59e0b', 'badge-amber', 'TASK_RETRY_CALL'),
('CONNECTED', 'Connected', 'Active', 3, '#10b981', 'badge-emerald', 'TASK_DISCUSS_REQUIREMENT'),
('REQ_DISCUSSED', 'Requirement Discussed', 'Active', 4, '#8b5cf6', 'badge-purple', 'TASK_PREPARE_ESTIMATE'),
('INTERESTED', 'Interested', 'Positive', 5, '#ec4899', 'badge-rose', 'TASK_SCHEDULE_FOLLOWUP'),
('FOLLOWUP', 'Follow-up Scheduled', 'Active', 6, '#f97316', 'badge-saffron', 'TASK_OVERDUE_ALERT'),
('APPOINTMENT', 'Appointment Booked', 'Positive', 7, '#06b6d4', 'badge-cyan', 'TASK_APPOINTMENT_REMINDER'),
('ESTIMATE_SENT', 'Estimate Sent', 'Active', 8, '#6366f1', 'badge-indigo', 'TASK_ESTIMATE_FEEDBACK'),
('PROPOSAL_SENT', 'Proposal Sent', 'Positive', 9, '#14b8a6', 'badge-teal', 'TASK_PROPOSAL_NEGOTIATE'),
('NEGOTIATION', 'Negotiation / Review', 'Active', 10, '#eab308', 'badge-amber', 'TASK_DISCOUNT_APPROVAL'),
('PAYMENT_PENDING', 'Payment Pending', 'Positive', 11, '#f43f5e', 'badge-rose', 'TASK_SEND_PAYMENT_LINK'),
('CONVERTED', 'Converted (Won)', 'Terminal', 12, '#15803d', 'badge-emerald', 'TASK_LAUNCH_CUSTOMER_PROJECT'),
('NOT_INTERESTED', 'Not Interested', 'Negative', 13, '#64748b', 'badge-slate', 'TASK_FEEDBACK_ARCHIVE'),
('LOST', 'Lost to Competitor', 'Negative', 14, '#dc2626', 'badge-rose', 'TASK_LOST_AUDIT'),
('INVALID', 'Invalid / Fake Inquiry', 'Terminal', 15, '#94a3b8', 'badge-slate', NULL),
('DUPLICATE', 'Duplicate Lead', 'Terminal', 16, '#94a3b8', 'badge-slate', NULL),
('DO_NOT_CONTACT', 'Do Not Contact (DND)', 'Terminal', 17, '#000000', 'badge-dark', NULL)
ON DUPLICATE KEY UPDATE `stage_name` = VALUES(`stage_name`);

-- 3. Lead Auto-Assignment Rules
CREATE TABLE IF NOT EXISTS `lead_assignment_rules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rule_name` VARCHAR(150) NOT NULL,
  `criteria_type` ENUM('Source', 'Service', 'District', 'Franchise', 'Workload_RoundRobin') NOT NULL,
  `criteria_value` VARCHAR(255) NOT NULL,
  `assigned_employee_id` INT NULL,
  `priority_order` INT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Lead Calls Desk & Recordings
CREATE TABLE IF NOT EXISTS `lead_calls` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `caller_id` INT NOT NULL,
  `call_type` ENUM('Outbound', 'Inbound') DEFAULT 'Outbound',
  `call_result` ENUM('Connected', 'Not Connected', 'Busy', 'Call Back', 'Interested', 'Not Interested', 'Wrong Number', 'Human Required') NOT NULL,
  `duration_seconds` INT DEFAULT 0,
  `recording_url` VARCHAR(255) DEFAULT NULL,
  `transcript` TEXT DEFAULT NULL,
  `ai_call_summary` TEXT DEFAULT NULL,
  `next_action` VARCHAR(255) DEFAULT NULL,
  `next_followup_datetime` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Lead Voice Notes (Voice to CRM Engine)
CREATE TABLE IF NOT EXISTS `lead_voice_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `audio_url` VARCHAR(255) DEFAULT NULL,
  `duration_seconds` INT DEFAULT 0,
  `raw_transcript` TEXT NOT NULL,
  `ai_extracted_intent` VARCHAR(255) DEFAULT NULL,
  `ai_extracted_service` VARCHAR(255) DEFAULT NULL,
  `ai_extracted_followup_time` VARCHAR(100) DEFAULT NULL,
  `action_status` ENUM('Processed', 'Task_Created', 'Note_Saved') DEFAULT 'Processed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Lead AI Auto-Response & Assistant Logs
CREATE TABLE IF NOT EXISTS `lead_ai_interactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `channel` ENUM('WhatsApp', 'SMS', 'Email', 'Portal') DEFAULT 'WhatsApp',
  `customer_message` TEXT,
  `ai_response_text` TEXT NOT NULL,
  `detected_service` VARCHAR(150) DEFAULT NULL,
  `lead_score_assigned` INT DEFAULT 50,
  `human_handover_triggered` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Lead Estimates & Quotations
CREATE TABLE IF NOT EXISTS `lead_estimates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `estimate_code` VARCHAR(50) UNIQUE NOT NULL,
  `lead_id` INT NOT NULL,
  `service_id` INT NULL,
  `service_name` VARCHAR(200) NOT NULL,
  `base_price` DECIMAL(12,2) NOT NULL,
  `quantity` INT DEFAULT 1,
  `discount_amount` DECIMAL(12,2) DEFAULT 0.00,
  `discount_percent` DECIMAL(5,2) DEFAULT 0.00,
  `taxable_amount` DECIMAL(12,2) NOT NULL,
  `gst_percent` DECIMAL(5,2) DEFAULT 18.00,
  `gst_amount` DECIMAL(12,2) NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Accepted', 'Revised', 'Cancelled') DEFAULT 'Draft',
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Lead Formal Proposals
CREATE TABLE IF NOT EXISTS `lead_proposals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `proposal_code` VARCHAR(50) UNIQUE NOT NULL,
  `lead_id` INT NOT NULL,
  `estimate_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `scope_of_work` TEXT NOT NULL,
  `deliverables` TEXT NOT NULL,
  `total_value` DECIMAL(12,2) NOT NULL,
  `valid_until` DATE NOT NULL,
  `status` ENUM('Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired') DEFAULT 'Draft',
  `sent_via` ENUM('WhatsApp', 'Email', 'Portal', 'Direct') DEFAULT 'WhatsApp',
  `opened_count` INT DEFAULT 0,
  `accepted_at` DATETIME DEFAULT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Lead Payments & Eligibility Fee
CREATE TABLE IF NOT EXISTS `lead_payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `receipt_no` VARCHAR(50) UNIQUE NOT NULL,
  `lead_id` INT NOT NULL,
  `payment_type` ENUM('Eligibility_Fee', 'Token_Advance', 'Milestone', 'Full_Payment') DEFAULT 'Token_Advance',
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_mode` VARCHAR(50) DEFAULT 'UPI',
  `transaction_ref` VARCHAR(100) DEFAULT NULL,
  `payment_link` VARCHAR(255) DEFAULT NULL,
  `terms_accepted` TINYINT(1) DEFAULT 1,
  `no_refund_consent` TINYINT(1) DEFAULT 1,
  `customer_ip` VARCHAR(50) DEFAULT '127.0.0.1',
  `status` ENUM('Pending', 'Verified', 'Failed', 'Refunded') DEFAULT 'Verified',
  `verified_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Lead Tasks & Autopilot Action Items
CREATE TABLE IF NOT EXISTS `lead_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `task_type` ENUM('Contact', 'Follow_up', 'Estimate', 'Proposal', 'Payment', 'Eligibility', 'Escalation', 'Outsource') DEFAULT 'Follow_up',
  `task_title` VARCHAR(255) NOT NULL,
  `task_description` TEXT,
  `assigned_staff_id` INT NOT NULL,
  `due_date` DATE NOT NULL,
  `due_time` TIME DEFAULT '12:00:00',
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  `status` ENUM('Pending', 'In_Progress', 'Completed', 'Overdue', 'Cancelled') DEFAULT 'Pending',
  `is_auto_generated` TINYINT(1) DEFAULT 1,
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Lead External Third-Party / Outsource Desk (CA / CS / Advocates)
CREATE TABLE IF NOT EXISTS `lead_external_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `external_user_name` VARCHAR(150) NOT NULL,
  `external_user_role` ENUM('Chartered_Accountant', 'Company_Secretary', 'Advocate', 'Financial_Consultant', 'Valuer') NOT NULL,
  `external_user_mobile` VARCHAR(20) NOT NULL,
  `external_user_email` VARCHAR(150) DEFAULT NULL,
  `task_scope` TEXT NOT NULL,
  `required_deliverable` VARCHAR(255) NOT NULL,
  `deadline_date` DATE NOT NULL,
  `payout_agreed` DECIMAL(10,2) DEFAULT 0.00,
  `submission_notes` TEXT,
  `submission_file_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Assigned', 'In_Review', 'Approved', 'Revision_Requested', 'Completed') DEFAULT 'Assigned',
  `approved_by_admin` TINYINT(1) DEFAULT 0,
  `assigned_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Lead Security & Audit Trail
CREATE TABLE IF NOT EXISTS `lead_audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `user_role` VARCHAR(50) DEFAULT 'Staff',
  `action_type` ENUM('Price_Change', 'Discount', 'Assignment', 'Status_Change', 'Document_Change', 'Payment_Update', 'Handover', 'Note_Add') NOT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `old_value` TEXT,
  `new_value` TEXT,
  `reason` VARCHAR(255) DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Lead Admin Control Settings & AI Knowledge Rules
CREATE TABLE IF NOT EXISTS `lead_admin_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Admin Master Settings
INSERT INTO `lead_admin_settings` (`setting_key`, `setting_value`, `description`) VALUES
('AUTOPILOT_AUTO_ASSIGN_ACTIVE', 'true', 'Enable automatic round-robin / rule-based assignment on lead arrival'),
('AUTOPILOT_AI_RESPONSE_ACTIVE', 'true', 'Enable automatic AI WhatsApp / SMS response on new lead arrival'),
('AUTOPILOT_OVERDUE_MINUTES', '120', 'Minutes before untouched lead triggers overdue alert to staff and senior'),
('AUTOPILOT_HOT_LEAD_SCORE_THRESHOLD', '80', 'Lead score threshold above which Senior RM alert is dispatched'),
('MAX_DISCOUNT_PERCENT_RM', '10.0', 'Maximum discount percentage a sales RM can offer without Admin approval'),
('AI_KNOWLEDGE_PMEGP', '{"service":"PMEGP Loan","eligibility":"Min 8th Pass for >10L, 18+ yrs","subsidy":"15% to 35%","max_limit":"50 Lakhs Manufacturing / 20 Lakhs Service","required_docs":["Aadhaar","PAN","Land/Rent Proof","Machinery Quotation","Education Cert"]}', 'Approved AI knowledge snippet for PMEGP loan inquiries'),
('AI_KNOWLEDGE_PVT_LTD', '{"service":"Pvt Ltd Company","directors":"Min 2 Directors & 2 Shareholders","capital":"No min paid-up capital","timeline":"7-10 working days","includes":["2 DSCs","2 DINs","SPICe+ MCA Approval","PAN & TAN","Bank A/c"]}', 'Approved AI knowledge snippet for Company Registration')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

SET FOREIGN_KEY_CHECKS = 1;
