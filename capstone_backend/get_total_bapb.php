<?php
header("Content-Type: application/json");
require_once "config.php";

$response = [];

$sql = "SELECT COUNT(*) AS total_bapb FROM bapb";
$query = mysqli_query($conn, $sql);

if ($query) {
    $data = mysqli_fetch_assoc($query);
    $response = [
        "success" => true,
        "total_bapb" => $data['total_bapb']
    ];
} else {
    $response = [
        "success" => false,
        "message" => "Gagal mengambil total BAPB"
    ];
}

echo json_encode($response);
