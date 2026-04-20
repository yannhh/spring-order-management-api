import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RevenueByCustomer({ orders }) {
  const revenueMap = {};
  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      const name = order.customer_name || order.customer_email || 'Unknown';
      revenueMap[name] = (revenueMap[name] || 0) + (order.total_amount || 0);
    }
  });

  const data = Object.entries(revenueMap)
    .map(([name, revenue]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="font-heading text-lg">Revenue by Customer</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm text-center py-8">No revenue data yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Top Customers by Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" tickFormatter={v => `£${v}`} fontSize={12} />
            <YAxis type="category" dataKey="name" width={120} fontSize={12} />
            <Tooltip
              formatter={v => [`£${v.toFixed(2)}`, 'Revenue']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}