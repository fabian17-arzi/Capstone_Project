<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'config.php';
require 'phpqrcode/qrlib.php';

// --- RECEIVE JSON ---
$data = json_decode(file_get_contents("php://input"), true);

// REQUIRED FIELDS
$required_keys = [
    "judul", "nomor", "tanggal", "tempat_pemeriksaan",
    "pihak_pemeriksa", "tempat_pengiriman",
    "pihak_vendor", "vendor_id", "items"
];

foreach ($required_keys as $key) {
    if (!isset($data[$key])) {
        echo json_encode(["success" => false, "message" => "Data yang hilang: " . $key]);
        exit;
    }
}

$judul               = $data["judul"];
$nomor               = $data["nomor"];
$tanggal_pemeriksaan = $data["tanggal"];
$tempat_pemeriksaan  = $data["tempat_pemeriksaan"];
$pihak_pemeriksa     = $data["pihak_pemeriksa"];
$tempat_pengiriman   = $data["tempat_pengiriman"];
$pihak_vendor        = $data["pihak_vendor"];
$vendor_id           = (int)$data["vendor_id"];
$items               = $data["items"];

$vendor_signed_at = date("Y-m-d H:i:s");

if ($vendor_id === 0) {
    echo json_encode(["success" => false, "message" => "Vendor ID tidak valid."]);
    exit;
}

// --- QR FOLDER ---
$qr_folder = __DIR__ . "/qrcodes/";
if (!is_dir($qr_folder)) mkdir($qr_folder, 0777, true);

// --- QR TEXT ---
$qr_text = "BAPB|Vendor|$vendor_signed_at|$nomor";

// --- 1x TIMESTAMP (FIX BUG TIME()) ---
$timestamp = time();

// --- TEMP QR ---
$temp_filename  = "temp_vendor_" . $timestamp . ".png";
$temp_qr_path   = $qr_folder . $temp_filename;
$temp_relative  = "qrcodes/" . $temp_filename;

// Generate QR
QRcode::png($qr_text, $temp_qr_path, QR_ECLEVEL_M, 8);

// --- INSERT HEADER ---
$stmt = $conn->prepare("
    INSERT INTO bapb
    (judul, nomor, tanggal_pemeriksaan, tempat_pemeriksaan, pihak_pemeriksa,
     tempat_pengiriman, pihak_vendor, vendor_id, menyatakan_valid,
     vendor_signed_at, vendor_signature_qr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
");

$stmt->bind_param(
    "sssssssiss",
    $judul,
    $nomor,
    $tanggal_pemeriksaan,
    $tempat_pemeriksaan,
    $pihak_pemeriksa,
    $tempat_pengiriman,
    $pihak_vendor,
    $vendor_id,
    $vendor_signed_at,
    $temp_relative
);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal INSERT header BAPB",
        "error" => $stmt->error
    ]);
    exit;
}

$bapb_id = $stmt->insert_id;

// --- FINAL QR NAME ---
$final_qr_name = "bapb_vendor_" . $bapb_id . ".png";
$final_qr_path = $qr_folder . $final_qr_name;
$relative_path = "qrcodes/" . $final_qr_name;

// --- RENAME QR --- 
if (!rename($temp_qr_path, $final_qr_path)) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal rename QR code",
        "temp_file" => $temp_qr_path,
        "final_file" => $final_qr_path
    ]);
    exit;
}

// --- UPDATE FINAL QR PATH ---
$update = $conn->query("
    UPDATE bapb SET vendor_signature_qr='$relative_path' 
    WHERE id=$bapb_id
");

if (!$update) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal UPDATE path QR",
        "error" => $conn->error
    ]);
    exit;
}

// --- INSERT ITEMS ---
foreach ($items as $item) {
    $item_stmt = $conn->prepare("
        INSERT INTO bapb_items 
        (bapb_id, nama_barang, spesifikasi, quantity, satuan, keterangan)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $item_stmt->bind_param(
        "ississ",
        $bapb_id,
        $item["nama_barang"],
        $item["spesifikasi"],
        $item["qty"],
        $item["satuan"],
        $item["keterangan"]
    );

    if (!$item_stmt->execute()) {
        echo json_encode([
            "success" => false,
            "message" => "Gagal insert item",
            "error" => $item_stmt->error
        ]);
        exit;
    }
}

// --- RESPONSE ---
echo json_encode([
    "success" => true,
    "bapb_id" => $bapb_id,
    "vendor_signed_at" => $vendor_signed_at,
    "qr" => $relative_path,
    "message" => "BAPB berhasil dibuat dan QR vendor telah dibuat."
]);

exit;
