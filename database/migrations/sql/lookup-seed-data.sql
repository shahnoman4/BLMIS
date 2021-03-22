-- MySQL dump 10.13  Distrib 5.7.17, for Win32 (AMD64)
--
-- Host: 127.0.0.1    Database: blmis_dev
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `lookup`
--

LOCK TABLES `lookup` WRITE;
/*!40000 ALTER TABLE `lookup` DISABLE KEYS */;
INSERT INTO `lookup` VALUES
 ('authorization','SuperAdmin',1,'Super Admin','Super admin can manage organizations & users (and anything else upto that level)',NULL)
,('authorization','OrgAdmin',2,'Organization Admin','Organization admin can manage users (and anything else upto that level) of their own organization',NULL)
,('authorization','User',3,'User','Normal user can perform action with their organization as authorized by organization admin',NULL)
,('authorization','Admin',4,'Admin','Admin acts as super admin but as authorized by super admin',NULL)

,('media_type','DP',1,'Profile Picture','Profile picture of an entity',NULL)
,('media_type','CoverPhoto',2,'Cover Photo','Background picture of an entity',NULL)
,('media_type','Attachment',3,'Attachment','Any file uploaded by an entity',NULL)
,('media_type','PermissionLetter',4,'Permission Letter','',NULL)
,('media_type','NIC',5,'NIC','',NULL)
,('media_type','Passport',6,'Passport','',NULL)
,('media_type','CV',7,'CV','',NULL)
,('media_type','CoverLetter',8,'Cover Letter','',NULL)
,('media_type','RegistrationLetter',9,'','',NULL)
,('media_type','MemorandumArticle',10,'','',NULL)
,('media_type','AuthorityLetter',11,'','',NULL)
,('media_type','OrgProfile',12,'','',NULL)
,('media_type','AgreementLetter',13,'','',NULL)
,('media_type','LeaseAgreement',14,'','',NULL)
,('media_type','SecpCertificate',15,'','',NULL)
,('media_type','RealizationCertificate',16,'','',NULL)
,('media_type','AnnualReport',17,'','',NULL)
,('media_type','Receipt',18,'','',NULL)
,('media_type','TaxReturn',19,'','',NULL)
,('media_type','FinancialStatement',20,'','',NULL)
,('media_type','AuditReport',21,'','',NULL)

,('notification_type','Email',1,'Email','',NULL)
,('notification_type','SMS',2,'SMS','',NULL)
,('notification_type','IM',3,'Instant Message','',NULL)
,('notification_type','System',4,'System','System genderated notifications',NULL)

,('contact_type','User',1,'User','',NULL)
,('contact_type','Organization',2,'Organization','',NULL)
,('contact_type','PrincipalOfficer',3,'Principal Officer','',NULL)
,('contact_type','Director',4,'Director','',NULL)
,('contact_type','LocalContact',5,'Local Contact','',NULL)
,('contact_type','LocalSponsor',6,'Local Sponsor','',NULL)
,('contact_type','Agent',7,'Agent','',NULL)
,('contact_type','PartnerCompany',8,'Partner Company','',NULL)
,('contact_type','PartnerPerson',9,'Partner Person','',NULL)

,('application_status','New',1,'New','',NULL)
,('application_status','Initiated',2,'Initiated','',NULL)
,('application_status','Submitted',3,'Submitted','',NULL)
,('application_status','Forwarded',4,'Forwarded','',NULL)
,('application_status','Circulated',5,'Circulated','',NULL)
,('application_status','Approved',6,'Approved','',NULL)
,('application_status','Rejected',7,'Rejected','',NULL)
,('application_status','Commented',8,'Commented','',NULL)
,('application_status','Updated',9,'Updated','',NULL)
,('application_status','Reverted',10,'Reverted','',NULL)
,('application_status','Held',11,'Held','',NULL)
,('application_status','Approvable',12,'Approvable','',NULL)
,('application_status','Rejectable',13,'Rejectable','',NULL)
,('application_status','PaymentPending',14,'Payment Pending','',NULL)
,('application_status','Pending',15,'Pending','',NULL)
,('application_status','Shared',16,'Shared','',NULL)
,('application_status','Active',17,'Active','',NULL)
,('application_status','Inactive',18,'In Active','',NULL)
,('application_status','Renewed',19,'Renewed','',NULL)

