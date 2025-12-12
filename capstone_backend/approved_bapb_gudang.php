<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

include 'config.php';
require 'phpqrcode/qrlib.php';

$data = json_decode(file_get_contents("php://input"), true);

$bapb_id = $data["bapb_id"] ?? 0;

// DEBUG: cek ID diterima atau tidak
file_put_contents("debug_log.txt", "REQUEST ID = $bapb_id\n", FILE_APPEND);

if ($bapb_id == 0) {
    echo json_encode([
        "success" => false,
        "message" => "ID BAPB tidak valid / tidak dikirim"
    ]);
    exit;
}

$gudang_signed_at = date("Y-m-d H:i:s");

$qr_folder = __DIR__ . "/qrcodes/";
if (!is_dir($qr_folder)) {
    mkdir($qr_folder, 0777, true);
}

$qr_text = "BAPB_ID=$bapb_id;ROLE=PIC_GUDANG;SIGNED_AT=$gudang_signed_at";
$file_name = "bapb_gudang_" . $bapb_id . ".png";

$full_path = $qr_folder . $file_name;
QRcode::png($qr_text, $full_path, QR_ECLEVEL_H, 8);

$relative_path = "qrcodes/" . $file_name;

// DEBUG: cek apakah file QR berhasil dibuat
if (!file_exists($full_path)) {
    echo json_encode(["success" => false, "message" => "QR gagal dibuat"]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE bapb SET 
        gudang_signed_at = ?, 
        gudang_signature_qr = ?,
        status = 'Approved'
    WHERE id = ?
");

$stmt->bind_param("ssi", $gudang_signed_at, $relative_path, $bapb_id);
$stmt->execute();

// DEBUG: cek apakah row ter-update
file_put_contents("debug_log.txt", "UPDATED_ROWS = " . $stmt->affected_rows . "\n", FILE_APPEND);

if ($stmt->affected_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "UPDATE gagal. ID tidak ditemukan atau data sama."
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "PIC Gudang telah menandatangani BAPB!",
    "qr" => $relative_path,
    "tanggal" => $gudang_signed_at
]);
