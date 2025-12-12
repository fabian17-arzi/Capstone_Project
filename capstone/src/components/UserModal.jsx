export default function UserModal({ type, userData, close, submit }) {
  const isEdit = type === "edit";

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value,
      id: userData?.id || null
    };

    submit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-[450px] shadow-xl">
        
        <h2 className="text-xl font-bold text-center mb-5">
          {isEdit ? "EDIT USER" : "Daftar User Baru"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <input
            name="name"
            defaultValue={userData?.name || ""}
            className="border w-full p-2 mb-3 rounded"
            placeholder="Username"
            required
          />

          {/* EMAIL */}
          <input
            name="email"
            defaultValue={userData?.email || ""}
            className="border w-full p-2 mb-3 rounded"
            placeholder="Email"
            type="email"
            required
          />

          {/* PASSWORD */}
          <input
            name="password"
            defaultValue={userData?.password || ""}
            className="border w-full p-2 mb-3 rounded"
            placeholder="Password"
            required={!isEdit}
          />

          {/* ROLE */}
          <select
            name="role"
            defaultValue={userData?.role || ""}
            className="border w-full p-2 mb-3 rounded"
            required
          >
            <option value="">Pilih Role</option>
            <option value="Vendor">Vendor</option>
            <option value="PIC Gudang">PIC Gudang</option>
            {/* ROLE BARU DITAMBAHKAN DI SINI */}
            <option value="Direksi Pekerjaan">Direksi Pekerjaan</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {isEdit ? "Simpan" : "Daftar"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}