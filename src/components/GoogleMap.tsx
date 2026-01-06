import { useState } from "react";
import { MapPin, Milk, Bike, Navigation, Loader2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// MM University Mullana coordinates
const MM_UNIVERSITY = { lat: 30.2766, lng: 76.9665 };

// Mock seller data around MM University
const mockSellers = [
  { id: 1, name: "Krishna Dairy", lat: 30.2800, lng: 76.9700, type: "seller" as const, milkType: "Buffalo Milk", price: 60 },
  { id: 2, name: "Green Valley Farm", lat: 30.2730, lng: 76.9630, type: "seller" as const, milkType: "Cow Milk", price: 55 },
  { id: 3, name: "Mother Dairy Outlet", lat: 30.2780, lng: 76.9640, type: "seller" as const, milkType: "Mixed Milk", price: 52 },
  { id: 4, name: "Ramesh Dairy Farm", lat: 30.2710, lng: 76.9700, type: "seller" as const, milkType: "A2 Milk", price: 70 },
  { id: 5, name: "Amit (Delivery)", lat: 30.2790, lng: 76.9680, type: "delivery" as const },
  { id: 6, name: "Vijay (Delivery)", lat: 30.2750, lng: 76.9620, type: "delivery" as const },
];

type Seller = typeof mockSellers[0];

interface MapProps {
  onSellerSelect?: (seller: Seller) => void;
}

const GoogleMap = ({ onSellerSelect }: MapProps) => {
  const [userLocation, setUserLocation] = useState(MM_UNIVERSITY);
  const [milkType, setMilkType] = useState("all");
  const [quantity, setQuantity] = useState("2");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { addToCart } = useCart();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location updated!");
        },
        () => toast.error("Location access denied")
      );
    }
  };

  const getFilteredSellers = () => {
    return mockSellers.filter(s => {
      if (milkType === "all") return true;
      if (s.type === "delivery") return true;
      return s.milkType === milkType;
    });
  };

  const handleFindSellers = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      toast.success(`Found ${getFilteredSellers().filter(s => s.type === "seller").length} sellers nearby!`);
    }, 1000);
  };

  const handleSellerClick = (seller: Seller) => {
    setSelectedSeller(seller);
    onSellerSelect?.(seller);
  };

  const handleOrderNow = async () => {
    if (!selectedSeller || selectedSeller.type !== "seller") return;
    
    const qty = parseInt(quantity) || 1;
    for (let i = 0; i < qty; i++) {
      await addToCart({
        seller_id: selectedSeller.id,
        seller_name: selectedSeller.name,
        milk_type: selectedSeller.milkType || "Milk",
        price: selectedSeller.price || 50,
      });
    }
    
    toast.success(`Added ${quantity}L from ${selectedSeller.name} to cart!`);
  };

  const openGoogleMaps = () => {
    window.open("https://www.google.com/maps/place/Maharishi+Markandeshwar+(Deemed+to+be+University)/@30.2766099,76.9665631,17z", "_blank");
  };

  // Calculate position on visual map
  const getPosition = (lat: number, lng: number) => {
    const left = Math.min(Math.max(((lng - 76.955) / 0.03) * 100, 8), 92);
    const top = Math.min(Math.max(((30.285 - lat) / 0.03) * 100, 8), 85);
    return { left: `${left}%`, top: `${top}%` };
  };

  return (
    <div className="space-y-4">
      {/* Search Panel */}
      <div className="bg-card rounded-2xl p-5 shadow-lg border border-border animate-slide-up">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Find Milk Sellers - MM University, Mullana
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Milk Type</Label>
            <Select value={milkType} onValueChange={setMilkType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select milk type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Cow Milk">Cow Milk</SelectItem>
                <SelectItem value="Buffalo Milk">Buffalo Milk</SelectItem>
                <SelectItem value="A2 Milk">A2 Milk</SelectItem>
                <SelectItem value="Mixed Milk">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Quantity (Liters)</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1"
              min="1"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={getUserLocation}
              variant="outline"
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
            <Button 
              onClick={handleFindSellers}
              className="flex-1 gradient-hero hover:opacity-90"
              disabled={isSearching}
            >
              {isSearching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Find Best Sellers
            </Button>
          </div>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div 
        className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border animate-slide-up cursor-pointer group"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            MM University, Mullana - Live Map
          </h2>
          <Button variant="outline" size="sm" onClick={openGoogleMaps}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Maps
          </Button>
        </div>

        <div 
          className="w-full h-[300px] relative"
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
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Visual Seller Map */}
      <div 
        className="bg-card rounded-2xl p-4 shadow-lg border border-border animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <Milk className="h-5 w-5" />
          Nearby Sellers & Delivery Partners
        </h2>

        <div className="w-full h-[280px] rounded-xl overflow-hidden bg-gradient-to-br from-fresh-light via-accent/5 to-primary/5 relative border-2 border-primary/20">
          {/* Map grid lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-primary/30" style={{ top: `${20 * (i + 1)}%` }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-primary/30" style={{ left: `${20 * (i + 1)}%` }} />
            ))}
          </div>

          {/* Sellers and delivery markers */}
          {getFilteredSellers().map((seller, index) => (
            <div
              key={seller.id}
              className={`absolute cursor-pointer transition-all duration-300 hover:scale-125 hover:z-10 animate-slide-up ${
                selectedSeller?.id === seller.id ? "scale-125 z-10" : ""
              }`}
              style={{
                ...getPosition(seller.lat, seller.lng),
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => handleSellerClick(seller)}
            >
              <div className={`p-2.5 rounded-full shadow-lg transition-all ${
                seller.type === "seller" 
                  ? "bg-primary hover:shadow-primary/40" 
                  : "bg-delivery hover:shadow-delivery/40"
              } ${selectedSeller?.id === seller.id ? "ring-4 ring-offset-2 ring-primary/50" : ""}`}>
                {seller.type === "seller" ? (
                  <Milk className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bike className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap bg-card px-2 py-1 rounded-lg shadow-md border border-border">
                {seller.name}
              </span>
            </div>
          ))}
          
          {/* User marker */}
          <div
            className="absolute z-20 animate-slide-up"
            style={getPosition(userLocation.lat, userLocation.lng)}
          >
            <div className="p-2.5 rounded-full bg-fresh shadow-lg ring-4 ring-fresh/30 animate-pulse">
              <div className="h-3 w-3 bg-primary-foreground rounded-full" />
            </div>
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap bg-fresh text-primary-foreground px-2 py-1 rounded-lg shadow-md">
              You
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-fresh shadow" />
            <span className="text-muted-foreground font-medium">You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary shadow" />
            <span className="text-muted-foreground font-medium">Sellers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-delivery shadow" />
            <span className="text-muted-foreground font-medium">Delivery</span>
          </div>
        </div>
      </div>

      {/* Selected Seller Info */}
      {selectedSeller && selectedSeller.type === "seller" && (
        <div className="bg-card rounded-2xl p-4 shadow-lg border-2 border-primary animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{selectedSeller.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedSeller.milkType} • ₹{selectedSeller.price}/L
              </p>
            </div>
            <Button className="gradient-hero" onClick={handleOrderNow}>
              Add {quantity}L to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
