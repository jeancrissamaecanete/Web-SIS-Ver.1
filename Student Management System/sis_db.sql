DROP DATABASE IF EXISTS `sis_db`;
CREATE DATABASE IF NOT EXISTS `sis_db`;
USE `sis_db`;

CREATE TABLE `course`(
code VARCHAR(10) NOT NULL,
name VARCHAR(50) NOT NULL,
college VARCHAR(45) NOT NULL,
PRIMARY KEY(code)
);

CREATE TABLE `college`(
code VARCHAR(10) NOT NULL,
name VARCHAR(50) NOT NULL,
PRIMARY KEY(code)
);

CREATE TABLE `students`(
id VARCHAR(9) NOT NULL,
firstname VARCHAR(50) NOT NULL,
middlename VARCHAR(20) NOT NULL,
lastname VARCHAR(20) NOT NULL,
year INT(1) NOT NULL,
gender VARCHAR(10) NOT NULL,
coursecode VARCHAR(10) NOT NULL,
collegecode VARCHAR(10),
PRIMARY KEY(id),
FOREIGN KEY(coursecode) REFERENCES course(code),
FOREIGN KEY(collegecode) REFERENCES college(code)
);

INSERT INTO `college`(`code`, `name`)
VALUES ('CCS', 'College of Computer Studies');

INSERT INTO `course`(`code`, `name`, `college`)
VALUES ('BSCS', 'Bachelor of Science in Computer Science', 'CCS'),
       ('BSIT', 'Bachelor of Science in Information Technology', 'CCS');

INSERT INTO `students` (`id`, `firstname`, `middlename`, `lastname`, `year`, `gender`, `coursecode`, `collegecode`) 
VALUES ('2020-1570', 'Jean Crissa Mae', 'Eniola', 'Cañete', '3', 'Female', 'BSCS', 'CCS');