import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { getMe } from "../../services/me/me";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    // fetch current user
    getMe()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/sign-in");
      })
      .finally(() => setLoading(false)); // 👈 Stop loading
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && sidebarOpen) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const handleMenuClick = () => setSidebarOpen(!sidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  // 👇 Show loader while verifying user
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={handleSidebarClose}
        isMobile={isMobile}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={handleMenuClick} currentUser={currentUser} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ currentUser }} />
          </div>
        </main>
      </div>
    </div>
  );
}
