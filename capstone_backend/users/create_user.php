<?php
header("Content-Type: application/json");
include '../config.php';  // WAJIB!

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

$name = $data["name"];
$email = $data["email"];
$password = $data["password"];
$role = $data["role"];

$stmt = $conn->prepare("
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("ssss", $name, $email, $password, $role);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User berhasil ditambahkan"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menambah user"]);
}
