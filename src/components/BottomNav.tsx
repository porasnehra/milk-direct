import { Home, ShoppingCart, Package, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: Package, label: "Orders", path: "/orders" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40 animate-slide-up">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isCart = item.path === "/cart";
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 min-w-[60px] transition-all relative ${
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`transition-transform relative ${isActive ? "-translate-y-0.5" : ""}`}>
                <item.icon className="h-6 w-6" />
                {isCart && totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
