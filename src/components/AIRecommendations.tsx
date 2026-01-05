import { Bot, Sparkles, TrendingUp, Bell } from "lucide-react";

const recommendations = [
  {
    icon: Sparkles,
    text: "Based on your orders, try Green Valley Farm's new A2 milk",
    type: "suggestion",
  },
  {
    icon: TrendingUp,
    text: "Peak demand predicted for weekend - order now for guaranteed delivery",
    type: "alert",
  },
  {
    icon: Bell,
    text: "Quality alert: All farmers showing excellent IoT readings today",
    type: "info",
  },
];

const AIRecommendations = () => {
  return (
    <div className="gradient-fresh rounded-2xl p-5 text-primary-foreground shadow-lg animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-milk-white/20 p-2 rounded-xl">
          <Bot className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold">AI Recommendations</h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 text-sm animate-slide-up"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <span className="opacity-80">•</span>
            <p className="opacity-95">{rec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
