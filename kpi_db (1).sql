-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2025 at 07:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kpi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `aspnetroleclaims`
--

CREATE TABLE `aspnetroleclaims` (
  `Id` int(11) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aspnetroles`
--

CREATE TABLE `aspnetroles` (
  `Id` varchar(255) NOT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `NormalizedName` varchar(256) DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspnetroles`
--

INSERT INTO `aspnetroles` (`Id`, `Name`, `NormalizedName`, `ConcurrencyStamp`) VALUES
('0a5fad89-e8d4-4a07-a903-1e9b6b310f95', 'Lecturer', 'LECTURER', NULL),
('360b3cd2-4414-49f4-8296-8381a1d8a6fc', 'HOD', 'HOD', NULL),
('3be6b572-40e3-4d64-a28f-6e4300e57b4d', 'Admin', 'ADMIN', NULL),
('b6341ded-7597-4bad-acd6-0059976f3ae0', 'Dean', 'DEAN', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `aspnetuserclaims`
--

CREATE TABLE `aspnetuserclaims` (
  `Id` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aspnetuserlogins`
--

CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(255) NOT NULL,
  `ProviderKey` varchar(255) NOT NULL,
  `ProviderDisplayName` longtext DEFAULT NULL,
  `UserId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aspnetuserroles`
--

CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspnetuserroles`
--

INSERT INTO `aspnetuserroles` (`UserId`, `RoleId`) VALUES
('10351808-fe0d-43c8-84f8-8733476487df', '0a5fad89-e8d4-4a07-a903-1e9b6b310f95'),
('324cccfb-8911-4d75-adb8-7014c6ff1bba', '3be6b572-40e3-4d64-a28f-6e4300e57b4d'),
('50759ffc-7dca-459e-b604-f71fcea6efe7', '360b3cd2-4414-49f4-8296-8381a1d8a6fc'),
('70ad7d54-8d09-4655-a1b7-2cda0457d247', '0a5fad89-e8d4-4a07-a903-1e9b6b310f95'),
('7520b09c-4c19-41aa-bed4-412f1e9a7fbb', '0a5fad89-e8d4-4a07-a903-1e9b6b310f95'),
('864f163c-051a-4933-9ec8-e467ce6428d7', '0a5fad89-e8d4-4a07-a903-1e9b6b310f95'),
('a661ca71-c1a9-4a9a-8bdf-93cc3d1bd438', 'b6341ded-7597-4bad-acd6-0059976f3ae0'),
('bc7de5d6-2941-4f93-893d-e092d118d288', '0a5fad89-e8d4-4a07-a903-1e9b6b310f95'),
('d1c2c7c8-ebe7-4419-9154-ded3243f6834', '360b3cd2-4414-49f4-8296-8381a1d8a6fc'),
('eb37159e-8d0d-454b-a044-4d46caccd00f', '360b3cd2-4414-49f4-8296-8381a1d8a6fc');

-- --------------------------------------------------------

--
-- Table structure for table `aspnetusers`
--

CREATE TABLE `aspnetusers` (
  `Id` varchar(255) NOT NULL,
  `FullName` longtext NOT NULL,
  `DepartmentId` int(11) DEFAULT NULL,
  `UserName` varchar(256) DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `Email` varchar(256) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext DEFAULT NULL,
  `SecurityStamp` longtext DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL,
  `PhoneNumber` longtext DEFAULT NULL,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspnetusers`
--

INSERT INTO `aspnetusers` (`Id`, `FullName`, `DepartmentId`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`, `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`, `PhoneNumber`, `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnd`, `LockoutEnabled`, `AccessFailedCount`) VALUES
('10351808-fe0d-43c8-84f8-8733476487df', 'Dr. Alice Johnson', 3, 'lecturer3@cbu.ac.zm', 'LECTURER3@CBU.AC.ZM', 'lecturer3@cbu.ac.zm', 'LECTURER3@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEDnNGRSZWt7Sj9rEIU+g8aR1ahJi4HEpBz9ssX9uAnwUEpd7hAtT7nISDAOAxK3zLg==', '323RBCVY6XWCCANMAZVXMICO7UJGJ76M', '6f19d708-4513-4d6a-90e8-2523f0463174', NULL, 0, 0, NULL, 1, 0),
('324cccfb-8911-4d75-adb8-7014c6ff1bba', 'System Administrator', NULL, 'admin@cbu.ac.zm', 'ADMIN@CBU.AC.ZM', 'admin@cbu.ac.zm', 'ADMIN@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEJKhrdxatJn0G7a0x5SpBwdy+ZEmmDhe14qw1G2cRUk0HQFDsHYLJUxyQRhCMcXS1A==', '46CGI3YDUZXYUPSRCAY5CUQS7OUIZLSH', '977db120-ef06-4c1a-b3fa-3d6086e46a37', NULL, 0, 0, NULL, 1, 0),
('50759ffc-7dca-459e-b604-f71fcea6efe7', 'Dr. Computer Engineering HOD', 2, 'hod.ce@cbu.ac.zm', 'HOD.CE@CBU.AC.ZM', 'hod.ce@cbu.ac.zm', 'HOD.CE@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEClkByySyJ5Fi6RXMGP0sEid6WMIoxbdLOeh3SWYAHpIvWbobOu9sQu/UWbdN3sv5g==', 'F73DAHEXT2Y2PAKZ2JDQTV4472QVIQCO', '89403be6-bb66-4ae4-bca0-93ec149c7021', NULL, 0, 0, NULL, 1, 0),
('70ad7d54-8d09-4655-a1b7-2cda0457d247', 'Dr. Jane Smith', 1, 'lecturer1@cbu.ac.zm', 'LECTURER1@CBU.AC.ZM', 'lecturer1@cbu.ac.zm', 'LECTURER1@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEGUe5g1QP1QAF4TUkEhN2UoVKkWK192JAYAlIvchIlLoNm4/HM7CrMcWMEbC2PX0cw==', 'X5XYND2ZFW3HVTBM3GV2UHKIFGTLUX4O', '37ed0906-22dc-4e6e-b112-6c59a738fa43', NULL, 0, 0, NULL, 1, 0),
('7520b09c-4c19-41aa-bed4-412f1e9a7fbb', 'Dr. John Doe', 2, 'lecturer2@cbu.ac.zm', 'LECTURER2@CBU.AC.ZM', 'lecturer2@cbu.ac.zm', 'LECTURER2@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEG6n0MrvPfjqa8NsQfduV6yjLTHeokE383L03BYdVDCh2tx0CLmnFZBzsC7/6m89iA==', '3B4M3JG2NVVPPOYFRMTPLTMPBZSLIOK2', '4795eb1a-ff5e-4748-9a89-3117ffbcc0e1', NULL, 0, 0, NULL, 1, 0),
('864f163c-051a-4933-9ec8-e467ce6428d7', 'Test Lecturer', NULL, 'lecturer@cbu.ac.zm', 'LECTURER@CBU.AC.ZM', 'lecturer@cbu.ac.zm', 'LECTURER@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAECICspUxPV3Rc51wRGIEUBdIL0ClrDjWL+2zSc4ZUyQ3Cbefo/LXNHG549Cm4syGAA==', '7S2KCLKEGAUPUY5UDSFEON6EDSVUCQCM', '425b51dd-7175-4091-acf6-0e6191deb220', NULL, 0, 0, NULL, 1, 0),
('a661ca71-c1a9-4a9a-8bdf-93cc3d1bd438', 'Dean of School of ICT', NULL, 'dean@cbu.ac.zm', 'DEAN@CBU.AC.ZM', 'dean@cbu.ac.zm', 'DEAN@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAELfU5eIxz3cij1cTl2O1fkhK0EiV/GujpUF5zCf9oNN0evGvuFyinaG/smchjLQgxA==', '3TG5FU23QBJ7EMYF6GUKKO3K74RITBVG', '935faf90-8989-43de-90e3-7de2eca24c24', NULL, 0, 0, NULL, 1, 0),
('bc7de5d6-2941-4f93-893d-e092d118d288', 'Mr. Scott', 1, 'scott@cbu.ac.zm', 'SCOTT@CBU.AC.ZM', 'scott@cbu.ac.zm', 'SCOTT@CBU.AC.ZM', 0, 'AQAAAAIAAYagAAAAEDYX2JXPtRxs7+SDZSZOO55h2euD0XtzzdzSXIlKLgvfswUEVEbIFR0UR/XvZgUeWg==', 'I4XQAMAACN3DI6MB5GR2ISC6VYEUYV6G', '7cc96c6d-b47d-44ca-a586-e85432cfbb4a', NULL, 0, 0, NULL, 1, 0),
('d1c2c7c8-ebe7-4419-9154-ded3243f6834', 'Dr. Information Systems HOD', 3, 'hod.is@cbu.ac.zm', 'HOD.IS@CBU.AC.ZM', 'hod.is@cbu.ac.zm', 'HOD.IS@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEHEHohjUai+LWQ5YtwVelfwTXsLHK3bFGFp1BgTWzBbtGpvqzejzyQ0ZIsZi2Mg7Lg==', 'AY6QHKAN2F6ECC3HFRWW22LELZBPRDYS', 'edbf800d-e9a1-46ef-ae60-0147b36d3263', NULL, 0, 0, NULL, 1, 0),
('eb37159e-8d0d-454b-a044-4d46caccd00f', 'Dr. Computer Science HOD', 1, 'hod.cs@cbu.ac.zm', 'HOD.CS@CBU.AC.ZM', 'hod.cs@cbu.ac.zm', 'HOD.CS@CBU.AC.ZM', 1, 'AQAAAAIAAYagAAAAEKcCiKQLtA+tx4ejJhl9GAU+O1bW/EIMmtLq7DJAWjhyxpB8MRfHxGQrncjEdIxJ0Q==', '5GI6RB4OTOPU4QBQ5HZRZUXS5AA3LG7S', 'e1f4d0c6-662b-4763-81d6-d2e37b81839a', NULL, 0, 0, NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `aspnetusertokens`
--

CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(255) NOT NULL,
  `LoginProvider` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Value` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`Id`, `Name`) VALUES
(2, 'Computer Engineering'),
(1, 'Computer Science'),
(3, 'Information Systems');

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `Id` int(11) NOT NULL,
  `LecturerId` varchar(255) NOT NULL,
  `HodId` varchar(255) DEFAULT NULL,
  `KpiId` int(11) NOT NULL,
  `Score` decimal(5,2) NOT NULL,
  `Comments` varchar(1000) DEFAULT NULL,
  `EvaluatedAt` datetime(6) NOT NULL,
  `Status` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluations`
--

INSERT INTO `evaluations` (`Id`, `LecturerId`, `HodId`, `KpiId`, `Score`, `Comments`, `EvaluatedAt`, `Status`) VALUES
(1, '70ad7d54-8d09-4655-a1b7-2cda0457d247', 'eb37159e-8d0d-454b-a044-4d46caccd00f', 1, 67.00, 'only lectured 2 out of 3 courses', '2025-09-17 17:07:16.622605', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `kpiassignments`
--

CREATE TABLE `kpiassignments` (
  `Id` int(11) NOT NULL,
  `KpiId` int(11) NOT NULL,
  `LecturerId` varchar(255) NOT NULL,
  `AcademicYear` varchar(255) NOT NULL,
  `Semester` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kpiassignments`
--

INSERT INTO `kpiassignments` (`Id`, `KpiId`, `LecturerId`, `AcademicYear`, `Semester`) VALUES
(3, 1, '50759ffc-7dca-459e-b604-f71fcea6efe7', '2025', '1'),
(1, 1, '70ad7d54-8d09-4655-a1b7-2cda0457d247', '2025', '1'),
(4, 1, '7520b09c-4c19-41aa-bed4-412f1e9a7fbb', '2025', '1'),
(2, 1, 'bc7de5d6-2941-4f93-893d-e092d118d288', '2025', '1');

-- --------------------------------------------------------

--
-- Table structure for table `kpis`
--

CREATE TABLE `kpis` (
  `Id` int(11) NOT NULL,
  `Title` longtext NOT NULL,
  `Description` longtext DEFAULT NULL,
  `Weight` decimal(5,4) NOT NULL,
  `CreatedByHodId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kpis`
--

INSERT INTO `kpis` (`Id`, `Title`, `Description`, `Weight`, `CreatedByHodId`) VALUES
(1, 'TEACHING', 'lecture a maximum of 3 courses', 1.0000, '324cccfb-8911-4d75-adb8-7014c6ff1bba');

-- --------------------------------------------------------

--
-- Table structure for table `standardworkplans`
--

CREATE TABLE `standardworkplans` (
  `Id` int(11) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Description` varchar(1000) NOT NULL,
  `AcademicYear` varchar(50) NOT NULL,
  `Semester` varchar(50) NOT NULL,
  `TargetRole` varchar(50) NOT NULL,
  `TeachingActivities` longtext NOT NULL,
  `ResearchActivities` longtext NOT NULL,
  `ServiceActivities` longtext NOT NULL,
  `AdministrativeActivities` longtext NOT NULL,
  `ProfessionalDevelopment` longtext NOT NULL,
  `Objectives` longtext NOT NULL,
  `ExpectedOutcomes` longtext NOT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `CreatedById` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `standardworkplans`
--

INSERT INTO `standardworkplans` (`Id`, `Title`, `Description`, `AcademicYear`, `Semester`, `TargetRole`, `TeachingActivities`, `ResearchActivities`, `ServiceActivities`, `AdministrativeActivities`, `ProfessionalDevelopment`, `Objectives`, `ExpectedOutcomes`, `IsActive`, `CreatedAt`, `UpdatedAt`, `CreatedById`) VALUES
(1, 'HOD Academic Leadership Plan 2024/2025', 'Comprehensive workplan for HOD responsibilities including department management, academic oversight, and strategic planning.', '2024/2025', 'Full Year', 'HOD', 'Oversee teaching quality, curriculum development, and faculty development programs. Monitor course delivery and student satisfaction.', 'Promote departmental research initiatives, supervise postgraduate students, and facilitate research collaborations.', 'Lead department meetings, participate in faculty committees, and represent department in university forums.', 'Manage department budget, oversee staff recruitment, conduct performance reviews, and handle student affairs.', 'Attend leadership workshops, pursue advanced qualifications, and participate in academic conferences.', '1. Improve departmental ranking\n2. Increase research output\n3. Enhance student satisfaction\n4. Develop staff capabilities', 'Improved department performance, increased research publications, better student outcomes, and enhanced staff satisfaction.', 1, '2025-09-17 15:49:57.028149', NULL, NULL),
(2, 'Lecturer Teaching & Research Plan 2024/2025', 'Standard workplan for lecturers focusing on teaching excellence, research productivity, and service contributions.', '2024/2025', 'Full Year', 'Lecturer', 'Deliver assigned courses effectively, develop course materials, assess student learning, and provide academic guidance.', 'Conduct research in area of specialization, publish research findings, and supervise student projects.', 'Participate in departmental committees, contribute to curriculum review, and engage in community outreach.', 'Maintain accurate records, participate in faculty meetings, and contribute to quality assurance processes.', 'Attend training workshops, pursue professional certifications, and engage in peer learning activities.', '1. Achieve excellent teaching ratings\n2. Publish research papers\n3. Complete assigned service tasks\n4. Enhance professional skills', 'High teaching effectiveness, quality research output, meaningful service contributions, and continuous professional growth.', 1, '2025-09-17 15:49:57.028201', NULL, NULL),
(3, 'Semester 1 Teaching Focus Plan 2024/2025', 'Focused workplan for lecturers during the first semester with emphasis on course delivery and student engagement.', '2024/2025', '1', 'Lecturer', 'Prepare and deliver lectures, conduct tutorials, grade assignments, and provide student feedback for semester 1 courses.', 'Continue ongoing research projects, prepare research proposals, and analyze data from current studies.', 'Participate in orientation programs, contribute to recruitment activities, and serve on assigned committees.', 'Update course outlines, maintain attendance records, and prepare semester reports.', 'Attend semester training sessions, participate in teaching excellence workshops, and engage in peer observations.', '1. Complete semester 1 teaching requirements\n2. Maintain research momentum\n3. Support new student integration\n4. Improve teaching methods', 'Successful completion of semester 1 courses, continued research progress, effective student support, and enhanced teaching skills.', 1, '2025-09-17 15:49:57.028202', NULL, NULL),
(4, 'HOD Strategic Planning 2024/2025', 'Strategic workplan for HODs focusing on long-term departmental development and innovation.', '2024/2025', 'Full Year', 'HOD', 'Oversee curriculum innovation, promote active learning methodologies, and ensure quality teaching standards.', 'Develop research strategy, secure research funding, and establish industry partnerships for research collaboration.', 'Lead strategic planning committees, participate in university governance, and engage with external stakeholders.', 'Develop department policies, manage resource allocation, and oversee infrastructure development.', 'Participate in leadership development programs, attend international conferences, and build professional networks.', '1. Develop 5-year strategic plan\n2. Secure external funding\n3. Establish industry partnerships\n4. Enhance department reputation', 'Clear strategic direction, increased funding opportunities, stronger industry connections, and improved department visibility.', 1, '2025-09-17 15:49:57.028202', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workplanassignments`
--

CREATE TABLE `workplanassignments` (
  `Id` int(11) NOT NULL,
  `StandardWorkplanId` int(11) NOT NULL,
  `AssigneeId` varchar(255) NOT NULL,
  `AssignedById` varchar(255) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `AssignedAt` datetime(6) NOT NULL,
  `StartedAt` datetime(6) DEFAULT NULL,
  `CompletedAt` datetime(6) DEFAULT NULL,
  `ReviewedAt` datetime(6) DEFAULT NULL,
  `AssignmentNotes` longtext DEFAULT NULL,
  `CompletionNotes` longtext DEFAULT NULL,
  `ReviewFeedback` longtext DEFAULT NULL,
  `Progress` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workplanassignments`
--

INSERT INTO `workplanassignments` (`Id`, `StandardWorkplanId`, `AssigneeId`, `AssignedById`, `Status`, `AssignedAt`, `StartedAt`, `CompletedAt`, `ReviewedAt`, `AssignmentNotes`, `CompletionNotes`, `ReviewFeedback`, `Progress`, `IsActive`) VALUES
(1, 2, '70ad7d54-8d09-4655-a1b7-2cda0457d247', 'eb37159e-8d0d-454b-a044-4d46caccd00f', 'Assigned', '2025-09-17 15:54:35.424517', NULL, NULL, NULL, '', NULL, NULL, 0, 1),
(2, 1, 'eb37159e-8d0d-454b-a044-4d46caccd00f', 'a661ca71-c1a9-4a9a-8bdf-93cc3d1bd438', 'Completed', '2025-09-17 16:00:32.019270', '2025-09-17 16:58:46.852940', '2025-09-17 17:00:21.246817', NULL, '', 'done with this shit', NULL, 100, 1),
(3, 3, '70ad7d54-8d09-4655-a1b7-2cda0457d247', 'eb37159e-8d0d-454b-a044-4d46caccd00f', 'Assigned', '2025-09-17 17:01:31.111992', NULL, NULL, NULL, '', NULL, NULL, 0, 1),
(4, 3, 'bc7de5d6-2941-4f93-893d-e092d118d288', 'eb37159e-8d0d-454b-a044-4d46caccd00f', 'Assigned', '2025-09-17 17:11:37.917562', NULL, NULL, NULL, '', NULL, NULL, 0, 1),
(5, 2, 'bc7de5d6-2941-4f93-893d-e092d118d288', 'eb37159e-8d0d-454b-a044-4d46caccd00f', 'Assigned', '2025-09-17 17:11:46.661158', NULL, NULL, NULL, '', NULL, NULL, 0, 1),
(6, 4, '50759ffc-7dca-459e-b604-f71fcea6efe7', 'a661ca71-c1a9-4a9a-8bdf-93cc3d1bd438', 'InProgress', '2025-09-17 17:15:19.511481', '2025-09-17 17:16:11.029327', NULL, NULL, '', NULL, NULL, 10, 1),
(7, 3, '7520b09c-4c19-41aa-bed4-412f1e9a7fbb', '50759ffc-7dca-459e-b604-f71fcea6efe7', 'Assigned', '2025-09-17 17:16:33.626817', NULL, NULL, NULL, '', NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `workplans`
--

CREATE TABLE `workplans` (
  `Id` int(11) NOT NULL,
  `LecturerId` varchar(255) NOT NULL,
  `PeriodStart` datetime(6) NOT NULL,
  `PeriodEnd` datetime(6) NOT NULL,
  `Content` longtext NOT NULL,
  `SubmittedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20250819103941_InitialCreate', '9.0.8'),
('20250917112116_AddStandardWorkplanAndAssignmentModels', '9.0.8'),
('20250917115255_FakeInitialMigration', '9.0.8');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`);

--
-- Indexes for table `aspnetroles`
--
ALTER TABLE `aspnetroles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RoleNameIndex` (`NormalizedName`);

--
-- Indexes for table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetUserClaims_UserId` (`UserId`);

--
-- Indexes for table `aspnetuserlogins`
--
ALTER TABLE `aspnetuserlogins`
  ADD PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  ADD KEY `IX_AspNetUserLogins_UserId` (`UserId`);

--
-- Indexes for table `aspnetuserroles`
--
ALTER TABLE `aspnetuserroles`
  ADD PRIMARY KEY (`UserId`,`RoleId`),
  ADD KEY `IX_AspNetUserRoles_RoleId` (`RoleId`);

--
-- Indexes for table `aspnetusers`
--
ALTER TABLE `aspnetusers`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  ADD KEY `EmailIndex` (`NormalizedEmail`),
  ADD KEY `IX_AspNetUsers_DepartmentId` (`DepartmentId`);

--
-- Indexes for table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD PRIMARY KEY (`UserId`,`LoginProvider`,`Name`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Departments_Name` (`Name`);

--
-- Indexes for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Evaluations_HodId` (`HodId`),
  ADD KEY `IX_Evaluations_KpiId` (`KpiId`),
  ADD KEY `IX_Evaluations_LecturerId` (`LecturerId`),
  ADD KEY `IX_Evaluations_EvaluatedAt` (`EvaluatedAt`);

--
-- Indexes for table `kpiassignments`
--
ALTER TABLE `kpiassignments`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_KpiAssignments_KpiId_LecturerId_AcademicYear_Semester` (`KpiId`,`LecturerId`,`AcademicYear`,`Semester`),
  ADD KEY `IX_KpiAssignments_KpiId` (`KpiId`),
  ADD KEY `IX_KpiAssignments_LecturerId` (`LecturerId`);

--
-- Indexes for table `kpis`
--
ALTER TABLE `kpis`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Kpis_CreatedByHodId` (`CreatedByHodId`);

--
-- Indexes for table `standardworkplans`
--
ALTER TABLE `standardworkplans`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_StandardWorkplans_AcademicYear_Semester` (`AcademicYear`,`Semester`),
  ADD KEY `IX_StandardWorkplans_CreatedById` (`CreatedById`),
  ADD KEY `IX_StandardWorkplans_TargetRole` (`TargetRole`);

--
-- Indexes for table `workplanassignments`
--
ALTER TABLE `workplanassignments`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_WorkplanAssignments_StandardWorkplanId_AssigneeId` (`StandardWorkplanId`,`AssigneeId`),
  ADD KEY `IX_WorkplanAssignments_AssignedAt` (`AssignedAt`),
  ADD KEY `IX_WorkplanAssignments_AssignedById` (`AssignedById`),
  ADD KEY `IX_WorkplanAssignments_AssigneeId` (`AssigneeId`),
  ADD KEY `IX_WorkplanAssignments_Status` (`Status`);

--
-- Indexes for table `workplans`
--
ALTER TABLE `workplans`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Workplans_LecturerId` (`LecturerId`),
  ADD KEY `IX_Workplans_SubmittedAt` (`SubmittedAt`);

--
-- Indexes for table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kpiassignments`
--
ALTER TABLE `kpiassignments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kpis`
--
ALTER TABLE `kpis`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `standardworkplans`
--
ALTER TABLE `standardworkplans`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `workplanassignments`
--
ALTER TABLE `workplanassignments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `workplans`
--
ALTER TABLE `workplans`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  ADD CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  ADD CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetuserlogins`
--
ALTER TABLE `aspnetuserlogins`
  ADD CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetuserroles`
--
ALTER TABLE `aspnetuserroles`
  ADD CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetusers`
--
ALTER TABLE `aspnetusers`
  ADD CONSTRAINT `FK_AspNetUsers_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `departments` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `FK_Evaluations_AspNetUsers_HodId` FOREIGN KEY (`HodId`) REFERENCES `aspnetusers` (`Id`),
  ADD CONSTRAINT `FK_Evaluations_AspNetUsers_LecturerId` FOREIGN KEY (`LecturerId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Evaluations_Kpis_KpiId` FOREIGN KEY (`KpiId`) REFERENCES `kpis` (`Id`);

--
-- Constraints for table `kpiassignments`
--
ALTER TABLE `kpiassignments`
  ADD CONSTRAINT `FK_KpiAssignments_AspNetUsers_LecturerId` FOREIGN KEY (`LecturerId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_KpiAssignments_Kpis_KpiId` FOREIGN KEY (`KpiId`) REFERENCES `kpis` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `kpis`
--
ALTER TABLE `kpis`
  ADD CONSTRAINT `FK_Kpis_AspNetUsers_CreatedByHodId` FOREIGN KEY (`CreatedByHodId`) REFERENCES `aspnetusers` (`Id`);

--
-- Constraints for table `standardworkplans`
--
ALTER TABLE `standardworkplans`
  ADD CONSTRAINT `FK_StandardWorkplans_AspNetUsers_CreatedById` FOREIGN KEY (`CreatedById`) REFERENCES `aspnetusers` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `workplanassignments`
--
ALTER TABLE `workplanassignments`
  ADD CONSTRAINT `FK_WorkplanAssignments_AspNetUsers_AssignedById` FOREIGN KEY (`AssignedById`) REFERENCES `aspnetusers` (`Id`),
  ADD CONSTRAINT `FK_WorkplanAssignments_AspNetUsers_AssigneeId` FOREIGN KEY (`AssigneeId`) REFERENCES `aspnetusers` (`Id`),
  ADD CONSTRAINT `FK_WorkplanAssignments_StandardWorkplans_StandardWorkplanId` FOREIGN KEY (`StandardWorkplanId`) REFERENCES `standardworkplans` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `workplans`
--
ALTER TABLE `workplans`
  ADD CONSTRAINT `FK_Workplans_AspNetUsers_LecturerId` FOREIGN KEY (`LecturerId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
