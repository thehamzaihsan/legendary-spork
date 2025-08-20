import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const location = useLocation();
  
  // Hide header and footer only on these pages
  const hideHeader = location.pathname === "/chat" || location.pathname === "/community";
  const hideFooter = location.pathname === "/chat" || location.pathname === "/community";

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden m-0 p-0">
      {/* Conditionally render header */}
      {!hideHeader && <Header />}

      <main className="flex-grow overflow-x-hidden">
        <Outlet />
      </main>

      {/* Conditionally hide footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
