import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartItem {
  id: string;
  seller_id: number;
  seller_name: string;
  milk_type: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setItems([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    fetchCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = async (item: Omit<CartItem, "id" | "quantity">) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to add items to cart");
      setIsLoading(false);
      return;
    }

    // Check if item already exists
    const existing = items.find(i => i.seller_id === item.seller_id);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + 1);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      seller_id: item.seller_id,
      seller_name: item.seller_name,
      milk_type: item.milk_type,
      price: item.price,
      quantity: 1,
    });

    if (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } else {
      toast.success(`Added ${item.milk_type} to cart!`);
      await fetchCart();
    }
    setIsLoading(false);
  };

  const removeFromCart = async (id: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove item");
    } else {
      await fetchCart();
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update quantity");
    } else {
      await fetchCart();
    }
  };

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to clear cart");
    } else {
      setItems([]);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
