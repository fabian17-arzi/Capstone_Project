import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost/capstone_backend/users/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.success) {
      setToast(result.message || "Login gagal! Periksa email & password.");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    localStorage.setItem("user", JSON.stringify(result.user));
    const role = result.user.role;

    if (role === "PIC Gudang") navigate("/gudang/home");
    else if (role === "Vendor") navigate("/vendor/home");
    else if (role === "Admin") navigate("/admin/dashboard");
    else if (role === "Direksi Pekerjaan") navigate("/direksi/home");
    else setToast("Role tidak dikenali!");
  };

  return (
    <div className="w-full h-screen bg-[#ECEEF1] flex items-center justify-center px-4">

      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-toast shadow-lg">
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg min-w-[220px] text-sm font-medium shadow-md">
            {toast}
          </div>
        </div>
      )}

      <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-xl flex overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 bg-[#0E4BD1] flex flex-col items-center justify-center px-10">

          <div className="text-white mb-10">
            <FaUser size={70} />
          </div>

          <form onSubmit={handleLogin} className="w-full">

            {/* EMAIL */}
            <div className="w-full mb-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md text-sm 
                  bg-white text-gray-700 outline-none"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="w-full mb-5">
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md text-sm 
                  bg-white text-gray-700 outline-none"
                  required
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full py-3 bg-[#0A3280] text-white font-semibold rounded-md 
            hover:bg-[#092B6D] transition">
              LOGIN
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center">
          <img
            src="http://localhost/capstone_backend/Logo/Logo-Sibaca.png"
            alt="Logo"
            className="w-70 mb-3"
          />
        </div>

      </div>
    </div>
  );
}
