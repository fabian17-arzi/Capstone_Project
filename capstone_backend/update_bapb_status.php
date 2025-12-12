<?php
// =============================
//   FIX CORS UNTUK VITE (5173)
// =============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle OPTIONS (Preflight)
// Jika tidak ada ini → Vite akan "Failed to fetch"
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include 'config.php';

// =============================
//     VALIDASI INPUT JSON
// =============================
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"]) || !isset($data["status"])) {
    echo json_encode(["success" => false, "message" => "ID dokumen dan status wajib diisi"]);
    exit;
}

$id = (int)$data["id"];
$status = $data["status"];
$catatan = $data["catatan"] ?? null;

if (!in_array($status, ['Approved', 'Rejected'])) {
    echo json_encode(["success" => false, "message" => "Status tidak valid."]);
    exit;
}

// =============================
//      EXECUTE QUERY UPDATE
// =============================
if ($status === 'Rejected') {
    $stmt = $conn->prepare("
        UPDATE bapb SET status = ?, catatan_gudang = ? WHERE id = ?
    ");
    $stmt->bind_param("ssi", $status, $catatan, $id);
    $message = "Dokumen berhasil ditolak. Catatan disimpan.";
} else {
    $stmt = $conn->prepare("
        UPDATE bapb SET status = ?, catatan_gudang = NULL WHERE id = ?
    ");
    $stmt->bind_param("si", $status, $id);
    $message = "Dokumen berhasil disetujui.";
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => $message]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal memperbarui status dokumen: " . $conn->error]);
}

$stmt->close();
?>
