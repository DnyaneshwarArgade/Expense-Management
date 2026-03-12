import Navbar from "../Components/Navbar";
import Bottombar from "../Components/Bottombar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Navbar />

      <div className="main-content">
        {children}
      </div>

      <Bottombar />
    </div>
  );
}

export default Layout;