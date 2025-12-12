import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBAPP, setTotalBAPP] = useState(0);
  const [totalBAPB, setTotalBAPB] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const usersRes = await fetch("http://localhost/capstone_backend/get_total_users.php");
      const usersData = await usersRes.json();
      if (usersData.success) {
        setTotalUsers(usersData.total_users);
      }

      const bappRes = await fetch("http://localhost/capstone_backend/get_total_bapp.php");
      const bappData = await bappRes.json();
      if (bappData.success) {
        setTotalBAPP(bappData.total_bapp);
      }

      const bapbRes = await fetch("http://localhost/capstone_backend/get_total_bapb.php");
      const bapbData = await bapbRes.json();
      if (bapbData.success) {
        setTotalBAPB(bapbData.total_bapb);
      }

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center text-lg">
        Memuat data dashboard...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">

      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold">Hallo Admin</h2>
        <p>Selamat datang di website untuk membuat berita acara</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-2">Total User</h3>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-2">Total BAPP</h3>
          <p className="text-3xl font-bold">{totalBAPP}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-2">Total BAPB</h3>
          <p className="text-3xl font-bold">{totalBAPB}</p>
        </div>
      </div>

    </div>
  );
}