<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); 
ini_set('display_errors', 'Off');

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

$vendor_id = $_GET["vendor_id"] ?? null;

if (!$vendor_id) {
    echo json_encode(["success" => true, "data" => [], "message" => "Vendor ID missing."]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            id, nomor, status, dibuat_pada, nama_pekerjaan, catatan_direksi, 'BAPP' as type 
        FROM bapp
        WHERE vendor_id = ?
        ORDER BY dibuat_pada DESC
    ");
    $stmt->bind_param("i", $vendor_id);
    
    if (!$stmt->execute()) {
        throw new Exception("SQL EXECUTION FAILED: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $row['judul'] = $row['nama_pekerjaan']; 
        $row['catatan_gudang'] = null;

        $data[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "FATAL CRASH in BAPP List: " . $e->getMessage()]);
    exit;
}
?>