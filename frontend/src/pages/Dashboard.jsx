import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/admin/StatCard";
import RevenueByCustomer from "@/components/admin/RevenueByCustomer";
import OrderStatusChart from "@/components/admin/OrderStatusChart";
import { ShoppingCart, PoundSterling, Users, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { fetchOrders, fetchProducts } from "../api/api";

export default function Dashboard() {
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const isLoading = ordersLoading || productsLoading;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const uniqueCustomers = new Set(orders.map((o) => o.customer_email)).size;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your drop-shipping operations"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`£${totalRevenue.toFixed(2)}`}
            icon={PoundSterling}
            color="accent"
          />
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingCart}
            color="primary"
          />
          <StatCard
            title="Customers"
            value={uniqueCustomers}
            icon={Users}
            color="info"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={Package}
            color="success"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueByCustomer orders={orders} />
        <OrderStatusChart orders={orders} />
      </div>
    </div>
  );
}
