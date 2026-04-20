import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';
import { XCircle, MapPin, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderCard({ order, onCancel }) {
  const canCancel = order.status === 'pending';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  {order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy, HH:mm') : '—'}
                </p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="space-y-2 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-medium">£{item.line_total?.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{order.shipping_address || 'No address'}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <p className="font-heading text-xl font-bold text-foreground">£{order.total_amount?.toFixed(2)}</p>
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => onCancel(order)}
              >
                <XCircle className="w-4 h-4" /> Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}