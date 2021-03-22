
--
-- Table structure for table `component`
--

DROP TABLE IF EXISTS `component`;
CREATE TABLE `component` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `permission_bit` int(11) DEFAULT NULL,
  `authorization_id` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  KEY `c_id` (`id`) USING BTREE,
  KEY `c_p_id` (`parent_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;


--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `bit` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  KEY `perm_bit` (`bit`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;


--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
CREATE TABLE `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;


--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `authorization_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `role_id` int(11) DEFAULT NULL,
  `component_id` int(11) DEFAULT NULL,
  `permission_bit` int(11) DEFAULT NULL,
  KEY `perm_role_id` (`role_id`) USING BTREE,
  KEY `perm_component_id` (`component_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;


INSERT INTO `permission` (`bit`, `name`, `title`) VALUES
(1, 'view', 'View'),
(2, 'create', 'Create'),
(4, 'read', 'Read'),
(8, 'update', 'Update'),
(16, 'delete', 'Delete');


INSERT INTO `component` (`id`, `name`, `title`, `parent_id`, `permission_bit`, `authorization_id`) VALUES
(1, 'dashboard', 'Dashboard', NULL, 1, 1),
(2, 'signup', 'Company Signup', NULL, 1, 1),
(3, 'allSignup', 'All Signups', 2, 4+8+16, NULL),
(4, 'newSignup', 'New Signups', 2, 4+8+16, NULL),
(5, 'rejectedSignup', 'Rejected Signups', 2, 4+8+16, NULL),
(6, 'approvedSignup', 'Approved Signups', 2, 4+8+16, NULL),
(7, 'branch', 'Branch Office', NULL, 1, NULL),
(8, 'allBranches', 'All Applications', 7, 4+8+16, NULL),
(9, 'newBranches', 'New Applications', 7, 4+8+16, NULL),
(10, 'circulatedBranches', 'Circulated Applications', 7, 4+8+16, 1),
(11, 'rejectedBranches', 'Rejected Applications', 7, 4+8+16, NULL),
(12, 'approvedBranches', 'Approved Applications', 7, 4+8+16, NULL),
(13, 'liaison', 'Liaison Office', NULL, 1, NULL),
(14, 'allLiaison', 'All Applications', 13, 4+8+16, NULL),
(15, 'newLiaison', 'New Applications', 13, 4+8+16, NULL),
(16, 'circulatedLiaison', 'Circulated Applications', 13, 4+8+16, 1),
(17, 'rejectedLiaison', 'Rejected Applications', 13, 4+8+16, NULL),
(18, 'approvedLiaison', 'Approved Applications', 13, 4+8+16, NULL),
(19, 'renewal', 'Renewal Requests', NULL, 1, 1),
(20, 'user', 'Manage Users', NULL, 1, 1),
(21, 'allUsers', 'Users', 20, 2+4+8+16, 1),
(22, 'allRoles', 'Roles', 20, 2+4+8+16, 1),
(23, 'allGroups', 'Groups', 20, 2+4+8+16, 1),
(24, 'maturedBranches', 'Mature Applications', 7, 4+8+16, 1),
(25, 'maturedLiaisons', 'Mature Applications', 13, 4+8+16, 1),
(26, 'contract', 'Contract Applications', NULL, 1, 1),
(27, 'passwordReset', 'Password Reset', NULL, 1, NULL),
(28, 'infoCopy', 'Copy For Information', NULL, 1, 4),
(29, 'contractRequests', 'Contract Requests', NULL, 1, 1);