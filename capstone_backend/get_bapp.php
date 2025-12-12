<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

// Ambil ID
$bapp_id = $_GET["id"] ?? null;

if (!$bapp_id || !is_numeric($bapp_id)) {
    echo json_encode([
        "success" => false, 
        "message" => "ID dokumen wajib diisi dan harus angka."
    ]);
    exit;
}

// ===========================
// 1. Ambil Header BAPP
// ===========================
$stmt = $conn->prepare("SELECT * FROM bapp WHERE id = ?");
$stmt->bind_param("i", $bapp_id);
$stmt->execute();
$result = $stmt->get_result();
$header = $result->fetch_assoc();

if (!$header) {
    echo json_encode([
        "success" => false,
        "message" => "Dokumen BAPP tidak ditemukan."
    ]);
    exit;
}

// ===========================
// 2. Ambil File BAPP
// ===========================
$stmt_files = $conn->prepare("
    SELECT id, file_path, file_name 
    FROM bapp_files 
    WHERE bapp_id = ?
");
$stmt_files->bind_param("i", $bapp_id);
$stmt_files->execute();
$file_result = $stmt_files->get_result();

$files = [];
while ($row = $file_result->fetch_assoc()) {
    $files[] = $row;
}

// ===========================
// 3. Response
// ===========================
echo json_encode([
    "success" => true,
    "header" => $header,
    "files" => $files
]);
