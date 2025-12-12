import React, { useEffect, useState } from "react";

export default function Progres() {
  const [data, setData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  // Ambil data pending
  useEffect(() => {
    fetch("http://localhost/capstone_backend/get_pending.php")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      });
  }, []);

  const handlePreview = async (item) => {
    const url =
      item.jenis === "BAPP"
        ? `http://localhost/capstone_backend/preview_bapp_admin.php?id=${item.id}`
        : `http://localhost/capstone_backend/preview_bapb_admin.php?id=${item.id}`;

    try {
      const res = await fetch(url); // ❌ jangan pakai credentials
      const json = await res.json();

      if (!json.success) {
        alert("Gagal mengambil data preview: " + json.message);
        return;
      }

      setPreviewData(json);
      setPreviewTitle(`${item.jenis} - ${item.nama_dokumen}`);
      setShowPreview(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data preview.");
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
    setPreviewTitle("");
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-6">Dokumen Pending</h1>

      {/* HEADER */}
      <div className="grid grid-cols-5 text-lg font-bold text-gray-600 border-b pb-3 mb-4">
        <span>Dokumen</span>
        <span className="text-center">Jenis</span>
        <span className="text-center">Status</span>
        <span className="text-center">Tanggal</span>
        <span className="text-right">Aksi</span>
      </div>

      {/* LIST */}
      {data.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-5 bg-white border rounded-xl px-5 py-3 mb-3 shadow-md"
        >
          <span className="text-base font-medium">{item.nama_dokumen}</span>
          <span className="text-center text-base font-semibold text-gray-700">
            {item.jenis}
          </span>
          <span className="text-center text-base font-semibold text-yellow-600">
            Pending
          </span>
          <span className="text-center text-sm text-gray-500">
            {item.dibuat_pada
              ? new Date(item.dibuat_pada).toLocaleDateString("id-ID")
              : "-"}
          </span>
          <div className="flex justify-end">
            <button
              onClick={() => handlePreview(item)}
              className="bg-gray-700 hover:bg-gray-800 transition text-white text-sm px-4 py-2 rounded-lg shadow"
            >
              Preview
            </button>
          </div>
        </div>
      ))}

      {/* MODAL PREVIEW */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
              <h2 className="font-semibold text-gray-700">{previewTitle}</h2>
              <button
                onClick={closePreview}
                className="text-gray-600 hover:text-red-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-auto p-4">
              {/* HEADER DETAILS */}
              {previewData.header &&
                Object.entries(previewData.header).map(([key, value]) => {
                  if (value && typeof value !== "object" && !key.includes("signature"))
                    return (
                      <div key={key} className="flex mb-1">
                        <span className="font-bold w-52">{key.replace(/_/g, " ")}:</span>
                        <span>{value}</span>
                      </div>
                    );
                  return null;
                })}

              {/* ITEMS TABLE (BAPB) */}
              {previewData.items && previewData.items.length > 0 && (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-2 py-1">No</th>
                        <th className="border border-gray-300 px-2 py-1">Nama Barang</th>
                        <th className="border border-gray-300 px-2 py-1">Spesifikasi</th>
                        <th className="border border-gray-300 px-2 py-1">Qty</th>
                        <th className="border border-gray-300 px-2 py-1">Satuan</th>
                        <th className="border border-gray-300 px-2 py-1">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.nama_barang}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.spesifikasi}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center">{item.quantity}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center">{item.satuan}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.keterangan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DESKRIPSI (BAPP) */}
              {previewData.header?.deskripsi_pekerjaan && (
                <div className="mb-4">
                  <h3 className="font-bold mb-1">Deskripsi Pekerjaan:</h3>
                  <p>{previewData.header.deskripsi_pekerjaan}</p>
                </div>
              )}

              {/* CATATAN */}
              {previewData.header?.catatan && (
                <div className="mb-4">
                  <h3 className="font-bold mb-1">Catatan Vendor:</h3>
                  <p>{previewData.header.catatan}</p>
                </div>
              )}

              {/* FILES */}
              {previewData.files && previewData.files.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Lampiran:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {previewData.files.map((file) => (
                      <div key={file.id} className="border p-2 rounded">
                        <span className="block font-medium mb-1">{file.file_name}</span>
                        {file.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <img
                            src={`http://localhost/capstone_backend/${file.file_path}`}
                            alt={file.file_name}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <a
                            href={`http://localhost/capstone_backend/${file.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            {file.file_name}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
