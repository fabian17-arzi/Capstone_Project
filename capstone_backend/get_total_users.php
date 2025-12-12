<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
include 'config.php';

$result = $conn->query("SELECT COUNT(id) AS total FROM users");
$row = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "total_users" => (int)$row['total']
]);
?>