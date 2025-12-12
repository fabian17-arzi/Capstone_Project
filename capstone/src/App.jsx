import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ================= PUBLIC ================= */
import Login from "./pages/Login";

/* ================= VENDOR ================= */
import VendorHome from "./pages/Vendor/VendorHome";
import ProgresVendor from "./pages/Vendor/ProgresVendor";
import ArsipVendor from "./pages/Vendor/ArsipVendor";
import BuatDokumenVendor from "./pages/Vendor/BuatDokumenVendor";
import DashboardLayoutVendor from "./components/DashboardLayoutVendor";

/* ================= GUDANG ================= */
import GudangHome from "./pages/Gudang/GudangHome";
import ProgresGudang from "./pages/Gudang/ProgresGudang";
import ArsipGudang from "./pages/Gudang/ArsipGudang";
import BuatDokumenGudang from "./pages/Gudang/BuatDokumenGudang";
import DashboardLayoutGudang from "./components/DashboardLayoutGudang";

/* ================= DIREKSI ================= */
import DireksiHome from "./pages/Direksi/DireksiHome";
import ProgresDireksi from "./pages/Direksi/ProgresDireksi";
import ArsipDireksi from "./pages/Direksi/ArsipDireksi";
import DashboardLayoutDireksi from "./components/DashboardLayoutDireksi";

/* ================= ADMIN ================= */
import AdminLogin from "./pages/admin/AdminLogin";
import DashboardLayout from "./pages/admin/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProgresAdmin from "./pages/admin/Progres";
import UserAdmin from "./pages/admin/user";
import ArsipAdmin from "./pages/admin/arsip";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* ================= VENDOR ================= */}
        <Route path="/vendor" element={<DashboardLayoutVendor />}>
          <Route path="home" element={<VendorHome />} />
          <Route path="progres" element={<ProgresVendor />} />
          <Route path="arsip" element={<ArsipVendor />} />
        </Route>

        {/* tanpa sidebar */}
        <Route path="/vendor/buat-dokumen" element={<BuatDokumenVendor />} />

        {/* ================= GUDANG ================= */}
        <Route path="/gudang" element={<DashboardLayoutGudang />}>
          <Route path="home" element={<GudangHome />} />
          <Route path="progres" element={<ProgresGudang />} />
          <Route path="arsip" element={<ArsipGudang />} />
        </Route>

        {/* ================= DIREKSI ================= */}
        <Route path="/direksi" element={<DashboardLayoutDireksi />}>
          <Route path="home" element={<DireksiHome />} /> 
          <Route path="progres" element={<ProgresDireksi />} />
          <Route path="arsip" element={<ArsipDireksi />} />
        </Route>

        {/* tanpa sidebar */}
        <Route path="/gudang/buat-dokumen" element={<BuatDokumenGudang />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="progres" element={<ProgresAdmin />} />
          <Route path="user" element={<UserAdmin />} />
          <Route path="arsip" element={<ArsipAdmin />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
