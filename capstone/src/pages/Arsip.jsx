import { FiDownload, FiCopy } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

const dataArsip = [
  {
    id: 1,
    title: "Dokumen pengiriman barang",
    date: "12 Agustus 2025",
    vendor: "PT Prima Jasa"
  },
  {
    id: 2,
    title: "Dokumen pengiriman barang",
    date: "12 Agustus 2025",
    vendor: "PT Jasa Raharja"
  },
  {
    id: 3,
    title: "Dokumen pengiriman barang",
    date: "12 Agustus 2025",
    vendor: "PT Maju Bersama"
  },
];

export default function Arsip() {
  return (
    <DashboardLayout>
        <div className="p-6 w-full">
        
        {/* Header Banner */}
        <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl text-white p-6 shadow">
            <h2 className="text-2xl font-bold">Hallo Vendor</h2>
            <p className="text-sm opacity-80">Selamat datang kembali</p>
        </div>

        {/* List Arsip */}
        <div className="mt-6 space-y-4">
            {dataArsip.map((item) => (
            <div
                key={item.id}
                className="bg-white shadow border rounded-xl p-4 flex justify-between items-center"
            >
                <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">
                    {item.date} &nbsp; • &nbsp; {item.vendor}
                </p>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                <button className="hover:text-blue-700">
                    <FiDownload size={20} />
                </button>
                <button className="hover:text-blue-700">
                    <FiCopy size={20} />
                </button>
                </div>
            </div>
            ))}
        </div>

        </div>
    </DashboardLayout>
  );
}