,('service_type','Branch',1,'Branch Office','',NULL)
,('service_type','SubBranch',2,'Sub-Branch Office','',NULL)
,('service_type','BranchConversion',3,'Branch Conversion','',NULL)
,('service_type','Liaison',4,'Liaison Office','',NULL)
,('service_type','SubLiaison',5,'Sub-Liaison Office','',NULL)
,('service_type','LiaisonConversion',6,'Liaison Conversion','',NULL)

,('sector','Food',1,'Food','',NULL)
,('sector','FoodPackaging',2,'Food Packaging','',NULL)
,('sector','Beverages',3,'Beverages','',NULL)
,('sector','TobaccoCigarettes',4,'Tobacco & Cigarettes','',NULL)
,('sector','Sugar',5,'Sugar','',NULL)
,('sector','Textiles',6,'Textiles','',NULL)
,('sector','PaperPulp',7,'Paper & Pulp','',NULL)
,('sector','LeatherLeatherProducts',8,'Leather & Leather Products','',NULL)
,('sector','RubberRubberProducts',9,'Rubber & Rubber Products','',NULL)
,('sector','Chemicals',10,'Chemicals','',NULL)
,('sector','PetroChemicals',11,'Petro Chemicals','',NULL)
,('sector','PetroleumRefining',12,'Petroleum Refining','',NULL)
,('sector','MiningQuarrying',13,'Mining & Quarrying','',NULL)
,('sector','OilGasExplorations',14,'Oil & Gas Explorations','',NULL)
,('sector','PharmaceuticalsOTCProducts',15,'Pharmaceuticals & OTC Products','',NULL)
,('sector','Cosmetics',16,'Cosmetics','',NULL)
,('sector','Fertilizers',17,'Fertilizers','',NULL)
,('sector','Cement',18,'Cement','',NULL)
,('sector','Ceramics',19,'Ceramics','',NULL)
,('sector','BasicMetals',20,'Basic Metals','',NULL)
,('sector','MetalProducts',21,'Metal Products','',NULL)
,('sector','MachineryotherthanElectrical',22,'Machinery other than Electrical','',NULL)
,('sector','ElectricalMachinery',23,'Electrical Machinery','',NULL)
,('sector','Electronics',24,'Electronics','',NULL)
,('sector','Power',25,'Power','',NULL)
,('sector','Construction',26,'Construction','',NULL)
,('sector','Trade',27,'Trade','',NULL)
,('sector','Transport',28,'Transport','',NULL)
,('sector','TransportEquipmentAutomobiles',29,'Transport Equipment(Automobiles)','',NULL)
,('sector','Tourism',30,'Tourism','',NULL)
,('sector','StorageFacilities',31,'Storage Facilities','',NULL)
,('sector','Telecommunications',32,'Telecommunications','',NULL)
,('sector','InformationTechnology',33,'Information Technology','',NULL)
,('sector','FinancialBusiness',34,'Financial Business','',NULL)
,('sector','SocialServices',35,'Social Services','',NULL)
,('sector','PersonalServices',36,'Personal Services','',NULL)
,('sector','Other',37,'Other','',NULL)

,('agent_type','Law',1,'Law Firm','',NULL)
,('agent_type','Accountant',2,'Chartered Accountancy Firm','',NULL)
,('agent_type','TaxConsultant',3,'Tax Consultancy Firm','',NULL)

,('profile_status','Active',1,'Active','',NULL)
,('profile_status','Blocked',2,'Blocked','',NULL);
/*!40000 ALTER TABLE `lookup` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-15  8:09:21
