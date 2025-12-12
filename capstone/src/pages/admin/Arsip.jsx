// File: ArsipAdmin.jsx

import { FiDownload, FiEye } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function ArsipAdmin() {
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // ======================= FETCH SEMUA DOKUMEN (ADMIN) =======================
  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const resBAPB = await fetch(
        `http://localhost/capstone_backend/list_admin_progres_bapb.php`
      );
      const resultBAPB = await resBAPB.json();

      const resBAPP = await fetch(
        `http://localhost/capstone_backend/list_admin_progres_bapp.php`
      );
      const resultBAPP = await resBAPP.json();

      let combinedData = [];

      if (resultBAPB.success && Array.isArray(resultBAPB.data)) {
        combinedData = [
          ...combinedData,
          ...resultBAPB.data.map((item) => ({ ...item, type: "BAPB" })),
        ];
      }
      if (resultBAPP.success && Array.isArray(resultBAPP.data)) {
        combinedData = [
          ...combinedData,
          ...resultBAPP.data.map((item) => ({ ...item, type: "BAPP" })),
        ];
      }

      const archiveData = combinedData.filter(
        (item) => item.status === "Approved" || item.status === "Rejected"
      );

      archiveData.sort(
        (a, b) => new Date(b.dibuat_pada) - new Date(a.dibuat_pada)
      );

      setDokumenList(archiveData);
    } catch (error) {
      alert("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, []);

  // ======================= PREVIEW =======================
  const handlePreview = (item) => {
    const endpoint =
      item.type === "BAPB" ? "preview_bapb_pdf.php" : "preview_bapp_pdf.php";

    setPreviewUrl(`http://localhost/capstone_backend/${endpoint}?id=${item.id}`);
    setPreviewTitle(`Preview Dokumen ${item.type}`);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewUrl("");
    setPreviewTitle("");
  };

  // ======================= DOWNLOAD =======================
  const handleDownload = (item) => {
    const endpoint =
      item.type === "BAPB" ? "download_bapb_pdf.php" : "download_bapp_pdf.php";

    window.open(
      `http://localhost/capstone_backend/${endpoint}?id=${item.id}`,
      "_blank"
    );
  };

  // ======================= STATUS =======================
  const getStatusDisplay = (item) => {
    if (item.status === "Approved") {
      return (
        <p className="text-sm text-green-600 font-semibold">
          Status: Disetujui Penuh
        </p>
      );
    }
    if (item.status === "Rejected") {
      const catatan =
        item.type === "BAPB" ? item.catatan_gudang : item.catatan_direksi;

      return (
        <>
          <p className="text-sm text-red-600 font-semibold">Status: Ditolak</p>
          {catatan && (
            <p className="text-xs text-red-400 mt-1 italic">
              Alasan: {catatan}
            </p>
          )}
        </>
      );
    }
  };

  // ======================= LOADING =======================
  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="text-center text-lg">Memuat data arsip...</div>
      </div>
    );
  }

  // ======================= RENDER =======================
  return (
    <div className="p-6 w-full">
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl text-white p-6 shadow">
        <h2 className="text-2xl font-bold">Arsip Dokumen (Admin)</h2>
        <p className="text-sm opacity-80">
          Semua dokumen Approved / Rejected ({dokumenList.length})
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {dokumenList.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow text-gray-500">
            Tidak ada dokumen arsip.
          </div>
        ) : (
          dokumenList.map((item) => (
            <div
              key={item.type + item.id}
              className="bg-white shadow border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.type}:{" "}
                  {item.type === "BAPB" ? item.judul : item.nama_pekerjaan} (No.{" "}
                  {item.nomor})
                </h3>

                {getStatusDisplay(item)}

                <p className="text-xs text-gray-400 mt-1">
                  Diajukan pada:{" "}
                  {new Date(item.dibuat_pada).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                {item.status === "Approved" && (
                  <button
                    onClick={() => handleDownload(item)}
                    className="hover:text-blue-700"
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

      {/* ======================= MODAL PREVIEW ======================= */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
              <h2 className="font-semibold text-gray-700">{previewTitle}</h2>

              <button
                onClick={closePreview}
                className="text-gray-600 hover:text-red-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

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