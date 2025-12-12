export default function NotificationModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
        <p className="text-lg">{message}</p>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
