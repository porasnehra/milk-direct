import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ShoppingCart, MapPin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const deliveryFee = 30;
  const savings = totalPrice * 0.2;
  const finalTotal = totalPrice - savings + deliveryFee;

  const handlePlaceOrder = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to place order");
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orders = items.map(item => ({
        user_id: user.id,
        seller_id: item.seller_id,
        seller_name: item.seller_name,
        milk_type: item.milk_type,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        status: "pending",
      }));

      const { error } = await supabase.from("orders").insert(orders);

      if (error) throw error;

      await clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (error: any) {
      toast.error("Failed to place order");
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const openGoogleMaps = () => {
    window.open("https://www.google.com/maps/place/Maharishi+Markandeshwar+(Deemed+to+be+University)/@30.2766099,76.9665631,17z", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <ShoppingCart className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>
      </div>

      <main className="px-4 py-6 max-w-4xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items from farmers to get started</p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{item.milk_type}</h3>
                      <p className="text-sm text-primary">from {item.seller_name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}L</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground line-through">₹{item.price * 1.2} per liter</p>
                      <p className="text-xl font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Direct-to-Consumer Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                    You're saving 20% by buying direct!
                  </p>
                  <p className="text-green-600 dark:text-green-500 text-xs mt-1">
                    No middleman markup. Support local farmers directly.
                  </p>
                </div>

                <Button
                  className="w-full mt-4 bg-primary hover:bg-primary/90 py-6 text-lg"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout"}
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-3">
                  Secure payment powered by blockchain verification
                </p>
              </div>

              {/* Delivery Location */}
              <div 
                className="bg-card rounded-2xl p-4 shadow-sm border border-border cursor-pointer hover:border-primary transition-colors"
                onClick={openGoogleMaps}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Delivery Location</p>
                      <p className="text-xs text-muted-foreground">MM University, Mullana</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Cart;
