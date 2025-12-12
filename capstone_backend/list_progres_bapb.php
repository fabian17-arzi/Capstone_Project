<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

$result = $conn->query("
    SELECT 
        bapb.id,
        bapb.judul,
        bapb.nomor,
        bapb.pihak_vendor,
        bapb.dibuat_pada,
        bapb.status,
        COUNT(bapb_items.id) AS total_items
    FROM bapb
    LEFT JOIN bapb_items ON bapb.id = bapb_items.bapb_id
    WHERE bapb.status = 'Pending'
    GROUP BY bapb.id
    ORDER BY bapb.dibuat_pada DESC
");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
?>