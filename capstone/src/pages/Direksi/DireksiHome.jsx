import { useEffect, useState } from "react";

export default function DireksiHome() {
  const [totalSelesai, setTotalSelesai] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost/capstone_backend/get_direksi_bapp.php");
      const data = await res.json();

      if (data.success) {
        setTotalSelesai(data.total_selesai);
        setTotalPending(data.total_pending);
      }
    } catch (error) {
      console.error("Gagal mengambil data BAPP:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 w-full">

      {/* Banner */}
      <div className="bg-purple-600 h-44 rounded-xl text-white flex items-center px-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hallo Direksi Pekerjaan</h1>
          <p>Selamat datang di dashboard persetujuan BAPP</p>
        </div>
      </div>

      {/* BOX JUMLAH BAPP */}
      <div className="grid grid-cols-2 gap-6">

        {/* BAPP Pending */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="font-bold mb-2 text-yellow-600">BAPP Pending</h3>
          <p className="text-3xl font-bold">{totalPending}</p>
        </div>

        {/* BAPP Approved */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h3 className="font-bold mb-2 text-green-600">BAPP Selesai</h3>
          <p className="text-3xl font-bold">{totalSelesai}</p>
        </div>

      </div>

    </div>
  );
}
