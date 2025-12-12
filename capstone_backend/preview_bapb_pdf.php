<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');

$base_dir = __DIR__;

include $base_dir . '/config.php';
require $base_dir . '/fpdf/fpdf.php';
require $base_dir . '/phpqrcode/qrlib.php'; // ← QR CODE LIB

$bapb_id = $_GET["id"] ?? null;

function sendJsonError($message) {
    if (!headers_sent()) {
        header("Content-Type: application/json");
        header("Access-Control-Allow-Origin: *");
    }
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}

if (!$bapb_id) {
    sendJsonError("ID dokumen BAPB wajib diisi.");
}

if (!isset($conn) || !$conn) {
    sendJsonError("Gagal koneksi database.");
}

// === AMBIL HEADER BAPB ===
$bapb = $conn->query("SELECT * FROM bapb WHERE id=$bapb_id")->fetch_assoc();

if (!$bapb || $bapb['status'] !== 'Approved') {
    sendJsonError("Dokumen BAPB tidak ditemukan atau belum disetujui.");
}

// === AMBIL ITEM BARANG ===
$items = [];
$item_result = $conn->query("SELECT * FROM bapb_items WHERE bapb_id=$bapb_id");
while ($row = $item_result->fetch_assoc()) {
    $items[] = $row;
}

// === PATH QR CODE ===
$qr_folder = $base_dir . "/qrcodes/";
if (!is_dir($qr_folder)) mkdir($qr_folder, 0777, true);

// === QR VENDOR ===
$qr_vendor = $qr_folder . "bapb_vendor_" . $bapb_id . ".png";

if (!file_exists($qr_vendor)) {
    QRcode::png("
        DOC: BAPB
        ID: $bapb_id
        ROLE: Vendor
        SIGNED_AT: {$bapb['vendor_signed_at']}
    ", $qr_vendor, QR_ECLEVEL_H, 4);
}

// === QR PIC GUDANG ===
$qr_pic = $qr_folder . "bapb_pic_" . $bapb_id . ".png";

if (!file_exists($qr_pic)) {
    QRcode::png("
        DOC: BAPB
        ID: $bapb_id
        ROLE: PIC_GUDANG
        SIGNED_AT: {$bapb['gudang_signed_at']}
    ", $qr_pic, QR_ECLEVEL_H, 4);
}


// === GENERATE PDF ===
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetMargins(15, 15, 15);
$pdf->SetFont('Arial','B',16);

$pdf->Cell(0,10,'BERITA ACARA PEMERIKSAAN BARANG (BAPB)',0,1,'C');
$pdf->SetFont('Arial','',10);
$pdf->Cell(0,5,'Nomor: ' . $bapb['nomor'],0,1,'C');
$pdf->Ln(10);

// HEADER DETAILS
$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Judul Dokumen', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapb['judul'], 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Tanggal Pemeriksaan', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapb['tanggal_pemeriksaan'], 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Pihak Vendor', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapb['pihak_vendor'], 0, 1);

$pdf->SetFont('Arial','B',10);
$pdf->Cell(50, 7, 'Tempat Pemeriksaan', 0);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 7, ': ' . $bapb['tempat_pemeriksaan'], 0, 1);

$pdf->Ln(5);

// TABEL HEADER
$pdf->SetFont('Arial','B',10);
$pdf->Cell(10, 8, 'No', 1, 0, 'C');
$pdf->Cell(45, 8, 'Nama Barang', 1, 0, 'C');
$pdf->Cell(45, 8, 'Spesifikasi', 1, 0, 'C');
$pdf->Cell(20, 8, 'Qty', 1, 0, 'C');
$pdf->Cell(20, 8, 'Satuan', 1, 0, 'C');
$pdf->Cell(40, 8, 'Keterangan', 1, 1, 'C');

$pdf->SetFont('Arial','',10);
$no = 1;
foreach ($items as $item) {
    $pdf->Cell(10, 6, $no++, 1, 0, 'C');
    $pdf->Cell(45, 6, $item['nama_barang'], 1, 0);
    $pdf->Cell(45, 6, $item['spesifikasi'], 1, 0);
    $pdf->Cell(20, 6, $item['quantity'], 1, 0, 'C');
    $pdf->Cell(20, 6, $item['satuan'], 1, 0, 'C');
    $pdf->Cell(40, 6, $item['keterangan'], 1, 1);
}

$pdf->Ln(15);

// FOOTER TTD + QR
$pdf->SetFont('Arial','B',10);
$pdf->Cell(100, 5, 'TTD Vendor:', 0, 0);
$pdf->Cell(0, 5, 'TTD PIC Gudang:', 0, 1);

$pdf->Ln(5);

// QR Vendor
$pdf->Image($qr_vendor, 20, $pdf->GetY(), 30, 30);

// QR PIC
$pdf->Image($qr_pic, 140, $pdf->GetY(), 30, 30);

$pdf->Ln(35);

// NAMA PENANDATANGAN
$pdf->SetFont('Arial','U',10);
$pdf->Cell(100, 5, $bapb['pihak_vendor'], 0, 0);
$pdf->Cell(0, 5, $bapb['pihak_pemeriksa'], 0, 1);

$pdf->SetFont('Arial','',10);
$pdf->Cell(100, 5, '(Vendor)', 0, 0);
$pdf->Cell(0, 5, '(PIC Gudang)', 0, 1);

$filename = "BAPB_" . str_replace('/', '-', $bapb['nomor']) . ".pdf";
header("Content-Type: application/pdf");
$pdf->Output("I", $filename);
exit;

?>
