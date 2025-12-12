<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');

$base_dir = __DIR__;

include $base_dir . '/config.php';
require $base_dir . '/fpdf/fpdf.php';
require $base_dir . '/phpqrcode/qrlib.php';

$bapb_id = $_GET["id"] ?? null;

function sendJsonError($message) {
    if (!headers_sent()) {
        header("Content-Type: application/json");
        header("Access-Control-Allow-Origin: *");
    }
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}

if (!$bapb_id) sendJsonError("ID dokumen BAPB wajib diisi.");

// ====== AMBIL DATA BAPB ======
$bapb = $conn->query("SELECT * FROM bapb WHERE id=$bapb_id")->fetch_assoc();

if (!$bapb || $bapb['status'] !== 'Approved') {
    sendJsonError("Dokumen BAPB tidak ditemukan atau belum disetujui PIC Gudang.");
}

// ====== AMBIL ITEM ======
$items = [];
$res = $conn->query("SELECT * FROM bapb_items WHERE bapb_id=$bapb_id");
while ($row = $res->fetch_assoc()) $items[] = $row;

// ====== FOLDER QR ======
$qr_folder = $base_dir . "/qrcodes/";
if (!is_dir($qr_folder)) mkdir($qr_folder, 0777, true);

// =================================================================================
// QR VENDOR (SAMA DENGAN PREVIEW)
// =================================================================================
$qr_vendor = $qr_folder . "bapb_vendor_" . $bapb_id . ".png";

$vendor_text =
"DOC=BAPB\n" .
"ID=$bapb_id\n" .
"ROLE=Vendor\n" .
"SIGNED_AT=" . ($bapb['vendor_signed_at'] ?? "-");

QRcode::png($vendor_text, $qr_vendor, QR_ECLEVEL_H, 4);

// =================================================================================
// QR PIC GUDANG (SAMA DENGAN PREVIEW)
// =================================================================================
$qr_gudang = $qr_folder . "bapb_gudang_" . $bapb_id . ".png";

$gudang_text =
"DOC=BAPB\n" .
"ID=$bapb_id\n" .
"ROLE=PIC_GUDANG\n" .
"SIGNED_AT=" . ($bapb['gudang_signed_at'] ?? "-");

QRcode::png($gudang_text, $qr_gudang, QR_ECLEVEL_H, 4);

// =================================================================================
// PDF GENERATOR
// =================================================================================
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetMargins(15, 15, 15);

// =====================
// HEADER
// =====================
$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10,'BERITA ACARA PEMERIKSAAN BARANG (BAPB)',0,1,'C');

$pdf->SetFont('Arial','',10);
$pdf->Cell(0,5,'Nomor: ' . $bapb['nomor'],0,1,'C');
$pdf->Ln(10);

// =====================
// DETAIL HEADER
// =====================
function headerRow($pdf, $label, $value) {
    $pdf->SetFont('Arial','B',10);
    $pdf->Cell(50, 7, $label, 0);
    $pdf->SetFont('Arial','',10);
    $pdf->Cell(0, 7, ': ' . $value, 0, 1);
}

headerRow($pdf, "Judul Dokumen", $bapb['judul']);
headerRow($pdf, "Tanggal Pemeriksaan", $bapb['tanggal_pemeriksaan']);
headerRow($pdf, "Pihak Vendor", $bapb['pihak_vendor']);
headerRow($pdf, "Tempat Pemeriksaan", $bapb['tempat_pemeriksaan']);

$pdf->Ln(5);

// =====================
// TABEL ITEM
// =====================
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
    $pdf->Cell(10,6,$no++,1,0,'C');
    $pdf->Cell(45,6,$item['nama_barang'],1);
    $pdf->Cell(45,6,$item['spesifikasi'],1);
    $pdf->Cell(20,6,$item['quantity'],1,0,'C');
    $pdf->Cell(20,6,$item['satuan'],1,0,'C');
    $pdf->Cell(40,6,$item['keterangan'],1,1);
}

$pdf->Ln(15);

// =====================
// TANDA TANGAN QR (SAMA DENGAN PREVIEW)
// =====================
$pdf->SetFont('Arial','B',10);
$pdf->Cell(100, 5, 'TTD Vendor:', 0, 0);
$pdf->Cell(0, 5, 'TTD PIC Gudang:', 0, 1);

$pdf->Ln(5);

// QR Vendor
$y = $pdf->GetY();
$pdf->Image($qr_vendor, 25, $y, 32);

// QR PIC Gudang
$pdf->Image($qr_gudang, 140, $y, 32);

$pdf->Ln(40);

// NAMA
$pdf->SetFont('Arial','U',10);
$pdf->Cell(100,5,$bapb['pihak_vendor'],0,0);
$pdf->Cell(0,5,$bapb['pihak_pemeriksa'],0,1);

$pdf->SetFont('Arial','',10);
$pdf->Cell(100,5,'(Vendor)',0,0);
$pdf->Cell(0,5,'(PIC Gudang)',0,1);

// =====================
// OUTPUT PDF
// =====================
$filename = "BAPB_" . str_replace('/', '-', $bapb['nomor']) . ".pdf";

header("Content-Type: application/pdf");
header("Content-Disposition: attachment; filename=\"$filename\"");
header("Cache-Control: max-age=0");

$pdf->Output("D", $filename);
exit;
