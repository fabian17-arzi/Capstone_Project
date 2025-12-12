import { useState, useEffect } from "react";

export default function GudangHome() {
  const [totalSelesai, setTotalSelesai] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost/capstone_backend/get_gudang_bapb.php");
      const data = await res.json();

      if (data.success) {
        setTotalSelesai(data.total_selesai);
        setTotalPending(data.total_pending);
      }
    } catch (error) {
      console.error("Gagal memuat data BAPB:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 w-full">

      {/* Banner */}
      <div className="bg-green-600 h-44 rounded-xl text-white flex items-center px-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hallo PIC Gudang</h1>
          <p>Selamat datang di dashboard pengelolaan gudang</p>
        </div>
      </div>

      {/* Statistik BAPB */}
      <div className="grid grid-cols-2 gap-6">

        {/* Selesai */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-8 border-green-600">
          <h3 className="font-bold mb-2 text-green-700">BAPB Selesai</h3>
          <p className="text-3xl font-bold">{totalSelesai}</p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-8 border-yellow-500">
          <h3 className="font-bold mb-2 text-yellow-600">BAPB Pending</h3>
          <p className="text-3xl font-bold">{totalPending}</p>
        </div>

      </div>

    </div>
  );
}
