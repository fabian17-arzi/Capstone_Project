<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$password = $data["password"];

if (!$email || !$password) {
    echo json_encode(["success"=>false, "message"=>"Email dan password wajib diisi"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["success"=>false, "message"=>"Email tidak ditemukan"]);
    exit;
}

$user = $result->fetch_assoc();

if ($password !== $user["password"]) {
    echo json_encode(["success"=>false, "message"=>"Password salah"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $user["id"],
        "name" => $user["name"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);
