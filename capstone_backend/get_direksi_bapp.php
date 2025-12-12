<?php
header("Content-Type: application/json");
include "config.php";

// BAPP selesai
$q_done = $conn->query("SELECT COUNT(*) AS total FROM bapp WHERE status = 'Approved'");
$total_done = $q_done->fetch_assoc()['total'];

// BAPP pending
$q_pending = $conn->query("SELECT COUNT(*) AS total FROM bapp WHERE status = 'Pending'");
$total_pending = $q_pending->fetch_assoc()['total'];

echo json_encode([
    "success" => true,
    "total_selesai" => $total_done,
    "total_pending" => $total_pending
]);
?>
