<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"]) || !isset($data["status"])) {
    echo json_encode(["success" => false, "message" => "ID dokumen dan status wajib diisi"]);
    exit;
}

$id = $data["id"];
$status = $data["status"]; 
$catatan = $data["catatan"] ?? null;

if (!in_array($status, ['Approved', 'Rejected'])) {
    echo json_encode(["success" => false, "message" => "Status tidak valid."]);
    exit;
}

if ($status === 'Rejected') {
    $stmt = $conn->prepare("
        UPDATE bapp SET status = ?, catatan_direksi = ? WHERE id = ?
    ");
    $stmt->bind_param("ssi", $status, $catatan, $id);
    $message = "Dokumen BAPP berhasil **ditolak**. Catatan telah disimpan.";
} else {
    $stmt = $conn->prepare("
        UPDATE bapp SET status = ?, catatan_direksi = NULL WHERE id = ?
    ");
    $stmt->bind_param("si", $status, $id);
    $message = "Dokumen BAPP berhasil **disetujui**.";
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => $message]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal memperbarui status BAPP: " . $conn->error]);
}
$stmt->close();
?>