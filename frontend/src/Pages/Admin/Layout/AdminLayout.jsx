// AdminLayout.js
import React from "react";
import AdminSidebar from '../Sidebar/AdminSidebar';  
import AdminHeader from "../../../Components/Header/AdminHeader";
import Footer from "../../../Components/Footer/Footer";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
        <AdminHeader/>
        <div className="flex flex-1">
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex flex-col w-full">
        <main className="flex-1 p-20">
          {children}
        </main>
      </div>
    </div>
    <Footer/>
    </div>

  );
};

export default AdminLayout;
