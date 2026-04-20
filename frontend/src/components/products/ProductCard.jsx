import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { motion } from 'framer-motion';

const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
  home_garden: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop',
  sports: 'https://images.unsplash.com/photo-1461896836934-bd45ba8b8fc9?w=400&h=300&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
  toys: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop',
  automotive: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  other: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
};

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = product.image_url || categoryImages[product.category] || categoryImages.other;
  const available = product.stock_status !== 'out_of_stock' && product.is_active !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-card">
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={product.stock_status || 'in_stock'} />
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            {product.category?.replace(/_/g, ' ') || 'General'}
          </p>
          <h3 className="font-heading font-bold text-foreground text-lg leading-tight mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="font-heading text-2xl font-bold text-primary">
              £{product.retail_price?.toFixed(2)}
            </p>
            <Button
              size="sm"
              disabled={!available}
              onClick={() => onAddToCart(product)}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {available ? 'Order' : 'Unavailable'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}