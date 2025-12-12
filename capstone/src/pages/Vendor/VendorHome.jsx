import { useState, useEffect } from "react";

export default function VendorHome() {
  const [userName, setUserName] = useState("Vendor");
  const [vendorId, setVendorId] = useState(null);

  const [bapp, setBapp] = useState({
    approved: 0,
    pending: 0,
    reject: 0,
  });

  const [bapb, setBapb] = useState({
    approved: 0,
    pending: 0,
    reject: 0,
  });

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name) {
        setUserName(user.name);
        setVendorId(user.id); // ⬅ penting untuk filter vendor
      }
    } catch (e) {
      console.error("Gagal parse user dari localStorage", e);
    }
  }, []);

  // Ambil data BAPP & BAPB vendor
  const fetchVendorData = async () => {
    if (!vendorId) return; // Pastikan vendorId sudah ada

    try {
      const res = await fetch(
        `http://localhost/capstone_backend/get_vendor_documents.php?vendor_id=${vendorId}`
      );
      const data = await res.json();

      if (data.success) {
        setBapp(data.bapp);
        setBapb(data.bapb);
      }
    } catch (err) {
      console.error("Gagal mengambil data vendor:", err);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [vendorId]);

  return (
    <div className="p-6">
      {/* Banner */}
      <div className="bg-blue-600 h-44 rounded-xl text-white flex items-center px-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hallo {userName}</h1>
          <p>Selamat datang di website berita acara</p>
        </div>
      </div>

      {/* GRID BAPP + BAPB */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        {/* BAPP Pending */}
        <div className="p-6 rounded-lg shadow bg-white border-l-4 border-yellow-500">
          <h3 className="font-bold text-yellow-600 mb-2">BAPP Pending</h3>
          <p className="text-3xl font-bold">{bapp.pending}</p>
        </div>

        {/* BAPP Approved */}
        <div className="p-6 rounded-lg shadow bg-white border-l-4 border-green-600">
          <h3 className="font-bold text-green-600 mb-2">BAPP Approved</h3>
          <p className="text-3xl font-bold">{bapp.approved}</p>
        </div>

        {/* BAPP Reject */}
        <div className="p-6 rounded-lg shadow bg-white border-l-4 border-red-600">
          <h3 className="font-bold text-red-600 mb-2">BAPP Reject</h3>
          <p className="text-3xl font-bold">{bapp.reject}</p>
        </div>

        {/* BAPB Pending */}
        <div className="p-6 rounded-lg shadow bg-white border-l-4 border-yellow-500">
          <h3 className="font-bold text-yellow-600 mb-2">BAPB Pending</h3>
          <p className="text-3xl font-bold">{bapb.pending}</p>
        </div>

        {/* BAPB Approved */}
        <div className="p-6 rounded-lg shadow bg-white border-l-4 border-green-600">
          <h3 className="font-bold text-green-600 mb-2">BAPB Approved</h3>
          <p className="text-3xl font-bold">{bapb.approved}</p>
        </div>

        {/* BAPB Reject */}
        <div className="p-6 rounded-lg shadow bg-white border-l-4 border-red-600">
          <h3 className="font-bold text-red-600 mb-2">BAPB Reject</h3>
          <p className="text-3xl font-bold">{bapb.reject}</p>
        </div>

      </div>

    </div>
  );
}
