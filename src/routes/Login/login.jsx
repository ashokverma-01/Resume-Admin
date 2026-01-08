// src/routes/Login/login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/contexts/auth-context";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("https://resume-backend-s69p.onrender.com/api/user/login", { email, password });

            const { user, token } = res.data;

            if (!token || !user) {
                throw new Error("Invalid response from server");
            }

            // 🔐 save to context + localStorage
            login(res.data);

            // 🔁 role based redirect
            if (user.role === "admin") {
                navigate("/", { replace: true });
            } else {
                navigate("/unauthorized", { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?technology,login')" }}
            />

            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
                <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

                {error && <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-600">{error}</p>}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded border px-4 py-3"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border px-4 py-3"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
