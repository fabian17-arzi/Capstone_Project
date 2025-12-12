<?php
header("Content-Type: application/json");
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$bapb_id = $data["bapb_id"];
$nama = $data["nama_barang"];
$spesifikasi = $data["spesifikasi"];
$qty = $data["quantity"];
$satuan = $data["satuan"];
$keterangan = $data["keterangan"];

$stmt = $conn->prepare("
    INSERT INTO bapb_items (bapb_id, nama_barang, spesifikasi, quantity, satuan, keterangan)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("ississ", $bapb_id, $nama, $spesifikasi, $qty, $satuan, $keterangan);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
