import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Progres from "./pages/Progres";
import Arsip from "./pages/Arsip";
import BuatDokumen from "./pages/BuatDokumen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/dashboard/progres" element={<Progres />} />
        <Route path="/dashboard/arsip" element={<Arsip />} />

        <Route path="/dashboard/buat-dokumen" element={<BuatDokumen />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
