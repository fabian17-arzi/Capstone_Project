<?php
header("Content-Type: application/json");
include 'config.php';

$result = $conn->query("SELECT * FROM bapb ORDER BY id DESC");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
