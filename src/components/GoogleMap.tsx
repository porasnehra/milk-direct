import { useState } from "react";
import { MapPin, Milk, Bike, Navigation, Loader2 } from "lucide-react";
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

// Mock seller data
const mockSellers = [
  { id: 1, name: "Krishna Dairy", lat: 28.81, lng: 77.21, type: "seller" as const, milkType: "Buffalo", price: 60 },
  { id: 2, name: "Green Valley Farm", lat: 28.79, lng: 77.23, type: "seller" as const, milkType: "Cow", price: 55 },
  { id: 3, name: "Mother Dairy Outlet", lat: 28.805, lng: 77.215, type: "seller" as const, milkType: "Mixed", price: 52 },
  { id: 4, name: "Ramesh Dairy Farm", lat: 28.77, lng: 77.19, type: "seller" as const, milkType: "A2 Milk", price: 70 },
  { id: 5, name: "Amit", lat: 28.815, lng: 77.22, type: "delivery" as const },
  { id: 6, name: "Vijay", lat: 28.80, lng: 77.20, type: "delivery" as const },
];

type Seller = typeof mockSellers[0];

interface MapProps {
  onSellerSelect?: (seller: Seller) => void;
}

const GoogleMap = ({ onSellerSelect }: MapProps) => {
  const [userLocation, setUserLocation] = useState({ lat: 28.8, lng: 77.2 });
  const [milkType, setMilkType] = useState("all");
  const [quantity, setQuantity] = useState("2");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log("Location access denied")
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
    setTimeout(() => setIsSearching(false), 1000);
  };

  const handleSellerClick = (seller: Seller) => {
    setSelectedSeller(seller);
    onSellerSelect?.(seller);
  };

  // Calculate position on visual map
  const getPosition = (lat: number, lng: number) => {
    const left = Math.min(Math.max(((lng - 77.15) / 0.15) * 100, 8), 92);
    const top = Math.min(Math.max(((28.85 - lat) / 0.15) * 100, 8), 85);
    return { left: `${left}%`, top: `${top}%` };
  };

  return (
    <div className="space-y-4">
      {/* Search Panel */}
      <div className="bg-card rounded-2xl p-5 shadow-lg border border-border animate-slide-up">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Find Milk Sellers
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Latitude</Label>
              <Input
                type="number"
                value={userLocation.lat}
                onChange={(e) => setUserLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                className="mt-1"
                step="0.01"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Longitude</Label>
              <Input
                type="number"
                value={userLocation.lng}
                onChange={(e) => setUserLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                className="mt-1"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Milk Type</Label>
            <Select value={milkType} onValueChange={setMilkType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select milk type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Cow">Cow Milk</SelectItem>
                <SelectItem value="Buffalo">Buffalo Milk</SelectItem>
                <SelectItem value="A2 Milk">A2 Milk</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
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

      {/* Map Container - Interactive Visual Map */}
      <div 
        className="bg-card rounded-2xl p-4 shadow-lg border border-border animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Live Map View
        </h2>

        <div className="w-full h-[350px] rounded-xl overflow-hidden bg-gradient-to-br from-fresh-light via-accent/5 to-primary/5 relative border-2 border-primary/20">
          {/* Map grid lines for visual effect */}
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

          {/* Powered by Google Maps badge */}
          <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground flex items-center gap-1">
            <span>🗺️</span> Powered by Google Maps API
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-fresh shadow" />
            <span className="text-muted-foreground font-medium">You (Buyer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary shadow" />
            <span className="text-muted-foreground font-medium">Milk Sellers</span>
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
            <Button className="gradient-hero">
              Order Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
