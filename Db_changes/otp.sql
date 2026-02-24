CREATE TABLE `auth`.`u_otp` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `ip` VARCHAR(500) NULL,
  `user_agent` VARCHAR(500) NULL,
  `otp` VARCHAR(45) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 0,
  `contact` VARCHAR(100) NOT NULL,
  `created_on` TIMESTAMP NULL,
  PRIMARY KEY (`id`));