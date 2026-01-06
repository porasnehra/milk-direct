import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Milk, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import CartSheet from "./CartSheet";
import { toast } from "sonner";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

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
        <div className="flex items-center gap-2">
          <CartSheet />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:inline">
                {profile?.name || "User"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="bg-milk-white/20 hover:bg-milk-white/30"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="bg-milk-white/20 hover:bg-milk-white/30"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
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
