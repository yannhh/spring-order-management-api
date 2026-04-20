import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Shipped', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-800 border-red-200' },
  in_stock: { label: 'In Stock', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  low_stock: { label: 'Low Stock', className: 'bg-amber-100 text-amber-800 border-amber-200' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold border", config.className)}>
      {config.label}
    </Badge>
  );
}