import { Milk, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="gradient-hero text-primary-foreground px-4 py-6 pb-8">
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="bg-milk-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Milk className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DudhConnect</h1>
            <p className="text-sm opacity-90">AI • TensorFlow • Google Maps</p>
          </div>
        </div>
        <button className="bg-milk-white/20 p-2.5 rounded-xl backdrop-blur-sm hover:bg-milk-white/30 transition-all hover:scale-105 active:scale-95">
          <Bell className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <p className="text-lg font-medium opacity-95">
          Direct Milk Marketplace
        </p>
        <p className="text-sm opacity-80 mt-1">
          Connecting Farmers & Consumers • No Middlemen
        </p>
      </div>
    </header>
  );
};

export default Header;
