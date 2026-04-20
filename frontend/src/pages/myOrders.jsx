import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import OrderCard from "@/components/orders/OrderCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Package } from "lucide-react";

import {
  fetchProducts,
  fetchOrders,
  cancelOrder,
  currentUser,
  updateOrder,
} from "../api/api";

export default function MyOrders() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    currentUser()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: () => fetchOrders,
    enabled: !!user?.email,
  });

  const cancelMutation = useMutation({
    mutationFn: (order) => updateOrder(order.id, { status: "cancelled" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast({ title: "Order cancelled" });
    },
  });

  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div>
      <PageHeader title="My Orders" subtitle="Track and manage your orders" />

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="bg-card border">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={setCancelTarget}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={() => setCancelTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order {cancelTarget?.order_number}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                cancelMutation.mutate(cancelTarget);
                setCancelTarget(null);
              }}
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
