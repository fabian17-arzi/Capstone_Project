<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

include 'config.php';
require 'phpqrcode/qrlib.php';

$data = json_decode(file_get_contents("php://input"), true);

$bapp_id = $data["bapp_id"] ?? 0;

// Log untuk debug
file_put_contents("debug_bapp_log.txt", "REQUEST BAPP ID = $bapp_id\n", FILE_APPEND);

if ($bapp_id == 0) {
    echo json_encode([
        "success" => false,
        "message" => "ID BAPP tidak valid."
    ]);
    exit;
}

// ======================
// 1. Generate QR Direksi
// ======================
$direksi_signed_at = date("Y-m-d H:i:s");

$qr_folder = __DIR__ . "/qrcodes/";
if (!is_dir($qr_folder)) mkdir($qr_folder, 0777, true);

$qr_text = "TTD Direksi BAPP|ID: {$bapp_id}|Disetujui pada: {$direksi_signed_at}";
$file_name = "bapp_direksi_{$bapp_id}_" . uniqid() . ".png";

$full_path = $qr_folder . $file_name;
$relative_path = "qrcodes/" . $file_name;

QRcode::png($qr_text, $full_path, QR_ECLEVEL_M, 8);

if (!file_exists($full_path)) {
    echo json_encode([
        "success" => false,
        "message" => "QR Direksi gagal dibuat."
    ]);
    exit;
}

// ======================
// 2. Update database
// ======================
$stmt = $conn->prepare("
    UPDATE bapp SET 
        direksi_signed_at = ?, 
        direksi_signature_qr = ?,
        status = 'Approved'
    WHERE id = ?
");

$stmt->bind_param("ssi", 
    $direksi_signed_at, 
    $relative_path, 
    $bapp_id
);

$stmt->execute();

// Log affected rows
file_put_contents("debug_bapp_log.txt", "UPDATED_ROWS = " . $stmt->affected_rows . "\n", FILE_APPEND);

if ($stmt->error) {
    echo json_encode([
        "success" => false,
        "message" => "Update gagal",
        "error" => $stmt->error
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Direksi telah menyetujui BAPP!",
    "qr" => $relative_path,
    "tanggal" => $direksi_signed_at
]);
