import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when resizing to desktop
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen || !isMobile} 
        onClose={handleSidebarClose}
        isMobile={isMobile}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
