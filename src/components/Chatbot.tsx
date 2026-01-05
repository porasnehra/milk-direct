import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm DudhBot, your AI assistant. Ask me about milk prices, nearby sellers, or help placing orders. How can I help you today?",
  },
];

const quickReplies = [
  "What's the price of buffalo milk nearby?",
  "Show me organic milk sellers",
  "Help me place an order",
  "Which seller has best ratings?",
];

// Simulated AI responses based on keywords
const getAIResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes("price") && lowerMsg.includes("buffalo")) {
    return "Buffalo milk prices in your area range from ₹65-75 per liter. Green Valley Farm offers it at ₹70/L with excellent IoT quality ratings. Would you like me to show you more options?";
  }
  
  if (lowerMsg.includes("price") && (lowerMsg.includes("cow") || lowerMsg.includes("milk"))) {
    return "Cow milk prices vary from ₹52-65 per liter depending on the farm. Our AI predicts a slight increase next week due to seasonal demand. Order now to lock in current prices!";
  }
  
  if (lowerMsg.includes("organic")) {
    return "I found 3 organic milk sellers near you:\n• Green Valley Farm (2.5 km) - ₹65/L\n• Sundar A2 Farms (5 km) - ₹85/L\n• Pure Nature Dairy (7 km) - ₹72/L\n\nAll are blockchain-verified for authenticity! 🌿";
  }
  
  if (lowerMsg.includes("order") || lowerMsg.includes("buy")) {
    return "I can help you order! Please tell me:\n1. Which milk type (cow/buffalo/A2)?\n2. Quantity in liters?\n3. Preferred delivery time?\n\nOr tap on a seller card above to order directly!";
  }
  
  if (lowerMsg.includes("rating") || lowerMsg.includes("best")) {
    return "Based on customer reviews and IoT quality scores:\n🥇 Sundar A2 Farms - 4.9★ (Premium A2)\n🥈 Green Valley Farm - 4.8★ (Organic)\n🥉 Krishna Dairy - 4.6★ (Buffalo)\n\nAll maintain temperatures under 5°C for freshness!";
  }
  
  if (lowerMsg.includes("delivery")) {
    return "Delivery is available from all our partner farms! 🚴\n• Standard: Within 2 hours (Free for orders > 5L)\n• Express: Within 1 hour (+₹20)\n• Subscription: Daily delivery at fixed time\n\nOur AI optimizes routes to ensure milk stays fresh!";
  }
  
  return "I understand you're asking about: \"" + message.slice(0, 50) + "...\"\n\nI can help you with:\n• Finding nearby milk sellers\n• Price predictions using AI\n• Placing orders\n• Quality & freshness info\n\nWhat would you like to know more about?";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(messageText),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-50 gradient-hero p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all ${
          isOpen ? "" : "animate-pulse-glow"
        }`}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 z-50 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-slide-up"
          style={{ maxHeight: "70vh" }}
        >
          {/* Header */}
          <div className="gradient-hero p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-milk-white/20 p-2 rounded-xl">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground">DudhBot</h3>
                <p className="text-xs text-primary-foreground/80">AI Assistant • Powered by Dialogflow</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-milk-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 animate-slide-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center animate-slide-up">
                <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {quickReplies.slice(0, 2).map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full whitespace-nowrap hover:bg-primary/20 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about milk prices..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={() => handleSend()} size="icon" className="gradient-hero">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
