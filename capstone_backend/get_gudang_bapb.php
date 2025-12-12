<?php
header("Content-Type: application/json");
include "config.php";

// BAPB selesai (Approved)
$sql_selesai = $conn->query("SELECT COUNT(*) AS total FROM bapb WHERE status = 'Approved'");
$selesai = $sql_selesai->fetch_assoc()['total'];

// BAPB pending (Pending)
$sql_pending = $conn->query("SELECT COUNT(*) AS total FROM bapb WHERE status = 'Pending'");
$pending = $sql_pending->fetch_assoc()['total'];

echo json_encode([
    "success" => true,
    "total_selesai" => $selesai,
    "total_pending" => $pending
]);
?>
