import { useEffect, useState } from "react";
import { User, LogOut, MapPin, Phone, Mail, ExternalLink, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AIAssistant from "@/components/AIAssistant";

interface Profile {
  name: string;
  phone: string | null;
  address: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile>({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setProfile({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const openGoogleMaps = () => {
    window.open("https://www.google.com/maps/place/Maharishi+Markandeshwar+(Deemed+to+be+University)/@30.2766099,76.9665631,17z", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <User className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>

      <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Profile Form */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </Label>
            <Input
              id="address"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="Enter your delivery address"
            />
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={openGoogleMaps}
          >
            <MapPin className="h-4 w-4 mr-3 text-primary" />
            View MM University on Map
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowAI(true)}
          >
            <MessageCircle className="h-4 w-4 mr-3 text-primary" />
            AI Milk Assistant
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>

        {/* Google Maps Embed */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Zone - MM University, Mullana
            </h3>
          </div>
          <div 
            className="aspect-video w-full cursor-pointer relative group"
            onClick={openGoogleMaps}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3436.8371676711!2d76.9665631!3d30.2766099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fb55f7ea38c7f%3A0x5481c0c16ac06c2c!2sMaharishi%20Markandeshwar%20(Deemed%20to%20be%20University)!5e0!3m2!1sen!2sin!4v1704500000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant Dialog */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      <BottomNav />
    </div>
  );
};

export default Profile;
