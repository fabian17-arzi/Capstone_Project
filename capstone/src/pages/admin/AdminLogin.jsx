import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/capstone_backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        localStorage.setItem("admin_logged_in", "true");
        navigate("/admin/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Gagal menghubungi server!");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center 
      bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">

      {/* Card */}
      <div className="backdrop-blur-xl bg-white/10 p-10 w-[420px]
        rounded-3xl shadow-2xl border border-white/20">

        {/* Title */}
        <h1 className="text-center text-white font-bold text-3xl mb-2">
          Admin
        </h1>
        <p className="text-center text-blue-200 text-sm mb-8">
          Silakan login untuk melanjutkan
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="mb-4">
            <label className="text-white text-sm">Username</label>
            <div className="flex items-center bg-white/20 backdrop-blur-sm 
              border border-white/30 mt-1 px-3 py-2 rounded-xl">
              <User className="text-white mr-2" size={18} />
              <input
                type="text"
                className="bg-transparent outline-none text-white placeholder-blue-200 w-full"
                placeholder="Masukkan username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-white text-sm">Password</label>
            <div className="flex items-center bg-white/20 backdrop-blur-sm 
              border border-white/30 mt-1 px-3 py-2 rounded-xl relative">
              <Lock className="text-white mr-2" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className="bg-transparent outline-none text-white placeholder-blue-200 w-full"
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="absolute right-3 cursor-pointer text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-200 bg-red-900/20 p-2 rounded-lg text-xs text-center mb-4">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-all
            text-white font-semibold py-3 rounded-xl shadow-lg mt-2"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
