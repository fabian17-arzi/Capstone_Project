<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); 
ini_set('display_errors', 'Off');

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';


$vendor_id = $_GET["vendor_id"] ?? null;

if (!$vendor_id) {
    echo json_encode(["success" => false, "message" => "Vendor ID wajib diisi."]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            id, judul, nomor, status, catatan_gudang, dibuat_pada 
        FROM bapb
        WHERE vendor_id = ?
        ORDER BY dibuat_pada DESC
    ");
    $stmt->bind_param("i", $vendor_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Gagal menjalankan query. Error: " . $conn->error);
    }

    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $row['type'] = 'BAPB'; 
        $row['nama_pekerjaan'] = $row['judul'];
        $row['catatan_direksi'] = null;
        
        $data[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error database saat mengambil progres Vendor: " . $e->getMessage()]);
}
?>