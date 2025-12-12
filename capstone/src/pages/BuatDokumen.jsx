import { useState } from "react";
import FormBAPB from "../components/FormBAPB";
import FormBAPP from "../components/FormBAPP";

export default function BuatDokumen() {
  const [active, setActive] = useState("bapb");

  return (
    <div className="p-6">
      <h2 className="text-center text-xl font-bold mb-4">
        Buat Dokumen Berita Acara
      </h2>

      <div className="flex justify-center gap-3 mb-6">
        <button
          className={`px-4 py-1 rounded ${
            active === "bapb" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActive("bapb")}
        >
          BAPB
        </button>

        <button
          className={`px-4 py-1 rounded ${
            active === "bapp" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActive("bapp")}
        >
          BAPP
        </button>
      </div>

      {active === "bapb" ? (
        <FormBAPB />
      ) : (
        <FormBAPP />   // <-- Tampilkan Form BAPP di sini
      )}

    </div>
  );
}
