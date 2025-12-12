<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); 
ini_set('display_errors', 'Off');

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

$bapb_id = $_GET["id"] ?? null;

if (!$bapb_id) {
    echo json_encode(["success" => false, "message" => "ID dokumen wajib diisi."]);
    exit;
}

try {

    // HEADER (gunakan tabel BAPB)
    $header_query = $conn->query("SELECT * FROM bapb WHERE id = $bapb_id");
    $header = $header_query->fetch_assoc();

    if (!$header) {
        echo json_encode(["success" => false, "message" => "Dokumen tidak ditemukan."]);
        exit;
    }

    // ITEMS
    $items = [];
    $item_result = $conn->query("SELECT * FROM bapb_items WHERE bapb_id=$bapb_id");
    while($row = $item_result->fetch_assoc()) {
        $items[] = $row;
    }

    // FILES
    $files = [];
    $file_result = $conn->query("SELECT file_path FROM bapb_files WHERE bapb_id=$bapb_id");
    while($row = $file_result->fetch_assoc()) {
        $files[] = $row;
    }

    echo json_encode([
        "success" => true,
        "header" => $header,
        "items" => $items,
        "files" => $files
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error database saat mengambil detail: " . $e->getMessage()]);
}

?>
