import DashboardLayout from "./DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>

      {/* Banner */}
      <div className="bg-blue-600 h-44 rounded-xl text-white flex items-center justify-between px-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hallo Vendor</h1>
          <p>Selamat datang di website untuk membuat berita acara</p>
        </div>
      </div>

      {/* Daftar Dokumen */}
      <h2 className="text-lg font-bold mb-4">Daftar Dokumen Diproses</h2>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between">
          <div>
            <p className="font-semibold">Dokumen pengiriman barang</p>
          </div>
          <p className="text-sm text-gray-600">Dokumen Disetujui Pemesan</p>
        </div>
      </div>

    </DashboardLayout>
  );
}
