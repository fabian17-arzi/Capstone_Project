<?php
header("Content-Type: application/json");
require_once "config.php";

$response = [];

$sql = "SELECT COUNT(*) AS total_bapp FROM bapp";
$query = mysqli_query($conn, $sql);

if ($query) {
    $data = mysqli_fetch_assoc($query);
    $response = [
        "success" => true,
        "total_bapp" => $data['total_bapp']
    ];
} else {
    $response = [
        "success" => false,
        "message" => "Gagal mengambil total BAPP"
    ];
}

echo json_encode($response);
