import { useEffect, useState } from "react";

// --- KOMPONEN MODAL DETAIL DOKUMEN ---
const DetailModal = ({ dokumen, onClose }) => {
    if (!dokumen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl w-[700px] shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-green-700">
                    Detail BAPB: {dokumen.header.judul}
                </h2>
                <hr className="mb-4" />

                {/* HEADER INFO */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p className="font-semibold">Nomor Dokumen:</p>
                        <p>{dokumen.header.nomor}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tanggal Pemeriksaan:</p>
                        <p>{dokumen.header.tanggal_pemeriksaan}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Vendor:</p>
                        <p>{dokumen.header.pihak_vendor}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tempat Pemeriksaan:</p>
                        <p>{dokumen.header.tempat_pemeriksaan}</p>
                    </div>
                </div>

                {/* TABLE ITEMS */}
                <h3 className="text-lg font-bold mb-3">
                    Daftar Barang ({dokumen.items.length} Item)
                </h3>

                <table className="w-full border text-sm mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">No</th>
                            <th className="border p-2">Barang</th>
                            <th className="border p-2">Spesifikasi</th>
                            <th className="border p-2">Qty</th>
                            <th className="border p-2">Satuan</th>
                            <th className="border p-2">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dokumen.items.map((item, index) => (
                            <tr key={index}>
                                <td className="border p-2 text-center">{index + 1}</td>
                                <td className="border p-2">{item.nama_barang}</td>
                                <td className="border p-2">{item.spesifikasi}</td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-center">{item.satuan}</td>
                                <td className="border p-2">{item.keterangan}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- END KOMPONEN MODAL ---


export default function ProgresGudang() {
    const [dokumenList, setDokumenList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    // --- POPUP STATE ---
    const [showApprovePopup, setShowApprovePopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchDokumen = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost/capstone_backend/list_progres_bapb.php");
            const result = await res.json();

            if (result.success) {
                setDokumenList(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDokumen();
    }, []);

    const viewDetail = async (bapbId) => {
        try {
            const res = await fetch(`http://localhost/capstone_backend/get_bapb.php?id=${bapbId}`);
            const result = await res.json();

            if (result.success) {
                setModalData(result);
                setShowDetailModal(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const approveBAPB = async (bapbId) => {
        try {
            const res = await fetch("http://localhost/capstone_backend/approved_bapb_gudang.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bapb_id: bapbId }),
            });

            const result = await res.json();

            if (result.success) {
                fetchDokumen();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = async (id, status, catatan = null) => {
        try {
            const res = await fetch("http://localhost/capstone_backend/update_bapb_status.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status, catatan }),
            });

            const result = await res.json();

            if (result.success) {
                fetchDokumen();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="p-6 w-full text-center">Memuat data...</div>
        );
    }

    return (
        <div className="p-6 w-full">

            {/* ========== POPUP APPROVE ========== */}
            {showApprovePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-96 p-6 rounded-lg shadow-xl text-center">
                        <h2 className="text-xl font-bold mb-4">Setujui Dokumen?</h2>
                        <p className="mb-6 text-gray-700">
                            Dokumen akan disetujui dan hilang dari daftar progres.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowApprovePopup(false)}
                                className="px-5 py-2 bg-gray-400 text-white rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={() => {
                                    setShowApprovePopup(false);
                                    approveBAPB(selectedId);
                                }}
                                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== POPUP REJECT ========== */}
            {showRejectPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-[420px] p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-center text-red-700">
                            Tolak Dokumen
                        </h2>

                        <p className="mb-3 text-gray-700">Berikan alasan penolakan:</p>

                        <textarea
                            className="w-full border rounded p-2 h-24"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Contoh: Barang tidak sesuai pesanan..."
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setRejectReason("");
                                    setShowRejectPopup(false);
                                }}
                                className="px-5 py-2 bg-gray-400 text-white rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={() => {
                                    if (rejectReason.trim() === "") return;
                                    setShowRejectPopup(false);
                                    handleAction(selectedId, "Rejected", rejectReason);
                                    setRejectReason("");
                                }}
                                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {showDetailModal && (
                <DetailModal dokumen={modalData} onClose={() => setShowDetailModal(false)} />
            )}

            {/* HEADER */}
            <div className="bg-green-600 h-32 rounded-xl text-white p-6 flex items-center text-xl font-bold">
                Hallo PIC Gudang
            </div>

            {/* LIST DOKUMEN */}
            <h2 className="text-lg font-bold mt-6 mb-4">
                Permintaan Pemeriksaan BAPB (Pending)
            </h2>

            <div className="space-y-4">
                {dokumenList.length === 0 ? (
                    <div className="bg-white p-4 rounded-md shadow text-gray-500">
                        Tidak ada dokumen BAPB yang menunggu pemeriksaan.
                    </div>
                ) : (
                    dokumenList.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-md shadow flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">
                                    {item.judul} - No. {item.nomor}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Dokumen dari Vendor: <b>{item.pihak_vendor}</b> (Total Barang:{" "}
                                    {item.total_items})
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Diajukan pada:{" "}
                                    {new Date(item.dibuat_pada).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => viewDetail(item.id)}
                                    className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
                                >
                                    Lihat Detail
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedId(item.id);
                                        setShowApprovePopup(true);
                                    }}
                                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                                >
                                    Setujui
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedId(item.id);
                                        setShowRejectPopup(true);
                                    }}
                                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                                >
                                    Tolak
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
