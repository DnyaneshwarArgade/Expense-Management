import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    dob: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // पुढे backend API call इथे करायचा
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">नवीन नोंदणी</h1>
        <p className="register-subtitle">कृपया आपली माहिती भरा</p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Username */}
          <div className="form-group">
            <label>वापरकर्त्याचे नाव *</label>
            <input
              type="text"
              name="username"
              placeholder="वापरकर्त्याचे नाव "
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label>मोबाईल नंबर *</label>
            <input
              type="tel"
              name="mobile"
              placeholder="१० अंकी मोबाईल नंबर"
              pattern="[0-9]{10}"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>ई-मेल *</label>
            <input
              type="email"
              name="email"
              placeholder="आपला ई-मेल"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* DOB Optional */}
          {/* <div className="form-group">
            <label>जन्मतारीख (पर्यायी)</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div> */}

          <div className="form-group">
            <label>जन्मतारीख (पर्यायी)</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            <span className="hint">उदा: २५-०६-२०००</span>
          </div>

          {/* Password */}
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

          <button type="submit" className="register-btn">
            नोंदणी करा
          </button>
        </form>

        <p className="login-text">
          आधीच खाते आहे? <Link to="/login">लॉगिन करा</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
