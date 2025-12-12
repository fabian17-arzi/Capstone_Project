import { useState } from "react";
import FormBAPB from "../../components/FormBAPB";
import FormBAPP from "../../components/FormBAPP";
import DashboardLayoutGudang from "../../components/DashboardLayoutGudang";

export default function BuatDokumenGudang() {
  const [active, setActive] = useState("bapb");

  return (
    <DashboardLayoutGudang>
      <div className="p-6 w-full">

        <h2 className="text-center text-xl font-bold mb-4">
          Buat Dokumen Berita Acara (Gudang)
        </h2>

        {/* TAB */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            className={`px-4 py-1 rounded ${
              active === "bapb" ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActive("bapb")}
          >
            BAPB
          </button>

          <button
            className={`px-4 py-1 rounded ${
              active === "bapp" ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActive("bapp")}
          >
            BAPP
          </button>
        </div>

        {/* FORM */}
        {active === "bapb" ? <FormBAPB /> : <FormBAPP />}
      </div>
    </DashboardLayoutGudang>
  );
}
