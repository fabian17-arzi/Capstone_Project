<?php
header("Content-Type: application/json");
include '../config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

$id = $data["id"];
$name = $data["name"];
$email = $data["email"];
$password = $data["password"];
$role = $data["role"];

// Jika password kosong → gunakan password lama
if (empty($password)) {
    $result = $conn->query("SELECT password FROM users WHERE id = $id");
    $row = $result->fetch_assoc();
    $password = $row["password"];
}

$stmt = $conn->prepare("
    UPDATE users SET 
        name=?, email=?, password=?, role=?
    WHERE id=?
");
$stmt->bind_param("ssssi", $name, $email, $password, $role, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User berhasil diperbarui"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal memperbarui user"]);
}
