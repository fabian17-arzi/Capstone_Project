<?php
header("Content-Type: application/json");
include "config.php";

$vendor_id = $_GET['vendor_id'] ?? null;

if (!$vendor_id) {
    echo json_encode(["success" => false, "message" => "Vendor ID tidak ditemukan"]);
    exit;
}

// ==================== BAPP ====================
$q_bapp = $conn->query("
    SELECT 
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS reject_count
    FROM bapp
    WHERE vendor_id = '$vendor_id'
");

$bapp = $q_bapp->fetch_assoc();

// ==================== BAPB ====================
$q_bapb = $conn->query("
    SELECT 
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS reject_count
    FROM bapb
    WHERE vendor_id = '$vendor_id'
");

$bapb = $q_bapb->fetch_assoc();

echo json_encode([
    "success" => true,
    "bapp" => [
        "approved" => $bapp["approved"],
        "pending" => $bapp["pending"],
        "reject" => $bapp["reject_count"]
    ],
    "bapb" => [
        "approved" => $bapb["approved"],
        "pending" => $bapb["pending"],
        "reject" => $bapb["reject_count"]
    ]
]);
?>
