-- ==============================================================================
-- DATABASE UPGRADE V12: ESTIMATE SERVICE & DOCUMENT MASTER SYSTEM
-- Digital Udyog Seva (DUS) Platform
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Upgrade `services` table with all master fields
ALTER TABLE `services` 
  ADD COLUMN IF NOT EXISTS `service_code` VARCHAR(50) NULL AFTER `category_id`,
  ADD COLUMN IF NOT EXISTS `other_charges` DECIMAL(10,2) DEFAULT 0.00 AFTER `prof_fee`,
  ADD COLUMN IF NOT EXISTS `is_gst_applicable` TINYINT(1) DEFAULT 1 AFTER `gst_rate`,
  ADD COLUMN IF NOT EXISTS `is_discount_allowed` TINYINT(1) DEFAULT 1 AFTER `final_price`,
  ADD COLUMN IF NOT EXISTS `expected_completion_time` VARCHAR(100) DEFAULT '3-5 Working Days' AFTER `processing_time`,
  ADD COLUMN IF NOT EXISTS `min_time` INT DEFAULT 1 AFTER `expected_completion_time`,
  ADD COLUMN IF NOT EXISTS `max_time` INT DEFAULT 7 AFTER `min_time`,
  ADD COLUMN IF NOT EXISTS `time_unit` ENUM('Hours', 'Days', 'Working Days') DEFAULT 'Working Days' AFTER `max_time`,
  ADD COLUMN IF NOT EXISTS `important_notes` TEXT NULL AFTER `terms`,
  ADD COLUMN IF NOT EXISTS `display_order` INT DEFAULT 0 AFTER `is_featured`,
  ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 2. Upgrade `service_categories` with display_order if missing
ALTER TABLE `service_categories`
  ADD COLUMN IF NOT EXISTS `sort_order` INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `status` ENUM('active','inactive') DEFAULT 'active';

-- 3. Relational Table: `service_required_documents`
CREATE TABLE IF NOT EXISTS `service_required_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `is_mandatory` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `service_id` (`service_id`),
  CONSTRAINT `fk_srv_req_docs_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Master Estimates Table: `estimates`
CREATE TABLE IF NOT EXISTS `estimates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `estimate_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `lead_id` INT NULL,
  `estimate_date` DATE NOT NULL,
  `valid_until` DATE NOT NULL,
  `status` ENUM('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted') DEFAULT 'draft',
  `currency` VARCHAR(10) DEFAULT 'INR',
  `total_govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `total_prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `total_other_charges` DECIMAL(10,2) DEFAULT 0.00,
  `subtotal` DECIMAL(10,2) DEFAULT 0.00,
  `discount_type` ENUM('fixed', 'percentage') DEFAULT 'fixed',
  `discount_rate` DECIMAL(10,2) DEFAULT 0.00,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `tax_amount` DECIMAL(10,2) DEFAULT 0.00,
  `grand_total` DECIMAL(10,2) DEFAULT 0.00,
  `advance_required` DECIMAL(10,2) DEFAULT 0.00,
  `balance_due` DECIMAL(10,2) DEFAULT 0.00,
  `client_notes` TEXT NULL,
  `terms_conditions` TEXT NULL,
  `created_by` INT NULL,
  `converted_order_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `customer_id` (`customer_id`),
  KEY `lead_id` (`lead_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_estimates_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Historical Item Snapshots: `estimate_items`
CREATE TABLE IF NOT EXISTS `estimate_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `estimate_id` INT NOT NULL,
  `service_id` INT NULL,
  `service_name` VARCHAR(255) NOT NULL,
  `service_code` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `other_charges` DECIMAL(10,2) DEFAULT 0.00,
  `gst_rate` DECIMAL(5,2) DEFAULT 18.00,
  `gst_amount` DECIMAL(10,2) DEFAULT 0.00,
  `quantity` INT DEFAULT 1,
  `total_price` DECIMAL(10,2) DEFAULT 0.00,
  `expected_time` VARCHAR(100) NULL,
  `required_docs_snapshot` LONGTEXT NULL,
  `sort_order` INT DEFAULT 0,
  KEY `estimate_id` (`estimate_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `fk_estimate_items_estimate` FOREIGN KEY (`estimate_id`) REFERENCES `estimates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Converted Service Orders Table: `service_orders`
CREATE TABLE IF NOT EXISTS `service_orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `estimate_id` INT NULL,
  `customer_id` INT NOT NULL,
  `order_date` DATE NOT NULL,
  `status` ENUM('pending', 'in_progress', 'under_review', 'completed', 'cancelled') DEFAULT 'pending',
  `payment_status` ENUM('unpaid', 'partially_paid', 'paid') DEFAULT 'unpaid',
  `total_govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `total_prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `total_other_charges` DECIMAL(10,2) DEFAULT 0.00,
  `subtotal` DECIMAL(10,2) DEFAULT 0.00,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `tax_amount` DECIMAL(10,2) DEFAULT 0.00,
  `grand_total` DECIMAL(10,2) DEFAULT 0.00,
  `advance_paid` DECIMAL(10,2) DEFAULT 0.00,
  `balance_due` DECIMAL(10,2) DEFAULT 0.00,
  `notes` TEXT NULL,
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `estimate_id` (`estimate_id`),
  KEY `customer_id` (`customer_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_service_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Service Order Items Table: `service_order_items`
CREATE TABLE IF NOT EXISTS `service_order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `service_id` INT NULL,
  `service_name` VARCHAR(255) NOT NULL,
  `service_code` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `govt_fee` DECIMAL(10,2) DEFAULT 0.00,
  `prof_fee` DECIMAL(10,2) DEFAULT 0.00,
  `other_charges` DECIMAL(10,2) DEFAULT 0.00,
  `gst_rate` DECIMAL(5,2) DEFAULT 18.00,
  `gst_amount` DECIMAL(10,2) DEFAULT 0.00,
  `quantity` INT DEFAULT 1,
  `total_price` DECIMAL(10,2) DEFAULT 0.00,
  `expected_time` VARCHAR(100) NULL,
  `required_docs_snapshot` LONGTEXT NULL,
  `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  `sort_order` INT DEFAULT 0,
  KEY `order_id` (`order_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `service_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 8. Add Permissions for Services and Orders if missing
INSERT IGNORE INTO `permissions` (`permission_key`, `module`, `description`) VALUES
('services_view', 'services', 'View Services & Documents catalog'),
('services_create', 'services', 'Create new services and document items'),
('services_edit', 'services', 'Edit service details, prices, and checklist'),
('services_delete', 'services', 'Delete services from catalog'),
('orders_view', 'orders', 'View converted service orders'),
('orders_manage', 'orders', 'Manage and update service orders');

SET FOREIGN_KEY_CHECKS = 1;
