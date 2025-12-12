<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "capstone_db";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}
?>
