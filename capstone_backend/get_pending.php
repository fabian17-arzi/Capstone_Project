<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

error_reporting(0);
include 'config.php';

$query = "
    SELECT 
        id, 
        judul AS nama_dokumen, 
        'BAPB' AS jenis, 
        status,
        dibuat_pada
    FROM bapb 
    WHERE LOWER(status) = 'pending'

    UNION ALL

    SELECT 
        id, 
        nama_pekerjaan AS nama_dokumen, 
        'BAPP' AS jenis, 
        status,
        dibuat_pada
    FROM bapp
    WHERE LOWER(status) = 'pending'

    ORDER BY id DESC
";

$result = $conn->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
