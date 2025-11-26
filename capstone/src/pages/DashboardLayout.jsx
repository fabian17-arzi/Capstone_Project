import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-60 bg-white shadow-md p-5">
        <h2 className="text-blue-700 font-bold text-lg mb-8">Berita Acara</h2>

        <nav className="space-y-4">
          <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
            <span>🏠</span> Home
          </Link>

          <Link to="/dashboard/progres" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
            <span>📄</span> Progres
          </Link>

          <Link to="/dashboard/arsip" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
            <span>📁</span> Arsip
          </Link>
        </nav>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 p-6">
        {children}
      </div>

    </div>
  );
}
