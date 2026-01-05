import Header from "@/components/Header";
import GoogleMap from "@/components/GoogleMap";
import PricePredictor from "@/components/PricePredictor";
import SellerList from "@/components/SellerCard";
import AIRecommendations from "@/components/AIRecommendations";
import Chatbot from "@/components/Chatbot";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="px-4 -mt-4 space-y-6 max-w-4xl mx-auto">
        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Search Bar */}
        <div className="relative animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search farmers or milk types..."
            className="pl-12 py-6 rounded-xl shadow-md border-0 bg-card"
          />
        </div>

        {/* Google Maps Section */}
        <GoogleMap />

        {/* Price Predictor */}
        <PricePredictor />

        {/* Seller Cards */}
        <SellerList />

        {/* Features Section */}
        <div className="space-y-4 pb-6">
          <FeatureCard
            emoji="🤖"
            title="AI Features Active"
            color="from-primary to-purple-500"
            items={[
              "Smart demand prediction enabled",
              "Route optimization saving 30% delivery time",
              "Personalized farmer recommendations",
            ]}
            delay={0}
          />
          
          <FeatureCard
            emoji="🔗"
            title="Blockchain Security"
            color="from-pink-500 to-rose-500"
            items={[
              "All transactions secured with smart contracts",
              "Complete supply chain transparency",
              "Guaranteed authentic, pure milk",
            ]}
            delay={0.1}
          />
          
          <FeatureCard
            emoji="📡"
            title="IoT Quality Monitoring"
            color="from-cyan-500 to-blue-500"
            items={[
              "Real-time milk quality sensors",
              "Cold chain temperature monitoring",
              "Instant quality alerts and notifications",
            ]}
            delay={0.2}
          />
        </div>
      </main>

      <Chatbot />
      <BottomNav />
    </div>
  );
};

interface FeatureCardProps {
  emoji: string;
  title: string;
  color: string;
  items: string[];
  delay: number;
}

const FeatureCard = ({ emoji, title, color, items, delay }: FeatureCardProps) => (
  <div
    className={`bg-gradient-to-r ${color} rounded-2xl p-5 text-primary-foreground shadow-lg animate-slide-up`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{emoji}</span>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm opacity-95 flex items-start gap-2">
          <span className="mt-1">•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Index;
