CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255),
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`website` varchar(500),
	`plan` enum('bronze','silver','gold'),
	`status` enum('lead','demo_sent','contacted','active','inactive') NOT NULL DEFAULT 'lead',
	`language` enum('de','es','en') NOT NULL DEFAULT 'de',
	`setupFee` int,
	`monthlyFee` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255),
	`message` text NOT NULL,
	`language` enum('de','es','en') NOT NULL DEFAULT 'de',
	`status` enum('new','contacted','converted') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`companyName` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`logoUrl` varchar(500),
	`primaryColor` varchar(7) DEFAULT '#1e40af',
	`language` enum('de','es','en') NOT NULL DEFAULT 'de',
	`views` int NOT NULL DEFAULT 0,
	`lastViewed` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demos_id` PRIMARY KEY(`id`),
	CONSTRAINT `demos_slug_unique` UNIQUE(`slug`)
);
