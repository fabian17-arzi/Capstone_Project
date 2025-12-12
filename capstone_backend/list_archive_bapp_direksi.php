<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

try {
    $result = $conn->query("
        SELECT 
            id, nomor, nama_pekerjaan, nama_vendor, dibuat_pada, status, catatan_direksi
        FROM bapp
        WHERE status IN ('Approved', 'Rejected') 
        ORDER BY dibuat_pada DESC
    ");

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(["success" => true, "data" => $data]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error database saat mengambil arsip BAPP: " . $e->getMessage()]);
}
?>