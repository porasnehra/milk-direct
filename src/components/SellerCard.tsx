import { MapPin, ThermometerSun, Shield, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Seller {
  id: number;
  name: string;
  distance: string;
  milkType: string;
  description: string;
  price: number;
  rating: number;
  tags: string[];
  verified: boolean;
  iotData: {
    temp: string;
    quality: string;
    updated: string;
  };
}

const sellers: Seller[] = [
  {
    id: 1,
    name: "Green Valley Farm",
    distance: "2.5 km",
    milkType: "Organic Whole Milk",
    description: "Fresh organic milk from grass-fed cows",
    price: 65,
    rating: 4.8,
    tags: ["Organic", "Non-GMO"],
    verified: true,
    iotData: { temp: "4°C", quality: "Excellent", updated: "2 mins ago" },
  },
  {
    id: 2,
    name: "Krishna Dairy",
    distance: "3.2 km",
    milkType: "Buffalo Milk",
    description: "Rich and creamy buffalo milk, high fat content",
    price: 70,
    rating: 4.6,
    tags: ["High Fat", "Fresh"],
    verified: true,
    iotData: { temp: "5°C", quality: "Good", updated: "5 mins ago" },
  },
  {
    id: 3,
    name: "Sundar A2 Farms",
    distance: "5.0 km",
    milkType: "A2 Desi Cow Milk",
    description: "Premium A2 milk from indigenous cow breeds",
    price: 85,
    rating: 4.9,
    tags: ["A2 Protein", "Desi Cow", "Premium"],
    verified: true,
    iotData: { temp: "3°C", quality: "Excellent", updated: "1 min ago" },
  },
];

interface SellerCardProps {
  seller: Seller;
  index: number;
}

const SellerCard = ({ seller, index }: SellerCardProps) => {
  return (
    <div
      className="bg-card rounded-2xl p-4 shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center text-2xl">
          🐄
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{seller.name}</h3>
            {seller.verified && (
              <Badge className="bg-fresh/10 text-fresh hover:bg-fresh/20 border-0">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{seller.distance} away</span>
            <span className="mx-1">•</span>
            <Star className="h-3.5 w-3.5 text-delivery fill-delivery" />
            <span>{seller.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-primary">₹{seller.price}</div>
          <div className="text-xs text-muted-foreground">/liter</div>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-semibold text-fresh">{seller.milkType}</h4>
        <p className="text-sm text-muted-foreground mt-1">{seller.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {seller.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* IoT Quality Data */}
      <div className="mt-4 bg-quality/5 rounded-xl p-3">
        <div className="flex items-center gap-2 text-quality font-medium text-sm mb-2">
          <ThermometerSun className="h-4 w-4" />
          Live IoT Quality Data
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Temp: </span>
            <span className="font-semibold text-quality">{seller.iotData.temp}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Quality: </span>
            <span className="font-semibold text-fresh">{seller.iotData.quality}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Updated: </span>
            <span className="font-medium text-xs">{seller.iotData.updated}</span>
          </div>
        </div>
      </div>

      <Button className="w-full mt-4 gradient-hero hover:opacity-90">
        Order from {seller.name.split(" ")[0]}
      </Button>
    </div>
  );
};

const SellerList = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 animate-slide-up">
        <span className="text-2xl">🏆</span>
        <h2 className="text-xl font-bold">Featured Farmers</h2>
      </div>
      
      {sellers.map((seller, index) => (
        <SellerCard key={seller.id} seller={seller} index={index} />
      ))}
    </div>
  );
};

export default SellerList;
