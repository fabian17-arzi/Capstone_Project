import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const menu = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Progres", path: "/admin/dashboard/progres" },
    { name: "User", path: "/admin/dashboard/user" },
    { name: "Arsip", path: "/admin/dashboard/arsip" },
    { name: "Logout", path: "logout" }, // ← tombol logout
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    navigate("/admin");
  };

  return (
    <div className="w-full h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-xl font-bold mb-8 text-gray-800">Berita Acara</h1>

        <ul className="space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            // Jika tombol logout
            if (item.name === "Logout") {
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setShowPopup(true)}
                    className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      text-red-600 hover:bg-red-50`}
                  >
                    {item.name}
                  </button>
                </li>
              );
            }

            // Tombol menu biasa
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${active ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* KONTEN PAGE */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>

      {/* POPUP KONFIRMASI LOGOUT */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl animate-fadeIn">

            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
              Konfirmasi Logout
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Apakah Anda yakin ingin keluar?
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="w-1/2 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="w-1/2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
