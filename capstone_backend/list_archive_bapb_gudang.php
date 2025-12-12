<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

try {
    $result = $conn->query("
        SELECT 
            id, judul, nomor, pihak_vendor, dibuat_pada, status, catatan_gudang
        FROM bapb
        WHERE status IN ('Approved', 'Rejected') 
        ORDER BY dibuat_pada DESC
    ");

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(["success" => true, "data" => $data]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error database saat mengambil arsip BAPB: " . $e->getMessage()]);
}
?>