
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { Toaster } from "sonner";

const Layout = () => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8 relative">
        <Outlet />
      </main>
      <footer className="mt-20 py-8 bg-white/50 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            MIT-ADT University Lost & Found System &copy; {new Date().getFullYear()}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This is a prototype for demonstration purposes only. No real data is stored.
          </p>
        </div>
      </footer>
      <Toaster position="top-right" closeButton richColors />
    </div>
  );
};

export default Layout;
