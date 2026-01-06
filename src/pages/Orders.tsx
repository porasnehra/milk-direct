import { useEffect, useState } from "react";
import { Package, CheckCircle, Truck, Clock, MapPin, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Order {
  id: string;
  seller_name: string;
  milk_type: string;
  price: number;
  quantity: number;
  total: number;
  status: string;
  created_at: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
          label: "Delivered"
        };
      case "picked_up":
      case "picked up":
        return {
          icon: Truck,
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
          label: "Picked Up"
        };
      case "pending":
      default:
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
          label: "Pending"
        };
    }
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
          <Package className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Your Orders</h1>
        </div>
      </div>

      <main className="px-4 py-6 max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              Browse Sellers
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{order.milk_type}</h3>
                      <p className="text-sm text-primary">from {order.seller_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ordered on {format(new Date(order.created_at), "M/d/yyyy")}
                      </p>
                    </div>
                    <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Quantity: <span className="font-medium text-foreground">{order.quantity}L</span>
                    </p>
                    <p className="text-xl font-bold text-primary">₹{order.total}</p>
                  </div>

                  {order.status === "picked_up" && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        🚚 Your order is on the way! Estimated delivery: 15 minutes
                      </p>
                    </div>
                  )}

                  {/* Track on Map */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={openGoogleMaps}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Track on Map
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
