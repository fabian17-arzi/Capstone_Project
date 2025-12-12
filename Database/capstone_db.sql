-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2025 at 03:56 PM
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
-- Database: `capstone_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`) VALUES
(1, 'admin', '827ccb0eea8a706c4c34a16891f84e7b');

-- --------------------------------------------------------

--
-- Table structure for table `bapb`
--

CREATE TABLE `bapb` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `nomor` varchar(100) DEFAULT NULL,
  `tanggal_pemeriksaan` date DEFAULT NULL,
  `tempat_pemeriksaan` varchar(255) DEFAULT NULL,
  `pihak_pemeriksa` varchar(255) DEFAULT NULL,
  `tempat_pengiriman` varchar(255) DEFAULT NULL,
  `pihak_vendor` varchar(255) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `menyatakan_valid` tinyint(1) DEFAULT 0,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `catatan_gudang` text DEFAULT NULL,
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp(),
  `vendor_signed_at` datetime DEFAULT NULL,
  `gudang_signed_at` datetime DEFAULT NULL,
  `vendor_signature_qr` varchar(255) DEFAULT NULL,
  `gudang_signature_qr` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bapb`
--

INSERT INTO `bapb` (`id`, `judul`, `nomor`, `tanggal_pemeriksaan`, `tempat_pemeriksaan`, `pihak_pemeriksa`, `tempat_pengiriman`, `pihak_vendor`, `vendor_id`, `menyatakan_valid`, `status`, `catatan_gudang`, `dibuat_pada`, `vendor_signed_at`, `gudang_signed_at`, `vendor_signature_qr`, `gudang_signature_qr`) VALUES
(24, 'Pengiriman Beras Makmur', '001/BAPB/BMK-BAO/III/2025', '2025-12-10', 'Gudang Logistik', 'Hendriko', 'Gudang Beras Logistik', 'PT. Beras Makmur', 15, 1, 'Pending', NULL, '2025-12-10 07:09:59', '2025-12-10 08:09:59', NULL, 'qrcodes/bapb_vendor_24.png', NULL),
(25, 'Pengiriman Beras', '001/BAPB/BMK-BAO/III/2025', '2025-12-10', 'Gudang Logistik', 'Hendriko', 'Gudang Beras Logistik', 'PT. Beras Makmur', 15, 1, 'Rejected', 'Keterangan belum tertera', '2025-12-10 08:20:13', '2025-12-10 09:20:12', NULL, 'qrcodes/bapb_vendor_25.png', NULL),
(26, 'Pengiriman Mie Instan', '002/BAPB/BMK-BAO/III/2025', '2025-12-10', 'Gudang Logistik', 'Mulyono', 'Gudang Beras Logistik', 'PT. Beras Makmur', 15, 1, 'Approved', NULL, '2025-12-10 08:23:34', '2025-12-10 09:23:34', '2025-12-10 09:24:17', 'qrcodes/bapb_vendor_26.png', 'qrcodes/bapb_gudang_26.png'),
(27, 'Pengiriman Mie Instan', '002/BAPB/BMK-BAO/III/2025', '2025-12-10', 'Gudang Logistik', 'Mulyono', 'Gudang Beras Logistik', 'PT. Beras Makmur', 22, 1, 'Approved', NULL, '2025-12-11 07:34:13', '2025-12-11 08:34:13', '2025-12-11 08:35:37', 'qrcodes/bapb_vendor_27.png', 'qrcodes/bapb_gudang_27.png');

-- --------------------------------------------------------

--
-- Table structure for table `bapb_files`
--

CREATE TABLE `bapb_files` (
  `id` int(11) NOT NULL,
  `bapb_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bapb_items`
--

CREATE TABLE `bapb_items` (
  `id` int(11) NOT NULL,
  `bapb_id` int(11) DEFAULT NULL,
  `nama_barang` varchar(255) DEFAULT NULL,
  `spesifikasi` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `satuan` varchar(50) DEFAULT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bapb_items`
--

INSERT INTO `bapb_items` (`id`, `bapb_id`, `nama_barang`, `spesifikasi`, `quantity`, `satuan`, `keterangan`) VALUES
(24, 24, 'Beras Pandan Wangi', 'Beras Karung 50KG', 100, 'KG', 'Sudah dikirim'),
(25, 25, 'Beras Pandan Wangi', 'Beras Karung 50KG', 10, 'KG', ''),
(26, 26, 'Indomie', 'Indomie Goreng', 50, 'pcs', 'Barang sudah sesuai'),
(27, 27, 'Mie Instan', 'Supermi', 1000, 'pcs', 'Barang sudah sesuai');

-- --------------------------------------------------------

--
-- Table structure for table `bapp`
--

