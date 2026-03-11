import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout/Layout";

// Main Pages
import Home from "./Pages/Home/Home";
import Agriculture from "./Pages/Agriculture/Agriculture";
import Education from "./Pages/Education/Education";
import Construction from "./Pages/Construction/Construction";
import Functions from "./Pages/Functions/Functions";
import PersonalExpense from "./Pages/PersonalExpense/Personalexpense";
import Vehicle from "./Pages/Vehicle/Vehicle";

// Auth Pages
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import Rolebase from "./Pages/Auth/Rolebase/Rolebase";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- Register Default Page ---------- */}
        <Route path="/" element={<Register />} />

        {/* ---------- Auth Pages (Without Layout) ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rolebase" element={<Rolebase />} />

        {/* ---------- Main Pages (With Layout) ---------- */}

        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/agriculture"
          element={
            <Layout>
              <Agriculture />
            </Layout>
          }
        />

        <Route
          path="/education"
          element={
            <Layout>
              <Education />
            </Layout>
          }
        />

        <Route
          path="/construction"
          element={
            <Layout>
              <Construction />
            </Layout>
          }
        />

        <Route
          path="/functions"
          element={
            <Layout>
              <Functions />
            </Layout>
          }
        />

        <Route
          path="/personal-expense"
          element={
            <Layout>
              <PersonalExpense />
            </Layout>
          }
        />

        <Route
          path="/vehicle"
          element={
            <Layout>
              <Vehicle />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
