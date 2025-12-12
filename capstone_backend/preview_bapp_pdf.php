<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');

$base_dir = __DIR__;
include $base_dir . '/config.php';
require $base_dir . '/fpdf/fpdf.php';

$bapp_id = $_GET["id"] ?? null;

if (!$bapp_id) {
    die("ID dokumen tidak valid.");
}

// AMBIL DATA BAPP
$bapp = $conn->query("SELECT * FROM bapp WHERE id=" . (int)$bapp_id)->fetch_assoc();
if (!$bapp) {
    die("Dokumen BAPP tidak ditemukan.");
}

// AMBIL FILE LAMPIRAN
$files = [];
$file_result = $conn->query("SELECT id, file_name, file_path FROM bapp_files WHERE bapp_id=" . (int)$bapp_id);
while ($row = $file_result->fetch_assoc()) {
    $files[] = $row;
}

function formatRupiah($angka) {
    return "Rp " . number_format($angka, 0, ',', '.');
}


// CREATE PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetMargins(15, 15, 15);
$pdf->SetFont('Arial','B',16);

$pdf->Cell(0,10,'BERITA ACARA PENYELESAIAN PEKERJAAN (BAPP)',0,1,'C');
$pdf->SetFont('Arial','',10);
$pdf->Cell(0,5,'Nomor: ' . $bapp['nomor'],0,1,'C');
$pdf->Ln(10);

// DATA BAPP
$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Nama Pekerjaan', 0);
$pdf->SetFont('Arial','',10);
$pdf->MultiCell(0, 7, ': ' . $bapp['nama_pekerjaan'], 0, 'L');

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Tanggal', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapp['tanggal'], 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Nilai Kontrak', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . formatRupiah($bapp['nomor_kontrak']), 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Nama Vendor', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapp['nama_vendor'], 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Pejabat Penerima', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapp['pejabat_penerima'], 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Persentase Selesai', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapp['persentase_penyelesaian'] . '%', 0, 1);

// DESKRIPSI
$pdf->Ln(5);
$pdf->SetFont('Arial','B',10);
$pdf->Cell(0, 5, 'Deskripsi Pekerjaan:', 0, 1);
$pdf->SetFont('Arial','',10);
$pdf->MultiCell(0, 5, $bapp['deskripsi_pekerjaan'], 0, 'J');

// CATATAN
if (!empty($bapp['catatan'])) {
    $pdf->Ln(3);
    $pdf->SetFont('Arial','B',10);
    $pdf->Cell(0, 5, 'Catatan Vendor:', 0, 1);
    $pdf->SetFont('Arial','I',10);
    $pdf->MultiCell(0, 5, $bapp['catatan'], 0, 'J');
}

// LAMPIRAN
// LAMPIRAN (Menampilkan gambar)
if (!empty($files)) {
    $pdf->Ln(5);
    $pdf->SetFont('Arial','B',10);
    $pdf->Cell(0, 5, 'Lampiran Dokumentasi:', 0, 1);

    foreach ($files as $file) {
        $pdf->Ln(3);

        // Judul lampiran (judul file)
        $pdf->SetFont('Arial','',10);
        $pdf->Cell(0, 5, $file['file_name'], 0, 1);

        // Full path menuju file
        $imagePath = $base_dir . '/' . $file['file_path'];

        if (file_exists($imagePath)) {
            // Deteksi ukuran asli
            list($width, $height) = getimagesize($imagePath);

            // Ukuran maksimal tampilan
            $maxWidth = 75;
            $maxHeight = 55;

            // Scaling otomatis
            $ratio = min($maxWidth / $width, $maxHeight / $height);
            $newW = $width * $ratio;
            $newH = $height * $ratio;

            // Tambahkan gambar ke PDF
            $pdf->Image($imagePath, null, null, $newW, $newH);
            $pdf->Ln($newH + 5);

        } else {
            $pdf->SetFont('Arial','I',9);
            $pdf->Cell(0, 5, '(Gambar tidak ditemukan)', 0, 1);
        }
    }
}


// ===============================================
// TTD BAPP — SAMA DENGAN BAPB (FINAL FIX)
// ===============================================

$pdf->Ln(5);
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(100, 5, 'TTD Vendor:', 0, 0);
$pdf->Cell(0, 5, 'TTD Direksi:', 0, 1);


$pdf->Ln(5);
$yStart = $pdf->GetY();

// === QR Vendor ===
if (!empty($bapp['vendor_signature_qr'])) {
    $pdf->Image($base_dir . '/' . $bapp['vendor_signature_qr'], 20, $yStart, 30, 30);
} else {
    $pdf->SetXY(20, $yStart + 10);
    $pdf->SetFont('Arial','I',10);
    $pdf->Cell(30, 5, 'Belum ditandatangani', 0, 0, 'C');
}

// === QR Direksi ===
if (!empty($bapp['direksi_signature_qr'])) {
    $pdf->Image($base_dir . '/' . $bapp['direksi_signature_qr'], 140, $yStart, 30, 30);
} else {
    $pdf->SetXY(140, $yStart + 10);
    $pdf->SetFont('Arial','I',10);
    $pdf->Cell(30, 5, 'Belum ditandatangani', 0, 0, 'C');
}

$pdf->Ln(35);

// === Nama Penandatangan ===
$pdf->SetFont('Arial','U',10);
$pdf->Cell(100, 5, $bapp['nama_vendor'], 0, 0);
$pdf->Cell(0, 5, $bapp['pejabat_penerima'], 0, 1);

$pdf->SetFont('Arial','',10);
$pdf->Cell(100, 5, '(Vendor)', 0, 0);
$pdf->Cell(0, 5, '(Direksi)', 0, 1);



// OUTPUT PDF
$filename = "BAPP_PREVIEW_" . str_replace('/', '-', $bapp['nomor']) . ".pdf";

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="'.$filename.'"');

$pdf->Output('I', $filename);
exit;

?>
