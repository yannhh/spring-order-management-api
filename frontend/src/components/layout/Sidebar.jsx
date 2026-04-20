import React, { useState, useEffect } from "react";
// Merged the imports into one single line
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  LayoutDashboard,
  ClipboardList,
  Tags,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentUser } from "@/api/api"; // Corrected API import

const customerLinks = [
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/my-orders", label: "My Orders", icon: Package },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/products", label: "Products & Pricing", icon: Tags },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  // Declared state only once
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    currentUser()
      .then(setUser)
      .catch(() => {});
  }, []);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
    window.location.reload();
  };

  const NavLink = ({ to, label, icon: Icon }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" // Blue active state
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent", // Light text on dark blue
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{label}</span>
        {active && <ChevronRight className="w-3 h-3 ml-auto" />}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-sidebar-foreground">
              DropShip
            </h1>
            <p className="text-[11px] text-sidebar-foreground/50 font-medium uppercase tracking-wide">
              Order Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Shop
          </p>
          <div className="space-y-1">
            {customerLinks.map((link) => (
              <NavLink key={link.to} {...link} />
            ))}
          </div>
        </div>

        {isAdmin && (
          <div>
            <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Admin
            </p>
            <div className="space-y-1">
              {adminLinks.map((link) => (
                <NavLink key={link.to} {...link} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile & Sign Out Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-foreground">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              {user?.email || "No email provided"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