CREATE TABLE `bapp` (
  `id` int(11) NOT NULL,
  `nomor` varchar(100) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `nama_pekerjaan` varchar(255) DEFAULT NULL,
  `nomor_kontrak` varchar(100) DEFAULT NULL,
  `nama_vendor` varchar(255) DEFAULT NULL,
  `penanggung_jawab_vendor` varchar(255) DEFAULT NULL,
  `pejabat_penerima` varchar(255) DEFAULT NULL,
  `persentase_penyelesaian` decimal(5,2) DEFAULT NULL,
  `deskripsi_pekerjaan` text DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `catatan_direksi` text DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `vendor_signature_qr` varchar(255) DEFAULT NULL,
  `vendor_signed_at` datetime DEFAULT NULL,
  `direksi_signature_qr` varchar(255) DEFAULT NULL,
  `direksi_signed_at` datetime DEFAULT NULL,
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bapp`
--

INSERT INTO `bapp` (`id`, `nomor`, `tanggal`, `nama_pekerjaan`, `nomor_kontrak`, `nama_vendor`, `penanggung_jawab_vendor`, `pejabat_penerima`, `persentase_penyelesaian`, `deskripsi_pekerjaan`, `catatan`, `status`, `catatan_direksi`, `vendor_id`, `vendor_signature_qr`, `vendor_signed_at`, `direksi_signature_qr`, `direksi_signed_at`, `dibuat_pada`) VALUES
(13, '001/BAPP/BMK-BAO/III/2025', '2025-12-10', 'Bongkar Muat Beras', '500000', 'PT. Beras Makmur', 'Wiyoko', 'hendry', 100.00, 'Bongkar muat beras ke dalam gudang', 'Barang sudah dibongkar muat kedalam gudang', 'Approved', NULL, 15, 'qrcodes/bapp_vendor_6939293ab4b38.png', '2025-12-10 09:03:06', 'qrcodes/bapp_direksi_13_693933229543a.png', '2025-12-10 09:45:22', '2025-12-10 08:03:07');

-- --------------------------------------------------------

--
-- Table structure for table `bapp_files`
--

CREATE TABLE `bapp_files` (
  `id` int(11) NOT NULL,
  `bapp_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bapp_files`
--

INSERT INTO `bapp_files` (`id`, `bapp_id`, `file_path`, `file_name`, `uploaded_at`) VALUES
(13, 13, 'uploads/1765353787_13.png', 'Bongkar Muat.png', '2025-12-10 08:03:07');

-- --------------------------------------------------------

--
-- Table structure for table `digital_signatures`
--

CREATE TABLE `digital_signatures` (
  `id` int(11) NOT NULL,
  `dokumen_type` varchar(20) DEFAULT NULL,
  `dokumen_id` int(11) DEFAULT NULL,
  `signed_by` varchar(255) DEFAULT NULL,
  `signed_at` datetime DEFAULT NULL,
  `signature_hash` varchar(255) DEFAULT NULL,
  `qr_filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `role` enum('Vendor','PIC Gudang','Admin','Direksi Pekerjaan') NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `password`) VALUES
(11, 'PIC Gudang', 'gudang@gmail.com', 'PIC Gudang', '123'),
(12, 'Direksi Pekerjaan', 'direksi@gmail.com', 'Direksi Pekerjaan', '123'),
(15, 'PT. Beras Makmur', 'berasmakmur@gmail.com', 'Vendor', 'beras123'),
(22, 'langgeng@gmail.com', 'langgengsentosa@gmail.com', 'Vendor', 'sentosa123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bapb`
--
ALTER TABLE `bapb`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bapb_files`
--
ALTER TABLE `bapb_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bapb_id` (`bapb_id`);

--
-- Indexes for table `bapb_items`
--
ALTER TABLE `bapb_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bapb_id` (`bapb_id`);

--
-- Indexes for table `bapp`
--
ALTER TABLE `bapp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bapp_files`
--
ALTER TABLE `bapp_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bapp_id` (`bapp_id`);

--
-- Indexes for table `digital_signatures`
--
ALTER TABLE `digital_signatures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bapb`
--
ALTER TABLE `bapb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `bapb_files`
--
ALTER TABLE `bapb_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bapb_items`
--
ALTER TABLE `bapb_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `bapp`
--
ALTER TABLE `bapp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `bapp_files`
--
ALTER TABLE `bapp_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `digital_signatures`
--
ALTER TABLE `digital_signatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bapb_files`
--
ALTER TABLE `bapb_files`
  ADD CONSTRAINT `bapb_files_ibfk_1` FOREIGN KEY (`bapb_id`) REFERENCES `bapb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bapb_items`
--
ALTER TABLE `bapb_items`
  ADD CONSTRAINT `bapb_items_ibfk_1` FOREIGN KEY (`bapb_id`) REFERENCES `bapb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bapp_files`
--
ALTER TABLE `bapp_files`
  ADD CONSTRAINT `bapp_files_ibfk_1` FOREIGN KEY (`bapp_id`) REFERENCES `bapp` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
