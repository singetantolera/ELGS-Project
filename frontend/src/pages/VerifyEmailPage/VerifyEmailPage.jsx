import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmailPage = () => {
const { token } = useParams();
const navigate = useNavigate();

const [status, setStatus] = useState("Verifying your email...");

useEffect(() => {
const verifyEmail = async () => {
try {
await axios.post(
`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/verify-email/${token}`
);


    setStatus("✅ Email verified successfully! Redirecting to login...");
    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  } catch {
    setStatus("❌ Verification failed or token expired.");
  }
};

if (token) {
  verifyEmail();
}


}, [token, navigate]);

return (
<div style={{ textAlign: "center", marginTop: "100px" }}> <h2>Email Verification</h2> <p>{status}</p> </div>
);
};

export default VerifyEmailPage;
