<?php
// ==================== CORS ====================
$frontendOrigin = "http://localhost:5173"; // ganti sesuai origin React
header("Access-Control-Allow-Origin: $frontendOrigin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// ==================== CONFIG ====================
error_reporting(E_ALL);
ini_set('display_errors', 'On');

$base_dir = __DIR__;
include $base_dir . '/config.php'; // koneksi DB

$bapb_id = $_GET['id'] ?? null;

if (!$bapb_id) {
    echo json_encode(["success" => false, "message" => "ID dokumen BAPB wajib diisi."]);
    exit;
}

// Ambil header BAPB
$bapb = $conn->query("SELECT * FROM bapb WHERE id=" . (int)$bapb_id)->fetch_assoc();

if (!$bapb) {
    echo json_encode(["success" => false, "message" => "Dokumen BAPB tidak ditemukan."]);
    exit;
}

// Ambil item BAPB
$items = [];
$item_result = $conn->query("SELECT * FROM bapb_items WHERE bapb_id=" . (int)$bapb_id);
while ($row = $item_result->fetch_assoc()) {
    $items[] = $row;
}

// Kembalikan JSON
echo json_encode([
    "success" => true,
    "header" => [
        "id" => $bapb['id'],
        "judul" => $bapb['judul'],
        "nomor" => $bapb['nomor'],
        "tanggal_pemeriksaan" => $bapb['tanggal_pemeriksaan'],
        "tempat_pemeriksaan" => $bapb['tempat_pemeriksaan'],
        "pihak_pemeriksa" => $bapb['pihak_pemeriksa'],
        "tempat_pengiriman" => $bapb['tempat_pengiriman'],
        "pihak_vendor" => $bapb['pihak_vendor'],
        "status" => $bapb['status'],
        "catatan_gudang" => $bapb['catatan_gudang'] ?? ""
    ],
    "items" => $items,
    "files" => []
]);
