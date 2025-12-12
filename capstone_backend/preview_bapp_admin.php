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

// ==================== FORMAT RUPIAH ====================
function formatRupiah($angka) {
    return "Rp " . number_format($angka, 0, ',', '.');
}

$bapp_id = $_GET['id'] ?? null;

if (!$bapp_id) {
    echo json_encode(["success" => false, "message" => "ID dokumen BAPP wajib diisi."]);
    exit;
}

// Ambil header BAPP
$bapp = $conn->query("SELECT * FROM bapp WHERE id=" . (int)$bapp_id)->fetch_assoc();

if (!$bapp) {
    echo json_encode(["success" => false, "message" => "Dokumen BAPP tidak ditemukan."]);
    exit;
}

// Ambil lampiran BAPP
$files = [];
$file_result = $conn->query("SELECT id, file_name, file_path FROM bapp_files WHERE bapp_id=" . (int)$bapp_id);
while ($row = $file_result->fetch_assoc()) {
    $files[] = $row;
}

// Kembalikan JSON
echo json_encode([
    "success" => true,
    "header" => [
        "id" => $bapp['id'],
        "nomor" => $bapp['nomor'],
        "nama_pekerjaan" => $bapp['nama_pekerjaan'],
        "tanggal" => $bapp['tanggal'],
        "nilai_kontrak" => formatRupiah($bapp['nomor_kontrak']), // <-- RUPIAH
        "nama_vendor" => $bapp['nama_vendor'],
        "pejabat_penerima" => $bapp['pejabat_penerima'],
        "persentase_penyelesaian" => $bapp['persentase_penyelesaian'],
        "deskripsi_pekerjaan" => $bapp['deskripsi_pekerjaan'] ?? "",
        "catatan" => $bapp['catatan'] ?? ""
    ],
    "items" => [],
    "files" => $files
]);
