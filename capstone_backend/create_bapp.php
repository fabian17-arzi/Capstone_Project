<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'config.php';
require 'phpqrcode/qrlib.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Data tidak valid."]);
    exit;
}

// --- AMBIL DATA ---
$nomor            = $data["nomor"] ?? null;
$tanggal          = $data["tanggal"] ?? null;
$nama_pekerjaan   = $data["nama_pekerjaan"] ?? null;
$nomor_kontrak    = $data["nomor_kontrak"] ?? null;
$nama_vendor      = $data["nama_vendor"] ?? null;
$pj_vendor        = $data["penanggung_jawab_vendor"] ?? null;
$pejabat_penerima = $data["pejabat_penerima"] ?? null;
$persentase       = (float)($data["persentase_penyelesaian"] ?? 0);
$deskripsi        = $data["deskripsi_pekerjaan"] ?? null;
$catatan          = $data["catatan"] ?? null;
$vendor_id        = (int)($data["vendor_id"] ?? 0);

if (!$nomor || $vendor_id === 0) {
    echo json_encode(["success" => false, "message" => "Nomor BAPP dan Vendor ID wajib diisi."]);
    exit;
}

$status = "Pending";

// ==========================
// 1. Generate QR Vendor
// ==========================
$qr_folder = __DIR__ . "/qrcodes/";
if (!is_dir($qr_folder)) mkdir($qr_folder, 0777, true);

$vendor_signed_at = date("Y-m-d H:i:s");
$vendor_qr_file = "bapp_vendor_" . uniqid() . ".png";
$vendor_qr_path = $qr_folder . $vendor_qr_file;
$vendor_qr_relative = "qrcodes/" . $vendor_qr_file;

$qr_text = "TTD Vendor BAPP|Nomor: {$nomor}|Vendor: {$nama_vendor}|Tanggal: {$vendor_signed_at}";
QRcode::png($qr_text, $vendor_qr_path, QR_ECLEVEL_M, 8);

// ==========================
// 2. INSERT DATA BAPP
// ==========================
$stmt = $conn->prepare("
    INSERT INTO bapp 
    (nomor, tanggal, nama_pekerjaan, nomor_kontrak, nama_vendor,
     penanggung_jawab_vendor, pejabat_penerima, persentase_penyelesaian,
     deskripsi_pekerjaan, catatan, status, catatan_direksi,
     vendor_id, vendor_signature_qr, vendor_signed_at,
     direksi_signature_qr, direksi_signed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, NULL, NULL)
");

$stmt->bind_param(
    "sssssssssssiss",
    $nomor,
    $tanggal,
    $nama_pekerjaan,
    $nomor_kontrak,
    $nama_vendor,
    $pj_vendor,
    $pejabat_penerima,
    $persentase,
    $deskripsi,
    $catatan,
    $status,
    $vendor_id,
    $vendor_qr_relative,
    $vendor_signed_at
);


if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan BAPP",
        "error" => $stmt->error
    ]);
    exit;
}

$bapp_id = $stmt->insert_id;

// ==========================
// 3. RESPONSE
// ==========================
echo json_encode([
    "success" => true,
    "bapp_id" => $bapp_id,
    "vendor_signed_at" => $vendor_signed_at,
    "vendor_qr" => $vendor_qr_relative,
    "message" => "BAPP berhasil dibuat. QR Vendor sudah dibuat."
]);
