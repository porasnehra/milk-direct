import { Home, ShoppingCart, Package, User } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: ShoppingCart, label: "Cart", id: "cart" },
  { icon: Package, label: "Orders", id: "orders" },
  { icon: User, label: "Profile", id: "profile" },
];

const BottomNav = () => {
  const [active, setActive] = useState("home");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40 animate-slide-up">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center p-2 min-w-[60px] transition-all ${
              active === item.id 
                ? "text-primary scale-105" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`transition-transform ${active === item.id ? "-translate-y-0.5" : ""}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
            {active === item.id && (
              <div className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full transition-all" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
