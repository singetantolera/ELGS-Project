import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // ✅ Redirect to dashboard cleanly
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}

export default App;