export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onCancel}   // klik overlay = cancel
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-80"
        onClick={(e) => e.stopPropagation()} // cegah overlay tertembak saat klik tombol
      >
        <h3 className="font-semibold text-lg mb-3">Konfirmasi</h3>

        <p className="mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={onCancel}
          >
            Batal
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={onConfirm}   // sekarang fetch DELETE pasti berjalan
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
