import { useState } from "react";
import { Menu, ShieldCheck, CreditCard, Home, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shadow-lg hover:bg-secondary/90 transition"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-secondary text-secondary-foreground shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-secondary-foreground/10">
          <h2 className="font-display text-2xl tracking-wide">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary-foreground/10 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-foreground/10 transition font-body text-sm"
          >
            <Home className="w-5 h-5 text-primary" />
            Home
          </button>

          <button
            onClick={() => handleNavigate("/admin")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-foreground/10 transition font-body text-sm"
          >
            <ShieldCheck className="w-5 h-5 text-primary" />
            Admin Panel
          </button>

          <button
            onClick={() => handleNavigate("/fee-status")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-foreground/10 transition font-body text-sm"
          >
            <CreditCard className="w-5 h-5 text-primary" />
            Check Fee Status
          </button>
        </nav>
      </div>
    </>
  );
};

export default AppSidebar;
