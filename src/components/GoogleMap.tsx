import { useEffect, useRef, useState } from "react";
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
  { id: 1, name: "Krishna Dairy", lat: 28.81, lng: 77.21, type: "seller", milkType: "Buffalo", price: 60 },
  { id: 2, name: "Green Valley Farm", lat: 28.79, lng: 77.23, type: "seller", milkType: "Cow", price: 55 },
  { id: 3, name: "Mother Dairy Outlet", lat: 28.805, lng: 77.215, type: "seller", milkType: "Mixed", price: 52 },
  { id: 4, name: "Ramesh Dairy Farm", lat: 28.77, lng: 77.19, type: "seller", milkType: "A2 Milk", price: 70 },
  { id: 5, name: "Amit", lat: 28.815, lng: 77.22, type: "delivery", available: true },
  { id: 6, name: "Vijay", lat: 28.80, lng: 77.20, type: "delivery", available: true },
];

type Seller = typeof mockSellers[0];

interface MapProps {
  onSellerSelect?: (seller: Seller) => void;
}

const GoogleMap = ({ onSellerSelect }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 28.8, lng: 77.2 });
  const [isLoading, setIsLoading] = useState(true);
  const [milkType, setMilkType] = useState("all");
  const [quantity, setQuantity] = useState("2");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  // Load Google Maps Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCSaBM6romuz2ajektvYRNPNadVMFSXDhI&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initMap();
    };
    script.onerror = () => {
      console.log("Google Maps failed to load, using fallback");
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || typeof google === "undefined") {
      setIsLoading(false);
      return;
    }

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 14,
      styles: [
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e6c9" }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
    });

    // User marker
    new google.maps.Marker({
      position: userLocation,
      map: mapInstance,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#22c55e",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
      title: "You",
    });

    // Seller and delivery markers
    mockSellers.forEach(seller => {
      if (milkType !== "all" && seller.type === "seller" && seller.milkType !== milkType) {
        return;
      }

      const marker = new google.maps.Marker({
        position: { lat: seller.lat, lng: seller.lng },
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: seller.type === "seller" ? "#6366f1" : "#f97316",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: seller.name,
      });

      marker.addListener("click", () => {
        setSelectedSeller(seller);
        onSellerSelect?.(seller);
      });
    });

    setIsLoading(false);
  };

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
              onClick={() => setIsLoading(false)}
              className="flex-1 gradient-hero hover:opacity-90"
            >
              Find Best Sellers
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        className="bg-card rounded-2xl p-4 shadow-lg border border-border animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Live Map View
        </h2>

        <div 
          ref={mapRef}
          className="w-full h-[350px] rounded-xl overflow-hidden bg-fresh-light relative"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-fresh-light">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {/* Fallback map if Google Maps fails */}
          {!isLoading && !mapLoaded && (
            <div className="absolute inset-0 p-4">
              <div className="relative w-full h-full bg-gradient-to-br from-fresh-light to-accent/10 rounded-xl overflow-hidden">
                {getFilteredSellers().map((seller, index) => (
                  <div
                    key={seller.id}
                    className="absolute cursor-pointer animate-slide-up hover:scale-110 transition-transform"
                    style={{
                      left: `${Math.min(Math.max(((seller.lng - 77.15) / 0.15) * 100, 10), 90)}%`,
                      top: `${Math.min(Math.max(((28.85 - seller.lat) / 0.15) * 100, 10), 90)}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => {
                      setSelectedSeller(seller);
                      onSellerSelect?.(seller);
                    }}
                  >
                    <div className={`p-2 rounded-full shadow-lg ${
                      seller.type === "seller" ? "bg-primary" : "bg-delivery"
                    }`}>
                      {seller.type === "seller" ? (
                        <Milk className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bike className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-0.5 rounded shadow">
                      {seller.name}
                    </span>
                  </div>
                ))}
                
                {/* User marker */}
                <div
                  className="absolute animate-slide-up"
                  style={{
                    left: `${Math.min(Math.max(((userLocation.lng - 77.15) / 0.15) * 100, 10), 90)}%`,
                    top: `${Math.min(Math.max(((28.85 - userLocation.lat) / 0.15) * 100, 10), 90)}%`,
                  }}
                >
                  <div className="p-2 rounded-full bg-fresh shadow-lg ring-4 ring-fresh/30 animate-pulse">
                    <div className="h-3 w-3 bg-primary-foreground rounded-full" />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-0.5 rounded shadow">
                    You
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-fresh" />
            <span className="text-muted-foreground">You (Buyer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Milk Sellers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-delivery" />
            <span className="text-muted-foreground">Delivery</span>
          </div>
        </div>
      </div>

      {/* Selected Seller Info */}
      {selectedSeller && selectedSeller.type === "seller" && (
        <div className="bg-card rounded-2xl p-4 shadow-lg border-2 border-primary animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{selectedSeller.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedSeller.milkType} • ₹{selectedSeller.price}/L</p>
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
