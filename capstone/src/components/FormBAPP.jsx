import { useState } from "react";

export default function FormBAPP({ onSubmitResult }) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null); 

  const [form, setForm] = useState({
    nomor: "",
    tanggal: "",
    nama_pekerjaan: "",
    nomor_kontrak: "",
    nama_vendor: "",
    penanggung_jawab_vendor: "",
    pejabat_penerima: "",
    persentase_penyelesaian: 0,
    deskripsi_pekerjaan: "",
    catatan: "", 
  });

  // ==============================
  // FORMAT RUPIAH
  // ==============================
  const formatRupiah = (value) => {
    if (!value) return "";
    
    let numberString = value.toString().replace(/[^,\d]/g, "");
    let split = numberString.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      rupiah += (sisa ? "." : "") + ribuan.join(".");
    }

    return "Rp " + rupiah;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ==============================
    // KHUSUS FORMAT RUPIAH
    // ==============================
    if (name === "nomor_kontrak") {
      const onlyNumber = value.replace(/\D/g, "");
      setForm({ ...form, nomor_kontrak: onlyNumber });
      return;
    }

    if (name === "persentase_penyelesaian") {
      let val = parseFloat(value);
      if (val < 0) val = 0;
      if (val > 100) val = 100;
      setForm({ ...form, [name]: val });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (bappId, file) => {
    const formData = new FormData();
    formData.append("bapp_id", bappId);
    formData.append("file", file);

    const res = await fetch("http://localhost/capstone_backend/upload_bapp_file.php", {
      method: "POST",
      body: formData,
    });
    return res.json();
  };

  const handleUpload = async () => {
    if (!form.nomor || !form.nama_pekerjaan || !selectedFile) {
      onSubmitResult(false);
      return false;
    }
    
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || user.role !== "Vendor") {
      onSubmitResult(false);
      setLoading(false);
      return false;
    }

    const payload = {
      ...form,
      vendor_id: user.id,
    };

    try {
      const headerRes = await fetch("http://localhost/capstone_backend/create_bapp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const headerData = await headerRes.json();
      
      if (!headerData.success) {
        onSubmitResult(false);
        setLoading(false);
        return false;
      }

      const bappId = headerData.bapp_id;
      const uploadRes = await uploadFile(bappId, selectedFile);

      if (uploadRes.success) {
        setForm({
          nomor: "", tanggal: "", nama_pekerjaan: "", nomor_kontrak: "", 
          nama_vendor: "", penanggung_jawab_vendor: "", pejabat_penerima: "",
          persentase_penyelesaian: 0, deskripsi_pekerjaan: "", catatan: "",
        });
        setSelectedFile(null);
        setFileList([]);

        onSubmitResult(true);
        return true;

      } else {
        onSubmitResult(false);
        return false;
      }

    } catch (error) {
      onSubmitResult(false);
      return false;
    }

    setLoading(false);
  };


  return (
    <div className="max-w-5xl mx-auto p-6 border rounded-md shadow-sm">

      <h2 className="text-xl font-bold mb-4">Form Berita Acara Penyelesaian Pekerjaan (BAPP)</h2>
      <hr className="mb-6" />

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* KOLOM KIRI */}
        <div>
            <label className="block mb-1 font-semibold">Nomor BAPP</label>
            <input name="nomor" value={form.nomor} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2 mb-4" required />
        
            <label className="block mb-1 font-semibold">Tanggal</label>
            <input name="tanggal" value={form.tanggal} onChange={handleChange} type="date" className="w-full border rounded px-3 py-2 mb-4" required />

            <label className="block mb-1 font-semibold">Nama Pekerjaan</label>
            <input name="nama_pekerjaan" value={form.nama_pekerjaan} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2 mb-4" required />
            
            {/* =============== FORMAT RUPIAH =============== */}
            <label className="block mb-1 font-semibold">Nilai Kontrak</label>
            <input
              name="nomor_kontrak"
              value={formatRupiah(form.nomor_kontrak)}
              onChange={handleChange}
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              required
            />

            <label className="block mb-1 font-semibold">Persentase Penyelesaian (%)</label>
            <input name="persentase_penyelesaian" value={form.persentase_penyelesaian} onChange={handleChange} type="number" step="0.01" min="0" max="100" className="w-full border rounded px-3 py-2 mb-4" required />

            <label className="block mb-1 font-semibold">Deskripsi Pekerjaan</label>
            <textarea name="deskripsi_pekerjaan" value={form.deskripsi_pekerjaan} onChange={handleChange} className="w-full border rounded px-3 py-2 h-24 mb-4" required />
        </div>


        {/* KOLOM KANAN */}
        <div>
            <label className="block mb-1 font-semibold">Nama Vendor</label>
            <input name="nama_vendor" value={form.nama_vendor} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2 mb-4" required />

            <label className="block mb-1 font-semibold">Nama Penanggung Jawab Vendor</label>
            <input name="penanggung_jawab_vendor" value={form.penanggung_jawab_vendor} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2 mb-4" required />

            <label className="block mb-1 font-semibold">Nama Pejabat Penerima Pekerjaan</label>
            <input name="pejabat_penerima" value={form.pejabat_penerima} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2 mb-4" required />

            <label className="block mb-1 font-semibold">Catatan (Vendor)</label>
            <textarea name="catatan" value={form.catatan} onChange={handleChange} className="w-full border rounded px-3 py-2 h-24 mb-4" />

            <h3 className="font-semibold mb-3 mt-4">Upload File Lampiran (PDF/Foto)</h3>
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="border p-2 rounded mb-3" 
                accept=".pdf,.jpg,.jpeg,.png"
            />
            
            {selectedFile && (
                <p className="text-gray-600 text-sm mt-2">File dipilih: <strong>{selectedFile.name}</strong></p>
            )}
        </div>
      </div>

      <hr className="my-8" />

      <div className="flex justify-end mt-8">
        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className="bg-blue-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Mengajukan..." : "Ajukan BAPP ke Direksi"}
        </button>
      </div>

    </div>
  );
}
