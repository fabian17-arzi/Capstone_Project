<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

// Pastikan bapp_id dikirim
if (!isset($_POST["bapp_id"])) {
    echo json_encode(["success" => false, "message" => "bapp_id tidak dikirim"]);
    exit;
}

$bapp_id = $_POST["bapp_id"];

// Path absolut ke folder upload
$targetDir = "C:/xampp/htdocs/capstone_backend/uploads/";

// Buat folder jika belum ada
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Cek file upload
if (!isset($_FILES["file"])) {
    echo json_encode(["success" => false, "message" => "Tidak ada file yang diupload"]);
    exit;
}

$originalFileName = basename($_FILES["file"]["name"]);
$fileExtension = pathinfo($originalFileName, PATHINFO_EXTENSION);

// Nama file unik
$fileName = time() . "_" . $bapp_id . "." . $fileExtension;
$targetPath = $targetDir . $fileName;

// Proses upload file
if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath)) {

    // Path relatif untuk frontend
    $dbFilePath = "uploads/" . $fileName;

    // Simpan ke database
    $stmt = $conn->prepare("
        INSERT INTO bapp_files (bapp_id, file_path, file_name)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("iss", $bapp_id, $dbFilePath, $originalFileName);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Upload berhasil",
            "file_name" => $originalFileName,
            "saved_as" => $fileName,
            "path" => $dbFilePath
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Upload berhasil, tapi gagal simpan DB"]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Upload gagal — tidak bisa memindahkan file"]);
}
?>
