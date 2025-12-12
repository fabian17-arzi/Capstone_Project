import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayoutVendor() {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-60 bg-white shadow-md p-5">
        <h2 className="text-blue-700 font-bold text-lg mb-8">Vendor</h2>

        <nav className="space-y-4">
          <Link
            to="/vendor/home"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Home
          </Link>

          <Link
            to="/vendor/progres"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Progres
          </Link>

          <Link
            to="/vendor/arsip"
            className="block p-2 rounded hover:bg-gray-200"
          >
            Arsip
          </Link>

          {/* 🔵 BUTTON LOGOUT → MEMBUKA POPUP */}
          <button
            onClick={() => setConfirmLogout(true)}
            className="block w-full text-left p-2 rounded bg-white text-red-600 
                       hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

      {/* 🔵 POPUP KONFIRMASI LOGOUT */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Ya, Logout
              </button>

              <button
                onClick={() => setConfirmLogout(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
