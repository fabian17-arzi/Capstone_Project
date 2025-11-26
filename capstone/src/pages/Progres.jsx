import DashboardLayout from "./DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function Progres() {
    const navigate = useNavigate();

  return (
    <DashboardLayout>

      {/* Header Banner */}
      <div className="bg-blue-700 h-32 rounded-xl text-white p-6 flex items-center text-xl font-bold">
        Hallo Vendor
      </div>

      {/* Search + Buat Dokumen Baru */}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          placeholder="Cari dokumen..."
          className="flex-1 border p-2 rounded"
        />
    <button
      className="bg-blue-700 text-white px-4 py-2 rounded"
      onClick={() => navigate("/dashboard/buat-dokumen")}
    >
      Buat Dokumen Baru
    </button>
      </div>

      {/* List Dokumen */}
      <div className="mt-6 space-y-4">

        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-md shadow flex justify-between">
            <div>
              <p className="font-semibold">Nama dokumen contoh {i}</p>
              <p className="text-sm">📎 🔒</p>
            </div>
            <p className="text-sm text-gray-600">Status Dokumen</p>
          </div>
        ))}

      </div>

    </DashboardLayout>
  );
}
