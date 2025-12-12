import { useEffect, useState } from "react";
import { FiDownload, FiEye } from "react-icons/fi";

export default function ArsipDireksi() {
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/capstone_backend/list_archive_bapp_direksi.php");
      const result = await res.json();
      
      if (result.success) {
        setDokumenList(result.data);
      } else {
        alert("Gagal mengambil data arsip: " + result.message);
      }
    } catch (error) {
      alert("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, []);

  const handleDownload = (item) => {
    window.open(
      `http://localhost/capstone_backend/download_bapp_pdf.php?id=${item.id}`,
      "_blank"
    );
  };

  // Preview untuk popup
  const handlePreview = (item) => {
    setPreviewUrl(`http://localhost/capstone_backend/preview_bapp_pdf.php?id=${item.id}`);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewUrl("");
  };

  const getStatusDisplay = (item) => { 
    if (item.status === 'Approved') {
        return <p className="text-sm text-green-600 font-semibold">Status: Disetujui</p>;
    }
    if (item.status === 'Rejected') {
        const catatan = item.catatan_direksi ? `Alasan: ${item.catatan_direksi}` : '';
        return (
            <>
                <p className="text-sm text-red-600 font-semibold">Status: Ditolak</p>
                {catatan && <p className="text-xs text-red-400 mt-1 italic">{catatan}</p>}
            </>
        );
    }
    return <p className="text-sm text-gray-500">Status: Selesai</p>;
  };

  if (loading) { 
    return (
      <div className="p-6 w-full">
        <div className="text-center text-lg">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">

      {/* HEADER */}
      <div className="bg-purple-600 h-32 rounded-xl text-white p-6 flex items-center text-xl font-bold">
        Arsip BAPP ({dokumenList.length})
      </div>
      
      {/* LIST */}
      <div className="mt-6 space-y-4">
        {dokumenList.length === 0 ? (
          <p className="mt-4">Tidak ada dokumen BAPP yang diarsipkan.</p>
        ) : (
          dokumenList.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.nama_pekerjaan} - No. {item.nomor}
                </h3>
                <p className="text-sm text-gray-500">
                  Vendor: {item.nama_vendor} • Diajukan: {new Date(item.dibuat_pada).toLocaleDateString()}
                </p>
                {getStatusDisplay(item)}
              </div>

              <div className="flex items-center gap-4 text-gray-600">

                {item.status === 'Approved' && (
                  <button
                    onClick={() => handleDownload(item)}
                    className="hover:text-purple-700"
                    title="Download PDF"
                  >
                    <FiDownload size={20} />
                  </button>
                )}

                <button
                  onClick={() => handlePreview(item)}
                  className="hover:text-purple-700"
                  title="Preview PDF"
                >
                  <FiEye size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================================
          MODAL PREVIEW
      ================================= */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-[90vh] flex flex-col">

            {/* HEADER MODAL */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
              <h2 className="font-semibold text-gray-700">Preview Dokumen BAPP</h2>

              <button
                onClick={closePreview}
                className="text-gray-600 hover:text-red-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* BODY / IFRAME */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="PDF Preview"
              ></iframe>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
