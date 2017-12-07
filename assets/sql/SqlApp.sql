-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 10. Jul 2017 um 15:45
-- Server-Version: 5.7.18
-- PHP-Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: `SVG`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Path`
--

CREATE TABLE `Circle` (
  `id` int(32) UNSIGNED NOT NULL,
  `group_id` int(12) UNSIGNED DEFAULT NULL,
  `d` text NOT NULL,
  `style` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `Path`
--

INSERT INTO `Circle` (`id`, `group_id`, `cx`, `cy`, `r`, `style`) VALUES
(21285, NULL,  , 'fill: rgb(217, 176, 140);');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Path`
--

CREATE TABLE `Path` (
  `id` int(32) UNSIGNED NOT NULL,
  `group_id` int(12) UNSIGNED DEFAULT NULL,
  `d` text NOT NULL,
  `style` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `Path`
--

INSERT INTO `Path` (`id`, `group_id`, `d`, `style`) VALUES
(21285, NULL, 'm547.15 188.35-2.814 4.444-1.461 2.047-14.176-7.616 1.466-2.831 7.124 3.666 1.229 1.473 2.468-4.544 6.164 3.361', 'fill: rgb(217, 176, 140);');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Scene`
--

CREATE TABLE `Scene` (
  `id` int(12) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Scene`
--
ALTER TABLE `Scene`
  ADD PRIMARY KEY (`id`);
COMMIT;
