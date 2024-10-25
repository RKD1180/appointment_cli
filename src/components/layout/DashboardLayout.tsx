import React from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";


const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();




  const logout = () => {
    // Implement logout logic here
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
    console.log("Logged out");
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <Sidebar
        breakPoint="md"
      >
        <div
          style={{
            padding: "20px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Dashboard Menu
        </div>
        <Menu>
          <MenuItem component={<Link to="/dashboard" />}>Users</MenuItem>
          <MenuItem component={<Link to="/dashboard/my-appointment" />}>
            My Bookings
          </MenuItem>
          {/* <MenuItem component={<Link to="/dashboard/profile" />}>
            Profile
          </MenuItem> */}
        
        </Menu>
      </Sidebar>

      <main style={{ flex: 1, padding: "20px", backgroundColor: "#ffffff" }}>
        <Button
          onClick={logout}
          className="absolute top-4 right-4 p-2 rounded-full focus:outline-none"
        >
          Logout
        </Button>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
