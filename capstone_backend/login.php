<?php
require "config.php";

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? "";
$password = $data->password ?? "";
$password = md5($password); // hashing MD5

$query = "SELECT * FROM admin_users WHERE username='$username' AND password='$password' LIMIT 1";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["status" => "success", "message" => "Login berhasil"]);
} else {
    echo json_encode(["status" => "error", "message" => "Username atau password salah"]);
}
?>
