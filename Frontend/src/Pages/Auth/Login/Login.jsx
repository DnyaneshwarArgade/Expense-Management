import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState("user"); // "user" or "admin"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", {
        ...formData,
        role,
      });

      // JWT token & role save करा localStorage मध्ये
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      // Role नुसार redirect
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "लॉगिन अयशस्वी. पुन्हा प्रयत्न करा."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-icon">💰</div>
        <h1 className="login-title">लॉगिन करा</h1>
        <p className="login-subtitle">आपल्या खात्यात प्रवेश करा</p>

        {/* Role Toggle - User / Admin */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${role === "user" ? "active" : ""}`}
            onClick={() => setRole("user")}
          >
            👤 वापरकर्ता
          </button>
          <button
            type="button"
            className={`role-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            🛡️ प्रशासक
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label>ई-मेल *</label>
            <input
              type="email"
              name="email"
              placeholder="आपला ई-मेल टाका"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>पासवर्ड *</label>
            <input
              type="password"
              name="password"
              placeholder="पासवर्ड टाका"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-wrap">
            <Link to="/forgot-password" className="forgot-link">
              पासवर्ड विसरलात?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "लॉगिन होत आहे..." : "लॉगिन करा"}
          </button>
        </form>

        <p className="register-text">
          नवीन खाते नाही? <Link to="/register">नोंदणी करा</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
