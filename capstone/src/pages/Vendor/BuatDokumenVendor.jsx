import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormBAPB from "../../components/FormBAPB";
import FormBAPP from "../../components/FormBAPP";

export default function BuatDokumenVendor() {
  const navigate = useNavigate();
  const [active, setActive] = useState("bapb");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = async (submitFunc) => {
    const success = await submitFunc();
    if (success) setShowSuccess(true);
  };

  return (
    <div className="relative w-full">

      {/* Tombol Kembali di pojok kiri atas */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 text-gray-700 text-2xl hover:text-gray-900 z-10"
      >
        ←
      </button>

      {/* Container utama */}
      <div className="p-6 w-full max-w-5xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-4">
          Buat Dokumen Berita Acara (Vendor)
        </h2>

        {/* TAB */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            className={`px-4 py-1 rounded ${active === "bapb" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
            onClick={() => setActive("bapb")}
          >
            BAPB
          </button>

          <button
            className={`px-4 py-1 rounded ${active === "bapp" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
            onClick={() => setActive("bapp")}
          >
            BAPP
          </button>
        </div>

        {/* FORM */}
        {active === "bapb" ? (
          <FormBAPB onSubmitResult={(success) => setShowSuccess(success)} />
        ) : (
          <FormBAPP onSubmitResult={(success) => setShowSuccess(success)} />
        )}


      </div>

      {/* POPUP SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4">Berhasil!</h2>
            <p className="mb-6">Dokumen berhasil diajukan.</p>
            <button
              onClick={() => navigate("/vendor/home")}
              className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
              Oke
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
