<?php
// =======================================================
error_reporting(E_ALL); 
ini_set('display_errors', 'On'); 
// =======================================================

$base_dir = __DIR__;
include $base_dir . '/config.php';
require $base_dir . '/fpdf/fpdf.php';

$bapp_id = $_GET["id"] ?? null;

if (!$bapp_id) {
    die("ID dokumen tidak valid.");
}

if (!isset($conn) || !$conn) {
    die("Error Fatal: Gagal terhubung ke database.");
}

// ===========================
// AMBIL DATA BAPP (Approved)
// ===========================
$bapp = $conn->query(
    "SELECT * FROM bapp WHERE id=" . (int)$bapp_id . " AND status='Approved'"
)->fetch_assoc();

if (!$bapp) {
    die("Dokumen BAPP tidak ditemukan atau belum disetujui.");
}

// ===========================
// AMBIL FILE LAMPIRAN
// ===========================
$files = [];
$file_result = $conn->query(
    "SELECT id, file_name, file_path FROM bapp_files WHERE bapp_id=" . (int)$bapp_id
);

while ($row = $file_result->fetch_assoc()) {
    $files[] = $row;
}

// ===========================
// FUNGSION FORMAT RUPIAH
// ===========================
function formatRupiah($angka) {
    return "Rp " . number_format($angka, 0, ',', '.');
}

// ===========================
// GENERATE PDF (SAMA SEPERTI PREVIEW)
// ===========================
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetMargins(15, 15, 15);
$pdf->SetAutoPageBreak(true, 15);

// JUDUL
$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10,'BERITA ACARA PENYELESAIAN PEKERJAAN (BAPP)',0,1,'C');
$pdf->SetFont('Arial','',10);
$pdf->Cell(0,5,'Nomor: ' . $bapp['nomor'],0,1,'C');
$pdf->Ln(10);

// DETAIL DATA BAPP
function rowField($pdf, $label, $value) {
    $pdf->SetFont('Arial','B',10);
    $pdf->Cell(50, 7, $label, 0);
    $pdf->SetFont('Arial','',10);
    $pdf->MultiCell(0, 7, ': ' . $value, 0, 'L');
}

rowField($pdf, 'Nama Pekerjaan', $bapp['nama_pekerjaan']);
rowField($pdf, 'Tanggal', $bapp['tanggal']);
rowField($pdf, 'Nilai Kontrak', formatRupiah($bapp['nomor_kontrak'])); // <-- RUPIAH
rowField($pdf, 'Nama Vendor', $bapp['nama_vendor']);
rowField($pdf, 'Pejabat Penerima', $bapp['pejabat_penerima']);
rowField($pdf, 'Persentase Selesai', $bapp['persentase_penyelesaian'] . '%');

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

// ===========================
// LAMPIRAN DENGAN GAMBAR (SAMA SEPERTI PREVIEW)
// ===========================
if (!empty($files)) {
    $pdf->Ln(5);
    $pdf->SetFont('Arial','B',10);
    $pdf->Cell(0, 5, 'Lampiran Dokumentasi:', 0, 1);

    foreach ($files as $file) {
        $pdf->Ln(3);

        // judul file
        $pdf->SetFont('Arial','',10);
        $pdf->Cell(0, 5, $file['file_name'], 0, 1);

        $imagePath = $base_dir . '/' . $file['file_path'];

        if (file_exists($imagePath)) {

            list($width, $height) = getimagesize($imagePath);

            $maxWidth = 75;
            $maxHeight = 55;

            $ratio = min($maxWidth / $width, $maxHeight / $height);
            $newW = $width * $ratio;
            $newH = $height * $ratio;

            $pdf->Image($imagePath, null, null, $newW, $newH);
            $pdf->Ln($newH + 5);

        } else {
            $pdf->SetFont('Arial','I',9);
            $pdf->Cell(0, 5, '(Gambar tidak ditemukan)', 0, 1);
        }
    }
}

// ===========================
// TANDA TANGAN QR (SAMA SEPERTI PREVIEW)
// ===========================
$pdf->Ln(5);
$pdf->SetFont('Arial','B',10);
$pdf->Cell(100, 5, 'TTD Vendor:', 0, 0);
$pdf->Cell(0, 5, 'TTD Direksi:', 0, 1);

$pdf->Ln(5);
$yStart = $pdf->GetY();

// QR Vendor
if (!empty($bapp['vendor_signature_qr'])) {
    $pdf->Image($base_dir . '/' . $bapp['vendor_signature_qr'], 20, $yStart, 30, 30);
} else {
    $pdf->SetXY(20, $yStart + 10);
    $pdf->SetFont('Arial','I',10);
    $pdf->Cell(30, 5, 'Belum ditandatangani', 0, 0, 'C');
}

// QR Direksi
if (!empty($bapp['direksi_signature_qr'])) {
    $pdf->Image($base_dir . '/' . $bapp['direksi_signature_qr'], 140, $yStart, 30, 30);
} else {
    $pdf->SetXY(140, $yStart + 10);
    $pdf->SetFont('Arial','I',10);
    $pdf->Cell(30, 5, 'Belum ditandatangani', 0, 0, 'C');
}

$pdf->Ln(35);

// Nama Penandatangan
$pdf->SetFont('Arial','U',10);
$pdf->Cell(100, 5, $bapp['nama_vendor'], 0, 0);
$pdf->Cell(0, 5, $bapp['pejabat_penerima'], 0, 1);

$pdf->SetFont('Arial','',10);
$pdf->Cell(100, 5, '(Vendor)', 0, 0);
$pdf->Cell(0, 5, '(Direksi)', 0, 1);

// ===========================
// DOWNLOAD PDF
// ===========================
$filename = "BAPP_" . str_replace('/', '-', $bapp['nomor']) . ".pdf";

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="'.$filename.'"');

$pdf->Output('D', $filename);
exit;

?>
