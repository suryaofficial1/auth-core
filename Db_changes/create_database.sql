CREATE SCHEMA `auth` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;

CREATE TABLE `auth`.`user_master` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `f_name` VARCHAR(200) NULL,
  `l_name` VARCHAR(500) NULL,
  `email` VARCHAR(500) NULL,
  `password` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;