import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProgresVendor() {
  const navigate = useNavigate();
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState(null);

  // Ambil ID Vendor dari localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && (user.role === "Vendor Barang" || user.role === "Vendor Pekerjaan" || user.role === "Vendor")) {
        setVendorId(user.id);
    } else {
        navigate("/"); 
    }
  }, [navigate]);

  // Fungsi fetch diganti untuk mengambil data BAPB dan BAPP
  const fetchDokumen = async (id) => {
    setLoading(true);
    try {
      // 1. Fetch data BAPB
      const resBAPB = await fetch(`http://localhost/capstone_backend/list_vendor_progres_bapb.php?vendor_id=${id}`);
      const resultBAPB = await resBAPB.json();

      // 2. Fetch data BAPP
      const resBAPP = await fetch(`http://localhost/capstone_backend/list_vendor_progres_bapp.php?vendor_id=${id}`);
      const resultBAPP = await resBAPP.json();
      
      let combinedData = [];

      if (resultBAPB.success && Array.isArray(resultBAPB.data)) {
        combinedData = [...combinedData, ...resultBAPB.data];
      }
      if (resultBAPP.success && Array.isArray(resultBAPP.data)) {
        combinedData = [...combinedData, ...resultBAPP.data];
      }

      // 3. Gabungkan dan Urutkan berdasarkan tanggal (dibuat_pada)
      combinedData.sort((a, b) => new Date(b.dibuat_pada) - new Date(a.dibuat_pada));

      setDokumenList(combinedData);

    } catch (error) {
      alert("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (vendorId) {
        fetchDokumen(vendorId);
    }
  }, [vendorId]);


  // FIX/REFINEMENT: Fungsi helper untuk menampilkan status dan catatan 
  const getStatusDisplay = (item) => { 
    const status = item.status;
    const approver = item.type === 'BAPB' ? 'PIC Gudang' : 'Direksi Pekerjaan';
    
    // Tentukan catatan penolakan berdasarkan tipe dokumen (menggunakan field yang tersedia)
    const catatan = item.type === 'BAPB' ? item.catatan_gudang : item.catatan_direksi;

    if (status === 'Rejected') {
        return (
            <>
                {/* FIX: Menampilkan penolakan yang lebih jelas */}
                <p className="text-sm text-red-600 font-semibold">Status: Ditolak oleh {approver}. Harap Buat Ulang.</p>
                {catatan && catatan.trim() !== "" && ( 
                    <p className="text-xs text-red-400 mt-1 italic">Alasan: {catatan}</p> 
                )}
            </>
        );
    }
    
    // Status Pending/Approved
    const statusText = status === 'Pending' ? 'Menunggu Persetujuan' : 'Disetujui';
    const statusColor = status === 'Pending' ? 'text-yellow-600' : 'text-green-600';
    
    return (
        <p className={`text-sm ${statusColor} font-semibold`}>
            Status: {statusText} ({approver})
        </p>
    );
  }
  
  // Menentukan URL Download berdasarkan tipe dokumen
  const handleDownload = (item) => {
    const endpoint = item.type === 'BAPB' 
        ? "download_bapb_pdf.php" 
        : "download_bapp_pdf.php";

    // PENTING: window.open akan mencoba menampilkan respons PHP. Jika PHP merespons JSON (error), 
    // browser akan mencoba mengunduh file JSON atau menampilkan pesan error
    window.open(`http://localhost/capstone_backend/${endpoint}?id=${item.id}`, '_blank');
  };


  if (loading) {
    return (
        <div className="p-6 w-full">
          <div className="text-center text-lg text-blue-700">Memuat data progress...</div>
        </div>
      );
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="bg-blue-700 h-32 rounded-xl text-white p-6 flex items-center text-xl font-bold">
        Hallo Vendor
      </div>

      {/* Search + Buat dokumen */}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          placeholder="Cari dokumen..."
          className="flex-1 border p-2 rounded"
        />

        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => navigate("/vendor/buat-dokumen")}
        >
          + Buat Dokumen
        </button>
      </div>

      {/* List Dokumen Vendor */}
      <h2 className="text-lg font-bold mt-6 mb-4">Daftar Dokumen Anda ({dokumenList.length})</h2>
      
      <div className="mt-6 space-y-4">
        {dokumenList.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow text-gray-500">
            Anda belum membuat dokumen.
          </div>
        ) : (
            dokumenList.map((item) => (
            <div key={item.type + item.id} className="bg-white p-4 rounded-md shadow flex justify-between items-center">
                <div>
                    <p className="font-semibold">
                        {/* Memastikan judul yang benar tampil: judul untuk BAPB, nama_pekerjaan untuk BAPP */}
                        **[{item.type}]** {item.type === 'BAPB' ? item.judul : item.nama_pekerjaan} (No. {item.nomor})
                    </p>
                    {getStatusDisplay(item)} {/* Memanggil fungsi tampilan status */}
                    <p className="text-xs text-gray-400 mt-1">Diajukan pada: {new Date(item.dibuat_pada).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                    {item.status === 'Approved' && (
                        <button
                            onClick={() => handleDownload(item)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Download PDF
                        </button>
                    )}
                    {item.status === 'Rejected' && (
                        <button
                            onClick={() => navigate("/vendor/buat-dokumen")}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Buat Ulang
                        </button>
                    )}
                </div>

            </div>
            ))
        )}
      </div>
    </div>
  );
}