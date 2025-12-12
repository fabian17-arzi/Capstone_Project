<?php
error_reporting(0);
ob_clean();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "config.php"; 

$response = ["success" => false, "data" => [], "message" => ""];

try {
    $query = "
        SELECT 
            b.id,
            b.nomor,
            b.nama_pekerjaan,
            b.vendor_id,
            u.name AS nama_vendor,
            b.catatan_direksi,
            b.status,
            b.dibuat_pada
        FROM bapp b
        LEFT JOIN users u ON b.vendor_id = u.id
        ORDER BY b.dibuat_pada DESC
    ";


    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => "Query error: " . $conn->error
        ]);
        exit;
    }

    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $response["data"][] = $row;
    }

    $response["success"] = true;

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
exit;
?>
